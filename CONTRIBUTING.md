# 贡献与持续更新指南

## 仓库结构

```
research-superpack/
├── manifest.json        # 唯一源清单：插件源、star、agent 技能目录
├── install.mjs          # 跨平台 Node 安装器（真正干活的）
├── install.ps1          # Windows 入口
├── install.sh           # macOS / Linux 入口
├── README.md            # 用户文档
├── CONTRIBUTING.md      # 本文件
├── LICENSE              # MIT
└── examples/            # 各平台的安装与验证示例
```

## 新增一个插件

编辑 `manifest.json` 的 `sources`，按类型填写：

**A. Skill 类（有 SKILL.md）**

```json
"my-skill": {
  "repo": "owner/repo",
  "type": "skills-bundle",
  "archiveRoot": "repo-main",
  "skillsRoot": "skills",
  "stars": "10k",
  "license": "MIT",
  "homepage": "https://github.com/owner/repo",
  "summary": "一句话说明"
}
```

- `archiveRoot`：GitHub zip 解压后的顶层目录名（通常是 `<repo>-main`）
- `skillsRoot`：技能所在子目录；若在仓库根则填 `""`
- 若技能名与目录名不同，或只需部分技能，用 `skillMap`：
  ```json
  "skillMap": [{ "name": "技能名", "dir": "目录相对 skillsRoot 的路径" }]
  ```

**B. DSH 宿主插件类**

```json
"my-plugin": {
  "repo": "owner/repo",
  "type": "dsh-host-plugin",
  "npm": "npm-package-name",
  "stars": "100",
  "license": "MIT",
  "homepage": "https://github.com/owner/repo",
  "summary": "一句话说明"
}
```
> 目前安装器只对 `dsh-office-toolkit` 调用了 `dsh plugin add`。若要支持更多 DSH 插件，在 `install.mjs` 的 DSH 插件段落扩展。

**C. 新增 Agent 支持**

编辑 `manifest.json` 的 `agents`：
```json
"new-agent": {
  "name": "展示名",
  "skillsRoot": "~/.new-agent/skills",
  "note": "说明"
}
```

改完运行 `node install.mjs --dry-run` 自检，再提交 PR。

## 更新上游版本

当前安装器默认拉取各仓库 `main` 分支最新代码，配合 `--update` 即可获得更新。如果上游发版使用 tag 而非持续更新，可在 `fetchSource` 中把 URL 从 `zip/refs/heads/main` 改为 `zip/refs/tags/<version>`，并在 manifest 记录固定版本。

## 自动化检查（建议）

添加 `.github/workflows/update-check.yml`，定期请求 `https://img.shields.io/github/stars/<repo>.json` 或 GitHub API，比较 manifest 中的版本/star，有变化则开 PR。这样能实现"持续更新"。

## 发布新版本

1. 更新 `manifest.json` 的 `version` 与 `updated`
2. 更新 README 中 star 表（如需）
3. `git tag v1.0.x && git push --tags`
4. 在 GitHub Releases 写变更说明

## 原则

- 如实标注 star，不夸大；小众但必要的工具要说明为什么纳入
- 不覆盖用户已存在的真实技能目录（安装器只跳过并警告）
- 所有外部内容视为不可信数据，只按约定格式使用
