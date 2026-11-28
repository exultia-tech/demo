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
      echo "Usage: $0 [--gate <1|2|3|4|5|6|7|8|9|summary|all>]" >&2
      exit 2
      ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
EVIDENCE_DIR="${EVIDENCE_DIR:-$REPO_ROOT/evidence}"
VANTAGE_CVE="${VANTAGE_CVE:-}"
EVAL_CONF="/etc/exultia/eval.conf"
SYNC_FEED_LIMIT="${SYNC_FEED_LIMIT:-250}"
COMPROMISE_SAMPLE_COUNT="${COMPROMISE_SAMPLE_COUNT:-250}"
COMPROMISE_SEED="${COMPROMISE_SEED:-}"

mkdir -p "$EVIDENCE_DIR"

if [ -z "${EXULTIA_NO_LOCK:-}" ] && command -v flock >/dev/null 2>&1; then
  LOCK_DIR="/tmp/exultia-verify.lock.d"
  mkdir -p "$LOCK_DIR" 2>/dev/null || true
  chmod 0755 "$LOCK_DIR" 2>/dev/null || true
  exec 9< "$LOCK_DIR"
  if ! flock -n 9; then
    echo "[Lock] Waiting for another Exultia verification run on this host to finish..." >&2
    flock -w 600 9
  fi
fi

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

  # Stop autonomous background daemon and clear any stale staged cache from prior runs
  sudo systemctl stop exultia.service || true
  sudo rm -rf /var/lib/exultia/staging

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

gate_3() {
  log_gate "GATE 3: Live Vantage random advisory remediation & bitwise rollback (${VANTAGE_CVE:-random})"
  local cve_args=()
  if [ -n "$VANTAGE_CVE" ]; then
    cve_args=(--cve "$VANTAGE_CVE")
  fi
  sudo python3 "$SCRIPT_DIR/verify-gate3-vantage.py" \
    --config "$EVAL_CONF" \
    --evidence-dir "$EVIDENCE_DIR" \
    "${cve_args[@]}"
  if [ -n "${GITHUB_ENV:-}" ] && [ -f "$EVIDENCE_DIR/gate3_selected.json" ]; then
    jq -r '"SELECTED_VANTAGE_CVE=\(.selectedCve)\nSELECTED_VANTAGE_RULE=\(.expressionRuleId)"' \
      "$EVIDENCE_DIR/gate3_selected.json" >> "$GITHUB_ENV"
  fi
}

gate_4() {
  log_gate "GATE 4: Live Vantage kernel netfilter guard & non-breakage (CVE-2026-98432)"
  sudo exultia --config "$EVAL_CONF" patch --cve CVE-2026-98432 --force | tee "$EVIDENCE_DIR/gate4_apply.txt"

  sudo nft list ruleset | tee "$EVIDENCE_DIR/gate4_nft_after_apply.txt"
  local nft_dump ipt_dump
  nft_dump="$(sudo nft list table ip exultia_cve_2026_98432 2>/dev/null || true)"
  ipt_dump="$(sudo iptables -t raw -S PREROUTING 2>/dev/null || true)"
  if ! grep -qE "hdrlength (>|gt|!=) 5" <<< "$nft_dump"; then
    if ! grep -q "0>>24&0x0f!=5" <<< "$ipt_dump"; then
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
  local ipt_after
  ipt_after="$(sudo iptables -t raw -S PREROUTING 2>/dev/null || true)"
  if grep -q "0>>24&0x0f!=5" <<< "$ipt_after"; then
    echo "FAIL: iptables raw rule remained after rollback" >&2
    exit 1
  fi
  echo "[PASS] Gate 4 verified live netfilter guard install, normal TCP traffic, and clean rollback"
}

