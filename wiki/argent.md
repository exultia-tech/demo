# Exultia Argent: Technical Documentation & API Reference

**Public Operating System Vendor Patch Feed Aggregator & Errata Telemetry Hub**

---

## 1. Quick-Start Guide

Exultia Argent is a specialized derivative of the Vantage intelligence feed designed specifically for infrastructure engineers, SecOps, and fleet administrators. While Vantage indexes weakness classifications (CWEs), weaponization stages, and CVSS calculations, **Argent focuses strictly on vendor security advisories, distribution patch bundles, and native binary package upgrades categorized by operating system**.

### Query Distro Patch Bundles via cURL
```bash
# Query Critical and Important patch bundles for Ubuntu 24.04 and 22.04
curl -s "https://exultia.tech/api/argent/feed?os=ubuntu&severity=critical" | jq .
```

### Ingest Live Errata Feeds via Python
```python
import urllib.request
import json

url = "https://exultia.tech/api/argent/feed?os=rocky&severity=critical"
req = urllib.request.Request(url, headers={"Accept": "application/json"})

with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode())
    print(f"Ingested {len(data['bundles'])} vendor patch bundles for Rocky Linux.")
    for b in data['bundles']:
        print(f"• [{b['bundleId']}] {b['title']}")
        print(f"  Command: {b['commands']['nativeUpgrade']}")
        print(f"  Zero-Downtime: {b['impact']['zeroDowntime']}")
```

### Deploy Native OS Updates via Kinetic
```bash
# Atomically upgrade Rocky Linux 9 OpenSSH errata with automatic rollback snapshot
kinetic upgrade --bundle RLSA-2024:4312 --os rocky

# Query and apply all critical vendor bundles across host distro
kinetic upgrade --os $(. /etc/os-release && echo "$ID")
```

### Direct Streamed POSIX Ingestion (Zero-Agent Mode)
```bash
# Automatically detects host distro, queries Argent API, and executes verified updates
curl -sSL "https://exultia.tech/api/argent/feed?os=ubuntu&format=bash" | sudo bash
```

---

## 2. Extensive Product Details

### Aggregator Architecture

Traditional threat intelligence feeds inundate operators with theoretical vulnerability disclosures and academic weakness taxonomies (CWE-122, CWE-787). In contrast, Argent ingests machine-readable security errata directly from upstream Linux distribution authorities, grouping fixes into **atomic vendor patch bundles**.

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │            Upstream Public Operating System Errata Feeds               │
 │ Canonical USN (OSV/OVAL) │ Debian Security Tracker │ RESF Rocky Errata │
 │ Alpine SecDB JSON        │ SUSE Maintenance OVAL   │ Arch Security ASA │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │ Continuous Ingestion
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │                  Argent Errata Normalization Engine                    │
 │   - Strip abstract CWE taxonomies; prioritize binary packages          │
 │   - Extract fixed package versions & architecture deltas               │
 │   - Synthesize native upgrade commands (apt, dnf, apk, zypper, pacman) │
 │   - Determine reboot & service-restart requirements                    │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
       ┌───────────────────┐                   ┌───────────────────┐
       │ Argent REST &     │                   │ Kinetic Hotfix &  │
       │ Streaming API     │                   │ Rollback Daemon   │
       └───────────────────┘                   └───────────────────┘
```

### Monitored Public Distribution Feeds

| Distribution | Upstream Provider | Public Feed Endpoint | Ingestion Format | Update Cadence |
| :--- | :--- | :--- | :--- | :--- |
| **Ubuntu Linux** | Canonical Security Team | `https://security.ubuntu.com/oval/com.ubuntu.noble.usn.oval.xml.bz2` | OSV / OVAL XML | Real-time on notice |
| **Debian GNU/Linux** | Debian Security Team | `https://security-tracker.debian.org/tracker/data/json` | JSON | Live continuous (15m) |
| **Rocky Linux** | Rocky Enterprise Software Foundation | `https://errata.rockylinux.org/` | DNF Updateinfo XML | Continuous build mirror |
| **Red Hat Enterprise Linux** | Red Hat Product Security | `https://access.redhat.com/hydra/rest/securitydata/cvrf.json` | CSAF 2.0 / CVRF JSON | Hourly API |
| **Alpine Linux** | Alpine Linux Core Team | `https://secdb.alpinelinux.org/v3.20/main.json` | JSON | Per-branch continuous |
| **SUSE Linux Enterprise** | SUSE Security Team | `https://ftp.suse.com/pub/projects/security/oval/` | OVAL XML | Daily maintenance sync |
| **Arch Linux** | Arch Linux Security Team | `https://security.archlinux.org/issues.json` | JSON API | Sub-hourly API |
| **Amazon Linux** | Amazon Web Services | `https://alas.aws.amazon.com/AL2023/alas.rss` | DNF Updateinfo | Continuous deployment |
| **Linux Kernel** | Kernel.org Maintainers | `https://www.kernel.org/feeds/kdist.xml` | Git Tree / RSS | Bi-weekly stable releases |

