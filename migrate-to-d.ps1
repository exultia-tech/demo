$ErrorActionPreference = "Stop"

Write-Host ">>> [MIGRATION 1/6] Stopping runner and release server..." -ForegroundColor Cyan
Stop-ScheduledTask -TaskName "GitHubActionsRunner" -ErrorAction SilentlyContinue
Stop-ScheduledTask -TaskName "ExultiaReleaseServer" -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

Write-Host ">>> [MIGRATION 2/6] Setting up D:\releases on RAID 1 (exultia_prod)..." -ForegroundColor Cyan
if (-not (Test-Path "D:\releases")) {
    New-Item -ItemType Directory -Path "D:\releases" -Force | Out-Null
}
# Copy all existing release artifacts, certs, and logs
Copy-Item -Path "C:\releases\*" -Destination "D:\releases\" -Recurse -Force
Write-Host "    [OK] Copied $( (Get-ChildItem D:\releases).Count ) items to D:\releases."

# Replace C:\releases with junction to D:\releases for seamless path compatibility
if (-not (Get-Item "C:\releases").Attributes.HasFlag([System.IO.FileAttributes]::ReparsePoint)) {
    if (Test-Path "C:\releases.bak") { Remove-Item -Recurse -Force "C:\releases.bak" }
    Rename-Item -Path "C:\releases" -NewName "releases.bak" -Force
    New-Item -ItemType Junction -Path "C:\releases" -Target "D:\releases" -Force | Out-Null
    Write-Host "    [OK] Junction created: C:\releases -> D:\releases"
}

Write-Host ">>> [MIGRATION 3/6] Setting up D:\actions-runner\_work on RAID 1 (exultia_prod)..." -ForegroundColor Cyan
if (-not (Test-Path "D:\actions-runner\_work")) {
    New-Item -ItemType Directory -Path "D:\actions-runner\_work" -Force | Out-Null
}

# Update C:\actions-runner\.runner config
$runnerConfigPath = "C:\actions-runner\.runner"
if (Test-Path $runnerConfigPath) {
    $cfg = Get-Content $runnerConfigPath -Raw | ConvertFrom-Json
    $cfg.workFolder = "D:\actions-runner\_work"
    $cfg | ConvertTo-Json -Depth 5 | Set-Content $runnerConfigPath -Encoding utf8
    Write-Host "    [OK] Updated .runner workFolder to D:\actions-runner\_work"
}

# Also ensure C:\actions-runner\_work is a junction to D:\actions-runner\_work
if (Test-Path "C:\actions-runner\_work") {
    if (-not (Get-Item "C:\actions-runner\_work").Attributes.HasFlag([System.IO.FileAttributes]::ReparsePoint)) {
        Remove-Item -Recurse -Force "C:\actions-runner\_work" -ErrorAction SilentlyContinue
        New-Item -ItemType Junction -Path "C:\actions-runner\_work" -Target "D:\actions-runner\_work" -Force | Out-Null
        Write-Host "    [OK] Junction created: C:\actions-runner\_work -> D:\actions-runner\_work"
    }
} else {
    New-Item -ItemType Junction -Path "C:\actions-runner\_work" -Target "D:\actions-runner\_work" -Force | Out-Null
}

Write-Host ">>> [MIGRATION 4/6] Restarting ExultiaReleaseServer..." -ForegroundColor Cyan
Start-ScheduledTask -TaskName "ExultiaReleaseServer"
Start-Sleep -Seconds 2

Write-Host ">>> [MIGRATION 5/6] Restarting GitHubActionsRunner..." -ForegroundColor Cyan
Start-ScheduledTask -TaskName "GitHubActionsRunner"
Start-Sleep -Seconds 3

Write-Host ">>> [MIGRATION 6/6] Verifying status..." -ForegroundColor Cyan
Get-ScheduledTask -TaskName "ExultiaReleaseServer","GitHubActionsRunner" | Format-Table TaskName, State -AutoSize
Write-Host "`n>>> D:\ Contents:" -ForegroundColor Green
Get-ChildItem "D:\"
