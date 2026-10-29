# Exultia Kinetic Resident Daemon: Technical Specification & Internal Functions

**Autonomous Self-Healing Linux Remediator • Sub-Second Hotpatching • Multi-Ring Progressive Rollout • Zero-Downtime Deterministic Rollback**

---

## 1. Overview & Architectural Principles

The **Kinetic Resident Daemon** (`kinetic daemon`) is a self-contained, statically compiled systems daemon engineered for production Linux hosts across bare-metal, virtual machines, cloud instances, and Kubernetes worker nodes. Operating as a continuous **60-second closed-loop OODA sentinel**, it automates the full vulnerability remediation lifecycle:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        KINETIC AUTONOMOUS RESIDENT DAEMON                              │
│                                                                                        │
│   [ 1. OBSERVE ] ──► [ 2. ORIENT ] ──► [ 3. DECIDE ] ──► [ 4. ACT ] ──► [ 5. VERIFY ]  │
│   • Active Sockets   • Distro Errata   • Ring Topology   • Tier 1 Hotfix • Active Probes│
│   • Memory Maps      • Backport Check  • Lock Detection  • Atomic Snap   • OpenVEX Cert │
│   • Sysctl Drift     • Quarantine Feed • Soak Gating     • Non-Blocking  • Telemetry    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Core Design Constraints:
1. **Zero Involuntary Reboots**: The daemon is architecturally forbidden from invoking `reboot`, `shutdown`, `init 6`, or `systemctl reboot`.
2. **Non-Blocking Lock Deference**: Never issues `kill -9` against running package managers (`apt`, `dnf`, `zypper`) or deletes active `.lock` files. Yields with jittered backoff.
3. **Two-Phase Transactional Staging**: Payloads are staged into `/var/cache/exultia/staging/` and verified with Cosign SLSA Level 3 Ed25519 signatures before any system mutation begins.
4. **Deterministic Sub-15ms Rollback**: Pre-image state snapshots in `/var/lib/kinetic/snapshots/` guarantee instant reversal with zero data loss.
5. **Air-Gap & Offline Autonomy**: Pre-baked with 24,388 UVI advisories and 12,993 CISA KEV records in local SQLite for 100% disconnected operation.

---

## 2. CLI Interface & Daemon Invocation

### Command-Line Arguments
```bash
kinetic daemon [OPTIONS]
```

| Flag | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--interval <sec>` | Integer | `60` | Loop evaluation interval in seconds. |
| `--ring <0\|1\|2>` | Integer | `0` | Progressive rollout ring tier (0=Canary, 1=Staging, 2=Broad Fleet). |
| `--feed-url <url>` | String | `https://exultia.tech/api/patches/feed` | Signed UVI vulnerability intelligence pull endpoint. |
| `--token <token>` | String | `$EXULTIA_TOKEN` | Bearer token or local Ed25519 license key path. |
| `--db <path>` | Path | `/var/db/vantage/catalog.db` | Local SQLite vulnerability database path. |
| `--snapshot-dir <path>`| Path | `/var/lib/kinetic/snapshots` | Snapshot pre-image store for atomic rollbacks. |
| `--staging-dir <path>` | Path | `/var/cache/exultia/staging` | Two-phase transaction download buffer. |
| `--dry-run` | Boolean | `false` | Evaluate vulnerabilities and emit execution plan without mutations. |
| `--audit` | Boolean | `false` | Execute a single-pass assessment and output JSON report to stdout. |
| `--metrics-port <port>`| Integer | `9100` | Prometheus `/metrics` exposition port. |
| `--log-level <level>` | String | `info` | Logging verbosity (`debug`, `info`, `warn`, `error`). |

### Daemon Launch Examples
```bash
# Standard autonomous execution
sudo kinetic daemon --interval 60 --ring 0

# Dry-run audit mode for inspection
sudo kinetic daemon --audit --dry-run

# Custom staging directory in air-gapped SCIF environment
sudo kinetic daemon --interval 300 --db /opt/exultia/catalog.db --snapshot-dir /mnt/secure/snapshots
```

---

## 3. Systemd Supervisor & Watchdog Integration

The daemon integrates with systemd's supervisor framework via `sd_notify(3)` watchdog heartbeats:

