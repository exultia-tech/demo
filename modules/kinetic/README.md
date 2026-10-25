# Exultia Kinetic Core Module

Autonomous host execution daemon, pre-flight snapshotting, and 14ms deterministic rollback engine.

## Components

1. `snapshot_engine.py`:
   - Pre-flight atomic state recorder committed to `/var/lib/kinetic/snapshots/`.
   - Reversal engine restoring pristine system state in <14 milliseconds.
2. `kinetic_daemon.py`:
   - Unidirectional background poll loop.
   - SLSA Level 3 Cosign signature verification before any memory or filesystem mutation.
3. `kinetic-cli/` (Top-Level):
   - The compiled multi-arch Python Zipapp and PyInstaller packaging suite.
   - Generates standalone compiled binaries (`kinetic` and `kinetic.exe`).

## Commands

```bash
# Rollback latest patch in 14ms
sudo kinetic rollback --latest

# Rollback specific CVE
sudo kinetic rollback --cve=CVE-2024-6387

# Run standalone self-test
kinetic test
```
