#!/usr/bin/env python3
"""
Gate 3: Independent random Vantage advisory live-apply & deterministic rollback verifier.

Selects a random host-applicable Ubuntu Vantage runtime-guard advisory across live rule
strata (unless --cve is explicitly provided), verifies independent OS state transitions
EXPOSED -> FIXED -> RESTORED across `exultia patch` and `exultia rollback`, and restores
the pre-gate host baseline cleanly.
"""

from __future__ import annotations

import argparse
import gzip
import json
import os
import re
import secrets
import shutil
import subprocess
import sys
import urllib.request
from collections import defaultdict
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional, Tuple


BASE_URL = "https://exultia.tech"
USER_AGENT = "Independent-Exultia-Auditor/1.0"

REVERSIBLE_VANTAGE_RULES = frozenset({
    "EXPR-OPENSSH-SSHD-DROPIN",
    "EXPR-KERNEL-IO-URING-DISABLE",
    "EXPR-KERNEL-NETFILTER-USERNS",
    "EXPR-KERNEL-STACK-SYSCTL-GUARD",
    "EXPR-KERNEL-MODPROBE-BLACKLIST-KSMBD",
    "EXPR-KERNEL-MODPROBE-BLACKLIST-UDF",
    "EXPR-PERIMETER-IP-BLOCKLIST",
    "EXPR-PERIMETER-DNS-SINKHOLE",
})


def run_cmd(argv: List[str], timeout: int = 60) -> subprocess.CompletedProcess[str]:
    return subprocess.run(argv, capture_output=True, text=True, timeout=timeout)


def fetch_json(url: str) -> Dict[str, Any]:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "application/json",
            "Accept-Encoding": "gzip",
        },
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        raw = resp.read()
        enc = str(resp.headers.get("Content-Encoding") or "").lower()
        if "gzip" in enc or raw[:2] == b"\x1f\x8b":
            raw = gzip.decompress(raw)
        return json.loads(raw.decode("utf-8"))


def sysctl_exists(key: str) -> bool:
    return (Path("/proc/sys") / key.replace(".", "/")).exists()


def read_sysctl(key: str) -> Optional[str]:
    if not sysctl_exists(key):
        return None
    r = run_cmd(["sysctl", "-n", key], timeout=5)
    return r.stdout.strip() if r.returncode == 0 else None


def detect_host_distro() -> Tuple[str, str, str]:
    os_rel = Path("/etc/os-release")
    raw_id = ""
    if os_rel.is_file():
        for ln in os_rel.read_text(encoding="utf-8", errors="ignore").lower().splitlines():
            if ln.startswith("id="):
                raw_id = ln.split("=", 1)[1].strip().strip('"').strip("'")
                break
    if raw_id == "ubuntu":
        return "ubuntu", "ubuntu", "Ubuntu"
    if raw_id in ("debian", "kali", "raspbian"):
        return "debian", "debian", "Debian"
    if raw_id in ("rocky", "rhel", "almalinux", "centos", "ol", "fedora", "amzn"):
        return "rhel", "rocky", "Rocky Linux"
    if raw_id == "alpine":
        return "alpine", "alpine", "Alpine Linux"
    return (raw_id or "ubuntu"), (raw_id or "ubuntu"), (raw_id or "Linux")


def supports_usepam(family: str) -> bool:
    if family == "alpine":
        return False
    r = run_cmd(["sshd", "-T"], timeout=10)
    if r.returncode == 0:
        return "usepam " in r.stdout.lower()
    return True


def ensure_ssh_host_keys() -> None:
    if not list(Path("/etc/ssh").glob("ssh_host_*_key")) and shutil.which("ssh-keygen"):
        run_cmd(["ssh-keygen", "-A"], timeout=15)


def sshd_effective(param: str) -> str:
    r = run_cmd(["sshd", "-T"], timeout=10)
    if r.returncode != 0:
        raise RuntimeError(f"`sshd -T` failed: {(r.stderr or r.stdout).strip()}")
    for line in r.stdout.splitlines():
        parts = line.strip().split(None, 1)
        if len(parts) == 2 and parts[0].lower() == param.lower():
            return parts[1].strip()
    return "MISSING"


