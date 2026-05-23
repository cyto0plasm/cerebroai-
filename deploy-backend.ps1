# Push hf-space/ to your Hugging Face Docker Space.
# Usage:  .\deploy-backend.ps1 -HfUsername cyto0plasm
# Then:   cd hf-space-deploy
#         git push
# (use HF Write token as password when prompted)

param(
    [Parameter(Mandatory = $true)]
    [string]$HfUsername
)

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot
$HfSpaceSrc = Join-Path $ProjectRoot "hf-space"
$CloneDir = Join-Path $ProjectRoot "hf-space-deploy"
$RepoUrl = "https://huggingface.co/spaces/$HfUsername/cerebroai-backend"

Write-Host "CerebroAI backend deploy" -ForegroundColor Cyan
Write-Host "Target Space: $RepoUrl"
Write-Host "Local folder: $CloneDir"

if (-not (Test-Path $HfSpaceSrc)) {
    throw "hf-space folder not found at $HfSpaceSrc"
}

git lfs install 2>$null | Out-Null

if (-not (Test-Path $CloneDir)) {
    Write-Host "Cloning Space (first time)..."
    git clone $RepoUrl $CloneDir
}

Set-Location $CloneDir
git pull origin main 2>$null

Write-Host "Copying backend files..."
Copy-Item -Path (Join-Path $HfSpaceSrc "*") -Destination $CloneDir -Force

git add .
$status = git status --porcelain
if (-not $status) {
    Write-Host "No file changes. If push failed before, run: cd hf-space-deploy && git push" -ForegroundColor Yellow
} else {
    git commit -m "Update CerebroAI backend from local hf-space"
    Write-Host "Committed. Now push to Hugging Face:" -ForegroundColor Green
}

Write-Host ""
Write-Host "Run these commands:" -ForegroundColor Green
Write-Host "  cd `"$CloneDir`""
Write-Host "  git push"
Write-Host "  (Username: cyto0plasm  |  Password: your HF Write token)"
Write-Host ""
Write-Host "Then add Space secret at:" -ForegroundColor Green
Write-Host "  https://huggingface.co/spaces/$HfUsername/cerebroai-backend/settings"
Write-Host "  HF_MODEL_REPO = $HfUsername/MRI_IMAGING_TOMUR_DETECTOR"
