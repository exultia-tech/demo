#!/bin/sh
# ==============================================================================
# EXULTIA VANTAGE - Universal Unix/Linux Installer
# Installs Autonomous Threat Remediation & Pre-Baked 24,388-Advisory UVI Catalog
# ==============================================================================
set -e

OS="$(uname -s)"
ARCH="$(uname -m)"
echo "=============================================================================="
echo " Installing Exultia Vantage Threat Pipeline"
echo " Detected OS: $OS ($ARCH)"
echo "=============================================================================="

# Ensure root
if [ "$(id -u)" -ne 0 ]; then
    echo "Error: Installation requires root privileges. Please run with sudo."
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" 2>/dev/null && pwd || echo "")"

# Check if running from an extracted tarball or via pipe
if [ -n "$SCRIPT_DIR" ] && [ -f "$SCRIPT_DIR/bin/exultia-vantage" ]; then
    PAYLOAD_DIR="$SCRIPT_DIR"
else
    echo "[+] Piped execution detected. Preparing temporary payload directory..."
    TMP_DIR="$(mktemp -d /tmp/exultia-install.XXXXXX)"
    trap 'rm -rf "$TMP_DIR"' EXIT INT TERM HUP
    
    TARBALL_NAME="exultia-linux.tar.gz"
    DOWNLOAD_SUCCESS=0
    
    # Candidate mirror locations
    URLS="
    ${EXULTIA_RELEASE_URL}
    http://192.168.1.202:3000/releases/exultia-linux.tar.gz
    https://exultia.tech/releases/exultia-linux.tar.gz
    http://192.168.1.100:8080/releases/exultia-linux.tar.gz
    "
    
    for url in $URLS; do
        if [ -n "$url" ]; then
            echo "[+] Attempting download from $url..."
            if curl -sSL -f "$url" -o "$TMP_DIR/$TARBALL_NAME" 2>/dev/null; then
                if [ -s "$TMP_DIR/$TARBALL_NAME" ]; then
                    DOWNLOAD_SUCCESS=1
                    echo "[+] Download successful from $url"
                    break
                fi
            fi
        fi
    done
    
    if [ "$DOWNLOAD_SUCCESS" -ne 1 ]; then
        echo "[-] Error: Failed to download $TARBALL_NAME from any candidate mirror."
        exit 1
    fi
    
    echo "[+] Unpacking release archive..."
    tar -xzf "$TMP_DIR/$TARBALL_NAME" -C "$TMP_DIR"
    PAYLOAD_DIR="$TMP_DIR"
fi

# Optional packages for full functionality (best effort)
if [ "$OS" = "Linux" ]; then
    if ! which sqlite3 >/dev/null 2>&1 || ! which curl >/dev/null 2>&1; then
        if which apt-get >/dev/null 2>&1; then
            apt-get update -qq >/dev/null 2>&1 || true
            apt-get install -y -qq sqlite3 curl >/dev/null 2>&1 || true
        elif which dnf >/dev/null 2>&1; then
            dnf install -y -q sqlite curl >/dev/null 2>&1 || true
        fi
    fi
fi

# 1. Install directories
echo "[+] Creating Vantage data and spool directories..."
mkdir -p /var/db/vantage /var/spool/vantage /var/log/vantage /etc/exultia /usr/local/bin

# 2. Copy binary
echo "[+] Installing /usr/local/bin/exultia-vantage..."
cp "$PAYLOAD_DIR/bin/exultia-vantage" /usr/local/bin/exultia-vantage
chmod 755 /usr/local/bin/exultia-vantage
ln -sf /usr/local/bin/exultia-vantage /usr/local/bin/vantage
ln -sf /usr/local/bin/exultia-vantage /usr/bin/vantage 2>/dev/null || true
ln -sf /usr/local/bin/exultia-vantage /usr/bin/exultia-vantage 2>/dev/null || true

# 3. Copy pre-baked UVI offline database
if [ -f "$PAYLOAD_DIR/data/uvi_catalog.db" ]; then
    echo "[+] Installing pre-baked 24,388-advisory UVI catalog (/var/db/vantage/uvi_catalog.db)..."
    cp "$PAYLOAD_DIR/data/uvi_catalog.db" /var/db/vantage/uvi_catalog.db
    chmod 644 /var/db/vantage/uvi_catalog.db
fi

if [ -f "$PAYLOAD_DIR/data/threat_ips.table" ]; then
    cp "$PAYLOAD_DIR/data/threat_ips.table" /var/spool/vantage/threat_ips.table
    chmod 644 /var/spool/vantage/threat_ips.table
fi

# 4. Service installation
echo "[+] Installing autonomous background daemon..."
case "$OS" in
    Linux)
        if which systemctl >/dev/null 2>&1; then
            cp "$PAYLOAD_DIR/services/exultia-vantage.service" /etc/systemd/system/exultia-vantage.service
            systemctl daemon-reload
            systemctl enable exultia-vantage.service
            systemctl restart exultia-vantage.service
            echo "[+] Enabled and started systemd service: exultia-vantage.service"
        else
            nohup /usr/local/bin/exultia-vantage daemon >/dev/null 2>&1 &
            echo "[+] Started background daemon via nohup"
        fi
        ;;
    FreeBSD|Exultia)
        cp "$PAYLOAD_DIR/services/exultia_vantage" /usr/local/etc/rc.d/exultia_vantage
        chmod 755 /usr/local/etc/rc.d/exultia_vantage
        sysrc exultia_vantage_enable="YES" 2>/dev/null || true
        service exultia_vantage restart 2>/dev/null || /usr/local/etc/rc.d/exultia_vantage start
        echo "[+] Enabled and started rc.d service: exultia_vantage"
        ;;
esac

echo "=============================================================================="
echo " EXULTIA VANTAGE INSTALLED SUCCESSFULLY!"
echo " Offline UVI Catalog: 24,388 Pre-Installed Advisories"
echo " Daemon Loop: Active (60-second autonomous drift reconciliation)"
echo ""
echo " Try these commands:"
echo "   vantage audit            # Full security compliance audit"
echo "   vantage fix              # Manually trigger remediation"
echo "   vantage search rust      # Search offline UVI feed"
echo "   vantage query CVE-2024-24576"
echo "=============================================================================="