def item_rule_id(patch: Dict[str, Any]) -> str:
    vf = patch.get("validatedFix") or {}
    return str(patch.get("expressionRuleId") or vf.get("expressionRuleId") or "")


def is_rule_supported_on_host(patch: Dict[str, Any]) -> bool:
    rule = item_rule_id(patch)
    if rule not in REVERSIBLE_VANTAGE_RULES:
        return False
    ver_cmd = str(((patch.get("remediationTier") or {}).get("tier1_hotMitigation") or {}).get("verificationCommand") or "")
    if rule == "EXPR-KERNEL-IO-URING-DISABLE":
        return sysctl_exists("kernel.io_uring_disabled")
    if rule == "EXPR-KERNEL-NETFILTER-USERNS":
        return sysctl_exists("kernel.unprivileged_userns_clone")
    if rule == "EXPR-KERNEL-STACK-SYSCTL-GUARD":
        return all(
            sysctl_exists(k)
            for k in ("kernel.dmesg_restrict", "kernel.kptr_restrict", "fs.protected_hardlinks", "fs.protected_symlinks")
        )
    if rule == "EXPR-PERIMETER-IP-BLOCKLIST":
        return bool(re.search(r"ipsum-(\d{4}-\d{2}-\d{2})\.list", ver_cmd))
    if rule == "EXPR-PERIMETER-DNS-SINKHOLE":
        return bool(re.search(r"openphish-(\d{4}-\d{2}-\d{2})\.domains", ver_cmd))
    return True


def select_vantage_target(patches: List[Dict[str, Any]], explicit_cve: str = "") -> Dict[str, Any]:
    if explicit_cve:
        needle = explicit_cve.strip().upper()
        for p in patches:
            if str(p.get("cveId") or "").strip().upper() == needle or str(p.get("id") or "").strip().upper() == needle:
                if not is_rule_supported_on_host(p):
                    raise RuntimeError(f"Explicitly requested {explicit_cve} uses unsupported Gate 3 rule {item_rule_id(p)!r}")
                return p
        raise RuntimeError(f"Explicitly requested Vantage advisory {explicit_cve!r} not found in live Ubuntu feed")

    by_rule: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
    for p in patches:
        if is_rule_supported_on_host(p):
            by_rule[item_rule_id(p)].append(p)

    if not by_rule:
        raise RuntimeError("No eligible reversible Vantage runtime-guard advisories found in live feed")

    rng = secrets.SystemRandom()
    chosen_rule = rng.choice(sorted(by_rule.keys()))
    return rng.choice(by_rule[chosen_rule])


