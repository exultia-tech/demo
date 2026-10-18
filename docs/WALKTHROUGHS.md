# Exultia Test Fleet - Step-by-Step Validation Walkthroughs

This document contains step-by-step instructions for executing and observing the four validation suites packaged inside `exultia-node-1` and `exultia-node-2`.

---

## Accessing the Fleet

From any PowerShell or terminal window on the host workstation:

```powershell
# Connect to Node 1 (Production Node)
wsl -d exultia-node-1

# Connect to Node 2 (Canary Node)
wsl -d exultia-node-2
```

Both environments log into `/home/exultia` as user `exultia` with passwordless `sudo` rights.

---

## Walkthrough 1: Kinetic Hotfix & Deterministic Rollback

Execute inside either node:
```bash
./demo-kinetic.sh
```

### Execution Flow:
1. **Pre-Flight Host Audit**:
   - Inspects active OpenSSH configuration.
   - Computes SHA-256 integrity hash of `/etc/ssh/sshd_config`.
2. **Autonomous Hotfix Application**:
   - Executes `sudo kinetic apply --cve=CVE-2024-6387`.
   - Kinetic captures a pre-image snapshot of `/etc/ssh/sshd_config.d/00-exultia-regrsshion-fix.conf`.
   - Kinetic sets `LoginGraceTime 0` mitigating remote unauthenticated code execution in OpenSSH (RegreSSHion).
   - Kinetic triggers sentinel `sshd -T` to ensure no configuration regressions occurred.
3. **State Verification**:
   - Runs `kinetic status --audit` to inspect applied mitigation record and cryptographically verified timestamp.
4. **Deterministic Sub-Second Rollback**:
   - Triggers `sudo kinetic rollback --cve=CVE-2024-6387`.
   - Reverts state back to original baseline in **<10ms**.
   - Confirms clean baseline configuration without requiring system reboots.

---

## Walkthrough 2: Vantage Threat Feed Synchronization

Execute inside either node:
```bash
./demo-vantage-sync.sh
```

### Execution Flow:
1. Detects host gateway IP address automatically (e.g., `172.31.240.1`).
2. Queries the Vantage feed endpoint:
   ```bash
   curl -s http://172.31.240.1:3000/api/patches/feed
   ```
3. Ingests high-priority CVE metadata including:
   - **CVE ID & CVSS 3.1 / 4.0 Score**: (e.g. CVSS 9.8 Critical).
   - **CISA KEV Status**: Identifies known actively exploited vulnerabilities in the wild.
   - **Cryptographic Attestation**: Validates Cosign SLSA Level 3 signature envelope.
   - **Remediation Strategy**: Direct configuration hotfix vs binary package upgrade path.

---

## Walkthrough 3: Praxis Remediation Compiler

Execute inside either node:
```bash
./demo-praxis.sh
```

### Execution Flow:
1. Translates threat advisory schema into hardened POSIX-compliant remediation scripts.
2. Generates two deployment artifacts:
   - **Standalone Shell Mitigation Script**:
     - Includes pre-flight safety checks, file snapshotting, syntax sentinel verification, and automatic rollback traps.
   - **Serialized Enterprise Ansible Playbook**:
     - Configured with `serial: "10%"` for staged canary progression.
     - Implements idempotency gates and handler restarts.

---

## Walkthrough 4: Staged Multi-Node Canary Rollout

Execute inside either node:
```bash
./demo-fleet-canary.sh
```

### Execution Flow:
1. Simulates staged enterprise ring deployment across the two VM nodes:
   - **Phase 1**: Canary Deployment to Ring 0 (`exultia-canary-02`).
   - **Phase 2**: Automated Health Probes and Synthetic Traffic Generation.
   - **Phase 3**: Promotion Gate Evaluation (0 error rate threshold).
   - **Phase 4**: Broad Production Deployment to Ring 1 (`exultia-prod-01`).

---

*Exultia Technologies &copy; 2026. Confidential & Proprietary.*
