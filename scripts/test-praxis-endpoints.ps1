param(
    [string]$BaseUrl = "http://127.0.0.1:3000",
    [string[]]$OsTargets = @("linux", "ubuntu", "rocky", "bsd", "freebsd", "solaris", "hpux", "aix")
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Exultia Multi-OS Endpoint & POSIX Compatibility Test Suite " -ForegroundColor Cyan
Write-Host " Target Host: $BaseUrl" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

$results = @()

foreach ($os in $OsTargets) {
    Write-Host "[$os] Testing Praxis Client Endpoint..." -NoNewline
    $clientUrl = "$BaseUrl/api/fix-list/client?os=$os"
    try {
        $res = Invoke-WebRequest -Uri $clientUrl -UseBasicParsing -TimeoutSec 10
        if ($res.StatusCode -eq 200) {
            $content = $res.Content
            # POSIX Compatibility checks
            $hasBashism = $false
            $bashisms = @()
            if ($content -match '\[\[\s+') { $hasBashism = $true; $bashisms += '[[ test ]]' }
            if ($content -match 'function\s+\w+\s*\(\)') { $hasBashism = $true; $bashisms += 'function kw' }
            if ($content -match '\b==\b') { $hasBashism = $true; $bashisms += '== test equality' }
            if ($content -match '\bsource\s+') { $hasBashism = $true; $bashisms += 'source command' }

            if ($hasBashism) {
                Write-Host " WARN (Contains bashisms: $($bashisms -join ', '))" -ForegroundColor Yellow
                $results += [PSCustomObject]@{ OS = $os; Component = "Client Script"; Status = "WARN"; Details = "Non-POSIX bashisms detected" }
            } else {
                Write-Host " PASS (Valid POSIX /bin/sh syntax)" -ForegroundColor Green
                $results += [PSCustomObject]@{ OS = $os; Component = "Client Script"; Status = "PASS"; Details = "Clean POSIX /bin/sh" }
            }
        } else {
            Write-Host " FAIL (Status $($res.StatusCode))" -ForegroundColor Red
            $results += [PSCustomObject]@{ OS = $os; Component = "Client Script"; Status = "FAIL"; Details = "HTTP $($res.StatusCode)" }
        }
    } catch {
        Write-Host " ERROR ($($_.Exception.Message))" -ForegroundColor Red
        $results += [PSCustomObject]@{ OS = $os; Component = "Client Script"; Status = "ERROR"; Details = $_.Exception.Message }
    }

    Write-Host "[$os] Testing Remediation Feed API..." -NoNewline
    $feedUrl = "$BaseUrl/api/fix-list/feed?os=$os"
    try {
        $feedRes = Invoke-WebRequest -Uri $feedUrl -UseBasicParsing -TimeoutSec 10
        if ($feedRes.StatusCode -eq 200) {
            $json = $feedRes.Content | ConvertFrom-Json
            Write-Host " PASS (Rules: $($json.rules.Count))" -ForegroundColor Green
            $results += [PSCustomObject]@{ OS = $os; Component = "Feed API"; Status = "PASS"; Details = "$($json.rules.Count) rules returned" }
        } else {
            Write-Host " FAIL (Status $($feedRes.StatusCode))" -ForegroundColor Red
            $results += [PSCustomObject]@{ OS = $os; Component = "Feed API"; Status = "FAIL"; Details = "HTTP $($feedRes.StatusCode)" }
        }
    } catch {
        Write-Host " ERROR ($($_.Exception.Message))" -ForegroundColor Red
        $results += [PSCustomObject]@{ OS = $os; Component = "Feed API"; Status = "ERROR"; Details = $_.Exception.Message }
    }
}

Write-Host ""
Write-Host "================== Summary Results ==================" -ForegroundColor Cyan
$results | Format-Table -AutoSize
