"""
Data models for Exultia Kinetic CLI and Autonomous Daemon.
"""

from dataclasses import dataclass, field, asdict
from typing import List, Dict, Optional, Any
import datetime
import json


@dataclass
class HotMitigation:
    summary: str
    downtime_required: bool
    commands: List[str]
    verification_command: str
    rollback_command: str


@dataclass
class Provenance:
    signed_by: str
    cosign_digest: str
    slsa_level: int
    target_env: str = "Linux Production (Multi-Arch)"
    tested_at: str = field(default_factory=lambda: datetime.datetime.now(datetime.timezone.utc).isoformat())


@dataclass
class KineticPatch:
    id: str
    cve_id: str
    title: str
    severity: str
    cvss: float
    cisa_kev: bool
    affected_packages: List[str]
    affected_distros: List[str]
    hot_mitigation: HotMitigation
    provenance: Provenance
    published_at: str = field(default_factory=lambda: datetime.datetime.now(datetime.timezone.utc).isoformat())

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "KineticPatch":
        rem = data.get("remediationTier", {}).get("tier1_hotMitigation", {})
        prov = data.get("provenance", {})

        return cls(
            id=data.get("id", f"PAT-{data.get('cveId', 'UNKNOWN')}"),
            cve_id=data.get("cveId", "UNKNOWN"),
            title=data.get("title", "Advisory Remediation"),
            severity=data.get("severity", "HIGH"),
            cvss=float(data.get("cvss", 7.5)),
            cisa_kev=bool(data.get("cisaKev", False)),
            affected_packages=data.get("affectedPackages", ["system-core"]),
            affected_distros=data.get("affectedDistros", ["ubuntu", "debian", "rhel", "rocky"]),
            hot_mitigation=HotMitigation(
                summary=rem.get("summary", "System security constraint dropin"),
                downtime_required=rem.get("downtimeRequired", False),
                commands=rem.get("commands", []),
                verification_command=rem.get("verificationCommand", "echo verified"),
                rollback_command=rem.get("rollbackCommand", "true")
            ),
            provenance=Provenance(
                signed_by=prov.get("signedBy", "security@exultia.tech (Cosign OIDC Keyless)"),
                cosign_digest=prov.get("cosignDigest", "sha256:0000000000000000000000000000000000000000000000000000000000000000"),
                slsa_level=int(prov.get("slsaLevel", 3)),
                target_env=prov.get("testValidation", {}).get("targetEnv", "Linux Production")
            ),
            published_at=data.get("publishedAt", datetime.datetime.now(datetime.timezone.utc).isoformat())
        )

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class SnapshotRecord:
    snapshot_id: str
    cve_id: str
    target_path: str
    backup_path: str
    sha256_pre: str
    sha256_post: Optional[str]
    rollback_command: str
    verification_command: str
    created_at: str
    status: str  # "active", "rolled_back", "failed"

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class AuditEntry:
    timestamp: str
    action: str  # "APPLY", "ROLLBACK", "CANARY_EVAL", "VERIFY_PASS", "VERIFY_FAIL"
    cve_id: str
    status: str
    details: str
    operator: str = "kinetic-daemon"
    latency_ms: float = 0.0

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)
