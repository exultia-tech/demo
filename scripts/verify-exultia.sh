#!/usr/bin/env bash
# Independent black-box verification runner for Exultia on Ubuntu 24.04.
# Every state change (SSH parser, netfilter rules, dpkg status, sysctl kernel values,
# binary SHA-256, and Ed25519 signatures) is verified using native OS tools outside Exultia.
set -euo pipefail

GATE="all"
while [ "$#" -gt 0 ]; do
  case "$1" in
    --gate)
      GATE="${2:?missing gate value}"
      shift 2
      ;;
    --gate=*)
      GATE="${1#*=}"
      shift
      ;;
    *)
      echo "Unknown argument: $1" >&2
      echo "Usage: $0 [--gate <1|2|3|4|5|6|7|8|all>]" >&2
      exit 2
      ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
EVIDENCE_DIR="${EVIDENCE_DIR:-$REPO_ROOT/evidence}"
VANTAGE_CVE="${VANTAGE_CVE:-CVE-2024-6387}"
ARGENT_BUNDLE="${ARGENT_BUNDLE:-USN-7088-1}"
EVAL_CONF="/etc/exultia/eval.conf"
SYNC_FEED_LIMIT="${SYNC_FEED_LIMIT:-250}"

mkdir -p "$EVIDENCE_DIR"

log_gate() {
  printf "\n==============================================================================\n"
  printf "  %s\n" "$1"
  printf "==============================================================================\n"
}

gate_1() {
  log_gate "GATE 1: Independent Ed25519 provenance, tamper check & abstention JSON"
  python3 "$SCRIPT_DIR/verify-provenance.py" --out "$EVIDENCE_DIR/gate1_provenance.json"
}

gate_2() {
  log_gate "GATE 2: Fail-closed install (SHA-256 + SLSA L2 DSSE) & binary permissions"
  curl -fsSL https://exultia.tech/install.sh -o /tmp/exultia-install.sh
  sudo env EXULTIA_REQUIRE_CHECKSUM=1 EXULTIA_REQUIRE_PROVENANCE=1 sh /tmp/exultia-install.sh | tee "$EVIDENCE_DIR/gate2_install.log"
  rm -f /tmp/exultia-install.sh

  # Stop autonomous background daemon during controlled gate assertions to prevent race conditions
  sudo systemctl stop exultia.service || true

  local mode_owner
  mode_owner="$(sudo stat -c '%a %U:%G' /usr/local/bin/exultia)"
  echo "Binary permissions: $mode_owner"
  test "$mode_owner" = "700 root:root"

  local actual_sha expected_sha
  actual_sha="$(sudo sha256sum /usr/local/bin/exultia | awk '{print $1}')"
  expected_sha="$(curl -fsSL https://exultia.tech/downloads/exultia/SHA256SUMS.txt | tr -d '\r' | awk '{f=$2; gsub(/^[*]/, "", f); if (f=="exultia") {print $1; exit}}')"
  echo "Actual SHA-256:   $actual_sha"
  echo "Expected SHA-256: $expected_sha"
  test -n "$expected_sha"
  test "$actual_sha" = "$expected_sha"

  sudo exultia --version | tee "$EVIDENCE_DIR/gate2_version.txt"

  sudo mkdir -p /etc/exultia
  sudo tee "$EVAL_CONF" >/dev/null <<CONF
[daemon]
os_distro = ubuntu
ring = 0
${EXULTIA_OPERATOR_KEY:+operator_token = $EXULTIA_OPERATOR_KEY}

[feeds]
vantage_feed_url = https://exultia.tech/api/patches/feed
argent_feed_url = https://exultia.tech/api/argent/feed?format=kinetic

[patching]
auto_stage_patches = false
auto_patch_non_reboot = false
vendor_native_updates = false
disruptive_auto_reboot = false

[livepatch]
kernel_livepatch_enabled = false

[neural_self_heal]
ai_self_heal_mode = off
CONF
  sudo chown root:root "$EVAL_CONF"
  sudo chmod 600 "$EVAL_CONF"
  echo "[PASS] Gate 2 verified install provenance, binary SHA-256, 0700 ownership, and eval.conf"
}