### Production Service Unit (`/etc/systemd/system/kinetic.service`)
```ini
[Unit]
Description=Exultia Kinetic Autonomous Remediator Sentinel
Documentation=https://exultia.tech/wiki/kinetic-daemon
After=network-online.target time-sync.target
Wants=network-online.target

[Service]
Type=notify
WatchdogSec=120
Restart=on-failure
RestartSec=10
TimeoutStopSec=30

ExecStart=/usr/local/bin/kinetic daemon --interval 60 --ring 0
ExecReload=/bin/kill -HUP $MAINPID

# Sandboxing & Privilege Constraints
User=root
WorkingDirectory=/var/lib/kinetic
LimitNOFILE=65536
CapabilityBoundingSet=CAP_SYS_ADMIN CAP_SYS_PTRACE CAP_NET_ADMIN CAP_DAC_OVERRIDE
AmbientCapabilities=CAP_SYS_ADMIN CAP_SYS_PTRACE CAP_NET_ADMIN CAP_DAC_OVERRIDE
ProtectSystem=strict
ProtectHome=read-only
ReadWritePaths=/var/lib/kinetic /var/cache/exultia /var/log/kinetic /etc /proc/sys
ProtectKernelTunables=no
ProtectControlGroups=yes
PrivateTmp=yes

[Install]
WantedBy=multi-user.target
```

### Supervisor Watchdog Protocol
1. Every 30 seconds during active loop processing, the daemon transmits `sd_notify("WATCHDOG=1")`.
2. If an internal lock or kernel call blocks execution for $>120\text{s}$, systemd triggers an automated supervisor restart.
3. Upon restart, the daemon inspects `/var/lib/kinetic/snapshots/pending.lock` to recover any interrupted transaction.

---

## 4. Signal Handling & Process Lifecycle

The daemon implements deterministic signal traps to prevent half-applied patches or corrupted system state:

| Signal | Handler Action | Internal Routine |
| :--- | :--- | :--- |
| `SIGTERM` / `SIGINT` | Graceful shutdown: completes or rolls back in-flight staging, releases lockfiles, unlinks ephemeral probes, flushes audit log, exits 0. | `daemon_graceful_shutdown()` |
| `SIGHUP` | Hot reload: re-reads `/etc/exultia/kinetic.toml`, reloads ring configuration, flushes DNS cache, reopens log files without restarting process. | `daemon_reload_config()` |
| `SIGUSR1` | Out-of-band audit: triggers immediate vulnerability audit and re-check cycle ahead of the 60s timer. | `daemon_trigger_audit_now()` |
| `SIGUSR2` | Emergency mitigation unlink: instantly unlinks all active Tier 1 in-memory trampolines and restores pre-patch sysctls across running processes. | `daemon_emergency_unhook_all()` |

---

## 5. Non-Blocking Package Manager Lock Deference (`check_and_acquire_locks`)

### The Problem
Traditional patch tools and automation scripts often run `killall apt` or forcefully delete `/var/lib/dpkg/lock`, corrupting the `dpkg` database when an interactive administrator or `unattended-upgrades` is active.

### Kinetic's Non-Blocking Algorithm
```
┌────────────────────────────────────────────────────────┐
│ check_and_acquire_locks()                              │
│                                                        │
│ 1. Non-blocking fcntl(fd, F_SETLK, &fl) on:            │
│    • /var/lib/dpkg/lock-frontend (Debian/Ubuntu)       │
│    • /var/lib/apt/lists/lock     (Debian/Ubuntu)       │
│    • /var/run/yum.pid            (RHEL/Rocky/CentOS)   │
│    • /var/cache/dnf/metadata_lock.pid (Fedora/RHEL 9)  │
│                                                        │
│ 2. Lock Held?                                          │
│    ├── NO  ──► Acquire lock, proceed with Tier 2.      │
│    └── YES ──► Emit DEFERRED_LOCK_BUSY                 │
│                Extract holding PID from /proc          │
│                Log: "Lock held by PID %d (%s)"         │
│                Backoff: min(30s * 2^attempt, 120s)     │
│                BYPASS: Execute Tier 1 Hotpatch NOW!    │
└────────────────────────────────────────────────────────┘
```

1. **Strict Non-Destructive Policy**: Kinetic **never** sends `kill -9` to package manager processes and **never** unlinks lock files.
2. **Lock-Free Tier 1 Execution**: Because Tier 1 hotpatches (eBPF filters, kernel sysctls, and in-memory function redirects) operate via kernel APIs, they execute immediately even while `apt` or `dnf` is busy running unrelated package updates.

---

## 6. Multi-Ring Progressive Rollout Engine (`execute_ring_rollout`)

To eliminate fleet-wide blast radius, updates progress through isolated risk rings:

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ MULTI-RING CANARY ROLLOUT PROGRESSION                                         │
│                                                                               │
│   [ Ring 0: Canary ]        [ Ring 1: Staging ]        [ Ring 2: Broad Fleet] │
│   • 2% - 10% of fleet       • 25% of fleet             • 65% - 75% of fleet   │
│   • 15-minute gate          • 2-hour soak window       • Fleet-wide rollout   │
│   • Active Valkyrie probes  • Journal error monitoring • Continuous telemetry│
│   • Immediate rollback      • Latency monitoring       • Final OpenVEX receipt│
└───────────────────────────────────────────────────────────────────────────────┘
```

### Client-Side Configuration (`/etc/exultia/kinetic.toml`)
```toml
[daemon]
interval_seconds = 60
log_format = "json"

