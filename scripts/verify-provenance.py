#!/usr/bin/env python3
"""
Independent zero-trust provenance & abstention verifier for Exultia live feeds.

Uses ONLY Python stdlib + OS-packaged `cryptography` (no Exultia code imported).
Verifies:
  1. Live Vantage feed (/api/patches/feed?cve=CVE-2024-6387 and ?os=ubuntu&limit=10) canonical SHA-256 + Ed25519 signatures.
  2. Retired Argent endpoints (/api/argent/{feed,stats,sources}) return HTTP 410 Gone with code ARGENT_RETIRED.
  3. Negative tamper test (1-byte digest mutation MUST fail Ed25519 verification).
  4. Semantic abstention test (CVE-2026-136158 Valkey JSON MUST return ABSTAIN-* + operatorGuidance and never redis-server).
"""

import argparse
import hashlib
import json
import sys
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any, Dict, Tuple

from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey


BASE_URL = "https://exultia.tech"
USER_AGENT = "Independent-Exultia-Auditor/1.0"


def get_json(url: str) -> Dict[str, Any]:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def compute_and_verify_patch(pub: Ed25519PublicKey, patch: Dict[str, Any]) -> Tuple[str, bytes]:
    t1 = (patch.get("remediationTier") or {}).get("tier1_hotMitigation") or {}
    t2 = (patch.get("remediationTier") or {}).get("tier2_packageUpgrade") or {}
    distro_cmds = t2.get("distroCommands") or {}
    upg_cmd = t2.get("upgradeCommand") or distro_cmds.get("ubuntu") or next(iter(distro_cmds.values()), "")
    primitives = patch.get("primitives") or (patch.get("validatedFix") or {}).get("primitives") or []

    canonical_obj = {
        "id": str(patch.get("id") or ""),
        "cve_id": str(patch.get("cveId") or ""),
        "commands": list(t1.get("commands") or []),
        "primitives": list(primitives),
        "upgrade_command": str(upg_cmd or ""),
        "verification_command": str(t1.get("verificationCommand") or ""),
        "rollback_command": str(t1.get("rollbackCommand") or ""),
    }
    serialized = json.dumps(canonical_obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    digest = "sha256:" + hashlib.sha256(serialized).hexdigest()

    prov = patch.get("provenance") or {}
    expected_digest = str(prov.get("cosignDigest") or "")
    if digest != expected_digest:
        raise AssertionError(f"Canonical digest mismatch for {patch.get('id')}: {digest} != {expected_digest}")

    sig_str = str(prov.get("signature") or "")
    if not sig_str.startswith("ed25519:"):
        raise AssertionError(f"Missing ed25519 signature for {patch.get('id')}: {sig_str!r}")

    sig_bytes = bytes.fromhex(sig_str.split(":", 1)[1])
    pub.verify(sig_bytes, f"exultia-provenance-v1:{digest}".encode("utf-8"))
    return digest, sig_bytes


def main() -> int:
    parser = argparse.ArgumentParser(description="Independent Ed25519 provenance & semantic abstention verifier.")
    parser.add_argument("--out", default="", help="Optional path to write JSON verification report.")
    args = parser.parse_args()

    key_doc = get_json(f"{BASE_URL}/api/provenance/key")
    pub_hex = str(key_doc.get("publicKeyHex") or "").strip().lower()
    if len(pub_hex) != 64:
        raise AssertionError(f"Invalid publicKeyHex from /api/provenance/key: {pub_hex!r}")
    pub = Ed25519PublicKey.from_public_bytes(bytes.fromhex(pub_hex))

    # 1. Vantage live feed Ed25519 checks
    vantage_doc = get_json(f"{BASE_URL}/api/patches/feed?cve=CVE-2024-6387")
    vantage_patches = list(vantage_doc.get("patches") or [])
    vantage_ubuntu_doc = get_json(f"{BASE_URL}/api/patches/feed?os=ubuntu&limit=10")
    vantage_patches.extend(vantage_ubuntu_doc.get("patches") or [])
    if not vantage_patches:
        raise AssertionError("Vantage feed returned 0 patches")

    sample_digest = ""
    sample_sig = b""
    for p in vantage_patches:
        sample_digest, sample_sig = compute_and_verify_patch(pub, p)
    print(f"[PASS] Vantage independent Ed25519 verified: {len(vantage_patches)}/{len(vantage_patches)}")

    # 2. Retired Argent API tombstone checks (must return HTTP 410 Gone)
    retired_paths = ("/api/argent/feed", "/api/argent/stats", "/api/argent/sources")
    for rpath in retired_paths:
        req = urllib.request.Request(f"{BASE_URL}{rpath}", headers={"User-Agent": USER_AGENT})
        try:
            with urllib.request.urlopen(req, timeout=20) as resp:
                raise AssertionError(f"Expected HTTP 410 on retired {rpath}, got HTTP {resp.status}")
        except urllib.error.HTTPError as he:
            if he.code != 410:
                raise AssertionError(f"Expected HTTP 410 on retired {rpath}, got HTTP {he.code}")
            body = json.loads(he.read().decode("utf-8"))
            if body.get("code") != "ARGENT_RETIRED" or body.get("retired") is not True or body.get("replacement") != "/api/patches/feed":
                raise AssertionError(f"Unexpected 410 payload on {rpath}: {body!r}")
    print(f"[PASS] Retired Argent endpoints verified HTTP 410 ARGENT_RETIRED: {len(retired_paths)}/{len(retired_paths)}")

    # 3. Negative tamper test (mutated digest MUST be rejected)
    tampered_digest = sample_digest[:-1] + ("0" if sample_digest[-1] != "0" else "1")
    tamper_rejected = False
    try:
        pub.verify(sample_sig, f"exultia-provenance-v1:{tampered_digest}".encode("utf-8"))
    except Exception:
        tamper_rejected = True
    if not tamper_rejected:
        raise AssertionError("Tampered digest unexpectedly passed Ed25519 verification!")
    print("[PASS] Negative tamper check rejected 1-byte mutated digest")

    # 4. Semantic abstention check (CVE-2026-136158 Valkey JSON)
    abstain_doc = get_json(f"{BASE_URL}/api/patches/feed?cve=CVE-2026-136158")
    abstain_item = next((p for p in (abstain_doc.get("patches") or []) if p.get("cveId") == "CVE-2026-136158"), None)
    if not abstain_item:
        raise AssertionError("CVE-2026-136158 missing from live /api/patches/feed")

    vf = abstain_item.get("validatedFix") or {}
    rule_id = str(vf.get("expressionRuleId") or "")
    compiler_ver = str(vf.get("compilerVersion") or "")
    guidance = vf.get("operatorGuidance") or abstain_item.get("operatorGuidance")
    rem_blob = json.dumps(abstain_item.get("remediationTier") or {})

    if not rule_id.startswith("ABSTAIN-"):
        raise AssertionError(f"Expected ABSTAIN-* rule for CVE-2026-136158, got {rule_id!r}")
    if not guidance:
        raise AssertionError("Missing operatorGuidance on abstained CVE-2026-136158 record")
    if not compiler_ver:
        raise AssertionError("Missing validatedFix.compilerVersion on live CVE-2026-136158 record")
    if "redis-server" in rem_blob:
        raise AssertionError("False-positive redis-server command present on Valkey advisory CVE-2026-136158")

    print(f"[PASS] CVE-2026-136158 abstained cleanly: rule={rule_id} compiler={compiler_ver}")

    report = {
        "public_key_hex": pub_hex,
        "vantage_verified": len(vantage_patches),
        "argent_retired_410_verified": len(retired_paths),
        "tamper_rejected": tamper_rejected,
        "abstain_check": {
            "cve": "CVE-2026-136158",
            "rule": rule_id,
            "compilerVersion": compiler_ver,
            "hasOperatorGuidance": bool(guidance),
        },
        "status": "PASS",
    }
    if args.out:
        out_path = Path(args.out)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")

    return 0


if __name__ == "__main__":
    sys.exit(main())
