"""
Exultia Kinetic Standalone CLI Entry Point.
"""

import sys
import os
import argparse
import json
import time
from pathlib import Path

from . import __version__
from .engine import KineticEngine
from .daemon import KineticDaemon
from .provenance import ProvenanceVerifier
from .compliance_drift import ComplianceDriftManager


# Configure UTF-8 encoding for standard output across all platforms
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass


def build_parser() -> argparse.ArgumentParser:
    common_parser = argparse.ArgumentParser(add_help=False)
    common_parser.add_argument("--state-dir", help="Custom state and snapshot directory", default=None)
    common_parser.add_argument("--json", action="store_true", help="Output results in JSON format")

    parser = argparse.ArgumentParser(
        prog="kinetic",
        parents=[common_parser],
        description="Exultia Kinetic: Autonomous Zero-Downtime Hotfix Stream, Drift Sentinel & Sub-Second Deterministic Rollback Binary"
    )
    parser.add_argument("--version", action="version", version=f"kinetic {__version__}")

    subparsers = parser.add_subparsers(dest="command", help="Available Kinetic commands")

    # Command: apply
    apply_parser = subparsers.add_parser("apply", parents=[common_parser], help="Apply hot-mitigations from patch feed or specific CVE")
    apply_parser.add_argument("--cve", help="Specific CVE ID to mitigate (e.g. CVE-2024-3094)")
    apply_parser.add_argument("--feed-url", default="https://exultia.tech/api/patches/feed", help="Patch feed URL")
    apply_parser.add_argument("--token", help="Exultia Kinetic authorization token")
    apply_parser.add_argument("--os", help="Target operating system distribution filter")
    apply_parser.add_argument("--dry-run", action="store_true", help="Simulate mitigation without modifying files")

    # Command: upgrade (Standard OS Distribution Package Updates via Argent / Distro Feeds)
    upgrade_parser = subparsers.add_parser("upgrade", parents=[common_parser], help="Deploy standard OS package updates and vendor errata bundles from Argent")
    upgrade_parser.add_argument("--bundle", help="Specific vendor advisory / bundle ID (e.g. RLSA-2024:4312 or USN-6856-1)")
    upgrade_parser.add_argument("--feed-url", default="https://exultia.tech/api/argent/feed?format=kinetic", help="Argent / distro patch feed URL")
    upgrade_parser.add_argument("--os", help="Operating system filter (e.g. rocky, ubuntu, debian, alpine, suse)")
    upgrade_parser.add_argument("--dry-run", action="store_true", help="Simulate upgrade without executing package manager")

    # Command: rollback
    rollback_parser = subparsers.add_parser("rollback", parents=[common_parser], help="Execute sub-second deterministic rollback")
    rollback_parser.add_argument("--cve", help="Specific CVE ID to rollback")
    rollback_parser.add_argument("--latest", action="store_true", help="Rollback the most recently applied mitigation")

    # Command: daemon
    daemon_parser = subparsers.add_parser("daemon", parents=[common_parser], help="Run autonomous patch daemon with canary health probes and drift auto-reversion")
    daemon_parser.add_argument("--interval", type=int, default=3600, help="Sync interval in seconds (default: 3600)")
    daemon_parser.add_argument("--feed-url", default="https://exultia.tech/api/patches/feed", help="Patch feed URL")
    daemon_parser.add_argument("--token", help="Exultia Kinetic authorization token")
    daemon_parser.add_argument("--ring", type=int, choices=[0, 1, 2], default=0, help="Staged rollout ring (0=Canary, 1=Cautious, 2=Broad)")
    daemon_parser.add_argument("--revert-drift", dest="revert_drift", action="store_true", default=True, help="Enable automatic drift reversion to SOX/PCI baseline (default: enabled)")
    daemon_parser.add_argument("--no-revert-drift", dest="revert_drift", action="store_false", help="Disable automatic drift reversion")
    daemon_parser.add_argument("--compliance-mode", choices=["sox_pci", "pci", "sox", "strict"], default="sox_pci", help="Compliance baseline standards to enforce (default: sox_pci)")

    # Command: drift (Configuration Drift Audit & Instant Reconciliation)
    drift_parser = subparsers.add_parser("drift", parents=[common_parser], help="Audit and auto-revert configuration drift against SOX and PCI-DSS baselines")
    drift_parser.add_argument("action", choices=["audit", "revert", "fix"], default="audit", nargs="?", help="Action: audit (inspect only) or revert/fix (reconcile to baseline)")
    drift_parser.add_argument("--compliance-mode", choices=["sox_pci", "pci", "sox", "strict"], default="sox_pci", help="Compliance baseline standards to enforce (default: sox_pci)")
    drift_parser.add_argument("--dry-run", action="store_true", help="Simulate reversion without modifying files")

    # Command: status
    status_parser = subparsers.add_parser("status", parents=[common_parser], help="Inspect host mitigation status and active snapshots")
    status_parser.add_argument("--audit", action="store_true", help="Include full recent audit trail")

    # Command: verify
    verify_parser = subparsers.add_parser("verify", parents=[common_parser], help="Verify SLSA Level 3 cryptographic provenance")
    verify_parser.add_argument("--cve", help="CVE ID to verify (default: verifies all available feed items)")
    verify_parser.add_argument("--feed-url", default="https://exultia.tech/api/patches/feed", help="Patch feed URL")

    # Command: test
    subparsers.add_parser("test", parents=[common_parser], help="Run self-contained end-to-end simulation and rollback verification")

    return parser


