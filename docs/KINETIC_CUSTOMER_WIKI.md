# Exultia Kinetic™ Customer Operational Wiki & Disaster Recovery Runbook
**Product**: Exultia Kinetic Rapid Patch Management Feed  
**Audience**: Enterprise SecOps, Platform Engineering, DevOps, and SRE Teams  
**Classification**: Enterprise Deployment & Operations Manual  
**Applies To**: Ubuntu 22.04/24.04 LTS, Debian 12, RHEL 8/9, Rocky Linux 8/9, Alpine Linux 3.19+, Kubernetes DaemonSets

---

## 1. Executive Summary & Architectural Philosophy

Traditional vulnerability remediation in the enterprise operates on a **21-day average patching cycle**: security teams scan, file tickets, schedule maintenance windows, reboot servers, and pray nothing breaks. Meanwhile, threat actors weaponize Known Exploited Vulnerabilities (KEVs) within **under 24 hours**.

**Exultia Kinetic** bridges this critical gap with a **Three-Tier Remediation Architecture**:

```
                       ┌──────────────────────────────────────────────┐
                       │     Exultia Kinetic Signed Patch Stream       │
                       │     (SLSA Level 3, Cosign OIDC Signed)       │
                       └──────────────────────┬───────────────────────┘
                                              │
         ┌────────────────────────────────────┼────────────────────────────────────┐
         │                                    │                                    │
         ▼                                    ▼                                    ▼
┌──────────────────┐               ┌──────────────────┐               ┌──────────────────┐
│     TIER 1       │               │      TIER 2      │               │      TIER 3      │
│  HOT-MITIGATION  │               │ ATOMIC PKG PIN   │               │ GITOPS AUTOMATION│
├──────────────────┤               ├──────────────────┤               ├──────────────────┤
│ • Instant (0 sec)│               │ • Scheduled window│              │ • Fleetwide IaC  │
│ • Zero downtime  │               │ • Vendor package │               │ • Ansible Playbk │
│ • No kernel reboot│              │ • Dependency pin │               │ • K8s DaemonSet  │
│ • Reversible     │               │ • OS pkg manager │               │ • Rollback state │
└──────────────────┘               └──────────────────┘               └──────────────────┘
```

1. **Tier 1 (Instant Hot-Mitigation)**: 0-downtime configuration drop-ins (`/etc/ssh/sshd_config.d/`), runtime sysctl kernel adjustments (`/etc/sysctl.d/`), and socket-level packet drops (`iptables`/`nftables`). Eliminates vulnerability windows without terminating sessions or rebooting nodes.
2. **Tier 2 (Atomic Single-Package Upgrade)**: Pinpoints and upgrades *only* the affected package binary via vendor backports (`apt-get install --only-upgrade` or `dnf upgrade <pkg>`), preventing whole-system package churn.
3. **Tier 3 (GitOps & Canary Automation)**: Pre-compiled Ansible playbooks and Kubernetes DaemonSets with `serial: 10%` canary deployment and automated rollback triggers.

---

## 2. Step-by-Step Implementation Guide

### Step 1: Ingesting the Feed & Authentication

The Kinetic feed provides both structured JSON for orchestration systems and raw executable POSIX shell scripts for zero-agent hosts.

#### Access Endpoints
- **Standard JSON Feed**:
  ```bash
  curl -s -H "Authorization: Bearer YOUR_KINETIC_TOKEN" \
    https://exultia.tech/api/patches/feed
  ```
- **Distro-Tailored Bash Stream (Ubuntu/Debian)**:
  ```bash
  curl -s -H "Authorization: Bearer YOUR_KINETIC_TOKEN" \
    "https://exultia.tech/api/patches/feed?format=bash&os=ubuntu"
  ```
- **Distro-Tailored Bash Stream (RHEL/Rocky)**:
  ```bash
  curl -s -H "Authorization: Bearer YOUR_KINETIC_TOKEN" \
    "https://exultia.tech/api/patches/feed?format=bash&os=rocky"
  ```
