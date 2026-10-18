# Exultia Praxis: Technical Documentation & API Reference

**Tactical Adversary Emulation, Fleet Defense & Verified Remediation Playbooks**

---

## 1. Quick-Start Guide

Exultia Praxis bridges the gap between threat intelligence from Vantage and automated fleet execution, generating validated Ansible playbooks and simulation scenarios.

### Fetch Tactical Remediation Feed
```bash
curl -s "https://exultia.tech/api/praxis/feed?target=rhel9" | jq .
```

### Synthesize an On-Demand Hardening Playbook (cURL)
```bash
curl -X POST "https://exultia.tech/api/praxis/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "cveId": "CVE-2024-3094",
    "targetPlatform": "rocky",
    "automationFormat": "ansible",
    "canaryPercentage": 10
  }' | jq -r .playbookYaml > mitigate_xz.yml
```

---

## 2. Extensive Product Details

### Capabilities & Simulation Pipeline

```
 ┌────────────────────────────────────────────────────────┐
 │           Vantage Telemetry & Threat Vectors           │
 └──────────────────────────┬─────────────────────────────┘
                            │
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │         Praxis Playbook Synthesis & Verification       │
 │   - Generates Ansible YAML with `serial: 10%` canary   │
 │   - Distro-specific syntax validation (APT, DNF, APK)  │
 │   - Dry-run verification before fleet dissemination    │
 └──────────────────────────┬─────────────────────────────┘
                            │
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │            Enterprise Orchestration Engines            │
 │             (AWX, Ansible Tower, Terraform)            │
 └────────────────────────────────────────────────────────┘
```

---

## 3. Complete API Documentation

### `GET /api/praxis/feed`
Returns tactical remediation strategies indexed by operating system.

#### Query Parameters
| Parameter | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `target` | string | No | Filter by OS platform (`ubuntu`, `rocky`, `alpine`, `windows`) | `target=ubuntu` |

---

### `POST /api/praxis/generate`
Synthesizes verified automation playbooks for immediate deployment.

#### Request Schema
```json
{
  "cveId": "CVE-2024-47176",
  "targetPlatform": "ubuntu",
  "automationFormat": "ansible",
  "canaryPercentage": 15
}
```

#### Response Example
```json
{
  "status": "success",
  "cveId": "CVE-2024-47176",
  "format": "ansible",
  "playbookYaml": "---\n- name: Neutralize CUPS RCE\n  hosts: all\n  serial: \"15%\"\n  become: yes\n  tasks:\n    - name: Disable cups-browsed\n      systemd:\n        name: cups-browsed\n        state: stopped\n        enabled: no\n"
}
```
