# CerebroAI Setup Checker
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CerebroAI Backend Setup Checker" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check 1: Python environment
Write-Host "[1/5] Checking Python environment..." -ForegroundColor Yellow
$pythonPath = "D:\Programming\AI\MRI\.venv\Scripts\python.exe"
if (Test-Path $pythonPath) {
    Write-Host "  ✓ Python found: $pythonPath" -ForegroundColor Green
    $pythonVersion = & $pythonPath --version 2>&1
    Write-Host "    Version: $pythonVersion" -ForegroundColor Gray
} else {
    Write-Host "  ✗ Python not found at: $pythonPath" -ForegroundColor Red
    Write-Host "    Please check your Python installation" -ForegroundColor Red
}
Write-Host ""

# Check 2: Required packages
Write-Host "[2/5] Checking required packages..." -ForegroundColor Yellow
try {
    $checkPackages = & $pythonPath -c "import fastapi, uvicorn, torch; print('OK')" 2>&1
    if ($checkPackages -like "*OK*") {
        Write-Host "  ✓ FastAPI, Uvicorn, and PyTorch installed" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Some packages missing" -ForegroundColor Red
        Write-Host "    Run: pip install fastapi uvicorn torch" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ✗ Error checking packages" -ForegroundColor Red
}
Write-Host ""

# Check 3: Backend app.py
Write-Host "[3/5] Checking backend server file..." -ForegroundColor Yellow
$appPath = "D:\Programming\AI\MRI\MRI\app.py"
if (Test-Path $appPath) {
    Write-Host "  ✓ Backend found: $appPath" -ForegroundColor Green
} else {
    Write-Host "  ✗ Backend not found: $appPath" -ForegroundColor Red
}
Write-Host ""

# Check 4: Model weights
Write-Host "[4/5] Checking trained model weights..." -ForegroundColor Yellow
$weightsPath = "D:\Programming\AI\MRI\MRI\mri_model.pth"
if (Test-Path $weightsPath) {
    Write-Host "  ✓ Model weights found: $weightsPath" -ForegroundColor Green
    $fileSize = (Get-Item $weightsPath).Length / 1KB
    Write-Host "    Size: $([math]::Round($fileSize, 2)) KB" -ForegroundColor Gray
    Write-Host "    Your model is ready for real predictions!" -ForegroundColor Green
} else {
    Write-Host "  ✗ Model weights not found" -ForegroundColor Yellow
    Write-Host "    Server will run in SIMULATION mode" -ForegroundColor Yellow
    Write-Host "    To use real predictions:" -ForegroundColor Cyan
    Write-Host "      1. Open your Jupyter notebook" -ForegroundColor Cyan
    Write-Host "      2. Train the model" -ForegroundColor Cyan
    Write-Host "      3. Run: torch.save(model.state_dict(), 'mri_model.pth')" -ForegroundColor Cyan
}
Write-Host ""

# Check 5: Port availability
Write-Host "[5/5] Checking if port 8000 is available..." -ForegroundColor Yellow
$portInUse = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "  ⚠ Port 8000 is already in use" -ForegroundColor Yellow
    Write-Host "    The backend might already be running!" -ForegroundColor Yellow
    Write-Host "    Or another application is using port 8000" -ForegroundColor Yellow
} else {
    Write-Host "  ✓ Port 8000 is available" -ForegroundColor Green
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if (Test-Path $weightsPath) {
    Write-Host "✓ Everything is ready!" -ForegroundColor Green
    Write-Host ""
    Write-Host "To start the backend server:" -ForegroundColor White
    Write-Host "  Double-click: start-backend.bat" -ForegroundColor Yellow
} else {
    Write-Host "⚠ Model weights not found - server will use simulation mode" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1: Start with simulation (for testing)" -ForegroundColor White
    Write-Host "  Double-click: start-backend.bat" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 2: Train model first (for real predictions)" -ForegroundColor White
    Write-Host "  1. Open Jupyter notebook" -ForegroundColor Yellow
    Write-Host "  2. Train your model" -ForegroundColor Yellow
    Write-Host "  3. Export weights (see BACKEND-SETUP.md)" -ForegroundColor Yellow
    Write-Host "  4. Then run start-backend.bat" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "For detailed instructions, see: BACKEND-SETUP.md" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to close"
