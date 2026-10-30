"""
Exultia (`exultia` / `xul`) Unified Autonomous Daemon & CLI Entry Point.
Consolidates all Exultia capabilities (Vantage threat feed, Praxis remediation compiler,
Argent OS patch management, vendor-native security updates, open-source kernel livepatching,
SOX/PCI configuration drift reconciliation, systemd/cron scheduling, enterprise webhook
listener, and dynamic HA --fullauto --confirm patching) into a single binary and daemon.
"""

import sys
import os
import argparse
import json
import time
from pathlib import Path
from typing import List, Optional

from . import __version__
from .engine import KineticEngine
from .daemon import KineticDaemon
from .webhook import KineticWebhookListener
from .provenance import ProvenanceVerifier
from .compliance_drift import ComplianceDriftManager


# Configure UTF-8 encoding for standard output across all platforms
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass


KNOWN_SUBCOMMANDS = {
    "daemon",
    "patch",
    "upgrade",
    "apply",
    "livepatch",
    "drift",
    "audit",
    "fix",
    "compile",
    "praxis",
    "feed",
    "search",
    "query",
    "rollback",
    "schedule",
    "webhook",
    "status",
    "verify",
    "test",
}


TOP_LEVEL_MODE_FLAGS = {
    "--daemon": ["daemon"],
    "-d": ["daemon"],
    "--patch": ["patch"],
    "-p": ["patch"],
    "--upgrade": ["patch"],
    "--apply": ["apply"],
    "--livepatch": ["livepatch"],
    "-k": ["livepatch"],
    "--drift": ["drift"],
    "--audit": ["audit"],
    "--fix": ["fix"],
    "--compile": ["compile"],
    "-c": ["compile"],
    "--praxis": ["compile"],
    "--feed": ["feed"],
    "--rollback": ["rollback"],
    "-r": ["rollback"],
    "--schedule": ["schedule"],
    "--webhook": ["webhook"],
    "--status": ["status"],
    "-s": ["status"],
    "--verify": ["verify"],
    "--test": ["test"],
}


def normalize_cli_argv(argv: List[str]) -> List[str]:
    """
    Normalizes top-level shorthand invocations (e.g. `xul --status`, `xul --daemon ...`,
    `xul --patch --non-reboot --vendor`, `xul --livepatch --cve CVE-2024-1086`,
    `xul --search openssh`, `xul --fullauto --confirm`) into the canonical subcommand
    structure so users can invoke either `exultia <subcommand>` or `xul --<command>`.
    """
    if not argv:
        return argv

    # Check if a known subcommand is already present as the first non-global positional token
    idx = 0
    while idx < len(argv):
        tok = argv[idx]
        if tok in ("--state-dir", "--staging-dir") and idx + 1 < len(argv):
            idx += 2
            continue
        if tok.startswith("--state-dir=") or tok.startswith("--staging-dir=") or tok == "--json":
            idx += 1
            continue
        break

    if idx < len(argv) and argv[idx] in KNOWN_SUBCOMMANDS:
        sub = argv[idx]
        # Normalize `exultia search <term>` -> `exultia feed --search <term>`
        if sub == "search":
            rest = argv[:idx] + ["feed"] + argv[idx + 1:]
            if idx + 1 < len(argv) and not argv[idx + 1].startswith("-"):
                rest = argv[:idx] + ["feed", "--search", argv[idx + 1]] + argv[idx + 2:]
            return rest
        # Normalize `exultia query <cve>` -> `exultia feed --cve <cve>`
        if sub == "query":
            rest = argv[:idx] + ["feed"] + argv[idx + 1:]
            if idx + 1 < len(argv) and not argv[idx + 1].startswith("-"):
                rest = argv[:idx] + ["feed", "--cve", argv[idx + 1]] + argv[idx + 2:]
            return rest
        # Normalize `exultia praxis` -> `exultia compile`
        if sub == "praxis":
            return argv[:idx] + ["compile"] + argv[idx + 1:]
        return argv

    # Check for top-level shorthand flags like `xul --daemon ...`, `xul --patch ...`, `xul --search <q>`
    for i, tok in enumerate(argv):
        if tok in TOP_LEVEL_MODE_FLAGS:
            mapped = list(TOP_LEVEL_MODE_FLAGS[tok])
            remaining = argv[:i] + argv[i + 1:]
            if mapped == ["livepatch"]:
                # If no explicit action (`probe`, `apply`, `unload`, `status`) follows, infer `apply` if `--cve` or `--mode` is given
                has_action = any(a in ("probe", "apply", "unload", "status") for a in remaining)
                if not has_action:
                    if "--cve" in remaining or any(a.startswith("--cve=") for a in remaining) or "--mode" in remaining:
                        mapped.append("apply")
                    else:
                        mapped.append("status")
            elif mapped == ["compile"]:
                # Allow `xul --compile CVE-2024-6387`
                if i < len(remaining) and not remaining[i].startswith("-"):
                    remaining = remaining[:i] + ["--cve", remaining[i]] + remaining[i + 1:]
            return mapped + remaining

        if tok.startswith("--search="):
            val = tok.split("=", 1)[1]
            return ["feed", "--search", val] + argv[:i] + argv[i + 1:]
        if tok == "--search":
            return ["feed"] + argv

    # If user invokes `xul --fullauto --confirm` or `xul --non-reboot --vendor` directly without `--patch` or `--daemon`
    patch_shorthand_flags = {
        "--fullauto",
        "--non-reboot",
        "--auto-patch-non-reboot",
        "--vendor",
        "--vendor-native",
        "--disruptive",
        "--disruptive-auto-reboot",
        "--stage",
        "--stage-only",
    }
    if any(t in patch_shorthand_flags for t in argv):
        return ["patch"] + argv

    return argv


