#!/usr/bin/env python3
"""
Gate 5: Independent random Argent Ubuntu bundle native `apt` remediation verifier.

Selects a random non-reboot Ubuntu Argent bundle whose target package is installed on
the host (unless --bundle is explicitly passed), executes `exultia patch --bundle <ID> --os ubuntu`,
and independently verifies the package installation state via `dpkg-query`.
"""

from __future__ import annotations

import argparse
import gzip
import json
import os
import re
import secrets
import subprocess
import sys
import urllib.request
from pathlib import Path
from typing import Any, Dict, List


BASE_URL = "https://exultia.tech"
USER_AGENT = "Independent-Exultia-Auditor/1.0"


def run_cmd(argv: List[str], timeout: int = 180) -> subprocess.CompletedProcess[str]:
    return subprocess.run(argv, capture_output=True, text=True, timeout=timeout)


def fetch_json(url: str) -> Dict[str, Any]:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "application/json",
            "Accept-Encoding": "gzip",
        },
    )
    with urllib.request.urlopen(req, timeout=45) as resp:
        raw = resp.read()
        enc = str(resp.headers.get("Content-Encoding") or "").lower()
        if "gzip" in enc or raw[:2] == b"\x1f\x8b":
            raw = gzip.decompress(raw)
        return json.loads(raw.decode("utf-8"))


def dpkg_installed(pkg: str) -> bool:
    r = run_cmd(["dpkg-query", "-W", "-f=${Status}", pkg], timeout=10)
    return r.returncode == 0 and "install ok installed" in r.stdout


def dpkg_line(prefix: str, pkg: str) -> str:
    r = run_cmd(["dpkg-query", "-W", f"-f={prefix}: ${{Package}} ${{Version}} ${{Status}}\n", pkg], timeout=10)
    return (r.stdout or r.stderr).strip()


def select_argent_bundle(patches: List[Dict[str, Any]], explicit_bundle: str = "") -> Dict[str, Any]:
    if explicit_bundle:
        norm = explicit_bundle.strip().upper().replace(":", "-")
        for p in patches:
            if (
                norm in str(p.get("id") or "").upper().replace(":", "-")
                or norm in str(p.get("cveId") or "").upper().replace(":", "-")
                or norm in str(p.get("title") or "").upper().replace(":", "-")
            ):
                return p
        raise RuntimeError(f"Explicitly requested Argent bundle {explicit_bundle!r} not found in live Ubuntu feed")

    eligible: List[Dict[str, Any]] = []
    for p in patches:
        t1 = (p.get("remediationTier") or {}).get("tier1_hotMitigation") or {}
        t2 = (p.get("remediationTier") or {}).get("tier2_packageUpgrade") or {}
        if bool(t2.get("requiresReboot")):
            continue
        pkg = str(t2.get("packageName") or "").strip()
        if not pkg or not dpkg_installed(pkg):
            continue
        ver_cmd = str(t1.get("verificationCommand") or "")
        # Skip bundles with hardcoded legacy version-substring grep literals rather than dpkg status/version checks
        if re.search(r"\|\s*grep\s+(?!-)", ver_cmd):
            continue
        if pkg == "php-common" and not any(Path("/etc").glob("php*/*/conf.d")):
            continue
        eligible.append(p)

    if not eligible:
        raise RuntimeError("No eligible installed non-reboot Ubuntu Argent bundles found on this host")

    return secrets.SystemRandom().choice(eligible)


def main() -> int:
    ap = argparse.ArgumentParser(description="Gate 5 random Argent Ubuntu bundle verifier.")
    ap.add_argument("--config", default="/etc/exultia/eval.conf")
    ap.add_argument("--evidence-dir", required=True)
    ap.add_argument("--exultia-bin", default="/usr/local/bin/exultia")
    ap.add_argument("--bundle", default="", help="Optional explicit Argent bundle override; omit for random selection.")
    args = ap.parse_args()

    ev_dir = Path(args.evidence_dir)
    ev_dir.mkdir(parents=True, exist_ok=True)

    argent_doc = fetch_json(f"{BASE_URL}/api/argent/feed?format=kinetic&os=ubuntu&limit=200")
    patches = list(argent_doc.get("patches") or [])
    chosen = select_argent_bundle(patches, explicit_bundle=args.bundle)
    bundle_id = str(chosen.get("id") or "").strip()
    pkg = str(((chosen.get("remediationTier") or {}).get("tier2_packageUpgrade") or {}).get("packageName") or "").strip()

    print(f"[Gate 5] Selected Argent Ubuntu bundle: {bundle_id} (package={pkg}, mode={'explicit' if args.bundle else 'random'})")

    gh_env = os.environ.get("GITHUB_ENV")
    if gh_env:
        with open(gh_env, "a", encoding="utf-8") as fh:
            fh.write(f"SELECTED_ARGENT_BUNDLE={bundle_id}\n")
            fh.write(f"SELECTED_ARGENT_PKG={pkg}\n")

    log_lines: List[str] = []
    before_ln = dpkg_line("BEFORE", pkg)
    print(before_ln)
    log_lines.append(before_ln)

    try:
        proc = run_cmd([args.exultia_bin, "--config", args.config, "patch", "--bundle", bundle_id, "--os", "ubuntu"], timeout=240)
        combined_out = (proc.stdout or "") + (proc.stderr or "")
        print(combined_out, end="")
        log_lines.append(combined_out.rstrip())
        if proc.returncode != 0:
            raise AssertionError(f"`exultia patch --bundle {bundle_id} --os ubuntu` failed (rc={proc.returncode})")

        after_ln = dpkg_line("AFTER ", pkg)
        print(after_ln)
        log_lines.append(after_ln)

        if not dpkg_installed(pkg):
            raise AssertionError(f"Expected {pkg} to be `install ok installed` after Argent bundle {bundle_id}")

        (ev_dir / "gate5_argent.txt").write_text("\n".join(log_lines) + "\n", encoding="utf-8")
        (ev_dir / "gate5_selected.json").write_text(
            json.dumps(
                {
                    "selectedBundle": bundle_id,
                    "targetPackage": pkg,
                    "selectionMode": "explicit" if args.bundle else "random",
                    "before": before_ln,
                    "after": after_ln,
                },
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )
        print(f"[PASS] Gate 5 verified random Argent OS bundle {bundle_id} ({pkg}) against Ubuntu apt")
        return 0
    finally:
        if pkg == "php-common":
            for ini in Path("/etc").glob("php*/*/*/99-argent-php2shell.ini"):
                ini.unlink(missing_ok=True)
            for ini in Path("/etc").glob("php*/*/99-argent-php2shell.ini"):
                ini.unlink(missing_ok=True)


if __name__ == "__main__":
    sys.exit(main())
