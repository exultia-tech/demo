# Exultia Technologies: Master API Reference

**Consolidated REST & Streaming Endpoints Specification**  
**Version:** 2.4.0

---

## Global Authentication & Headers

| Header | Type | Description |
| :--- | :--- | :--- |
| `Authorization` | string | Standard Bearer token authentication: `Bearer <TOKEN>` |
| `Content-Type` | string | Usually `application/json` |
| `Accept` | string | `application/json` (or `text/plain` for streamed POSIX shell hotfixes) |
| `X-Exultia-Client` | string | Optional client identifier for audit telemetry (e.g. `kinetic-cli/2.4.0`) |

---

## Endpoint Catalog

### 1. Kinetic (Autonomous Patch Feed & Binaries)

#### `GET /api/patches/feed`
Returns real-time zero-downtime hot-mitigation advisories.
- **Parameters**: `format=json|bash`, `os=ubuntu|rocky|debian|rhel|alpine`, `severity=critical|high`, `limit=N`
- **Example cURL**:
  ```bash
  curl -s "https://exultia.tech/api/patches/feed?format=json&limit=5"
  ```

#### `GET /api/kinetic/download`
Serves standalone binaries or JSON platform manifests.
- **Parameters**: `platform=linux|windows|all`, `format=json`
- **Example cURL**:
  ```bash
  curl -fsSL "https://exultia.tech/api/kinetic/download?platform=linux" -o kinetic
  ```

---

### 2. Vantage (Universal Vulnerability Index)

#### `GET /api/threat-feed/stats`
Macro-level threat metrics, CISA KEV counts, and registry sync status.
- **Example cURL**:
  ```bash
  curl -s "https://exultia.tech/api/threat-feed/stats"
  ```

#### `GET /api/threat-feed/sync`
Batch synchronization of parsed CVE/UVI threat records.
- **Parameters**: `min_cvss=N`, `cisa_kev_only=true|false`, `distro=name`, `limit=N`
- **Example cURL**:
  ```bash
  curl -s "https://exultia.tech/api/threat-feed/sync?min_cvss=9.0&cisa_kev_only=true"
  ```

#### `POST /api/threat-feed/virtual-ciso`
Natural-language executive consultation and vulnerability risk briefing.
- **Example cURL**:
  ```bash
  curl -X POST "https://exultia.tech/api/threat-feed/virtual-ciso" \
    -H "Content-Type: application/json" \
    -d '{"query": "Summarize top critical vulnerabilities"}'
  ```

---

### 3. Eris (Adversary Emulation & Chaos Lab)

#### `POST /api/eris/generate`
Compiles an on-demand inoculation script with auto-rollback watchdog.
- **Request Body**:
  ```json
  {
    "os": "ubuntu",
    "selectedModuleIds": ["ssh_permissive_regresshion", "rogue_c2_listeners"],
    "autoRollbackMinutes": 10
  }
  ```
- **Example cURL**:
  ```bash
  curl -X POST "https://exultia.tech/api/eris/generate" \
    -H "Content-Type: application/json" \
    -d '{"os":"ubuntu","autoRollbackMinutes":10}'
  ```

#### `GET /api/eris/raw`
Returns raw compiled POSIX shell script suitable for piping directly into `sh`.
- **Parameters**: `os=ubuntu|debian|rhel|rocky|alpine`, `timeout=10`, `modules=id1,id2`
- **Example cURL**:
  ```bash
  curl -s "https://exultia.tech/api/eris/raw?os=ubuntu&timeout=10" | sudo sh
  ```

---

### 4. Valkyrie (Non-Destructive Canary BAS)

#### `POST /api/valkyrie/probe`
Executes an on-demand non-destructive canary probe against a target endpoint.
- **Request Body**:
  ```json
  {
    "probeId": "probe-regresshion",
    "targetHost": "10.0.4.15",
    "targetPort": 22,
    "dryRun": false
  }
  ```
- **Example cURL**:
  ```bash
  curl -X POST "https://exultia.tech/api/valkyrie/probe" \
    -H "Content-Type: application/json" \
    -d '{"probeId": "probe-regresshion", "targetHost": "10.0.4.15", "targetPort": 22}'
  ```

#### `GET /api/valkyrie/probe`
Returns the active catalog of non-destructive canary probes with CVSS and EPSS scoring.
- **Example cURL**:
  ```bash
  curl -s "https://exultia.tech/api/valkyrie/probe"
  ```

---

### 5. Praxis (Tactical Simulation & Remediation)

#### `GET /api/praxis/feed`
Retrieves remediation strategies by OS target.
- **Parameters**: `target=ubuntu|rocky|debian|alpine`
- **Example cURL**:
  ```bash
  curl -s "https://exultia.tech/api/praxis/feed?target=ubuntu"
  ```

#### `POST /api/praxis/generate`
Generates serialized Ansible playbooks with 10% canary controls or POSIX hotfix scripts.
- **Example cURL**:
  ```bash
  curl -X POST "https://exultia.tech/api/praxis/generate" \
    -H "Content-Type: application/json" \
    -d '{"cveId": "CVE-2024-6387", "targetPlatform": "ubuntu", "automationFormat": "ansible", "canaryPercentage": 10}'
  ```

---

### 6. Argent (Multi-OS Vendor Errata Feed)

#### `GET /api/argent/feed`
Streams standardized vendor security advisories from Debian, Ubuntu, Red Hat, Rocky, Alpine, and SUSE.
- **Parameters**: `os=string`, `severity=string`, `limit=N`
- **Example cURL**:
  ```bash
  curl -s "https://exultia.tech/api/argent/feed?os=ubuntu&limit=10"
  ```

#### `GET /api/argent/stats`
Telemetry metrics across all aggregated distribution security trackers.

---

### 7. Axiom (Certification Simulator & Question Base)

#### `GET /api/axiom/exam`
Fetches adaptive simulation questions by certification exam.
- **Parameters**: `exam=cissp|security_plus|cism|ceh|oscp|aws_security`, `count=N`, `domain=string`
- **Example cURL**:
  ```bash
  curl -s "https://exultia.tech/api/axiom/exam?exam=cissp&count=10"
  ```

#### `POST /api/axiom/exam`
Evaluates responses, computes domain strength percentages, and issues certificate tokens.
- **Example cURL**:
  ```bash
  curl -X POST "https://exultia.tech/api/axiom/exam" \
    -H "Content-Type: application/json" \
    -d '{"examId": "cissp", "candidateId": "cand-01", "responses": [{"questionId": "Q-01", "selectedChoice": "A"}]}'
  ```

#### `GET /api/axiom/export`
Exports question catalogues and syllabus data for enterprise LMS integration (SCORM / LTI).
- **Parameters**: `exam=name`, `format=json|csv`

---

### 8. Inquest (Digital Forensics & Public Records)

#### `GET /api/inquest/cases`
Lists open investigations and public records requests.
- **Requires Auth**: Yes

#### `POST /api/inquest/cases`
Creates a new forensic tracking case with statutory deadlines.
- **Requires Auth**: Yes

---

### 9. PureIDE & PureOS

#### `GET /api/pureide/versions`
Certified compiler and toolchain versions for hermetic builds.

#### `POST /api/pureide/events`
Telemetry logging for hermetic build sandboxes.

---

### 10. AI Support Sentinel

#### `POST /api/support/chat`
Autonomous technical support sentinel answering product queries, installation instructions, and licensing details.
- **Example cURL**:
  ```bash
  curl -X POST "https://exultia.tech/api/support/chat" \
    -H "Content-Type: application/json" \
    -d '{"message": "How do I test in-memory hotpatching with Praxis?"}'
  ```
