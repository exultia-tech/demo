<p align="center">
  <a href="https://exultia.tech">
    <img src="https://raw.githubusercontent.com/wstrika/exultia/main/public/branding/navbar_helm_cyan.png" alt="Exultia Cybernetic Fortress Helm" width="130" /><br>
    <img src="https://raw.githubusercontent.com/wstrika/exultia/main/public/branding/logo_lockup_cyan.png" alt="Exultia Technologies" width="340" />
  </a>
</p>

# Exultia Platform Documentation & Wiki

Welcome to the official technical documentation and engineering wiki for the **Exultia Technologies** closed-loop sovereign security platform.

---

## Architecture & System Overview

- **[Master Architecture & Closed-Loop Specification](./architecture.md)**: Deep dive into the 7-engine OODA lifecycle, 14ms atomic rollbacks via `/var/lib/kinetic/snapshots/`, unidirectional zero-telemetry boundaries, SLSA Level 3 Cosign provenance, and subscription tiers ($0 Community, $100 Pro, $500 Enterprise).
- **[Consolidated Master API Reference](./api-reference.md)**: Global schemas, bearer token authentication, request/response contracts, and status codes.

---

## Product Ecosystem Catalog

| Engine | Modality / Form Factor | Closed-Loop OODA Phase | Primary Mission | Key API / Artifact | Documentation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Vantage** | High-throughput Threat Intelligence Hub | **Observe** | Ingests 110+ global registries (CISA KEV, NVD, vendor errata) | `/api/threat-feed`, `modules/vantage/` | [**Vantage Wiki**](./vantage.md) |
| **Argent** | Multi-OS Vendor Patch Aggregator | **Observe** | Curated OS errata feeds (Ubuntu, Debian, Rocky, Alpine, SUSE) | `/api/argent/feed`, `/api/argent/stats` | [**Argent Wiki**](./argent.md) |
| **Eris** | Controlled Proving Ground & Chaos Lab | **Orient** | Programmatic ephemeral attack ranges with 10m auto-destruct watchdog | `/api/eris/generate`, `modules/eris/` | [**Eris Wiki**](./eris.md) |
| **Valkyrie** | Non-Destructive Canary BAS Prober | **Decide** | Proves exploitability via HMAC handshakes with zero downtime | `/api/valkyrie/probe`, `modules/valkyrie/` | [**Valkyrie Wiki**](./valkyrie.md) |
| **Praxis** | Surgical Remediation & Playbook Compiler | **Act (Compiler)** | Synthesizes in-memory trampolines and staged 10% canary playbooks | `/api/praxis/generate`, `modules/praxis/` | [**Praxis Wiki**](./praxis.md) |
| **Kinetic** | Standalone Compiled Binary & Daemon | **Act (Runtime)** | Sub-second zero-downtime hotfixes & 14ms deterministic rollbacks | `/api/kinetic/download`, `modules/kinetic/` | [**Kinetic Wiki**](./kinetic.md) |
| **PureIDE & PureOS** | Hardened Workstation & Distroless Base | **Foundations** | Kernel egress filtering, CIS Level 2 distroless containers, CycloneDX SBOMs | `/api/pureide/versions`, `modules/pureos-pureide/` | [**PureIDE/PureOS Wiki**](./pureide-pureos.md) |
| **Axiom** | Enterprise Certification Exam Simulator | **Verification** | Adaptive cybersecurity exam simulator with verifiable SHA-256 certs | `/api/axiom/exam`, `/api/axiom/export` | [**Axiom Wiki**](./axiom.md) |
| **Inquest** | Digital Forensics & Records Automation | **Governance** | Autonomous FOIA intake, exemption redactions, and audit trails | `/api/inquest/cases`, `/api/civic-pulse/crawl` | [**Inquest Wiki**](./inquest.md) |

---

## Quick-Start Guides

Get up and running with reproducible CLI commands in under 60 seconds:

- **[Kinetic Quick-Start](./kinetic.md#quick-start-guide)**: Run `kinetic test` to verify an atomic mutation and 14ms rollback on your local system.
- **[Vantage Quick-Start](./vantage.md#quick-start-guide)**: Query live CISA KEV zero-day feeds across 110+ authoritative registries.
- **[Praxis Quick-Start](./praxis.md#quick-start-guide)**: Generate an on-demand Ansible canary playbook with `serial: 10%`.
- **[Eris Quick-Start](./eris.md#1-quick-start-guide)**: Inoculate an ephemeral test sandbox with an automated 10-minute auto-rollback watchdog.
- **[Valkyrie Quick-Start](./valkyrie.md#1-quick-start-guide)**: Execute non-destructive canary BAS exploitability probes against target endpoints.
- **[PureIDE & PureOS Quick-Start](./pureide-pureos.md#quick-start-guide)**: Build CIS Level 2 minimal distroless containers with air-gap attestations.
- **[Axiom Quick-Start](./axiom.md#quick-start-guide)**: Simulate adaptive certification exams or embed exam feeds into enterprise LMS.
- **[Argent Quick-Start](./argent.md#quick-start-guide)**: Synchronize vendor advisory bundles across Ubuntu, Debian, Rocky, and Alpine.

---

## Security, Privacy & Provenance

1. **Zero Telemetry**: All data feeds use unidirectional HTTPS pull. Customer source code, internal IPs, and host configurations never leave your network.
2. **SLSA Level 3 Provenance**: Every patch and container artifact is cryptographically signed using Cosign keyless OIDC / private KMS.
3. **Air-Gap Capable**: Deployable across classified networks, SCIF environments, and hardware data diodes using offline `.bundle` manifests.
