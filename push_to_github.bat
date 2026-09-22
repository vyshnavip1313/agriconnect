@echo off
set "GIT=git"
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    set "GIT=%LOCALAPPDATA%\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd\git.exe"
)
echo Pushing AgriConnect to GitHub: https://github.com/vyshnavip1313/agriconnect.git ...
"%GIT%" push -u origin main
pause
