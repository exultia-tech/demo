import urllib.request
import json
import time

t0 = time.time()
with urllib.request.urlopen("http://localhost:3000/api/patches/feed?source=vantage&limit=1000") as resp:
    data = json.loads(resp.read().decode('utf-8'))
dur = time.time() - t0

print(f"HTTP Status: {resp.status}")
print(f"Status: {data['status']}")
print(f"Total Active Patches Returned: {data['totalActivePatches']}")
print(f"Response Time: {dur:.3f}s")
print(f"Sample Patch ID: {data['patches'][0]['id']}")
print(f"Sample Patch Rollback: {data['patches'][0]['remediationTier']['tier1_hotMitigation']['rollbackCommand']}")
print(f"Sample Vantage Patch ID: {data['patches'][5]['id']}")
print(f"Sample Vantage Patch Rollback: {data['patches'][5]['remediationTier']['tier1_hotMitigation']['rollbackCommand']}")

# Now test bash format with limit=100
t1 = time.time()
with urllib.request.urlopen("http://localhost:3000/api/patches/feed?format=bash&source=vantage&limit=100") as resp_b:
    bash_text = resp_b.read().decode('utf-8')
dur_b = time.time() - t1
print(f"\nBash Payload Size: {len(bash_text)} bytes")
print(f"Bash Generation Time: {dur_b:.3f}s")
print(f"Bash Line Count: {len(bash_text.splitlines())}")
print(f"Contains 'Zero reboot required': {'Zero reboot required' in bash_text}")
