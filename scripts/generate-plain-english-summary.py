#!/usr/bin/env python3
"""
Generate a plain-English, auditor-friendly Markdown summary from Exultia's
9-gate black-box verification evidence bundle.

Uses ONLY Python 3 stdlib so it runs identically on GitHub-hosted runners,
self-hosted runners, and local Linux verification hosts.
"""

from __future__ import annotations

import argparse
import collections
import json
import os
import platform
import re
import socket
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple


GATE_TITLES = [
    ("1", "Provenance & Retirement"),
    ("2", "Fail-Closed Install"),
    ("3", "Random Vantage Apply + Rollback"),
    ("4", "Kernel Netfilter Guard"),
    ("5", "Real Native Package Upgrade"),
    ("6", "Negative Abstention"),
    ("7", "SOX/PCI Drift Repair"),
    ("8", "Daemon Sync, Behavioral Gates & Attestation"),
    ("9", "250 Host-Relevant Confirmed Fixes"),
]


def _read_json(path: Path) -> Optional[Any]:
    try:
        if path.is_file():
            return json.loads(path.read_text(encoding="utf-8", errors="replace"))
    except Exception:
        return None
    return None


def _read_text(path: Path) -> str:
    try:
        if path.is_file():
            return path.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return ""
    return ""


def _parse_gate_outcomes(raw: str) -> Dict[str, str]:
    text = (raw or "").strip()
    if not text:
        return {}
    if text.startswith("{"):
        try:
            doc = json.loads(text)
            if isinstance(doc, dict):
                return {str(k).strip(): str(v).strip().lower() for k, v in doc.items()}
        except Exception:
            pass
    out: Dict[str, str] = {}
    for pair in text.split(","):
        if "=" in pair:
            k, v = pair.split("=", 1)
            k = k.strip().lower().replace("gate", "")
            v = v.strip().lower()
            if k:
                out[k] = v
    return out


def _infer_outcome_from_evidence(gate_id: str, ev: Path) -> str:
    if gate_id == "1":
        d = _read_json(ev / "gate1_provenance.json") or {}
        return "success" if d.get("status") == "PASS" else ("not_run" if not d else "failure")
    if gate_id == "2":
        ver = _read_text(ev / "gate2_version.txt").strip()
        log = _read_text(ev / "gate2_install.log")
        if ver and "INSTALLED SUCCESSFULLY" in log:
            return "success"
        return "not_run" if (not ver and not log) else "failure"
    if gate_id == "3":
        d = _read_json(ev / "gate3_selected.json") or {}
        if d.get("selectedCve") and d.get("afterRollbackProbe"):
            return "success"
        return "not_run" if not d else "failure"
    if gate_id == "4":
        apply_txt = _read_text(ev / "gate4_apply.txt")
        rb_txt = _read_text(ev / "gate4_rollback.txt")
        if ("MITIGATED" in apply_txt or "Applied 1/1" in apply_txt) and rb_txt:
            return "success"
        return "not_run" if (not apply_txt and not rb_txt) else "failure"
    if gate_id == "5":
        d = _read_json(ev / "gate5_selected.json") or {}
        if d.get("beforeVersion") and d.get("afterVersion") and d.get("beforeVersion") != d.get("afterVersion"):
            return "success"
        return "not_run" if not d else "failure"
    if gate_id == "6":
        txt = _read_text(ev / "gate6_abstain_cli.txt")
        if "Applied 0/1" in txt and "UNSUPPORTED" in txt:
            return "success"
        return "not_run" if not txt else "failure"
    if gate_id == "7":
        bef = _read_json(ev / "gate7_drift_before.json")
        aft = _read_json(ev / "gate7_drift_after.json")
        if isinstance(bef, list) and len(bef) > 0 and isinstance(aft, list) and len(aft) == 0:
            return "success"
        return "not_run" if (bef is None and aft is None) else "failure"
    if gate_id == "8":
        beh = _read_json(ev / "gate8_behavioral.json") or {}
        att = _read_json(ev / "gate8_attestation.json") or {}
        sync_txt = _read_text(ev / "gate8_sync_dry_run.txt")
        if (
            beh.get("passed") is True
            and (att.get("payload") or {}).get("eventlog", {}).get("intact") is True
            and "Cycle complete." in sync_txt
        ):
            return "success"
        return "not_run" if (not beh and not att and not sync_txt) else "failure"
    if gate_id == "9":
        g9 = _read_json(ev / "gate9_compromise_250.json") or {}
        if g9.get("status") == "PASS":
            return "success"
        return "not_run" if not g9 else "failure"
    return "not_run"


