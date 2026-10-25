# Build script for Exultia Kinetic Standalone Compiled Binary
param(
    [switch]$SkipPyInstaller,
    [switch]$SkipLinuxElf
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Building Exultia Kinetic Standalone Compiled Binary" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

New-Item -ItemType Directory -Force -Path "bin/dist", "public/downloads/kinetic" | Out-Null

# 1. Build Multi-Arch Standalone Universal Zipapp (Compiled Bytecode)
Write-Host "[1/4] Packaging Compiled Universal Zipapp..." -ForegroundColor Yellow
python -m zipapp kinetic-cli -m "kinetic_cli.main:cli_entry" -o "bin/dist/kinetic.pyz" -p "/usr/bin/env python3" -c
Copy-Item "bin/dist/kinetic.pyz" "public/downloads/kinetic/kinetic.pyz" -Force
Write-Host "  ✓ Universal Zipapp built: bin/dist/kinetic.pyz" -ForegroundColor Green

# 2. Build Standalone Native Executable via PyInstaller (Windows PE32+)
if (-not $SkipPyInstaller) {
    Write-Host "[2/4] Compiling Native Windows Single-File PE32+ via PyInstaller..." -ForegroundColor Yellow
    python -m PyInstaller --onefile --clean --name kinetic --distpath "bin/dist" --workpath "build/pyinstaller" kinetic-cli/run.py
    Copy-Item "bin/dist/kinetic.exe" "public/downloads/kinetic/kinetic.exe" -Force
    Write-Host "  ✓ Native Windows Executable built: bin/dist/kinetic.exe" -ForegroundColor Green
}

# 3. Build Standalone Native ELF Executable via PyInstaller (Linux ELF 64-bit)
if (-not $SkipLinuxElf) {
    if (Get-Command wsl -ErrorAction SilentlyContinue) {
        Write-Host "[3/4] Compiling Native Linux Single-File ELF Binary via WSL..." -ForegroundColor Yellow
        $linuxScript = "/mnt/c/" + ($projectRoot -replace "^C:\\", "" -replace "\\", "/") + "/scripts/build-kinetic-linux.sh"
        wsl -e bash $linuxScript
        Write-Host "  ✓ Native Linux ELF Binary built: public/downloads/kinetic/kinetic" -ForegroundColor Green
    } else {
        Write-Host "[3/4] WSL not detected; copying universal binary as kinetic" -ForegroundColor DarkGray
        Copy-Item "bin/dist/kinetic.pyz" "public/downloads/kinetic/kinetic" -Force
    }
}

# 4. Generate SHA-256 Checksums
Write-Host "[4/4] Generating SHA256 Checksum Manifest..." -ForegroundColor Yellow
$checksums = Get-ChildItem "public/downloads/kinetic/*" -Exclude "*.txt" | ForEach-Object {
    "$((Get-FileHash $_.FullName -Algorithm SHA256).Hash.ToLower())  $($_.Name)"
}
$checksums | Out-File -Encoding utf8 "public/downloads/kinetic/SHA256SUMS.txt"
Get-Content "public/downloads/kinetic/SHA256SUMS.txt"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Build Complete! Kinetic Standalone Binaries Ready." -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
