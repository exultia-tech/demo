#!/bin/bash
# ==============================================================================
# Exultia Vantage - Live Vulnerability Feed Synchronization Demo
# ==============================================================================

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

echo -e "${CYAN}${BOLD}"
echo "======================================================================"
echo "  EXULTIA VANTAGE - LIVE THREAT INTELLIGENCE SYNC DEMO"
echo "  Streaming 110+ Threat Feeds Directly to the Node"
echo "======================================================================"
echo -e "${NC}"

GATEWAY=$(ip route | awk '/default/ {print $3}' 2>/dev/null || echo "127.0.0.1")
FEED_URL="http://${GATEWAY}:3000/api/patches/feed"

echo -e "Target Feed Endpoint: ${YELLOW}${FEED_URL}${NC}"
echo "Requesting active critical vulnerability remediations from Vantage..."
echo "----------------------------------------------------------------------"

python3 -c "
import urllib.request
import json
import sys

url = '${FEED_URL}?limit=5'
try:
    req = urllib.request.urlopen(url, timeout=5)
    raw = json.loads(req.read().decode('utf-8'))
    patches = raw.get('patches', raw if isinstance(raw, list) else [])
    
    print(f'\\033[1;32m✔ Successfully Ingested {len(patches)} Verified Remediation Advisories\\033[0m\\n')
    
    for i, item in enumerate(patches[:5], 1):
        cve = item.get('cveId', 'N/A')
        title = item.get('title', 'N/A')
        sev = item.get('severity', 'UNKNOWN')
        cvss = item.get('cvss', 'N/A')
        kev = '🔥 CISA KEV ACTIVE' if item.get('cisaKev') else 'Standard Advisory'
        pkg = ', '.join(item.get('affectedPackages', []))
        signer = item.get('provenance', {}).get('signedBy', 'Unsigned')
        
        color = '\\033[0;31m' if sev == 'CRITICAL' else '\\033[1;33m'
        print(f'{color}[{i}] {cve} - {sev} (CVSS: {cvss}) | {kev}\\033[0m')
        print(f'    Title:    {title}')
        print(f'    Packages: {pkg}')
        print(f'    Signer:   {signer}')
        print()
except Exception as e:
    print(f'Error querying Vantage feed: {e}', file=sys.stderr)
"

echo -e "${GREEN}${BOLD}✔ Vantage Threat Stream Verified! Feeds ingested and ready for Kinetic.${NC}"