### Why Vendor Patch Bundles Matter

1. **Atomic Remediation**: Operating systems rarely update a single binary in isolation. An advisory like `RLSA-2024:4312` updates `openssh`, `openssh-server`, and `openssh-clients` concurrently. Argent bundles all interrelated package versions together to prevent dependency breakage.
2. **Zero-Downtime Telemetry**: Argent analyzes vendor metadata to flag whether an errata package requires a full system reboot (e.g. kernel point release) or a zero-downtime service reload (e.g. `sshd` or `nginx`).
3. **Deterministic Rollback Compatibility**: Every bundle provides exact previous version specifiers and package manager transaction rollback commands (`dnf history undo`, `apt-get install =<prev>`).

---

## 3. Complete API Documentation

### `GET /api/argent/feed`
Retrieves aggregated vendor patch bundles filtered by operating system, vendor severity, and keywords.

#### Query Parameters
- `os` *(optional)*: Operating system filter (`all`, `ubuntu`, `debian`, `rocky`, `rhel`, `alpine`, `suse`, `arch`, `amazon-linux`, `kernel`).
- `severity` *(optional)*: Vendor severity filter (`all`, `critical`, `important`, `moderate`, `low`).
- `q` or `query` *(optional)*: Case-insensitive search string matching package name, bundle ID, or advisory title.
- `reboot` *(optional)*: Filter by reboot requirement (`true` or `false`).
- `format` *(optional)*: Output format (`json`, `bash`, or `kinetic`). Default is `json`.
- `page` *(optional)*: Page number for pagination. Default is `1`.
- `limit` *(optional)*: Number of results per page (1-100). Default is `25`.

#### Response Example (`format=json`)
- **Status**: `200 OK`
- **Content-Type**: `application/json`

```json
{
  "total": 1,
  "page": 1,
  "limit": 25,
  "totalPages": 1,
  "bundles": [
    {
      "id": "ARG-RLSA-2024-4312",
      "bundleId": "RLSA-2024:4312",
      "os": "rocky",
      "osFamily": "linux-rhel",
      "osDisplayName": "Rocky Linux & RHEL",
      "targetReleases": ["Rocky Linux 9.4 (Blue Onyx)", "RHEL 9.4"],
      "title": "OpenSSH Remote Code Execution Signal Race Errata Bundle",
      "synopsis": "Official Rocky Enterprise Software Foundation security update fixing unauthenticated remote code execution in sshd.",
      "vendorSeverity": "CRITICAL",
      "issuedAt": "2024-07-01T14:40:00Z",
      "updatedAt": "2024-07-01T15:20:00Z",
      "cveList": ["CVE-2024-6387"],
      "packages": [
        {
          "name": "openssh-server",
          "arch": "x86_64",
          "currentVersion": "8.7p1-38.el9_4",
          "fixedVersion": "8.7p1-38.el9_4.1",
          "packageManager": "dnf"
        }
      ],
      "commands": {
        "nativeUpgrade": "dnf upgrade -y openssh openssh-server openssh-clients",
        "verification": "rpm -q --queryformat '%{VERSION}-%{RELEASE}\\n' openssh-server",
        "rollback": "dnf history undo last -y",
        "kineticDeploy": "kinetic upgrade --bundle RLSA-2024:4312 --os rocky"
      },
      "impact": {
        "rebootRequired": false,
        "servicesToRestart": ["sshd"],
        "zeroDowntime": true
      },
      "upstreamNoticeUrl": "https://errata.rockylinux.org/RLSA-2024:4312"
    }
  ]
}
```

---

### `GET /api/argent/stats`
Returns aggregated macro-level telemetry across all monitored distribution feeds.

#### Response Example
```json
{
  "totalBundles": 9,
  "totalPackagesUpdated": 19,
  "criticalCount": 6,
  "importantCount": 3,
  "zeroDowntimeCount": 7,
  "rebootRequiredCount": 2,
  "byOs": {
    "ubuntu": 2,
    "debian": 2,
    "rocky": 2,
    "alpine": 2,
    "suse": 1,
    "arch": 1,
    "amazon-linux": 1,
    "kernel": 1
  },
  "activeFeedSourcesCount": 9,
  "lastSyncTimestamp": "2026-10-18T12:00:00.000Z"
}
```

---

### `GET /api/argent/sources`
Lists official upstream distribution security tracker feeds and their synchronization status.

#### Response Example
```json
{
  "totalSources": 9,
  "status": "healthy",
  "sources": [
    {
      "id": "feed-ubuntu-usn",
      "os": "ubuntu",
      "name": "Canonical Ubuntu Security Notices (USN) & OVAL",
      "provider": "Canonical Security Team",
      "officialFeedUrl": "https://security.ubuntu.com/oval/com.ubuntu.noble.usn.oval.xml.bz2",
      "format": "OSV",
      "status": "active"
    }
  ]
}
```
