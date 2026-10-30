# Exultia Kinetic Resident Daemon: Technical Specification & Internal Functions

**Autonomous Self-Healing Linux Remediator • Sub-Second Hotpatching • Local OS Patch Staging • Off-Peak Disruptive Auto-Reboot • Zero-Downtime Deterministic Rollback**

---

## 1. Overview & Architectural Principles

The **Kinetic Resident Daemon** (`kinetic daemon`) is a self-contained, statically compiled systems daemon engineered for production Linux hosts across bare-metal, virtual machines, cloud instances, and Kubernetes worker nodes. Operating as a continuous **60-second closed-loop OODA sentinel**, it automates both zero-downtime livepatching and full OS patch management:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        KINETIC AUTONOMOUS RESIDENT DAEMON                              │
│                                                                                        │
│   [ 1. OBSERVE ] ──► [ 2. ORIENT ] ──► [ 3. DECIDE ] ──► [ 4. ACT ] ──► [ 5. VERIFY ]  │
│   • Active Sockets   • Distro Errata   • Ring Topology   • Tier 1 Hotfix • Active Probes│
│   • OS Detection     • Local Staging   • Off-Peak Window • Non-Reboot    • OpenVEX Cert │
│   • Sysctl Drift     • Quarantine Feed • Lock Detection  • Auto-Reboot   • Telemetry    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Core Design Constraints:
1. **Zero Unscheduled Reboots**: The daemon never reboots a host outside an explicitly enabled `--disruptive-auto-reboot` policy and its configured `--off-peak-window` (`HH:MM-HH:MM`).
2. **Automatic Local OS Patch Staging**: Relevant OS patches for the detected or specified distribution (`--os`) are automatically staged in `<staging_dir>/<os>/<patch_id>/` with verified SLSA Level 3 metadata and executable remediation scripts (`apply_staged_patch.sh`).
3. **Granular Non-Reboot vs. Disruptive Execution**: Operators can independently enable automatic patching for non-reboot-required updates (`--auto-patch-non-reboot`) and off-peak disruptive patching with automatic reboot (`--disruptive-auto-reboot --off-peak-window "02:00-05:00"`).
4. **Non-Blocking Lock Deference**: Never issues `kill -9` against running package managers (`apt`, `dnf`, `zypper`) or deletes active `.lock` files. Yields with jittered backoff.
5. **Deterministic Sub-15ms Rollback**: Pre-image state snapshots in `/var/lib/kinetic/snapshots/` guarantee instant reversal with zero data loss.
6. **Air-Gap & Offline Autonomy**: Pre-baked with 24,388 UVI advisories and 12,993 CISA KEV records in local SQLite for 100% disconnected operation.

---

## 2. CLI Interface & Daemon Invocation

### Command-Line Arguments
```bash
kinetic daemon [OPTIONS]
```

| Flag | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--interval <sec>` | Integer | `3600` | Loop evaluation interval in seconds. |
| `--ring <0\|1\|2>` | Integer | `0` | Progressive rollout ring tier (0=Canary, 1=Staging, 2=Broad Fleet). |
| `--feed-url <url>` | String | `https://exultia.tech/api/patches/feed` | Signed UVI vulnerability intelligence pull endpoint. |
| `--argent-feed-url <url>` | String | `https://exultia.tech/api/argent/feed?format=kinetic` | Argent OS distribution errata and package bundle feed URL. |
| `--os <distro>` | String | Auto-Detect | Target OS distribution (`ubuntu`, `debian`, `rocky`, `rhel`, `alpine`, `suse`). Auto-detected from `/etc/os-release` if omitted. |
| `--staging-dir <path>` | Path | `/var/cache/exultia/staging` | Local directory where relevant OS patch bundles and scripts are automatically staged. |
| `--auto-stage` / `--no-auto-stage` | Boolean | `true` | Automatically stage relevant OS patches into the local staging directory. |
| `--auto-patch-non-reboot` | Boolean | `false` | Automatically install staged OS patches that do **not** require a reboot (`requires_reboot == false`). |
| `--disruptive-auto-reboot` | Boolean | `false` | Enable disruptive OS patching (kernel/reboot-required updates) with automatic reboot constrained to the off-peak window. |
| `--off-peak-window <HH:MM-HH:MM>` | String | `02:00-05:00` | Off-peak hours timeframe in 24-hour `HH:MM-HH:MM` format (supports same-day `02:00-05:00` and overnight `22:00-04:00` windows). |
| `--token <token>` | String | `$EXULTIA_TOKEN` | Bearer token or local Ed25519 license key path. |
| `--state-dir <path>`| Path | `/var/lib/kinetic` | State and snapshot pre-image store for atomic rollbacks. |
| `--dry-run` | Boolean | `false` | Evaluate vulnerabilities, stage patches, and simulate execution/reboots without host mutation. |

