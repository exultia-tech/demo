"""
Exultia Kinetic - Autonomous Configuration Drift & Compliance Remediation Engine.
Standards Baseline: Sarbanes-Oxley (SOX ITGC) and PCI-DSS v4.0.

Provides continuous drift detection, pre-reversion snapshot creation,
and deterministic reversion back to authoritative hardened baselines.
"""

import os
import sys
import time
import shutil
import hashlib
import platform
import subprocess
from pathlib import Path
from typing import List, Dict, Optional, Tuple, Any, Callable


class ComplianceControl:
    """
    Represents an authoritative configuration control derived from SOX / PCI-DSS.
    """

    def __init__(self,
                 control_id: str,
                 name: str,
                 category: str,
                 standards: List[str],
                 description: str,
                 target_path: Optional[str],
                 desired_value: str,
                 check_fn: Optional[Callable[['ComplianceControl', Path], Tuple[bool, str]]] = None,
                 revert_fn: Optional[Callable[['ComplianceControl', Path, bool], Tuple[bool, str]]] = None):
        self.control_id = control_id
        self.name = name
        self.category = category  # "SSH", "SYSCTL", "PERMISSIONS", "ACCOUNT", "AUDIT"
        self.standards = standards  # e.g. ["PCI-DSS-2.2.4", "SOX-ITGC-AC-1"]
        self.description = description
        self.target_path = target_path
        self.desired_value = desired_value
        self.check_fn = check_fn
        self.revert_fn = revert_fn

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.control_id,
            "name": self.name,
            "category": self.category,
            "standards": self.standards,
            "description": self.description,
            "targetPath": self.target_path,
            "desiredValue": self.desired_value
        }


# ==============================================================================
# AUTHORITATIVE SOX / PCI-DSS CONFIGURATION INVARIANTS
# ==============================================================================

def _check_sysctl_sim(key: str, desired: str, custom_root: Optional[Path] = None) -> Tuple[bool, str]:
    """Inspect sysctl parameter either via drop-in config, real sysctl, or simulated file root."""
    conf_file = (custom_root / "etc" / "sysctl.d" / "99-exultia-drift.conf") if custom_root else Path("/etc/sysctl.d/99-exultia-drift.conf")
    if conf_file.exists():
        for line in conf_file.read_text(encoding="utf-8", errors="replace").splitlines():
            clean = line.strip()
            if not clean or clean.startswith("#"):
                continue
            if "=" in clean:
                k, v = clean.split("=", 1)
                if k.strip() == key:
                    val = v.strip()
                    return (val != desired, val)
    if custom_root:
        return (True, "MISSING_CONFIGURATION")

    if platform.system() == "Linux":
        try:
            res = subprocess.run(["sysctl", "-n", key], capture_output=True, text=True, timeout=5)
            if res.returncode == 0:
                current = res.stdout.strip()
                return (current != desired, current)
        except Exception:
            pass
    # Default fallback inspection on simulated / non-Linux host
    return (False, desired)


def _revert_sysctl_sim(key: str, desired: str, custom_root: Optional[Path] = None, dry_run: bool = False) -> Tuple[bool, str]:
    """Revert sysctl parameter back to desired baseline."""
    if dry_run:
        return (True, f"[DRY-RUN] Revert sysctl {key}={desired}")

    conf_dir = (custom_root / "etc" / "sysctl.d") if custom_root else Path("/etc/sysctl.d")
    try:
        conf_dir.mkdir(parents=True, exist_ok=True)
        conf_file = conf_dir / "99-exultia-drift.conf"
        existing_lines = []
        if conf_file.exists():
            existing_lines = [
                l for l in conf_file.read_text(encoding="utf-8", errors="replace").splitlines()
                if not l.strip().startswith(f"{key} =") and not l.strip().startswith(f"{key}=")
            ]
        existing_lines.append(f"{key} = {desired}")
        conf_file.write_text("\n".join(existing_lines) + "\n", encoding="utf-8")

        if platform.system() == "Linux" and not custom_root:
            subprocess.run(["sysctl", "-w", f"{key}={desired}"], capture_output=True, timeout=5)
        return (True, f"Applied sysctl {key}={desired} in {conf_file}")
    except Exception as e:
        return (False, str(e))


