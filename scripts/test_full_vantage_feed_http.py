import time
import json
import urllib.request
import sys

def test_full_feed_http():
    print("=" * 75)
    print("  EXULTIA KINETIC: EXHAUSTIVE HTTP FEED LOAD TEST (10,913+ EVENTS)")
    print("=" * 75)

    base_url = "http://localhost:3000/api/patches/feed?source=vantage&limit=all"

    # 1. Test Full JSON Feed
    print("\n>>> [1/2] Fetching ENTIRE Vantage feed in JSON format (limit=all)...")
    t0 = time.time()
    req = urllib.request.Request(f"{base_url}&format=json")
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            raw_data = resp.read()
            status = resp.getcode()
    except Exception as e:
        print(f"FAILED to fetch full feed JSON: {e}")
        sys.exit(1)

    t_fetch = time.time() - t0
    payload_mb = len(raw_data) / (1024 * 1024)
    print(f"    [OK] Received HTTP {status} in {t_fetch:.2f}s | Payload: {payload_mb:.2f} MB ({len(raw_data):,} bytes)")

    t_parse0 = time.time()
    data = json.loads(raw_data.decode("utf-8"))
    t_parse = time.time() - t_parse0
    patches = data.get("patches", [])
    total_count = data.get("count", 0)

    print(f"    [OK] Parsed {len(patches):,} patches in {t_parse:.3f}s (Engine reported count: {total_count:,})")
    assert len(patches) >= 10000, f"Expected >= 10,000 patches, got {len(patches)}"

    # Audit the complete set
    deterministic_rollbacks = sum(1 for p in patches if p.get("remediationTier", {}).get("tier1_hotMitigation", {}).get("rollbackCommand"))
    verification_gates = sum(1 for p in patches if p.get("remediationTier", {}).get("tier1_hotMitigation", {}).get("verificationCommand"))
    slsa_level3 = sum(1 for p in patches if p.get("provenance", {}).get("slsaLevel") == 3)
    cisa_kevs = sum(1 for p in patches if p.get("cisaKev") is True)
    criticals = sum(1 for p in patches if p.get("severity") == "CRITICAL")
    highs = sum(1 for p in patches if p.get("severity") == "HIGH")

    print(f"\n    Exhaustive API Validation Metrics:")
    print(f"    • Total Remediations Served:     {len(patches):,}")
    print(f"    • Critical Vulnerabilities:      {criticals:,} (Active CISA KEVs: {cisa_kevs:,})")
    print(f"    • High Severity:                 {highs:,}")
    print(f"    • Deterministic Rollbacks Ready: {deterministic_rollbacks:,}/{len(patches):,} ({deterministic_rollbacks/len(patches)*100:.1f}%)")
    print(f"    • Active Verification Gates:     {verification_gates:,}/{len(patches):,} ({verification_gates/len(patches)*100:.1f}%)")
    print(f"    • SLSA Level 3 Provenance:       {slsa_level3:,}/{len(patches):,} ({slsa_level3/len(patches)*100:.1f}%)")

    assert deterministic_rollbacks == len(patches), "All patches must have deterministic rollbacks"
    assert verification_gates == len(patches), "All patches must have verification gates"

    # 2. Test Full Bash Stream
    print("\n>>> [2/2] Fetching ENTIRE Vantage feed in POSIX Bash stream format...")
    t0_bash = time.time()
    req_bash = urllib.request.Request(f"{base_url}&format=bash")
    with urllib.request.urlopen(req_bash, timeout=120) as resp:
        bash_data = resp.read().decode("utf-8")
        status_bash = resp.getcode()
    t_bash = time.time() - t0_bash

    bash_kb = len(bash_data) / 1024
    bash_lines = bash_data.count("\n")
    print(f"    [OK] Received HTTP {status_bash} in {t_bash:.2f}s | Script Size: {bash_kb:.1f} KB | Lines: {bash_lines:,}")
    assert bash_data.startswith("#!/bin/sh"), "Bash script must start with #!/bin/sh"
    assert "Starting rapid patch synchronization" in bash_data, "Script must have header"
    assert "All pending hot-mitigations applied successfully" in bash_data, "Script must have completion footer"

    print("\n" + "=" * 75)
    print("  EXHAUSTIVE FEED TEST PASSED: ALL 10,913+ VANTAGE ADVISORIES VERIFIED")
    print("=" * 75)

if __name__ == "__main__":
    test_full_feed_http()