- **Severity-Filtered (Critical Only / CISA KEV Window)**:
  ```bash
  curl -s "https://exultia.tech/api/patches/feed?severity=critical&os=ubuntu"
  ```
- **Exhaustive Vantage Global Feed (10,913+ Live CVE & Threat Records)**:
  ```bash
  # Query the complete aggregated Vantage threat feed (JSON)
  curl -s -H "Authorization: Bearer YOUR_KINETIC_TOKEN" \
    "https://exultia.tech/api/patches/feed?source=vantage&limit=all&format=json"

  # Stream complete automated POSIX bash remediations (65,000+ lines, ~0.2s generation)
  curl -s -H "Authorization: Bearer YOUR_KINETIC_TOKEN" \
    "https://exultia.tech/api/patches/feed?source=vantage&limit=all&format=bash" | sudo sh
  ```

---

### Step 2: Cryptographic Signature & SLSA Provenance Verification

Every payload is signed via **Cosign keyless OIDC** and verified against the Exultia Security transparency log.

```bash
# 1. Download payload and detached signature
curl -s -o /tmp/kinetic.sh "https://exultia.tech/api/patches/feed?format=bash&os=ubuntu"
curl -s -o /tmp/kinetic.sh.sig "https://exultia.tech/api/patches/feed?format=bash&os=ubuntu&type=sig"

# 2. Verify signature using Cosign
cosign verify-blob \
  --certificate-identity "security@exultia.tech" \
  --certificate-oidc-issuer "https://accounts.google.com" \
  --signature /tmp/kinetic.sh.sig \
  /tmp/kinetic.sh

# 3. Verify SLSA Level 3 Attestation Digest
EXPECTED_DIGEST=$(curl -s "https://exultia.tech/api/patches/feed" | jq -r '.patches[0].provenance.cosignDigest')
ACTUAL_DIGEST="sha256:$(sha256sum /tmp/kinetic.sh | awk '{print $1}')"
```

---

### Step 3: Canary Staged Rollout Workflow

To ensure zero fleet-wide disruption, remediations MUST follow the **Kinetic Staging Ring Model**:

| Stage | Target Scope | Soak Window | Automated Health Checks |
| :--- | :--- | :--- | :--- |
| **Ring 0 (Canary)** | 2% non-critical nodes / staging | 15 Minutes | HTTP 200 healthcheck, CPU/RAM baseline, daemon socket status |
| **Telemetry Sentinel** | Automated Evaluation Gate | Instant | Systemd unit failure count, journald error log spike, synthetic TCP ping |
| **Ring 1 (Cautious)** | 25% production cluster | 45 Minutes | Connection drop rate, latency p99 < 15ms |
| **Ring 2 (Broad)** | 100% full fleet | Continuous | Automated drift detection |

---

### Step 4: Fleet Automation Deployment Options

#### Option A: Zero-Agent Systemd Automation (Recommended for Linux Fleets)
Deploy a lightweight systemd timer on each host. Requires no third-party agent or open inbound ports.

1. **Create the Service Unit** `/etc/systemd/system/exultia-kinetic.service`:
   ```ini
   [Unit]
   Description=Exultia Kinetic Fleet Patch Sentinel
   After=network-online.target
   Wants=network-online.target

   [Service]
   Type=oneshot
   ExecStart=/bin/sh -c 'curl -sf https://exultia.tech/api/patches/feed?format=bash&os=$(grep -oP "(?<=^ID=).*" /etc/os-release | tr -d "\"") | sh'
   StandardOutput=journal
   StandardError=journal
   ProtectSystem=full
   PrivateTmp=true
   ```

2. **Create the Hourly Timer** `/etc/systemd/system/exultia-kinetic.timer`:
   ```ini
   [Unit]
   Description=Hourly Exultia Kinetic Hot-Mitigation Sync
   Requires=exultia-kinetic.service

   [Timer]
   OnCalendar=hourly
   RandomizedDelaySec=300
   Persistent=true

   [Install]
   WantedBy=timers.target
   ```

