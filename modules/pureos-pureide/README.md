# Exultia PureOS & PureIDE Core Module

Hardened CIS Benchmark Level 2 distroless container images and air-gapped developer container templates.

## Components

1. `Dockerfile.distroless`:
   - Two-stage multi-arch build stripping shells, package managers, and root access.
   - Conforms to CIS Benchmark Level 2 and NIST SP 800-190 container security guidelines.
2. `devcontainer-template.json`:
   - Developer workstation template enforcing strict kernel egress gating and disabled telemetry.
   - Built-in CycloneDX SBOM and Cosign cryptographic attestation hooks.

## Build

```bash
# Build minimal distroless service
docker build -f Dockerfile.distroless -t exultia/pureos-service:latest .
```
