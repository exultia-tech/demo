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
class PackageUpgrade:
    summary: str = ""
    distro_commands: Dict[str, str] = field(default_factory=dict)
    upgrade_command: str = ""
    package_name: str = ""
    version_before: str = ""
    version_target: str = ""
    requires_reboot: bool = False
    package_manager: str = "apt"


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
    package_upgrade: PackageUpgrade = field(default_factory=PackageUpgrade)
    bundle_id: str = ""
    published_at: str = field(default_factory=lambda: datetime.datetime.now(datetime.timezone.utc).isoformat())

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "KineticPatch":
        rem = data.get("remediationTier", {}).get("tier1_hotMitigation", {})
        pkg_rem = data.get("remediationTier", {}).get("tier2_packageUpgrade", {})
        prov = data.get("provenance", {})
        meta = data.get("metadata", {})

        return cls(
            id=data.get("id", f"PAT-{data.get('cveId', 'UNKNOWN')}"),
            cve_id=data.get("cveId", "UNKNOWN"),
            bundle_id=meta.get("bundleId", data.get("id", "")),
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
            package_upgrade=PackageUpgrade(
                summary=pkg_rem.get("summary", "Standard OS Package Upgrade"),
                distro_commands=pkg_rem.get("distroCommands", {}),
                upgrade_command=pkg_rem.get("upgradeCommand", ""),
                package_name=pkg_rem.get("packageName", ""),
                version_before=pkg_rem.get("versionBefore", ""),
                version_target=pkg_rem.get("versionTarget", pkg_rem.get("targetVersion", "")),
                requires_reboot=bool(pkg_rem.get("requiresReboot", False)),
                package_manager=pkg_rem.get("packageManager", "apt")
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
class StagedPatchRecord:
    patch_id: str
    bundle_id: str
    cve_id: str
    title: str
    os_distro: str
    package_name: str
    version_before: str
    version_target: str
    requires_reboot: bool
    upgrade_command: str
    verification_command: str
    rollback_command: str
    staged_dir: str
    staged_script_path: str
    staged_at: str
    status: str  # "staged", "applied", "deferred_off_peak", "applied_reboot_scheduled", "failed"
    applied_at: Optional[str] = None
    reboot_triggered: bool = False

    @property
    def local_bundle_path(self) -> str:
        return self.staged_script_path

    @property
    def reboot_scheduled(self) -> bool:
        return self.reboot_triggered

    def to_dict(self) -> Dict[str, Any]:
        d = asdict(self)
        d["local_bundle_path"] = self.staged_script_path
        d["reboot_scheduled"] = self.reboot_triggered
        return d


@dataclass
class PatchManagementPolicy:
    enabled: bool = True
    target_os: Optional[str] = None
    staging_dir: Optional[str] = None
    auto_stage: bool = True
    auto_patch_non_reboot: bool = False
    disruptive_auto_reboot: bool = False
    off_peak_window: str = "02:00-05:00"  # HH:MM-HH:MM local 24h time

    def to_dict(self) -> Dict[str, Any]:
        d = asdict(self)
        d["auto_stage_patches"] = self.auto_stage
        return d


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
    action: str  # "APPLY", "ROLLBACK", "CANARY_EVAL", "VERIFY_PASS", "VERIFY_FAIL", "STAGE_PATCH", "AUTO_PATCH_NON_REBOOT", "DISRUPTIVE_PATCH_REBOOT"
    cve_id: str
    status: str
    details: str
    operator: str = "kinetic-daemon"
    latency_ms: float = 0.0

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)