3. **Enable and Start**:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable --now exultia-kinetic.timer
   ```

#### Option B: Enterprise Ansible Playbook (GitOps / AWX / Tower)
For fleets managed via centralized infrastructure-as-code, extract the `ansiblePlaybook` field from the API feed and submit directly to your CI/CD repository:

```yaml
---
- name: Emergency Kinetic Hotfix Rollout
  hosts: all
  become: yes
  serial: "10%" # Staged canary rollout
  max_fail_percentage: 1% # Halt instantly if any node fails
  tasks:
    - name: Fetch and Apply Verified Mitigation
      ansible.builtin.shell: |
        curl -sf https://exultia.tech/api/patches/feed?format=bash | sh
      register: patch_run
      failed_when: patch_run.rc != 0

    - name: Verify Daemon Health
      ansible.builtin.command: sshd -t
      changed_when: false
```

---

## 3. Comprehensive Rollback Procedures

A patch management system without rapid, deterministic rollback is a liability. Every Kinetic mitigation is packaged with an **exact inverse rollback command** that restores the previous baseline configuration without requiring reboots.

---

### Scenario A: Automated Self-Healing Rollback (On-Failure Trap)

All Kinetic bash streams contain a built-in error trap. If any verification step or command fails during execution, the script automatically triggers rollback:

```bash
#!/bin/sh
set -e

cleanup_on_error() {
  echo "[Exultia Kinetic] ERROR encountered. Initiating immediate automated rollback..." >&2
  # Execute pre-compiled rollback commands
  rm -f /etc/ssh/sshd_config.d/00-exultia-regrsshion-fix.conf
  systemctl reload sshd 2>/dev/null || systemctl reload ssh 2>/dev/null || true
  iptables -D INPUT -p udp --dport 631 -j DROP 2>/dev/null || true
  systemctl enable --now cups-browsed 2>/dev/null || true
  echo "[Exultia Kinetic] System restored to clean pre-patch baseline." >&2
  exit 1
}

trap cleanup_on_error ERR INT TERM
```

---

### Scenario B: Manual Emergency Rollback via CLI

If operational issues are detected post-deployment (e.g. application incompatibility or legacy client disconnection), execute the following procedures immediately:

#### 1. OpenSSH Rollback (CVE-2024-6387 RegreSSHion)
```bash
# 1. Remove drop-in configuration
sudo rm -f /etc/ssh/sshd_config.d/00-exultia-regrsshion-fix.conf \
           /etc/ssh/sshd_config.d/00-kinetic-*.conf

# 2. Verify configuration syntax BEFORE reloading daemon
sudo sshd -t

# 3. Reload SSH daemon (Ubuntu / Debian)
sudo systemctl reload ssh

# 4. Reload SSH daemon (RHEL / Rocky / CentOS)
sudo systemctl reload sshd

# 5. Confirm LoginGraceTime restored to default (120s)
sudo sshd -T | grep -i logingracetime
# Output should show: logingracetime 120
```

#### 2. CUPS Daemon & Firewall Rollback (CVE-2024-47176)
```bash
# 1. Remove iptables UDP drop rule
sudo iptables -D INPUT -p udp --dport 631 -j DROP 2>/dev/null || true

# 2. Re-enable and restart cups-browsed
sudo systemctl unmask cups-browsed 2>/dev/null || true
sudo systemctl enable --now cups-browsed

# 3. Verify service and listening socket
sudo systemctl is-active cups-browsed
sudo ss -lunp | grep 631
```

#### 3. Kernel Sysctl User Namespace Rollback (CVE-2024-1086)
```bash
# 1. Remove sysctl drop-in
sudo rm -f /etc/sysctl.d/99-exultia-userns*.conf \
           /etc/sysctl.d/99-kinetic-*.conf

# 2. Restore default user namespace allocation
sudo sysctl -w user.max_user_namespaces=15000 2>/dev/null || true
sudo sysctl -w kernel.unprivileged_userns_clone=1 2>/dev/null || true