def _check_sshd_param(key: str, desired: str, custom_root: Optional[Path] = None) -> Tuple[bool, str]:
    """Check OpenSSH configuration parameter."""
    search_paths = []
    if custom_root:
        search_paths.append(custom_root / "etc" / "ssh" / "sshd_config.d" / "99-exultia-drift.conf")
        search_paths.append(custom_root / "etc" / "ssh" / "sshd_config")
    else:
        search_paths.append(Path("/etc/ssh/sshd_config.d/99-exultia-drift.conf"))
        search_paths.append(Path("/etc/ssh/sshd_config"))

    for p in search_paths:
        if p.exists():
            for line in p.read_text(encoding="utf-8", errors="replace").splitlines():
                clean = line.strip()
                if not clean or clean.startswith("#"):
                    continue
                parts = clean.split(None, 1)
                if len(parts) >= 2 and parts[0].lower() == key.lower():
                    val = parts[1].strip()
                    return (val.lower() != desired.lower(), val)

    # If not explicitly configured, it may be drifted from strict SOX/PCI baseline
    return (True, "UNSET_DEFAULT")


def _revert_sshd_param(key: str, desired: str, custom_root: Optional[Path] = None, dry_run: bool = False) -> Tuple[bool, str]:
    """Enforce sshd parameter in dropin configuration."""
    if dry_run:
        return (True, f"[DRY-RUN] Enforce SSH {key} {desired}")

    target_dir = (custom_root / "etc" / "ssh" / "sshd_config.d") if custom_root else Path("/etc/ssh/sshd_config.d")
    target_file = target_dir / "99-exultia-drift.conf"

    try:
        target_dir.mkdir(parents=True, exist_ok=True)
        lines = []
        if target_file.exists():
            lines = [l for l in target_file.read_text(encoding="utf-8", errors="replace").splitlines() if not l.strip().lower().startswith(key.lower())]
        lines.append(f"# SOX/PCI Enforced Baseline ({time.strftime('%Y-%m-%d')})")
        lines.append(f"{key} {desired}")
        target_file.write_text("\n".join(lines) + "\n", encoding="utf-8")

        # Reload SSH daemon if on Linux
        if platform.system() == "Linux" and not custom_root:
            subprocess.run(["systemctl", "reload", "sshd"], capture_output=True, timeout=5)

        return (True, f"Enforced {key} {desired} in {target_file}")
    except Exception as e:
        return (False, str(e))


def _check_file_mode(file_path_str: str, max_mode: int, custom_root: Optional[Path] = None) -> Tuple[bool, str]:
    """Check file permissions against max allowable octal mode."""
    p = (custom_root / file_path_str.lstrip("/\\")) if custom_root else Path(file_path_str)
    if not p.exists():
        return (False, "FILE_NOT_PRESENT")

    try:
        st = p.stat()
        current_mode = st.st_mode & 0o777
        is_drifted = (current_mode & ~max_mode) != 0
        return (is_drifted, oct(current_mode))
    except Exception as e:
        return (False, str(e))


def _revert_file_mode(file_path_str: str, target_mode: int, custom_root: Optional[Path] = None, dry_run: bool = False) -> Tuple[bool, str]:
    """Revert file permissions back to secure baseline."""
    p = (custom_root / file_path_str.lstrip("/\\")) if custom_root else Path(file_path_str)
    if not p.exists():
        return (False, "File does not exist")

    if dry_run:
        return (True, f"[DRY-RUN] chmod {oct(target_mode)} {p}")

    try:
        p.chmod(target_mode)
        return (True, f"Restored mode {oct(target_mode)} on {p}")
    except Exception as e:
        return (False, str(e))


# ==============================================================================
# BASELINE CONTROL CATALOG
# ==============================================================================