def run_self_test(engine: KineticEngine) -> bool:
    """
    Self-contained verification of atomic snapshotting and sub-second deterministic rollback.
    """
    print("\n[Kinetic Test] --- Running End-to-End Self-Validation Suite ---")
    test_file = engine.base_dir / "test_target.conf"
    initial_content = "ORIGINAL_PRE_IMAGE_CONFIGURATION_V1=ENABLED\nMAX_CONNS=100\n"
    test_file.write_text(initial_content, encoding="utf-8")
    initial_sha = engine.create_file_snapshot(str(test_file), "CVE-TEST-0001")

    print(f"[Kinetic Test] 1. Baseline Target Created: {test_file}")
    print(f"[Kinetic Test]    Initial SHA-256: {initial_sha[1] if initial_sha else 'ERR'}")

    # Simulate hot-mitigation mutation
    mutated_content = "ORIGINAL_PRE_IMAGE_CONFIGURATION_V1=ENABLED\nMAX_CONNS=100\n# KINETIC HOTFIX\nPROTECTION_MODE=STRICT\n"
    test_file.write_text(mutated_content, encoding="utf-8")
    print("[Kinetic Test] 2. Applied Synthetic Mitigation Mutation")

    # Execute deterministic rollback
    t0 = time.time()
    from .models import SnapshotRecord
    snap_rec = SnapshotRecord(
        snapshot_id="SNAP-TEST-001",
        cve_id="CVE-TEST-0001",
        target_path=str(test_file),
        backup_path=initial_sha[0] if initial_sha else "",
        sha256_pre=initial_sha[1] if initial_sha else "",
        sha256_post=None,
        rollback_command="true",
        verification_command="true",
        created_at=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        status="active"
    )
    snaps = engine.get_snapshots()
    snaps.append(snap_rec)
    engine.save_snapshots(snaps)

    print("[Kinetic Test] 3. Executing Sub-Second Deterministic Rollback...")
    rb_success = engine.rollback_patch(cve_id="CVE-TEST-0001")
    latency = (time.time() - t0) * 1000

    # Verify content restored
    restored_content = test_file.read_text(encoding="utf-8")
    matches = (restored_content == initial_content)

    print(f"[Kinetic Test] 4. Post-Rollback Content Integrity Match: {'PASS' if matches else 'FAIL'}")
    print(f"[Kinetic Test]    Rollback Latency: {latency:.2f}ms (Sub-second guaranteed: {'YES' if latency < 1000 else 'NO'})")

    # Cleanup test file
    try:
        test_file.unlink(missing_ok=True)
    except Exception:
        pass

    if rb_success and matches and latency < 1000:
        print("[Kinetic Test] [OK] All Self-Validation Gates Passed Successfully!\n")
        return True
    else:
        print("[Kinetic Test] [FAIL] Validation Failed!\n")
        return False


