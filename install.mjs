#!/usr/bin/env node
/**
 * research-superpack 一键安装器（跨平台，仅需 Node.js 18+）
 *
 * 用法：
 *   node install.mjs                          # 默认安装到 DeepSeek Harness
 *   node install.mjs --agent codex,claude-code,workbuddy
 *   node install.mjs --agent all
 *   node install.mjs --update                 # 更新：重新下载上游并刷新链接
 *   node install.mjs --skip-plugin            # 不装 DSH 宿主插件
 *   node install.mjs --dry-run                # 只打印将要做的事
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import https from 'node:https';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
const HOME = os.homedir();
const CACHE = path.join(HOME, '.research-superpack', 'sources');

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const val = (f, d) => { const i = argv.indexOf(f); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d; };

const DRY = has('--dry-run');
const UPDATE = has('--update') || has('--upgrade');
const SKIP_PLUGIN = has('--skip-plugin');
const agentsArg = val('--agent', val('-a', 'dsh'));
const AGENTS = agentsArg === 'all'
  ? Object.keys(MANIFEST.agents)
  : agentsArg.split(',').map((s) => s.trim()).filter(Boolean);

const FORCE = has('--force');
const log = (...a) => console.log(...a);
const warn = (...a) => console.log('[warn]', ...a);
const expand = (p) => p.startsWith('~') ? path.join(HOME, p.slice(1)) : p;

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const req = https.get(url, { headers: { 'User-Agent': 'research-superpack-installer' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        file.close(() => { try { fs.unlinkSync(dest); } catch (_) {} });
        return download(res.headers.location, dest).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        file.close(() => { try { fs.unlinkSync(dest); } catch (_) {} reject(new Error('HTTP ' + res.statusCode)); });
        return;
      }
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve(dest)));
    });
    req.on('error', (e) => { try { fs.unlinkSync(dest); } catch (_) {} reject(e); });
    req.setTimeout(180000, function () { this.destroy(new Error('timeout')); });
  });
}

async function fetchSource(key, s) {
  const rootDir = path.join(CACHE, s.archiveRoot || `${key}-main`);
  const checkDir = path.join(rootDir, s.skillsRoot || '');
  if (DRY) {
    log(`  [预览] 源路径 ${rootDir}`);
    return rootDir;
  }
  if (fs.existsSync(checkDir) && !UPDATE) return rootDir;
  if (UPDATE && fs.existsSync(rootDir)) fs.rmSync(rootDir, { recursive: true, force: true });
  fs.mkdirSync(CACHE, { recursive: true });
  const zip = path.join(CACHE, `${key}.zip`);
  log(`  下载 ${s.repo} ...`);
  await download(`https://codeload.github.com/${s.repo}/zip/refs/heads/main`, zip);
  execFileSync('tar', ['-xf', zip, '-C', CACHE], { stdio: 'ignore' });
  fs.rmSync(zip, { force: true });
  return rootDir;
}

function collectSkills(key, s, rootDir) {
  const base = path.join(rootDir, s.skillsRoot || '');
  if (s.skillMap) {
    return s.skillMap.map((m) => ({ name: m.name, src: path.resolve(base, m.dir) }));
  }
  if (!fs.existsSync(base)) return [];
  return fs.readdirSync(base, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(base, d.name, 'SKILL.md')))
    .map((d) => ({ name: d.name, src: path.join(base, d.name) }));
}

function isSymlink(p) {
  try { return fs.lstatSync(p).isSymbolicLink(); } catch (_) { return false; }
}

function linkSkill(targetRoot, skill) {
  const dest = path.join(targetRoot, skill.name);
  if (fs.existsSync(dest) || isSymlink(dest)) {
    if (!isSymlink(dest)) {
      if (!FORCE) {
        warn(`跳过 ${dest}：已存在真实目录（未覆盖；加 --force 可备份后替换）`);
        return false;
      }
      const backup = dest + '.bak-' + Date.now();
      if (!DRY) fs.renameSync(dest, backup);
      log(`  备份 ${dest} → ${backup}`);
    } else {
      fs.rmSync(dest, { recursive: true, force: true });
    }
  }
  fs.mkdirSync(targetRoot, { recursive: true });
  if (!DRY) fs.symlinkSync(skill.src, dest, process.platform === 'win32' ? 'junction' : 'dir');
  return true;
}

(async () => {
  log(`research-superpack v${MANIFEST.version} — 科研插件一键安装`);
  log(`目标 agent: ${AGENTS.join(', ')}${UPDATE ? ' [更新模式]' : ''}${DRY ? ' [dry-run]' : ''}\n`);

  const skillSources = Object.entries(MANIFEST.sources).filter(([, s]) => s.type === 'skills-bundle');
  const bundles = {};
  for (const [key, s] of skillSources) {
    log(`[源] ${key} (${s.stars} star) — ${s.summary.slice(0, 40)}...`);
    const rootDir = await fetchSource(key, s);
    bundles[key] = collectSkills(key, s, rootDir);
    log(`      识别 ${bundles[key].length} 个技能`);
  }

  let installed = 0;
  for (const agent of AGENTS) {
    const cfg = MANIFEST.agents[agent];
    if (!cfg) { warn(`未知 agent: ${agent}（跳过）`); continue; }
    const targetRoot = expand(cfg.skillsRoot);
    log(`\n[安装] ${cfg.name} → ${targetRoot}`);
    for (const [key, skills] of Object.entries(bundles)) {
      for (const skill of skills) {
        if (linkSkill(targetRoot, skill)) installed++;
        log(`  + ${skill.name}  ← ${key}`);
      }
    }
  }

  if (!SKIP_PLUGIN && AGENTS.includes('dsh')) {
    log(`\n[DSH 宿主插件] dsh-office-toolkit (8 个 Word/Excel 工具)`);
    if (DRY) {
      log('  将执行: dsh plugin add dsh-office-toolkit');
    } else {
      const r = spawnSync('dsh', ['plugin', 'add', 'dsh-office-toolkit'], { stdio: 'inherit' });
      if (r.error) warn('未找到 dsh 命令；请手动执行: dsh plugin add dsh-office-toolkit');
      else log('  完成。重启 Harness 并新建会话后工具生效。');
    }
  }

  log(`\n完成：${DRY ? '（dry-run，未实际写入）' : `部署 ${installed} 个技能链接`}`);
  log('提示：技能通过符号链接指向缓存源，更新用 --update，卸载删除对应链接即可。');
})().catch((e) => { console.error('安装失败:', e.message); process.exitCode = 1; });
