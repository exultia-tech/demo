# Exultia Autonomous Remediation Daemon (Linux & Kubernetes)

> [!NOTE]
> This document has been consolidated into the comprehensive internal technical guide:
> **[Kinetic Resident Daemon Technical Specification](./kinetic-daemon.md)**

Please refer to **[`wiki/kinetic-daemon.md`](./kinetic-daemon.md)** for the complete technical breakdown of:
- Autonomous 60-second OODA remediation loop
- Systemd supervisor and watchdog (`WatchdogSec=120`)
- Non-blocking lockfile handling (`check_and_acquire_locks` for `apt`, `dnf`, `zypper`)
- Multi-ring progressive canary rollouts (Ring 0 canary, Ring 1 staging, Ring 2 fleet)
- Client-side ring configuration (`/etc/exultia/kinetic.toml`)
- Canary health evaluation gates & journal anomaly scanning
- In-memory hotpatching & sub-15ms deterministic rollback checkpoints
- Distribution backport tracking (Debian Security Tracker, Ubuntu USN, Red Hat RHSA)
- Global upstream quarantine killswitch (e.g. `xz-utils` CVE-2024-3094)
- Prometheus telemetry exposition at `:9100/metrics`
- Air-gap pre-baked SQLite catalog (24,388 UVI advisories)
- Cryptographic OpenVEX attestation receipts
