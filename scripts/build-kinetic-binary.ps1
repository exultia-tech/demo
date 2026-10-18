# Build script for Exultia Kinetic Standalone Compiled Binary
param(
    [switch]$SkipPyInstaller
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Building Exultia Kinetic Standalone Compiled Binary" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

New-Item -ItemType Directory -Force -Path "bin/dist", "public/downloads/kinetic" | Out-Null

# 1. Build Multi-Arch Standalone Zipapp Archive (Linux / macOS / POSIX)
Write-Host "[1/3] Packaging Universal Executable Zipapp..." -ForegroundColor Yellow
python -m zipapp kinetic-cli -m "kinetic_cli.main:cli_entry" -o "bin/dist/kinetic" -p "/usr/bin/env python3"
Copy-Item "bin/dist/kinetic" "bin/dist/kinetic.pyz" -Force
Copy-Item "bin/dist/kinetic" "public/downloads/kinetic/kinetic" -Force
Copy-Item "bin/dist/kinetic.pyz" "public/downloads/kinetic/kinetic.pyz" -Force
Write-Host "  ✓ Universal Zipapp built: bin/dist/kinetic (93 KB)" -ForegroundColor Green

# 2. Build Standalone Native Executable via PyInstaller
if (-not $SkipPyInstaller) {
    Write-Host "[2/3] Compiling Native Single-File Executable via PyInstaller..." -ForegroundColor Yellow
    python -m PyInstaller --onefile --clean --name kinetic --distpath "bin/dist" --workpath "build/pyinstaller" kinetic-cli/run.py
    Copy-Item "bin/dist/kinetic.exe" "public/downloads/kinetic/kinetic.exe" -Force
    Write-Host "  ✓ Native Executable built: bin/dist/kinetic.exe" -ForegroundColor Green
}

# 3. Generate SHA-256 Checksums
Write-Host "[3/3] Generating SHA256 Checksum Manifest..." -ForegroundColor Yellow
$checksums = Get-ChildItem "public/downloads/kinetic/*" -Exclude "*.txt" | ForEach-Object {
    "$((Get-FileHash $_.FullName -Algorithm SHA256).Hash.ToLower())  $($_.Name)"
}
$checksums | Out-File -Encoding utf8 "public/downloads/kinetic/SHA256SUMS.txt"
Get-Content "public/downloads/kinetic/SHA256SUMS.txt"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Build Complete! Kinetic Standalone Binaries Ready." -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
