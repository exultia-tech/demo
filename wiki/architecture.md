# Exultia Architecture & Closed-Loop Sovereignty Specification

**Version:** 2.4.0  
**Classification:** Technical Architecture Specification  
**Provenance:** Cosign SLSA Level 3 Cryptographic Provenance  

---

## 1. Executive Summary

Traditional cybersecurity architectures operate in fragmented silos: scanners detect vulnerabilities, manual analysts review alerts, red teams execute point-in-time penetration tests, and DevOps schedules maintenance windows weeks later. This latency window leaves enterprises vulnerable to zero-day exploitation and creates catastrophic downtime risks when kernel-level agents deploy unverified global updates.

Exultia unifies threat intelligence, adversary emulation, non-destructive pentesting, in-memory hotpatching, and zero-trust developer environments into a machine-speed **Closed-Loop OODA Architecture** (Observe, Orient, Decide, Act).

```
   ┌────────────────────────────────────────────────────────┐
   │                1. OBSERVE (VANTAGE)                    │
   │  - Continuous ingestion from 110+ authoritative feeds   │
   │  - CISA KEV, NIST NVD, Linux vendor errata (Argent)    │
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │                 2. ORIENT (ERIS)                       │
   │  - Programmatic ephemeral chaos proving ground ranges  │
   │  - Synthesizes exact adversary exploit preconditions    │
   │  - Enforces 10-minute automated auto-destruct watchdog │
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │                 3. DECIDE (VALKYRIE)                   │
   │  - On-demand non-destructive Canary BAS prober         │
   │  - Mathematical proof of exploitability via HMAC token │
   │  - Zero risk of crash, thread deadlocks, or outages    │
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │           4. ACT (PRAXIS & KINETIC)                    │
   │  - Praxis: Synthesizes in-memory trampolines & playbooks│
   │  - Kinetic: Pre-flight snapshot & autonomous injection │
   │  - 14ms deterministic atomic rollback watchdog         │
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

## 2. The 7 Core Defense Engines

| # | Engine | Role in Closed Loop | Execution Form Factor | Primary Endpoint / Artifact |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **Vantage** | **Observe:** Threat Intelligence Hub | Real-time REST stream & offline cache | `/api/threat-feed`, `modules/vantage/` |
| **2** | **Eris** | **Orient:** Adversary Emulation Lab | Ephemeral Docker ranges & POSIX scripts | `/api/eris/generate`, `modules/eris/` |
| **3** | **Valkyrie** | **Decide:** Non-Destructive Canary BAS | Python prober & HMAC handshake sockets | `/api/valkyrie/probe`, `modules/valkyrie/` |
| **4** | **Praxis** | **Act (Compiler):** Remediation Synthesizer | POSIX hotpatch scripts & Ansible playbooks | `/api/praxis/generate`, `modules/praxis/` |
| **5** | **Kinetic** | **Act (Runtime):** Host Execution Daemon | Compiled native binary (`x86_64`/ARM64) | `/api/kinetic/download`, `modules/kinetic/` |
| **6** | **PureIDE & PureOS** | **Foundations:** Workstation & Runtimes | CIS distroless container & devcontainer | `/api/pureide/versions`, `modules/pureos-pureide/` |
| **7** | **Axiom** | **Verification:** Workforce Certifications | LMS API simulator & verifiable credentials | `/api/axiom/exam`, `/api/axiom/export` |

---

## 3. The 14-Millisecond Deterministic Rollback Guarantee

Legacy endpoint detection agents hook deep into host kernels and execute global updates without local dry-run sandboxing, which has historically caused catastrophic multi-billion-dollar IT fleet outages.

Kinetic and Praxis resolve this through a **strict 4-step deterministic verification pipeline**:

1. **Static Binary & Disassembly Inspection**: Before modifying any process memory or system configuration, the daemon inspects symbol offsets and verifies integrity against known compiler fingerprints.
2. **Hermetic Memory Trampolines**: In-memory patches target only vulnerable entry points (such as unescaped input parsers) without modifying surrounding application logic.
3. **Pre-Flight Atomic Snapshotting**: Prior to execution, an atomic snapshot of process state, file permissions, and SHA-256 digests is committed to `/var/lib/kinetic/snapshots/<session-id>/`.
4. **Automated Health Watchdog**: If a patched process encounters any signal fault (e.g. `SIGSEGV` or `SIGABRT`) or fails syntax verification (e.g. `sshd -t`), the host watchdog restores the baseline binary and unlinks memory hooks in **under 14 milliseconds**.

```bash
# Verify atomic rollback locally
sudo kinetic rollback --latest
# or targeting specific CVE
sudo kinetic rollback --cve=CVE-2024-6387
```

---

## 4. Unidirectional Pull & Zero-Telemetry Boundary

Modern enterprise environments, SCIFs, and defense installations cannot tolerate security tools that phone home or stream proprietary code snippets to multi-tenant cloud databases.

Exultia enforces a strict **Unidirectional Architecture**:
- **Signed Distribution**: Exultia signs threat intelligence manifests and publishes them as static JSON distributions on public CDNs.
- **Local Host Poll**: Daemons poll signed updates using outbound HTTPS requests (identical to `apt update` or `dnf check-update`).
- **Zero Telemetry**: No internal IP addresses, source code, network topologies, or host logs are ever transmitted to Exultia.
- **Air-Gapped Data Diode Support**: Offline networks synchronize updates via `.bundle` archives validated locally against offline Cosign public keys.

---

## 5. Cryptographic Attestation & SLSA Level 3

Every mitigation payload, container image, and threat advisory is signed using **Cosign Keyless OIDC / Private KMS**:
- **Provenance**: Signed SHA-256 digests verify that payloads originate strictly from audited source code.
- **CycloneDX CBOM**: Praxis emits an After-Action Cryptographic Bill of Materials for every patch applied, documenting exact before-and-after cryptographic hashes.
- **Verification Command**:
  ```bash
  cosign verify --key /etc/exultia/cosign.pub <artifact>
  ```

---

## 6. Unified Subscription Tiers

Exultia avoids legacy vendor bloat by packaging all 7 engines into transparent platform tiers:

- **Community Sovereign ($0 Forever)**: 1 host node, public Vantage feed, community distroless container images, basic Valkyrie canary probes, free Axiom exam practice questions.
- **Professional Operator ($100/mo)**: Unlimited Praxis hotpatching, 110+ Vantage registries, private Eris chaos ranges, on-demand Valkyrie BAS probes, PureIDE air-gap compiler, and verifiable Axiom certifications.
- **Enterprise Fleet ($500/mo)**: Multi-cluster Kubernetes orchestration, custom hotpatch authoring, SCORM/LTI 1.3 LMS APIs, private Cosign HSM keys, and 24/7 dedicated engineering SLA.
