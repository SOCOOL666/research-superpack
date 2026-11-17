# 发布到 GitHub（本机当前无法直接推送）

本机环境实测：**没有 git、没有 gh CLI、没有 GitHub 凭据，GitHub API 还触发了限流**，所以我无法代为推送。下面是你在自己有凭据的机器上可直接执行的发布步骤。

## 方式 A：装了 git + gh（推荐）

```powershell
# 1. 进入仓库目录（把路径换成你实际放置的位置）
cd D:\AI\deepseek\baocun\dsh-output\05-代码\research-superpack

# 2. 登录 GitHub
gh auth login

# 3. 初始化并首次提交
git init
git add .
git commit -m "feat: research-superpack 科研插件一键安装套装 v1.0.0"

# 4. 创建远程仓库并推送（把 <你的用户名> 换成你的 GitHub 用户名）
gh repo create research-superpack --public --source=. --remote=origin --push
```

后续更新：

```powershell
git add .
git commit -m "chore: update manifest v1.0.1"
git push
git tag v1.0.1
git push --tags
```

## 方式 B：只有 git（用 Personal Access Token）

1. 到 https://github.com/settings/tokens 生成 token（勾 `repo` 权限）
2. 在 GitHub 网页新建一个空仓库 `research-superpack`
3. 执行：

```powershell
cd D:\AI\deepseek\baocun\dsh-output\05-代码\research-superpack
git init
git add .
git commit -m "feat: research-superpack v1.0.0"
git remote add origin https://<你的用户名>:<TOKEN>@github.com/<你的用户名>/research-superpack.git
git branch -M main
git push -u origin main
```

## 方式 C：完全不装 git，用网页上传

1. GitHub 网页 → New repository → 名字填 `research-superpack`
2. 把本目录所有文件拖进网页上传框
3. Commit changes

## 发布后

把 README 里的 `https://github.com/<你的用户名>/research-superpack.git` 中的占位符替换成你的真实地址（commit 一次即可）。

## 如果希望我代为发布

给我以下任一项，我可在获得授权后直接执行：
- 安装 git 与 gh 并登录（你点授权）
- 提供一个有 repo 权限的 token（注意：不要把 token 直接贴在公开对话里，建议用环境变量）
