# Start Jenkins for loc8tr (requires Docker Desktop running)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "Building and starting Jenkins on http://localhost:8080 ..."
docker compose -f docker-compose.jenkins.yml up -d --build

Write-Host ""
Write-Host "Waiting for Jenkins to start..."
Start-Sleep -Seconds 15

$password = docker exec loc8tr-jenkins cat /var/jenkins_home/secrets/initialAdminPassword 2>$null
if ($password) {
    Write-Host ""
    Write-Host "Jenkins initial admin password:"
    Write-Host $password
    Write-Host ""
    Write-Host "Open http://localhost:8080 and complete the setup wizard."
} else {
    Write-Host "Jenkins is starting. If this is not the first run, log in with your existing admin account."
    Write-Host "Open http://localhost:8080"
}

Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Install suggested plugins"
Write-Host "  2. Create admin user"
Write-Host "  3. New Item -> Pipeline -> loc8tr-ci"
Write-Host "  4. Pipeline from SCM -> Git -> https://github.com/IC844-UAL/loc8tr.git -> Jenkinsfile"
Write-Host "  5. Create teacher user: Manage Jenkins -> Users -> Create User (profesor)"
