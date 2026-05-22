@echo off
echo Opening all setup guides...
echo.

start "" "START-HERE.txt"
timeout /t 1 /nobreak >nul

start "" "BACKEND-SETUP.md"
timeout /t 1 /nobreak >nul

echo.
echo ✓ Guides opened!
echo.
echo Next step: Double-click start-backend.bat
echo.
pause
