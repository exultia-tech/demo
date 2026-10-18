# Exultia Security Suite - Live Demos & Multi-Node Test Fleet

[![Exultia Security](https://img.shields.io/badge/Exultia-Security%20Suite-06B6D4?style=for-the-badge&logo=shield)](https://exultia.tech)
[![SLSA Level 3](https://img.shields.io/badge/SLSA-Level%203%20Signed-34D399?style=for-the-badge&logo=security)](https://slsa.dev)
[![Sub-Second Rollback](https://img.shields.io/badge/Deterministic%20Rollback-%3C100ms-3B82F6?style=for-the-badge)](https://exultia.tech/app/patches)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-8B5CF6?style=for-the-badge)](https://exultia.tech/account/subscription)

This repository contains the interactive demonstration suites, test fixtures, standalone binaries, and automated provisioning harnesses for testing the **Exultia Cybersecurity Product Suite** firsthand inside real, isolated Linux virtual environments.

---

## 🏛️ Architecture Overview

The Exultia test harness simulates an enterprise production fleet using two isolated, local-first Linux nodes running in WSL2:

```
+-----------------------------------------------------------------------------------+
|                              Windows Host Workstation                             |
|  Exultia Web Console & Vantage Threat Intelligence Feed (http://127.0.0.1:3000)   |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+----------------------------------------+------------------------------------------+
|                        WSL2 Isolated Test Fleet                                   |
|                                                                                   |
|  [ Ring 1: Production Server ]                  [ Ring 0: Staged Canary Host ]    |
|  Node Name : exultia-node-1                     Node Name : exultia-node-2        |
|  Hostname  : exultia-prod-01                    Hostname  : exultia-canary-02     |
|  OS        : Alpine Linux 3.20 (x86_64)         OS        : Alpine Linux 3.20     |
|  Role      : Protected Production Node          Role      : 10% Canary Health Node|
|  Tooling   : Kinetic CLI v2.4.0                 Tooling   : Kinetic CLI v2.4.0    |
+-----------------------------------------------------------------------------------+
```

### Included Product Demonstrations

1. **[Kinetic](https://exultia.tech/app/patches)**: Autonomous zero-downtime patch streaming daemon and sub-second deterministic rollback engine.
2. **[Praxis](https://exultia.tech/app/praxis)**: Surgical CVE remediation compiler translating raw threat advisories into hardened POSIX scripts and serialized Ansible playbooks.
3. **[Vantage](https://exultia.tech/app/threat-feed)**: Universal vulnerability feed aggregator streaming 110+ threat sources, CISA KEV alerts, and CVSS 9.8+ intelligence.
4. **[Axiom](https://exultia.tech/app/axiom)**: Cybersecurity certification exam simulator, portable academic transcript exports (CSV/JSON/HTML), and LMS API connectors.

### 📚 In-Depth Technical Documentation
- **[Architecture & Topology Guide](docs/ARCHITECTURE.md)**: Multi-tier ring progression, state-machine mechanics, and SLSA Level 3 attestations.
- **[Interactive Walkthroughs Manual](docs/WALKTHROUGHS.md)**: Complete step-by-step breakdowns with expected outputs and verification checks.
- **[Security Model & Support Scope](docs/SECURITY_AND_SUPPORT.md)**: Operational philosophy, AI Sentinel assistance, and SLA boundary clarifications.

---

## 🚀 Instant Access Guide

Both test VMs are already provisioned and running locally on your workstation. You can log into either VM instantly from any PowerShell, Windows Terminal, or command prompt window:

### Log into Node 1 (Production Server)
```powershell
wsl -d exultia-node-1
```
*(To exit the VM anytime, simply type `exit`)*

### Log into Node 2 (Canary Staging Node)
```powershell
wsl -d exultia-node-2
```

> **User Credentials**: Both nodes log in as default user `exultia` with **passwordless `sudo` privileges** enabled.

---

## 🧪 Interactive Validation Walkthroughs

Four automated walkthrough scripts are pre-staged in `/home/exultia/` on both nodes:

### Walkthrough 1: Kinetic Autonomous Hotfix & Sub-Second Deterministic Rollback
```bash
./demo-kinetic.sh
```
- **What this validates**:
  1. Inspects the baseline host security posture.
  2. Applies an emergency zero-downtime hot-mitigation for **CVE-2024-6387** (OpenSSH RegreSSHion).
  3. Verifies that Kinetic snapshots the pre-image with SHA-256 integrity, deploys `/etc/ssh/sshd_config.d/00-exultia-regrsshion-fix.conf`, and executes the live verification sentinel (`sshd -T`).
  4. Triggers an atomic **deterministic rollback** (`sudo kinetic rollback --cve=CVE-2024-6387`), restoring the clean baseline state in **~10ms** with zero reboot or service disruption.

---

### Walkthrough 2: Vantage Real-Time Threat Feed Synchronization
```bash
./demo-vantage-sync.sh
```
- **What this validates**:
  - Connects from the VM directly to your local Exultia threat feed server (`http://172.31.240.1:3000/api/patches/feed`).
  - Ingests active CISA KEV exploits, CVSS scores, affected package matrices, and Cosign OIDC SLSA Level 3 cryptographic signatures.

---

### Walkthrough 3: Praxis Surgical Remediation & Playbook Compiler
```bash
./demo-praxis.sh
```
- **What this validates**:
  - Compiles raw vulnerability advisories into:
    1. Standalone hardened POSIX shell hotfix scripts with pre/post sentinels.
    2. Serialized **10% canary Ansible playbooks** ready for enterprise configuration management tools.

---

### Walkthrough 4: Staged Multi-Node Fleet Canary Rollout
```bash
./demo-fleet-canary.sh
```
- **What this validates**:
  - Evaluates multi-tier enterprise ring progression:
    - **Ring 0 (`exultia-canary-02`)**: Evaluates hot-mitigations against live health probes prior to fleet promotion.
    - **Ring 1 (`exultia-prod-01`)**: Production workloads are insulated from unverified changes until canary gates pass.

---

## 🛠️ Direct Kinetic CLI Reference

The standalone `kinetic` binary is installed globally in `/usr/local/bin/kinetic`:

| Command | Purpose |
| :--- | :--- |
| `kinetic test` | Run the automated end-to-end self-validation test (snapshotting + rollback verification). |
| `kinetic status` | Inspect active mitigations, rolled-back patches, and snapshot count. |
| `kinetic status --audit` | Display cryptographic SHA-256 audit trail and pre-image state history. |
| `kinetic status --json` | Output machine-readable JSON status for SIEM or monitoring ingestion. |
| `sudo kinetic apply --cve=CVE-2024-6387` | Apply autonomous hot-mitigation from the live threat feed. |
| `sudo kinetic rollback --cve=CVE-2024-6387` | Deterministically revert mitigation to verified pre-image baseline in <100ms. |
| `sudo kinetic rollback --latest` | Instantly revert the most recently applied mitigation. |
| `kinetic daemon --interval=3600 --ring=0` | Start autonomous background patch daemon with canary health probes. |

---

## 📦 Standalone Binaries & Cryptographic Checksums

Pre-compiled standalone binaries are located in the `bin/` directory:

```
bin/
├── kinetic            # Linux x86_64 standalone executable / zipapp
├── kinetic.exe        # Windows PE32+ standalone executable (compiled with PyInstaller)
├── kinetic.pyz        # Universal cross-platform Python zipapp
└── SHA256SUMS.txt     # SHA-256 cryptographic checksums for SLSA verification
```

### Verification
```bash
cd bin
sha256sum -c SHA256SUMS.txt
```

---

## 🔄 Re-Provisioning the Test Fleet

To re-provision or deploy the test fleet onto another Windows machine:

```powershell
# Run from PowerShell in this repository root
pwsh -ExecutionPolicy Bypass -File scripts/setup-vms.ps1
```

The script automatically downloads the minimal rootfs tarball, imports both VMs into WSL2, installs packages, deploys the standalone binaries, and configures default users and hostnames.

---

## 🛡️ Operational Model & Support Policy

Exultia is engineered as a lean, focused, independent cybersecurity lab. All software is built to be **autonomous, self-hosted, and self-verifying**:

- **Zero Human SLAs / No 24/7 Pagers**: Standard software licenses and feeds do not include human uptime SLAs or on-call incident paging.
- **Deterministic Software**: Sub-second local rollbacks and automated pre-flight regression sentinels eliminate production deployment fear.
- **24/7 Autonomous AI Sentinel**: Automated technical assistance, syntax guidance, and installation help are available 24/7 via the built-in AI Support Agent.
- **Enterprise MSAs**: Organizations requiring bespoke integrations or legally binding uptime SLAs require a separately negotiated Master Services Agreement (MSA).

---

*Copyright &copy; 2026 Exultia Technologies. All rights reserved.*
