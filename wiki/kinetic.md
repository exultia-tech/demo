# Exultia Kinetic: Technical Documentation & API Reference

**Autonomous Zero-Downtime Hotfix Stream & Sub-Second Deterministic Rollback**

---

## 1. Quick-Start Guide

Exultia Kinetic provides two complementary modalities depending on your infrastructure requirements:
1. **Standalone Compiled Binary (Recommended)**: A self-contained, multi-arch native binary with no external dependencies.
2. **Streamed POSIX Shell Script (.sh)**: Pure shell script generated on-demand for environments without binary execution permissions.

### Option A: Standalone Native Binary

#### Linux / POSIX Installation
```bash
# 1. Download the standalone compiled binary
curl -fsSL https://exultia.tech/api/kinetic/download?platform=linux -o /usr/local/bin/kinetic

# 2. Grant executable permissions
chmod +x /usr/local/bin/kinetic

# 3. Verify cryptographic checksum and binary version
kinetic --version
# Output: kinetic 2.4.0

# 4. Execute self-contained end-to-end validation test
kinetic test
```

#### Windows Installation
```powershell
# In PowerShell (Run as Administrator):
Invoke-WebRequest -Uri "https://exultia.tech/api/kinetic/download?platform=windows" -OutFile "$env:ProgramFiles\Kinetic\kinetic.exe"
$env:Path += ";$env:ProgramFiles\Kinetic"

# Verify binary execution
kinetic.exe --version
kinetic.exe test
```

#### Apply Hotfixes Immediately
```bash
# Apply all active Critical and CISA KEV mitigations for the host OS
kinetic apply

# Target a specific CVE advisory (e.g., CVE-2024-3094)
kinetic apply --cve CVE-2024-3094

# Dry-run inspection without modifying any files
kinetic apply --dry-run
```

#### Sub-Second Deterministic Rollback
```bash
# Rollback a specific CVE mitigation
kinetic rollback --cve CVE-2024-3094

# Rollback the most recently applied mitigation
kinetic rollback --latest
```

---

### Option B: Streamed POSIX Shell Hotfix (.sh)

For zero-agent environments that do not allow foreign binaries, Kinetic streams an on-demand, validated POSIX shell script directly into your shell interpreter:

```bash
# Stream and apply hotfix with zero downtime:
curl -fsSL "https://exultia.tech/api/patches/feed?format=bash&os=ubuntu" | sudo sh

# Inspect the generated shell script before execution:
curl -fsSL "https://exultia.tech/api/patches/feed?format=bash&os=rocky" | less
```

---

### Option C: Autonomous Background Daemon & Systemd Timer

Kinetic includes an autonomous background runner that periodically polls the patch feed, applies critical hotfixes, probes canary health, and automatically rolls back if health metrics degrade.

#### Launch Daemon via CLI
```bash
kinetic daemon --interval 3600 --ring 0 --feed-url "https://exultia.tech/api/patches/feed"
```

#### Systemd Fleet Unit (`/etc/systemd/system/kinetic.service`)
```ini
[Unit]
Description=Exultia Kinetic Autonomous Zero-Agent Fleet Patch Sentinel
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
ExecStart=/usr/local/bin/kinetic daemon --interval 3600 --ring 0
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

#### Systemd Fleet Timer (`/etc/systemd/system/kinetic.timer`)
```ini
[Unit]
Description=Hourly Exultia Kinetic Hotfix Sync
Requires=kinetic.service

[Timer]
OnCalendar=hourly
Persistent=true

[Install]
WantedBy=timers.target
```

Enable and start the timer:
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now kinetic.timer
```

---

## 2. Extensive Product Details

### Architecture Overview

Exultia Kinetic operates on a three-tier remediation architecture designed for mission-critical infrastructure where reboots cause costly service interruptions.

```
 ┌────────────────────────────────────────────────────────┐
 │           Exultia Kinetic Remediation Engine           │
 └──────────────────────────┬─────────────────────────────┘
                            │
      ┌─────────────────────┼─────────────────────┐
      ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│    Tier 1     │     │    Tier 2     │     │    Tier 3     │
│ Hot-Mitigation│     │ Package Upgr. │     │ Fleet Ansible │
├───────────────┤     ├───────────────┤     ├───────────────┤
│ • Zero Reboot │     │ • Distro DNF  │     │ • 10% Canary  │
│ • Drop-in Cfg │     │ • APT / APK   │     │ • Multi-Host  │
│ • Dynamic Sys │     │ • Sys Package │     │ • Serialized  │
│ • <1s Rollback│     │ • Atomic Swap │     │ • Orchestrated│
└───────────────┘     └───────────────┘     └───────────────┘
```

### Key Capabilities

1. **Sub-Second Deterministic Rollback**: Before any system mutation, Kinetic computes pre-image SHA-256 hashes and captures atomic file backups in `~/.kinetic/snapshots/`. If an applied hotfix triggers a canary health degradation or verification failure, pre-image states are restored in under 50 milliseconds.
2. **SLSA Level 3 Provenance**: Every patch payload contains cryptographic attestation signed via Cosign keyless OIDC (`security@exultia.tech`) with immutable digests.
3. **Canary Ring Rollouts**:
   - **Ring 0 (Canary)**: Immediate deployment to 2% probe hosts with strict latency and error-rate monitoring.
   - **Ring 1 (Cautious)**: Deployed after 2 hours of healthy Ring 0 operation.
   - **Ring 2 (Broad)**: Fleet-wide promotion across all production nodes.