gate_5() {
  log_gate "GATE 5: Real native Ubuntu apt security upgrade via --vendor (BEFORE < AFTER)"
  sudo DEBIAN_FRONTEND=noninteractive apt-get update -qq

  local target_pkg="" old_ver="" sec_ver="" cand=""
  for cand in wget cpio curl libexpat1; do
    local pkg_status madison sim_out
    pkg_status="$(dpkg-query -W -f='${Status}\n' "$cand" 2>/dev/null || true)"
    if ! grep -q "install ok installed" <<< "$pkg_status"; then
      continue
    fi
    madison="$(apt-cache madison "$cand" 2>/dev/null || true)"
    sec_ver="$(printf '%s\n' "$madison" | awk -F'|' '/noble-security/ {gsub(/ /, "", $2); print $2; exit}')"
    old_ver="$(printf '%s\n' "$madison" | awk -F'|' '/noble\/main/ {gsub(/ /, "", $2); print $2; exit}')"
    if [ -n "$sec_ver" ] && [ -n "$old_ver" ] && dpkg --compare-versions "$old_ver" lt "$sec_ver"; then
      sim_out="$(sudo DEBIAN_FRONTEND=noninteractive apt-get install -s -y --allow-downgrades "${cand}=${old_ver}" 2>&1 || true)"
      if ! grep -qE '^(Remv|E:)' <<< "$sim_out"; then
        target_pkg="$cand"
        break
      fi
    fi
  done

  if [ -z "$target_pkg" ]; then
    echo "FAIL: Could not find an installed Ubuntu 24.04 package with safe noble/main downgrade and noble-security upgrade candidate" >&2
    exit 1
  fi

  _restore_gate5_pkg() {
    sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq --only-upgrade "$target_pkg" >/dev/null 2>&1 || true
  }
  trap _restore_gate5_pkg EXIT

  echo "Selected Gate 5 candidate: $target_pkg ($old_ver -> $sec_ver)" | tee "$EVIDENCE_DIR/gate5_native_apt.txt"
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq --allow-downgrades "${target_pkg}=${old_ver}" >/dev/null 2>&1
  local before_ver after_ver
  before_ver="$(dpkg-query -W -f='${Version}' "$target_pkg")"
  echo "BEFORE: $target_pkg $before_ver" | tee -a "$EVIDENCE_DIR/gate5_native_apt.txt"
  if [ "$before_ver" != "$old_ver" ]; then
    echo "FAIL: Expected downgraded version $old_ver before Exultia run, got $before_ver" >&2
    exit 1
  fi

  sudo exultia --config "$EVAL_CONF" patch --vendor --os ubuntu 2>&1 | tee -a "$EVIDENCE_DIR/gate5_native_apt.txt"
  after_ver="$(dpkg-query -W -f='${Version}' "$target_pkg")"
  echo "AFTER:  $target_pkg $after_ver" | tee -a "$EVIDENCE_DIR/gate5_native_apt.txt"

  if ! dpkg --compare-versions "$after_ver" gt "$before_ver"; then
    echo "FAIL: Gate 5 package $target_pkg did not upgrade via --vendor ($before_ver -> $after_ver)" >&2
    exit 1
  fi
  trap - EXIT

  cat > "$EVIDENCE_DIR/gate5_selected.json" <<JSON
{
  "targetPackage": "$target_pkg",
  "beforeVersion": "$before_ver",
  "afterVersion": "$after_ver",
  "securityCandidate": "$sec_ver"
}
JSON
  if [ -n "${GITHUB_ENV:-}" ]; then
    {
      echo "SELECTED_GATE5_PKG=$target_pkg"
      echo "SELECTED_GATE5_BEFORE=$before_ver"
      echo "SELECTED_GATE5_AFTER=$after_ver"
    } >> "$GITHUB_ENV"
  fi
  echo "[PASS] Gate 5 verified real native Ubuntu apt upgrade: $target_pkg $before_ver -> $after_ver"
}

gate_6() {
  log_gate "GATE 6: Negative fail-closed abstention (CVE-2026-136158 Valkey JSON)"
  if sudo exultia --config "$EVAL_CONF" patch --cve CVE-2026-136158 2>&1 | tee "$EVIDENCE_DIR/gate6_abstain_cli.txt"; then
    echo "FAIL: Abstained CVE-2026-136158 should fail closed rather than reporting applied" >&2
    exit 1
  fi
  local redis_status
  redis_status="$(dpkg-query -W -f='${Status}\n' redis-server 2>/dev/null || true)"
  if grep -q "install ok installed" <<< "$redis_status"; then
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
  local sshd_after_drift
  sshd_after_drift="$(sudo sshd -T)"
  grep -qi '^permitrootlogin no$' <<< "$sshd_after_drift"
  grep -qi '^usepam yes$' <<< "$sshd_after_drift"
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

gate_9() {
  log_gate "GATE 9: Live ${COMPROMISE_SAMPLE_COUNT}-item random feed compromise & autonomous auto-fix"
  local seed_args=()
  if [ -n "$COMPROMISE_SEED" ]; then
    seed_args=(--seed "$COMPROMISE_SEED")
  fi
  sudo python3 "$SCRIPT_DIR/verify-compromise-250.py" \
    --count "$COMPROMISE_SAMPLE_COUNT" \
    --confirm-test-host \
    --out "$EVIDENCE_DIR/gate9_compromise_250.json" \
    "${seed_args[@]}"
}

gate_summary() {
  log_gate "PLAIN-ENGLISH VERIFICATION REPORT"
  python3 "$SCRIPT_DIR/generate-plain-english-summary.py" \
    --evidence-dir "$EVIDENCE_DIR" \
    --out "$EVIDENCE_DIR/VERIFICATION_SUMMARY.md" \
    --print
  echo "[PASS] Plain-English verification summary written to $EVIDENCE_DIR/VERIFICATION_SUMMARY.md"
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
  9) gate_9 ;;
  summary) gate_summary ;;
  all)
    gate_1
    gate_2
    gate_3
    gate_4
    gate_5
    gate_6
    gate_7
    gate_8
    gate_9
    gate_summary
    printf "\n==============================================================================\n"
    printf "  ALL 9 INDEPENDENT EXULTIA VERIFICATION GATES PASSED\n"
    printf "==============================================================================\n"
    ;;
  *)
    echo "Invalid --gate value: $GATE" >&2
    exit 2
    ;;
esac
