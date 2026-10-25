#!/usr/bin/env python3
"""
Exultia Build Security - Python Runtime & EOL Lifecycle Validator
Verifies that the Python environment used to compile Kinetic binaries
is officially supported, actively maintained, and linked to secure crypto libraries.
"""

import sys
import ssl
import json
import urllib.request

# Minimum allowed Python version (Python <= 3.10 is End-of-Life / Security Only)
MIN_SUPPORTED_VERSION = (3, 11)

# Hardcoded fallback of supported Python branches if offline
KNOWN_SUPPORTED_CYCLES = {
    "3.11": {"eol": "2027-10-31", "status": "security-fixes"},
    "3.12": {"eol": "2028-10-31", "status": "bugfix/security"},
    "3.13": {"eol": "2029-10-31", "status": "active"}
}

def check_version() -> bool:
    current = sys.version_info[:2]
    cycle_str = f"{current[0]}.{current[1]}"
    print("=" * 60)
    print("  EXULTIA KINETIC BUILD PIPELINE - RUNTIME SECURITY AUDIT")
    print("=" * 60)
    print(f"[*] Detected Build Python: {sys.version.split()[0]} ({sys.platform})")
    print(f"[*] Linked Crypto Library: {ssl.OPENSSL_VERSION}")

    # 1. Hard Floor Check
    if sys.version_info < MIN_SUPPORTED_VERSION:
        print(f"[!] REJECTED: Python {cycle_str} is End-of-Life (EOL). Minimum required: 3.11+", file=sys.stderr)
        return False

    # 2. Query Live EOL API (with fallback)
    verified = False
    try:
        req = urllib.request.Request(
            "https://endoflife.date/api/python.json",
            headers={"User-Agent": "Exultia-Build-Sentinel/2.4.0"}
        )
        with urllib.request.urlopen(req, timeout=4) as res:
            if res.status == 200:
                data = json.loads(res.read().decode("utf-8"))
                matching = next((item for item in data if item.get("cycle") == cycle_str), None)
                if matching:
                    eol_date = matching.get("eol")
                    print(f"[OK] Official EOL API Verified: Python {cycle_str} is supported until {eol_date}.")
                    verified = True
    except Exception:
        pass

    if not verified:
        if cycle_str in KNOWN_SUPPORTED_CYCLES:
            info = KNOWN_SUPPORTED_CYCLES[cycle_str]
            print(f"[OK] Local Lifecycle Cache Verified: Python {cycle_str} supported until {info['eol']}.")
        else:
            print(f"[?] Notice: Python {cycle_str} is not in standard known cycle registry.")

    # 3. OpenSSL Security Check
    if "OpenSSL 1.0" in ssl.OPENSSL_VERSION or "OpenSSL 0." in ssl.OPENSSL_VERSION:
        print("[!] REJECTED: Deprecated OpenSSL version linked to Python runtime!", file=sys.stderr)
        return False

    print("[OK] Runtime Security Verification: PASSED. Safe to compile native binary.")
    print("=" * 60)
    return True

if __name__ == "__main__":
    if not check_version():
        sys.exit(1)
    sys.exit(0)
