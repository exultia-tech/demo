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
    operational_domain: str = "PATCH"
    feed_source: str = "primary"
    published_at: str = field(default_factory=lambda: datetime.datetime.now(datetime.timezone.utc).isoformat())

    @classmethod
    def from_dict(cls, data: Dict[str, Any], default_feed_source: str = "primary") -> "KineticPatch":
        rem = data.get("remediationTier", {}).get("tier1_hotMitigation", {})
        pkg_rem = data.get("remediationTier", {}).get("tier2_packageUpgrade", {})
        prov = data.get("provenance", {})
        meta = data.get("metadata", {})

        # Support simplified internal/secondary feed object keys as well as canonical schema
        raw_id = data.get("id") or data.get("bundleId") or f"PAT-{data.get('cveId', 'INTERNAL')}"
        raw_cve = data.get("cveId") or data.get("bundleId") or raw_id
        raw_bundle = meta.get("bundleId") or data.get("bundleId") or raw_id
        raw_domain = (
            data.get("operationalDomain")
            or meta.get("operationalDomain")
            or data.get("category")
            or "PATCH"
        )
        raw_feed_source = data.get("feedSource") or meta.get("feedSource") or default_feed_source

        # Support top-level shorthand fields for custom internal feeds
        top_cmd = data.get("upgradeCommand") or data.get("upgrade_command") or data.get("command") or ""
        top_cmds = data.get("commands") if isinstance(data.get("commands"), list) else ([top_cmd] if top_cmd else [])
        top_verify = data.get("verificationCommand") or data.get("verification_command") or "echo verified"
        top_rollback = data.get("rollbackCommand") or data.get("rollback_command") or "true"
        top_pkg = data.get("packageName") or data.get("package_name") or data.get("package") or ""
        top_reboot = bool(data.get("requiresReboot", data.get("requires_reboot", False)))
        top_os = data.get("affectedDistros") or data.get("affected_distros") or (
            [data["os"]] if isinstance(data.get("os"), str) else data.get("os", ["ubuntu", "debian", "rhel", "rocky"])
        )
        top_pkgs = data.get("affectedPackages") or data.get("affected_packages") or ([top_pkg] if top_pkg else ["system-core"])

        return cls(
            id=raw_id,
            cve_id=raw_cve,
            bundle_id=raw_bundle,
            operational_domain=str(raw_domain).upper(),
            feed_source=str(raw_feed_source),
            title=data.get("title", "Advisory Remediation"),
            severity=data.get("severity", data.get("vendorSeverity", "HIGH")),
            cvss=float(data.get("cvss", data.get("severityScore", 7.5))),
            cisa_kev=bool(data.get("cisaKev", False)),
            affected_packages=top_pkgs,
            affected_distros=top_os,
            hot_mitigation=HotMitigation(
                summary=rem.get("summary", data.get("synopsis", "System security constraint dropin")),
                downtime_required=rem.get("downtimeRequired", top_reboot),
                commands=rem.get("commands", top_cmds),
                verification_command=rem.get("verificationCommand", top_verify),
                rollback_command=rem.get("rollbackCommand", top_rollback)
            ),
            package_upgrade=PackageUpgrade(
                summary=pkg_rem.get("summary", data.get("synopsis", "Standard OS Package Upgrade")),
                distro_commands=pkg_rem.get("distroCommands", {}),
                upgrade_command=pkg_rem.get("upgradeCommand", top_cmd),
                package_name=pkg_rem.get("packageName", top_pkg),
                version_before=pkg_rem.get("versionBefore", data.get("versionBefore", data.get("version_before", ""))),
                version_target=pkg_rem.get("versionTarget", pkg_rem.get("targetVersion", data.get("versionTarget", data.get("version_target", "")))),
                requires_reboot=bool(pkg_rem.get("requiresReboot", top_reboot)),
                package_manager=pkg_rem.get("packageManager", data.get("packageManager", "apt"))
            ),
            provenance=Provenance(
                signed_by=prov.get("signedBy", data.get("signedBy", "security@exultia.tech (Cosign OIDC Keyless)")),
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
    deferred_until: Optional[str] = None
    operational_domain: str = "PATCH"
    feed_source: str = "primary"

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
    off_peak_window: str = "02:00-05:00"  # Supports single or comma-separated deferred windows (e.g. "Sat 01:00-05:00,Sun 01:00-05:00")
    deferred_windows: List[str] = field(default_factory=lambda: ["02:00-05:00"])
    defer_disruptive_until: Optional[str] = None  # Optional ISO-8601 timestamp holding disruptive patches
    vendor_native_updates: bool = True  # Natively invoke OS built-in security & non-reboot patching commands
    scheduler_mode: str = "none"  # "none", "systemd", "cron", "auto"
    cron_expression: str = "0 * * * *"
    webhook_enabled: bool = False
    webhook_host: str = "127.0.0.1"
    webhook_port: int = 8765
    fullauto_enabled: bool = False
    fullauto_confirmed: bool = False
    kernel_livepatch_enabled: bool = True
    kernel_livepatch_mode: str = "auto"  # "auto", "klp", "ebpf", "both", "disabled"
    secondary_feeds: List[str] = field(default_factory=list)
    cbom_log_path: Optional[str] = None

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
    action: str
    cve_id: str
    status: str
    details: str
    operator: str = "kinetic-daemon"
    latency_ms: float = 0.0

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)
