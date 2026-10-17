import urllib.request
import json

res = urllib.request.urlopen('http://localhost:3000/api/patches/feed')
data = json.loads(res.read().decode('utf-8'))

for p in data['patches']:
    pb = p['remediationTier']['tier3_fleetAutomation']['ansiblePlaybook']
    lines = pb.strip().split('\n')
    assert lines[0] == '---', f"Expected YAML doc start in {p['id']}"
    assert any('hosts:' in l for l in lines), f"Expected hosts key in {p['id']}"
    assert any('tasks:' in l for l in lines), f"Expected tasks key in {p['id']}"
    print(f"PLAYBOOK_VERIFIED: {p['id']} ({p['cveId']}) - {len(lines)} lines - Canary serial: {'serial:' in pb}")

print("ALL_PLAYBOOKS_VALID")
