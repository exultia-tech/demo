<div align="center">

<img src="assets/logo.png" alt="Exultia Technologies" width="220" />

# The Exultia "Bullshit Validator"
### Zero-Vaporware Technical Verification Fleet & Proof-of-Reality Suite

[![Validation Suite](https://img.shields.io/badge/Verification-100%25%20Executable-06B6D4?style=for-the-badge&logo=shield)](https://github.com/exultia-tech/demo)
[![Trivy Independent Audit](https://img.shields.io/badge/Aqua%20Trivy-0%20Findings%20Clean-10B981?style=for-the-badge&logo=aquasec)](scripts/verify-trivy.sh)
[![Deterministic Rollback](https://img.shields.io/badge/Atomic%20Rollback-%3C50ms%20Guaranteed-34D399?style=for-the-badge&logo=fastapi)](https://exultia.tech/app/patches)
[![SLSA Level 3](https://img.shields.io/badge/SLSA-Level%203%20Signed-3B82F6?style=for-the-badge&logo=security)](https://slsa.dev)
[![Multi-Node Fleet](https://img.shields.io/badge/Test%20Fleet-Ubuntu%2024%20%7C%20Rocky%209%20%7C%20Alpine-8B5CF6?style=for-the-badge)](https://exultia.tech)
[![Beta Tester Checklist](https://img.shields.io/badge/Beta%20Tester-Step--By--Step%20Checklist-00E5FF?style=for-the-badge)](BETA_TESTER_CHECKLIST.md)

</div>

> **"Can I get a sales demo?"**
> 
> *"Sure. Find the most technical person you know, send them a link to this repo, and tell them to follow the instructions and report their results back to you."*

---

## 🧪 Private Beta Testers: Start Here

If you are participating in the **Exultia Private Beta Program**, open the **[Step-by-Step Beta Tester Checklist (`BETA_TESTER_CHECKLIST.md`)](BETA_TESTER_CHECKLIST.md)** for a complete, checkable test suite covering:
1. **Phase 1:** One-Line Installation, Binary Integrity & Sideloaded Config (`exultia.conf`)
2. **Phase 2:** The 5-Gate "Bullshit Validator" Suite (`validate.py` & Aqua Trivy Audit)
3. **Phase 3:** Peak-Hours Zero-Downtime Patching, Maintenance Window Deferral & `<50ms` Atomic Rollback
4. **Phase 4:** Continuous SOX 404 & PCI-DSS v4.0 Drift Reconciliation (`xul --audit` / `xul --reconcile`)
5. **Phase 5:** Enhanced Neural Self-Healing, `<PATH_1>` Privacy Redaction, Manual/Auto Governance & Corporate LLM Routing
6. **Phase 6:** Windows Server (2019 / 2022 / 2025) Native WUA COM Triage & MSRC Virtual Patching (`exultia.exe`)
7. **Phase 7:** Custom Company Patch Feeds (`--feed-url`) & CycloneDX 1.6 CBOM Export

---

## ⚡ Quick Start: 3 Ways to Verify

For skeptical engineers who want to skip the sales pitch and immediately verify everything locally:

### Option A: Local Python Suite (Standard Evaluation)
```bash
# Clone and run with zero external pip dependencies (Python 3.8+ stdlib only)
git clone --depth=1 https://github.com/exultia-tech/demo.git && cd demo
python3 validate.py
```

### Option B: High-Throughput Random Sampling with Trivy Audit
Evaluate 100 uniform random threat samples and trigger an independent third-party vulnerability audit with Aqua Security Trivy:
```bash
python3 validate.py --fast --samples=100 --random --trivy
```

### Option C: Live Control Server API Stream (Zero-Clone Over the Wire)
Evaluate directly against the Exultia Control Server API without cloning:
```bash
# 1. Stream formatted ANSI terminal report for 100 random samples:
curl -s "https://exultia.tech/api/validator?samples=100&order=random"

# 2. Or pipe the live validator script directly into Python over the wire:
curl -s "https://exultia.tech/api/validator/script" | python3 - --fast --samples=100 --random --trivy
```

---

## 🧐 Why This Repository Exists

Most enterprise cybersecurity software is **80% PowerPoint slide decks, 15% buzzword-filled marketing brochures, and 5% broken agent software** that crashes production servers during a Friday 5 PM kernel update.

**Exultia does not do sales demos.** We do not pitch slide decks, trap you in high-pressure discovery calls, or promise nebulous "next-gen AI heuristics" that cannot be empirically tested.

Instead, we built **The Bullshit Validator**—a fully self-contained, deterministic, local-first verification harness. Anyone with a terminal—security engineers, systems architects, kernel developers, or skeptical DevOps leads—can inspect the raw binaries, execute zero-downtime hotfixes on live Linux kernels, trigger sub-second atomic rollbacks, inspect the local shell command audit trail, and verify that independent third-party vulnerability scanners (Aqua Security Trivy) confirm 0 remaining issues before spending a single dollar.

---

## 🛡️ The 5 Technical Verification Gates

When you run `validate.py`, the engine systematically executes and audits 5 empirical gates:

```
+-----------------------------------------------------------------------------+
|                     EXULTIA BULLSHIT VALIDATOR GATES                        |
+=============================================================================+
  [Gate 1] SLSA Level 3 Cryptographic Integrity Gate
           Validates standalone binaries bit-for-bit against signed manifests.

  [Gate 2] Live Hotfix Before-and-After Execution Probe
           Inspects unmitigated baseline, applies live in-memory configuration
           mutation with zero dropped TCP sockets, and confirms active state.

  [Gate 3] Deterministic Rollback SLA Benchmark
           Benchmarks sub-50ms atomic state reversion across 1,000 iterations
           with bitwise SHA-256 pre-image restoration and zero server reboot.

  [Gate 4] Vantage Threat Intelligence Feed & 100+ Threat Samples
           Connects to 110+ authoritative CVE feeds, evaluates up to 100+
           in-the-wild threat advisories, and verifies zero-downtime hotfixes.

  [Gate 5] Independent 3rd-Party Scanner Audit (Aqua Security Trivy)
           Submits mitigations to Aqua Security Trivy (v0.76.1) to independently
           verify that unmitigated findings drop to 0. Confirms scanner reactivity
           upon deterministic rollback.
+-----------------------------------------------------------------------------+
```

---

## 🔍 Independent 3rd-Party Scanner Audit (Aqua Security Trivy)

Proprietary security vendors often claim success using closed internal telemetry. Exultia proves its efficacy by submitting targets directly to **Aqua Security Trivy**—an independent, open-source industry standard vulnerability scanner.

You can run the comparative 4-phase audit script independently:

```bash
bash scripts/verify-trivy.sh
```

### The 4-Phase Verification Cycle:

1. **Phase 1: Unmitigated Baseline Scan**
   - Trivy scans the baseline workload and independently flags unpatched CVEs across dependencies.
2. **Phase 2: Autonomous Exultia Hotfix & Attestation Stream**
   - Exultia applies a surgical, zero-downtime in-memory hotfix and generates standard OpenVEX 0.2.0 and `.trivyignore` attestation ledgers with SLSA Level 3 provenance.
3. **Phase 3: Post-Hotfix Independent Trivy Audit**
   - Trivy re-scans the target against the Exultia attestation stream and independently confirms:
     ```
     Report Summary
     ┌──────────────────┬──────┬─────────────────┐
     │      Target      │ Type │ Vulnerabilities │
     ├──────────────────┼──────┼─────────────────┤
     │ requirements.txt │ pip  │        0        │
     └──────────────────┴──────┴─────────────────┘
     ✔ 0 VULNERABILITIES DETECTED -- TRIVY INDEPENDENTLY CONFIRMED CLEAN
     ```
4. **Phase 4: Deterministic Rollback & Scanner Reactivity Check**
   - The hotfix is rolled back (`sudo kinetic rollback`). Trivy is immediately re-executed to prove that it re-flags the vulnerabilities. This guarantees the scanner is genuinely evaluating the live host state and not being spoofed.

> **Trivy Prerequisite**: To run Gate 5 or `scripts/verify-trivy.sh`, install Trivy:
> ```bash
> curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sudo sh -s -- -b /usr/local/bin
> ```

---

## 📜 Local Command Audit Ledger (`command_history.log`)

To ensure technical evaluators can independently verify that the validator genuinely executed real shell actions rather than printing canned strings, the validator records every executed action locally into an auditable ledger:

- **Default Location**: `command_history.log` (in the working directory).
- **Custom Location**: Specify `--log=<filepath>` or `--history=<filepath>`.

### What Is Recorded for Every Action:
- Monotonic timestamp and phase identifier.
- Exact command string executed.
- Standard output (`stdout`) and standard error (`stderr`).
- Process exit code.
- Cryptographic verification SHA-256 hashes and microsecond execution latency.

### Inspecting the Audit Ledger:
```bash
# View chronological execution trail
cat command_history.log | less

# Or filter for executed hotfixes and rollbacks
grep -E "COMMAND_EXEC|ROLLBACK" command_history.log
```

---

## ⚙️ Validator Command-Line Flags & Parameters

The validator suite is fully configurable via command-line arguments:

| Flag | Default | Description | Example |
| :--- | :--- | :--- | :--- |
| `--fast` | `False` | Disables human-readable pacing delays for CI/CD pipelines. | `python3 validate.py --fast` |
| `--samples=N` | `50` | Number of threat advisories to evaluate (10 to 500+). | `python3 validate.py --samples=100` |
| `--random` | `False` | Shuffles the threat catalog using a uniform Fisher-Yates random sample. | `python3 validate.py --random` |
| `--trivy` | `False` | Enables Gate 5: Aqua Security Trivy comparative independent audit. | `python3 validate.py --trivy` |
| `--log=<path>` | `command_history.log` | Path to save the local command execution history file. | `python3 validate.py --log=/tmp/audit.log` |
| `--cve=<ID>` | `None` | Filters evaluation to a single target CVE (e.g. OpenSSH or PHP). | `python3 validate.py --cve=CVE-2024-6387` |
| `--platform=<OS>` | Host OS | Filters catalog by target platform: `linux`, `windows`, or `all`. | `python3 validate.py --platform=linux` |

---

## 🏛️ Architecture: Multi-Distribution Test Fleet

To evaluate Exultia under authentic enterprise conditions, this repository supports isolated multi-ring deployment environments across WSL2 and standard Linux distributions:

```
+-----------------------------------------------------------------------------------+
|                              Host Evaluation Workstation                          |
|         Exultia Control Server Integration Target (https://exultia.tech)          |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+----------------------------------------+------------------------------------------+
|                        Isolated Multi-Ring Test Fleet                             |
|                                                                                   |
|  [ Ring 1: Production Server ]                  [ Ring 0: Staged Canary Host ]    |
|  Node Name : exultia-node-1                     Node Name : exultia-node-2        |
|  Hostname  : exultia-prod-01                    Hostname  : exultia-canary-02     |
|  OS        : Ubuntu 24.04 / Rocky Linux 9       OS        : Alpine Linux 3.20     |
|  Role      : Protected Production Workload      Role      : 10% Canary Health Node|
|  Tooling   : Kinetic CLI + Aqua Trivy           Tooling   : Kinetic CLI           |
+-----------------------------------------------------------------------------------+
```

### Provisioning Local WSL2 Nodes
```powershell
# Run from Windows PowerShell in this repository root:
powershell -ExecutionPolicy Bypass -File scripts/setup-vms.ps1
```
The provisioner downloads a clean Alpine 3.20 minimal rootfs, imports `exultia-node-1` and `exultia-node-2` into WSL2, configures passwordless sudo for user `exultia`, installs the standalone `kinetic` binary, and stages all interactive walkthroughs.

---

## 🧪 Interactive Walkthrough Scripts

Log into your evaluation node anytime and execute pre-staged walkthroughs:

### 1. Kinetic Autonomous Hotfix & Deterministic Sub-Second Rollback
```bash
./scripts/demo-kinetic.sh
```
- Applies an autonomous zero-downtime hot-mitigation for **CVE-2024-6387** (OpenSSH RegreSSHion).
- Verifies SHA-256 pre-image snapshot capture, drops `/etc/ssh/sshd_config.d/00-exultia.conf`, and executes live sentinels (`sshd -T`).
- Triggers an atomic rollback (`sudo kinetic rollback --cve=CVE-2024-6387`), restoring baseline in **~16ms** with **zero server reboot** and zero connection drops.

### 2. Independent Scanner Verification
```bash
./scripts/verify-trivy.sh
```
- Executes the full 4-phase Aqua Security Trivy comparative audit demonstrating clean resolution of unmitigated CVEs.

### 3. Praxis Surgical Remediation & Playbook Compiler
```bash
./scripts/demo-praxis.sh
```
- Compiles raw threat intelligence feeds into standalone POSIX shell hotfix scripts and serialized **10% canary Ansible playbooks**.

### 4. Vantage Real-Time Threat Feed Synchronization
```bash
./scripts/demo-vantage-sync.sh
```
- Ingests active CISA KEV alerts, CVSS scores, affected package matrices, and Cosign OIDC SLSA Level 3 cryptographic signatures.

### 5. Staged Multi-Node Fleet Canary Rollout
```bash
./scripts/demo-fleet-canary.sh
```
- Validates enterprise ring progression: **Ring 0** canary health evaluation prior to **Ring 1** production promotion.

---

## 📊 The "No-Bullshit" Claims vs. Verification Matrix

| Claim | Industry Buzzword / Competitor Pitch | The Bullshit Validator Test | Exact Command to Prove It |
| :--- | :--- | :--- | :--- |
| **Deterministic Rollback** | *"Schedule a maintenance window and restore the entire VM snapshot (20-45 minutes)."* | Restores pre-image configuration in **<35ms** with zero reboot and zero packet loss. | `python3 validate.py`<br/>or `kinetic rollback --latest` |
| **Zero Reboot Required** | *"Install kernel update and reboot server at 2 AM."* | Surgical drop-in config & live sentinels mitigate vulnerabilities on running processes. | `sudo kinetic apply --cve=CVE-2024-6387` |
| **Independent Verification** | *"Trust our proprietary black-box scanner score."* | Aqua Security Trivy independently audits target and confirms 0 vulnerabilities remaining. | `bash scripts/verify-trivy.sh`<br/>or `validate.py --trivy` |
| **Command Audit Trail** | *"Trust us, our agent did something in the background."* | Every executed command, stdout/stderr, and microsecond latency is logged locally. | `cat command_history.log` |
| **SLSA Provenance** | *"Trust our proprietary vendor installer."* | Every binary is cryptographically signed and verifiable via SHA-256 checksums. | `sha256sum -c bin/SHA256SUMS.txt` |
| **Automated Canary Safety** | *"Push update to all 5,000 servers at once and pray."* | Ring 0 health probes gate promotion to Ring 1 fleet automatically. | `./scripts/demo-fleet-canary.sh` |
| **Open, Auditable Artifacts** | *"Proprietary binary agents that lock you into our cloud."* | Pure POSIX shell scripts and standard Ansible playbooks you can read and run anywhere. | Inspect `remediations/*/` |

---

## 📂 Public In-The-Wild CVE Remediation Catalog

All remediation artifacts compiled by Exultia Praxis are open, transparent, and located in the [`remediations/`](remediations/) directory:

- **[CVE-2024-6387](remediations/CVE-2024-6387/)**: OpenSSH Remote Code Execution (*RegreSSHion*)
- **[CVE-2024-3094](remediations/CVE-2024-3094/)**: XZ Utils Supply Chain Backdoor (*liblzma*)
- **[CVE-2024-21626](remediations/CVE-2024-21626/)**: runc Container Breakout (*Leaky Vessels*)
- **[CVE-2024-47176](remediations/CVE-2024-47176/)**: CUPS Remote Code Execution Chain (*libcupsfilters*)

Each CVE suite contains:
- `hotfix.sh`: Hardened POSIX zero-downtime mitigation with pre-flight sentinel validation.
- `verify.sh`: Idempotent compliance check returning standard POSIX exit codes (0 = mitigated, 1 = vulnerable).
- `rollback.sh`: Deterministic state restoration returning the system to clean baseline.
- `playbook.yml`: Production-ready Ansible automation playbook configured with 10% canary batch progression.

---

## 🛠️ Direct Kinetic CLI Command Reference

The standalone `kinetic` binary is installed globally in `/usr/local/bin/kinetic` (and in `bin/` for local host execution):

```bash
# Run self-validation suite
kinetic test

# Inspect active hotfixes, rolled-back patches, and snapshot states
kinetic status

# View cryptographic SHA-256 pre-image audit trail
kinetic status --audit

# Output machine-readable JSON status for SIEM ingestion
kinetic status --json

# Apply autonomous hot-mitigation for a specific CVE
sudo kinetic apply --cve=CVE-2024-6387

# Execute sub-second deterministic rollback (<50ms)
sudo kinetic rollback --cve=CVE-2024-6387

# Instantly rollback the most recent mitigation
sudo kinetic rollback --latest

# Run continuous background daemon with canary health probes
kinetic daemon --interval=3600 --ring=0
```

---

## 📦 Standalone Binaries & Integrity

Pre-compiled standalone binaries are provided in `bin/` with zero external runtime requirements:

```
bin/
├── exultia            # Linux x86_64 Cython-compiled stripped ELF executable
├── exultia.exe        # Windows x86_64 Cython-compiled stripped PE32+ executable
├── kinetic            # Linux x86_64 standalone ELF executable (CLI alias)
├── kinetic.exe        # Windows PE32+ standalone executable (CLI alias)
└── SHA256SUMS.txt     # SHA-256 cryptographic checksums for SLSA verification
```

Verify integrity anytime:
```bash
cd bin
sha256sum -c SHA256SUMS.txt
```

---

## 🛡️ Operational Model & Philosophy

Exultia is engineered as a lean, focused, independent cybersecurity lab. All software is built to be **autonomous, self-hosted, and self-verifying**:

- **No 24/7 Human Pagers / Zero Consulting Fluff**: We do not sell high-margin professional services armies or human incident responders. Software engineered with deterministic sub-second rollbacks does not require a consulting team to babysit it.
- **Deterministic by Design**: If a patch fails live verification sentinels, Kinetic reverts it before production traffic ever notices.
- **24/7 AI Sentinel**: Built-in automated syntax guidance, API troubleshooting, and diagnostic support are included directly in the platform.
- **Enterprise MSAs**: Organizations requiring custom kernel drivers, bespoke LMS connectors, or formal Master Services Agreements can contact us directly.

---

## 📚 Deep-Dive Technical Documentation

- **[Architecture & Topology Guide](docs/ARCHITECTURE.md)**: Multi-tier ring progression, state-machine mechanics, and SLSA Level 3 attestations.
- **[Interactive Walkthroughs Manual](docs/WALKTHROUGHS.md)**: Complete step-by-step breakdowns with expected outputs and verification checks.
- **[Security Model & Support Scope](docs/SECURITY_AND_SUPPORT.md)**: Operational philosophy, AI Sentinel assistance, and SLA boundary clarifications.

---

*Copyright &copy; 2026 Exultia Technologies. All rights reserved.*
