# Start Jenkins for loc8tr (requires Docker Desktop running)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "Building and starting Jenkins on http://localhost:8080 ..."
docker compose -f docker-compose.jenkins.yml up -d --build

Write-Host ""
Write-Host "Waiting for Jenkins to start..."
Start-Sleep -Seconds 15

Write-Host ""
Write-Host "Jenkins logins (auto-created on first run):"
Write-Host "  admin   / admin123"
Write-Host "  profesor / profesor123"
Write-Host ""
Write-Host "Open http://localhost:8080"
Write-Host "Pipeline job: loc8tr-ci"
