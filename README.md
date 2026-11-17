# research-superpack · 科研工作必备插件一键安装套装

> 一个仓库装齐全套科研能力：**Nature 论文写作 / 去 AI 味 / AI 做 PPT / Word·Excel 读写**。
> 一次安装，适配 the agent runtime、Codex、Claude Code、WorkBuddy、Gemini CLI、OpenCode、Cursor、Cline 等主流 Agent。

[![license](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)
[![platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue)]()

---

## 关于 star 数据的说明（请先读）

你要求"安装的都是 GitHub 星最高、使用人数最多的插件"。这里必须如实说明：**并非全部都是**。

| 插件 | GitHub star | 说明 |
|---|---:|---|
| [hugohe3/ppt-master](https://github.com/hugohe3/ppt-master) | **78k** | PPT 领域头部项目，确实是最高之列 |
| [blader/humanizer](https://github.com/blader/humanizer) | **70k** | 去 AI 味领域头部，star 最高 |
| [Yuan1z0825/nature-skills](https://github.com/Yuan1z0825/nature-skills) | **54k** | Nature 论文写作 Skill 头部项目 |
| [cnkids/dsh-office-toolkit](https://github.com/cnkids/dsh-office-toolkit) | **3** | ⚠️ star 很少。它是 DSH 生态的小众宿主插件，之所以纳入，是因为它补齐了 Word/Excel 读写工具这一刚需，而非 star 高 |

前三个是各自领域 star 与使用量最高的项目；第四个是无可替代的专用工具。star 数据采集于 2026-11-17（来源 shields.io），仅供参考，**star 不等于质量背书**。如果 DSH 官方 `@deepseek-ai/dsh-office-kit` 升级到覆盖同等能力，可随时移除本套装中的 dsh-office-toolkit。

---

## 包含什么

### 1. Nature 论文写作 Skill 库（24 个技能目录：23 个独立技能 + 1 个共享包）— 54k star

`Yuan1z0825/nature-skills`，面向 Nature/CNS 等高影响力期刊：

- `nature-figure` 投稿级科研绘图（Python/R，多面板、碰撞审计、示意图）
- `nature-polishing` 把学术文本润色/翻译为 Nature 风格英文
- `nature-writing` 起草手稿章节、重建论文论证
- `nature-reviewer` 模拟 Nature 审稿，输出互盲 reviewer reports
- `nature-response` 逐点回复审稿意见 + cover letter + 标红稿
- `nature-reader` / `nature-paper-xray` / `nature-paper-card` / `nature-paper-trans` 论文精读、中英对照、逐页翻译
- `nature-paper2ppt` / `nature-paper2word` / `nature-image2ppt` 论文转 PPT/Word、图片转可编辑 PPT
- `nature-citation` / `nature-ref-verifier` / `nature-academic-search` / `nature-downloader` / `nature-literature-pipeline` 文献检索与引用核验
- `nature-statistics` / `nature-data` / `nature-experiment-log` / `nature-social-science` / `nature-paper-to-patent` / `nature-proposal-writer`(researchwrite) / `nature-shared`(共享包)

### 2. Humanizer 去 AI 味 — 70k star

`blader/humanizer`：基于维基百科《Signs of AI writing》，识别并改写 26 种 AI 写作痕迹（"not X but Y"、空洞总结、故作深刻的格言等）。盲测 16/16 被判定优于原 AI 文本。**注意：面向人类读者优化，不保证绕过 AI 检测器。**

### 3. PPT Master AI 做 PPT — 78k star

`hugohe3/ppt-master`：AI 驱动的 PPT 工作流，生成可编辑 PPTX、美化、图片转 PPT、模板填充、旁白动画。触发："做一个 PPT""美化这个 PPT"等。

### 4. DSH Office Toolkit Word/Excel 工具 — 3 star（专用）

`cnkids/dsh-office-toolkit`：DSH 宿主插件，注册 8 个工具：`office_read`、`office_query`、`office_write_docx`、`office_edit_docx`、`office_write_xlsx`、`office_edit_xlsx`、`office_fill_docx_template`、`office_convert`。纯 JS，不装 Office 也能读写；支持模板套打、公文排版、多级编号、大表内计算。

---

## 一键安装

### 前置

- **Node.js 18+**（[nodejs.org](https://nodejs.org/)）—— 唯一的硬性依赖
- 安装 DSH 宿主插件时，还需 DSH 命令 `dsh` 可用

### 最快方式（git clone 后运行）

```bash
git clone https://github.com/<你的用户名>/research-superpack.git
cd research-superpack

# Windows PowerShell
.\install.ps1

# macOS / Linux
bash install.sh
```

默认安装到 **DeepSeek Harness**（`~/.dsh/skills`）。

### 选择目标 Agent

用 `--agent`（或 `-a`），多个用英文逗号分隔：

```bash
# PowerShell
.\install.ps1 --agent codex,claude-code,workbuddy

# 所有支持的 agent
.\install.ps1 --agent all

# macOS / Linux
bash install.sh -a codex,claude-code,workbuddy
```

支持的 `--agent` 值与技能目录：

| Agent | `--agent` | 技能目录 |
|---|---|---|
| DeepSeek Harness | `dsh` | `~/.dsh/skills` |
| OpenAI Codex | `codex` | `~/.codex/skills` |
| Claude Code | `claude-code` | `~/.claude/skills` |
| WorkBuddy | `workbuddy` | `~/.workbuddy/skills`（Windows: `%USERPROFILE%\.workbuddy\skills`） |
| Gemini CLI | `gemini-cli` | `~/.gemini/skills` |
| OpenCode | `opencode` | `~/.config/opencode/skills` |
| Cursor | `cursor` | `~/.cursor/skills` |
| Cline | `cline` | `~/.cline/skills` |

> 也可换用官方 `skills` CLI：`npx skills add Yuan1z0825/nature-skills --all`、`npx skills add blader/humanizer --all`、`npx skills add hugohe3/ppt-master --all`。本套装的价值是把三者与 DSH Office 插件统一版本、统一更新。

### 更新

上游有新版本时：

```bash
.\install.ps1 --update --agent all
```

会重新下载上游仓库并刷新所有符号链接。

### 只预览、不安装

```bash
.\install.ps1 --dry-run
```

### 跳过 DSH 宿主插件

```bash
.\install.ps1 --skip-plugin
```

### 覆盖已存在的技能目录

默认遇到目标 agent 里**已存在的真实技能目录**会跳过并警告（避免误删你的文件）。确认要用本套装版本替换时加 `--force`（会先把旧目录重命名为 `.bak-<时间戳>`）：

```bash
.\install.ps1 --force --agent workbuddy
```

---

## 安装原理

三套 Skill 仓库的 `SKILL.md` 结构不同（有的在根目录、有的在 `skills/` 下），本安装器：

1. 按 `manifest.json` 从 GitHub 下载各仓库 zip 到 `~/.research-superpack/sources/` 缓存；
2. 自动识别每个技能目录（含标准的 `name` + `description` frontmatter）；
3. 在目标 agent 的技能根目录创建**符号链接**（Windows 为目录 junction），指向缓存中的技能目录；
4. 符号链接保留 `references/`、`scripts/`、`assets/` 等资源的相对路径，保证技能正常工作；
5. DSH 宿主插件通过 `dsh plugin add dsh-office-toolkit` 安装，重启后生效。

**不要删除 `~/.research-superpack/sources/`**，符号链接依赖它。

---

## 验证安装

装完重启对应 Agent 并新建会话，然后随便说一句：

- "把这段中文改写成 Nature 风格英文" → `nature-polishing`
- "把这篇论文做成组会 PPT" → `nature-paper2ppt`
- "做一个关于 AI 的 PPT" → `ppt-master`
- "去掉这段文字的 AI 味" → `humanizer`
- "读一下这个 Word 文档" → DSH 的 `office_read`

---

## 持续更新与扩展

- `manifest.json` 是唯一的源清单：**新增插件**只需在其中加一条 `sources` 项，安装器自动识别；
- 每个源用 `archiveRoot` + `skillsRoot` + `skillMap` 描述仓库解压后的技能位置，兼容不同布局；
- 更新版本号：改 `manifest.json` 的 `version` 和 `updated`；
- 建议用 GitHub Actions 定时检查上游 release（后续可加 `update-check.yml`），发现新版本自动开 PR 更新 manifest 的引用版本。

详见 [CONTRIBUTING.md](CONTRIBUTING.md)。

---

## 卸载

删除各 agent 技能目录下对应名称的符号链接即可；DSH 插件用 `dsh plugin remove dsh-office-toolkit`。缓存目录 `~/.research-superpack/` 可整个删除（删除后符号链接失效）。

---

## 许可证

本套装本身 MIT。各组件沿用各自许可证：nature-skills (Apache-2.0)、humanizer / ppt-master / dsh-office-toolkit (MIT)。
