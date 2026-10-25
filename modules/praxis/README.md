# Exultia Praxis Core Module

Tactical automated remediation, surgical in-memory hotpatching, and staged 10% canary Ansible playbook compiler.

## Core Templates

1. `praxis-remediation-template.sh`: Universal POSIX `/bin/sh` standalone client template.
   - Detects all major Linux package managers (`apt`, `dnf`, `yum`, `zypper`, `pacman`, `apk`).
   - Commits pre-flight snapshots to `/var/lib/kinetic/snapshots/` before any mutation.
   - Executes syntax validation (e.g. `sshd -t`, `nginx -t`) with automated 14ms fallback rollbacks.
   - Emits CycloneDX v1.5 Cryptographic Bill of Materials (CBOM) attestations.

2. `canary-playbook-template.yml`: Enterprise Ansible fleet template.
   - Enforces `serial: "10%"` canary rollouts.
   - `max_fail_percentage: 0` stops deployment instantly if an anomaly occurs.

## Execution

```bash
# Dry-run validation
sh praxis-remediation-template.sh --dry-run

# Staged canary execution
ansible-playbook -i inventory canary-playbook-template.yml
```
