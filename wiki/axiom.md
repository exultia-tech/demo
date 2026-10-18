# Exultia Axiom: Technical Documentation & API Reference

**Enterprise Cybersecurity Exam Simulator, Question Base & LMS API Feed**

---

## 1. Quick-Start Guide

Exultia Axiom prepares security engineers, auditors, and SOC analysts for industry-recognized certifications through realistic scenario-based simulations, psychometric grading, and institutional LMS feeds.

### Launch an Interactive Exam Simulation via cURL
```bash
# Fetch a 10-question practice exam for CISSP Domain 1
curl -s "https://exultia.tech/api/axiom/exam?exam=cissp&count=10" | jq .
```

### Grade Responses and Evaluate Weakness (Node.js / TypeScript)
```typescript
const payload = {
  examId: "cissp",
  candidateId: "cand-88219",
  responses: [
    { questionId: "Q-CISSP-001", selectedChoice: "B" },
    { questionId: "Q-CISSP-002", selectedChoice: "A" }
  ]
};

const res = await fetch("https://exultia.tech/api/axiom/exam", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
});

const report = await res.json();
console.log(`Final Score: ${report.scorePercentage}% | Passed: ${report.passed}`);
console.log("Domain Breakdown:", report.domainBreakdown);
```

### Export Curriculum Question Bank (JSON / CSV)
```bash
curl -s "https://exultia.tech/api/axiom/export?format=json&exam=security_plus" -o secplus_curriculum.json
```

---

## 2. Extensive Product Details

### Curricula & Certification Coverage

Axiom maintains active question bases and adaptive simulations across the most widely demanded professional credentials:

| Certification | Target Audience | Primary Focus Domains |
| :--- | :--- | :--- |
| **CISSP** (ISC)² | Security Architects & Leaders | Security Governance, Asset Security, Cryptography, Identity & Access |
| **CompTIA Security+** | Associate Security Practitioners | General Security Concepts, Threats & Vulnerabilities, Architecture |
| **CISM** (ISACA) | Security Managers & Officers | Information Security Governance, Risk Management, Incident Response |
| **CEH** (EC-Council) | Penetration Testers & Red Teams | Footprinting, Network Scanning, Web Application Hacking, Exploitation |
| **OSCP** (OffSec) | Hands-on Offensive Practitioners | Active Directory Attacks, Buffer Overflows, Privilege Escalation |
| **AWS Certified Security** | Cloud Security Engineers | Identity Management, Infrastructure Protection, Incident Logging |

### Key Capabilities

1. **Adaptive Question Engine**: Questions dynamically adjust in complexity based on real-time candidate accuracy.
2. **Domain-Level Diagnostics**: Detailed scoring reports isolate specific conceptual gaps (e.g., asymmetric cryptography key lengths vs. zero-trust architecture).
3. **Enterprise LMS & SCORM Compliance**: Feed endpoints seamlessly synchronize question pools and completion attestations into enterprise Learning Management Systems (Canvas, Moodle, Blackboard, Workday Learning).
4. **Verifiable Completion Tokens**: Cryptographically signed completion tokens for institutional verification.

---

## 3. Complete API Documentation

### `GET /api/axiom/exam`
Fetches exam questions, curriculum syllabus, or active simulation parameters.

#### Query Parameters
| Parameter | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `exam` | string | Yes | Target certification identifier (`cissp`, `security_plus`, `cism`, `ceh`, `oscp`, `aws_security`) | `exam=cissp` |
| `count` | integer| No | Number of questions to return (default: 25, max: 150) | `count=50` |
| `domain` | string | No | Filter by specific domain or topic | `domain=cryptography` |

#### Response Example
```json
{
  "status": "success",
  "exam": "cissp",
  "totalQuestions": 2,
  "questions": [
    {
      "id": "Q-CISSP-101",
      "domain": "Security Architecture and Engineering",
      "prompt": "An organization is selecting a public key cryptosystem for restricted IoT microcontrollers. Which algorithm provides equivalent security with smaller key sizes?",
      "choices": [
        { "id": "A", "text": "RSA with 2048-bit modulus" },
        { "id": "B", "text": "Elliptic Curve Cryptography (ECC) with 256-bit curve" },
        { "id": "C", "text": "Diffie-Hellman with 1024-bit prime" },
        { "id": "D", "text": "AES in GCM mode" }
      ]
    }
  ]
}
```

---

### `POST /api/axiom/exam`
Submits candidate responses for evaluation, computes psychometric scores, and generates prescriptive study recommendations.

#### Request Body Schema
```json
{
  "examId": "cissp",
  "candidateId": "usr_99184",
  "responses": [
    { "questionId": "Q-CISSP-101", "selectedChoice": "B" }
  ]
}
```

#### Response Example
```json
{
  "status": "completed",
  "candidateId": "usr_99184",
  "scorePercentage": 100.0,
  "passed": true,
  "passingThreshold": 70.0,
  "domainBreakdown": {
    "Security Architecture and Engineering": {
      "correct": 1,
      "total": 1,
      "percentage": 100.0,
      "status": "PROFICIENT"
    }
  },
  "completionToken": "AXIOM-CERT-2026-99184-7F8A"
}
```

---

### `GET /api/axiom/export`
Exports question catalogues and institutional test records in CSV or JSON format for LMS ingestion.

#### Query Parameters
| Parameter | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `exam` | string | Yes | Target exam syllabus | `exam=cissp` |
| `format` | string | No | `json` (default) or `csv` | `format=csv` |