def _add_shared_patch_and_daemon_flags(p: argparse.ArgumentParser, is_daemon: bool = False) -> None:
    """Adds normalized, simplified patch management flags (alongside backward-compatible aliases)."""
    p.add_argument("--os", help="Target OS distribution (auto-detected from /etc/os-release if omitted)")
    p.add_argument(
        "--stage", "--auto-stage",
        dest="auto_stage_patches",
        action="store_true",
        default=True if is_daemon else False,
        help="Automatically stage relevant OS patches in the local staging directory",
    )
    p.add_argument(
        "--no-stage", "--no-auto-stage",
        dest="auto_stage_patches",
        action="store_false",
        help="Disable automatic local staging of OS patches",
    )
    if not is_daemon:
        p.add_argument(
            "--stage-only",
            action="store_true",
            default=False,
            help="Stage relevant OS patches locally without installing",
        )
    p.add_argument(
        "--non-reboot", "--auto-patch-non-reboot",
        dest="auto_patch_non_reboot",
        action="store_true",
        default=False,
        help="Automatically install patches that do not require a system reboot",
    )
    p.add_argument(
        "--vendor", "--vendor-native",
        dest="vendor_native",
        action="store_true",
        default=False,
        help="Natively run OS vendor built-in security patching commands (apt, dnf, zypper, apk, rpm-ostree)",
    )
    p.add_argument(
        "--no-vendor", "--no-vendor-native",
        dest="vendor_native",
        action="store_false",
        help="Disable OS vendor built-in patching commands",
    )
    p.add_argument(
        "--livepatch", "--kernel-livepatch",
        dest="kernel_livepatch",
        action="store_true",
        default=False,
        help="Enable open-source zero-reboot Linux kernel livepatching (CONFIG_LIVEPATCH / kpatch + eBPF CO-RE)",
    )
    p.add_argument(
        "--no-livepatch", "--no-kernel-livepatch",
        dest="kernel_livepatch",
        action="store_false",
        help="Disable open-source kernel livepatching",
    )
    p.add_argument(
        "--livepatch-mode",
        choices=["auto", "klp", "ebpf", "both"],
        default="auto",
        help="Open-source kernel livepatch backend mode (default: auto)",
    )
    p.add_argument(
        "--disruptive", "--disruptive-auto-reboot",
        dest="disruptive_auto_reboot",
        action="store_true",
        default=False,
        help="Enable disruptive (reboot-required) patching with auto-reboot during maintenance window",
    )
    p.add_argument(
        "--window", "--off-peak-window",
        dest="off_peak_window",
        default="02:00-05:00",
        help="Maintenance / off-peak timeframe (e.g. '02:00-05:00' or 'Sat 01:00-05:00, Sun 01:00-05:00')",
    )
    p.add_argument(
        "--deferred-windows",
        dest="deferred_windows",
        default=None,
        help="Comma-separated deferred maintenance windows for disruptive patching",
    )
    p.add_argument(
        "--defer-until",
        dest="defer_until",
        default=None,
        help="Defer all disruptive patching until the specified ISO-8601 timestamp",
    )
    p.add_argument(
        "--fullauto",
        action="store_true",
        default=False,
        help="Dynamically determine when to patch based on host/HA load and gracefully proceed (requires --confirm)",
    )
    p.add_argument(
        "--confirm",
        action="store_true",
        default=False,
        help="Mandatory secondary confirmation argument required with --fullauto",
    )
    p.add_argument(
        "--dry-run",
        action="store_true",
        default=False,
        help="Simulate operations without modifying system state",
    )


