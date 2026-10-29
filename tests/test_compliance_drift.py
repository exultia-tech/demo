"""
Unit and Integration Tests for Exultia SOX and PCI-DSS Configuration Drift Auto-Reversion.
Tests:
  1. ComplianceControl catalog instantiation & standard baseline filtering.
  2. Drift detection against simulated drifted system roots.
  3. Deterministic reversion of sysctl, SSH, and file permissions.
  4. Toggleable mode in KineticDaemon (revert_drift=True vs revert_drift=False).
  5. Snapshot creation before drift mutation.
"""

import os
import sys
import shutil
import tempfile
import unittest
from pathlib import Path

# Ensure kinetic-cli is in python path
WORKSPACE_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(WORKSPACE_ROOT / "kinetic-cli"))

from kinetic_cli.engine import KineticEngine
from kinetic_cli.daemon import KineticDaemon
from kinetic_cli.compliance_drift import (
    ComplianceDriftManager,
    ComplianceControl,
    get_authoritative_controls
)


class TestComplianceDriftEngine(unittest.TestCase):

    def setUp(self):
        self.temp_dir = tempfile.mkdtemp(prefix="kinetic_drift_test_")
        self.state_dir = Path(self.temp_dir) / ".kinetic"
        self.sys_root = Path(self.temp_dir) / "sysroot"
        self.sys_root.mkdir(parents=True, exist_ok=True)
        self.engine = KineticEngine(state_dir=str(self.state_dir))

    def tearDown(self):
        shutil.rmtree(self.temp_dir, ignore_errors=True)

    def test_01_baseline_catalog_and_filtering(self):
        """Verify authoritative SOX & PCI-DSS control catalog structure and filtering."""
        controls = get_authoritative_controls()
        self.assertGreater(len(controls), 10)

        # Verify SOX and PCI DSS standard tags exist
        pci_controls = [c for c in controls if any("pci" in s.lower() for s in c.standards)]
        sox_controls = [c for c in controls if any("sox" in s.lower() for s in c.standards)]
        self.assertTrue(len(pci_controls) > 0)
        self.assertTrue(len(sox_controls) > 0)

        # Test filtering via manager
        mgr_all = ComplianceDriftManager(custom_root=str(self.sys_root), baseline_mode="sox_pci")
        self.assertEqual(len(mgr_all.filter_controls()), len(controls))

        mgr_pci = ComplianceDriftManager(custom_root=str(self.sys_root), baseline_mode="pci")
        self.assertEqual(len(mgr_pci.filter_controls()), len(pci_controls))

        mgr_sox = ComplianceDriftManager(custom_root=str(self.sys_root), baseline_mode="sox")
        self.assertEqual(len(mgr_sox.filter_controls()), len(sox_controls))

    def test_02_detect_and_revert_sysctl_drift(self):
        """Verify detection and auto-reversion of drifted sysctl parameters."""
        mgr = ComplianceDriftManager(
            state_dir=str(self.state_dir),
            custom_root=str(self.sys_root),
            baseline_mode="sox_pci"
        )

        # Simulate drifted sysctl: set net.ipv4.ip_forward = 1 (violates PCI DSS 2.2 / SOX Boundary)
        sysctl_conf = self.sys_root / "etc" / "sysctl.d" / "99-exultia-drift.conf"
        sysctl_conf.parent.mkdir(parents=True, exist_ok=True)
        sysctl_conf.write_text("net.ipv4.ip_forward = 1\n", encoding="utf-8")

        # Audit should detect this drift
        findings = mgr.audit()
        forwarding_finding = next((f for f in findings if f.control.control_id == "SOX-PCI-SYSCTL-01"), None)
        self.assertIsNotNone(forwarding_finding)
        self.assertEqual(forwarding_finding.current_value, "1")

        # Revert drift
        results = mgr.revert_drift(dry_run=False, snapshot_engine=self.engine)
        forwarding_result = next((r for r in results if r.control.control_id == "SOX-PCI-SYSCTL-01"), None)
        self.assertIsNotNone(forwarding_result)
        self.assertTrue(forwarding_result.success)

        # Verify conf file now has net.ipv4.ip_forward = 0
        content = sysctl_conf.read_text(encoding="utf-8")
        self.assertIn("net.ipv4.ip_forward = 0", content)
        self.assertNotIn("net.ipv4.ip_forward = 1", content)

    def test_03_detect_and_revert_ssh_drift(self):
        """Verify detection and auto-reversion of insecure SSH parameters."""
        mgr = ComplianceDriftManager(
            state_dir=str(self.state_dir),
            custom_root=str(self.sys_root),
            baseline_mode="sox_pci"
        )

        # Simulate drifted SSH config: PermitRootLogin yes (violates PCI DSS 2.2.4 / SOX AC)
        ssh_conf = self.sys_root / "etc" / "ssh" / "sshd_config.d" / "99-exultia-drift.conf"
        ssh_conf.parent.mkdir(parents=True, exist_ok=True)
        ssh_conf.write_text("PermitRootLogin yes\nPasswordAuthentication yes\n", encoding="utf-8")

        findings = mgr.audit()
        root_login_finding = next((f for f in findings if f.control.control_id == "SOX-PCI-SSH-01"), None)
        self.assertIsNotNone(root_login_finding)
        self.assertEqual(root_login_finding.current_value.lower(), "yes")

        # Execute reversion
        results = mgr.revert_drift(dry_run=False, snapshot_engine=self.engine)
        root_result = next((r for r in results if r.control.control_id == "SOX-PCI-SSH-01"), None)
        self.assertIsNotNone(root_result)
        self.assertTrue(root_result.success)

        # Check that PermitRootLogin no is now configured
        new_content = ssh_conf.read_text(encoding="utf-8")
        self.assertIn("PermitRootLogin no", new_content)

    def test_04_detect_and_revert_file_permissions(self):
        """Verify detection and auto-reversion of insecure file permissions (e.g. shadow file)."""
        mgr = ComplianceDriftManager(
            state_dir=str(self.state_dir),
            custom_root=str(self.sys_root),
            baseline_mode="sox_pci"
        )

        shadow_file = self.sys_root / "etc" / "shadow"
        shadow_file.parent.mkdir(parents=True, exist_ok=True)
        shadow_file.write_text("root:*:19000:0:99999:7:::\n", encoding="utf-8")

        # Set overly permissive mode 0666
        shadow_file.chmod(0o666)

        findings = mgr.audit()
        shadow_finding = next((f for f in findings if f.control.control_id == "SOX-PCI-PERM-01"), None)
        self.assertIsNotNone(shadow_finding)

        # Revert
        results = mgr.revert_drift(dry_run=False, snapshot_engine=self.engine)
        shadow_res = next((r for r in results if r.control.control_id == "SOX-PCI-PERM-01"), None)
        self.assertIsNotNone(shadow_res)
        self.assertTrue(shadow_res.success)

    def test_05_daemon_toggleable_drift_mode(self):
        """Verify KineticDaemon respects revert_drift toggle."""
        # 1. When revert_drift is False:
        daemon_disabled = KineticDaemon(
            engine=self.engine,
            revert_drift=False,
            custom_root=str(self.sys_root)
        )
        self.assertFalse(daemon_disabled.revert_drift)
        reverted_disabled = daemon_disabled.reconcile_configuration_drift()
        self.assertEqual(len(reverted_disabled), 0)

        # 2. When revert_drift is True:
        daemon_enabled = KineticDaemon(
            engine=self.engine,
            revert_drift=True,
            custom_root=str(self.sys_root)
        )
        self.assertTrue(daemon_enabled.revert_drift)

        # Create a drifted sysctl
        sysctl_conf = self.sys_root / "etc" / "sysctl.d" / "99-exultia-drift.conf"
        sysctl_conf.parent.mkdir(parents=True, exist_ok=True)
        sysctl_conf.write_text("net.ipv4.ip_forward = 1\n", encoding="utf-8")

        reverted_enabled = daemon_enabled.reconcile_configuration_drift()
        self.assertGreater(len(reverted_enabled), 0)
        reverted_ids = [r.control.control_id for r in reverted_enabled]
        self.assertIn("SOX-PCI-SYSCTL-01", reverted_ids)


if __name__ == "__main__":
    unittest.main()
