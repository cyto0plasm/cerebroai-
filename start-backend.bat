@echo off
echo ========================================
echo  CerebroAI Backend — http://localhost:8000
echo  Press Ctrl+C to stop
echo ========================================
echo.

copy /Y "%~dp0backend\app.py" "D:\Programming\AI\MRI\MRI\app.py"
echo [OK] app.py updated

cd /d "D:\Programming\AI\MRI\MRI"
call "D:\Programming\AI\MRI\.venv\Scripts\activate.bat"
python -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload

pause