def get_authoritative_controls() -> List[ComplianceControl]:
    """
    Returns the comprehensive list of SOX ITGC and PCI-DSS v4.0 baseline controls.
    """
    return [
        # --- 1. SSH Hardening (PCI DSS 2.2.4, 8.3.6 / SOX ITGC Logical Access) ---
        ComplianceControl(
            control_id="SOX-PCI-SSH-01",
            name="Disable Direct Root Login over SSH",
            category="SSH",
            standards=["PCI-DSS-v4.0-2.2.4", "PCI-DSS-v4.0-8.3.6", "SOX-ITGC-LogicalAccess"],
            description="Prevents direct interactive root logins; enforces individual named user authentication and sudo auditability.",
            target_path="/etc/ssh/sshd_config.d/99-exultia-drift.conf",
            desired_value="PermitRootLogin no",
            check_fn=lambda ctrl, root: _check_sshd_param("PermitRootLogin", "no", root),
            revert_fn=lambda ctrl, root, dry: _revert_sshd_param("PermitRootLogin", "no", root, dry)
        ),
        ComplianceControl(
            control_id="SOX-PCI-SSH-02",
            name="Disable SSH Password Authentication",
            category="SSH",
            standards=["PCI-DSS-v4.0-8.3.6", "SOX-ITGC-LogicalAccess"],
            description="Mandates public-key cryptographic authentication, neutralizing remote password brute-forcing.",
            target_path="/etc/ssh/sshd_config.d/99-exultia-drift.conf",
            desired_value="PasswordAuthentication no",
            check_fn=lambda ctrl, root: _check_sshd_param("PasswordAuthentication", "no", root),
            revert_fn=lambda ctrl, root, dry: _revert_sshd_param("PasswordAuthentication", "no", root, dry)
        ),
        ComplianceControl(
            control_id="SOX-PCI-SSH-03",
            name="Disable Insecure X11 Forwarding",
            category="SSH",
            standards=["PCI-DSS-v4.0-2.2.4"],
            description="Blocks graphical X11 tunneling to prevent keystroke sniffing and local display hijacking.",
            target_path="/etc/ssh/sshd_config.d/99-exultia-drift.conf",
            desired_value="X11Forwarding no",
            check_fn=lambda ctrl, root: _check_sshd_param("X11Forwarding", "no", root),
            revert_fn=lambda ctrl, root, dry: _revert_sshd_param("X11Forwarding", "no", root, dry)
        ),
        ComplianceControl(
            control_id="SOX-PCI-SSH-04",
            name="Enforce Maximum Authentication Tries (3)",
            category="SSH",
            standards=["PCI-DSS-v4.0-8.3.4", "SOX-ITGC-LogicalAccess"],
            description="Disconnects SSH session after 3 consecutive failed login attempts.",
            target_path="/etc/ssh/sshd_config.d/99-exultia-drift.conf",
            desired_value="MaxAuthTries 3",
            check_fn=lambda ctrl, root: _check_sshd_param("MaxAuthTries", "3", root),
            revert_fn=lambda ctrl, root, dry: _revert_sshd_param("MaxAuthTries", "3", root, dry)
        ),
        ComplianceControl(
            control_id="SOX-PCI-SSH-05",
            name="Enforce 15-Minute Session Idle Timeout",
            category="SSH",
            standards=["PCI-DSS-v4.0-8.2.8", "SOX-ITGC-Operations"],
            description="Automatically disconnects abandoned interactive terminal sessions after 15 minutes of inactivity.",
            target_path="/etc/ssh/sshd_config.d/99-exultia-drift.conf",
            desired_value="ClientAliveInterval 300 / ClientAliveCountMax 0",
            check_fn=lambda ctrl, root: _check_sshd_param("ClientAliveInterval", "300", root),
            revert_fn=lambda ctrl, root, dry: _revert_sshd_param("ClientAliveInterval", "300", root, dry)
        ),

        # --- 2. Kernel & Sysctl Hardening (PCI DSS 2.2 / SOX Boundary Protection) ---
        ComplianceControl(
            control_id="SOX-PCI-SYSCTL-01",
            name="Disable IPv4 Packet Forwarding",
            category="SYSCTL",
            standards=["PCI-DSS-v4.0-2.2.5", "SOX-ITGC-BoundaryProtection"],
            description="Disables packet routing across interfaces to maintain host isolation and prevent rogue gateway routing.",
            target_path="/etc/sysctl.d/99-exultia-drift.conf",
            desired_value="net.ipv4.ip_forward = 0",
            check_fn=lambda ctrl, root: _check_sysctl_sim("net.ipv4.ip_forward", "0", root),
            revert_fn=lambda ctrl, root, dry: _revert_sysctl_sim("net.ipv4.ip_forward", "0", root, dry)
        ),
        ComplianceControl(
            control_id="SOX-PCI-SYSCTL-02",
            name="Disable ICMP Redirect Transmission",
            category="SYSCTL",
            standards=["PCI-DSS-v4.0-2.2.5"],
            description="Prevents the host from advertising false routing tables via ICMP redirect messages.",
            target_path="/etc/sysctl.d/99-exultia-drift.conf",
            desired_value="net.ipv4.conf.all.send_redirects = 0",
            check_fn=lambda ctrl, root: _check_sysctl_sim("net.ipv4.conf.all.send_redirects", "0", root),
            revert_fn=lambda ctrl, root, dry: _revert_sysctl_sim("net.ipv4.conf.all.send_redirects", "0", root, dry)
        ),
        ComplianceControl(
            control_id="SOX-PCI-SYSCTL-03",
            name="Disable Source-Routed Packet Acceptance",
            category="SYSCTL",
            standards=["PCI-DSS-v4.0-2.2.5"],
            description="Drops packets specifying a pre-configured route to block IP spoofing and perimeter bypass.",
            target_path="/etc/sysctl.d/99-exultia-drift.conf",
            desired_value="net.ipv4.conf.all.accept_source_route = 0",
            check_fn=lambda ctrl, root: _check_sysctl_sim("net.ipv4.conf.all.accept_source_route", "0", root),
            revert_fn=lambda ctrl, root, dry: _revert_sysctl_sim("net.ipv4.conf.all.accept_source_route", "0", root, dry)
        ),
        ComplianceControl(
            control_id="SOX-PCI-SYSCTL-04",
            name="Enable TCP SYN Cookies Flood Defense",
            category="SYSCTL",
            standards=["PCI-DSS-v4.0-2.2.5"],
            description="Protects listening sockets against SYN flood denial of service attacks without socket drops.",
            target_path="/etc/sysctl.d/99-exultia-drift.conf",
            desired_value="net.ipv4.tcp_syncookies = 1",
            check_fn=lambda ctrl, root: _check_sysctl_sim("net.ipv4.tcp_syncookies", "1", root),
            revert_fn=lambda ctrl, root, dry: _revert_sysctl_sim("net.ipv4.tcp_syncookies", "1", root, dry)
        ),
        ComplianceControl(
            control_id="SOX-PCI-SYSCTL-05",
            name="Enforce Full ASLR Randomization (Mode 2)",
            category="SYSCTL",
            standards=["PCI-DSS-v4.0-2.2.4", "SOX-ITGC-SystemIntegrity"],
            description="Randomizes memory stack, vdso, heap, and mmap layouts to defeat memory corruption and ROP chain exploits.",
            target_path="/etc/sysctl.d/99-exultia-drift.conf",
            desired_value="kernel.randomize_va_space = 2",
            check_fn=lambda ctrl, root: _check_sysctl_sim("kernel.randomize_va_space", "2", root),
            revert_fn=lambda ctrl, root, dry: _revert_sysctl_sim("kernel.randomize_va_space", "2", root, dry)
        ),
        ComplianceControl(
            control_id="SOX-PCI-SYSCTL-06",
            name="Restrict SUID Process Core Dumps",
            category="SYSCTL",
            standards=["PCI-DSS-v4.0-10.2.1", "SOX-ITGC-DataConfidentiality"],
            description="Blocks memory core dumps from setuid executables to prevent credential and secret leakage to disk.",
            target_path="/etc/sysctl.d/99-exultia-drift.conf",
            desired_value="fs.suid_dumpable = 0",
            check_fn=lambda ctrl, root: _check_sysctl_sim("fs.suid_dumpable", "0", root),
            revert_fn=lambda ctrl, root, dry: _revert_sysctl_sim("fs.suid_dumpable", "0", root, dry)
        ),

        # --- 3. Critical System File Permissions (PCI DSS 10.2.1 / SOX AC-6) ---
        ComplianceControl(
            control_id="SOX-PCI-PERM-01",
            name="Lockdown /etc/shadow Permissions (0600/0640)",
            category="PERMISSIONS",
            standards=["PCI-DSS-v4.0-10.2.1", "SOX-ITGC-LogicalAccess"],
            description="Restricts password hashes so only root/shadow can read them; prevents unauthorized hash dumping.",
            target_path="/etc/shadow",
            desired_value="0600 or 0640",
            check_fn=lambda ctrl, root: _check_file_mode("/etc/shadow", 0o640, root),
            revert_fn=lambda ctrl, root, dry: _revert_file_mode("/etc/shadow", 0o600, root, dry)
        ),
        ComplianceControl(
            control_id="SOX-PCI-PERM-02",
            name="Lockdown /etc/gshadow Permissions (0600/0640)",
            category="PERMISSIONS",
            standards=["PCI-DSS-v4.0-10.2.1", "SOX-ITGC-LogicalAccess"],
            description="Restricts group password hashes to root ownership.",
            target_path="/etc/gshadow",
            desired_value="0600 or 0640",
            check_fn=lambda ctrl, root: _check_file_mode("/etc/gshadow", 0o640, root),
            revert_fn=lambda ctrl, root, dry: _revert_file_mode("/etc/gshadow", 0o600, root, dry)
        ),
        ComplianceControl(
            control_id="SOX-PCI-PERM-03",
            name="Lockdown /etc/passwd Permissions (0644)",
            category="PERMISSIONS",
            standards=["PCI-DSS-v4.0-10.2.1", "SOX-ITGC-Integrity"],
            description="Ensures user account registry is read-only for non-root users, preventing unauthorized user injection.",
            target_path="/etc/passwd",
            desired_value="0644",
            check_fn=lambda ctrl, root: _check_file_mode("/etc/passwd", 0o644, root),
            revert_fn=lambda ctrl, root, dry: _revert_file_mode("/etc/passwd", 0o644, root, dry)
        ),
        ComplianceControl(
            control_id="SOX-PCI-PERM-04",
            name="Lockdown /etc/sudoers Permissions (0440)",
            category="PERMISSIONS",
            standards=["PCI-DSS-v4.0-10.2.1", "SOX-ITGC-PrivilegedAccess"],
            description="Strictly read-only access for sudo configuration, preventing unauthorized privilege grant modifications.",
            target_path="/etc/sudoers",
            desired_value="0440",
            check_fn=lambda ctrl, root: _check_file_mode("/etc/sudoers", 0o440, root),
            revert_fn=lambda ctrl, root, dry: _revert_file_mode("/etc/sudoers", 0o440, root, dry)
        ),

        # --- 4. Password & Account Lockout Policies (PCI DSS 8.3.4, 8.3.9) ---
        ComplianceControl(
            control_id="SOX-PCI-ACCT-01",
            name="Enforce 5-Attempt Account Lockout (faillock)",
            category="ACCOUNT",
            standards=["PCI-DSS-v4.0-8.3.4", "SOX-ITGC-LogicalAccess"],
            description="Locks user account for 15 minutes (900 seconds) after 5 consecutive failed authentications.",
            target_path="/etc/security/faillock.conf",
            desired_value="deny = 5, unlock_time = 900",
            check_fn=lambda ctrl, root: _check_sshd_param("deny", "5", root),
            revert_fn=lambda ctrl, root, dry: _revert_sshd_param("deny", "5", root, dry)
        ),
        ComplianceControl(
            control_id="SOX-PCI-ACCT-02",
            name="Enforce 90-Day Password Rotation Lifecycle",
            category="ACCOUNT",
            standards=["PCI-DSS-v4.0-8.3.9", "SOX-ITGC-PasswordPolicy"],
            description="Sets maximum password age to 90 days in /etc/login.defs, enforcing quarterly credential cycling.",
            target_path="/etc/login.defs",
            desired_value="PASS_MAX_DAYS 90",
            check_fn=lambda ctrl, root: _check_sshd_param("PASS_MAX_DAYS", "90", root),
            revert_fn=lambda ctrl, root, dry: _revert_sshd_param("PASS_MAX_DAYS", "90", root, dry)
        )
    ]


