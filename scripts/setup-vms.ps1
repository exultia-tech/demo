<#
.SYNOPSIS
    Exultia Security Suite - Automated Test Fleet Provisioner (WSL2)
.DESCRIPTION
    Provisions two isolated Linux VMs (Alpine Linux 3.20 x86_64) inside WSL2:
    - exultia-node-1 (Production Server Simulation - Ring 1)
    - exultia-node-2 (Canary / Staging Simulation - Ring 0)
    Configures passwordless sudo for user 'exultia', installs kinetic v2.4.0,
    and deploys interactive validation walkthroughs.
#>

param(
    [string]$VmRoot = "$HOME\exultia-vms"
)

$ErrorActionPreference = "Stop"

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  EXULTIA SECURITY SUITE - TEST FLEET PROVISIONER" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

# 1. Prepare Directories
$downloadsDir = Join-Path $VmRoot "downloads"
$node1Dir = Join-Path $VmRoot "node-1"
$node2Dir = Join-Path $VmRoot "node-2"
$tarballPath = Join-Path $downloadsDir "alpine.tar.gz"

New-Item -ItemType Directory -Force -Path $downloadsDir | Out-Null
New-Item -ItemType Directory -Force -Path $node1Dir | Out-Null
New-Item -ItemType Directory -Force -Path $node2Dir | Out-Null

# 2. Download RootFS Tarball if not present
if (-not (Test-Path $tarballPath)) {
    Write-Host "[1/5] Downloading Alpine Linux 3.20 rootfs tarball..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri "https://dl-cdn.alpinelinux.org/alpine/v3.20/releases/x86_64/alpine-minirootfs-3.20.3-x86_64.tar.gz" -OutFile $tarballPath
} else {
    Write-Host "[1/5] Alpine rootfs tarball cached at $tarballPath" -ForegroundColor Green
}

# 3. Import Node 1 (Production)
Write-Host "[2/5] Provisioning exultia-node-1 (Production Server)..." -ForegroundColor Yellow
$existing = wsl.exe -l -q 2>$null
if ($existing -notmatch "exultia-node-1") {
    wsl.exe --import exultia-node-1 $node1Dir $tarballPath --version 2
}

# 4. Import Node 2 (Canary)
Write-Host "[3/5] Provisioning exultia-node-2 (Canary Host)..." -ForegroundColor Yellow
if ($existing -notmatch "exultia-node-2") {
    wsl.exe --import exultia-node-2 $node2Dir $tarballPath --version 2
}

# 5. Configure Nodes
$scriptDir = $PSScriptRoot
$binDir = Join-Path (Split-Path $scriptDir -Parent) "bin"

foreach ($node in @("exultia-node-1", "exultia-node-2")) {
    $hostname = if ($node -eq "exultia-node-1") { "exultia-prod-01" } else { "exultia-canary-02" }
    Write-Host "[4/5] Configuring environment in $node ($hostname)..." -ForegroundColor Yellow

    wsl.exe -d $node -u root sh -c "
        apk update && apk add python3 py3-pip bash curl sudo git
        id -u exultia 2>/dev/null || adduser -D -s /bin/bash exultia
        echo 'exultia ALL=(ALL) NOPASSWD: ALL' > /etc/sudoers.d/exultia
        chmod 0440 /etc/sudoers.d/exultia
        echo '[user]' > /etc/wsl.conf
        echo 'default=exultia' >> /etc/wsl.conf
        echo '[network]' >> /etc/wsl.conf
        echo 'hostname=$hostname' >> /etc/wsl.conf
    "

    # Copy compiled standalone ELF binary and scripts (zero .pyz or Python source exposure)
    Copy-Item (Join-Path $binDir "exultia") "\\wsl.localhost\$node\usr\local\bin\exultia" -Force 2>$null
    Copy-Item (Join-Path $scriptDir "demo-kinetic.sh") "\\wsl.localhost\$node\home\exultia\demo-kinetic.sh" -Force 2>$null
    Copy-Item (Join-Path $scriptDir "demo-praxis.sh") "\\wsl.localhost\$node\home\exultia\demo-praxis.sh" -Force 2>$null
    Copy-Item (Join-Path $scriptDir "demo-vantage-sync.sh") "\\wsl.localhost\$node\home\exultia\demo-vantage-sync.sh" -Force 2>$null
    Copy-Item (Join-Path $scriptDir "demo-fleet-canary.sh") "\\wsl.localhost\$node\home\exultia\demo-fleet-canary.sh" -Force 2>$null

    wsl.exe -d $node -u root sh -c "
        umask 077
        rm -rf /usr/local/lib/kinetic /usr/local/bin/kinetic.pyz /opt/exultia-cli
        mkdir -p /var/lib/exultia/.runtime /etc/exultia
        chmod 700 /var/lib/exultia /var/lib/exultia/.runtime /etc/exultia
        chown root:root /usr/local/bin/exultia
        chmod 700 /usr/local/bin/exultia
        ln -sf /usr/local/bin/exultia /usr/local/bin/xul
        ln -sf /usr/local/bin/exultia /usr/local/bin/kinetic
        chmod +x /home/exultia/*.sh
        chown -R exultia:exultia /home/exultia
    "
}

# 6. Restart VMs to apply hostname
wsl.exe -t exultia-node-1 2>$null
wsl.exe -t exultia-node-2 2>$null

Write-Host "======================================================================" -ForegroundColor Green
Write-Host "  ✔ Test Fleet Successfully Provisioned!" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "  Access Production Node : wsl -d exultia-node-1" -ForegroundColor Cyan
Write-Host "  Access Canary Node     : wsl -d exultia-node-2" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Green