[rollout]
ring = 0 # 0=Canary, 1=Staging, 2=Broad Fleet
auto_promote = true
soak_window_seconds = 900 # 15 minutes for Ring 0
health_check_command = "/usr/local/bin/app-health-check.sh"
health_check_timeout_seconds = 60
max_journal_error_rate = 5 # Abort if errors/sec exceed this threshold

[storage]
database_path = "/var/db/vantage/catalog.db"
snapshot_path = "/var/lib/kinetic/snapshots"
```

### Ring Management Commands
```bash
# Inspect current host ring status
sudo kinetic ring status

# Assign host to Canary ring (Ring 0)
sudo kinetic config set rollout.ring 0

# Force immediate promotion of a tested CVE
sudo kinetic ring promote --cve=UVI-2024-4577

# View fleet rollout soak progress
sudo kinetic ring progress
```

---

## 7. Canary Health Evaluation Gate (`evaluate_canary_health`)

Before an applied mitigation can be marked `PERMANENT` or promoted across rings, the daemon executes a multi-signal health gate:

1. **Custom Health Command**: Executes the configured `health_check_command` inside an isolated namespace. Must return exit code `0` within `health_check_timeout_seconds`.
2. **System Load & Saturation**: Checks `/proc/loadavg` against CPU core count to ensure mitigations did not cause infinite loop regressions.
3. **Journal Anomaly Detection**: Queries `sd_journal` for log messages with priority `LOG_ERR` (3) or higher originating from the patched unit. If error rates surge $>5\times$ baseline, health check fails.
4. **Socket & TCP State**: Verifies that active listening sockets (`ss -tulpn`) remain bound and accepting connections, with zero dropped TCP syn packets.

### Automated Rollback Trigger
If any health check parameter fails, the daemon immediately halts the rollout, emits `ROLLBACK_TRIGGERED`, and invokes `rollback_patch()`.

---

## 8. Atomic Snapshot & Deterministic Rollback (`create_file_snapshot`, `rollback_patch`)

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ PRE-IMAGE CHECKPOINTING & SUB-15MS RESTORATION                                │
│                                                                               │
│ 1. Pre-Mutation Snapshot:                                                     │
│    /var/lib/kinetic/snapshots/<cve-id>-<timestamp>/                           │
│    ├── manifest.json       (SHA-256 pre-hashes, permissions, SELinux labels)  │
│    ├── file_backup.bin     (Exact byte-level pre-image)                       │
│    └── memory_map.dat      (eBPF hook descriptors & trampoline pointers)      │
│                                                                               │
│ 2. Instant Reversal:                                                          │
│    • In-Memory: Unlinks trampoline from /proc/<pid>/mem (<2ms)               │
│    • Filesystem: Atomic renameat2(RENAME_EXCHANGE) restoration (<12ms)        │
│    • Verification: SHA-256 post-check confirms 100% byte equivalence          │
└───────────────────────────────────────────────────────────────────────────────┘
```

### Rollback Commands
```bash
# Revert a specific vulnerability patch
sudo kinetic rollback --cve=UVI-2024-4577

# Revert the most recently applied mitigation
sudo kinetic rollback --latest

# List all snapshot checkpoints on disk
sudo kinetic rollback --list
```

---

## 9. Distribution Backport Correlation (`resolve_distro_backport`)

Linux distributions (Debian, Ubuntu, RHEL, Rocky, SUSE) backport security patches into older upstream versions without bumping major releases.

### Verification Flow
1. **Catalog Ingestion**: Vantage pulls and parses official vendor feeds:
   - Debian Security Tracker (`DSA` / `DLA`)
   - Ubuntu Security Notices (`USN`)
   - Red Hat Security Advisories (`RHSA` / `RHBA`)
   - Rocky / Alma OVAL Errata
2. **Package Release Parsing**: The daemon evaluates:
   - Epoch, Upstream Version, and Debian/Ubuntu/RHEL build revisions (e.g. `1:1.18.0-0ubuntu1.4`)
   - Package changelog tags via `apt-cache changelog <pkg>` or `rpm -q --changelog <pkg>`
3. **Decision Logic**:
   - If installed version $\ge$ backported fix version: mark advisory `RESOLVED_BY_BACKPORT`.
   - The daemon records the vendor fix in OpenVEX and skips unnecessary package replacement.

---

## 10. Upstream Quarantine & Remote Killswitch (`apply_quarantine`)

