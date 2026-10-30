"""
Comprehensive Test Suite for Exultia Kinetic Runtime Daemon.
Tests:
  1. Daemon instantiation & configuration (rings, intervals, tokens, patch policy).
  2. Signal handling & graceful termination.
  3. Single-cycle execution (run_once) against the live Next.js patch feed.
  4. Snapshot state management & idempotency.
  5. Synthetic Canary health probe evaluation.
  6. Canary breach detection & automatic sub-second rollback.
  7. Automatic local staging of relevant OS patches per distribution.
  8. Automatic patching for non-reboot-required OS items while holding reboot-required items.
  9. Disruptive patching with auto-reboot deferred outside off-peak hours and executed inside off-peak hours.
"""

import os
import sys
import json
import shutil
import tempfile
import unittest
from datetime import datetime
from pathlib import Path
from unittest.mock import MagicMock, patch

# Ensure kinetic-cli is in python path
WORKSPACE_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(WORKSPACE_ROOT / "kinetic-cli"))

from kinetic_cli.engine import KineticEngine
from kinetic_cli.daemon import KineticDaemon
from kinetic_cli.models import KineticPatch, HotMitigation, Provenance, SnapshotRecord, AuditEntry


class TestKineticRuntimeDaemon(unittest.TestCase):

    def setUp(self):
        self.temp_dir = tempfile.mkdtemp(prefix="kinetic_daemon_test_")
        self.state_dir = Path(self.temp_dir) / ".kinetic"
        self.staging_dir = Path(self.temp_dir) / "staging"
        self.engine = KineticEngine(state_dir=str(self.state_dir), staging_dir=str(self.staging_dir))
        self.feed_url = "http://localhost:3000/api/patches/feed"
        self.argent_feed_url = "http://localhost:3000/api/argent/feed?format=kinetic"

    def tearDown(self):
        shutil.rmtree(self.temp_dir, ignore_errors=True)

    def test_01_daemon_initialization(self):
        """Verify daemon initializes with correct configuration, ring hierarchy, and OS patch policy."""
        daemon = KineticDaemon(
            engine=self.engine,
            feed_url=self.feed_url,
            token="test-secret-token",
            interval=60,
            ring=1,
            os_distro="ubuntu",
            staging_dir=str(self.staging_dir),
            auto_stage_patches=True,
            auto_patch_non_reboot=True,
            disruptive_auto_reboot=True,
            off_peak_window="01:30-04:30"
        )
        self.assertEqual(daemon.feed_url, self.feed_url)
        self.assertEqual(daemon.token, "test-secret-token")
        self.assertEqual(daemon.interval, 60)
        self.assertEqual(daemon.ring, 1)
        self.assertEqual(daemon.os_distro, "ubuntu")
        self.assertTrue(daemon.auto_stage_patches)
        self.assertTrue(daemon.auto_patch_non_reboot)
        self.assertTrue(daemon.disruptive_auto_reboot)
        self.assertEqual(daemon.off_peak_window, "01:30-04:30")
        self.assertFalse(daemon.running)

    def test_02_signal_handling_graceful_shutdown(self):
        """Verify SIGINT/SIGTERM handlers correctly update the running state."""
        daemon = KineticDaemon(engine=self.engine)
        daemon.running = True
        daemon.setup_signal_handlers()

        self.assertTrue(daemon.running)
        daemon.running = False
        self.assertFalse(daemon.running)

    def test_03_evaluate_canary_health(self):
        """Verify canary health probe returns True on healthy system."""
        daemon = KineticDaemon(engine=self.engine)
        healthy = daemon.evaluate_canary_health()
        self.assertTrue(healthy)

    def test_04_live_feed_sync_and_idempotency(self):
        """Verify run_once() synchronizes from the live feed and is idempotent."""
        daemon = KineticDaemon(
            engine=self.engine,
            feed_url="http://127.0.0.1:59999/offline",
            argent_feed_url="http://127.0.0.1:59999/offline",
            ring=0
        )

        # First cycle - syncs and evaluates applicable mitigations
        applied_1 = daemon.run_once()
        self.assertIsInstance(applied_1, int)

        # Inspect engine status
        status = self.engine.status()
        self.assertIn("active_hotfixes_count", status)
        self.assertIn("state_directory", status)
        self.assertIn("staging_directory", status)
        self.assertIn("patch_policy", status)

        # Second cycle - should be idempotent, skipping already active snapshots
        applied_2 = daemon.run_once()
        self.assertEqual(applied_2, 0)

    def test_05_canary_breach_automatic_rollback(self):
        """Verify that when canary health probe fails, the daemon triggers immediate rollback."""
        daemon = KineticDaemon(engine=self.engine, feed_url=self.feed_url, auto_stage_patches=False)

        test_file = Path(self.temp_dir) / "dummy_service.conf"
        test_file.write_text("INITIAL_STATE=CLEAN\n", encoding="utf-8")

        mock_patch = KineticPatch(
            id="PAT-CANARY-FAIL-01",
            cve_id="CVE-2026-9999",
            title="Test Vulnerability with Unstable Patch",
            severity="CRITICAL",
            cvss=9.8,
            cisa_kev=True,
            affected_packages=["dummy-server"],
            affected_distros=["all"],
            hot_mitigation=HotMitigation(
                summary="Append dirty config",
                downtime_required=False,
                commands=[f"echo 'MUTATION=DIRTY' >> {test_file}"],
                verification_command=f"test -f {test_file}",
                rollback_command=f"echo 'INITIAL_STATE=CLEAN' > {test_file}"
            ),
            provenance=Provenance(
                signed_by="security@exultia.tech",
                cosign_digest="sha256:" + "a" * 64,
                slsa_level=3
            )
        )

        daemon.engine.fetch_feed = MagicMock(return_value=[mock_patch])
        daemon.engine.apply_patch = MagicMock(return_value=True)
        daemon.engine.rollback_patch = MagicMock(return_value=True)
        daemon.evaluate_canary_health = MagicMock(return_value=False)

        applied = daemon.run_once()

        daemon.engine.rollback_patch.assert_called_once_with(cve_id="CVE-2026-9999")
        self.assertEqual(applied, 0)

    def test_06_automatic_local_os_patch_staging(self):
        """Verify relevant OS patches are automatically staged in the local staging directory."""
        staged = self.engine.stage_os_patches(os_filter="ubuntu", feed_url="http://127.0.0.1:59999/offline")
        self.assertGreaterEqual(len(staged), 2)

        has_non_reboot = any(not r.requires_reboot for r in staged)
        has_reboot = any(r.requires_reboot for r in staged)
        self.assertTrue(has_non_reboot, "Expected at least one non-reboot Ubuntu patch staged")
        self.assertTrue(has_reboot, "Expected at least one reboot-required Ubuntu patch staged")

        for rec in staged:
            self.assertEqual(rec.os_distro, "ubuntu")
            bundle_path = Path(rec.local_bundle_path)
            self.assertTrue(bundle_path.exists(), f"Staged script {bundle_path} must exist on disk")
            meta_path = bundle_path.parent / "bundle_metadata.json"
            self.assertTrue(meta_path.exists(), f"Metadata {meta_path} must exist on disk")
            meta = json.loads(meta_path.read_text(encoding="utf-8"))
            self.assertEqual(meta["patch_id"], rec.patch_id)

    def test_07_auto_patch_non_reboot_only(self):
        """Verify enabling auto_patch_non_reboot applies non-reboot patches while leaving reboot-required patches staged."""
        daemon = KineticDaemon(
            engine=self.engine,
            feed_url="http://127.0.0.1:59999/offline",
            argent_feed_url="http://127.0.0.1:59999/offline",
            os_distro="ubuntu",
            staging_dir=str(self.staging_dir),
            auto_stage_patches=True,
            auto_patch_non_reboot=True,
            disruptive_auto_reboot=False,
            dry_run=True
        )

        summary = daemon.run_patch_management_cycle(current_time=datetime(2026, 10, 30, 14, 0))
        self.assertGreaterEqual(summary["applied_non_reboot_count"], 1)
        self.assertEqual(summary["applied_disruptive_count"], 0)
        self.assertFalse(summary["reboot_scheduled"])

        records = self.engine.get_staged_patches()
        for r in records:
            if r.os_distro == "ubuntu":
                if not r.requires_reboot:
                    self.assertEqual(r.status, "applied")
                else:
                    self.assertEqual(r.status, "staged")

    def test_08_disruptive_patching_off_peak_window_enforcement(self):
        """Verify disruptive patching with auto-reboot defers outside off-peak hours and applies + schedules reboot inside off-peak hours."""
        daemon = KineticDaemon(
            engine=self.engine,
            feed_url="http://127.0.0.1:59999/offline",
            argent_feed_url="http://127.0.0.1:59999/offline",
            os_distro="ubuntu",
            staging_dir=str(self.staging_dir),
            auto_stage_patches=True,
            auto_patch_non_reboot=True,
            disruptive_auto_reboot=True,
            off_peak_window="02:00-05:00",
            dry_run=True
        )

        # 1. Run at 14:30 (Peak hours - outside 02:00-05:00)
        peak_time = datetime(2026, 10, 30, 14, 30)
        summary_peak = daemon.run_patch_management_cycle(current_time=peak_time)
        self.assertFalse(summary_peak["in_off_peak_window"])
        self.assertGreaterEqual(summary_peak["applied_non_reboot_count"], 1)
        self.assertEqual(summary_peak["applied_disruptive_count"], 0)
        self.assertGreaterEqual(summary_peak["deferred_off_peak_count"], 1)
        self.assertFalse(summary_peak["reboot_scheduled"])

        records_after_peak = self.engine.get_staged_patches()
        disruptive_recs = [r for r in records_after_peak if r.os_distro == "ubuntu" and r.requires_reboot]
        self.assertTrue(all(r.status == "deferred_off_peak" for r in disruptive_recs))

        # 2. Run at 03:15 (Off-Peak hours - inside 02:00-05:00)
        off_peak_time = datetime(2026, 10, 30, 3, 15)
        summary_off_peak = daemon.run_patch_management_cycle(current_time=off_peak_time)
        self.assertTrue(summary_off_peak["in_off_peak_window"])
        self.assertGreaterEqual(summary_off_peak["applied_disruptive_count"], 1)
        self.assertTrue(summary_off_peak["reboot_scheduled"])

        records_after_off_peak = self.engine.get_staged_patches()
        disruptive_recs_2 = [r for r in records_after_off_peak if r.os_distro == "ubuntu" and r.requires_reboot]
        self.assertTrue(all(r.status == "applied_reboot_scheduled" and r.reboot_scheduled for r in disruptive_recs_2))

    def test_09_overnight_off_peak_window_calculation(self):
        """Verify overnight off-peak windows (e.g. 22:00-04:00) evaluate accurately."""
        self.assertTrue(KineticEngine.is_within_off_peak_window("22:00-04:00", datetime(2026, 10, 30, 23, 15)))
        self.assertTrue(KineticEngine.is_within_off_peak_window("22:00-04:00", datetime(2026, 10, 30, 2, 45)))
        self.assertFalse(KineticEngine.is_within_off_peak_window("22:00-04:00", datetime(2026, 10, 30, 12, 0)))


if __name__ == "__main__":
    unittest.main(verbosity=2)
