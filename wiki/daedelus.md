# Daedelus: Technical Documentation & Architecture Reference

**Unified Clean-Room Developer Workstations, CIS Level 2 Distroless Containers & 0-CVE Dependencies**

---

## 1. Executive Overview

**Daedelus** is Exultia's developer supply-chain security platform. It unifies three critical software supply-chain surfaces into a single zero-trust architecture:

1. **Hermetic IDE Workstations**: Air-gapped, zero-egress development workspaces with Linux kernel cgroup network boundaries and bit-for-bit reproducible compilers.
2. **CIS Level 2 Distroless Containers**: Ultra-minimal container base images (< 12 MB) stripped of package managers and debugging shells, delivering 0 baseline CVEs.
3. **0-CVE Package Catalog & Edge Negative Admission**: Real-time upstream proxy that intercepts dependencies (npm, PyPI, Crates, APK, Debian) and enforces cryptographic admission controls to block malicious lifecycle scripts, typo-squats, and active KEV exploits.

---

## 2. Tripartite Architecture

```
                    ┌──────────────────────────────────────────────┐
                    │      UPSTREAM OPEN SOURCE ECOSYSTEMS         │
                    │   (npm, PyPI, Crates.io, Debian, Alpine)     │
                    └──────────────────────┬───────────────────────┘
                                           │
                                           ▼
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                MODALITY 3: DEVELOPER EDGE NEGATIVE ADMISSION                │
 │  - Real-time CISA KEV & Vantage vulnerability evaluation                   │
 │  - Malicious lifecycle script detection (preinstall / postinstall hooks)    │
 │  - Automatic OpenVEX non-exploitability attestation generation              │
 └──────────────────────┬───────────────────────────────┬──────────────────────┘
                        │                               │
                        ▼                               ▼
 ┌─────────────────────────────────────────┐  ┌────────────────────────────────┐
 │     MODALITY 1: CLEAN-ROOM WORKSTATION  │  │  MODALITY 2: DISTROLLESS OCI   │
 │  - cgroup kernel network egress clamp   │  │  - CIS Benchmark Level 2       │
 │  - Certified reproducible toolchains    │  │  - < 12 MB minimal footprint   │
 │  - Zero telemetry leakage               │  │  - 0 baseline CVEs             │
 │  - In-toto SLSA Level 3 provenance      │  │  - Cosign keyless signatures   │
 └─────────────────────────────────────────┘  └────────────────────────────────┘
```

---

## 3. Quick-Start Guide

### Modality 1: Query Hermetic Toolchain Versions
Inspect certified, bit-for-bit reproducible compiler toolchains:
```bash
curl -s "https://exultia.tech/api/pureide/versions" | jq .
```

### Modality 2: Pull & Verify Hardened Distroless Base Container
Pull an immutable, zero-shell base container and verify its Cosign cryptographic signature:
```bash
# Pull hardened base image
docker pull registry.exultia.tech/pureos/base:2026.1-hardened

# Verify Cosign keyless SLSA Level 3 signature
cosign verify --key https://exultia.tech/keys/cosign.pub registry.exultia.tech/pureos/base:2026.1-hardened
```

### Modality 3: Route Developer Package Managers Through Edge Negative Admission
Direct package managers to the local or corporate Daedelus negative admission proxy to block malicious packages before they touch developer disks:
```bash
# Node.js / npm
npm config set registry https://pkg.exultia.tech/npm/

# Python / pip
export PIP_INDEX_URL="https://pkg.exultia.tech/pypi/simple/"

# Rust / Cargo (.cargo/config.toml)
[source.crates-io]
replace-with = "exultia-crates"
[source.exultia-crates]
registry = "sparse+https://pkg.exultia.tech/crates/"
```

---

## 4. Deep Dive: Modalities & Defense Mechanics

### Modality 1: Hermetic IDE Workstations
- **Kernel Egress Clamping**: Active compilation phases are bound to dedicated Linux network namespaces with `lo` loopback only. Dependencies cannot beacon outbound or contact external C2 servers during builds.
- **Reproducible Compilers**: Ships with hermetically compiled binaries of GCC 14, Clang 18, Rust 1.81, and Go 1.23 built with `-trimpath` and reproducible timestamps (`SOURCE_DATE_EPOCH`).
- **NIST SP 800-218 (SSDF) Compliance**: Automatically produces in-toto attestation manifests detailing exact compiler digests, source tree Git commits, and toolchain configurations.

### Modality 2: CIS Level 2 Distroless Containers
- **Attack Surface Minimization**: Eliminates standard package managers (`apt`, `apk`, `dnf`), shells (`/bin/sh`, `/bin/bash`), and debugging utilities from production runtime images.
- **Immutable Root Filesystem**: Designed for read-only root execution (`--read-only`), precluding runtime script dropping or binary replacement.
- **Zero Baseline Vulnerabilities**: Scans clean with 0 CVEs on Trivy, Grype, and Snyk, removing false-positive alarm fatigue for DevSecOps teams.

### Modality 3: 0-CVE Clean Package Catalog & Negative Admission
- **Negative Admission Engine**: Evaluates every requested package against the Vantage continuous threat feed. If a package contains a known KEV exploit or an unverified binary payload in its install scripts, the proxy drops the connection with `403 ADMISSION_DENIED`.
- **OpenVEX Attestations**: Provides machine-readable OpenVEX statements documenting why downstream false positives are non-exploitable in your environment.
- **CycloneDX SBOM Generation**: Emits cryptographically signed CycloneDX v1.5 Software Bill of Materials (JSON/XML) with every build.

---

## 5. API Reference

### `GET /api/pureide/versions`
Retrieves certified hermetic compiler versions and toolchain configurations.

**Response (200 OK):**
```json
{
  "ideVersion": "3.1.0-pure",
  "buildDate": "2026-10-18T12:00:00Z",
  "toolchains": {
    "gcc": "14.2.0",
    "clang": "18.1.8",
    "rustc": "1.81.0",
    "golang": "1.23.2",
    "python": "3.12.7"
  },
  "provenance": {
    "slsaLevel": 3,
    "builderId": "https://exultia.tech/builders/hermetic-toolchain"
  }
}
```

### `GET /api/pureos/images`
Returns available hardened container images, tag manifests, and Cosign digests.

**Response (200 OK):**
```json
{
  "images": [
    {
      "name": "pureos/base",
      "tag": "2026.1-hardened",
      "digest": "sha256:4f8b2c89e1a7...",
      "sizeMb": 11.4,
      "cisLevel": 2,
      "cveCount": 0,
      "architectures": ["amd64", "arm64"]
    },
    {
      "name": "pureos/rust",
      "tag": "1.81-distroless",
      "digest": "sha256:7c9e1b2f3a4d...",
      "sizeMb": 24.8,
      "cisLevel": 2,
      "cveCount": 0,
      "architectures": ["amd64", "arm64"]
    }
  ]
}
```