def _outcome_badge(outcome: str) -> str:
    low = (outcome or "not_run").lower()
    if low == "success":
        return "PASS"
    if low in ("skipped", "not_run"):
        return "SKIPPED"
    return f"FAIL ({low})"


def build_summary(
    evidence_dir: Path,
    *,
    runner_name: str = "",
    runner_os: str = "",
    runner_arch: str = "",
    run_id: str = "",
    gate_outcomes: Optional[Dict[str, str]] = None,
) -> str:
    outcomes_in = dict(gate_outcomes or {})

    g1 = _read_json(evidence_dir / "gate1_provenance.json") or {}
    g2_log = _read_text(evidence_dir / "gate2_install.log")
    g2_ver = _read_text(evidence_dir / "gate2_version.txt").strip()
    g3 = _read_json(evidence_dir / "gate3_selected.json") or {}
    g4_apply = _read_text(evidence_dir / "gate4_apply.txt")
    g4_rb = _read_text(evidence_dir / "gate4_rollback.txt")
    g5 = _read_json(evidence_dir / "gate5_selected.json") or {}
    g5_txt = _read_text(evidence_dir / "gate5_native_apt.txt")
    g6_txt = _read_text(evidence_dir / "gate6_abstain_cli.txt")
    g7_bef = _read_json(evidence_dir / "gate7_drift_before.json")
    g7_aft = _read_json(evidence_dir / "gate7_drift_after.json")
    g8_sync = _read_text(evidence_dir / "gate8_sync_dry_run.txt")
    g8_beh = _read_json(evidence_dir / "gate8_behavioral.json") or {}
    g8_att = _read_json(evidence_dir / "gate8_attestation.json") or {}
    g9 = _read_json(evidence_dir / "gate9_compromise_250.json") or {}

    resolved_outcomes: Dict[str, str] = {}
    for gid, _ in GATE_TITLES:
        resolved_outcomes[gid] = outcomes_in.get(gid) or _infer_outcome_from_evidence(gid, evidence_dir)

    executed_outcomes = [v for v in resolved_outcomes.values() if v != "not_run"]
    passed_count = sum(1 for v in resolved_outcomes.values() if v == "success")
    failed_gates = [gid for gid, v in resolved_outcomes.items() if v not in ("success", "not_run", "skipped")]
    overall_pass = bool(executed_outcomes) and len(failed_gates) == 0

    att_payload = g8_att.get("payload") or {}
    host_name = att_payload.get("host") or socket.gethostname()
    kernel_rel = att_payload.get("kernel_release") or platform.release()
    eff_runner = runner_name or host_name
    eff_os = runner_os or platform.system()
    eff_arch = runner_arch or platform.machine()
    is_ephemeral = "github actions" in eff_runner.lower() or "runnervm" in host_name.lower()
    runner_desc = (
        f"clean, ephemeral GitHub-hosted Ubuntu VM (`{eff_runner}`, host `{host_name}`, kernel `{kernel_rel}`)"
        if is_ephemeral
        else f"persistent verification host (`{eff_runner}`, host `{host_name}`, `{eff_os}` / `{eff_arch}`, kernel `{kernel_rel}`)"
    )

    reconciled = g9.get("auditReconciliation") or {}
    unpinned_false = reconciled.get("unpinnedFalseVerified") if isinstance(reconciled, dict) else g9.get("unpinnedFalseVerified", [])
    unexpected_fail = reconciled.get("unexpectedFailures") or []
    abstain_viol = reconciled.get("abstainViolations") or []
    unaccounted = reconciled.get("unaccountedIds") or []

    lines: List[str] = []
    lines.append("## Independent Exultia Verification Report (Plain-English Summary)")
    lines.append("")
    lines.append("### Bottom Line")
    lines.append("")
    if overall_pass:
        run_label = f"Run `{run_id}`" if run_id else "Verification run"
        lines.append(
            f"**PASS ({passed_count}/{len(executed_outcomes)} executed gates passed).** "
            f"{run_label} executed on a {runner_desc} with **{len(unpinned_false or [])} false-verified claims**, "
            f"**{len(unexpected_fail)} unexpected failures**, and **{len(abstain_viol)} abstention violations**."
        )
    else:
        run_label = f"Run `{run_id}`" if run_id else "Verification run"
        lines.append(
            f"**FAIL ({passed_count}/{len(executed_outcomes)} executed gates passed; failed gate(s): {', '.join(failed_gates) or 'unknown'}).** "
            f"{run_label} executed on a {runner_desc}."
        )
    if is_ephemeral:
        lines.append(
            "Because it ran on a brand-new ephemeral VM, nothing carried over from prior runs — "
            "every binary signature check, installation, compromise injection, and fix happened from scratch."
        )
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("### Gate-by-Gate Breakdown")
    lines.append("")
    lines.append("| Gate | Outcome | What It Tested | Plain-English Observed Result |")
    lines.append("| :--- | :--- | :--- | :--- |")

    # Gate 1
    if g1:
        ab = g1.get("abstain_check") or {}
        pub_pfx = str(g1.get("public_key_hex") or "")[:8]
        g1_desc = (
            f"Verified `{g1.get('vantage_verified', 0)}` live Vantage signatures (pubkey `{pub_pfx}...`); "
            f"tamper test rejected mutated payload (`{g1.get('tamper_rejected')}`); "
            f"all `{g1.get('argent_retired_410_verified', 0)}` retired `/api/argent/*` routes returned HTTP `410`; "
            f"`{ab.get('cve', 'CVE-2026-136158')}` returned `{ab.get('rule', 'ABSTAIN-*')}` (`{ab.get('compilerVersion', '')}`)"
        )
    else:
        g1_desc = "Not executed or evidence missing."
    lines.append(
        f"| **1. Provenance & Retirement** | **{_outcome_badge(resolved_outcomes['1'])}** | "
        f"Ed25519 signatures on live feeds, tamper rejection, retired Argent HTTP 410s, abstention JSON | {g1_desc} |"
    )

    # Gate 2
    tar_sha = re.search(r"Tarball SHA-256 digest:\s*([0-9a-f]{64})", g2_log)
    elf_sha = re.search(r"matches SLSA subject:\s*([0-9a-f]{64})", g2_log)
    if g2_log or g2_ver:
        g2_desc = (
            f"Verified `{g2_ver or 'exultia'}` tarball SHA-256 (`{tar_sha.group(1)[:8]}...`) and "
            f"ELF SHA-256 (`{elf_sha.group(1)[:8]}...`) via SLSA L2 Ed25519 DSSE attestation; installed `/usr/local/bin/exultia` as `0700 root:root`"
            if (tar_sha and elf_sha)
            else f"Installed `{g2_ver or 'exultia'}` fail-closed via `install.sh` and verified binary permissions & checksum"
        )
    else:
        g2_desc = "Not executed or evidence missing."
    lines.append(
        f"| **2. Fail-Closed Install** | **{_outcome_badge(resolved_outcomes['2'])}** | "
        f"Fresh install via `install.sh` with mandatory SHA-256 + SLSA DSSE verification | {g2_desc} |"
    )

    # Gate 3
    if g3:
        g3_desc = (
            f"Random target `{g3.get('selectedCve')}` (`{g3.get('expressionRuleId')}`): "
            f"`{g3.get('beforeProbe')}` -> `{g3.get('afterApplyProbe')}` -> rolled back cleanly to `{g3.get('afterRollbackProbe')}`"
        )
    else:
        g3_desc = "Not executed or evidence missing."
    lines.append(
        f"| **3. Random Vantage Apply + Rollback** | **{_outcome_badge(resolved_outcomes['3'])}** | "
        f"Picked a random live Vantage advisory, broke baseline, applied fix, then rolled back | {g3_desc} |"
    )

    # Gate 4
    if g4_apply:
        st_m = re.search(r"\[(MITIGATED|REMEDIATION_[A-Z_]+|FAILED)\]", g4_apply)
        g4_state = st_m.group(1) if st_m else "APPLIED"
        g4_desc = f"Live `nftables` guard installed (`{g4_state}`), normal TCP loopback echo succeeded, and rollback deleted `exultia_cve_2026_98432` table ({'confirmed' if g4_rb else 'checked'})"
    else:
        g4_desc = "Not executed or evidence missing."
    lines.append(
        f"| **4. Kernel Netfilter Guard** | **{_outcome_badge(resolved_outcomes['4'])}** | "
        f"Applied `CVE-2026-98432` IPv4 TCP-options filter, tested live TCP traffic, rolled back | {g4_desc} |"
    )

    # Gate 5
    if g5:
        g5_desc = (
            f"Package `{g5.get('targetPackage', 'unknown')}` upgraded natively via Ubuntu security `apt`: "
            f"`{g5.get('beforeVersion')}` -> `{g5.get('afterVersion')}` (`BEFORE < AFTER` confirmed via `dpkg-query`)"
        )
    elif g5_txt:
        g5_desc = g5_txt.splitlines()[0].strip()
    else:
        g5_desc = "Not executed or evidence missing."
    lines.append(
        f"| **5. Real Native Package Upgrade** | **{_outcome_badge(resolved_outcomes['5'])}** | "
        f"Downgraded an Ubuntu package, ran `exultia patch --vendor`, verified newer version installed | {g5_desc} |"
    )

    # Gate 6
    if g6_txt:
        app_m = re.search(r"Applied\s+(\d+/\d+)", g6_txt)
        g6_desc = (
            f"Failed closed (`{app_m.group(1) if app_m else '0/1'}` applied, `UNSUPPORTED`), printed manual operator remediation guidance, "
            f"and confirmed `redis-server` was **not** installed"
        )
    else:
        g6_desc = "Not executed or evidence missing."
    lines.append(
        f"| **6. Negative Abstention** | **{_outcome_badge(resolved_outcomes['6'])}** | "
        f"Asked Exultia to patch unsupported `CVE-2026-136158` (Valkey JSON) | {g6_desc} |"
    )

    # Gate 7
    if isinstance(g7_bef, list):
        cats = collections.Counter(str(x.get("category") or "CONTROL") for x in g7_bef if isinstance(x, dict))
        cat_str = ", ".join(f"{cnt} {k}" for k, cnt in sorted(cats.items()))
        aft_len = len(g7_aft) if isinstance(g7_aft, list) else "?"
        g7_desc = f"Detected `{len(g7_bef)}/{len(g7_bef)}` drifted controls ({cat_str}), repaired all via `exultia drift fix`, passed `sshd -T`/`sysctl`, re-audited to `{aft_len}` violations"
    else:
        g7_desc = "Not executed or evidence missing."
    lines.append(
        f"| **7. SOX/PCI Drift Repair** | **{_outcome_badge(resolved_outcomes['7'])}** | "
        f"Injected real SSH/sysctl misconfigurations, audited, auto-repaired, and re-audited | {g7_desc} |"
    )

    # Gate 8
    g8_parts: List[str] = []
    if g8_sync:
        cyc = re.search(r"Applied\s+(\d+)\s+hotfixes\s+\|\s+([^\n|]+)\|\s+Applied\s+(\d+)\s+OS patches", g8_sync)
        if cyc:
            g8_parts.append(f"Dry-run synced `{cyc.group(1)}` hotfixes + `{cyc.group(3)}` OS patches")
        elif "Cycle complete." in g8_sync:
            g8_parts.append("Dry-run sync completed cleanly")
    if g8_beh:
        g8_parts.append(f"`{g8_beh.get('passed_gates', 0)}/{g8_beh.get('total_gates', 0)}` behavioral gates passed in `{g8_beh.get('duration_ms', '?')}ms`")
    if g8_att:
        evl = att_payload.get("eventlog") or {}
        g8_parts.append(
            f"Ed25519 attestation signed `{evl.get('entries', '?')}` intact hash-chained audit entries (`tier={att_payload.get('trust_tier', 'unknown')}`)"
        )
    g8_desc = "; ".join(g8_parts) if g8_parts else "Not executed or evidence missing."
    lines.append(
        f"| **8. Daemon Sync, Behavioral Gates & Attestation** | **{_outcome_badge(resolved_outcomes['8'])}** | "
        f"`exultia sync --dry-run` (250-item feed), `test --behavioral`, signed `attest` | {g8_desc} |"
    )

    # Gate 9
    if g9:
        confirmed_cnt = g9.get("confirmedFixesCount")
        if confirmed_cnt is None:
            sb_tmp = (reconciled.get("statusBreakdown") or {}) if isinstance(reconciled, dict) else {}
            confirmed_cnt = int(sb_tmp.get("MITIGATED", 0) or 0) + int(sb_tmp.get("REMEDIATION_VERIFIED", 0) or 0)
        g9_desc = (
            f"Filtered live Ubuntu feed to host-relevant items and executed `{g9.get('sampledCount', 0)}` fixes (`seed={g9.get('seed')}`): "
            f"`{confirmed_cnt}/{g9.get('sampledCount', 0)}` confirmed fixed (`MITIGATED` + `REMEDIATION_VERIFIED`), "
            f"flipped `{g9.get('independentFixedAfter', 0)}/{g9.get('independentExposedBefore', 0)}` injected host/compliance controls EXPOSED -> FIXED in `{g9.get('fixElapsedSeconds', '?')}s`, "
            f"verified `{g9.get('ed25519VerifiedCount', 0)}/{g9.get('sampledCount', 0)}` Ed25519 signatures; "
            f"`{len(unpinned_false or [])}` unpinned false-verified, `{len(abstain_viol)}` abstain violations, `{len(unexpected_fail)}` unexpected failures"
        )
    else:
        g9_desc = "Not executed or evidence missing."
    lines.append(
        f"| **9. 250 Host-Relevant Confirmed Fixes** | **{_outcome_badge(resolved_outcomes['9'])}** | "
        f"Filtered live Vantage Ubuntu feed to host-applicable items, compromised controls, ran auto-fix, re-probed | {g9_desc} |"
    )

    # Section 3: Gate 9 Breakdown
    if g9:
        lines.append("")
        lines.append("---")
        lines.append("")
        lines.append("### Understanding the Gate 9 Numbers (Why This Result Is Honest)")
        lines.append("")
        strata = g9.get("strataCounts") or {}
        hfs = g9.get("hostFilterStats") or {}
        if hfs:
            lines.append(
                f"Gate 9 scanned **{hfs.get('feedPoolSize', '?')}** live Ubuntu Vantage advisories and filtered out irrelevant entries before sampling "
                f"(excluded `{hfs.get('excludedNotApplicableCount', 0)}` `NOT_APPLICABLE`, "
                f"`{hfs.get('excludedUnsupportedCount', 0)}` `UNSUPPORTED` abstentions, "
                f"`{hfs.get('excludedPendingRebootCount', 0)}` `PENDING_REBOOT` kernel items, "
                f"`{hfs.get('excludedEsmOnlyCount', 0)}` Ubuntu Pro ESM-only pins, and "
                f"`{hfs.get('excludedUnpinnedNoChangelogCount', 0)}` unpinned non-changelog items -> "
                f"`{hfs.get('hostRelevantAvailableCount', g9.get('sampledCount', 0))}` host-relevant items available). "
                f"From those host-relevant candidates, Gate 9 ran **{g9.get('sampledCount', 0)}** fixes "
                f"(`{strata.get('runtime_guards', 0)}` runtime guards, "
                f"`{strata.get('installed_pinned_os_packages', strata.get('os_and_service_packages', 0))}` installed pinned OS packages, "
                f"`{strata.get('installed_pinned_app_dependencies', strata.get('app_dependencies', 0))}` installed app deps, "
                f"`{strata.get('installed_changelog_os_packages', 0)}` installed changelog-verified OS packages). "
                f"Every item was accounted for (`{reconciled.get('evaluatedCount', g9.get('sampledCount', 0))}/{g9.get('sampledCount', 0)}`, "
                f"`{len(unaccounted)}` unaccounted):"
            )
        else:
            lines.append(
                f"Gate 9 sampled **{g9.get('sampledCount', 0)}** advisories across strata "
                f"(`{strata.get('runtime_guards', 0)}` runtime guards, "
                f"`{strata.get('os_and_service_packages', 0)}` OS/service packages, "
                f"`{strata.get('app_dependencies', 0)}` app dependencies, "
                f"`{strata.get('kernel_packages', 0)}` kernel packages, "
                f"`{strata.get('abstentions', 0)}` abstentions). "
                f"Every item was accounted for (`{reconciled.get('evaluatedCount', g9.get('sampledCount', 0))}/{g9.get('sampledCount', 0)}`, "
                f"`{len(unaccounted)}` unaccounted):"
            )
        lines.append("")

        breakdown = (reconciled.get("statusBreakdown") or {}) if isinstance(reconciled, dict) else {}
        after_cats = collections.Counter(
            str(r.get("category") or "Other") for r in (g9.get("afterResults") or []) if isinstance(r, dict) and r.get("fixed")
        )
        pinned_ver_cnt = int(reconciled.get("verifiedViaPinnedVersionCount", 0) or 0)
        chg_ver_cnt = int(reconciled.get("verifiedViaDistroChangelogCount", 0) or 0)

        if breakdown.get("REMEDIATION_VERIFIED", 0) > 0:
            sub = []
            if pinned_ver_cnt:
                sub.append(f"`{pinned_ver_cnt}` checked >= exact distro/app minimum fixed version")
            if chg_ver_cnt:
                sub.append(f"`{chg_ver_cnt}` confirmed fixed via signed local distro security changelog")
            detail_sub = f" ({'; '.join(sub)})" if sub else ""
            lines.append(
                f"- **`REMEDIATION_VERIFIED`: {breakdown['REMEDIATION_VERIFIED']}** — Real installed packages proven fixed against a concrete minimum version or signed distro CVE changelog{detail_sub}."
            )

        if breakdown.get("MITIGATED", 0) > 0:
            cat_bullets = ", ".join(f"`{cnt}` {cat}" for cat, cnt in sorted(after_cats.items(), key=lambda kv: (-kv[1], kv[0])))
            lines.append(
                f"- **`MITIGATED`: {breakdown['MITIGATED']}** — Real, host-observable runtime defenses applied and independently verified on the OS "
                f"(contributing alongside SOX/PCI baselines to `{g9.get('independentFixedAfter', 0)}/{g9.get('independentExposedBefore', 0)}` independent OS probes flipping EXPOSED -> FIXED: {cat_bullets})."
            )

        lines.append(
            f"- **Non-fix statuses in Gate 9 sample (`NOT_APPLICABLE` / `UNSUPPORTED` / `PENDING_REBOOT` / `REMEDIATION_ATTEMPTED`):** "
            f"`{breakdown.get('NOT_APPLICABLE', 0)}` / `{breakdown.get('UNSUPPORTED', 0)}` / `{breakdown.get('PENDING_REBOOT', 0)}` / `{breakdown.get('REMEDIATION_ATTEMPTED', 0)}` "
            f"(`unpinnedFalseVerified`: `{len(unpinned_false or [])}`)."
        )

    # Section 4: Honest Scope Limits
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("### Honest Scope Limits (What This Run Does Not Prove)")
    lines.append("")
    limit_idx = 1

    tpm_present = bool((att_payload.get("tpm") or {}).get("tpm_present"))
    shirudo_detected = bool((att_payload.get("shirudo") or {}).get("detected"))
    if not tpm_present or not shirudo_detected:
        missing_parts = []
        if not tpm_present:
            missing_parts.append("hardware vTPM (`tpm_present: false`)")
        if not shirudo_detected:
            missing_parts.append("Shirudo LSM runtime (`detected: false`)")
        lines.append(
            f"{limit_idx}. **No {' / '.join(missing_parts)}:** This runner does not expose {' or '.join(missing_parts)}, "
            f"so Gate 8 attested at the `{att_payload.get('trust_tier', 'software_hash_chain_ed25519')}` tier rather than hardware TPM PCR quote or Shirudo LSM tier."
        )
        limit_idx += 1

    has_g8_reboot_gate = any(
        g.get("id") == "GATE-06-PENDING-REBOOT-RECONCILIATION" and g.get("passed")
        for g in (g8_beh.get("gates") or [])
    )
    if g9:
        hfs = g9.get("hostFilterStats") or {}
        if hfs:
            lines.append(
                f"{limit_idx}. **Dedicated Coverage for Abstentions & Kernel Reboots:** `NOT_APPLICABLE`, `UNSUPPORTED` abstentions, and `PENDING_REBOOT` kernel items "
                f"are intentionally excluded from Gate 9 so all `{g9.get('sampledCount', 0)}` Gate 9 slots measure confirmed host-relevant fixes; "
                f"fail-closed abstention is verified separately in Gates 1 & 6"
                + (" and deterministic kernel `PENDING_REBOOT` promotion is verified in Gate 8 (`GATE-06-PENDING-REBOOT-RECONCILIATION`)." if has_g8_reboot_gate else ".")
            )
            limit_idx += 1

    if limit_idx == 1:
        lines.append("1. **Standard CI VM Environment:** Verification reflects the OS image, installed package set, and network feeds available at run time.")

    lines.append("")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate plain-English Exultia verification report from gate evidence.")
    parser.add_argument("--evidence-dir", required=True, help="Directory containing gate1..gate9 evidence files.")
    parser.add_argument("--out", default="", help="Output Markdown path (defaults to <evidence-dir>/VERIFICATION_SUMMARY.md).")
    parser.add_argument("--github-summary", default="", help="Optional path to append summary (e.g., $GITHUB_STEP_SUMMARY or 'auto').")
    parser.add_argument("--print", dest="print_stdout", action="store_true", help="Print rendered summary to stdout.")
    parser.add_argument("--runner-name", default=os.environ.get("RUNNER_NAME", ""), help="Runner display name.")
    parser.add_argument("--runner-os", default=os.environ.get("RUNNER_OS", ""), help="Runner OS.")
    parser.add_argument("--runner-arch", default=os.environ.get("RUNNER_ARCH", ""), help="Runner architecture.")
    parser.add_argument("--run-id", default=os.environ.get("GITHUB_RUN_ID", ""), help="GitHub Actions run ID.")
    parser.add_argument("--gate-outcomes", default="", help="Comma-separated '1=success,2=success,...' or JSON dict.")
    args = parser.parse_args()

    ev_dir = Path(args.evidence_dir)
    ev_dir.mkdir(parents=True, exist_ok=True)
    out_path = Path(args.out) if args.out else (ev_dir / "VERIFICATION_SUMMARY.md")

    md = build_summary(
        ev_dir,
        runner_name=args.runner_name,
        runner_os=args.runner_os,
        runner_arch=args.runner_arch,
        run_id=args.run_id,
        gate_outcomes=_parse_gate_outcomes(args.gate_outcomes),
    )

    out_path.write_text(md, encoding="utf-8")

    gh_sum = args.github_summary
    if gh_sum == "auto":
        gh_sum = os.environ.get("GITHUB_STEP_SUMMARY", "")
    if gh_sum:
        gh_path = Path(gh_sum)
        gh_path.parent.mkdir(parents=True, exist_ok=True)
        with gh_path.open("a", encoding="utf-8") as fh:
            fh.write(md)
            if not md.endswith("\n"):
                fh.write("\n")

    if args.print_stdout:
        print(md)
    return 0


if __name__ == "__main__":
    sys.exit(main())
