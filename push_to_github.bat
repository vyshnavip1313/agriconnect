@echo off
set "GIT_DIR=%LOCALAPPDATA%\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe"
set "PATH=%GIT_DIR%\cmd;%GIT_DIR%\mingw64\bin;%PATH%"
echo Pushing AgriConnect to GitHub: https://github.com/vyshnavip1313/agriconnect.git ...
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo  SUCCESSFULLY PUSHED TO GITHUB!
    echo  Public Link: https://github.com/vyshnavip1313/agriconnect
    echo ========================================================
) else (
    echo Push encountered an issue. Please check the message above.
)
pause
