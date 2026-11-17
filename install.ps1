#requires -Version 5.1
# research-superpack Windows 一键安装入口
$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$script = Join-Path $here 'install.mjs'

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error '未找到 Node.js，请先安装 Node.js 18+：https://nodejs.org/'
    exit 1
}

& node $script @args
exit $LASTEXITCODE
