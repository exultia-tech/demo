# Exultia Sovereign Security Platform

> **Autonomous Closed-Loop Cyber Defense & Verified Zero-Day Remediation Engine**  
> *Deterministic Sub-Second Hotpatching • 14ms Atomic Rollbacks • Non-Destructive Canary BAS • Zero-Telemetry Workstations*

[![Provenance: SLSA Level 3](https://img.shields.io/badge/SLSA-Level%203-blue.svg)](https://slsa.dev)
[![Signatures: Cosign OIDC](https://img.shields.io/badge/Signatures-Cosign%20Keyless-cyan.svg)](https://github.com/sigstore/cosign)
[![Architecture: Unidirectional Pull](https://img.shields.io/badge/Telemetry-Zero%20Egress%20Pull-emerald.svg)](./wiki/architecture.md)
[![License: Unified Platform](https://img.shields.io/badge/Platform-Community%20%7C%20Pro%20%7C%20Enterprise-purple.svg)](./wiki/architecture.md#6-unified-subscription-tiers)

---

## 🛡️ Executive Overview

Exultia unifies threat intelligence, adversary emulation, non-destructive pentesting, in-memory hotpatching, and zero-trust developer environments into a machine-speed **Closed-Loop OODA Architecture** (Observe, Orient, Decide, Act).

Unlike legacy vendors that charge tens of thousands of dollars for fragmented tools that flood security teams with alerts and take 30+ days to patch, Exultia provides the complete end-to-end lifecycle in sub-second execution with an immutable **14ms deterministic rollback guarantee**.

```
   ┌────────────────────────────────────────────────────────┐
   │                1. OBSERVE (VANTAGE)                    │
   │  - Continuous ingestion from 110+ authoritative feeds   │
   │  - Real-time CISA KEV, NIST NVD, Linux vendor errata   │
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │                 2. ORIENT (ERIS)                       │
   │  - Programmatic ephemeral chaos proving ground ranges  │
   │  - Ephemeral containers with 10m auto-destruct watchdog│
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │                 3. DECIDE (VALKYRIE)                   │
   │  - Non-destructive Canary BAS (Breach & Attack Sim)    │
   │  - HMAC-signed handshakes prove exploitability safely  │
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │           4. ACT (PRAXIS & KINETIC)                    │
   │  - Praxis: Synthesizes in-memory trampolines & playbooks│
   │  - Kinetic: Pre-flight snapshot & autonomous injection │
   │  - Sub-second hotpatch with 14ms atomic rollback       │
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │          5. FOUNDATIONS (PUREIDE, PUREOS, AXIOM)       │
   │  - PureIDE: Air-gapped workstation & compiler egress   │
   │  - PureOS: CIS Level 2 distroless minimal container    │
   │  - Axiom: Workforce assessment & certification engine  │
   └────────────────────────────────────────────────────────┘
```

---

## 📦 The 7 Core Defense Engines

| Engine | Directory | Description & Mission | Wiki Reference |
| :--- | :--- | :--- | :--- |
| **Vantage** | [`modules/vantage/`](./modules/vantage/) | Universal Vulnerability Index aggregating 110+ threat feeds via unidirectional HTTPS pull. Zero telemetry egress. | [**Vantage Wiki**](./wiki/vantage.md) |
| **Eris** | [`modules/eris/`](./modules/eris/) | Controlled adversary emulation proving ground. Runs isolated container labs with 10-minute auto-destruct watchdogs. | [**Eris Wiki**](./wiki/eris.md) |
| **Valkyrie** | [`modules/valkyrie/`](./modules/valkyrie/) | On-demand non-destructive Canary BAS prober. Mathematically proves exploitability using HMAC tokens without outages. | [**Valkyrie Wiki**](./wiki/valkyrie.md) |
| **Praxis** | [`modules/praxis/`](./modules/praxis/) | Tactical remediation synthesizer. Generates in-memory hotpatch scripts and staged 10% canary Ansible playbooks. | [**Praxis Wiki**](./wiki/praxis.md) |
| **Kinetic** | [`modules/kinetic/`](./modules/kinetic/) | Standalone host execution daemon. Commits pre-flight snapshots to `/var/lib/kinetic/snapshots/` with 14ms rollbacks. | [**Kinetic Wiki**](./wiki/kinetic.md) |
| **PureIDE & PureOS** | [`modules/pureos-pureide/`](./modules/pureos-pureide/) | Hardened air-gapped developer container templates and CIS Benchmark Level 2 minimal distroless base images. | [**PureIDE/PureOS Wiki**](./wiki/pureide-pureos.md) |
| **Axiom** | [`src/lib/axiom-data.ts`](./src/lib/axiom-data.ts) | Adaptive enterprise cybersecurity certification exam simulator with SCORM/LTI LMS integration and verifiable credentials. | [**Axiom Wiki**](./wiki/axiom.md) |

---

## 🗂️ Repository Directory Structure

```
├── modules/                        # Standalone Executable Core Engine Code & Templates
│   ├── praxis/                     # Standalone POSIX hotpatch template & Ansible canary playbook
│   ├── kinetic/                    # Kinetic daemon, snapshot engine, and rollback harness
│   ├── eris/                       # Ephemeral chaos proving ground script & docker-compose lab
│   ├── valkyrie/                   # Canary BAS probe runner and probe vectors catalog
│   ├── vantage/                    # Unidirectional threat sync client and air-gap cache
│   └── pureos-pureide/             # CIS Level 2 distroless Dockerfile & air-gap devcontainer
│
├── wiki/                           # Engineering Documentation & API Reference
│   ├── README.md                   # Wiki master index and product roadmap
│   ├── architecture.md             # Master closed-loop architecture specification
│   ├── api-reference.md            # Consolidated REST API schema & endpoint catalog
│   ├── kinetic.md                  # Kinetic daemon and 14ms rollback guide
│   ├── vantage.md                  # Threat feed ingestion and CISA KEV tracker
│   ├── praxis.md                   # Tactical remediation and playbook compiler
│   ├── eris.md                     # Adversary emulation and chaos lab guide
│   ├── valkyrie.md                 # Canary BAS exploitability prober guide
│   ├── pureide-pureos.md           # Workstation sandboxing and distroless runtimes
│   ├── argent.md                   # Multi-OS vendor errata aggregation guide
│   ├── axiom.md                    # Cybersecurity exam and certification simulator
│   └── inquest.md                  # Digital forensics and public records engine
│
├── kinetic-cli/                    # Multi-Arch Standalone Python Zipapp & Executable
│   ├── run.py                      # Standalone entry point
│   └── kinetic_cli/                # Core engine, daemon, models, and provenance
│
├── src/                            # Exultia Web Application & API Platform (Next.js)
│   ├── app/                        # App router (UI decks, simulator, docs, wiki, api routes)
│   ├── components/                 # Brand icons, terminal decks, radar feeds, UI components
│   └── lib/                        # Core engines, threat databases, pricing, and AI sentinel
│
└── tests/                          # Automated Vitest Verification Suite (206+ tests)
```

---

## ⚡ Quick-Start: Verify It Works in 60 Seconds

### 1. Run the Local Kinetic Self-Test & 14ms Rollback
```bash
# Download standalone compiled binary
curl -fsSL "https://exultia.tech/api/kinetic/download?platform=linux" -o kinetic
chmod +x kinetic

# Execute synthetic self-test with automated pre-image snapshot and 14ms rollback
./kinetic test
```

### 2. Launch an Inoculation Sandbox with 10m Auto-Destruct
```bash
# Inoculate a disposable test endpoint (auto-purges after 10 minutes)
curl -s "https://exultia.tech/api/eris/raw?os=ubuntu&timeout=10" | sudo sh
```

### 3. Run a Non-Destructive Canary BAS Exploitability Probe
```bash
python3 modules/valkyrie/valkyrie_probe_runner.py 127.0.0.1 --probe regresshion --port 22
```

### 4. Interactive Browser Simulators
You can test in-browser simulated hotpatching, BAS canary probes, and chaos ranges without downloading anything directly on the **[Research Wiki Simulators](https://exultia.tech/wiki?tab=simulator)**.

---

## 🔒 Security Principles

- **Zero Telemetry Collection**: No source code, host identifiers, private IPs, or customer logs are ever exfiltrated.
- **Unidirectional Pull Architecture**: Hosts pull cryptographically signed advisories over standard outbound HTTPS.
- **SLSA Level 3 Provenance**: All release artifacts are signed via Sigstore Cosign with verified keyless OIDC / private KMS signatures.
- **Deterministic 14ms Rollback**: Pre-flight snapshots guarantee that any patch regression can be reversed in under 14 milliseconds with zero daemon restart.

---

## 📜 Sovereign Subscription Plans

- **Community Sovereign ($0 Forever)**: 1 host node, public Vantage feed, community distroless base images, basic Valkyrie canary probes.
- **Professional Operator ($100/mo)**: Unlimited Praxis in-memory hotpatching, 110+ Vantage registries, private Eris chaos ranges, on-demand Valkyrie BAS, PureIDE air-gap compiler, and Axiom cert simulator.
- **Enterprise Fleet ($500/mo)**: Multi-cluster Kubernetes orchestration, custom hotpatch authoring, SCORM/LTI 1.3 LMS APIs, private Cosign HSM keys, and 24/7 dedicated engineering SLA.