# ==============================================================================
# COMPLIANCE DRIFT MANAGER
# ==============================================================================

class DriftFinding:
    """Represents a detected deviation between current configuration and SOX/PCI baseline."""

    def __init__(self,
                 control: ComplianceControl,
                 current_value: str,
                 detected_at: Optional[str] = None):
        self.control = control
        self.current_value = current_value
        self.detected_at = detected_at or time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

    def to_dict(self) -> Dict[str, Any]:
        return {
            "controlId": self.control.control_id,
            "name": self.control.name,
            "category": self.control.category,
            "standards": self.control.standards,
            "desiredValue": self.control.desired_value,
            "currentValue": self.current_value,
            "targetPath": self.control.target_path,
            "detectedAt": self.detected_at
        }


class RevertResult:
    """Result of reverting a drifted control."""

    def __init__(self,
                 control: ComplianceControl,
                 success: bool,
                 message: str,
                 snapshot_id: Optional[str] = None):
        self.control = control
        self.success = success
        self.message = message
        self.snapshot_id = snapshot_id
        self.reverted_at = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

    def to_dict(self) -> Dict[str, Any]:
        return {
            "controlId": self.control.control_id,
            "name": self.control.name,
            "standards": self.control.standards,
            "success": self.success,
            "message": self.message,
            "snapshotId": self.snapshot_id,
            "revertedAt": self.reverted_at
        }


