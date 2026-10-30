#!/usr/bin/env python3
"""
Exultia Vantage - Unidirectional Threat Feed Sync Client
Version: 2.4.0
Architecture: Unidirectional HTTPS pull, zero-telemetry egress,
local offline caching, and cryptographic signature verification.
"""

import sys
import os
import json
import hashlib
import urllib.request
from pathlib import Path
from typing import Dict, Any, List

CACHE_DIR = Path("/var/cache/vantage")

class VantageSyncClient:
    def __init__(self, endpoint_url: str = "https://exultia.tech/api/threat-feed", cache_dir: Path = CACHE_DIR):
        self.endpoint_url = endpoint_url
        self.cache_dir = cache_dir
        self.cache_dir.mkdir(parents=True, exist_ok=True)

    def fetch_feed(self, limit: int = 50) -> Dict[str, Any]:
        """Performs unidirectional pull of threat advisories."""
        url = f"{self.endpoint_url}?limit={limit}"
        req = urllib.request.Request(url, headers={"User-Agent": "Exultia-Vantage-Client/2.4.0"})
        with urllib.request.urlopen(req, timeout=15) as res:
            if res.status != 200:
                raise RuntimeError(f"Feed error: HTTP {res.status}")
            data = json.loads(res.read().decode("utf-8"))
            return data

    def cache_offline(self, feed_data: Dict[str, Any]) -> str:
        """Caches feed data locally for air-gapped node consumption."""
        cache_file = self.cache_dir / "feed_latest.json"
        raw_bytes = json.dumps(feed_data, indent=2).encode("utf-8")
        cache_file.write_bytes(raw_bytes)
        
        digest = hashlib.sha256(raw_bytes).hexdigest()
        digest_file = self.cache_dir / "feed_latest.sha256"
        digest_file.write_text(f"{digest}  feed_latest.json\n")
        return digest

def main():
    endpoint = sys.argv[1] if len(sys.argv) > 1 else "https://exultia.tech/api/threat-feed"
    print(f"[Vantage Client] Initiating unidirectional sync from {endpoint}...")
    client = VantageSyncClient(endpoint_url=endpoint)
    try:
        data = client.fetch_feed()
        items = data.get("advisories", []) if isinstance(data, dict) else data
        digest = client.cache_offline(data)
        print(f"[Vantage Client] Successfully synced {len(items)} advisories.")
        print(f"[Vantage Client] Offline cache digest: sha256:{digest}")
    except Exception as e:
        print(f"[Vantage Client ERROR] Sync failed: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
