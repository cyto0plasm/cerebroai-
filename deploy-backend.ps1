# Push hf-space/ to your Hugging Face Docker Space.
# Usage: .\deploy-backend.ps1 -HfUsername YOUR_HF_USERNAME

param(
    [Parameter(Mandatory = $true)]
    [string]$HfUsername
)

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot
$HfSpaceSrc = Join-Path $ProjectRoot "hf-space"
$CloneDir = Join-Path $env:TEMP "cerebroai-backend-$HfUsername"
$RepoUrl = "https://huggingface.co/spaces/$HfUsername/cerebroai-backend"

Write-Host "CerebroAI backend deploy" -ForegroundColor Cyan
Write-Host "Target Space: $RepoUrl"

if (-not (Test-Path $HfSpaceSrc)) {
    throw "hf-space folder not found at $HfSpaceSrc"
}

git lfs install 2>$null | Out-Null

if (Test-Path $CloneDir) {
    Remove-Item -Recurse -Force $CloneDir
}

Write-Host "Cloning Space..."
git clone $RepoUrl $CloneDir
Set-Location $CloneDir

Write-Host "Copying backend files..."
Copy-Item -Path (Join-Path $HfSpaceSrc "*") -Destination $CloneDir -Force

git add .
$status = git status --porcelain
if (-not $status) {
    Write-Host "No changes to push." -ForegroundColor Yellow
    exit 0
}

git commit -m "Update CerebroAI backend from local hf-space"
git push

Write-Host ""
Write-Host "Done. Next steps:" -ForegroundColor Green
Write-Host "  1. Space Settings -> Repository secrets -> HF_MODEL_REPO = $HfUsername/cerebroai-model"
Write-Host "  2. Wait for build (Running)"
Write-Host "  3. Test: https://$HfUsername-cerebroai-backend.hf.space/"