When an upstream distribution or vendor ships a broken update, memory leak, or compromised binary (such as the `xz-utils` backdoor CVE-2024-3094), Exultia provides instant mitigation:

1. **Feed Broadcast**: Exultia signs and broadcasts a `QUARANTINE_REVOCATION` notice across the Vantage feed.
2. **Local Daemon Interception**: Within 60 seconds, all connected daemons ingest the revocation.
3. **Admission Halt**: Any scheduled or in-flight updates targeting that package are immediately blocked.
4. **Autonomous Downgrade**: If a canary host has already installed the affected package, the daemon detects the quarantine notice and executes:
   - Debian/Ubuntu: `apt-get install --allow-downgrades <pkg>=<safe_version>`
   - RHEL/Rocky: `dnf downgrade -y <pkg>`
5. **Local Manual Quarantine**:
   ```bash
   # Manually quarantine a suspicious package immediately
   sudo kinetic quarantine add xz-utils

   # Quarantine a specific upstream CVE patch
   sudo kinetic quarantine add --cve=UVI-2024-3094

   # List active quarantine directives
   sudo kinetic quarantine list
   ```

---

## 11. Prometheus Observability & Telemetry (`:9100/metrics`)

The daemon exposes production metrics formatted for standard Prometheus scraping:

```promql
# Threat Feed Sync & Database Metrics
exultia_feed_last_sync_timestamp_seconds 1729849200
exultia_feed_sync_status{endpoint="vantage-primary"} 1
exultia_feed_records_total 24388
exultia_feed_cisa_kev_total 12993

# Remediation & Execution Telemetry
exultia_remediations_total{tier="tier1_hotpatch",status="active"} 14
exultia_remediations_total{tier="tier2_package",status="applied"} 3
exultia_remediations_total{tier="tier2_package",status="deferred_lock"} 0

# Rollbacks & Safety Guards
exultia_rollbacks_total{reason="canary_health_failed"} 0
exultia_rollbacks_total{reason="operator_command"} 0
exultia_lock_contention_events_total 2
exultia_uptime_seconds 864200
```

### Standard Prometheus Alerting Rule
```yaml
groups:
  - name: exultia_alerts
    rules:
      - alert: ExultiaFeedSyncStalled
        expr: time() - exultia_feed_last_sync_timestamp_seconds > 7200
        for: 15m
        labels:
          severity: warning
        annotations:
          summary: "Kinetic daemon has not synchronized Vantage threat feed in over 2 hours"
          description: "Host {{ $labels.instance }} threat feed is stale. Check network pull status."
```

---

## 12. Air-Gap & Offline Catalog Operation

For classified, SCIF, or air-gapped data centers:
1. **Pre-Baked SQLite**: The installation package includes `/var/db/vantage/catalog.db` containing 24,388 verified UVI advisories and pre-compiled Praxis hotpatch recipes.
2. **Zero Internet Requirement**: In the absence of network connectivity, the daemon runs the full 60-second OODA loop against local SQLite, applying in-memory hotpatches and verifying compliance with zero network packets.
3. **Data Diode Delta Sync**: When updates are required, delta bundles (`uvi-delta-2026-10.bundle`) are transferred across hardware data diodes and imported:
   ```bash
   sudo kinetic catalog import /mnt/usb/uvi-delta-2026-10.bundle --verify-key=/etc/exultia/cosign.pub
   ```

---

## 13. Cryptographic Attestations & OpenVEX Audit Receipts

Every remediation or verification cycle writes an Ed25519-signed OpenVEX receipt to `/var/log/kinetic/attestations/`:

```json
{
  "@context": "https://openvex.dev/ns/v0.2.0",
  "@id": "https://exultia.tech/attestation/7f3a8b2c-9012",
  "author": "Exultia Kinetic Daemon v2.4.0",
  "role": "Autonomous Remediator",
  "timestamp": "2026-10-29T08:15:22Z",
  "statements": [
    {
      "vulnerability": {
        "name": "UVI-2024-4577",
        "aliases": ["CVE-2024-4577"]
      },
      "products": [
        {
          "@id": "pkg:deb/ubuntu/php-cgi@8.3.6-0ubuntu0.24.04.1"
        }
      ],
      "status": "fixed",
      "justification": "component_hotpatched_in_memory",
      "impact_statement": "In-memory argument sanitization trampoline injected into active php-cgi processes. Zero dropped TCP connections.",
      "action_statement": "Pre-image snapshot SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "cosign_signature": "MEQCIAx3e1v8X...signed_ed25519"
    }
  ]
}
```

This attestation provides cryptographically verifiable proof of compliance for SOC2 Type II, ISO 27001, and FedRAMP High audit requirements.
