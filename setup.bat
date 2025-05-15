@echo off
echo ================================
echo   Project Setup Starting...
echo ================================

:: Check if Node.js is installed
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b
)

:: Navigate to project directory (assuming the script is in the same folder)
cd /d %~dp0

:: Check if package.json exists
IF NOT EXIST package.json (
    echo ERROR: package.json not found! Are you sure you're in the right folder?
    pause
    exit /b
)

:: Install dependencies
echo Installing dependencies...
npm install

:: Success message
IF %ERRORLEVEL% EQU 0 (
    echo.
    echo Setup complete! You can now run the app.
    echo To start: npm start (or whatever command you use)
) ELSE (
    echo ERROR: npm install failed. Please check your internet connection or contact the developer.
)

pause