def build_harness_for_item(
    patch: Dict[str, Any],
    *,
    family: str = "ubuntu",
) -> Tuple[Callable[[], None], Callable[[], Tuple[bool, str]], Callable[[], None]]:
    """
    Returns (prepare_exposed_state, probe_is_fixed, restore_host_baseline) for `patch`.
    """
    rule = item_rule_id(patch)
    cve = str(patch.get("cveId") or patch.get("id") or "").strip()
    cve_low = cve.lower()
    ver_cmd = str(((patch.get("remediationTier") or {}).get("tier1_hotMitigation") or {}).get("verificationCommand") or "")

    backup_dir = Path("/tmp/exultia-gate3-backup")
    if backup_dir.exists():
        shutil.rmtree(backup_dir, ignore_errors=True)
    backup_dir.mkdir(parents=True, exist_ok=True)

    saved_files: Dict[Path, Optional[Tuple[bytes, int]]] = {}
    saved_sysctls: Dict[str, str] = {}

    def _save_file(fp: Path) -> None:
        if fp not in saved_files:
            if fp.is_file() and not fp.is_symlink():
                saved_files[fp] = (fp.read_bytes(), fp.stat().st_mode & 0o777)
            else:
                saved_files[fp] = None

    def _save_sysctl(key: str) -> None:
        if key not in saved_sysctls:
            val = read_sysctl(key)
            if val is not None:
                saved_sysctls[key] = val

    def _restore_common() -> None:
        for fp, state in saved_files.items():
            if state is None:
                fp.unlink(missing_ok=True)
            else:
                data, mode = state
                fp.parent.mkdir(parents=True, exist_ok=True)
                fp.write_bytes(data)
                os.chmod(fp, mode)
        for key, val in saved_sysctls.items():
            run_cmd(["sysctl", "-w", f"{key}={val}"], timeout=5)
        shutil.rmtree(backup_dir, ignore_errors=True)

    if rule == "EXPR-OPENSSH-SSHD-DROPIN":
        sshd_cfg = Path("/etc/ssh/sshd_config")
        ssh_dropin = Path(f"/etc/ssh/sshd_config.d/00-exultia-{cve_low}.conf")
        regr_dropin = Path("/etc/ssh/sshd_config.d/00-exultia-regrsshion-fix.conf")
        _save_file(sshd_cfg)
        _save_file(ssh_dropin)
        _save_file(regr_dropin)
        pam_enabled = supports_usepam(family)

        def _prep() -> None:
            Path("/run/sshd").mkdir(parents=True, exist_ok=True)
            Path("/etc/ssh/sshd_config.d").mkdir(parents=True, exist_ok=True)
            ensure_ssh_host_keys()
            for old in Path("/etc/ssh/sshd_config.d").glob("00-exultia-*.conf"):
                _save_file(old)
                old.unlink(missing_ok=True)
            sshd_cfg.write_text(
                "Include /etc/ssh/sshd_config.d/*.conf\n"
                "Port 22\n"
                + ("UsePAM yes\n" if pam_enabled else "")
                + "PubkeyAuthentication yes\n"
                + "KbdInteractiveAuthentication no\n"
                + "LoginGraceTime 120\n",
                encoding="utf-8",
            )
            os.chmod(sshd_cfg, 0o644)
            if run_cmd(["sshd", "-t"], timeout=10).returncode != 0:
                raise RuntimeError("`sshd -t` failed while preparing Gate 3 SSH baseline")
            if pam_enabled and sshd_effective("usepam").lower() != "yes":
                raise RuntimeError("Safety check failed: `sshd -T` did not preserve `usepam yes`")

        def _probe() -> Tuple[bool, str]:
            lgt = sshd_effective("logingracetime")
            return (lgt == "0"), f"logingracetime={lgt}"

        def _restore() -> None:
            _restore_common()
            if run_cmd(["sshd", "-t"], timeout=10).returncode == 0:
                if shutil.which("systemctl") and Path("/run/systemd/system").is_dir():
                    for svc in ("ssh", "sshd"):
                        if run_cmd(["systemctl", "is-active", "--quiet", svc], timeout=5).returncode == 0:
                            run_cmd(["systemctl", "reload", svc], timeout=10)
                            break

        return _prep, _probe, _restore

    if rule == "EXPR-KERNEL-IO-URING-DISABLE":
        dropin = Path(f"/etc/sysctl.d/99-exultia-iouring-{cve_low}.conf")
        _save_file(dropin)
        _save_sysctl("kernel.io_uring_disabled")

        def _prep() -> None:
            Path("/etc/sysctl.d").mkdir(parents=True, exist_ok=True)
            dropin.unlink(missing_ok=True)
            run_cmd(["sysctl", "-w", "kernel.io_uring_disabled=0"], timeout=5)

        def _probe() -> Tuple[bool, str]:
            val = read_sysctl("kernel.io_uring_disabled")
            f_ok = dropin.is_file() and "kernel.io_uring_disabled" in dropin.read_text(encoding="utf-8", errors="ignore")
            return (val == "2" and f_ok), f"kernel.io_uring_disabled={val},dropin={'present' if f_ok else 'absent'}"

        return _prep, _probe, _restore_common

    if rule == "EXPR-KERNEL-NETFILTER-USERNS":
        dropin = Path(f"/etc/sysctl.d/99-exultia-netfilter-{cve_low}.conf")
        _save_file(dropin)
        _save_sysctl("kernel.unprivileged_userns_clone")

        def _prep() -> None:
            Path("/etc/sysctl.d").mkdir(parents=True, exist_ok=True)
            dropin.unlink(missing_ok=True)
            run_cmd(["sysctl", "-w", "kernel.unprivileged_userns_clone=1"], timeout=5)

        def _probe() -> Tuple[bool, str]:
            val = read_sysctl("kernel.unprivileged_userns_clone")
            f_ok = dropin.is_file() and "kernel.unprivileged_userns_clone" in dropin.read_text(encoding="utf-8", errors="ignore")
            return (val == "0" and f_ok), f"kernel.unprivileged_userns_clone={val},dropin={'present' if f_ok else 'absent'}"

        return _prep, _probe, _restore_common

    if rule == "EXPR-KERNEL-STACK-SYSCTL-GUARD":
        dropin = Path(f"/etc/sysctl.d/99-exultia-{cve_low}.conf")
        targets = [
            ("kernel.dmesg_restrict", "0", "1"),
            ("kernel.kptr_restrict", "0", "2"),
            ("fs.protected_hardlinks", "0", "1"),
            ("fs.protected_symlinks", "0", "1"),
        ]
        _save_file(dropin)
        for k, _, _ in targets:
            _save_sysctl(k)

        def _prep() -> None:
            Path("/etc/sysctl.d").mkdir(parents=True, exist_ok=True)
            dropin.unlink(missing_ok=True)
            for k, weak_v, _ in targets:
                run_cmd(["sysctl", "-w", f"{k}={weak_v}"], timeout=5)

        def _probe() -> Tuple[bool, str]:
            obs = {k: read_sysctl(k) for k, _, _ in targets}
            f_ok = dropin.is_file() and dropin.stat().st_size > 0
            all_ok = f_ok and all(obs.get(k) == exp_v for k, _, exp_v in targets)
            return all_ok, f"sysctls={obs},dropin={'present' if f_ok else 'absent'}"

        return _prep, _probe, _restore_common

    if rule in ("EXPR-KERNEL-MODPROBE-BLACKLIST-KSMBD", "EXPR-KERNEL-MODPROBE-BLACKLIST-UDF"):
        mod = "ksmbd" if rule.endswith("KSMBD") else "udf"
        conf = Path(f"/etc/modprobe.d/exultia-blacklist-{mod}-{cve_low}.conf")
        _save_file(conf)

        def _prep() -> None:
            Path("/etc/modprobe.d").mkdir(parents=True, exist_ok=True)
            conf.unlink(missing_ok=True)

        def _probe() -> Tuple[bool, str]:
            if not conf.is_file():
                return False, f"{conf}:absent"
            txt = conf.read_text(encoding="utf-8", errors="ignore")
            ok = f"install {mod} /bin/false" in txt
            return ok, f"{conf}:{'present' if ok else 'incomplete'}"

        return _prep, _probe, _restore_common

    if rule == "EXPR-PERIMETER-IP-BLOCKLIST":
        m = re.search(r"ipsum-(\d{4}-\d{2}-\d{2})\.list", ver_cmd)
        assert m is not None
        day = m.group(1)
        list_fp = Path(f"/etc/exultia/blocklists/ipsum-{day}.list")
        hosts_deny = Path("/etc/hosts.deny")
        _save_file(list_fp)
        _save_file(hosts_deny)
        orig_bh = set(
            ln.strip()
            for ln in run_cmd(["ip", "route", "show", "type", "blackhole"], timeout=5).stdout.splitlines()
            if ln.strip()
        )

        def _prep() -> None:
            Path("/etc/exultia/blocklists").mkdir(parents=True, exist_ok=True)
            list_fp.unlink(missing_ok=True)
            if hosts_deny.is_file():
                cleaned = re.sub(
                    rf"(?ms)^# BEGIN EXULTIA-IPBLOCK-{re.escape(day)}[^\n]*\n.*?^# END EXULTIA-IPBLOCK-{re.escape(day)}[^\n]*\r?\n?",
                    "",
                    hosts_deny.read_text(encoding="utf-8", errors="ignore"),
                )
                hosts_deny.write_text(cleaned, encoding="utf-8")
            run_cmd(["nft", "delete", "table", "inet", "exultia_vantage"], timeout=5)

        def _probe() -> Tuple[bool, str]:
            l_ok = list_fp.is_file() and list_fp.stat().st_size > 0
            hd_ok = hosts_deny.is_file() and f"# BEGIN EXULTIA-IPBLOCK-{day}" in hosts_deny.read_text(encoding="utf-8", errors="ignore")
            return (l_ok and hd_ok), f"list={'present' if l_ok else 'absent'},hosts.deny={'present' if hd_ok else 'absent'}"

        def _restore() -> None:
            _restore_common()
            run_cmd(["nft", "delete", "table", "inet", "exultia_vantage"], timeout=5)
            cur_bh = run_cmd(["ip", "route", "show", "type", "blackhole"], timeout=5).stdout.splitlines()
            for ln in cur_bh:
                clean = ln.strip()
                if clean and clean not in orig_bh:
                    parts = clean.split()
                    if len(parts) >= 2 and parts[0] == "blackhole":
                        run_cmd(["ip", "route", "del", "blackhole", parts[1]], timeout=5)

        return _prep, _probe, _restore

    if rule == "EXPR-PERIMETER-DNS-SINKHOLE":
        m = re.search(r"openphish-(\d{4}-\d{2}-\d{2})\.domains", ver_cmd)
        assert m is not None
        day = m.group(1)
        dom_fp = Path(f"/etc/exultia/blocklists/openphish-{day}.domains")
        sink_fp = Path(f"/etc/exultia/blocklists/dns-sinkhole-{day}.conf")
        hosts_fp = Path("/etc/hosts")
        _save_file(dom_fp)
        _save_file(sink_fp)
        _save_file(hosts_fp)

        def _prep() -> None:
            Path("/etc/exultia/blocklists").mkdir(parents=True, exist_ok=True)
            dom_fp.unlink(missing_ok=True)
            sink_fp.unlink(missing_ok=True)
            if hosts_fp.is_file():
                cleaned = re.sub(
                    rf"(?ms)^# BEGIN EXULTIA-OPENPHISH-{re.escape(day)}[^\n]*\n.*?^# END EXULTIA-OPENPHISH-{re.escape(day)}[^\n]*\r?\n?",
                    "",
                    hosts_fp.read_text(encoding="utf-8", errors="ignore"),
                )
                hosts_fp.write_text(cleaned, encoding="utf-8")

        def _probe() -> Tuple[bool, str]:
            d_ok = dom_fp.is_file() and dom_fp.stat().st_size > 0
            h_ok = hosts_fp.is_file() and f"# BEGIN EXULTIA-OPENPHISH-{day}" in hosts_fp.read_text(encoding="utf-8", errors="ignore")
            return (d_ok and h_ok), f"domains={'present' if d_ok else 'absent'},hosts={'present' if h_ok else 'absent'}"

        return _prep, _probe, _restore_common

    raise RuntimeError(f"Unhandled rule {rule!r}")


