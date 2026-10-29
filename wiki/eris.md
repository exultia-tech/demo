# Exultia Eris: Technical Documentation & API Reference

**Controlled Vulnerability Proving Ground & Adversary Emulation Lab**  
*Named for Eris, the classical goddess of chaos, discord, and strife.*

---

> [!NOTE]
> **Internal Test Harness**: Eris operates as an internal chaos injection and adversary emulation engine embedded into the Exultia closed-loop testing framework and Kinetic resident daemon verification pipeline, rather than a standalone customer web module.

## 1. Quick-Start Guide

Eris allows security teams and detection engineers to intentionally inoculate isolated endpoints with deliberate misconfigurations, simulated zero-days, and mock adversary beacons to validate that autonomous defense systems (Praxis and Valkyrie) trigger correctly.

### Run an Inoculation with 10-Minute Auto-Destruct Watchdog
```bash
# Inoculate a disposable test VM (auto-restores after 10 minutes)
curl -s "https://exultia.tech/api/eris/raw?os=ubuntu&timeout=10" | sudo sh
```

### Force Immediate Teardown
```bash
sudo sh /tmp/eris_inoculation.sh --teardown
```

---

## 2. Ephemeral Proving Ground Architecture

```
   ┌────────────────────────────────────────────────────────┐
   │            Host Inoculation Safety Guards              │
   │  - Validates hostname (blocks *prod*, *master*, *k8s*) │
   │  - Drops Linux capabilities (CAP_SYS_ADMIN disabled)   │
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │         Active Adversary Vectors (Ephemeral)           │
   │  - Vector A: OpenSSH RegreSSHion (LoginGraceTime 120)  │
   │  - Vector B: Rogue C2 Ingress Sockets (4444 & 8080)    │
   │  - Vector C: SUID File Permission Trap in /tmp         │
   │  - Vector D: Permissive PAM Authentication Bypass      │
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │         Deterministic Watchdog Auto-Destruct           │
   │  - Independent background subshell watchdog process    │
   │  - Forcibly kills mock beacons and unlinks drop-ins    │
   │  - Returns host to pristine baseline upon timeout      │
   └────────────────────────────────────────────────────────┘
```

---

## 3. Inoculation Vector Catalog

| Vector ID | Target Subsystem | CVE / Threat Reference | Injected Precondition | Expected Defense Reaction |
| :--- | :--- | :--- | :--- | :--- |
| `ssh_permissive_regresshion` | OpenSSH (`sshd`) | CVE-2024-6387 | Sets `LoginGraceTime 120`, `PermitRootLogin yes` | Praxis injects `LoginGraceTime 0` drop-in |
| `rogue_c2_listeners` | Network Sockets | UVI-NETWORK-C2-SIM | Spawns non-root listeners on TCP `4444` and `8080` | Vantage flags C2 beacon; firewall ACL applied |
| `unauthorized_tmp_executables` | Linux Filesystem | CWE-276 / SUID | Creates mode `4755` executable in `/tmp` | Audit sentinel flags SUID anomaly and unlinks |
| `kernel_ptrace_scope` | Linux Kernel | CWE-250 | Sets `/proc/sys/kernel/yama/ptrace_scope` to `0` | Sysctl hardened to `ptrace_scope = 2` |
| `docker_socket_unconfined` | Container Daemon | CWE-269 | Grants group write access to `/var/run/docker.sock` | Socket permissions restricted to `0660 root:docker` |

---

## 4. API Reference

### `POST /api/eris/generate`
Compiles an on-demand, targeted inoculation script.

#### Request Schema
```json
{
  "os": "ubuntu",
  "selectedModuleIds": ["ssh_permissive_regresshion", "rogue_c2_listeners"],
  "autoRollbackMinutes": 10
}
```

#### Response Example
```json
{
  "success": true,
  "id": "eris-1792910400000",
  "targetOs": "ubuntu",
  "autoRollbackMinutes": 10,
  "activeModules": ["ssh_permissive_regresshion", "rogue_c2_listeners"],
  "script": "#!/bin/sh\n# Eris Inoculation Script...",
  "rollbackCommand": "sh /tmp/eris_inoculation.sh --teardown",
  "disclaimer": "RESTRICTED TO ISOLATED TESTING & SANDBOX ENVIRONMENTS ONLY"
}
```

---

### `GET /api/eris/raw`
Returns raw compiled POSIX shell script suitable for piping directly into `sh`.

#### Parameters
| Parameter | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `os` | string | No | Target OS (`ubuntu`, `debian`, `rhel`, `rocky`, `alpine`) | `os=ubuntu` |
| `timeout` | number | No | Watchdog auto-rollback timer in minutes (default `30`, min `1`) | `timeout=10` |
| `modules` | string | No | Comma-delimited list of module IDs | `modules=ssh_permissive_regresshion` |
