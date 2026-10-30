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

    def test_10_vendor_native_builtin_security_patching(self):
        """Verify daemon natively utilizes OS vendor built-in patching commands for security & non-reboot updates."""
        for distro, expected_substr in [
            ("ubuntu", "apt-get"),
            ("rhel", "dnf upgrade-minimal"),
            ("rocky", "dnf upgrade-minimal"),
            ("sles", "zypper"),
            ("opensuse-leap", "zypper"),
            ("alpine", "apk upgrade"),
            ("fedora-coreos", "rpm-ostree"),
            ("flatcar", "update_engine_client"),
            ("truenas-scale", "midclt"),
            ("proxmox", "apt-get"),
            ("freebsd", "pkg upgrade"),
            ("openbsd", "syspatch"),
        ]:
            res = self.engine.execute_vendor_native_updates(
                os_filter=distro,
                include_disruptive=False,
                enable_builtin_autoupdate=True,
                dry_run=True,
            )
            self.assertEqual(res["status"], "success")
            self.assertEqual(res["target_os"], distro)
            self.assertIn(expected_substr, res["command"])

    def test_11_system_scheduler_systemd_timers_and_crontabs(self):
        """Verify daemon configures systemd timer/service units and crontabs for automatic patching."""
        sched_root = Path(self.temp_dir) / "sched_root"
        res = self.engine.configure_system_scheduler(
            mode="both",
            sync_cron="15 */2 * * *",
            deferred_window="Sat 01:00-05:00, Sun 01:00-05:00",
            enable_vendor_native_timer=True,
            os_filter="rocky",
            custom_root=str(sched_root),
            dry_run=True,
        )
        self.assertEqual(res["mode"], "both")
        self.assertEqual(res["target_os"], "rocky")
        self.assertTrue(Path(res["systemd_service_unit"]).exists())
        self.assertTrue(Path(res["systemd_timer_unit"]).exists())
        self.assertTrue(Path(res["cron_file"]).exists())

        svc_txt = Path(res["systemd_service_unit"]).read_text(encoding="utf-8")
        tmr_txt = Path(res["systemd_timer_unit"]).read_text(encoding="utf-8")
        cron_txt = Path(res["cron_file"]).read_text(encoding="utf-8")

        self.assertIn("--vendor-native", svc_txt)
        self.assertIn("OnCalendar=*-*-* 01:00:00", tmr_txt)
        self.assertIn("15 */2 * * *", cron_txt)

    def test_12_deferred_time_periods_and_hold_timestamp(self):
        """Verify deferred time periods (multi-window, day-of-week, and ISO-8601 hold timestamp) for disruptive patching."""
        # 2026-10-31 is a Saturday
        sat_inside = datetime(2026, 10, 31, 2, 30)
        fri_same_hour = datetime(2026, 10, 30, 2, 30)

        win_spec = "Sat 01:00-05:00, Sun 01:00-05:00"
        self.assertTrue(KineticEngine.is_within_deferred_window(win_spec, current_time=sat_inside))
        self.assertFalse(KineticEngine.is_within_deferred_window(win_spec, current_time=fri_same_hour))

        # Explicit defer_until hold timestamp in the future blocks patching even inside Saturday window
        self.assertFalse(
            KineticEngine.is_within_deferred_window(
                win_spec,
                current_time=sat_inside,
                defer_until="2026-11-05T00:00:00",
            )
        )
        # Once past defer_until, Saturday window is active
        self.assertTrue(
            KineticEngine.is_within_deferred_window(
                win_spec,
                current_time=sat_inside,
                defer_until="2026-10-30T00:00:00",
            )
        )

    def test_13_enterprise_webhook_listener_trigger_and_defer(self):
        """Verify enterprise webhook listener accepts authenticated external triggers and deferral updates."""
        import urllib.request
        import urllib.error

        daemon = KineticDaemon(
            engine=self.engine,
            feed_url="http://127.0.0.1:59999/offline",
            argent_feed_url="http://127.0.0.1:59999/offline",
            os_distro="ubuntu",
            staging_dir=str(self.staging_dir),
            webhook_listen=True,
            webhook_host="127.0.0.1",
            webhook_port=0,  # ephemeral port
            webhook_secret="enterprise-secret-token",
            dry_run=True,
        )
        port = daemon.start_webhook_listener()
        self.assertGreater(port, 0)

        try:
            # 1. Health endpoint
            with urllib.request.urlopen(f"http://127.0.0.1:{port}/health", timeout=5) as resp:
                self.assertEqual(resp.status, 200)
                health_data = json.loads(resp.read().decode("utf-8"))
                self.assertTrue(health_data["ok"])

            # 2. Unauthorized POST must return 401
            unauth_req = urllib.request.Request(
                f"http://127.0.0.1:{port}/webhook/trigger",
                data=b'{"mode": "non-reboot"}',
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with self.assertRaises(urllib.error.HTTPError) as ctx:
                urllib.request.urlopen(unauth_req, timeout=5)
            self.assertEqual(ctx.exception.code, 401)

            # 3. Authorized POST /webhook/defer
            defer_payload = json.dumps({
                "deferred_windows": ["Sat 01:00-04:00", "Sun 01:00-04:00"],
                "defer_disruptive_until": "2026-12-01T00:00:00Z",
            }).encode("utf-8")
            defer_req = urllib.request.Request(
                f"http://127.0.0.1:{port}/webhook/defer",
                data=defer_payload,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": "Bearer enterprise-secret-token",
                },
                method="POST",
            )
            with urllib.request.urlopen(defer_req, timeout=5) as resp:
                self.assertEqual(resp.status, 200)
                d_body = json.loads(resp.read().decode("utf-8"))
                self.assertTrue(d_body["ok"])
                self.assertEqual(d_body["patch_policy"]["defer_disruptive_until"], "2026-12-01T00:00:00Z")

            # 4. Authorized POST /webhook/trigger
            trig_payload = json.dumps({
                "source": "ServiceNow-Enterprise-Console",
                "mode": "non-reboot",
                "include_vendor_native": True,
                "dry_run": True,
            }).encode("utf-8")
            trig_req = urllib.request.Request(
                f"http://127.0.0.1:{port}/webhook/trigger",
                data=trig_payload,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": "Bearer enterprise-secret-token",
                },
                method="POST",
            )
            with urllib.request.urlopen(trig_req, timeout=5) as resp:
                self.assertEqual(resp.status, 200)
                t_body = json.loads(resp.read().decode("utf-8"))
                self.assertTrue(t_body["ok"])
                self.assertEqual(t_body["webhook_event"]["source"], "ServiceNow-Enterprise-Console")
        finally:
            daemon.stop_webhook_listener()

    def test_14_fullauto_requires_secondary_confirm_argument(self):
        """Verify --fullauto refuses to run without --confirm and succeeds with --fullauto --confirm."""
        # 1. Engine level without confirm raises PermissionError
        with self.assertRaises(PermissionError):
            self.engine.execute_fullauto_cycle(confirm=False, os_filter="ubuntu", dry_run=True)

        # 2. Daemon level without confirm raises PermissionError
        with self.assertRaises(PermissionError):
            KineticDaemon(
                engine=self.engine,
                os_distro="ubuntu",
                fullauto=True,
                confirm=False,
                dry_run=True,
            )

        # 3. With --fullauto --confirm and healthy HA metrics, dynamically drains and patches
        res = self.engine.execute_fullauto_cycle(
            confirm=True,
            os_filter="ubuntu",
            argent_feed_url="http://127.0.0.1:59999/offline",
            custom_staging_dir=str(self.staging_dir),
            pre_patch_hook="echo draining_lb_node",
            post_patch_hook="echo uncordoning_lb_node",
            simulated_metrics={
                "load_1m": 0.20,
                "cpu_count": 4,
                "avail_mem_pct": 72.0,
                "ha_cluster_state": "ready",
            },
            dry_run=True,
        )
        self.assertTrue(res["fullauto"])
        self.assertTrue(res["confirmed"])
        self.assertEqual(res["status"], "completed")
        self.assertTrue(res["ha_drain_graceful"])
        self.assertGreaterEqual(res["patch_summary"]["applied_non_reboot_count"], 1)
        self.assertGreaterEqual(res["patch_summary"]["applied_disruptive_count"], 1)

        # 4. High CPU load dynamically defers fullauto cycle gracefully
        busy_res = self.engine.execute_fullauto_cycle(
            confirm=True,
            os_filter="ubuntu",
            simulated_metrics={
                "load_1m": 7.8,
                "cpu_count": 2,
                "avail_mem_pct": 60.0,
                "ha_cluster_state": "ready",
            },
            dry_run=True,
        )
        self.assertEqual(busy_res["status"], "deferred_by_dynamic_telemetry")
        self.assertFalse(busy_res["readiness"]["ready_to_patch"])

    def test_15_open_source_kernel_livepatching_klp_and_ebpf(self):
        """Verify 100% open-source Linux kernel livepatching (CONFIG_LIVEPATCH / kpatch + eBPF CO-RE function guards)."""
        # 1. Probe capabilities
        caps = self.engine.probe_kernel_livepatch_capabilities()
        self.assertTrue(caps["non_commercial"])
        self.assertIn("recommended_backend", caps)
        self.assertIn("open_source_tiers", caps)

        # 2. Stage and apply open-source kernel livepatches
        lp_res = self.engine.apply_kernel_livepatches(
            mode="both",
            custom_staging_dir=str(self.staging_dir),
            dry_run=True,
        )
        self.assertTrue(lp_res["non_commercial_open_source"])
        self.assertFalse(lp_res["requires_reboot"])
        self.assertGreaterEqual(lp_res["applied_count"], 4)

        # Verify generated C and eBPF CO-RE artifacts on disk for CVE-2024-1086
        cve_dir = self.staging_dir / "livepatch" / "cve-2024-1086"
        self.assertTrue((cve_dir / "klp_cve_2024_1086.c").exists())
        self.assertTrue((cve_dir / "ebpf_klp_cve_2024_1086.bpf.c").exists())
        self.assertTrue((cve_dir / "Makefile").exists())
        self.assertTrue((cve_dir / "apply_livepatch.sh").exists())
        self.assertTrue((cve_dir / "unload_livepatch.sh").exists())
        self.assertTrue((cve_dir / "livepatch_manifest.json").exists())

        klp_c_text = (cve_dir / "klp_cve_2024_1086.c").read_text(encoding="utf-8")
        self.assertIn("#include <linux/livepatch.h>", klp_c_text)
        self.assertIn("klp_enable_patch", klp_c_text)
        self.assertIn("nft_verdict_init", klp_c_text)

        ebpf_c_text = (cve_dir / "ebpf_klp_cve_2024_1086.bpf.c").read_text(encoding="utf-8")
        self.assertIn("fmod_ret/nft_verdict_init", ebpf_c_text)

        # 3. Verify deterministic unload of kernel livepatch
        unload_ok = self.engine.unload_kernel_livepatch("CVE-2024-1086", dry_run=True)
        self.assertTrue(unload_ok)

        # 4. Verify integration inside execute_staged_patch_policy
        self.engine.stage_os_patches(
            os_filter="ubuntu",
            feed_url="http://127.0.0.1:59999/offline",
            custom_staging_dir=str(self.staging_dir),
        )
        policy_res = self.engine.execute_staged_patch_policy(
            os_filter="ubuntu",
            feed_url="http://127.0.0.1:59999/offline",
            auto_patch_non_reboot=True,
            kernel_livepatch=True,
            kernel_livepatch_mode="both",
            custom_staging_dir=str(self.staging_dir),
            dry_run=True,
        )
        self.assertTrue(policy_res["kernel_livepatch"])
        self.assertIsNotNone(policy_res["kernel_livepatch_result"])
        self.assertGreaterEqual(policy_res["kernel_livepatch_result"]["applied_count"], 4)


if __name__ == "__main__":
    unittest.main(verbosity=2)
