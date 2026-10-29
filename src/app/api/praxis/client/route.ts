import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const os = searchParams.get('os') || 'linux';
  const cron = searchParams.get('cron') === 'true';
  const lang = searchParams.get('lang') || 'bash';
  const drift = searchParams.get('drift') !== 'false'; // Toggleable mode, enabled by default
  const standard = searchParams.get('standard') || 'sox_pci';

  // In production, this should be the actual deployment URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://exultia.tech';

  if (lang === 'bash') {
    let script = `#!/bin/sh
# Exultia Lightweight Praxis Client with Autonomous Drift Reconciliation
# OS Target: ${os}
# Baseline: ${standard.toUpperCase()} (Sarbanes-Oxley ITGC & PCI-DSS v4.0)
# Drift Auto-Reversion: ${drift ? 'ENABLED' : 'DISABLED'}
#
# This script retrieves threat remediations and continuously reconciles
# configuration drift back to authoritative security standards.
# Zero system telemetry is collected.

FEED_URL="${baseUrl}/api/praxis/feed?os=${os}"
DRIFT_API="${baseUrl}/api/praxis/drift?standard=${standard}"
LOG_DIR="/var/log/exultia"
LOG_FILE="$LOG_DIR/drift.log"

log_drift_event() {
  mkdir -p "$LOG_DIR" 2>/dev/null || true
  TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || echo "NOW")
  echo "[$TIMESTAMP] [DriftSentinel] $1" >> "$LOG_FILE" 2>/dev/null || true
}
`;

    if (drift) {
      script += `
reconcile_compliance_drift() {
  echo "[Exultia Drift Sentinel] Auditing configuration against ${standard.toUpperCase()} baseline..."
  DRIFT_COUNT=0

  # 1. SSH Hardening (PCI DSS 2.2.4, 8.3.6 / SOX ITGC Logical Access)
  SSH_DIR="/etc/ssh/sshd_config.d"
  SSH_DROPIN="$SSH_DIR/99-exultia-drift.conf"
  if [ -d "/etc/ssh" ]; then
    mkdir -p "$SSH_DIR" 2>/dev/null || true
    if [ ! -f "$SSH_DROPIN" ] || ! grep -q "PermitRootLogin no" "$SSH_DROPIN" 2>/dev/null; then
      echo "[+] Reverting SSH drift: Enforcing PermitRootLogin no & PasswordAuthentication no (PCI-DSS 2.2.4 / SOX AC)..."
      cat << 'EOF' > "$SSH_DROPIN"
# Exultia Autonomous SOX & PCI-DSS Baseline
PermitRootLogin no
PasswordAuthentication no
X11Forwarding no
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 0
EOF
      chmod 600 "$SSH_DROPIN" 2>/dev/null || true
      command -v systemctl >/dev/null 2>&1 && (systemctl reload sshd 2>/dev/null || systemctl reload ssh 2>/dev/null || true)
      log_drift_event "Reverted SSH drift to compliant baseline (/etc/ssh/sshd_config.d/99-exultia-drift.conf)"
      DRIFT_COUNT=$((DRIFT_COUNT + 1))
    fi
  fi

  # 2. Kernel & Sysctl Invariants (PCI DSS 2.2 / SOX Boundary Defense)
  SYSCTL_DIR="/etc/sysctl.d"
  SYSCTL_DROPIN="$SYSCTL_DIR/99-exultia-drift.conf"
  if [ -d "/etc" ]; then
    mkdir -p "$SYSCTL_DIR" 2>/dev/null || true
    # Check if packet forwarding drifted
    CURRENT_IP_FWD=$(cat /proc/sys/net/ipv4/ip_forward 2>/dev/null || echo "0")
    if [ "$CURRENT_IP_FWD" != "0" ] || [ ! -f "$SYSCTL_DROPIN" ]; then
      echo "[+] Reverting Sysctl drift: Enforcing net.ipv4.ip_forward=0 & ASLR (PCI-DSS 2.2.5 / SOX Boundary)..."
      cat << 'EOF' > "$SYSCTL_DROPIN"
# Exultia Autonomous SOX & PCI-DSS Sysctl Baseline
net.ipv4.ip_forward = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.tcp_syncookies = 1
kernel.randomize_va_space = 2
fs.suid_dumpable = 0
EOF
      chmod 644 "$SYSCTL_DROPIN" 2>/dev/null || true
      command -v sysctl >/dev/null 2>&1 && sysctl -p "$SYSCTL_DROPIN" >/dev/null 2>&1 || true
      log_drift_event "Reverted Sysctl drift to compliant baseline (/etc/sysctl.d/99-exultia-drift.conf)"
      DRIFT_COUNT=$((DRIFT_COUNT + 1))
    fi
  fi

  # 3. File Permissions (PCI DSS 10.2.1 / SOX AC-6)
  if [ -f "/etc/shadow" ]; then
    SHADOW_PERMS=$(stat -c "%a" /etc/shadow 2>/dev/null || stat -f "%Op" /etc/shadow 2>/dev/null || echo "600")
    if [ "$SHADOW_PERMS" != "600" ] && [ "$SHADOW_PERMS" != "640" ]; then
      echo "[+] Reverting permission drift: Restoring /etc/shadow to mode 0600 (PCI-DSS 10.2.1)..."
      chmod 600 /etc/shadow 2>/dev/null || true
      chown root:root /etc/shadow 2>/dev/null || true
      log_drift_event "Restored /etc/shadow permissions to 0600 (was: $SHADOW_PERMS)"
      DRIFT_COUNT=$((DRIFT_COUNT + 1))
    fi
  fi

  if [ -f "/etc/sudoers" ]; then
    SUDOERS_PERMS=$(stat -c "%a" /etc/sudoers 2>/dev/null || echo "440")
    if [ "$SUDOERS_PERMS" != "440" ]; then
      echo "[+] Reverting permission drift: Restoring /etc/sudoers to mode 0440 (SOX Privileged Access)..."
      chmod 440 /etc/sudoers 2>/dev/null || true
      log_drift_event "Restored /etc/sudoers permissions to 0440 (was: $SUDOERS_PERMS)"
      DRIFT_COUNT=$((DRIFT_COUNT + 1))
    fi
  fi

  if [ "$DRIFT_COUNT" -eq 0 ]; then
    echo "[Exultia Drift Sentinel] Zero drift detected. System adheres to ${standard.toUpperCase()} invariants."
  else
    echo "[Exultia Drift Sentinel] Successfully reconciled $DRIFT_COUNT drifted controls to ${standard.toUpperCase()} baseline."
  fi
}
`;
    }

    script += `
fetch_and_apply() {
  # Attempt to use curl, fallback to wget
  if command -v curl >/dev/null 2>&1; then
    PAYLOAD=$(curl -sL "$FEED_URL")
  elif command -v wget >/dev/null 2>&1; then
    PAYLOAD=$(wget -qO- "$FEED_URL")
  else
    echo "Error: Neither curl nor wget is available."
    exit 1
  fi

  if [ -n "$PAYLOAD" ]; then
    echo "Executing remediation payload..."
    echo "$PAYLOAD" | sh
  else
    echo "No new remediations available."
  fi
}
`;

    if (cron) {
      script += `
setup_cron() {
  SCRIPT_PATH=$(readlink -f "$0" 2>/dev/null || echo "$PWD/$0")
  if [ -n "$RANDOM" ]; then
    RAND_MIN=$((RANDOM % 60))
  else
    RAND_MIN=$(awk 'BEGIN{srand();print int(rand()*60)}')
  fi
  CRON_JOB="$RAND_MIN * * * * $SCRIPT_PATH"
  if ! crontab -l 2>/dev/null | grep -qF "$SCRIPT_PATH"; then
    echo "Installing cron job to run continuously..."
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
  fi
}

setup_cron
`;
    }

    if (drift) {
      script += `\nreconcile_compliance_drift\n`;
    }

    script += `\nfetch_and_apply\n`;

    return new NextResponse(script, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-store'
      }
    });
  }

  return new NextResponse('Unsupported language configuration.', { status: 400 });
}
