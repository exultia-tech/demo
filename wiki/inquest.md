# Exultia Inquest: Technical Documentation & API Reference

**Digital Forensics, Incident Response & Autonomous Public Records Compliance**

---

## 1. Quick-Start Guide

Exultia Inquest streamlines evidence processing, statutory FOIA/public records fulfillment, automated PII/PHI redaction, and chain-of-custody audit reporting.

### List Active Cases via cURL
```bash
curl -s "https://exultia.tech/api/inquest/cases" \
  -H "Authorization: Bearer <API_TOKEN>" | jq .
```

### Create a New Digital Forensics & Compliance Case (Python)
```python
import urllib.request
import json

case_payload = {
    "title": "Incident 2026-088: Server Memory Dump & Log Audit",
    "jurisdiction": "federal_foia",
    "targetAgency": "Department of Justice",
    "exemptionsRequested": ["b6_privacy", "b7c_law_enforcement"],
    "evidenceFiles": [
        {"filename": "memdump_prod_01.raw", "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}
    ]
}

req = urllib.request.Request(
    "https://exultia.tech/api/inquest/cases",
    data=json.dumps(case_payload).encode(),
    headers={"Content-Type": "application/json", "Authorization": "Bearer <TOKEN>"},
    method="POST"
)

with urllib.request.urlopen(req) as resp:
    result = json.loads(resp.read().decode())
    print("Created Case ID:", result["caseId"])
```

---

## 2. Extensive Product Details

### Architecture & Regulatory Compliance

Inquest was engineered to eliminate backlogs in municipal, state, and federal transparency workflows while enforcing strict digital evidence integrity.

```
 ┌────────────────────────────────────────────────────────┐
 │           Digital Evidence & Document Ingest           │
 │      (PDFs, Emails, Surveillance Audio, Disk Dumps)    │
 └──────────────────────────┬─────────────────────────────┘
                            │
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │          Autonomous Machine Perception Engine          │
 │   - PII/PHI Identifier (SSNs, medical, juvenile names) │
 │   - Statutory Exemption Tagging (FOIA b1 through b9)   │
 │   - Immutable Cryptographic Chain-of-Custody Hashing   │
 └──────────────────────────┬─────────────────────────────┘
                            │
      ┌─────────────────────┼─────────────────────┐
      ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│ Redacted Pack │     │ Stat Deadline │     │ Audit Trail   │
│ & Evidence Log│     │ Sentinel / SLA│     │ Manifest      │
└───────────────┘     └───────────────┘     └───────────────┘
```

### Key Capabilities

1. **Deterministic Redaction**: Multi-pass NLP and regex redaction removes personally identifiable information (PII), financial records, and confidential operational details without corrupting document structure.
2. **Statutory Exemption Tagging**: Automatically annotates every blacked-out segment with corresponding legal codes (e.g., *5 U.S.C. § 552(b)(6)* or *Cal. Gov. Code § 6254*).
3. **Chain of Custody Verifiability**: Every forensic artifact generates pre- and post-hash trees adhering to NIST SP 800-86 standards.

---

## 3. Complete API Documentation

### `GET /api/inquest/cases`
Lists all accessible forensic and public records matters for the authenticated tenant.

#### Request Headers
- `Authorization`: `Bearer <TOKEN>`

#### Response Example
```json
{
  "status": "success",
  "totalCases": 1,
  "cases": [
    {
      "caseId": "CAS-2026-0042",
      "title": "Incident 2026-088: Server Memory Dump",
      "status": "IN_REVIEW",
      "createdDate": "2026-10-18T08:00:00Z",
      "statutoryDeadline": "2026-11-08T08:00:00Z",
      "documentsCount": 14,
      "redactionCount": 382
    }
  ]
}
```

---

### `POST /api/inquest/cases`
Creates a new forensic investigation or public records tracking case.

#### Request Schema
```json
{
  "title": "FOIA Request: 2026 Port Cyber Assessment",
  "jurisdiction": "federal_foia",
  "targetAgency": "Cybersecurity and Infrastructure Security Agency",
  "exemptionsRequested": ["b4_commercial", "b7e_techniques"]
}
```

#### Response Example
```json
{
  "status": "created",
  "caseId": "CAS-2026-0043",
  "assignedAgent": "Inquest Sentinel 3",
  "deadlineTimestamp": "2026-11-15T00:00:00Z"
}
```
