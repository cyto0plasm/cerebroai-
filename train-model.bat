@echo off
echo ========================================
echo  CerebroAI — Train ResNet18 Model
echo ========================================
echo.
echo This will:
echo   1. Load your MRI dataset
echo   2. Fine-tune a pretrained ResNet18
echo   3. Save weights to mri_model.pth
echo   4. Print accuracy, recall, F1, AUC
echo.
echo Expected time: 5-15 minutes on CPU
echo.

REM Copy latest training script
copy /Y "%~dp0backend\train.py" "D:\Programming\AI\MRI\MRI\train.py"
copy /Y "%~dp0backend\app.py"   "D:\Programming\AI\MRI\MRI\app.py"
echo [OK] Scripts copied

cd /d "D:\Programming\AI\MRI\MRI"
call "D:\Programming\AI\MRI\.venv\Scripts\activate.bat"

echo.
echo [STARTING TRAINING...]
echo.
python train.py

echo.
echo ========================================
echo  Training complete!
echo  Now run start-backend.bat to serve
echo  the new model.
echo ========================================
pause
