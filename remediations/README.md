# Exultia Praxis - Public CVE Remediation & Hotfix Catalog

[![Exultia Security](https://img.shields.io/badge/Exultia-Praxis%20Engine-06B6D4?style=for-the-badge&logo=shield)](https://exultia.tech/app/praxis)
[![SLSA Level 3](https://img.shields.io/badge/SLSA-Level%203%20Signed-34D399?style=for-the-badge)](https://slsa.dev)

This catalog provides battle-tested, zero-downtime POSIX hotfix scripts, verification sentinels, sub-second deterministic rollback commands, and serialized 10% canary Ansible playbooks for critical vulnerabilities.

| CVE ID | Title | CVSS | CISA KEV | Hotfix Script | Ansible Playbook |
| :--- | :--- | :--- | :--- | :--- | :--- |
| [CVE-2024-6387](./CVE-2024-6387/) | OpenSSH Server Signal Handler Race Condition (RegreSSHion) | **9.8** | ⚡ YES | [`hotfix.sh`](./CVE-2024-6387/hotfix.sh) | [`playbook.yml`](./CVE-2024-6387/playbook.yml) |
| [CVE-2024-3094](./CVE-2024-3094/) | XZ Utils / liblzma Upstream Tarball Supply Chain Backdoor | **10** | ⚡ YES | [`hotfix.sh`](./CVE-2024-3094/hotfix.sh) | [`playbook.yml`](./CVE-2024-3094/playbook.yml) |
| [CVE-2024-47176](./CVE-2024-47176/) | CUPS cups-browsed Remote Code Execution via Malicious UDP Packets | **8.4** | ⚡ YES | [`hotfix.sh`](./CVE-2024-47176/hotfix.sh) | [`playbook.yml`](./CVE-2024-47176/playbook.yml) |
| [CVE-2024-21626](./CVE-2024-21626/) | runc Container Breakout via Leaked File Descriptors (Leaky Vessels) | **8.6** | ⚡ YES | [`hotfix.sh`](./CVE-2024-21626/hotfix.sh) | [`playbook.yml`](./CVE-2024-21626/playbook.yml) |

---

## 🚀 Autonomous Fleet Daemon (Kinetic)

To automate zero-downtime patching with automated health probes and sub-second rollbacks across your infrastructure:

```bash
sudo kinetic apply --cve=CVE-2024-6387
```

*Browse the full live interactive directory at: [https://exultia.tech/cve](https://exultia.tech/cve)*
