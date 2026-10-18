# Exultia Vantage: Technical Documentation & API Reference

**Global Universal Vulnerability Index & High-Throughput Threat Intelligence Hub**

---

## 1. Quick-Start Guide

Exultia Vantage ingests and cross-correlates vulnerability disclosures across 110+ sovereign and open-source threat registries, providing prioritized, enriched telemetry for SecOps and automated patch management.

### Query Global Threat Statistics via cURL
```bash
curl -s "https://exultia.tech/api/threat-feed/stats" | jq .
```

### Ingest Live Filtered Threat Stream (Python)
```python
import urllib.request
import json

url = "https://exultia.tech/api/threat-feed/sync?min_cvss=9.0&cisa_kev_only=true"
req = urllib.request.Request(url, headers={"Accept": "application/json"})

with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode())
    print(f"Ingested {len(data['advisories'])} critical vulnerabilities.")
    for adv in data['advisories']:
        print(f"• [{adv['cveId']}] CVSS: {adv['cvss']} - {adv['title']}")
```

### Query the AI Virtual CISO Assistant
```bash
curl -X POST "https://exultia.tech/api/threat-feed/virtual-ciso" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are our top 3 exposed attack vectors from CISA KEV this week?",
    "organizationContext": "Healthcare provider with Linux and Kubernetes infrastructure"
  }'
```

---

## 2. Extensive Product Details

### Aggregator Architecture

Vantage continuously reconciles incoming advisories from multiple upstream authorities into a unified data structure, deduplicating aliases (e.g., mapping vendor advisory IDs to canonical CVEs) and appending CVSS v3.1 vector calculations.

```
 ┌────────────────────────────────────────────────────────┐
 │        110+ Global Threat Intelligence Sources         │
 │ (CISA KEV, NVD, GitHub GHSA, Debian, Red Hat, Alpine)  │
 └──────────────────────────┬─────────────────────────────┘
                            │ Real-Time Ingestion
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │        Exultia Normalization & Deduplication Core       │
 │   - Alias mapping (CVE <-> Vendor Advisories)          │
 │   - CVSS v3.1 Scoring & Attack Vector Parsing          │
 │   - SLSA Level 3 Cryptographic Cosign Attestation      │
 └──────────────────────────┬─────────────────────────────┘
                            │
      ┌─────────────────────┼─────────────────────┐
      ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│ Global Threat │     │ Kinetic Auto  │     │ Virtual CISO  │
│ Telemetry API │     │ Patch Engine  │     │ AI Copilot    │
└───────────────┘     └───────────────┘     └───────────────┘
```

### Key Capabilities

1. **Comprehensive Coverage**: Over 10,800 active advisories indexed, including real-time synchronization with CISA Known Exploited Vulnerabilities (KEV).
2. **Sub-second Response Times**: In-memory caching engine delivers aggregated feeds in under 20 milliseconds.
3. **Zero-Noise Prioritization**: Automatically differentiates between theoretical vulnerabilities and weaponized exploits actively observed in the wild.
4. **Context-Aware Advisory Intelligence**: Integrates AI-powered threat impact analysis tailored to specific operating systems, architectures, and tech stacks.

---

## 3. Complete API Documentation

### `GET /api/threat-feed/stats`
Provides macro-level metrics, total active advisories, severity distribution, and ingestion health.

#### Request
- **Method**: `GET`
- **Path**: `/api/threat-feed/stats`

#### Response Example
- **Status**: `200 OK`
- **Content-Type**: `application/json`

```json
{
  "totalAdvisories": 10895,
  "cisaKevCount": 6814,
  "severityDistribution": {
    "critical": 7166,
    "high": 3723,
    "medium": 6,
    "low": 0
  },
  "lastSyncedAt": "2026-10-18T12:00:00.000Z",
  "healthyRegistries": 110,
  "syncStatus": "healthy"
}
```

---

### `GET /api/threat-feed/sync`
Synchronizes raw or filtered advisories for SIEM, SOAR, or custom ingestion pipelines.

#### Query Parameters
| Parameter | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `min_cvss` | number | No | Minimum CVSS score filter (0.0 to 10.0) | `min_cvss=8.0` |
| `cisa_kev_only` | boolean | No | Only return actively exploited items in CISA KEV | `cisa_kev_only=true` |
| `distro` | string | No | Filter by target OS distribution | `distro=rocky` |
| `limit` | integer| No | Max results to return (default: 100, max: 2000)| `limit=500` |

#### Response Example
```json
{
  "count": 2,
  "advisories": [
    {
      "id": "UVI-2024-3094",
      "cveId": "CVE-2024-3094",
      "title": "XZ Utils Backdoor in liblzma upstream tarballs",
      "cvss": 10.0,
      "severity": "CRITICAL",
      "cisaKev": true,
      "affectedPackages": ["xz-utils", "liblzma5"],
      "publishedAt": "2024-03-29T00:00:00Z"
    }
  ]
}
```

---

### `POST /api/threat-feed/virtual-ciso`
AI-driven advisory consultation engine providing natural-language executive briefings and risk assessments.

#### Request
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "query": "Assess risk of CVE-2024-3094 on Debian systems",
  "organizationContext": "E-commerce platform running Debian 12 with OpenSSH exposed"
}
```

#### Response Example
```json
{
  "status": "success",
  "analysis": "CVE-2024-3094 represents a critical supply-chain compromise allowing unauthorized RCE bypass in sshd. Given your Debian 12 deployment, verify if versions 5.6.0 or 5.6.1 were ever installed from experimental repos. Immediate mitigation: deploy Exultia Kinetic Tier 1 hotfix to pin sshd LoginGraceTime to 0.",
  "recommendedAction": "APPLY_KINETIC_HOTFIX",
  "riskRating": "CRITICAL"
}
```