def main() -> int:
    ap = argparse.ArgumentParser(description="Gate 3 random Vantage live apply & rollback verifier.")
    ap.add_argument("--config", default="/etc/exultia/eval.conf")
    ap.add_argument("--evidence-dir", required=True)
    ap.add_argument("--exultia-bin", default="/usr/local/bin/exultia")
    ap.add_argument("--cve", default="", help="Optional explicit CVE/UVI override; omit for random selection.")
    args = ap.parse_args()

    ev_dir = Path(args.evidence_dir)
    ev_dir.mkdir(parents=True, exist_ok=True)

    family, feed_os, distro_label = detect_host_distro()
    feed_doc = fetch_json(f"{BASE_URL}/api/patches/feed?os={feed_os}&limit=5000")
    patches = list(feed_doc.get("patches") or [])
    chosen = select_vantage_target(patches, explicit_cve=args.cve)
    chosen_id = str(chosen.get("cveId") or chosen.get("id") or "").strip()
    chosen_rule = item_rule_id(chosen)

    print(f"[Gate 3] Selected {distro_label} Vantage target: {chosen_id} (rule={chosen_rule}, mode={'explicit' if args.cve else 'random'})")

    gh_env = os.environ.get("GITHUB_ENV")
    if gh_env:
        with open(gh_env, "a", encoding="utf-8") as fh:
            fh.write(f"SELECTED_VANTAGE_CVE={chosen_id}\n")
            fh.write(f"SELECTED_VANTAGE_RULE={chosen_rule}\n")

    prep_fn, probe_fn, restore_fn = build_harness_for_item(chosen, family=family)
    try:
        prep_fn()
        before_ok, before_detail = probe_fn()
        print(f"Independent OS probe BEFORE   = {'FIXED' if before_ok else 'EXPOSED'} ({before_detail})")
        if before_ok:
            raise AssertionError(f"Expected {chosen_id} to be EXPOSED before apply, got FIXED ({before_detail})")

        v_proc = run_cmd([args.exultia_bin, "--config", args.config, "feed", "--verify", "--cve", chosen_id], timeout=90)
        (ev_dir / "gate3_feed_verify.txt").write_text((v_proc.stdout or "") + (v_proc.stderr or ""), encoding="utf-8")
        print(v_proc.stdout, end="")
        if v_proc.returncode != 0:
            raise AssertionError(f"`exultia feed --verify --cve {chosen_id}` failed (rc={v_proc.returncode}): {v_proc.stderr}")

        a_proc = run_cmd([args.exultia_bin, "--config", args.config, "patch", "--cve", chosen_id, "--force"], timeout=120)
        (ev_dir / "gate3_apply.txt").write_text((a_proc.stdout or "") + (a_proc.stderr or ""), encoding="utf-8")
        print(a_proc.stdout, end="")
        if a_proc.returncode != 0:
            raise AssertionError(f"`exultia patch --cve {chosen_id} --force` failed (rc={a_proc.returncode}): {a_proc.stderr}")

        after_ok, after_detail = probe_fn()
        print(f"Independent OS probe AFTER    = {'FIXED' if after_ok else 'EXPOSED'} ({after_detail})")
        if not after_ok:
            raise AssertionError(f"Expected {chosen_id} to be FIXED after apply, got EXPOSED ({after_detail})")

        r_proc = run_cmd([args.exultia_bin, "--config", args.config, "rollback", "--cve", chosen_id], timeout=90)
        (ev_dir / "gate3_rollback.txt").write_text((r_proc.stdout or "") + (r_proc.stderr or ""), encoding="utf-8")
        print(r_proc.stdout, end="")
        if r_proc.returncode != 0:
            raise AssertionError(f"`exultia rollback --cve {chosen_id}` failed (rc={r_proc.returncode}): {r_proc.stderr}")

        restored_ok, restored_detail = probe_fn()
        print(f"Independent OS probe RESTORED = {'FIXED' if restored_ok else 'EXPOSED'} ({restored_detail})")
        if restored_ok:
            raise AssertionError(f"Expected {chosen_id} to revert to EXPOSED after rollback, remained FIXED ({restored_detail})")

        (ev_dir / "gate3_selected.json").write_text(
            json.dumps(
                {
                    "selectedCve": chosen_id,
                    "expressionRuleId": chosen_rule,
                    "selectionMode": "explicit" if args.cve else "random",
                    "beforeProbe": before_detail,
                    "afterApplyProbe": after_detail,
                    "afterRollbackProbe": restored_detail,
                },
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )
        print(f"[PASS] Gate 3 verified random Vantage target {chosen_id} ({chosen_rule}) live apply and rollback")
        return 0
    finally:
        restore_fn()


if __name__ == "__main__":
    sys.exit(main())
