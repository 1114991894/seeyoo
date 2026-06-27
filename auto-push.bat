@echo off
chcp 65001 >nul
setlocal

set "MSG=%~1"
if "%MSG%"=="" set "MSG=auto: 自动提交"

cd /d "%~dp0"

echo === 当前目录 ===
cd
echo.

echo [1/4] 检测变更...
git status --porcelain >nul
if errorlevel 1 (
    echo Git 状态检查失败
    exit /b 1
)

git add .
if errorlevel 1 (
    echo git add 失败
    exit /b 1
)

git diff --cached --name-only >nul
if errorlevel 1 (
    echo 没有需要提交的变更
    exit /b 0
)

echo [2/4] 正在 commit...
git -c user.name=baiji -c user.email=baiji@local commit -m "%MSG%"
if errorlevel 1 (
    echo commit 失败
    exit /b 1
)

echo [3/4] 正在 push...
git push https://github.com/1114991894/seeyoo.git main
if errorlevel 1 (
    echo 普通 push 失败，尝试 rebase 后再推...
    git pull https://github.com/1114991894/seeyoo.git main --rebase --allow-unrelated-histories
    if errorlevel 1 (
        echo rebase 失败
        exit /b 1
    )
    git push https://github.com/1114991894/seeyoo.git main
    if errorlevel 1 (
        echo 推送失败
        exit /b 1
    )
)

echo.
echo [4/4] ✅ 推送完成！
echo 查看: https://github.com/1114991894/seeyoo

endlocal
