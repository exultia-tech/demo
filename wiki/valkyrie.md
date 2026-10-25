# Exultia Valkyrie: Technical Documentation & API Reference

**On-Demand Pentesting & Non-Destructive Canary BAS Exploitability Prober**  
*Named for the Valkyries, who choose who shall live and who shall fall in battle.*

---

## 1. Quick-Start Guide

Traditional penetration testing relies on weaponized exploit payloads that risk crashing production daemons, corrupting memory, or deadlocking active threads. Valkyrie replaces destructive testing with **Canary BAS (Breach & Attack Simulation)**.

By injecting cryptographically signed HMAC-SHA256 handshake tokens and inspecting protocol responses, Valkyrie mathematically confirms exploitability without delivering malicious shellcode.

### Execute Non-Destructive Canary Probe (cURL)
```bash
curl -X POST "https://exultia.tech/api/valkyrie/probe" \
  -H "Content-Type: application/json" \
  -d '{
    "probeId": "probe-regresshion",
    "targetHost": "192.168.1.50",
    "targetPort": 22
  }'
```

### Standalone Python Execution
```bash
python3 modules/valkyrie/valkyrie_probe_runner.py 192.168.1.50 --probe regresshion --port 22
```

---

## 2. Canary BAS Protocol Architecture

```
   ┌────────────────────────────────────────────────────────┐
   │             Target Endpoint / Service Cluster          │
   └───────────────────────────┬────────────────────────────┘
                               │
            1. Safe Protocol   │ 2. Banner Negotiation &
               Handshake       │    Response Timing
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │             Valkyrie Canary Probe Engine               │
   │  - Synthesizes unique HMAC-SHA256 Canary Token         │
   │  - Evaluates response against known vulnerable offsets │
   │  - Generates verifiable attestation (SLSA Level 3)     │
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │             Praxis Hotpatch Handoff (1-Click)          │
   │  If confirmed vulnerable -> Praxis injects hotpatch in │
   │  under 40ms with 14ms atomic rollback guarantee        │
   └────────────────────────────────────────────────────────┘
```

---

## 3. Canary Probe Catalog

| Probe ID | Target Service | CVE Reference | Severity | CVSS | EPSS | Safe Verification Methodology |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `probe-regresshion` | OpenSSH (`sshd`) | CVE-2024-6387 | CRITICAL | 9.8 | 94% | RFC-4253 SSH banner negotiation checking vulnerable version window (8.5p1–9.7p1) without memory heap spray. |
| `probe-xz-backdoor` | Dynamic Linker / `sshd` | CVE-2024-3094 | CRITICAL | 10.0 | 98% | Safe publickey authentication handshake detecting IFUNC symbol interception delay and binary SHA-256 mismatch. |
| `probe-log4shell` | JVM Web Runtimes | CVE-2021-44228 | CRITICAL | 10.0 | 99% | Injects non-resolving mock canary token into `User-Agent` header; verifies if JNDI parser attempts resolution. |
| `probe-cups-browsed` | CUPS Print Daemon | CVE-2024-47176 | HIGH | 9.0 | 86% | Injects UDP test packet to port 631; verifies if daemon initiates unauthorized IPP handshake request. |
| `probe-php-cgi` | PHP-CGI FastCGI | CVE-2024-4577 | CRITICAL | 9.8 | 95% | Tests Best-Fit query string mapping argument handling without executing arbitrary command payloads. |

---

## 4. API Reference

### `POST /api/valkyrie/probe`
Executes an on-demand canary BAS probe against a specified host.

#### Request Schema
```json
{
  "probeId": "probe-regresshion",
  "targetHost": "10.0.4.15",
  "targetPort": 22,
  "dryRun": false
}
```

#### Response Example
```json
{
  "success": true,
  "probeId": "probe-regresshion",
  "target": "10.0.4.15:22",
  "canaryToken": "VALKYRIE-CVE-2024-6387-1792910400-9c12e845f918",
  "status": "VULNERABLE",
  "exploitabilityConfirmed": true,
  "banner": "SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.6",
  "cvss": 9.8,
  "epssPercentile": 0.94,
  "remediation": {
    "action": "praxis_hotpatch",
    "command": "sudo kinetic apply --cve=CVE-2024-6387",
    "praxisRemediationUrl": "/app/praxis?cve=CVE-2024-6387"
  }
}
```

---

### `GET /api/valkyrie/probe`
Returns the complete catalog of active non-destructive canary probe vectors with CVSS and EPSS percentiles.
