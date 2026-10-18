# Exultia Security Architecture & Deployment Topology

## 1. System Overview

The Exultia Security Suite provides autonomous, self-verifying zero-downtime vulnerability remediation across enterprise infrastructure. Unlike legacy vulnerability management scanners that merely identify CVEs and generate backlogs, Exultia decouples detection from remediation by compiling verified hotfixes directly from live threat intelligence feeds.

```
+---------------------------------------------------------------------------------------------------+
|                                   VANTAGE THREAT INTELLIGENCE FEED                                |
|  - Ingests: CISA KEV, NVD 2.0, GitHub Advisories, Debian/Alpine/RHEL Security Trackers            |
|  - Cryptographic SLSA Level 3 Provenance & Cosign Keyless OIDC Attestation                        |
|  - RESTful / Streaming JSON Endpoints (/api/patches/feed)                                        |
+-------------------------------------------------+-------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|                                     KINETIC AUTONOMOUS DAEMON                                     |
|  - Host Discovery & Vulnerability Matrix Evaluation                                               |
|  - Pre-Image Snapshotting with SHA-256 Integrity Hashes                                           |
|  - Atomic Sentinel Verification (Pre-Flight & Post-Flight Health Probes)                          |
|  - Sub-Second Deterministic Rollback Engine (<10ms)                                               |
+-------------------------------------------------+-------------------------------------------------+
                                                  |
                         +------------------------+------------------------+
                         |                                                 |
                         v                                                 v
+-------------------------------------------------+     +-------------------------------------------+
|             RING 0: CANARY STAGING              |     |          RING 1: PRODUCTION FLEET         |
|  - Target: exultia-node-2 (exultia-canary-02)   |     |  - Target: exultia-node-1 (exultia-prod-01)  |
|  - Canary Ratio: 5% - 10%                       |     |  - Rollout Gate: Canary Soak Period Pass  |
|  - Verification: Live Regression Probes         |     |  - Autonomous Zero-Downtime Hot-Patching   |
+-------------------------------------------------+     +-------------------------------------------+
```

---

## 2. Multi-Tier Ring Deployment Model

To prevent remediation regressions from destabilizing production workloads, Exultia enforces staged ring deployment:

### Ring 0: Staged Canary Host (`exultia-canary-02`)
- **Objective**: Isolated verification of patch syntax, configuration parsing, service restart stability, and network sentinel health.
- **Canary Quorum**: 5% to 10% of total fleet capacity.
- **Fail-Safe Trigger**: If any pre-flight or post-flight health probe fails, or if a service fails to reload cleanly within 500ms, Kinetic initiates an immediate, automatic deterministic rollback and aborts fleet promotion.

### Ring 1: Production Host Fleet (`exultia-prod-01`)
- **Objective**: Zero-downtime remediation of critical enterprise services.
- **Promotion Condition**: Ring 0 canary soak time passes with 0 sentinel violations.
- **Rollback Window**: Any patch applied to Ring 1 maintains its immutable pre-image snapshot on disk indefinitely, allowing sub-second manual or automated rollback at any future point.

---

## 3. Deterministic Pre-Image Rollback Engine

The core reliability primitive of the Exultia platform is deterministic rollback:

1. **Pre-Image Hashing**: Before modifying any host file or service configuration, Kinetic reads the original file, records its permissions/ownership, and computes its SHA-256 digest.
2. **Atomic Ingestion**: The mitigation payload is written to an atomic temporary buffer before being committed via atomic rename or targeted modular include directory (e.g. `/etc/ssh/sshd_config.d/`).
3. **Audit Ledger**: The action is recorded in `/var/lib/kinetic/audit.log` and `/var/lib/kinetic/state.json`.
4. **Sub-Second Reversion**:
   ```
   sudo kinetic rollback --cve=CVE-2024-6387
   ```
   Kinetic reads the cached pre-image, verifies digest match, atomically restores original bytes, reloads service daemons, and confirms healthy baseline operation in **under 10 milliseconds**.

---

## 4. Cryptographic Provenance & SLSA Level 3

Every patch distributed through the Vantage feed includes:
- **Cosign OIDC Keyless Signature**: Verifiable against Sigstore public transparency logs.
- **Source SHA-256 Digest**: Computed over raw remediation payloads.
- **Pre-Flight Sentinel**: Syntactic validator command (e.g., `sshd -T`).
- **Post-Flight Sentinel**: Dynamic operational check ensuring ports remain reachable and listeners active.

---

*Exultia Technologies &copy; 2026. Confidential & Proprietary.*
