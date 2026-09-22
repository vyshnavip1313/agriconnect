@echo off
set "GIT=git"
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    set "GIT=%LOCALAPPDATA%\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd\git.exe"
)
"%GIT%" config --global user.name "vyshnavip1313"
"%GIT%" config --global user.email "vyshnavip1313@users.noreply.github.com"
"%GIT%" init
"%GIT%" add .
"%GIT%" commit -m "Initial commit: AgriConnect AI Agriculture Marketplace"
"%GIT%" branch -M main
"%GIT%" remote remove origin 2>nul
"%GIT%" remote add origin https://github.com/vyshnavip1313/agriconnect.git
echo --- Git Status ---
"%GIT%" status
"%GIT%" remote -v
