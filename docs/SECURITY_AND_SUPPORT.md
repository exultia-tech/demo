# Exultia Security Architecture & Operational Scope

## Operational Philosophy

Exultia Technologies is structured as an agile, engineering-driven cybersecurity laboratory. The software is intentionally built from the ground up to be **autonomous, local-first, deterministic, and self-remediating**.

---

## 1. Support Boundaries & SLA Clarification

To maintain lean operational excellence without overpromising unviable human capacity:

- **Standard Software Licenses**:
  - Exultia Kinetic, Praxis, Vantage, and Axiom provide comprehensive access to production binaries, updates, threat feeds, and automated self-healing primitives.
  - Standard licenses **do not** include human 24/7 on-call incident paging, emergency telephone dispatch, or contractual uptime SLAs.
- **Autonomous 24/7 AI Sentinel**:
  - Technical support, installation troubleshooting, CLI command help, and configuration syntax guidance are provided 24/7 via the integrated AI Support Agent.
- **Enterprise Master Services Agreements (MSAs)**:
  - Custom SLA commitments, dedicated support engineers, bespoke SIEM integrations, or specialized air-gapped threat feeds require a separately negotiated Enterprise MSA.

---

## 2. Supply Chain Security (SLSA Level 3)

All binaries and remediation feeds adhere to strict supply chain security standards:

1. **Hermetic Builds**: Binaries are compiled in reproducible, ephemeral environments.
2. **Cosign Signatures**: Signatures are verifiable using public transparency logs (Sigstore).
3. **Audit Hashes**: Every release artifact is accompanied by a cryptographically signed `SHA256SUMS.txt`.

---

*Exultia Technologies &copy; 2026. Confidential & Proprietary.*