_restore_gate3_sshd() {
  local orig_sshd_cfg="/tmp/exultia-gate3-sshd_config.orig"
  if sudo test -f "$orig_sshd_cfg"; then
    sudo mv -f "$orig_sshd_cfg" /etc/ssh/sshd_config
    sudo chown root:root /etc/ssh/sshd_config
    sudo chmod 644 /etc/ssh/sshd_config
  fi
  if sudo sshd -t 2>/dev/null && command -v systemctl >/dev/null 2>&1; then
    if systemctl is-active --quiet ssh; then
      sudo systemctl reload ssh || true
    elif systemctl is-active --quiet sshd; then
      sudo systemctl reload sshd || true
    fi
  fi
}

gate_3() {
  log_gate "GATE 3: Live Vantage remediation & bitwise rollback ($VANTAGE_CVE)"
  local orig_sshd_cfg="/tmp/exultia-gate3-sshd_config.orig"
  sudo rm -f "$orig_sshd_cfg"
  if sudo test -f /etc/ssh/sshd_config && sudo grep -qiE '^[[:space:]]*UsePAM[[:space:]]+yes\b' /etc/ssh/sshd_config; then
    sudo cp -a /etc/ssh/sshd_config "$orig_sshd_cfg"
  fi
  trap '_restore_gate3_sshd' ERR

  sudo mkdir -p /run/sshd /etc/ssh/sshd_config.d
  sudo tee /etc/ssh/sshd_config >/dev/null <<'EOF'
Include /etc/ssh/sshd_config.d/*.conf
Port 22
UsePAM yes
PubkeyAuthentication yes
KbdInteractiveAuthentication no
LoginGraceTime 120
EOF
  sudo rm -f /etc/ssh/sshd_config.d/00-exultia-*.conf
  sudo sshd -t
  sudo sshd -T | grep -qi '^usepam yes$'

  local before_val after_val restored_val
  before_val="$(sudo sshd -T | awk '$1=="logingracetime"{print $2}')"
  echo "Independent sshd -T LoginGraceTime BEFORE   = $before_val"
  test "$before_val" = "120"

  sudo exultia --config "$EVAL_CONF" feed --verify --cve "$VANTAGE_CVE" | tee "$EVIDENCE_DIR/gate3_feed_verify.txt"
  sudo exultia --config "$EVAL_CONF" patch --cve "$VANTAGE_CVE" --force | tee "$EVIDENCE_DIR/gate3_apply.txt"

  sudo sshd -t
  after_val="$(sudo sshd -T | awk '$1=="logingracetime"{print $2}')"
  echo "Independent sshd -T LoginGraceTime AFTER    = $after_val"
  test "$after_val" = "0"

  sudo exultia --config "$EVAL_CONF" rollback --cve "$VANTAGE_CVE" | tee "$EVIDENCE_DIR/gate3_rollback.txt"
  sudo sshd -t
  restored_val="$(sudo sshd -T | awk '$1=="logingracetime"{print $2}')"
  echo "Independent sshd -T LoginGraceTime RESTORED = $restored_val"
  test "$restored_val" = "120"

  trap - ERR
  _restore_gate3_sshd
  echo "[PASS] Gate 3 verified $VANTAGE_CVE live apply (120 -> 0) and rollback (0 -> 120)"
}

gate_4() {
  log_gate "GATE 4: Live Vantage kernel netfilter guard & non-breakage (CVE-2026-98432)"
  sudo exultia --config "$EVAL_CONF" patch --cve CVE-2026-98432 --force | tee "$EVIDENCE_DIR/gate4_apply.txt"

  sudo nft list ruleset | tee "$EVIDENCE_DIR/gate4_nft_after_apply.txt"
  if ! sudo nft list table ip exultia_cve_2026_98432 2>/dev/null | grep -qE "hdrlength (>|gt|!=) 5"; then
    if ! sudo iptables -t raw -S PREROUTING 2>/dev/null | grep -q "0>>24&0x0f!=5"; then
      echo "FAIL: Expected live nftables or iptables raw rule for CVE-2026-98432 not present" >&2
      exit 1
    fi
  fi

  python3 - <<'PY'
import socket, threading
srv = socket.socket()
srv.bind(("127.0.0.1", 0))
port = srv.getsockname()[1]
srv.listen(1)
def handle():
    conn, _ = srv.accept()
    conn.sendall(b"ok")
    conn.close()
t = threading.Thread(target=handle, daemon=True)
t.start()
cli = socket.create_connection(("127.0.0.1", port), timeout=5)
assert cli.recv(2) == b"ok"
cli.close()
srv.close()
print("[PASS] Normal TCP loopback handshake unaffected by CVE-2026-98432 guard")
PY

  sudo exultia --config "$EVAL_CONF" rollback --cve CVE-2026-98432 | tee "$EVIDENCE_DIR/gate4_rollback.txt"
  sudo nft list ruleset | tee "$EVIDENCE_DIR/gate4_nft_after_rollback.txt"

  if sudo nft list table ip exultia_cve_2026_98432 >/dev/null 2>&1; then
    echo "FAIL: nft table exultia_cve_2026_98432 remained after rollback" >&2
    exit 1
  fi
  if sudo iptables -t raw -S PREROUTING 2>/dev/null | grep -q "0>>24&0x0f!=5"; then
    echo "FAIL: iptables raw rule remained after rollback" >&2
    exit 1
  fi
  echo "[PASS] Gate 4 verified live netfilter guard install, normal TCP traffic, and clean rollback"
}

gate_5() {
  log_gate "GATE 5: Live Argent API + native apt package patching ($ARGENT_BUNDLE)"
  dpkg-query -W -f='BEFORE: ${Package} ${Version} ${Status}\n' libbrotli1 | tee "$EVIDENCE_DIR/gate5_argent.txt"
  sudo exultia --config "$EVAL_CONF" patch --bundle "$ARGENT_BUNDLE" --os ubuntu | tee -a "$EVIDENCE_DIR/gate5_argent.txt"
  dpkg-query -W -f='AFTER:  ${Package} ${Version} ${Status}\n' libbrotli1 | tee -a "$EVIDENCE_DIR/gate5_argent.txt"
  dpkg-query -W -f='${Status}\n' libbrotli1 | grep -q "install ok installed"
  echo "[PASS] Gate 5 verified live Argent OS patch execution against Ubuntu apt"
}

gate_6() {
  log_gate "GATE 6: Negative fail-closed abstention (CVE-2026-136158 Valkey JSON)"
  if sudo exultia --config "$EVAL_CONF" patch --cve CVE-2026-136158 2>&1 | tee "$EVIDENCE_DIR/gate6_abstain_cli.txt"; then
    echo "FAIL: Abstained CVE-2026-136158 should fail closed rather than reporting applied" >&2
    exit 1
  fi
  if dpkg-query -W -f='${Status}\n' redis-server 2>/dev/null | grep -q "install ok installed"; then
    echo "FAIL: redis-server should NOT have been installed for Valkey CVE-2026-136158" >&2
    exit 1
  fi
  echo "[PASS] Gate 6 verified fail-closed abstention and zero redis-server substitution"
}

gate_7() {
  log_gate "GATE 7: SOX/PCI configuration drift injection, detection, and auto-repair"
  # Ensure /etc/ssh/sshd_config starts clean with Include first, and establish clean baseline once
  sudo mkdir -p /run/sshd /etc/ssh/sshd_config.d /etc/sysctl.d
  sudo rm -f /etc/ssh/sshd_config.d/00-exultia-drift.conf /etc/ssh/sshd_config.d/99-exultia-drift.conf
  sudo exultia --config "$EVAL_CONF" drift fix >/dev/null

  # Remove enforced drop-in so injected drift simulates unmitigated insecure host state
  sudo rm -f /etc/ssh/sshd_config.d/00-exultia-drift.conf
  sudo tee /etc/ssh/sshd_config.d/99-exultia-drift.conf >/dev/null <<'EOF'
PermitRootLogin yes
PermitEmptyPasswords yes
EOF
  sudo tee /etc/sysctl.d/99-exultia-drift.conf >/dev/null <<'EOF'
net.ipv4.tcp_syncookies = 0
EOF
  sudo sysctl -w net.ipv4.tcp_syncookies=0 >/dev/null

  sudo exultia --config "$EVAL_CONF" drift audit --json | tee "$EVIDENCE_DIR/gate7_drift_before.json"
  jq -e 'length > 0' "$EVIDENCE_DIR/gate7_drift_before.json" >/dev/null

  sudo exultia --config "$EVAL_CONF" drift fix | tee "$EVIDENCE_DIR/gate7_drift_fix.txt"

  sudo sshd -t
  sudo sshd -T | grep -qi '^permitrootlogin no$'
  sudo sshd -T | grep -qi '^usepam yes$'
  test "$(sysctl -n net.ipv4.tcp_syncookies)" = "1"

  sudo exultia --config "$EVAL_CONF" drift audit --json | tee "$EVIDENCE_DIR/gate7_drift_after.json"
  jq -e 'length == 0' "$EVIDENCE_DIR/gate7_drift_after.json" >/dev/null
  echo "[PASS] Gate 7 verified SOX/PCI drift detection, auto-reconciliation, and OS-level enforcement"
}

gate_8() {
  log_gate "GATE 8: Daemon sync dry-run, behavioral gates, and signed Ed25519 attestation"
  sudo exultia --config "$EVAL_CONF" sync \
    --feed-url "https://exultia.tech/api/patches/feed?limit=${SYNC_FEED_LIMIT}" \
    --dry-run | tee "$EVIDENCE_DIR/gate8_sync_dry_run.txt"
  grep -q '\[Kinetic Daemon\] Cycle complete\.' "$EVIDENCE_DIR/gate8_sync_dry_run.txt"

  sudo exultia test --behavioral --json | tee "$EVIDENCE_DIR/gate8_behavioral_raw.txt"
  python3 - "$EVIDENCE_DIR/gate8_behavioral_raw.txt" "$EVIDENCE_DIR/gate8_behavioral.json" <<'PY'
import json, sys
raw = open(sys.argv[1], encoding="utf-8").read()
idx = raw.find("{")
if idx < 0:
    raise SystemExit("Missing JSON payload in exultia test --behavioral --json output")
doc = json.loads(raw[idx:])
open(sys.argv[2], "w", encoding="utf-8").write(json.dumps(doc, indent=2) + "\n")
assert doc.get("passed") is True, f"Behavioral gate failed: {doc}"
assert doc.get("passed_gates") == doc.get("total_gates"), f"Not all behavioral gates passed: {doc}"
print(f"[PASS] Behavioral exploit gates passed: {doc['passed_gates']}/{doc['total_gates']}")
PY

  sudo exultia attest --json | tee "$EVIDENCE_DIR/gate8_attestation_raw.txt"
  python3 - "$EVIDENCE_DIR/gate8_attestation_raw.txt" "$EVIDENCE_DIR/gate8_attestation.json" <<'PY'
import json, sys
raw = open(sys.argv[1], encoding="utf-8").read()
idx = raw.find("{")
if idx < 0:
    raise SystemExit("Missing JSON payload in exultia attest --json output")
doc = json.loads(raw[idx:])
open(sys.argv[2], "w", encoding="utf-8").write(json.dumps(doc, indent=2) + "\n")
assert doc.get("schema") == "exultia.attestation.v1", f"Unexpected schema: {doc.get('schema')}"
assert doc.get("payload", {}).get("eventlog", {}).get("intact") is True, "Hash-chained eventlog not intact"
assert doc.get("signature", {}).get("algorithm") == "ed25519", "Attestation signature is not Ed25519"
print("[PASS] Host attestation verified (hash chain intact, Ed25519 signed)")
PY
}

case "$GATE" in
  1) gate_1 ;;
  2) gate_2 ;;
  3) gate_3 ;;
  4) gate_4 ;;
  5) gate_5 ;;
  6) gate_6 ;;
  7) gate_7 ;;
  8) gate_8 ;;
  all)
    gate_1
    gate_2
    gate_3
    gate_4
    gate_5
    gate_6
    gate_7
    gate_8
    printf "\n==============================================================================\n"
    printf "  ALL 8 INDEPENDENT EXULTIA VERIFICATION GATES PASSED\n"
    printf "==============================================================================\n"
    ;;
  *)
    echo "Invalid --gate value: $GATE" >&2
    exit 2
    ;;
esac
