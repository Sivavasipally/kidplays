@echo off
REM ===================================================================
REM  KidPlays Studio - one-click local launcher for Windows
REM  Starts the Flask backend and the Vite frontend in two windows.
REM ===================================================================
setlocal

echo.
echo  ====================================================
echo    KidPlays Studio - starting up...
echo  ====================================================
echo.

REM ---- Backend ----
echo [1/2] Preparing backend (Flask + SQLite)...
cd /d "%~dp0backend"
if not exist "venv" (
    echo       Creating Python virtual environment...
    python -m venv venv
)
call venv\Scripts\activate
echo       Installing backend dependencies...
pip install -q -r requirements.txt
start "KidPlays Backend" cmd /k "call venv\Scripts\activate && python app.py"

REM ---- Frontend ----
cd /d "%~dp0frontend"
echo [2/2] Preparing frontend (React + Vite)...
if not exist "node_modules" (
    echo       Installing frontend dependencies (first run, please wait)...
    call npm install
)
start "KidPlays Frontend" cmd /k "npm run dev"

echo.
echo  ====================================================
echo    KidPlays Studio is launching!
echo    Open your browser at:  http://localhost:3000
echo  ====================================================
echo.
endlocal
