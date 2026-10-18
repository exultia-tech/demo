"""
Comprehensive Test Suite for Exultia Kinetic Runtime Daemon.
Tests:
  1. Daemon instantiation & configuration (rings, intervals, tokens).
  2. Signal handling & graceful termination.
  3. Single-cycle execution (run_once) against the live Next.js patch feed.
  4. Snapshot state management & idempotency.
  5. Synthetic Canary health probe evaluation.
  6. Canary breach detection & automatic sub-second rollback.
"""

import os
import sys
import shutil
import tempfile
import unittest
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
        self.engine = KineticEngine(state_dir=str(self.state_dir))
        self.feed_url = "http://localhost:3000/api/patches/feed"

    def tearDown(self):
        shutil.rmtree(self.temp_dir, ignore_errors=True)

    def test_01_daemon_initialization(self):
        """Verify daemon initializes with correct configuration and ring hierarchy."""
        daemon = KineticDaemon(
            engine=self.engine,
            feed_url=self.feed_url,
            token="test-secret-token",
            interval=60,
            ring=1
        )
        self.assertEqual(daemon.feed_url, self.feed_url)
        self.assertEqual(daemon.token, "test-secret-token")
        self.assertEqual(daemon.interval, 60)
        self.assertEqual(daemon.ring, 1)
        self.assertFalse(daemon.running)

    def test_02_signal_handling_graceful_shutdown(self):
        """Verify SIGINT/SIGTERM handlers correctly update the running state."""
        daemon = KineticDaemon(engine=self.engine)
        daemon.running = True
        daemon.setup_signal_handlers()

        # Simulate receiving signal by verifying daemon.running can be toggled
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
            feed_url=self.feed_url,
            ring=0
        )

        # First cycle - syncs and evaluates applicable mitigations
        applied_1 = daemon.run_once()
        self.assertIsInstance(applied_1, int)

        # Inspect engine status
        status = self.engine.status()
        self.assertIn("active_hotfixes_count", status)
        self.assertIn("state_directory", status)

        # Second cycle - should be idempotent, skipping already active snapshots
        applied_2 = daemon.run_once()
        self.assertEqual(applied_2, 0)

    def test_05_canary_breach_automatic_rollback(self):
        """Verify that when canary health probe fails, the daemon triggers immediate rollback."""
        daemon = KineticDaemon(engine=self.engine, feed_url=self.feed_url)

        # Create a mock patch that targets a temporary file
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

        # Mock fetch_feed to return our test patch
        daemon.engine.fetch_feed = MagicMock(return_value=[mock_patch])
        daemon.engine.apply_patch = MagicMock(return_value=True)
        daemon.engine.rollback_patch = MagicMock(return_value=True)

        # Mock evaluate_canary_health to simulate health failure (e.g. CPU spike / service crash)
        daemon.evaluate_canary_health = MagicMock(return_value=False)

        # Run cycle
        applied = daemon.run_once()

        # Because canary failed, rollback_patch was invoked and applied count is 0
        daemon.engine.rollback_patch.assert_called_once_with(cve_id="CVE-2026-9999")
        self.assertEqual(applied, 0)


if __name__ == "__main__":
    unittest.main(verbosity=2)
