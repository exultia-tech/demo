# Exultia Private Beta Tester Checklist

Welcome to the **Exultia Private Beta Test Program**. This checklist provides a structured, step-by-step set of real-world tests you can run on your evaluation VMs or lab servers across **Linux / BSD (`exultia` / `xul`)** and **Windows Server (`exultia.exe`)**.

Every test below is 100% deterministic, reversible, and safe to run on a staging or evaluation VM. Check off each item (`- [x]`) as you complete it.

---

## 📋 Beta Tester Environment Record

Before starting, record your test environment details:

- **Tester Name / Organization:** `___________________________`
- **Beta Access Code ID:** `___________________________`
- **Linux / BSD Distros Tested:** `___________________________` (e.g., Ubuntu 24.04, Debian 12, RHEL/Rocky 9, Alpine 3.20, FreeBSD 14)
- **Windows Server Versions Tested:** `___________________________` (e.g., Windows Server 2019, 2022, 2025)
- **Exultia Daemon Version (`xul --version`):** `___________________________`

---

## Phase 1: Installation, Binary Integrity & Sideloaded Config (`exultia.conf`)

### [ ] Test 1.1 — One-Line Installation & Self-Test (Linux / BSD)
Run the official installer to install `/usr/local/bin/exultia`, the `/usr/local/bin/xul` shorthand symlink, and the sideloaded `/etc/exultia/exultia.conf` configuration file:
```bash
curl -fsSL https://exultia.tech/install.sh | sudo sh
xul --version
xul test
```
- **Expected Result:**
  - `xul --version` reports the active daemon build (`2.6.0`).
  - `/usr/local/bin/exultia`, `/usr/local/bin/xul`, and `/etc/exultia/exultia.conf` exist on disk.
  - `xul test` passes all built-in cryptographic and self-check gates with `EXIT CODE: 0`.

### [ ] Test 1.2 — Standalone Binary Self-Test (Windows Server)
On Windows Server (2019 / 2022 / 2025), run from an Administrator PowerShell or Command Prompt:
```powershell
.\exultia.exe --version
.\exultia.exe test
```
- **Expected Result:**
  - `exultia.exe --version` prints version `2.6.0`.
  - `exultia.exe test` initializes the Windows Update Agent (`Microsoft.Update.Session`) COM interface, verifies `%ProgramData%\exultia`, and exits `0`.

### [ ] Test 1.3 — Sideloaded `exultia.conf` Zero-Flag Hydration
Verify that you can configure your daemon preferences in `exultia.conf` instead of passing command-line flags on every run:
```bash
# 1. Inspect the active configuration file and resolved settings
xul config --show

# 2. Or generate a fresh template in a custom path
xul config --init --path=/etc/exultia/exultia.conf
```
Edit `/etc/exultia/exultia.conf` (or `%ProgramData%\exultia\exultia.conf` on Windows) and set:
```ini
default_action = status
maintenance_window = 02:00-05:00
ai_self_heal = auto
```
Now run bare `xul` with **no command-line flags**:
```bash
xul
```
- **Expected Result:**
  - `xul` automatically reads `exultia.conf` and executes `status` using your configured maintenance window and AI self-healing policy without requiring CLI flags.

---

## Phase 2: The 5-Gate "Bullshit Validator" Suite (`validate.py`)

### [ ] Test 2.1 — Standard 5-Gate Local Verification
From the root of this repository (`https://github.com/exultia-tech/demo`), run the standalone validator (uses Python 3.8+ standard library only, zero `pip` dependencies):
```bash
git clone --depth=1 https://github.com/exultia-tech/demo.git && cd demo
python3 validate.py
```
- **Expected Result:**
  - **[Gate 1]** SLSA Level 3 Cryptographic Integrity Gate → `PASS`
  - **[Gate 2]** Live Hotfix Before-and-After Execution Probe → `PASS`
  - **[Gate 3]** Deterministic Rollback SLA Benchmark (`<50ms` across 1,000 iterations) → `PASS`
  - **[Gate 4]** Vantage Threat Intelligence Feed & Multi-Advisory Evaluation → `PASS`
  - **[Gate 5]** Independent 3rd-Party Scanner Audit readiness → `PASS`

### [ ] Test 2.2 — 100-Sample Random Threat Audit + Independent Aqua Trivy Verification
Run 100 randomized threat advisories and verify with Aqua Security Trivy:
```bash
python3 validate.py --fast --samples=100 --random --trivy
```
- **Expected Result:**
  - All 100 sampled advisories are evaluated, mitigated, verified, and rolled back cleanly.
  - If Trivy is installed (`bash scripts/verify-trivy.sh`), Trivy flags vulnerabilities before mitigation, confirms `0 VULNERABILITIES DETECTED` after hotfix, and re-flags them immediately after rollback.

