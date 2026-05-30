@echo off
REM ===================================================================
REM  KidPlays Studio - one-click local launcher for Windows
REM  Fully static, no backend. Projects are saved in your browser.
REM ===================================================================
setlocal

echo.
echo  ====================================================
echo    KidPlays Studio - starting up...
echo  ====================================================
echo.

cd /d "%~dp0frontend"

if not exist "node_modules" goto install
goto run

:install
echo  Installing dependencies. The first run may take a minute...
call npm install
echo.

:run
echo  ====================================================
echo    Opening KidPlays Studio at http://localhost:3000
echo  ====================================================
echo.
call npm run dev

endlocal
