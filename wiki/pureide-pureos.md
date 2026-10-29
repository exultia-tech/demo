# Exultia PureIDE & PureOS (Consolidated into Daedelus)

**Zero-Trust Developer Workstation & Pre-Hardened Container Catalogue**

> [!NOTE]
> **Consolidation Notice**: PureIDE (hermetic workstations) and PureOS (hardened distroless runtimes) have been unified into **[Daedelus](./daedelus.md)** alongside the new 0-CVE Clean Package Catalog and developer edge negative admission proxy. Please refer to the primary [**Daedelus Technical Documentation**](./daedelus.md).

---

## 1. Quick-Start Guide

PureIDE and PureOS are now available as modalities within Daedelus:

### Pull a Hardened PureOS Base Container
```bash
# Pull the minimal, hardened scratch runtime
docker pull registry.exultia.tech/pureos/base:2026.1-hardened

# Verify cosign signature
cosign verify --key https://exultia.tech/keys/cosign.pub registry.exultia.tech/pureos/base:2026.1-hardened
```

### Query PureIDE Workstation Toolchain Versions (cURL)
```bash
curl -s "https://exultia.tech/api/pureide/versions" | jq .
```

---

## 2. Extensive Product Details

### Security Architecture

```
 ┌────────────────────────────────────────────────────────┐
 │           PureIDE Zero-Trust Developer Sandbox         │
 └──────────────────────────┬─────────────────────────────┘
                            │
      ┌─────────────────────┼─────────────────────┐
      ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│ Hermetic      │     │ Zero Egress   │     │ Cryptographic │
│ Compilers     │     │ Policy Engine │     │ Audit Logs    │
├───────────────┤     ├───────────────┤     ├───────────────┤
│ • GCC / Clang │     │ • Network Off │     │ • SHA-256 Pre │
│ • Rustc / Go  │     │ • Isolated FS │     │ • Merkle Tree │
│ • Reproducible│     │ • Memory Safe │     │ • SLSA Level 3│
└───────────────┘     └───────────────┘     └───────────────┘
```

---

## 3. Complete API Documentation

### `GET /api/pureide/versions`
Returns active toolchain versions and certified compiler hashes.

#### Response Example
```json
{
  "ideVersion": "3.1.0-pure",
  "toolchains": {
    "gcc": "14.2.0 (Hermetic Hardened Build)",
    "clang": "18.1.8",
    "rustc": "1.81.0",
    "golang": "1.23.2"
  },
  "compliance": "NIST SP 800-218 (SSDF) Validated"
}
```

---

### `POST /api/pureide/events`
Ingests telemetry events from isolated developer instances.

#### Request Schema
```json
{
  "eventType": "WORKSPACE_INIT",
  "timestamp": "2026-10-18T12:00:00Z",
  "hermeticEnforced": true,
  "sandboxHash": "sha256:7b91c..."
}
```
