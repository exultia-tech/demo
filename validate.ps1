<#
.SYNOPSIS
    Exultia Bullshit Validator Launcher (PowerShell)
#>
[CmdletBinding()]
param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$ArgsList
)

$scriptDir = $PSScriptRoot
$validatorPy = Join-Path $scriptDir "validate.py"

$pythonCmd = (Get-Command python.exe -ErrorAction SilentlyContinue)
if (-not $pythonCmd) {
    $pythonCmd = (Get-Command python3.exe -ErrorAction SilentlyContinue)
}

if ($pythonCmd) {
    & $pythonCmd.Source $validatorPy @ArgsList
} else {
    Write-Warning "Python 3 was not detected in PATH. Running standalone binary verification..."
    $kineticExe = Join-Path $scriptDir "bin\kinetic.exe"
    if (Test-Path $kineticExe) {
        & $kineticExe test
    } else {
        Write-Error "Neither python nor bin/kinetic.exe could be executed."
    }
}