def build_parser() -> argparse.ArgumentParser:
    common_parser = argparse.ArgumentParser(add_help=False)
    common_parser.add_argument("--state-dir", help="Custom state and snapshot directory", default=None)
    common_parser.add_argument("--staging-dir", help="Custom local staging directory for OS patches", default=None)
    common_parser.add_argument("--json", action="store_true", help="Output results in JSON format")

    invoked_as = Path(sys.argv[0]).stem.lower() if sys.argv else "exultia"
    prog_name = "xul" if invoked_as == "xul" else "exultia"

    parser = argparse.ArgumentParser(
        prog=prog_name,
        parents=[common_parser],
        description=(
            "Exultia (shorthand: `xul`): Unified Autonomous Patching, Vendor-Native Security Updater, "
            "Open-Source Kernel Livepatcher, Threat Feed Engine, Remediation Compiler & Drift Sentinel.\n\n"
            "Examples:\n"
            "  exultia daemon --non-reboot --vendor --livepatch --disruptive --window '02:00-05:00'\n"
            "  xul --daemon --fullauto --confirm\n"
            "  xul --patch --non-reboot --vendor --livepatch\n"
            "  xul --livepatch --cve CVE-2024-1086\n"
            "  xul --audit | xul --fix | xul --status | xul --rollback --latest"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--version", action="version", version=f"exultia (xul) {__version__}")

    subparsers = parser.add_subparsers(dest="command", help="Unified Exultia / xul command modes")

    # 1. Command: daemon (`exultia daemon` or `xul --daemon`)
    daemon_parser = subparsers.add_parser(
        "daemon",
        parents=[common_parser],
        help="Run the unified autonomous Exultia daemon (feeds, vendor updates, kernel livepatching, scheduling, webhook, HA fullauto)",
    )
    _add_shared_patch_and_daemon_flags(daemon_parser, is_daemon=True)
    daemon_parser.add_argument("--once", action="store_true", default=False, help="Run a single synchronization and patching cycle then exit")
    daemon_parser.add_argument("--interval", type=int, default=3600, help="Daemon poll interval in seconds (default: 3600)")
    daemon_parser.add_argument("--feed-url", default="https://exultia.tech/api/patches/feed", help="Hotfix threat feed URL")
    daemon_parser.add_argument("--argent-feed-url", default="https://exultia.tech/api/argent/feed?format=kinetic", help="Argent OS patch feed URL")
    daemon_parser.add_argument("--token", help="Exultia authorization token")
    daemon_parser.add_argument("--ring", type=int, choices=[0, 1, 2], default=0, help="Rollout ring (0=Canary, 1=Cautious, 2=Broad)")
    daemon_parser.add_argument(
        "--scheduler", "--enable-scheduler",
        dest="enable_scheduler",
        choices=["auto", "systemd", "cron", "both", "none"],
        default=None,
        help="Configure automatic update scheduling via systemd timers and/or crontabs",
    )
    daemon_parser.add_argument(
        "--cron", "--schedule-cron",
        dest="schedule_cron",
        default="0 * * * *",
        help="Cron expression when configuring crontab scheduling (default: '0 * * * *')",
    )
    daemon_parser.add_argument(
        "--webhook", "--webhook-listen",
        dest="webhook_listen",
        action="store_true",
        default=False,
        help="Enable enterprise HTTP webhook listener for external patch consoles",
    )
    daemon_parser.add_argument("--webhook-host", default="127.0.0.1", help="Webhook bind address (default: 127.0.0.1)")
    daemon_parser.add_argument("--webhook-port", type=int, default=8765, help="Webhook TCP port (default: 8765)")
    daemon_parser.add_argument("--webhook-secret", default=None, help="Shared Bearer/HMAC secret for webhook authentication")
    daemon_parser.add_argument("--drain-grace-seconds", type=int, default=0, help="Grace period in seconds after HA pre-patch drain hook")
    daemon_parser.add_argument("--pre-patch-hook", default=None, help="Pre-patch drain command for --fullauto HA mode")
    daemon_parser.add_argument("--post-patch-hook", default=None, help="Post-patch uncordon command for --fullauto HA mode")
    daemon_parser.add_argument("--revert-drift", dest="revert_drift", action="store_true", default=True, help="Auto-reconcile SOX/PCI configuration drift (default: enabled)")
    daemon_parser.add_argument("--no-revert-drift", dest="revert_drift", action="store_false", help="Disable automatic drift reversion")
    daemon_parser.add_argument("--compliance-mode", choices=["sox_pci", "pci", "sox", "strict"], default="sox_pci", help="Compliance baseline standard (default: sox_pci)")

    # 2. Command: patch (`exultia patch` / `xul --patch`, with legacy aliases `upgrade` and `apply`)
    for cmd_name, default_feed in [
        ("patch", "https://exultia.tech/api/argent/feed?format=kinetic"),
        ("upgrade", "https://exultia.tech/api/argent/feed?format=kinetic"),
        ("apply", "https://exultia.tech/api/patches/feed"),
    ]:
        p_parser = subparsers.add_parser(
            cmd_name,
            parents=[common_parser],
            help="Stage and deploy OS patches, hot-mitigations, vendor security updates, and kernel livepatches",
        )
        _add_shared_patch_and_daemon_flags(p_parser, is_daemon=False)
        p_parser.add_argument("--cve", help="Specific CVE ID to mitigate (e.g. CVE-2024-3094)")
        p_parser.add_argument("--bundle", help="Specific OS advisory bundle ID (e.g. RLSA-2024:4312 or ARG-UBUNTU-UPD-2024-0412)")
        p_parser.add_argument("--feed-url", default=default_feed, help="Patch feed URL")
        p_parser.add_argument("--token", help="Authorization token")

    # 3. Command: livepatch (`exultia livepatch` / `xul --livepatch`)
    lp_parser = subparsers.add_parser(
        "livepatch",
        parents=[common_parser],
        help="Manage open-source zero-reboot Linux kernel livepatches (CONFIG_LIVEPATCH / kpatch + eBPF CO-RE)",
    )
    lp_parser.add_argument("action", choices=["probe", "apply", "unload", "status"], default="status", nargs="?", help="Action: probe, apply, unload, or status")
    lp_parser.add_argument("--cve", default=None, help="Specific kernel CVE ID or livepatch ID (e.g. CVE-2024-1086)")
    lp_parser.add_argument("--mode", choices=["auto", "klp", "ebpf", "both"], default="auto", help="Livepatch backend mode (default: auto)")
    lp_parser.add_argument("--compile-klp", action="store_true", default=False, help="Compile CONFIG_LIVEPATCH C module against kernel headers if present")
    lp_parser.add_argument("--dry-run", action="store_true", default=False, help="Simulate kernel livepatch operation")

    # 4. Commands: audit, fix, drift (`exultia audit`, `exultia fix`, `exultia drift`)
    drift_parser = subparsers.add_parser("drift", parents=[common_parser], help="Audit and reconcile SOX/PCI-DSS configuration drift")
    drift_parser.add_argument("action", choices=["audit", "revert", "fix"], default="audit", nargs="?", help="Action: audit or fix/revert")
    drift_parser.add_argument("--compliance-mode", choices=["sox_pci", "pci", "sox", "strict"], default="sox_pci", help="Compliance baseline")
    drift_parser.add_argument("--dry-run", action="store_true", default=False, help="Simulate drift remediation")

    audit_parser = subparsers.add_parser("audit", parents=[common_parser], help="Run full SOX/PCI-DSS host configuration & compliance audit")
    audit_parser.add_argument("--compliance-mode", choices=["sox_pci", "pci", "sox", "strict"], default="sox_pci", help="Compliance baseline")

    fix_parser = subparsers.add_parser("fix", parents=[common_parser], help="Automatically remediate configuration drift back to compliant baseline")
    fix_parser.add_argument("--compliance-mode", choices=["sox_pci", "pci", "sox", "strict"], default="sox_pci", help="Compliance baseline")
    fix_parser.add_argument("--dry-run", action="store_true", default=False, help="Simulate remediation")

    # 5. Command: compile (`exultia compile` / `xul --compile`)
    compile_parser = subparsers.add_parser(
        "compile",
        parents=[common_parser],
        help="Compile a CVE advisory into a hardened POSIX hotfix script or serialized Canary Ansible playbook",
    )
    compile_parser.add_argument("--cve", default="CVE-2024-6387", help="Target CVE ID to compile (default: CVE-2024-6387)")
    compile_parser.add_argument("--format", choices=["both", "posix", "ansible"], default="both", help="Output artifact format (default: both)")
    compile_parser.add_argument("--feed-url", default="https://exultia.tech/api/patches/feed", help="Threat feed URL")

    # 6. Command: feed (`exultia feed` / `xul --feed` / `xul --search`)
    feed_parser = subparsers.add_parser(
        "feed",
        parents=[common_parser],
        help="Search and inspect the unified Exultia threat & OS errata feeds",
    )
    feed_parser.add_argument("--search", default=None, help="Keyword to search across CVEs, packages, and OS advisories")
    feed_parser.add_argument("--cve", default=None, help="Filter by specific CVE or advisory ID")
    feed_parser.add_argument("--os", default=None, help="Filter by OS distribution")
    feed_parser.add_argument("--status", action="store_true", default=False, help="Show upstream feed connectivity and sync status")
    feed_parser.add_argument("--feed-url", default="https://exultia.tech/api/patches/feed", help="Hotfix feed URL")
    feed_parser.add_argument("--argent-feed-url", default="https://exultia.tech/api/argent/feed?format=kinetic", help="Argent OS feed URL")

    # 7. Command: rollback (`exultia rollback` / `xul --rollback`)
    rollback_parser = subparsers.add_parser("rollback", parents=[common_parser], help="Execute sub-second deterministic rollback")
    rollback_parser.add_argument("--cve", help="Specific CVE or bundle ID to roll back")
    rollback_parser.add_argument("--latest", action="store_true", help="Roll back the most recently applied patch or livepatch")

    # 8. Command: schedule (`exultia schedule` / `xul --schedule`)
    schedule_parser = subparsers.add_parser("schedule", parents=[common_parser], help="Configure systemd timers and crontabs for autonomous patching")
    schedule_parser.add_argument("--mode", choices=["auto", "systemd", "cron", "both"], default="auto", help="Scheduler backend (default: auto)")
    schedule_parser.add_argument("--cron", default="0 * * * *", help="Cron expression (default: '0 * * * *')")
    schedule_parser.add_argument(
        "--window", "--deferred-window",
        dest="deferred_window",
        default="02:00-05:00",
        help="Deferred maintenance window for disruptive patching (default: '02:00-05:00')",
    )
    schedule_parser.add_argument("--os", help="Target OS distribution override")
    schedule_parser.add_argument("--dry-run", action="store_true", default=False, help="Simulate scheduler installation")

    # 9. Command: webhook (`exultia webhook` / `xul --webhook`)
    webhook_parser = subparsers.add_parser("webhook", parents=[common_parser], help="Start HTTP webhook listener for enterprise patch consoles")
    webhook_parser.add_argument("--host", default="127.0.0.1", help="Bind address (default: 127.0.0.1)")
    webhook_parser.add_argument("--port", type=int, default=8765, help="TCP port (default: 8765)")
    webhook_parser.add_argument("--secret", default=None, help="Shared Bearer/HMAC secret")
    webhook_parser.add_argument("--os", default=None, help="Target OS override")
    webhook_parser.add_argument("--dry-run", action="store_true", default=False, help="Simulate webhook-triggered actions")

    # 10. Command: status (`exultia status` / `xul --status`)
    status_parser = subparsers.add_parser("status", parents=[common_parser], help="Inspect unified Exultia host status, livepatches, staged patches, and snapshots")
    status_parser.add_argument("--audit", action="store_true", help="Include recent audit trail")

    # 11. Command: verify (`exultia verify` / `xul --verify`)
    verify_parser = subparsers.add_parser("verify", parents=[common_parser], help="Verify SLSA Level 3 cryptographic provenance")
    verify_parser.add_argument("--cve", help="CVE ID to verify")
    verify_parser.add_argument("--feed-url", default="https://exultia.tech/api/patches/feed", help="Patch feed URL")

    # 12. Command: test (`exultia test` / `xul --test`)
    subparsers.add_parser("test", parents=[common_parser], help="Run self-contained end-to-end simulation and rollback verification")

    return parser


def run_self_test(engine: KineticEngine) -> bool:
    """
    Self-contained verification of atomic snapshotting and sub-second deterministic rollback.
    """
    print("\n[Exultia Test] --- Running End-to-End Self-Validation Suite ---")
    test_file = engine.base_dir / "test_target.conf"
    initial_content = "ORIGINAL_PRE_IMAGE_CONFIGURATION_V1=ENABLED\nMAX_CONNS=100\n"
    test_file.write_text(initial_content, encoding="utf-8")
    initial_sha = engine.create_file_snapshot(str(test_file), "CVE-TEST-0001")

    print(f"[Exultia Test] 1. Baseline Target Created: {test_file}")
    print(f"[Exultia Test]    Initial SHA-256: {initial_sha[1] if initial_sha else 'ERR'}")

    mutated_content = "ORIGINAL_PRE_IMAGE_CONFIGURATION_V1=ENABLED\nMAX_CONNS=100\n# EXULTIA HOTFIX\nPROTECTION_MODE=STRICT\n"
    test_file.write_text(mutated_content, encoding="utf-8")
    print("[Exultia Test] 2. Applied Synthetic Mitigation Mutation")

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

    print("[Exultia Test] 3. Executing Sub-Second Deterministic Rollback...")
    rb_success = engine.rollback_patch(cve_id="CVE-TEST-0001")
    latency = (time.time() - t0) * 1000

    restored_content = test_file.read_text(encoding="utf-8")
    matches = (restored_content == initial_content)

    print(f"[Exultia Test] 4. Post-Rollback Content Integrity Match: {'PASS' if matches else 'FAIL'}")
    print(f"[Exultia Test]    Rollback Latency: {latency:.2f}ms (Sub-second guaranteed: {'YES' if latency < 1000 else 'NO'})")

    try:
        test_file.unlink(missing_ok=True)
    except Exception:
        pass

    if rb_success and matches and latency < 1000:
        print("[Exultia Test] [OK] All Self-Validation Gates Passed Successfully!\n")
        return True
    else:
        print("[Exultia Test] [FAIL] Validation Failed!\n")
        return False


def _run_drift_command(engine: KineticEngine, action: str, compliance_mode: str, dry_run: bool, as_json: bool) -> None:
    manager = ComplianceDriftManager(
        state_dir=str(engine.base_dir),
        baseline_mode=compliance_mode
    )
    if action == "audit":
        findings = manager.audit()
        if as_json:
            print(json.dumps([f.to_dict() for f in findings], indent=2))
        else:
            print("\n=================================================")
            print(f"  EXULTIA CONFIGURATION DRIFT AUDIT ({compliance_mode.upper()} BASELINE)")
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
                print("    exultia fix   (or: xul --fix)\n")
    else:
        print(f"\n[Exultia Drift Sentinel] Reconciling configuration drift against {compliance_mode.upper()} baseline...")
        results = manager.revert_drift(
            dry_run=dry_run,
            snapshot_engine=engine
        )
        if as_json:
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
                print(f"\n[Exultia Drift Sentinel] Successfully reconciled {reverted_count}/{len(results)} controls to baseline.\n")


def cli_entry(raw_argv: Optional[List[str]] = None):
    parser = build_parser()
    normalized = normalize_cli_argv(sys.argv[1:] if raw_argv is None else raw_argv)
    args = parser.parse_args(normalized)

    if not args.command:
        parser.print_help()
        sys.exit(0)

    engine = KineticEngine(state_dir=args.state_dir, staging_dir=args.staging_dir)

    if args.command == "apply" or (args.command == "patch" and getattr(args, "cve", None) and not (
        args.auto_patch_non_reboot or args.vendor_native or args.kernel_livepatch or args.disruptive_auto_reboot or args.fullauto
    )):
        patches = engine.fetch_feed(
            feed_url=args.feed_url,
            token=args.token,
            os_distro=args.os
        )

        if args.cve:
            patches = [p for p in patches if p.cve_id.upper() == args.cve.upper()]
            if not patches:
                print(f"[Exultia] Advisory {args.cve} not found in patch feed.")
                sys.exit(1)

        applied = 0
        for p in patches:
            if engine.apply_patch(p, dry_run=args.dry_run):
                applied += 1

        print(f"\n[Exultia] Completed. Applied {applied}/{len(patches)} hot-mitigations.")
        sys.exit(0 if applied > 0 or len(patches) == 0 else 1)

    elif args.command in ("patch", "upgrade"):
        if args.fullauto:
            if not args.confirm:
                sys.stderr.write(
                    "[Exultia Error] --fullauto requires secondary confirmation flag --confirm "
                    "(e.g., `exultia patch --fullauto --confirm` or `xul --fullauto --confirm`).\n"
                )
                sys.exit(2)
            fa_res = engine.execute_fullauto_cycle(
                confirm=True,
                os_filter=args.os,
                argent_feed_url=args.feed_url,
                dry_run=args.dry_run,
            )
            if args.json:
                print(json.dumps(fa_res, indent=2))
            sys.exit(0)

        deferred_list = (
            [w.strip() for w in args.deferred_windows.split(",") if w.strip()]
            if getattr(args, "deferred_windows", None)
            else None
        )

        if (
            args.stage_only
            or args.auto_stage_patches
            or args.auto_patch_non_reboot
            or args.disruptive_auto_reboot
            or args.vendor_native
            or args.kernel_livepatch
            or deferred_list
            or getattr(args, "defer_until", None)
        ):
            staged = engine.stage_os_patches(
                os_filter=args.os,
                feed_url=args.feed_url
            )
            if (args.stage_only or args.auto_stage_patches) and not (
                args.auto_patch_non_reboot
                or args.disruptive_auto_reboot
                or args.vendor_native
                or args.kernel_livepatch
            ):
                if args.json:
                    print(json.dumps([s.to_dict() for s in staged], indent=2))
                sys.exit(0)

            summary = engine.execute_staged_patch_policy(
                os_filter=args.os,
                auto_patch_non_reboot=args.auto_patch_non_reboot,
                disruptive_auto_reboot=args.disruptive_auto_reboot,
                off_peak_window=args.off_peak_window,
                deferred_windows=deferred_list,
                defer_disruptive_until=getattr(args, "defer_until", None),
                vendor_native_updates=args.vendor_native,
                kernel_livepatch=args.kernel_livepatch,
                kernel_livepatch_mode=args.livepatch_mode,
                feed_url=args.feed_url,
                dry_run=args.dry_run
            )
            if args.json:
                print(json.dumps(summary, indent=2))
            sys.exit(0)

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
        if args.fullauto and not args.confirm:
            sys.stderr.write(
                "[Exultia Error] --fullauto mode requires the secondary confirmation argument --confirm "
                "(usage: `exultia daemon --fullauto --confirm` or `xul --daemon --fullauto --confirm`).\n"
            )
            sys.exit(2)

        deferred_list = (
            [w.strip() for w in args.deferred_windows.split(",") if w.strip()]
            if args.deferred_windows
            else None
        )

        daemon = KineticDaemon(
            engine=engine,
            feed_url=args.feed_url,
            argent_feed_url=args.argent_feed_url,
            token=args.token,
            interval=args.interval,
            ring=args.ring,
            revert_drift=args.revert_drift,
            compliance_mode=args.compliance_mode,
            os_distro=args.os,
            staging_dir=args.staging_dir,
            auto_stage_patches=args.auto_stage_patches,
            auto_patch_non_reboot=args.auto_patch_non_reboot,
            disruptive_auto_reboot=args.disruptive_auto_reboot,
            off_peak_window=args.off_peak_window,
            deferred_windows=deferred_list,
            defer_disruptive_until=args.defer_until,
            vendor_native_updates=args.vendor_native,
            kernel_livepatch=args.kernel_livepatch,
            kernel_livepatch_mode=args.livepatch_mode,
            enable_scheduler=args.enable_scheduler,
            schedule_cron=args.schedule_cron,
            webhook_listen=args.webhook_listen,
            webhook_host=args.webhook_host,
            webhook_port=args.webhook_port,
            webhook_secret=args.webhook_secret,
            fullauto=args.fullauto,
            confirm=args.confirm,
            drain_grace_seconds=args.drain_grace_seconds,
            pre_patch_hook=args.pre_patch_hook,
            post_patch_hook=args.post_patch_hook,
            dry_run=args.dry_run
        )
        if args.once:
            total = daemon.run_once()
            if args.json:
                print(json.dumps({
                    "once": True,
                    "total_actions": total,
                    "patch_management_summary": daemon.last_patch_management_summary,
                    "fullauto_summary": daemon.last_fullauto_summary,
                    "scheduler_summary": daemon.last_scheduler_summary,
                }, indent=2))
            sys.exit(0)
        daemon.start()

    elif args.command == "schedule":
        res = engine.configure_system_scheduler(
            mode=args.mode,
            sync_cron=args.cron,
            deferred_window=args.deferred_window,
            enable_vendor_native_timer=True,
            os_filter=args.os,
            dry_run=args.dry_run,
        )
        if args.json:
            print(json.dumps(res, indent=2))
        else:
            print(f"[Exultia Scheduler] Configured {res['mode']} scheduler for OS '{res['target_os']}':")
            for f in res["installed_files"]:
                print(f"  • Installed: {f}")
        sys.exit(0)

    elif args.command == "webhook":
        listener = KineticWebhookListener(
            engine=engine,
            host=args.host,
            port=args.port,
            secret=args.secret,
            os_filter=args.os,
            dry_run=args.dry_run,
        )
        listener.serve_forever()

    elif args.command == "livepatch":
        if args.action == "probe":
            caps = engine.probe_kernel_livepatch_capabilities()
            if args.json:
                print(json.dumps(caps, indent=2))
            else:
                print(f"[Exultia Kernel Livepatch] Host Kernel: {caps['kernel_release']} ({caps['architecture']})")
                print(f"  • CONFIG_LIVEPATCH (/sys/kernel/livepatch): {caps['config_livepatch_supported']}")
                print(f"  • BTF / eBPF CO-RE (/sys/kernel/btf/vmlinux): {caps['btf_ebpf_core_supported']}")
                print(f"  • kprobes (/sys/kernel/tracing/kprobe_events): {caps['kprobes_supported']}")
                print(f"  • Recommended Non-Commercial Backend: {caps['recommended_backend']}")
            sys.exit(0)
        elif args.action == "apply":
            res = engine.apply_kernel_livepatches(
                cve_filter=args.cve,
                mode=args.mode,
                compile_klp=args.compile_klp,
                dry_run=args.dry_run,
            )
            if args.json:
                print(json.dumps(res, indent=2))
            sys.exit(0)
        elif args.action == "unload":
            if not args.cve:
                sys.stderr.write("[Exultia Error] Please specify --cve=<CVE_ID> to unload a kernel livepatch.\n")
                sys.exit(2)
            ok = engine.unload_kernel_livepatch(cve_id=args.cve, dry_run=args.dry_run)
            if args.json:
                print(json.dumps({"unloaded": ok, "cve_id": args.cve}, indent=2))
            sys.exit(0 if ok else 1)
        else:
            active = engine.livepatch_engine.get_active_livepatches()
            caps = engine.probe_kernel_livepatch_capabilities()
            payload = {"capabilities": caps, "active_livepatches": active}
            if args.json:
                print(json.dumps(payload, indent=2))
            else:
                print(f"[Exultia Kernel Livepatch] Active In-Memory Kernel Livepatches: {len(active)}")
                for item in active:
                    print(f"  • {item['livepatch_id']} ({item['cve_id']}) -> symbol `{item['target_symbol']}` [{item['status']}]")
            sys.exit(0)

    elif args.command == "drift":
        _run_drift_command(engine, args.action, args.compliance_mode, args.dry_run, args.json)

    elif args.command == "audit":
        _run_drift_command(engine, "audit", args.compliance_mode, True, args.json)

    elif args.command == "fix":
        _run_drift_command(engine, "fix", args.compliance_mode, args.dry_run, args.json)

    elif args.command == "compile":
        compiled = engine.compile_remediation_artifact(
            cve_id=args.cve,
            output_format=args.format,
            feed_url=args.feed_url,
        )
        if args.json:
            print(json.dumps(compiled, indent=2))
        else:
            print(f"\n[Exultia Compiler] Compiled Remediation Artifacts for {compiled['cve_id']} — {compiled['title']}")
            if compiled.get("posix_script"):
                print("\n--- Standalone POSIX Hotfix Script ---")
                print(compiled["posix_script"])
            if compiled.get("ansible_playbook"):
                print("\n--- Serialized 10% Canary Ansible Playbook ---")
                print(compiled["ansible_playbook"])
        sys.exit(0)

    elif args.command == "feed":
        res = engine.query_unified_feed(
            search=args.search,
            cve_id=args.cve,
            os_filter=args.os,
            feed_url=args.feed_url,
            argent_feed_url=args.argent_feed_url,
        )
        if args.json:
            print(json.dumps(res, indent=2))
        else:
            print(f"\n[Exultia Feed] Query='{res['query']}' | Matches: {res['total_matches']}")
            for item in res["items"][:15]:
                reboot_tag = "REBOOT-REQ" if item["requires_reboot"] else "ZERO-REBOOT"
                print(f"  • [{item['id']}] ({item['severity']} | {reboot_tag}) {item['title']}")
        sys.exit(0)

    elif args.command == "status":
        info = engine.status()
        if args.json:
            print(json.dumps(info, indent=2))
        else:
            policy = info.get("patch_policy", {})
            print("\n=================================================")
            print(f"  EXULTIA UNIFIED HOST STATUS (v{info['kinetic_version']})")
            print("=================================================")
            print(f"  Host Platform:      {info['host_os']} (distro: {info.get('detected_distro', 'linux')})")
            print(f"  State Directory:    {info['state_directory']}")
            print(f"  Staging Directory:  {info.get('staging_directory', 'N/A')}")
            print(f"  Active Hotfixes:    {info['active_hotfixes_count']}")
            print(f"  Kernel Livepatches: {info.get('active_kernel_livepatches_count', 0)}")
            print(f"  Staged OS Patches:  {info.get('staged_patches_count', 0)} (deferred off-peak: {info.get('deferred_off_peak_count', 0)})")
            print(f"  Rolled Back Patches:{info['rolled_back_count']}")
            print(f"  Total Snapshots:    {info['total_snapshots']}")
            print("-------------------------------------------------")
            print("  Unified Daemon Policy:")
            print(f"    • Auto-Stage OS Patches:     {'ENABLED' if policy.get('auto_stage_patches', True) else 'DISABLED'}")
            print(f"    • Vendor Built-in Updates:   {'ENABLED' if policy.get('vendor_native_updates', False) else 'DISABLED'}")
            print(f"    • Kernel Livepatching:       {'ENABLED' if policy.get('kernel_livepatch_enabled', False) else 'DISABLED'} ({policy.get('kernel_livepatch_mode', 'auto')})")
            print(f"    • Auto-Patch Non-Reboot:     {'ENABLED' if policy.get('auto_patch_non_reboot', False) else 'DISABLED'}")
            print(f"    • Disruptive Auto-Reboot:    {'ENABLED' if policy.get('disruptive_auto_reboot', False) else 'DISABLED'}")
            print(f"    • Maintenance Window:        {policy.get('off_peak_window', '02:00-05:00')}")
            print(f"    • Scheduler Mode:            {policy.get('scheduler_mode', 'systemd')}")
            print(f"    • Enterprise Webhook Mode:   {'ENABLED' if policy.get('webhook_enabled', False) else 'DISABLED'}")
            print(f"    • FullAuto HA Mode:          {'ACTIVE (--confirm)' if policy.get('fullauto_confirmed', False) else 'DISABLED'}")
            print("-------------------------------------------------")
            if info['active_hotfixes']:
                print("  Active Hotfixes:")
                for h in info['active_hotfixes']:
                    print(f"    • {h['cve_id']}: {h['target']} (applied {h['applied_at']})")
            else:
                print("  No active hotfixes applied. Host at clean baseline.")

            if info.get("staged_patches"):
                print("\n  Local Staged OS Patches:")
                for sp in info["staged_patches"]:
                    reboot_flag = "REBOOT-REQUIRED" if sp.get("requires_reboot") else "NON-REBOOT"
                    print(f"    • {sp['patch_id']} [{sp['os_distro']}] ({reboot_flag}) -> {sp['status']} | {sp['local_bundle_path']}")

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
        print("\n[Exultia] ─── Verifying SLSA Level 3 Cryptographic Provenance ───")
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


def main():
    cli_entry()


if __name__ == "__main__":
    cli_entry()
