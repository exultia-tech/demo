# Exultia Platform Documentation & Wiki

Welcome to the official technical documentation and site wiki for the **Exultia Technologies** security product suite.

---

## Product Ecosystem Overview

| Product | Modality / Form Factor | Primary Mission | Key API / Endpoint |
| :--- | :--- | :--- | :--- |
| [**Kinetic**](./kinetic.md) | Native Binary (`x86_64` / PE32+) & Streamed POSIX Shell | Autonomous zero-downtime hotfix stream & sub-second deterministic rollback | `/api/patches/feed`, `/api/kinetic/download` |
| [**Argent**](./argent.md) | Public Distro Errata & Vendor Patch Feed Aggregator | Multi-OS vendor patch bundles (Ubuntu, Debian, Rocky, Alpine, SUSE, Arch) | `/api/argent/feed`, `/api/argent/stats` |
| [**Vantage**](./vantage.md) | High-throughput Threat Intelligence Hub | Aggregates 110+ global registries (CISA KEV, NVD CVE, OS Advisories) | `/api/threat-feed/stats`, `/api/threat-feed/sync` |
| [**Axiom**](./axiom.md) | Enterprise Exam Simulator & Certification Engine | Adaptive security exam prep, domain diagnosis, and LMS API integration | `/api/axiom/exam`, `/api/axiom/export` |
| [**Inquest**](./inquest.md) | Digital Forensics & Public Records Automation | Autonomous FOIA intake, multi-jurisdiction exemption redaction, chain-of-custody | `/api/inquest/cases`, `/api/civic-pulse/crawl` |
| [**Praxis**](./praxis.md) | Fleet Attack / Defense Simulation & Remediation | Tactical adversary emulation and verified zero-reboot remediation playbooks | `/api/praxis/feed`, `/api/praxis/generate` |
| [**PureIDE & PureOS**](./pureide-pureos.md) | Hardened Workstation & Minimal Container Runtimes | Hermetic compiler pipeline, zero telemetry leakage, minimal attack surface base images | `/api/pureide/versions`, `/api/pureide/events` |
| [**Master API Reference**](./api-reference.md) | Unified REST & Streaming Protocol Suite | Global schema definitions, Bearer token auth, rate limits, status codes, and SDKs | All Platform Endpoints |

---

## Quick-Start Guides

Choose a product to get started immediately:

- **[Argent Quick-Start](./argent.md#quick-start-guide)**: Stream vendor patch bundles or orchestrate native package upgrades.
- **[Kinetic Quick-Start](./kinetic.md#quick-start-guide)**: Deploy autonomous patch stream or run the zero-agent daemon in under 60 seconds.
- **[Vantage Quick-Start](./vantage.md#quick-start-guide)**: Query live global vulnerability indices or stream filtered threat feeds.
- **[Axiom Quick-Start](./axiom.md#quick-start-guide)**: Launch an interactive certification exam simulation or integrate with enterprise LMS.
- **[Inquest Quick-Start](./inquest.md#quick-start-guide)**: Ingest evidence, automate public records fulfillment, and apply PII redactions.
- **[Praxis Quick-Start](./praxis.md#quick-start-guide)**: Generate automated remediation playbooks with canary serialization.
- **[PureIDE / PureOS Quick-Start](./pureide-pureos.md#quick-start-guide)**: Boot hardened container images and enforce hermetic builds.

---

## Authentication & Authorization

All Exultia APIs use Bearer Token authentication via standard HTTP Authorization headers:

```http
Authorization: Bearer <EXULTIA_API_KEY_OR_JWT>
```

Tokens can be provisioned through the Exultia Web Dashboard under **Account Settings → API Tokens** or programmatically via `/api/auth/login`.

For unauthenticated or public feeds (such as the default community threat feed and binary download endpoint), public read rates are subject to standard IP throttling.
