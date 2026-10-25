# Exultia Quick-Test Launcher for PowerShell (irm ... | iex)
$ErrorActionPreference = "Stop"

$tempGuid = [System.Guid]::NewGuid().ToString().Substring(0, 8)
$tmpDir = Join-Path $env:TEMP "exultia-validator-$tempGuid"

Write-Host "--> Cloning Exultia Bullshit Validator..." -ForegroundColor Cyan
git clone --depth=1 -q https://github.com/exultia-tech/demo.git $tmpDir

try {
    Push-Location $tmpDir
    $pythonCmd = (Get-Command python.exe -ErrorAction SilentlyContinue)
    if (-not $pythonCmd) {
        $pythonCmd = (Get-Command python3.exe -ErrorAction SilentlyContinue)
    }

    if ($pythonCmd) {
        & $pythonCmd.Source validate.py
    } else {
        .\bin\kinetic.exe test
    }
} finally {
    Pop-Location
    Remove-Item -Recurse -Force $tmpDir -ErrorAction SilentlyContinue
}
