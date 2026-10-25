#!/bin/sh
# ==============================================================================
# Exultia Eris - Controlled Adversary Emulation & Proving Ground Script Template
# Version: 2.4.0
# RESTRICTED TO ISOLATED TESTING & SANDBOX ENVIRONMENTS ONLY
# ==============================================================================
# WARNING: This script intentionally introduces vulnerable configurations,
# open network ports, and permissive ACLs exclusively to validate that
# autonomous detection and remediation engines (Praxis / Valkyrie) trigger.
#
# AUTOMATED WATCHDOG: A background watchdog terminates and purges all changes
# after the designated timeout (default 10 minutes / 600 seconds).
# ==============================================================================

set -eu

TIMEOUT_MINUTES=${1:-10}
TIMEOUT_SECONDS=$((TIMEOUT_MINUTES * 60))
PID_DIR="/tmp/eris_pids"
STATE_FILE="/tmp/eris_state.json"

log_info() { printf '[Eris-Chaos] %s\n' "$1"; }
log_warn() { printf '[Eris-Chaos WARNING] %s\n' "$1" >&2; }

# ── 1. Safety Pre-Flight Guards ───────────────────────────────────────────────
verify_sandbox_safety() {
  log_info "Verifying sandbox safety pre-conditions..."
  if [ "$(id -u)" -ne 0 ]; then
    log_warn "Eris requires root privileges to emulate system daemon configurations."
    exit 1
  fi

  # Prohibit execution on known production hostnames
  HOSTNAME=$(hostname 2>/dev/null || echo "unknown")
  case "$HOSTNAME" in
    *prod*|*production*|*master*|*k8s-node*)
      log_warn "CRITICAL: Execution aborted! Hostname matches production pattern: $HOSTNAME"
      exit 1
      ;;
  esac

  mkdir -p "$PID_DIR"
}

# ── 2. Background Auto-Rollback Watchdog ───────────────────────────────────────
arm_watchdog() {
  log_info "Arming independent background watchdog ($TIMEOUT_MINUTES minutes)..."
  
  (
    sleep "$TIMEOUT_SECONDS"
    printf '\n[Eris Watchdog] Watchdog timer expired (%s min). Enforcing automated rollback...\n' "$TIMEOUT_MINUTES"
    sh "$0" --teardown
  ) >/dev/null 2>&1 &
  
  WATCHDOG_PID=$!
  echo "$WATCHDOG_PID" > "$PID_DIR/watchdog.pid"
  log_info "Watchdog armed with PID $WATCHDOG_PID."
}

# ── 3. Inoculation Modules ───────────────────────────────────────────────────
apply_inoculations() {
  log_info "Injecting intentional non-destructive adversary configurations..."

  # Vector A: OpenSSH RegreSSHion Simulation (LoginGraceTime 120s)
  mkdir -p /etc/ssh/sshd_config.d
  cat << 'EOF' > /etc/ssh/sshd_config.d/99-eris-vulnerable-sshd.conf
# [ERIS INOCULATION] Intentional vulnerable SSH baseline
LoginGraceTime 120
PermitRootLogin yes
PasswordAuthentication yes
EOF
  if command -v sshd >/dev/null 2>&1 && sshd -t >/dev/null 2>&1; then
    systemctl reload sshd 2>/dev/null || systemctl reload ssh 2>/dev/null || true
  fi
  log_info "  [+] Vector A: Permissive SSH daemon baseline injected."

  # Vector B: Mock Rogue C2 Sockets (Ports 4444 & 8080)
  if command -v python3 >/dev/null 2>&1; then
    nohup python3 -c "import socket; s=socket.socket(); s.bind(('0.0.0.0', 4444)); s.listen(5); [s.accept() for _ in iter(int, 1)]" >/dev/null 2>&1 &
    echo $! > "$PID_DIR/c2_4444.pid"
    
    nohup python3 -c "import socket; s=socket.socket(); s.bind(('0.0.0.0', 8080)); s.listen(5); [s.accept() for _ in iter(int, 1)]" >/dev/null 2>&1 &
    echo $! > "$PID_DIR/c2_8080.pid"
    log_info "  [+] Vector B: Mock C2 beacon listener sockets established."
  fi

  # Vector C: Insecure /tmp SUID binary trap
  echo "#!/bin/sh\necho 'Eris Canary'" > /tmp/eris_canary_bin
  chmod 4755 /tmp/eris_canary_bin
  log_info "  [+] Vector C: World-executable SUID canary deployed in /tmp."

  log_info "All Eris inoculations active. Trigger Praxis remediation or Valkyrie BAS probe now."
}

# ── 4. Deterministic Teardown & Purge ──────────────────────────────────────────
teardown_all() {
  log_info "Initiating full Eris teardown and state purge..."

  # Remove drop-ins
  rm -f /etc/ssh/sshd_config.d/99-eris-vulnerable-sshd.conf
  if command -v sshd >/dev/null 2>&1 && sshd -t >/dev/null 2>&1; then
    systemctl reload sshd 2>/dev/null || systemctl reload ssh 2>/dev/null || true
  fi

  # Terminate listeners
  if [ -f "$PID_DIR/c2_4444.pid" ]; then
    kill -9 "$(cat "$PID_DIR/c2_4444.pid")" 2>/dev/null || true
  fi
  if [ -f "$PID_DIR/c2_8080.pid" ]; then
    kill -9 "$(cat "$PID_DIR/c2_8080.pid")" 2>/dev/null || true
  fi

  # Remove SUID binary
  rm -f /tmp/eris_canary_bin

  # Terminate watchdog
  if [ -f "$PID_DIR/watchdog.pid" ]; then
    kill -9 "$(cat "$PID_DIR/watchdog.pid")" 2>/dev/null || true
  fi

  rm -rf "$PID_DIR" "$STATE_FILE"
  log_info "Eris teardown completed. Host returned to pristine state."
}

# ── 5. Main Dispatcher ────────────────────────────────────────────────────────
if [ "${1:-}" = "--teardown" ]; then
  teardown_all
  exit 0
fi

trap teardown_all INT TERM

verify_sandbox_safety
arm_watchdog
apply_inoculations

printf '\nPress [ENTER] or Ctrl+C at any time to execute teardown early:\n'
read -r _ || true
teardown_all