### [ ] Test 2.3 — Local Command Audit Ledger Verification
Verify that every shell command executed during testing was logged with timestamps, exit codes, and SHA-256 hashes:
```bash
grep -E "COMMAND_EXEC|ROLLBACK" command_history.log | head -n 25
```
- **Expected Result:**
  - `command_history.log` contains the complete chronological execution trail with microsecond latencies and SHA-256 pre/post state hashes.

---

## Phase 3: Zero-Downtime Patching, Maintenance Windows & Instant Rollback

### [ ] Test 3.1 — Peak-Hours Non-Reboot Patching vs. Disruptive Patch Deferral
Run a patch triage cycle during normal daytime hours (outside `02:00-05:00`):
```bash
sudo xul --patch --dry-run
sudo xul --patch --window="02:00-05:00"
```
- **Expected Result:**
  - Safe userland, service, and database updates that require **zero reboot** are applied and verified immediately.
  - Disruptive kernel, `glibc`, `systemd`, or Windows Monthly Cumulative Updates that require a system restart are pre-staged into local cache and **deferred** until `02:00-05:00`.

### [ ] Test 3.2 — Zero-Reboot Live Mitigation & Kernel Livepatch
Apply a live zero-downtime mitigation (e.g., OpenSSH `CVE-2024-6387` RegreSSHion or kernel livepatch):
```bash
sudo xul apply CVE-2024-6387
sudo xul livepatch
```
- **Expected Result:**
  - Exultia captures a SHA-256 pre-image snapshot in `/var/lib/exultia/snapshots/`.
  - Applies the drop-in guard (`/etc/ssh/sshd_config.d/00-exultia-regrsshion-fix.conf`) and passes the `sshd -t` verification gate with zero dropped SSH connections and zero reboot.

### [ ] Test 3.3 — Sub-50ms Deterministic Atomic Rollback
Immediately roll back the mitigation applied in Test 3.2:
```bash
sudo xul rollback CVE-2024-6387
```
- **Expected Result:**
  - Original file state is restored bit-for-bit from the SHA-256 pre-image snapshot in `<50ms` with `0` service interruption.

---

## Phase 4: Continuous SOX 404 & PCI-DSS v4.0 Drift Reconciliation

### [ ] Test 4.1 — Baseline Compliance Audit
Run the compliance and hardening audit across all 17 SOX 404 / PCI-DSS v4.0 controls:
```bash
sudo xul --audit
```
- **Expected Result:**
  - Prints per-control compliance status across SSH hardening, kernel sysctl network guards, file permissions, and service sandboxing.

### [ ] Test 4.2 — Intentional Misconfiguration & Autonomous Self-Reconciliation
Deliberately introduce a weak configuration setting (or run `--reconcile`) and verify Exultia restores compliance:
```bash
# Deliberately weaken a non-destructive sysctl or drop-in setting in a test file, then reconcile:
sudo xul --reconcile
sudo xul --audit
```
- **Expected Result:**
  - `sudo xul --reconcile` detects all drifted controls, creates pre-image backups, restores compliant settings, and confirms `0` remaining drifted controls on re-audit.

---

## Phase 5: Enhanced Neural Self-Healing, Privacy Redaction & Corporate AI Routing

Exultia includes a 3-stage **Neural Self-Healing Engine** that automatically repairs broken custom feed commands, shell mismatches (`[[ ... ]]` in `/bin/sh`, bare PowerShell in `cmd.exe`), missing custom directories, non-standard binary paths, and package manager locks.

### [ ] Test 5.1 — Outbound Privacy Redaction (`<PATH_1>` Tokenization)
Run a command with a custom directory path under `--ai-heal=auto` and inspect the `[Kinetic Neural Healer]` diagnostic output:
```bash
sudo xul --patch --ai-heal=auto
```
- **Expected Result:**
  - Any custom directory path (e.g., `/opt/acme-corp/custom-ssh/00-guard.conf` or `D:\CorpGuard\Payloads\fix.conf`) is tokenized into `<PATH_1>/00-guard.conf` **before** leaving the host.
  - Private IPv4 addresses, hostnames, and Bearer/API tokens are scrubbed locally.
  - The inbound repaired command is rehydrated back to the real local path on the endpoint.

### [ ] Test 5.2 — Manual Operator Approval Mode (`--ai-heal=manual`)
Verify that strict operator-in-the-loop governance works before any AI relay transmission occurs:
```bash
sudo xul --patch --ai-heal=manual
```
- **Expected Result:**
  - When a command fails, the daemon prints the exact **Outbound Redacted Signature** and pauses with:
    `[Kinetic Neural Healer] MANUAL APPROVAL REQUIRED: Transmit redacted signature to Exultia Neural Relay? [y/N]:`
  - Answering `n` aborts transmission immediately; answering `y` authorizes the repair.