4. **Zero Reboot Guarantee**: All Tier 1 mitigations use dynamic kernel runtime flags (`sysctl`), configuration drop-ins (`/etc/ssh/sshd_config.d/`), iptables drop rules, or process reload signals (`systemctl reload`).

---

## 3. Complete API Documentation

### `GET /api/patches/feed`
Retrieves live hotfix advisories in JSON format or streamed POSIX shell script.

#### Request
- **Method**: `GET`
- **Path**: `/api/patches/feed`
- **Headers**:
  - `Accept`: `application/json` or `text/plain`
  - `Authorization`: `Bearer <TOKEN>` (optional for community tier)

#### Query Parameters
| Parameter | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `format` | string | No | Response format: `json` (default) or `bash` | `format=bash` |
| `os` | string | No | Target OS filter (`ubuntu`, `rocky`, `debian`, `rhel`, `alpine`) | `os=ubuntu` |
| `severity` | string | No | Filter by severity (`critical`, `high`, `medium`) | `severity=critical` |
| `limit` | integer| No | Max advisories returned (default: 50) | `limit=10` |

#### Response: JSON (`format=json`)
- **Status**: `200 OK`
- **Content-Type**: `application/json`

```json
{
  "status": "ok",
  "feedVersion": "2.0.0",
  "generatedAt": "2026-10-18T12:00:00.000Z",
  "totalActivePatches": 1,
  "patches": [
    {
      "id": "PAT-2024-3094",
      "cveId": "CVE-2024-3094",
      "title": "XZ Utils Backdoor in liblzma upstream tarballs",
      "severity": "CRITICAL",
      "cvss": 10.0,
      "cisaKev": true,
      "affectedDistros": ["debian", "ubuntu", "rocky", "rhel"],
      "publishedAt": "2024-03-29T00:00:00Z",
      "slaDeadline": "2024-03-29T04:00:00Z",
      "remediationTier": {
        "tier1_hotMitigation": {
          "summary": "Downgrade xz-utils and quarantine contaminated shared objects",
          "downtimeRequired": false,
          "commands": [
            "sh -c \"strings $(which xz) | grep -q '5.6.[01]' && echo 'COMPROMISED' || echo 'CLEAN'\"",
            "apt-get install -y --allow-downgrades xz-utils=5.4.5* liblzma5=5.4.5* 2>/dev/null || true"
          ],
          "verificationCommand": "xz --version",
          "rollbackCommand": "true"
        },
        "tier2_packageUpgrade": {
          "distroCommands": {
            "ubuntu": "apt-get update && apt-get install --only-upgrade -y xz-utils",
            "rocky": "dnf upgrade -y xz"
          }
        },
        "tier3_fleetAutomation": {
          "ansiblePlaybook": "---\n- name: Mitigate CVE-2024-3094\n  hosts: all\n  serial: \"10%\"\n  become: yes\n  tasks: ...\n"
        }
      },
      "provenance": {
        "slsaLevel": 3,
        "signedBy": "security@exultia.tech (Cosign OIDC Keyless)",
        "cosignDigest": "sha256:d8a2f4c1097893b...",
        "testValidation": {
          "exitCode": 0,
          "durationSec": 0.42,
          "targetEnv": "Linux Production (Multi-Arch)"
        }
      }
    }
  ]
}
```

#### Response: Streamed Shell Script (`format=bash`)
- **Status**: `200 OK`
- **Content-Type**: `text/plain; charset=utf-8`

```bash
#!/bin/sh
# Exultia Kinetic Patch Feed - Automated Fleet Remediation
# Generated on-demand for rapid enterprise response
set -e

log() { echo "[Exultia Kinetic] $(date +'%Y-%m-%d %H:%M:%S') $1"; }
warn() { echo "[Exultia Kinetic] WARNING: $1" >&2; }
err() { echo "[Exultia Kinetic] ERROR: $1" >&2; exit 1; }

if [ "$(id -u)" -ne 0 ]; then
  err "Root privileges required to execute kinetic remediations."
fi

log "Starting rapid patch synchronization..."
# Hotfix instructions follow with zero reboot requirements...
```

---

### `GET /api/kinetic/download`
Serves compiled standalone binaries and multi-arch platform packages.

#### Request
- **Method**: `GET`
- **Path**: `/api/kinetic/download`

#### Query Parameters
| Parameter | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `platform` | string | No | `linux` (ELF/zipapp), `windows` (PE32+), `all` | `platform=linux` |
| `format` | string | No | Set to `json` for machine-readable download manifest | `format=json` |

#### Manifest Response Example (`format=json`)
```json
{
  "name": "Exultia Kinetic Standalone Compiled Binary",
  "version": "2.4.0",
  "platforms": {
    "linux_amd64": {
      "filename": "kinetic",
      "url": "/api/kinetic/download?platform=linux",
      "sizeBytes": 93240,
      "sha256": "3a7b..."
    },
    "windows_amd64": {
      "filename": "kinetic.exe",
      "url": "/api/kinetic/download?platform=windows",
      "sizeBytes": 6842100,
      "sha256": "4f9c..."
    }
  }
}
```
