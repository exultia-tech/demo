$ErrorActionPreference = "Stop"

$blueprints = @(
    @{
        Category   = "Purist"
        Id         = "blank-slate"
        BrandName  = "PureIDE Purist"
        Tier       = "COMMUNITY"
        Engine     = "vscode"
        Extensions = ""
    },
    @{
        Category   = "SecOps"
        Id         = "secops-defense"
        BrandName  = "PureIDE SecOps"
        Tier       = "ENTERPRISE"
        Engine     = "vscode"
        Extensions = "Semgrep.semgrep,redhat.vscode-yaml,GitGuardian.gitguardian-vscode,charliermarsh.ruff"
    },
    @{
        Category   = "Full Stack"
        Id         = "web-typescript"
        BrandName  = "PureIDE FullStack"
        Tier       = "TEAM"
        Engine     = "vscode"
        Extensions = "dbaeumer.vscode-eslint,esbenp.prettier-vscode,bradlc.vscode-tailwindcss,Prisma.prisma"
    },
    @{
        Category   = "DevOps"
        Id         = "devops-terraform"
        BrandName  = "PureIDE DevOps"
        Tier       = "TEAM"
        Engine     = "vscode"
        Extensions = "HashiCorp.terraform,redhat.ansible,redhat.vscode-yaml,tamasfe.even-better-toml"
    },
    @{
        Category   = "Backend"
        Id         = "backend-golang"
        BrandName  = "PureIDE GoBackend"
        Tier       = "ENTERPRISE"
        Engine     = "vscode"
        Extensions = "golang.Go,zxh404.vscode-proto3,ms-azuretools.vscode-docker"
    },
    @{
        Category   = "AI / Data"
        Id         = "ai-pytorch"
        BrandName  = "PureIDE AIData"
        Tier       = "ENTERPRISE"
        Engine     = "vscode"
        Extensions = "meta.pyrefly,charliermarsh.ruff,ms-python.debugpy,ms-toolsai.jupyter"
    }
)

$scriptPath = "D:\actions-runner\_work\exultia\exultia\scripts\assemble-ide.ps1"
$releaseDir = "D:\releases"
$results = @()

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "  PURE-IDE MULTI-BLUEPRINT STACK COMPILATION TEST HARNESS        " -ForegroundColor Cyan
Write-Host "  Target Storage: D:\releases (RAID 1 exultia_prod)              " -ForegroundColor Cyan
Write-Host "  Total Blueprint Stacks to Compile: $($blueprints.Count)        " -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

$testIndex = 1
foreach ($bp in $blueprints) {
    Write-Host "`n>>> [TEST $testIndex/$($blueprints.Count)] Compiling [$($bp.Category)] Blueprint: $($bp.BrandName)" -ForegroundColor Yellow
    $startTime = Get-Date
    $buildId = (Get-Date -Format "yyyyMMdd-HHmmss")
    $cleanSlug = ($bp.BrandName -replace '[^a-zA-Z0-9\-_]', '_')
    $expectedExe = Join-Path $releaseDir "${cleanSlug}_$($bp.Engine)_Setup.exe"

    try {
        & $scriptPath `
            -Tier $bp.Tier `
            -TargetOS "windows" `
            -Engine $bp.Engine `
            -BrandName $bp.BrandName `
            -Extensions $bp.Extensions `
            -BuildId $buildId `
            -OutputDir $releaseDir

        $elapsed = [math]::Round(((Get-Date) - $startTime).TotalSeconds, 1)

        # Check for generated installer and portable zip
        $exeFile = Get-Item $expectedExe -ErrorAction SilentlyContinue
        $zipFile = Get-ChildItem -Path $releaseDir -Filter "${cleanSlug}-windows-$($bp.Tier)-$buildId*.zip" -File -ErrorAction SilentlyContinue | Select-Object -First 1

        if ($exeFile -and $zipFile) {
            $exeMB = [math]::Round($exeFile.Length / 1MB, 1)
            $zipMB = [math]::Round($zipFile.Length / 1MB, 1)
            Write-Host "    [SUCCESS] Compiled in ${elapsed}s! Exe: ${exeMB} MB | Zip: ${zipMB} MB" -ForegroundColor Green

            $results += [PSCustomObject]@{
                Index      = $testIndex
                Category   = $bp.Category
                Blueprint  = $bp.BrandName
                Status     = "SUCCESS"
                TimeSec    = $elapsed
                ExeSizeMB  = $exeMB
                ZipSizeMB  = $zipMB
                ExeName    = $exeFile.Name
                ZipName    = $zipFile.Name
            }
        } else {
            throw "Artifacts not found after assembly. Exe: $($exeFile -ne $null), Zip: $($zipFile -ne $null)"
        }
    } catch {
        $elapsed = [math]::Round(((Get-Date) - $startTime).TotalSeconds, 1)
        Write-Host "    [FAILED] Blueprint $($bp.BrandName) failed after ${elapsed}s: $($_.Exception.Message)" -ForegroundColor Red
        $results += [PSCustomObject]@{
            Index      = $testIndex
            Category   = $bp.Category
            Blueprint  = $bp.BrandName
            Status     = "FAILED"
            TimeSec    = $elapsed
            ExeSizeMB  = 0
            ZipSizeMB  = 0
            ExeName    = "N/A"
            ZipName    = "N/A"
        }
    }
    $testIndex++
}

Write-Host "`n=================================================================" -ForegroundColor Cyan
Write-Host "  COMPILATION TEST RESULTS SUMMARY                               " -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan
$results | Format-Table -AutoSize
$results | ConvertTo-Json -Depth 3 | Set-Content "D:\releases\blueprint_test_results.json" -Encoding utf8
