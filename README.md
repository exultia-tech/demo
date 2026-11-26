# Exultia — Independent Zero-Trust Verification Suite

[![Independent Exultia Verification Suite](https://github.com/exultia-tech/demo/actions/workflows/verify-exultia.yml/badge.svg)](https://github.com/exultia-tech/demo/actions/workflows/verify-exultia.yml)

An auditable, self-contained verification harness for skeptical security and infrastructure engineers evaluating [Exultia](https://exultia.tech).

Rather than trusting a vendor dashboard or pre-canned mock output, this repository runs inside a **clean, ephemeral GitHub-hosted `ubuntu-24.04` VM** (or any disposable Linux VM you control) and verifies every claim using **independent OS tools outside the Exultia binary** (`python3-cryptography`, `sha256sum`, `sshd -T`, `nft`, `dpkg-query`, and `sysctl`).

---

## What It Independently Proves (8 Gates)

| Gate | Claim Under Test | Exultia Action | Independent Proof (Non-Exultia Check) |
| :--- | :--- | :--- | :--- |
| **1** | Vantage & Argent feeds are Ed25519-signed and resist generic fallback | *(Pure zero-Exultia Python)* | Fetches `/api/provenance/key`, `/api/patches/feed`, and `/api/argent/feed`, recomputes canonical SHA-256 + Ed25519 via Ubuntu's `python3-cryptography`, rejects a 1-byte mutated digest, and verifies `CVE-2026-136158` (Valkey JSON) carries `ABSTAIN-*` + `operatorGuidance` without `redis-server`. |
| **2** | Binary delivery verifies SHA-256 + SLSA L2 DSSE provenance | `install.sh` (`EXULTIA_REQUIRE_CHECKSUM=1`, `EXULTIA_REQUIRE_PROVENANCE=1`) | Asserts `/usr/local/bin/exultia` is `700 root:root` and its `sha256sum` matches `https://exultia.tech/downloads/exultia/SHA256SUMS.txt`. |
| **3** | Live Vantage hotfix remediation & deterministic rollback work on OpenSSH | `exultia patch --cve CVE-2024-6387` & `rollback` | Uses `sshd -t` and `sshd -T` to confirm effective `logingracetime` transitions `120 -> 0 -> 120`. |
| **4** | Live Vantage kernel network guard mitigates safely without breaking traffic | `exultia patch --cve CVE-2026-98432` & `rollback` | Inspects live `nft list table ip exultia_cve_2026_98432`, verifies normal TCP loopback handshake passes, and confirms table removal after rollback. |
| **5** | Live Argent feed executes real distro-native package updates | `exultia patch --bundle USN-7088-1 --os ubuntu` | Verifies `libbrotli1` state via `dpkg-query`. |
| **6** | Semantic gate fails closed instead of substituting wrong OS packages | `exultia patch --cve CVE-2026-136158` | Asserts non-zero exit code and confirms `redis-server` is **not** installed via `dpkg-query`. |
| **7** | SOX/PCI drift detection & reconciliation | `exultia drift audit --json` & `drift fix` | Injects `PermitRootLogin yes` and `net.ipv4.tcp_syncookies = 0`; verifies independent enforcement via `sshd -T` and `sysctl -n`. |
| **8** | Autonomous daemon dry-run, exploit/non-breakage gates & signed log | `exultia sync --dry-run`, `test --behavioral --json`, `attest --json` | Asserts all 5 behavioral gates pass, hash-chained `remediation_eventlog` is intact, and host attestation carries an Ed25519 signature. |

---

## Option A — Run Autonomously on Your Own GitHub Runner (Zero Vendor Access)

1. Click **Fork** at the top right of [`exultia-tech/demo`](https://github.com/exultia-tech/demo) into your own GitHub account.
2. Open your fork's **Actions** tab and enable workflows if prompted.
3. Select **Independent Exultia Verification Suite** → **Run workflow**.
4. Inspect every step log and download the **`exultia-verification-evidence`** artifact containing raw JSON/CLI transcripts (`gate1_provenance.json`, `gate4_nft_after_apply.txt`, `gate7_drift_before.json`, `gate8_behavioral.json`, `gate8_attestation.json`).

> *(Optional)* Leave `EXULTIA_OPERATOR_KEY` unset to verify public Vantage & Argent endpoints, or add a scoped Personal Access Token (`exultia_pat_...` from `https://exultia.tech/account?tab=tokens`) as an Actions repository secret named `EXULTIA_OPERATOR_KEY`.

---

## Option B — Run Locally Inside a Disposable Ubuntu 24.04 VM

> **Why a VM instead of a standard container?** Gates 3, 4, and 7 mutate real `sshd`, kernel `nftables`, and `/proc/sys` `sysctl` state, which unprivileged or default containers block.

```bash
git clone https://github.com/exultia-tech/demo.git exultia-verify
cd exultia-verify

sudo apt-get update -qq
sudo apt-get install -y -qq python3-cryptography openssh-server nftables jq

bash scripts/verify-exultia.sh
```

Or run a single gate in isolation (after running Gate 1 and Gate 2 once to install the binary):

```bash
bash scripts/verify-exultia.sh --gate 3
```

---

## Option C — Inspect Public Endpoints Directly Before Installing Anything

You can verify feed cryptography, the zero-dependency validator script, and the 115-scenario adversarial corpus from any shell with zero Exultia binaries on disk:

```bash
# 1. Inspect & run Exultia's standalone zero-Exultia-code Ed25519 verifier + 1-byte tamper test
curl -fsSLO https://raw.githubusercontent.com/exultia-tech/demo/main/scripts/verify-provenance.py
python3 scripts/verify-provenance.py || python3 verify-provenance.py

# 2. Fetch Exultia's Ed25519 provenance public key & adversarial corpus results (115 scenarios)
curl -fsSL https://exultia.tech/api/provenance/key | jq .
curl -fsSL https://exultia.tech/api/validation/corpus | jq '{totalScenarios, passedScenarios, failedScenarios}'

# 3. Inspect Exultia's standalone stdlib validator script before executing
curl -fsSL https://exultia.tech/api/validator/script -o validate.py
less validate.py
python3 validate.py --fast --samples=50
```

---

## Repository Contents

- [`scripts/verify-provenance.py`](scripts/verify-provenance.py) — Standalone zero-Exultia-code Python 3 Ed25519 + canonical SHA-256 + tamper + abstention verifier
- [`scripts/verify-exultia.sh`](scripts/verify-exultia.sh) — Auditable 8-gate Bash verification runner for Ubuntu 24.04
- [`.github/workflows/verify-exultia.yml`](.github/workflows/verify-exultia.yml) — GitHub Actions workflow running Gates 1–8 and archiving immutable evidence artifacts
- [`LICENSE`](LICENSE) — MIT License