### [ ] Test 5.3 — `<1ms` Fleet Memory Cache (`learned_heals.json`)
After a broken custom command is healed once under `--ai-heal=auto`, inspect the local Fleet Memory cache and re-run the same command:
```bash
cat /var/lib/exultia/learned_heals.json
```
- **Expected Result:**
  - The SHA-256 signature of the broken command and its verified repair are stored in `/var/lib/exultia/learned_heals.json` (or `%ProgramData%\exultia\learned_heals.json` on Windows).
  - Subsequent executions apply the learned fix locally in **`<1ms`** with **zero network calls**.

### [ ] Test 5.4 — Corporate / Internal LLM Routing (`--ai-endpoint`)
If your organization operates an internal LLM gateway (OpenAI-compatible `/v1/chat/completions`, vLLM, Ollama `/api/chat`, Anthropic `/v1/messages`, or internal proxy), route Neural Self-Healing to your own endpoint:
```bash
sudo xul --patch \
  --ai-heal=auto \
  --ai-endpoint="https://llm.internal.yourcompany.com/v1/chat/completions" \
  --ai-model="your-internal-model"
```
*(Or set `ai_endpoint_url` and `ai_model` in `exultia.conf`.)*
- **Expected Result:**
  - `[Kinetic Neural Healer]` logs `Link: corporate-custom (...)` and sends the exact same redacted prompt to your internal endpoint—zero traffic is sent to Exultia's default cloud relay.

---

## Phase 6: Windows Server Native WUA COM & MSRC Virtual Patching

*(For Beta Testers evaluating `exultia.exe` on Windows Server 2019, 2022, or 2025)*

### [ ] Test 6.1 — Native WUA COM Update Triage
Run from an Administrator PowerShell prompt:
```powershell
.\exultia.exe patch --dry-run
```
- **Expected Result:**
  - Queries `Microsoft.Update.Session` (`IsInstalled=0 and Type='Software'`).
  - Separates zero-reboot updates (`InstallationBehavior.RebootBehavior == 0`, Defender definitions, Windows Server 2025 Hotpatches) from disruptive updates (`RebootBehavior > 0`, Monthly Cumulative Rollups).

### [ ] Test 6.2 — MSRC Registry & Windows Defender Firewall Virtual Patch
Apply a live zero-reboot Windows Server virtual patch (e.g., `CVE-2024-38063` TCP/IP IPv6 RCE or `CVE-2024-38077` Windows Licensing RCE):
```powershell
.\exultia.exe apply CVE-2024-38063
.\exultia.exe rollback CVE-2024-38063
```
- **Expected Result:**
  - `apply` backs up the registry/firewall state into `%ProgramData%\exultia\snapshots`, applies the official MSRC Registry/Firewall mitigation with zero reboot, and verifies active enforcement.
  - `rollback` restores the exact prior Windows Registry/Firewall state in milliseconds.

### [ ] Test 6.3 — Windows `cmd.exe` / PowerShell Neural Self-Healing
Verify that `exultia.exe` automatically heals custom feed commands on Windows when:
1. A command redirects output to a custom Windows folder (`C:\ProgramData\Exultia\Custom\...`) that does not exist yet → auto-prepends `if not exist "<PATH_1>" mkdir "<PATH_1>" && ...`
2. A bare PowerShell cmdlet (`New-Item`, `Set-ItemProperty`, `Get-HotFix`) is invoked inside `cmd.exe` → auto-wraps in `powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "..."`

---

## Phase 7: Custom Company Feeds, CBOM Audit Export & Sign-Off

### [ ] Test 7.1 — Custom Internal Patch Feed (`--feed-url`)
Point Exultia at a custom JSON feed file or internal HTTPS URL alongside the official feeds:
```bash
xul feed --feed-url="https://internal.yourcompany.com/exultia-custom-feed.json"
```
- **Expected Result:**
  - Exultia ingests and merges your custom advisories alongside the Vantage and Argent feeds.

### [ ] Test 7.2 — CycloneDX 1.6 Cryptographic Bill of Materials (CBOM) Export
Generate a compliance-ready CycloneDX 1.6 JSON CBOM of all applied mitigations, package states, and cryptographic snapshots:
```bash
xul cbom --output=/tmp/exultia-beta-cbom.json
cat /tmp/exultia-beta-cbom.json | head -n 30
```
- **Expected Result:**
  - Writes a valid CycloneDX 1.6 JSON report containing host metadata, applied patches, SHA-256 snapshot hashes, and verification gate timestamps.

---

## ✅ Beta Tester Sign-Off & Feedback Submission

Once you have completed the checklist above:

- [ ] **All applicable Linux / BSD tests passed**
- [ ] **All applicable Windows Server tests passed**
- [ ] **Zero unplanned reboots or dropped SSH/RDP sessions observed**
- [ ] **Neural Self-Healing & `<PATH_1>` privacy redaction verified**

Send your completed checklist or any edge-case findings to **`beta@exultia.tech`** (or open an issue in this repository) along with your `command_history.log` or `/tmp/exultia-beta-cbom.json` if you would like our engineering team to review a specific host profile.

