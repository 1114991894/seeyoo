# 自动推送脚本
# 使用方法：.\auto-push.ps1 -CommitMessage "你的提交说明"
# 如果不提供 -CommitMessage，则使用默认提交信息

param(
    [string]$CommitMessage = "auto: 自动提交"
)

$ErrorActionPreference = "Stop"
$repoDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoDir

Write-Host "=== 当前目录 ===" -ForegroundColor Cyan
Write-Host (Get-Location) -ForegroundColor Yellow
Write-Host ""

# 1. 检查是否有未跟踪的新文件需要纳入 git
$untracked = git status --porcelain
if ($untracked) {
    Write-Host "[1/4] 检测到变更，开始 add..." -ForegroundColor Cyan
    git add .
} else {
    Write-Host "[1/4] 没有需要 add 的文件" -ForegroundColor Gray
}

# 2. 检查暂存区是否有内容
$staged = git diff --cached --name-only
if (-not $staged) {
    Write-Host "没有需要提交的变更，跳过 commit 和 push" -ForegroundColor Yellow
    exit 0
}

# 3. 提交
Write-Host "[2/4] 正在 commit..." -ForegroundColor Cyan
$commitResult = git -c user.name=baiji -c user.email=baiji@local commit -m $CommitMessage 2>&1
Write-Host $commitResult

# 4. 推送到 main 分支
Write-Host "[3/4] 正在 push 到 main..." -ForegroundColor Cyan
$remoteUrl = "https://github.com/1114991894/seeyoo.git"
try {
    # 先尝试普通推送
    $pushResult = git push $remoteUrl main 2>&1
    Write-Host $pushResult
    if ($LASTEXITCODE -ne 0) {
        Write-Host "普通推送失败，尝试 rebase 后再推..." -ForegroundColor Yellow
        git pull $remoteUrl main --rebase --allow-unrelated-histories 2>&1 | Out-Null
        $pushResult = git push $remoteUrl main 2>&1
        Write-Host $pushResult
    }
} catch {
    Write-Host "推送出错: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[4/4] ✅ 推送完成！" -ForegroundColor Green
Write-Host "查看: https://github.com/1114991894/seeyoo" -ForegroundColor Cyan