# 3. Reload system sysctl configuration
sudo sysctl --system
```

#### 4. Systemd Service Override Sandboxing Rollback
```bash
# Remove service drop-in override directory
sudo rm -rf /etc/systemd/system/<SERVICE_NAME>.service.d

# Reload systemd manager configuration
sudo systemctl daemon-reload

# Gracefully reload the affected service
sudo systemctl reload-or-restart <SERVICE_NAME>
```

---

### Scenario C: Fleet-Wide Rollback via Ansible Playbook

To rollback an entire fleet of 5,000+ servers simultaneously, execute the **Emergency Fleet Reversal Playbook**:

```yaml
---
- name: Emergency Fleetwide Kinetic Rollback
  hosts: all
  become: yes
  serial: "100%" # Full parallel rollback
  tasks:
    - name: Remove all Kinetic drop-in configurations
      ansible.builtin.file:
        path: "{{ item }}"
        state: absent
      loop:
        - /etc/ssh/sshd_config.d/00-exultia-regrsshion-fix.conf
        - /etc/sysctl.d/99-exultia-userns.conf

    - name: Validate SSH daemon syntax
      ansible.builtin.command: sshd -t
      changed_when: false

    - name: Reload SSH Service
      ansible.builtin.service:
        name: "{{ 'ssh' if ansible_os_family == 'Debian' else 'sshd' }}"
        state: reloaded

    - name: Re-enable CUPS Print Discovery if present
      ansible.builtin.systemd:
        name: cups-browsed
        state: started
        enabled: yes
      ignore_errors: yes

    - name: Delete firewall drop rule for UDP 631
      ansible.builtin.iptables:
        chain: INPUT
        protocol: udp
        destination_port: "631"
        jump: DROP
        state: absent
      ignore_errors: yes
```

Execute with:
```bash
ansible-playbook -i production_inventory.ini emergency_rollback.yml
```

---

### Scenario D: Atomic Configuration Backup & Restore

Before modifying any file, the Kinetic client automatically saves a timestamped snapshot in `/var/backups/exultia/`:

```bash
# View available snapshots
ls -la /var/backups/exultia/

# Restore specific snapshot
sudo cp -a /var/backups/exultia/sshd_config.bak.20261016_040000 /etc/ssh/sshd_config
sudo sshd -t && sudo systemctl reload sshd
```

---

## 4. Post-Rollback Forensics & Health Verification Checklist

After executing any rollback, execute the following audit checklist to verify system health:

- [ ] **Daemon Status**: `systemctl status sshd` or `systemctl status ssh` displays `Active: active (running)` with zero restart counts.
- [ ] **Config Check**: `sshd -t` returns exit code `0` with zero syntax warnings.
- [ ] **Port Check**: Verify TCP port 22 is accepting connections: `nc -zv 127.0.0.1 22`.
- [ ] **Kernel Parameters**: Run `sysctl -a | grep -E "user.max_user_namespaces|unprivileged_userns_clone"` and confirm values match your organization's base image baseline.
- [ ] **Firewall Integrity**: `sudo iptables -L INPUT -n -v` shows no unintended blocked internal ports.
- [ ] **Audit Trail**: Check system journal for any leftover failure alerts:
  ```bash
  sudo journalctl -u exultia-kinetic.service -n 20 --no-pager
  ```

---

## 5. Support & Incident Escalation Matrix

| Priority | Scenario | Target Response Time | Action |
| :--- | :--- | :--- | :--- |
| **P1 - CRITICAL** | Mitigation disrupted fleet network access | **15 Minutes** | Execute Scenario C (Fleet Rollback Playbook), notify SecOps on Slack `#kinetic-ops` |
| **P2 - HIGH** | Specific legacy client rejected by `LoginGraceTime 0` | **1 Hour** | Apply host exclusion tag in Ansible or remove drop-in on impacted nodes |
| **P3 - MEDIUM** | Package downgrade conflict on custom Debian kernel | **4 Hours** | Submit diagnostic bundle to `support@exultia.tech` |
| **P4 - LOW** | Telemetry or log format query | **24 Hours** | Consult documentation or open community ticket |
