# Exultia Technologies: Master API Reference

**Consolidated REST & Streaming Endpoints Specification**

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

### 3. Axiom (Certification Simulator & Question Base)

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
Exports question catalogues and syllabus data for LMS integration.
- **Parameters**: `exam=name`, `format=json|csv`

---

### 4. Inquest (Digital Forensics & Public Records)

#### `GET /api/inquest/cases`
Lists open investigations and public records requests.
- **Requires Auth**: Yes

#### `POST /api/inquest/cases`
Creates a new forensic tracking case with statutory deadlines.
- **Requires Auth**: Yes

---

### 5. Praxis (Tactical Simulation & Remediation)

#### `GET /api/praxis/feed`
Retrieves remediation strategies by OS target.

#### `POST /api/praxis/generate`
Generates serialized Ansible playbooks with 10% canary controls.

---

### 6. PureIDE & PureOS

#### `GET /api/pureide/versions`
Certified compiler and toolchain versions.

#### `POST /api/pureide/events`
Telemetry logging for hermetic build sandboxes.

---

### 7. Support & Sentinel AI

#### `POST /api/support/chat`
Autonomous technical support sentinel answering product queries, installation instructions, and licensing details.
- **Example cURL**:
  ```bash
  curl -X POST "https://exultia.tech/api/support/chat" \
    -H "Content-Type: application/json" \
    -d '{"message": "How do I run the Kinetic daemon on Linux?"}'
  ```