def cli_entry():
    parser = build_parser()
    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(0)

    engine = KineticEngine(state_dir=args.state_dir)

    if args.command == "apply":
        patches = engine.fetch_feed(
            feed_url=args.feed_url,
            token=args.token,
            os_distro=args.os
        )

        if args.cve:
            patches = [p for p in patches if p.cve_id.upper() == args.cve.upper()]
            if not patches:
                print(f"[Kinetic] Advisory {args.cve} not found in patch feed.")
                sys.exit(1)

        applied = 0
        for p in patches:
            if engine.apply_patch(p, dry_run=args.dry_run):
                applied += 1

        print(f"\n[Kinetic] Completed. Applied {applied}/{len(patches)} hot-mitigations.")
        sys.exit(0 if applied > 0 or len(patches) == 0 else 1)

    elif args.command == "upgrade":
        success = engine.upgrade_os_packages(
            bundle_id=args.bundle,
            os_filter=args.os,
            feed_url=args.feed_url,
            dry_run=args.dry_run
        )
        sys.exit(0 if success else 1)

    elif args.command == "rollback":
        success = engine.rollback_patch(cve_id=args.cve, latest=args.latest)
        sys.exit(0 if success else 1)

    elif args.command == "daemon":
        daemon = KineticDaemon(
            engine=engine,
            feed_url=args.feed_url,
            token=args.token,
            interval=args.interval,
            ring=args.ring,
            revert_drift=args.revert_drift,
            compliance_mode=args.compliance_mode
        )
        daemon.start()

    elif args.command == "drift":
        manager = ComplianceDriftManager(
            state_dir=str(engine.base_dir),
            baseline_mode=args.compliance_mode
        )

        if args.action == "audit":
            findings = manager.audit()
            if args.json:
                print(json.dumps([f.to_dict() for f in findings], indent=2))
            else:
                print("\n=================================================")
                print(f"  EXULTIA CONFIGURATION DRIFT AUDIT ({args.compliance_mode.upper()} BASELINE)")
                print("=================================================")
                if not findings:
                    print("  [OK] ZERO DRIFT DETECTED across all SOX & PCI-DSS invariants.")
                    print("       All monitored system parameters adhere to authoritative best practices.\n")
                else:
                    print(f"  WARNING: Detected {len(findings)} configuration drift violations:\n")
                    for idx, f in enumerate(findings, 1):
                        standards_label = ", ".join(f.control.standards)
                        print(f"  {idx}. [{f.control.control_id}] {f.control.name} ({f.control.category})")
                        print(f"     Standard:      {standards_label}")
                        print(f"     Target:        {f.control.target_path}")
                        print(f"     Current Value: {f.current_value}")
                        print(f"     Desired Value: {f.control.desired_value}")
                        print("")
                    print("  To automatically revert all drifted controls back to best practices, run:")
                    print("    kinetic drift revert\n")

        elif args.action in ["revert", "fix"]:
            print(f"\n[Kinetic Drift Sentinel] Reconciling configuration drift against {args.compliance_mode.upper()} baseline...")
            results = manager.revert_drift(
                dry_run=args.dry_run,
                snapshot_engine=engine
            )
            if args.json:
                print(json.dumps([r.to_dict() for r in results], indent=2))
            else:
                if not results:
                    print("  [OK] No configuration drift found. Nothing to reconcile.")
                else:
                    for r in results:
                        tag = "REVERTED" if r.success else "FAILED"
                        print(f"  • [{tag}] {r.control.control_id} - {r.control.name}")
                        print(f"    Result: {r.message}")
                    reverted_count = sum(1 for r in results if r.success)
                    print(f"\n[Kinetic Drift Sentinel] Successfully reconciled {reverted_count}/{len(results)} controls to baseline.\n")

    elif args.command == "status":
        info = engine.status()
        if args.json:
            print(json.dumps(info, indent=2))
        else:
            print("\n=================================================")
            print(f"  EXULTIA KINETIC HOST STATUS (v{info['kinetic_version']})")
            print("=================================================")
            print(f"  Host Platform:      {info['host_os']}")
            print(f"  State Directory:    {info['state_directory']}")
            print(f"  Active Hotfixes:    {info['active_hotfixes_count']}")
            print(f"  Rolled Back Patches:{info['rolled_back_count']}")
            print(f"  Total Snapshots:    {info['total_snapshots']}")
            print("-------------------------------------------------")
            if info['active_hotfixes']:
                print("  Active Hotfixes:")
                for h in info['active_hotfixes']:
                    print(f"    • {h['cve_id']}: {h['target']} (applied {h['applied_at']})")
            else:
                print("  No active hotfixes applied. Host at clean baseline.")

            if args.audit and info['recent_audit_trail']:
                print("\n  Recent Audit Trail:")
                for a in info['recent_audit_trail']:
                    print(f"    [{a.get('timestamp')}] {a.get('action')} {a.get('cve_id')} -> {a.get('status')} ({a.get('latency_ms', 0)}ms)")
            print("=================================================\n")

    elif args.command == "verify":
        patches = engine.fetch_feed(feed_url=args.feed_url)
        if args.cve:
            patches = [p for p in patches if p.cve_id.upper() == args.cve.upper()]

        all_ok = True
        print("\n[Kinetic] ─── Verifying SLSA Level 3 Cryptographic Provenance ───")
        for p in patches:
            ok, msg = ProvenanceVerifier.verify_patch(p)
            print(f"  • {p.cve_id}: [{'PASS' if ok else 'FAIL'}] {msg}")
            print(f"    Cosign Digest: {p.provenance.cosign_digest}")
            if not ok:
                all_ok = False

        sys.exit(0 if all_ok else 1)

    elif args.command == "test":
        ok = run_self_test(engine)
        sys.exit(0 if ok else 1)


if __name__ == "__main__":
    cli_entry()