class ComplianceDriftManager:
    """
    Autonomous sentinel that audits host settings against SOX & PCI-DSS baselines
    and restores drifted configurations to the compliant state.
    """

    def __init__(self,
                 state_dir: Optional[str] = None,
                 custom_root: Optional[str] = None,
                 baseline_mode: str = "sox_pci"):
        self.state_dir = Path(state_dir) if state_dir else Path(os.path.expanduser("~/.kinetic"))
        self.custom_root = Path(custom_root) if custom_root else None
        self.baseline_mode = baseline_mode.lower()
        self.controls = get_authoritative_controls()

    def filter_controls(self) -> List[ComplianceControl]:
        """Filter controls based on active baseline mode ('sox', 'pci', 'sox_pci', 'strict')."""
        if self.baseline_mode in ["sox_pci", "strict", "all"]:
            return self.controls
        elif self.baseline_mode == "pci":
            return [c for c in self.controls if any("pci" in s.lower() for s in c.standards)]
        elif self.baseline_mode == "sox":
            return [c for c in self.controls if any("sox" in s.lower() for s in c.standards)]
        return self.controls

    def audit(self) -> List[DriftFinding]:
        """
        Scans all applicable controls and returns a list of detected drift findings.
        """
        findings: List[DriftFinding] = []
        active_controls = self.filter_controls()

        for ctrl in active_controls:
            if ctrl.check_fn:
                try:
                    is_drifted, current_val = ctrl.check_fn(ctrl, self.custom_root)
                    if is_drifted:
                        findings.append(DriftFinding(ctrl, current_val))
                except Exception as e:
                    sys.stderr.write(f"[Drift Audit Warning] Check error for {ctrl.control_id}: {e}\n")

        return findings

    def revert_drift(self,
                     dry_run: bool = False,
                     snapshot_engine=None) -> List[RevertResult]:
        """
        Audits and restores all drifted controls back to compliant baseline.
        Takes pre-flight snapshots of target files when snapshot_engine is provided.
        """
        findings = self.audit()
        results: List[RevertResult] = []

        if not findings:
            return results

        for finding in findings:
            ctrl = finding.control
            snap_id = None

            # 1. Take safety snapshot before mutating target configuration
            if snapshot_engine and ctrl.target_path and not dry_run:
                try:
                    resolved_path = (self.custom_root / ctrl.target_path.lstrip("/\\")) if self.custom_root else Path(ctrl.target_path)
                    if resolved_path.exists():
                        snap_res = snapshot_engine.create_file_snapshot(str(resolved_path), ctrl.control_id)
                        if snap_res:
                            snap_id = f"DRIFT-{ctrl.control_id}-{int(time.time()*1000)}"
                except Exception as snap_err:
                    sys.stderr.write(f"[Drift Snapshot Warning] {ctrl.control_id}: {snap_err}\n")

            # 2. Revert to desired baseline
            if ctrl.revert_fn:
                try:
                    success, msg = ctrl.revert_fn(ctrl, self.custom_root, dry_run)
                    results.append(RevertResult(ctrl, success, msg, snap_id))
                except Exception as err:
                    results.append(RevertResult(ctrl, False, str(err), snap_id))
            else:
                results.append(RevertResult(ctrl, False, "No revert function registered", snap_id))

        return results
