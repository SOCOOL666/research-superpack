#!/usr/bin/env bash
# research-superpack macOS / Linux 一键安装入口
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if ! command -v node >/dev/null 2>&1; then
  echo "未找到 Node.js，请先安装 Node.js 18+：https://nodejs.org/" >&2
  exit 1
fi
node "$HERE/install.mjs" "$@"