### Daemon Launch Examples
```bash
# Stage all relevant Ubuntu patches locally and automatically apply non-reboot updates
sudo kinetic daemon --os ubuntu --staging-dir /var/cache/exultia/staging --auto-patch-non-reboot

# Full autonomous patch management: non-reboot updates immediately + disruptive auto-reboot during 02:00-05:00 off-peak window
sudo kinetic daemon \
  --os ubuntu \
  --staging-dir /var/cache/exultia/staging \
  --auto-patch-non-reboot \
  --disruptive-auto-reboot \
  --off-peak-window "02:00-05:00"

# Stage OS patches only via kinetic upgrade subcommand
sudo kinetic upgrade --os rocky --staging-dir /var/cache/exultia/staging --stage-only
```

---

## 3. OS Patch Management & Off-Peak Maintenance Lifecycle

### 3.1 Local Patch Staging (`stage_os_patches`)
On every sync cycle (when `--auto-stage` is enabled), the daemon queries the Argent OS feed for the host's distribution and writes each relevant patch bundle to:
```
<staging_dir>/<os_distro>/<patch_id>/
├── apply_staged_patch.sh     # Executable shell script with upgrade & verification commands
└── bundle_metadata.json      # Full SLSA Level 3 signed advisory metadata & rollback command
```
A master manifest is maintained at `<state_dir>/staged_patches.json` and policy configuration is persisted at `<state_dir>/patch_policy.json`.

### 3.2 Non-Reboot Automatic Patching (`--auto-patch-non-reboot`)
When enabled, any staged bundle with `requires_reboot == false` is automatically applied during the daemon cycle:
1. Pre-flight snapshot record is created in `state.json`.
2. Package upgrade command executes and verification command confirms package integrity.
3. Canary health check verifies zero service degradation (or triggers instant rollback on failure).

### 3.3 Disruptive Patching with Auto-Reboot & Off-Peak Window (`--disruptive-auto-reboot`)
When enabled alongside `--off-peak-window "HH:MM-HH:MM"`:
- **Outside Off-Peak Hours**: Staged patches with `requires_reboot == true` are marked `deferred_off_peak` and held in the local staging directory without touching running workloads.
- **Inside Off-Peak Hours**: The daemon applies the staged disruptive patches, verifies canary health, marks the bundle `applied_reboot_scheduled`, and triggers a controlled system reboot (`shutdown -r +1`).

---

## 4. Systemd Supervisor & Watchdog Integration

The daemon integrates with systemd's supervisor framework via `sd_notify(3)` watchdog heartbeats:

### Production Service Unit (`/etc/systemd/system/kinetic.service`)
```ini
[Unit]
Description=Exultia Kinetic Autonomous Remediator & OS Patch Sentinel
Documentation=https://exultia.tech/wiki/kinetic-daemon
After=network-online.target time-sync.target
Wants=network-online.target

[Service]
Type=notify
WatchdogSec=120
Restart=on-failure
RestartSec=10
TimeoutStopSec=30

ExecStart=/usr/local/bin/kinetic daemon --interval 60 --ring 0 --auto-patch-non-reboot --disruptive-auto-reboot --off-peak-window "02:00-05:00"
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

---

## 5. Client-Side Configuration (`/etc/exultia/kinetic.toml`)
```toml
[daemon]
interval_seconds = 60
log_format = "json"

[patch_management]
target_os = "auto"
staging_dir = "/var/cache/exultia/staging"
auto_stage_patches = true
auto_patch_non_reboot = true
disruptive_auto_reboot = true
off_peak_window = "02:00-05:00"

[rollout]
ring = 0 # 0=Canary, 1=Staging, 2=Broad Fleet
auto_promote = true
soak_window_seconds = 900 # 15 minutes for Ring 0
health_check_command = "/usr/local/bin/app-health-check.sh"
health_check_timeout_seconds = 60
max_journal_error_rate = 5

[storage]
database_path = "/var/db/vantage/catalog.db"
snapshot_path = "/var/lib/kinetic/snapshots"
```
