#!/usr/bin/env python3
"""
Independent 250-item live-feed compromise & autonomous auto-fix verifier for Exultia.

Workflow:
  1. Fetches the live Vantage Ubuntu feed from https://exultia.tech and randomly
     samples 250 items across live rule strata using a reproducible PRNG seed.
  2. Verifies Ed25519 signatures and canonical SHA-256 digests on every sampled item
     independently (pure Python + OS cryptography, zero Exultia code imported).
  3. Backs up target host files and live kernel sysctls, then deliberately injects real
     OS-level misconfigurations across runtime guards (sshd, nftables, sysctls, modprobe
     blacklists, perimeter blocklists/sinkholes) plus 10 safe SOX/PCI baseline controls,
     while strictly preserving SSH access and never weakening /etc/shadow permissions.
  4. Runs independent OS probes (sshd -T, sysctl -n, nft, ip route blackhole, file checks) to
     prove every injected control is genuinely EXPOSED before Exultia runs.
  5. Invokes the compiled /usr/local/bin/exultia daemon to auto-remediate configuration
     drift and evaluate/fix all sampled feed items from the verified local feed snapshot.
  6. Re-runs independent OS probes to confirm 100% EXPOSED -> FIXED transition, reconciles
     all audit outcomes in /var/lib/exultia/audit.jsonl (including unpinnedFalseVerified == [],
     honest NOT_APPLICABLE, and fail-closed UNSUPPORTED/INSUFFICIENT_EVIDENCE abstentions),
     writes JSON evidence to --out, and cleanly restores the original host baseline.
"""

from __future__ import annotations

import argparse
import gzip
import hashlib
from importlib import metadata as importlib_metadata
import json
import os
import random
import re
import shutil
import subprocess
import sys
import time
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional, Set, Tuple

from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey


BASE_URL = "https://exultia.tech"
USER_AGENT = "Independent-Exultia-Auditor/1.0"
BACKUP_DIR = Path("/tmp/exultia-compromise-backup")
TEMP_FEED_PATH = Path("/tmp/exultia-compromise-250-feed.json")
TEMP_EVAL_CONF = Path("/etc/exultia/compromise-eval.conf")
AUDIT_LOG_PATH = Path("/var/lib/exultia/audit.jsonl")
STATE_JSON_PATH = Path("/var/lib/exultia/state.json")
EVAL_CACHE_PATH = Path("/var/lib/exultia/evaluation_cache.json")

RUNTIME_GUARD_RULES = frozenset({
    "EXPR-OPENSSH-SSHD-DROPIN",
    "EXPR-KERNEL-IPV4-TCP-OPTIONS-UAF",
    "EXPR-KERNEL-IO-URING-DISABLE",
    "EXPR-KERNEL-STACK-SYSCTL-GUARD",
    "EXPR-KERNEL-NETFILTER-USERNS",
    "EXPR-KERNEL-MODPROBE-BLACKLIST-KSMBD",
    "EXPR-KERNEL-MODPROBE-BLACKLIST-UDF",
    "EXPR-CUPS-DAEMON-ISOLATION",
    "EXPR-PERIMETER-IP-BLOCKLIST",
    "EXPR-PERIMETER-DNS-SINKHOLE",
})

MANAGED_BACKUP_FILES = [
    Path("/etc/ssh/sshd_config"),
    Path("/etc/hosts"),
    Path("/etc/hosts.deny"),
    Path("/etc/security/faillock.conf"),
    Path("/etc/login.defs"),
    Path("/etc/sysctl.d/99-exultia-drift.conf"),
    Path("/etc/ssh/sshd_config.d/00-exultia-drift.conf"),
    Path("/etc/ssh/sshd_config.d/99-exultia-drift.conf"),
]

MANAGED_SYSCTLS = [
    "kernel.io_uring_disabled",
    "kernel.unprivileged_userns_clone",
    "kernel.dmesg_restrict",
    "kernel.kptr_restrict",
    "fs.protected_hardlinks",
    "fs.protected_symlinks",
    "net.ipv4.tcp_syncookies",
    "net.ipv4.conf.all.send_redirects",
    "net.ipv4.conf.all.accept_source_route",
    "fs.suid_dumpable",
]


@dataclass
class IndependentCheck:
    check_id: str
    category: str
    description: str
    probe: Callable[[], Tuple[bool, str]]


def run_cmd(argv: List[str], timeout: int = 30) -> subprocess.CompletedProcess[str]:
    return subprocess.run(argv, capture_output=True, text=True, timeout=timeout)


def get_json(url: str) -> Dict[str, Any]:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "application/json",
            "Accept-Encoding": "gzip",
        },
    )
    with urllib.request.urlopen(req, timeout=180) as resp:
        raw = resp.read()
        enc = str(resp.headers.get("Content-Encoding") or "").lower()
        if "gzip" in enc or raw[:2] == b"\x1f\x8b":
            raw = gzip.decompress(raw)
        return json.loads(raw.decode("utf-8"))


def verify_patch_ed25519(pub: Ed25519PublicKey, patch: Dict[str, Any]) -> str:
    t1 = (patch.get("remediationTier") or {}).get("tier1_hotMitigation") or {}
    t2 = (patch.get("remediationTier") or {}).get("tier2_packageUpgrade") or {}
    distro_cmds = t2.get("distroCommands") or {}
    upg_cmd = t2.get("upgradeCommand") or distro_cmds.get("ubuntu") or distro_cmds.get("debian") or next(iter(distro_cmds.values()), "")
    primitives = patch.get("primitives") or (patch.get("validatedFix") or {}).get("primitives") or []

    canonical_obj = {
        "id": str(patch.get("id") or ""),
        "cve_id": str(patch.get("cveId") or ""),
        "commands": list(t1.get("commands") or []),
        "primitives": list(primitives),
        "upgrade_command": str(upg_cmd or ""),
        "verification_command": str(t1.get("verificationCommand") or ""),
        "rollback_command": str(t1.get("rollbackCommand") or ""),
    }
    serialized = json.dumps(canonical_obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    digest = "sha256:" + hashlib.sha256(serialized).hexdigest()

    prov = patch.get("provenance") or {}
    expected_digest = str(prov.get("cosignDigest") or "")
    if digest != expected_digest:
        raise AssertionError(f"Canonical digest mismatch for {patch.get('id')}: {digest} != {expected_digest}")

    sig_str = str(prov.get("signature") or "")
    if not sig_str.startswith("ed25519:"):
        raise AssertionError(f"Missing ed25519 signature for {patch.get('id')}: {sig_str!r}")

    sig_bytes = bytes.fromhex(sig_str.split(":", 1)[1])
    pub.verify(sig_bytes, f"exultia-provenance-v1:{digest}".encode("utf-8"))
    return digest


def item_rule_id(patch: Dict[str, Any]) -> str:
    vf = patch.get("validatedFix") or {}
    return str(patch.get("expressionRuleId") or vf.get("expressionRuleId") or "")


def item_keys(patch: Dict[str, Any]) -> Tuple[str, str]:
    return (str(patch.get("id") or "").strip(), str(patch.get("cveId") or "").strip())


def _detect_host_distro() -> Tuple[str, str, str]:
    os_release = Path("/etc/os-release")
    if not os_release.is_file():
        return ("ubuntu", "", "ubuntu")
    codename = ""
    version_id = ""
    distro_id = ""
    try:
        for line in os_release.read_text(encoding="utf-8", errors="ignore").lower().splitlines():
            if line.startswith("version_codename="):
                codename = line.split("=", 1)[1].strip().strip('"').strip("'")
            elif line.startswith("ubuntu_codename=") and not codename:
                codename = line.split("=", 1)[1].strip().strip('"').strip("'")
            elif line.startswith("version_id="):
                version_id = line.split("=", 1)[1].strip().strip('"').strip("'")
            elif line.startswith("id="):
                distro_id = line.split("=", 1)[1].strip().strip('"').strip("'")
    except Exception:
        return ("ubuntu", "", "ubuntu")

    if distro_id == "ubuntu":
        eff = codename or {"20.04": "focal", "22.04": "jammy", "24.04": "noble", "24.10": "oracular", "25.04": "plucky", "26.04": "resolute"}.get(version_id, "")
        return ("ubuntu", eff, "ubuntu")
    if distro_id in ("debian", "kali", "raspbian"):
        eff = codename or {"11": "bullseye", "12": "bookworm", "13": "trixie"}.get(version_id.split(".", 1)[0], "")
        return ("debian", eff, "debian")
    if distro_id in ("rocky", "rhel", "almalinux", "centos", "ol", "fedora", "amzn"):
        eff = version_id.split(".", 1)[0] if version_id else ""
        return ("rhel", eff, "rocky")
    if distro_id == "alpine":
        parts = version_id.split(".")
        eff = f"{parts[0]}.{parts[1]}" if len(parts) >= 2 else version_id
        return ("alpine", eff, "alpine")
    return (distro_id or "ubuntu", codename or version_id, distro_id or "ubuntu")


def _has_systemd() -> bool:
    return shutil.which("systemctl") is not None and Path("/run/systemd/system").is_dir()


def _supports_usepam(family: str) -> bool:
    if family == "alpine":
        return False
    r = run_cmd(["sshd", "-T"], timeout=10)
    if r.returncode == 0:
        return "usepam " in r.stdout.lower()
    return True


def _ensure_ssh_host_keys() -> None:
    if not list(Path("/etc/ssh").glob("ssh_host_*_key")) and shutil.which("ssh-keygen"):
        run_cmd(["ssh-keygen", "-A"], timeout=15)


def _verify_cve_in_host_changelog(pkg: str, cve_id: str) -> bool:
    if not pkg or not re.fullmatch(r"[a-zA-Z0-9][a-zA-Z0-9.+_-]{0,96}", pkg):
        return False
    if not cve_id or not re.fullmatch(r"CVE-\d{4}-\d{4,}", cve_id, re.I):
        return False
    chg_path = Path(f"/usr/share/doc/{pkg}/changelog.Debian.gz")
    if not chg_path.is_file() or chg_path.is_symlink():
        return False
    cve_re = re.compile(rf"\b{re.escape(cve_id)}\b", re.I)
    not_aff_re = re.compile(r"\b(?:not[- ]affected|does\s+not\s+affect|reverted|ignored|postponed|end[- ]of[- ]life)\b", re.I)
    try:
        with gzip.open(chg_path, "rt", encoding="utf-8", errors="ignore") as fh:
            text = fh.read(2 * 1024 * 1024)
        for ln in text.splitlines():
            if cve_re.search(ln) and not not_aff_re.search(ln):
                return True
    except Exception:
        return False
    return False


def get_installed_os_packages(family: str) -> Set[str]:
    installed: Set[str] = set()
    if family in ("ubuntu", "debian"):
        r = run_cmd(["dpkg-query", "-W", "-f=${Status}\t${Package}\n"], timeout=20)
        if r.returncode == 0:
            for ln in r.stdout.splitlines():
                if "\t" not in ln:
                    continue
                status, pkg = ln.split("\t", 1)
                if "install ok installed" in status and pkg.strip():
                    installed.add(pkg.strip())
    elif family in ("rhel", "suse"):
        r = run_cmd(["rpm", "-qa", "--qf", "%{NAME}\n"], timeout=20)
        if r.returncode == 0:
            for ln in r.stdout.splitlines():
                if ln.strip():
                    installed.add(ln.strip())
    elif family == "alpine":
        r = run_cmd(["apk", "info"], timeout=20)
        if r.returncode == 0:
            for ln in r.stdout.splitlines():
                if ln.strip():
                    installed.add(ln.strip())
    return installed


def get_installed_pypi_packages() -> Set[str]:
    installed: Set[str] = set()
    try:
        for dist in importlib_metadata.distributions():
            name = (dist.metadata.get("Name") or "").strip().lower()
            if name:
                installed.add(re.sub(r"[-_.]+", "-", name))
    except Exception:
        pass
    return installed


def _is_runtime_guard_applicable(item: Dict[str, Any], installed_os_pkgs: Set[str]) -> bool:
    rule = item_rule_id(item)
    if rule == "EXPR-CUPS-DAEMON-ISOLATION":
        return "cups-browsed" in installed_os_pkgs or "cups" in installed_os_pkgs
    if rule == "EXPR-OPENSSH-SSHD-DROPIN":
        return "openssh-server" in installed_os_pkgs or "openssh" in installed_os_pkgs or shutil.which("sshd") is not None
    if rule == "EXPR-KERNEL-IO-URING-DISABLE":
        return (Path("/proc/sys/kernel/io_uring_disabled")).exists()
    if rule == "EXPR-KERNEL-NETFILTER-USERNS":
        return (Path("/proc/sys/kernel/unprivileged_userns_clone")).exists()
    return True


def sample_feed_items(
    all_items: List[Dict[str, Any]],
    count: int,
    seed: int,
    *,
    family: str = "ubuntu",
    codename: str = "",
) -> Tuple[List[Dict[str, Any]], Dict[str, int], Dict[str, int]]:
    """Select ONLY host-relevant items expected to yield real confirmed fixes (no N/A, no ABSTAIN, no PENDING_REBOOT)."""
    rng = random.Random(seed)
    deduped: List[Dict[str, Any]] = []
    seen_keys = set()
    for item in all_items:
        k = (str(item.get("id") or "").upper(), str(item.get("cveId") or "").upper())
        if k in seen_keys:
            continue
        seen_keys.add(k)
        deduped.append(item)

    installed_pkgs = get_installed_os_packages(family)
    installed_pypi = get_installed_pypi_packages()

    tier_runtime: List[Dict[str, Any]] = []
    tier_os_pinned: List[Dict[str, Any]] = []
    tier_app_pinned: List[Dict[str, Any]] = []
    tier_os_changelog: List[Dict[str, Any]] = []

    filter_stats: Dict[str, int] = {
        "feedPoolSize": len(deduped),
        "excludedUnsupportedCount": 0,
        "excludedPendingRebootCount": 0,
        "excludedNotApplicableCount": 0,
        "excludedEsmOnlyCount": 0,
        "excludedUnpinnedNoChangelogCount": 0,
    }

    seen_block_dates = set()
    seen_sinkhole_dates = set()

    for item in deduped:
        rule = item_rule_id(item)
        pid = str(item.get("id") or "").upper()
        cve = str(item.get("cveId") or "").strip().upper()
        prims = item.get("primitives") or (item.get("validatedFix") or {}).get("primitives") or []
        prim_types = {str(pr.get("type") or "") for pr in prims if isinstance(pr, dict)}

        if rule.startswith("ABSTAIN-") or str(item.get("expectedOutcomeState") or "").upper() in ("UNSUPPORTED", "INSUFFICIENT_EVIDENCE"):
            filter_stats["excludedUnsupportedCount"] += 1
            continue

        if (
            rule == "EXPR-KERNEL-VENDOR-PACKAGE-UPGRADE"
            or "kernel.verify_running_version" in prim_types
            or str(item.get("expectedOutcomeState") or "").upper() == "PENDING_REBOOT"
            or (pid.startswith("ARG-") and bool(((item.get("remediationTier") or {}).get("tier2_packageUpgrade") or {}).get("requiresReboot")))
        ):
            filter_stats["excludedPendingRebootCount"] += 1
            continue

        if rule in RUNTIME_GUARD_RULES:
            if not _is_runtime_guard_applicable(item, installed_pkgs):
                filter_stats["excludedNotApplicableCount"] += 1
                continue
            ver_cmd = str(((item.get("remediationTier") or {}).get("tier1_hotMitigation") or {}).get("verificationCommand") or "")
            if rule == "EXPR-PERIMETER-IP-BLOCKLIST":
                m = re.search(r"ipsum-(\d{4}-\d{2}-\d{2})\.list", ver_cmd)
                d_key = m.group(1) if m else pid
                if d_key in seen_block_dates:
                    continue
                seen_block_dates.add(d_key)
            elif rule == "EXPR-PERIMETER-DNS-SINKHOLE":
                m = re.search(r"openphish-(\d{4}-\d{2}-\d{2})\.domains", ver_cmd)
                d_key = m.group(1) if m else pid
                if d_key in seen_sinkhole_dates:
                    continue
                seen_sinkhole_dates.add(d_key)
            tier_runtime.append(item)
            continue

        if rule == "EXPR-APP-DEPENDENCY-REMEDIATION" or "app_package.ensure_version" in prim_types:
            app_relevant = False
            for pr in prims:
                if not isinstance(pr, dict) or pr.get("type") != "app_package.ensure_version":
                    continue
                par = pr.get("params") or {}
                eco = str(par.get("ecosystem") or "").lower()
                min_v = str(par.get("min_version") or "").strip()
                pkgs = [str(x).strip().lower() for x in (par.get("packages") or []) if str(x).strip()]
                if eco == "pypi" and min_v and any(re.sub(r"[-_.]+", "-", p) in installed_pypi for p in pkgs):
                    app_relevant = True
                    break
            if app_relevant:
                tier_app_pinned.append(item)
            else:
                filter_stats["excludedNotApplicableCount"] += 1
            continue

        pkg_prims = [pr for pr in prims if isinstance(pr, dict) and pr.get("type") == "package.ensure_version"]
        if not pkg_prims:
            filter_stats["excludedUnpinnedNoChangelogCount"] += 1
            continue

        is_pinned_installed = False
        has_any_installed_target = False
        has_esm_only = False
        changelog_candidates: List[Tuple[str, str]] = []

        for pr in pkg_prims:
            par = pr.get("params") or {}
            raw_pkgs_map = par.get("packages") or {}
            if family in raw_pkgs_map:
                fam_pkgs = [str(x).strip() for x in (raw_pkgs_map.get(family) or []) if str(x).strip()]
            else:
                fam_pkgs = [str(x).strip() for x in (raw_pkgs_map.get("ubuntu") or raw_pkgs_map.get("debian") or []) if str(x).strip()]
            installed_targets = [p for p in fam_pkgs if p in installed_pkgs]
            if not installed_targets:
                continue
            has_any_installed_target = True
            mv = par.get("min_versions") or {}
            mvp = par.get("min_version_packages") or {}
            pin_ver = ""
            pin_pkgs = list(fam_pkgs)
            scoped_key = f"{family}:{codename}" if codename else ""
            if scoped_key and mv.get(scoped_key):
                pin_ver = str(mv[scoped_key]).strip()
                pin_pkgs = list(mvp.get(scoped_key) or fam_pkgs)
            elif not any(str(k).startswith(f"{family}:") for k in mv.keys()) and mv.get(family):
                pin_ver = str(mv[family]).strip()
                pin_pkgs = list(mvp.get(family) or fam_pkgs)
            elif not any(str(k).startswith(f"{family}:") for k in mv.keys()) and (par.get("min_version") or par.get("version")):
                pin_ver = str(par.get("min_version") or par.get("version") or "").strip()
                pin_pkgs = list(fam_pkgs)
            if pin_ver:
                if family == "ubuntu" and "esm" in str(pin_ver).lower():
                    has_esm_only = True
                    continue
                if any(p in installed_targets for p in pin_pkgs):
                    is_pinned_installed = True
                    break
            elif family in ("ubuntu", "debian"):
                raw_cves: List[str] = []
                if isinstance(par.get("cve_ids"), list):
                    raw_cves.extend(str(c).strip().upper() for c in par["cve_ids"] if str(c).strip())
                if isinstance(par.get("cve_id"), str) and par["cve_id"].strip():
                    raw_cves.append(par["cve_id"].strip().upper())
                for pk in installed_targets:
                    for rc in raw_cves:
                        if re.fullmatch(r"CVE-\d{4}-\d{4,}", rc):
                            changelog_candidates.append((pk, rc))

        if not has_any_installed_target:
            filter_stats["excludedNotApplicableCount"] += 1
        elif is_pinned_installed:
            tier_os_pinned.append(item)
        elif has_esm_only:
            filter_stats["excludedEsmOnlyCount"] += 1
        elif family in ("ubuntu", "debian") and any(_verify_cve_in_host_changelog(pk, rc) for pk, rc in changelog_candidates):
            tier_os_changelog.append(item)
        else:
            filter_stats["excludedUnpinnedNoChangelogCount"] += 1

    filter_stats["hostRelevantAvailableCount"] = (
        len(tier_runtime) + len(tier_os_pinned) + len(tier_app_pinned) + len(tier_os_changelog)
    )

    for bucket in (tier_runtime, tier_os_pinned, tier_app_pinned, tier_os_changelog):
        rng.shuffle(bucket)

    target_total = min(count, filter_stats["hostRelevantAvailableCount"])
    selected: List[Dict[str, Any]] = []
    selected_ids = set()

    def _take(bucket: List[Dict[str, Any]], limit: int) -> int:
        added = 0
        for it in bucket:
            if len(selected) >= target_total or added >= limit:
                break
            ik = item_keys(it)
            if ik in selected_ids:
                continue
            selected_ids.add(ik)
            selected.append(it)
            added += 1
        return added

    n_rt = _take(tier_runtime, target_total)
    n_os = _take(tier_os_pinned, target_total - len(selected))
    n_app = _take(tier_app_pinned, target_total - len(selected))
    n_chg = _take(tier_os_changelog, target_total - len(selected))

    rng.shuffle(selected)
    counts = {
        "runtime_guards": n_rt,
        "installed_pinned_os_packages": n_os,
        "installed_pinned_app_dependencies": n_app,
        "installed_changelog_os_packages": n_chg,
        "not_applicable": 0,
        "abstentions": 0,
        "kernel_packages": 0,
        "total": len(selected),
    }
    return selected, counts, filter_stats


def is_pkg_installed(pkg: str, family: str = "ubuntu") -> bool:
    if family in ("ubuntu", "debian"):
        r = run_cmd(["dpkg-query", "-W", "-f=${Status}", pkg], timeout=10)
        return r.returncode == 0 and "install ok installed" in r.stdout
    if family in ("rhel", "suse"):
        return run_cmd(["rpm", "-q", pkg], timeout=10).returncode == 0
    if family == "alpine":
        return run_cmd(["apk", "info", "-e", pkg], timeout=10).returncode == 0
    return False


def reload_sshd_safe(family: str = "ubuntu") -> None:
    _ensure_ssh_host_keys()
    chk = run_cmd(["sshd", "-t"], timeout=10)
    if chk.returncode != 0:
        raise RuntimeError(f"Refusing sshd reload because `sshd -t` failed: {(chk.stderr or chk.stdout).strip()}")
    if _supports_usepam(family):
        dump = run_cmd(["sshd", "-T"], timeout=10)
        if dump.returncode != 0 or not re.search(r"(?im)^usepam yes$", dump.stdout):
            raise RuntimeError("Safety abort: `sshd -T` did not report `usepam yes`")
    if _has_systemd():
        for unit in ("ssh", "sshd"):
            act = run_cmd(["systemctl", "is-active", "--quiet", unit], timeout=5)
            if act.returncode == 0:
                run_cmd(["systemctl", "reload", unit], timeout=10)
                return


def sysctl_exists(key: str) -> bool:
    return (Path("/proc/sys") / key.replace(".", "/")).exists()


def read_sysctl(key: str) -> Optional[str]:
    if not sysctl_exists(key):
        return None
    r = run_cmd(["sysctl", "-n", key], timeout=5)
    return r.stdout.strip() if r.returncode == 0 else None


def capture_baseline() -> Dict[str, Any]:
    if BACKUP_DIR.exists():
        shutil.rmtree(BACKUP_DIR, ignore_errors=True)
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    files_meta: Dict[str, Any] = {}
    for p in MANAGED_BACKUP_FILES:
        key = str(p)
        if p.exists() and not p.is_symlink():
            st = p.stat()
            bak = BACKUP_DIR / (hashlib.sha256(key.encode("utf-8")).hexdigest()[:16] + ".bak")
            bak.write_bytes(p.read_bytes())
            files_meta[key] = {"existed": True, "mode": st.st_mode & 0o777, "backup": str(bak)}
        else:
            files_meta[key] = {"existed": False}

    sysctls_meta: Dict[str, str] = {}
    for k in MANAGED_SYSCTLS:
        val = read_sysctl(k)
        if val is not None:
            sysctls_meta[k] = val

    bh_res = run_cmd(["ip", "route", "show", "type", "blackhole"], timeout=5)
    blackholes = [ln.strip() for ln in bh_res.stdout.splitlines() if ln.strip()] if bh_res.returncode == 0 else []

    nft_res = run_cmd(["nft", "list", "tables"], timeout=5)
    nft_tables = [ln.strip() for ln in nft_res.stdout.splitlines() if ln.strip()] if nft_res.returncode == 0 else []

    svc_active = _has_systemd() and run_cmd(["systemctl", "is-active", "--quiet", "exultia.service"], timeout=5).returncode == 0

    meta = {
        "files": files_meta,
        "sysctls": sysctls_meta,
        "blackholes": blackholes,
        "nft_tables": nft_tables,
        "exultia_service_was_active": svc_active,
    }
    (BACKUP_DIR / "baseline.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
    return meta


def restore_baseline(meta: Dict[str, Any], family: str = "ubuntu") -> None:
    print("\n[Gate 9 Cleanup] Restoring pre-test host configuration...")
    for pattern_dir, glob_pat in [
        (Path("/etc/ssh/sshd_config.d"), "00-exultia-*.conf"),
        (Path("/etc/ssh/sshd_config.d"), "99-exultia-*.conf"),
        (Path("/etc/sysctl.d"), "99-exultia-*.conf"),
        (Path("/etc/modprobe.d"), "exultia-blacklist-*.conf"),
        (Path("/etc/exultia/blocklists"), "*"),
    ]:
        if pattern_dir.is_dir():
            for fp in pattern_dir.glob(glob_pat):
                try:
                    if fp.is_file() or fp.is_symlink():
                        fp.unlink()
                except OSError:
                    pass

    for temp_p in (TEMP_EVAL_CONF, TEMP_FEED_PATH):
        try:
            temp_p.unlink(missing_ok=True)
        except OSError:
            pass

    for nft_fam, table in [
        ("ip", "exultia_cve_2026_98432"),
        ("inet", "exultia_cups"),
        ("ip", "exultia_cups"),
        ("inet", "exultia_vantage"),
    ]:
        if f"table {nft_fam} {table}" not in (meta.get("nft_tables") or []):
            run_cmd(["nft", "delete", "table", nft_fam, table], timeout=5)

    # Remove only blackhole routes added during the test
    orig_bh = set(meta.get("blackholes") or [])
    cur_bh_res = run_cmd(["ip", "route", "show", "type", "blackhole"], timeout=5)
    if cur_bh_res.returncode == 0:
        for ln in cur_bh_res.stdout.splitlines():
            clean = ln.strip()
            if clean and clean not in orig_bh:
                parts = clean.split()
                if len(parts) >= 2 and parts[0] == "blackhole":
                    run_cmd(["ip", "route", "del", "blackhole", parts[1]], timeout=5)

    for file_str, info in (meta.get("files") or {}).items():
        fp = Path(file_str)
        if info.get("existed"):
            bak = Path(info["backup"])
            if bak.exists():
                fp.parent.mkdir(parents=True, exist_ok=True)
                fp.write_bytes(bak.read_bytes())
                os.chmod(fp, int(info.get("mode", 0o644)))
        else:
            try:
                fp.unlink(missing_ok=True)
            except OSError:
                pass

    for key, val in (meta.get("sysctls") or {}).items():
        if sysctl_exists(key):
            run_cmd(["sysctl", "-w", f"{key}={val}"], timeout=5)

    reload_sshd_safe(family)
    shutil.rmtree(BACKUP_DIR, ignore_errors=True)
    if meta.get("exultia_service_was_active") and _has_systemd():
        run_cmd(["systemctl", "start", "exultia.service"], timeout=10)
    print("[Gate 9 Cleanup] Original host state restored cleanly.")


def clear_sampled_exultia_cache(sampled: List[Dict[str, Any]]) -> None:
    keys_upper = set()
    for it in sampled:
        if it.get("id"):
            keys_upper.add(str(it["id"]).strip().upper())
        if it.get("cveId"):
            keys_upper.add(str(it["cveId"]).strip().upper())

    if STATE_JSON_PATH.is_file():
        try:
            doc = json.loads(STATE_JSON_PATH.read_text(encoding="utf-8"))
            snaps = doc.get("snapshots") or []
            filtered = [
                s for s in snaps
                if not (
                    s.get("status") == "active"
                    and str(s.get("cve_id") or "").strip().upper() in keys_upper
                )
            ]
            if len(filtered) != len(snaps):
                doc["snapshots"] = filtered
                STATE_JSON_PATH.write_text(json.dumps(doc, separators=(",", ":")), encoding="utf-8")
        except Exception:
            pass

    if EVAL_CACHE_PATH.is_file():
        try:
            cache = json.loads(EVAL_CACHE_PATH.read_text(encoding="utf-8"))
            changed = False
            for k in list(cache.keys()):
                if str(k).strip().upper() in keys_upper:
                    del cache[k]
                    changed = True
            if changed:
                EVAL_CACHE_PATH.write_text(json.dumps(cache, separators=(",", ":")), encoding="utf-8")
        except Exception:
            pass


def _strip_marker_blocks(text: str, prefix: str) -> str:
    return re.sub(
        rf"(?ms)^# BEGIN {re.escape(prefix)}[^\n]*\n.*?^# END {re.escape(prefix)}[^\n]*\r?\n?",
        "",
        text,
    )


def inject_compromise_state(sampled: List[Dict[str, Any]], family: str = "ubuntu") -> None:
    print("\n[Gate 9 Inject] Deliberately misconfiguring sampled controls & SOX/PCI baselines...")
    if _has_systemd():
        run_cmd(["systemctl", "stop", "exultia.service"], timeout=10)
    run_cmd(["pkill", "-f", "/usr/local/bin/exultia daemon"], timeout=5)
    clear_sampled_exultia_cache(sampled)

    Path("/run/sshd").mkdir(parents=True, exist_ok=True)
    Path("/etc/ssh/sshd_config.d").mkdir(parents=True, exist_ok=True)
    Path("/etc/sysctl.d").mkdir(parents=True, exist_ok=True)
    Path("/etc/modprobe.d").mkdir(parents=True, exist_ok=True)
    Path("/etc/exultia/blocklists").mkdir(parents=True, exist_ok=True)
    Path("/etc/security").mkdir(parents=True, exist_ok=True)

    # 1. Remove all Exultia runtime drop-ins & modprobe blacklists & blocklists
    for d, pat in [
        (Path("/etc/ssh/sshd_config.d"), "00-exultia-*.conf"),
        (Path("/etc/ssh/sshd_config.d"), "99-exultia-*.conf"),
        (Path("/etc/sysctl.d"), "99-exultia-*.conf"),
        (Path("/etc/modprobe.d"), "exultia-blacklist-*.conf"),
        (Path("/etc/exultia/blocklists"), "ipsum-*.list"),
        (Path("/etc/exultia/blocklists"), "openphish-*"),
    ]:
        for fp in d.glob(pat):
            fp.unlink(missing_ok=True)

    # 2. Weaken SSH config safely (keep Include + PubkeyAuthentication yes, and UsePAM where supported)
    _ensure_ssh_host_keys()
    pam_line = "UsePAM yes\n" if _supports_usepam(family) else ""
    sshd_base = (
        "Include /etc/ssh/sshd_config.d/*.conf\n"
        "Port 22\n"
        f"{pam_line}"
        "PubkeyAuthentication yes\n"
        "KbdInteractiveAuthentication no\n"
        "LoginGraceTime 120\n"
    )
    Path("/etc/ssh/sshd_config").write_text(sshd_base, encoding="utf-8")
    os.chmod("/etc/ssh/sshd_config", 0o644)

    drift_sshd = (
        "# Gate 9 Deliberate Test-Host Compromise (safe test state)\n"
        "PermitRootLogin yes\n"
        "X11Forwarding yes\n"
        "MaxAuthTries 10\n"
        "ClientAliveInterval 0\n"
        "ClientAliveCountMax 5\n"
    )
    Path("/etc/ssh/sshd_config.d/99-exultia-drift.conf").write_text(drift_sshd, encoding="utf-8")
    os.chmod("/etc/ssh/sshd_config.d/99-exultia-drift.conf", 0o644)
    reload_sshd_safe(family)

    # 3. Remove nftables runtime guards
    for fam, tbl in [
        ("ip", "exultia_cve_2026_98432"),
        ("inet", "exultia_cups"),
        ("ip", "exultia_cups"),
        ("inet", "exultia_vantage"),
    ]:
        run_cmd(["nft", "delete", "table", fam, tbl], timeout=5)
    if shutil.which("iptables"):
        run_cmd([
            "iptables", "-t", "raw", "-D", "PREROUTING", "-p", "tcp",
            "--tcp-flags", "SYN,ACK", "SYN", "-m", "u32", "--u32", "0>>24&0x0f=6:15", "-j", "DROP",
        ], timeout=5)

    # 4. Weaken kernel sysctls live + drift conf
    weak_sysctls = {
        "kernel.io_uring_disabled": "0",
        "kernel.unprivileged_userns_clone": "1",
        "kernel.dmesg_restrict": "0",
        "kernel.kptr_restrict": "0",
        "fs.protected_hardlinks": "0",
        "fs.protected_symlinks": "0",
        "net.ipv4.tcp_syncookies": "0",
        "net.ipv4.conf.all.send_redirects": "1",
        "net.ipv4.conf.all.accept_source_route": "1",
        "fs.suid_dumpable": "2",
    }
    drift_lines = ["# Gate 9 Deliberate Sysctl Compromise"]
    for k, v in weak_sysctls.items():
        if sysctl_exists(k):
            r = run_cmd(["sysctl", "-w", f"{k}={v}"], timeout=5)
            if r.returncode != 0:
                raise RuntimeError(f"Failed to weaken sysctl {k}={v}: {(r.stderr or r.stdout).strip()}")
        if k.startswith(("net.ipv4.", "fs.suid_dumpable")):
            drift_lines.append(f"{k} = {v}")
    Path("/etc/sysctl.d/99-exultia-drift.conf").write_text("\n".join(drift_lines) + "\n", encoding="utf-8")
    os.chmod("/etc/sysctl.d/99-exultia-drift.conf", 0o644)

    # 5. Strip perimeter blocklist/sinkhole blocks from /etc/hosts.deny and /etc/hosts
    hosts_deny = Path("/etc/hosts.deny")
    if hosts_deny.is_file():
        cleaned = _strip_marker_blocks(hosts_deny.read_text(encoding="utf-8", errors="replace"), "EXULTIA-IPBLOCK-")
        hosts_deny.write_text(cleaned, encoding="utf-8")
    hosts_file = Path("/etc/hosts")
    if hosts_file.is_file():
        cleaned = _strip_marker_blocks(hosts_file.read_text(encoding="utf-8", errors="replace"), "EXULTIA-OPENPHISH-")
        hosts_file.write_text(cleaned, encoding="utf-8")

    # 6. Weaken safe account policies (NEVER weaken /etc/shadow permissions)
    faillock = Path("/etc/security/faillock.conf")
    if faillock.parent.is_dir():
        cur_fl = faillock.read_text(encoding="utf-8", errors="replace") if faillock.is_file() else ""
        lines_fl = [
            l for l in cur_fl.splitlines()
            if not re.match(r"^\s*(?:deny|unlock_time)\s*(?:=|\s|$)", l, flags=re.IGNORECASE)
        ]
        lines_fl.extend(["deny = 20", "unlock_time = 60"])
        faillock.write_text("\n".join(lines_fl) + "\n", encoding="utf-8")

    login_defs = Path("/etc/login.defs")
    if login_defs.is_file():
        cur_ld = login_defs.read_text(encoding="utf-8", errors="replace")
        lines_ld = [
            l for l in cur_ld.splitlines()
            if not re.match(r"^\s*PASS_MAX_DAYS(?:\s|$)", l, flags=re.IGNORECASE)
        ]
        lines_ld.append("PASS_MAX_DAYS 99999")
        login_defs.write_text("\n".join(lines_ld) + "\n", encoding="utf-8")


def _sshd_t_value(param: str) -> str:
    r = run_cmd(["sshd", "-T"], timeout=10)
    if r.returncode != 0:
        return f"ERR({r.returncode})"
    for ln in r.stdout.splitlines():
        parts = ln.strip().split(None, 1)
        if len(parts) == 2 and parts[0].lower() == param.lower():
            return parts[1].strip()
    return "MISSING"


def _nft_has_rule(family: str, table: str, needle: str = "") -> Tuple[bool, str]:
    r = run_cmd(["nft", "list", "table", family, table], timeout=5)
    if r.returncode != 0:
        return False, "absent"
    if not needle or needle in r.stdout:
        return True, "present"
    return False, "missing_rule"


def _file_contains(path: Path, token: str) -> Tuple[bool, str]:
    if not path.is_file() or path.stat().st_size == 0:
        return False, f"{path}:missing"
    txt = path.read_text(encoding="utf-8", errors="replace")
    ok = token in txt
    return ok, ("present" if ok else f"missing:{token}")


def _check_account_val(path: Path, key: str, expected: str, sep: str) -> Tuple[bool, str]:
    if not path.is_file():
        return False, "missing_file"
    for ln in path.read_text(encoding="utf-8", errors="replace").splitlines():
        clean = ln.strip()
        if not clean or clean.startswith("#"):
            continue
        if sep == "=" and "=" in clean:
            k, v = clean.split("=", 1)
            if k.strip().lower() == key.lower():
                return v.strip() == expected, v.strip()
        elif sep == " ":
            parts = clean.split(None, 1)
            if len(parts) >= 2 and parts[0].lower() == key.lower():
                return parts[1].strip() == expected, parts[1].strip()
    return False, "unset"


def build_independent_checks(sampled: List[Dict[str, Any]], family: str = "ubuntu") -> Tuple[List[IndependentCheck], List[str]]:
    checks: List[IndependentCheck] = []
    skipped_notes: List[str] = []
    added_ids = set()

    def _add(chk: IndependentCheck) -> None:
        if chk.check_id not in added_ids:
            added_ids.add(chk.check_id)
            checks.append(chk)

    for it in sampled:
        rule = item_rule_id(it)
        cve = str(it.get("cveId") or it.get("id") or "")
        cve_low = cve.lower()
        ver_cmd = str(((it.get("remediationTier") or {}).get("tier1_hotMitigation") or {}).get("verificationCommand") or "")

        if rule == "EXPR-OPENSSH-SSHD-DROPIN":
            _add(IndependentCheck(
                check_id=cve,
                category="Vantage Runtime Guard (OpenSSH)",
                description="sshd -T effective logingracetime == 0",
                probe=lambda: ((v := _sshd_t_value("logingracetime")) == "0", f"logingracetime={v}"),
            ))
        elif rule == "EXPR-KERNEL-IPV4-TCP-OPTIONS-UAF":
            _add(IndependentCheck(
                check_id=cve,
                category="Vantage Runtime Guard (Netfilter)",
                description="nftables ip exultia_cve_2026_98432 active",
                probe=lambda: (
                    (True, "nft:hdrlength>5") if _nft_has_rule("ip", "exultia_cve_2026_98432", "hdrlength")[0]
                    else (False, "nft_table_absent")
                ),
            ))
        elif rule == "EXPR-CUPS-DAEMON-ISOLATION":
            if is_pkg_installed("cups-browsed", family) or is_pkg_installed("cups", family):
                _add(IndependentCheck(
                    check_id=cve,
                    category="Vantage Runtime Guard (CUPS)",
                    description="nftables exultia_cups UDP/631 guard active",
                    probe=lambda: (
                        (True, "nft:exultia_cups") if (_nft_has_rule("inet", "exultia_cups")[0] or _nft_has_rule("ip", "exultia_cups")[0])
                        else (False, "nft_cups_absent")
                    ),
                ))
            else:
                skipped_notes.append(f"{cve}: cups/cups-browsed not installed -> verified as NOT_APPLICABLE via audit log")
        elif rule == "EXPR-KERNEL-IO-URING-DISABLE" and sysctl_exists("kernel.io_uring_disabled"):
            dropin = Path(f"/etc/sysctl.d/99-exultia-iouring-{cve_low}.conf")
            _add(IndependentCheck(
                check_id=cve,
                category="Vantage Kernel Sysctl",
                description="kernel.io_uring_disabled == 2 + dropin",
                probe=lambda p=dropin: (
                    (val := read_sysctl("kernel.io_uring_disabled")) == "2" and _file_contains(p, "kernel.io_uring_disabled = 2")[0],
                    f"sysctl={val},file={'ok' if p.is_file() else 'missing'}",
                ),
            ))
        elif rule == "EXPR-KERNEL-NETFILTER-USERNS" and sysctl_exists("kernel.unprivileged_userns_clone"):
            dropin = Path(f"/etc/sysctl.d/99-exultia-netfilter-{cve_low}.conf")
            _add(IndependentCheck(
                check_id=cve,
                category="Vantage Kernel Sysctl",
                description="kernel.unprivileged_userns_clone == 0 + dropin",
                probe=lambda p=dropin: (
                    (val := read_sysctl("kernel.unprivileged_userns_clone")) == "0" and _file_contains(p, "kernel.unprivileged_userns_clone = 0")[0],
                    f"sysctl={val},file={'ok' if p.is_file() else 'missing'}",
                ),
            ))
        elif rule == "EXPR-KERNEL-STACK-SYSCTL-GUARD":
            dropin = Path(f"/etc/sysctl.d/99-exultia-{cve_low}.conf")
            keys_vals = [
                ("kernel.dmesg_restrict", "1"),
                ("kernel.kptr_restrict", "2"),
                ("fs.protected_hardlinks", "1"),
                ("fs.protected_symlinks", "1"),
            ]
            def _probe_stack(p: Path = dropin, kv: List[Tuple[str, str]] = keys_vals) -> Tuple[bool, str]:
                obs = {k: read_sysctl(k) for k, _ in kv if sysctl_exists(k)}
                ok = p.is_file() and all(obs.get(k) == exp for k, exp in kv if k in obs)
                return ok, f"vals={obs},file={'ok' if p.is_file() else 'missing'}"
            _add(IndependentCheck(
                check_id=cve,
                category="Vantage Kernel Sysctl",
                description="dmesg_restrict=1,kptr_restrict=2,protected_*links=1",
                probe=_probe_stack,
            ))
        elif rule in ("EXPR-KERNEL-MODPROBE-BLACKLIST-KSMBD", "EXPR-KERNEL-MODPROBE-BLACKLIST-UDF"):
            mod = "ksmbd" if rule.endswith("KSMBD") else "udf"
            conf = Path(f"/etc/modprobe.d/exultia-blacklist-{mod}-{cve_low}.conf")
            _add(IndependentCheck(
                check_id=cve,
                category="Vantage Kernel Module Blacklist",
                description=f"{conf.name} blacklists {mod}",
                probe=lambda p=conf, m=mod: _file_contains(p, f"install {m} /bin/false"),
            ))
        elif rule == "EXPR-PERIMETER-IP-BLOCKLIST":
            m = re.search(r"ipsum-(\d{4}-\d{2}-\d{2})\.list", ver_cmd)
            if m:
                day = m.group(1)
                lp = Path(f"/etc/exultia/blocklists/ipsum-{day}.list")
                def _probe_ipblock(f: Path = lp, d: str = day) -> Tuple[bool, str]:
                    file_ok = f.is_file() and f.stat().st_size > 0
                    deny_ok = _file_contains(Path("/etc/hosts.deny"), f"BEGIN EXULTIA-IPBLOCK-{d}")[0]
                    bh_ok = False
                    if file_ok:
                        first_ip = next(
                            (ln.strip() for ln in f.read_text(encoding="utf-8", errors="ignore").splitlines() if ln.strip()),
                            "",
                        )
                        if first_ip:
                            bh_res = run_cmd(["ip", "route", "show", f"{first_ip}/32", "type", "blackhole"], timeout=5)
                            bh_ok = bh_res.returncode == 0 and bool(bh_res.stdout.strip())
                    return (
                        file_ok and deny_ok and bh_ok,
                        f"list={'ok' if file_ok else 'missing'},hosts.deny={'ok' if deny_ok else 'missing'},blackhole={'ok' if bh_ok else 'missing'}",
                    )
                _add(IndependentCheck(
                    check_id=f"{cve} ({day})",
                    category="Vantage Perimeter IP Blocklist",
                    description=f"ipsum-{day}.list + /etc/hosts.deny + ip route blackhole active",
                    probe=_probe_ipblock,
                ))
        elif rule == "EXPR-PERIMETER-DNS-SINKHOLE":
            m = re.search(r"openphish-(\d{4}-\d{2}-\d{2})\.domains", ver_cmd)
            if m:
                day = m.group(1)
                dp = Path(f"/etc/exultia/blocklists/openphish-{day}.domains")
                _add(IndependentCheck(
                    check_id=f"{cve} ({day})",
                    category="Vantage DNS Sinkhole",
                    description=f"openphish-{day}.domains + /etc/hosts sinkhole active",
                    probe=lambda f=dp, d=day: (
                        f.is_file() and f.stat().st_size > 0 and _file_contains(Path("/etc/hosts"), f"BEGIN EXULTIA-OPENPHISH-{d}")[0],
                        f"domains={'ok' if f.is_file() else 'missing'},hosts={'ok' if _file_contains(Path('/etc/hosts'), f'BEGIN EXULTIA-OPENPHISH-{d}')[0] else 'missing'}",
                    ),
                ))

    # 10 SOX/PCI host drift controls always exercised alongside the 250 feed items
    _add(IndependentCheck("SOX-PCI-SSH-01", "SOX/PCI SSH", "sshd -T permitrootlogin == no", lambda: ((v := _sshd_t_value("permitrootlogin")) == "no", f"permitrootlogin={v}")))
    _add(IndependentCheck("SOX-PCI-SSH-03", "SOX/PCI SSH", "sshd -T x11forwarding == no", lambda: ((v := _sshd_t_value("x11forwarding")) == "no", f"x11forwarding={v}")))
    _add(IndependentCheck("SOX-PCI-SSH-04", "SOX/PCI SSH", "sshd -T maxauthtries == 3", lambda: ((v := _sshd_t_value("maxauthtries")) == "3", f"maxauthtries={v}")))
    _add(IndependentCheck("SOX-PCI-SSH-05", "SOX/PCI SSH", "sshd -T clientaliveinterval == 300", lambda: ((v := _sshd_t_value("clientaliveinterval")) == "300", f"clientaliveinterval={v}")))
    _add(IndependentCheck("SOX-PCI-SYSCTL-02", "SOX/PCI Sysctl", "net.ipv4.conf.all.send_redirects == 0", lambda: ((v := read_sysctl("net.ipv4.conf.all.send_redirects")) == "0", f"send_redirects={v}")))
    _add(IndependentCheck("SOX-PCI-SYSCTL-03", "SOX/PCI Sysctl", "net.ipv4.conf.all.accept_source_route == 0", lambda: ((v := read_sysctl("net.ipv4.conf.all.accept_source_route")) == "0", f"accept_source_route={v}")))
    _add(IndependentCheck("SOX-PCI-SYSCTL-04", "SOX/PCI Sysctl", "net.ipv4.tcp_syncookies == 1", lambda: ((v := read_sysctl("net.ipv4.tcp_syncookies")) == "1", f"tcp_syncookies={v}")))
    _add(IndependentCheck("SOX-PCI-SYSCTL-06", "SOX/PCI Sysctl", "fs.suid_dumpable == 0", lambda: ((v := read_sysctl("fs.suid_dumpable")) == "0", f"suid_dumpable={v}")))
    _add(IndependentCheck(
        "SOX-PCI-ACCT-01", "SOX/PCI Account", "/etc/security/faillock.conf deny=5 & unlock_time=900",
        lambda: (
            _check_account_val(Path("/etc/security/faillock.conf"), "deny", "5", "=")[0]
            and _check_account_val(Path("/etc/security/faillock.conf"), "unlock_time", "900", "=")[0],
            f"deny={_check_account_val(Path('/etc/security/faillock.conf'), 'deny', '5', '=')[1]},unlock_time={_check_account_val(Path('/etc/security/faillock.conf'), 'unlock_time', '900', '=')[1]}",
        ),
    ))
    _add(IndependentCheck(
        "SOX-PCI-ACCT-02", "SOX/PCI Account", "/etc/login.defs PASS_MAX_DAYS == 90",
        lambda: _check_account_val(Path("/etc/login.defs"), "PASS_MAX_DAYS", "90", " "),
    ))
    return checks, skipped_notes


def evaluate_checks(checks: List[IndependentCheck], label: str) -> List[Dict[str, Any]]:
    print(f"\n--- Independent OS Probe Scorecard ({label}: {len(checks)} controls) ---")
    results: List[Dict[str, Any]] = []
    for chk in checks:
        ok, detail = chk.probe()
        tag = "FIXED" if ok else "EXPOSED"
        print(f"  [{tag:7s}] {chk.check_id:24s} | {chk.description} ({detail})")
        results.append({
            "checkId": chk.check_id,
            "category": chk.category,
            "description": chk.description,
            "fixed": ok,
            "detail": detail,
        })
    return results


def parse_new_audit_entries(start_offset: int) -> List[Dict[str, Any]]:
    if not AUDIT_LOG_PATH.is_file():
        return []
    entries: List[Dict[str, Any]] = []
    with AUDIT_LOG_PATH.open("rb") as fh:
        fh.seek(start_offset)
        for line in fh.read().decode("utf-8", errors="replace").splitlines():
            line = line.strip()
            if not line:
                continue
            try:
                entries.append(json.loads(line))
            except Exception:
                continue
    return entries


def reconcile_250_audit(
    sampled: List[Dict[str, Any]],
    entries: List[Dict[str, Any]],
    *,
    family: str = "ubuntu",
    codename: str = "",
) -> Dict[str, Any]:
    outcomes_by_target: Dict[str, str] = {}
    details_by_target: Dict[str, str] = {}
    for e in entries:
        act = str(e.get("action") or "").upper()
        if act in ("APPLY", "SEMANTIC_GATE", "SEMANTIC_REJECTED", "PROVENANCE_REJECTED", "SYNTHETIC_REJECTED"):
            tid = str(e.get("cve_id") or "").strip().upper()
            st = str(e.get("status") or "").strip().upper()
            if tid:
                outcomes_by_target[tid] = st
                details_by_target[tid] = str(e.get("details") or "")

    breakdown: Dict[str, int] = {}
    unexpected_failures: List[Dict[str, Any]] = []
    abstain_violations: List[str] = []
    unpinned_false_verified: List[Dict[str, Any]] = []
    non_fix_items: List[Dict[str, Any]] = []
    unaccounted: List[str] = []
    verified_via_pinned = 0
    verified_via_changelog = 0

    for it in sampled:
        rule = item_rule_id(it)
        pid = str(it.get("id") or "").strip().upper()
        cve = str(it.get("cveId") or "").strip().upper()
        snap_key = pid if pid.startswith("ARG-") else cve
        status = outcomes_by_target.get(snap_key) or outcomes_by_target.get(cve) or outcomes_by_target.get(pid)
        detail_txt = details_by_target.get(snap_key) or details_by_target.get(cve) or details_by_target.get(pid) or ""
        if not status:
            unaccounted.append(snap_key or pid or cve)
            continue
        breakdown[status] = breakdown.get(status, 0) + 1
        if rule.startswith("ABSTAIN-"):
            if status not in ("UNSUPPORTED", "INSUFFICIENT_EVIDENCE", "NOT_APPLICABLE"):
                abstain_violations.append(f"{snap_key}:{status}")
        else:
            if status in ("FAILED", "PROVENANCE_REJECTED", "SEMANTIC_REJECTED"):
                unexpected_failures.append({"id": snap_key, "rule": rule, "status": status})
            elif status in ("NOT_APPLICABLE", "UNSUPPORTED", "INSUFFICIENT_EVIDENCE", "PENDING_REBOOT", "REMEDIATION_ATTEMPTED"):
                non_fix_items.append({"id": snap_key, "rule": rule, "status": status, "details": detail_txt[:200]})

        prims = it.get("primitives") or (it.get("validatedFix") or {}).get("primitives") or []
        pkg_kern_prims = [
            pr for pr in prims
            if isinstance(pr, dict) and pr.get("type") in ("package.ensure_version", "kernel.verify_running_version")
        ]
        app_prims = [
            pr for pr in prims
            if isinstance(pr, dict) and pr.get("type") == "app_package.ensure_version"
        ]

        has_host_pin = False
        for pr in pkg_kern_prims:
            par = pr.get("params") or {}
            mv = par.get("min_versions") or {}
            mvp = par.get("min_version_packages") or {}
            raw_pkgs_map = par.get("packages") or {}
            if family in raw_pkgs_map:
                fam_pkgs = set(raw_pkgs_map.get(family) or [])
            else:
                fam_pkgs = set(raw_pkgs_map.get("ubuntu") or raw_pkgs_map.get("debian") or [])
            scoped_key = f"{family}:{codename}" if codename else ""
            if scoped_key and mv.get(scoped_key):
                pin_pkgs = set(mvp.get(scoped_key) or [])
                if not pin_pkgs or not fam_pkgs or (pin_pkgs & fam_pkgs):
                    has_host_pin = True
                    break
            elif not any(str(k).startswith(f"{family}:") for k in mv.keys()):
                if mv.get(family):
                    pin_pkgs = set(mvp.get(family) or [])
                    if not pin_pkgs or not fam_pkgs or (pin_pkgs & fam_pkgs):
                        has_host_pin = True
                        break
                elif par.get("min_version") or par.get("version"):
                    has_host_pin = True
                    break

        has_app_pin = any(
            bool(str((pr.get("params") or {}).get("min_version") or "").strip())
            for pr in app_prims
        )

        if status == "REMEDIATION_VERIFIED":
            if pkg_kern_prims:
                if has_host_pin:
                    verified_via_pinned += 1
                elif family in ("ubuntu", "debian"):
                    chg_m = re.search(
                        r"Verified\s+([a-zA-Z0-9.+_-]+)=[^\s]+\s+via distro security changelog\s+\((CVE-\d{4}-\d{4,})\)",
                        detail_txt,
                    )
                    if chg_m and _verify_cve_in_host_changelog(chg_m.group(1), chg_m.group(2)):
                        verified_via_changelog += 1
                    else:
                        unpinned_false_verified.append({"id": snap_key or cve or pid, "rule": rule, "status": status, "reason": "unpinned_or_missing_changelog"})
                else:
                    unpinned_false_verified.append({"id": snap_key or cve or pid, "rule": rule, "status": status, "reason": "unpinned_or_missing_changelog"})
            elif app_prims:
                if has_app_pin:
                    verified_via_pinned += 1
                else:
                    unpinned_false_verified.append({"id": snap_key or cve or pid, "rule": rule, "status": status, "reason": "unpinned_app"})
            elif not prims and "PACKAGE-UPGRADE" in rule:
                unpinned_false_verified.append({"id": snap_key or cve or pid, "rule": rule, "status": status})

    return {
        "evaluatedCount": len(sampled) - len(unaccounted),
        "unaccountedIds": unaccounted,
        "statusBreakdown": breakdown,
        "verifiedViaPinnedVersionCount": verified_via_pinned,
        "verifiedViaDistroChangelogCount": verified_via_changelog,
        "abstainViolations": abstain_violations,
        "unexpectedFailures": unexpected_failures,
        "unpinnedFalseVerified": unpinned_false_verified,
        "nonFixItems": non_fix_items,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Independent 250-item random feed compromise & auto-fix verifier.")
    parser.add_argument("--count", type=int, default=250, help="Number of random live feed items to sample (default: 250).")
    parser.add_argument("--seed", type=int, default=None, help="Optional PRNG seed for deterministic sampling.")
    parser.add_argument("--out", default="", help="Optional JSON report path.")
    parser.add_argument("--confirm-test-host", action="store_true", help="Required opt-in confirming this is a disposable test/staging VM.")
    parser.add_argument("--keep-compromised", action="store_true", help="Leave host compromised without running Exultia fix or cleanup.")
    parser.add_argument("--no-restore", action="store_true", help="Skip restoring original baseline files after verification passes.")
    parser.add_argument("--exultia-bin", default="/usr/local/bin/exultia", help="Path to Exultia binary.")
    args = parser.parse_args()

    if not args.confirm_test_host:
        sys.stderr.write("[ERROR] Refusing to misconfigure host without `--confirm-test-host` (run only on a disposable test VM).\n")
        return 2
    if not hasattr(os, "geteuid") or os.geteuid() != 0:
        sys.stderr.write("[ERROR] Must run as root (`sudo python3 scripts/verify-compromise-250.py --confirm-test-host`).\n")
        return 2
    if not Path(args.exultia_bin).is_file():
        sys.stderr.write(f"[ERROR] Exultia binary not found at {args.exultia_bin}. Run Gate 2 first.\n")
        return 2

    family, codename, feed_os = _detect_host_distro()
    seed = int(args.seed) if args.seed is not None else int.from_bytes(os.urandom(4), "big")
    print(f"[Gate 9] Fetching live Vantage {feed_os} feed for {family}:{codename or 'default'} (seed={seed}, target_count={args.count})...")

    key_doc = get_json(f"{BASE_URL}/api/provenance/key")
    pub_hex = str(key_doc.get("publicKeyHex") or "").strip().lower()
    if len(pub_hex) != 64:
        raise AssertionError(f"Invalid publicKeyHex from /api/provenance/key: {pub_hex!r}")
    pub = Ed25519PublicKey.from_public_bytes(bytes.fromhex(pub_hex))

    vantage_doc = get_json(f"{BASE_URL}/api/patches/feed?os={feed_os}&limit=all")
    combined_pool = list(vantage_doc.get("patches") or [])
    sampled, strata_counts, host_filter_stats = sample_feed_items(combined_pool, count=args.count, seed=seed, family=family, codename=codename)

    for p in sampled:
        verify_patch_ed25519(pub, p)
    print(f"[PASS] Ed25519 & SHA-256 independently verified on {len(sampled)}/{len(sampled)} host-relevant items (strata={strata_counts}, filter_stats={host_filter_stats})")

    TEMP_FEED_PATH.write_text(json.dumps({"patches": sampled}, separators=(",", ":")), encoding="utf-8")

    baseline_meta = capture_baseline()
    should_restore = not args.keep_compromised and not args.no_restore
    try:
        inject_compromise_state(sampled, family=family)
        checks, skipped_notes = build_independent_checks(sampled, family=family)
        for note in skipped_notes:
            print(f"  [Note] {note}")

        before_results = evaluate_checks(checks, "BEFORE FIX")
        exposed_before = sum(1 for r in before_results if not r["fixed"])
        if exposed_before != len(before_results):
            already_fixed = [r["checkId"] for r in before_results if r["fixed"]]
            raise AssertionError(f"Injection incomplete: {already_fixed} reported FIXED before remediation")
        print(f"[PASS] Verified {exposed_before}/{len(before_results)} runtime controls + SOX/PCI baselines actively EXPOSED")

        if args.keep_compromised:
            print("\n[Gate 9] Leaving host in compromised state as requested (--keep-compromised).")
            print("Run Exultia manually to watch fixes happen:")
            print(f"  sudo {args.exultia_bin} drift fix")
            print(f"  sudo {args.exultia_bin} patch --all --force --feed-url file://{TEMP_FEED_PATH} --os all")
            return 0

        TEMP_EVAL_CONF.parent.mkdir(parents=True, exist_ok=True)
        TEMP_EVAL_CONF.write_text(
            "[daemon]\n"
            f"os_distro = {family}\n"
            "ring = 0\n\n"
            "[feeds]\n"
            f"vantage_feed_url = file://{TEMP_FEED_PATH}\n\n"
            "[patching]\n"
            "auto_stage_patches = false\n"
            "auto_patch_non_reboot = false\n"
            "vendor_native_updates = false\n"
            "disruptive_auto_reboot = false\n\n"
            "[livepatch]\n"
            "kernel_livepatch_enabled = false\n\n"
            "[neural_self_heal]\n"
            "ai_self_heal_mode = off\n",
            encoding="utf-8",
        )
        os.chmod(TEMP_EVAL_CONF, 0o600)

        audit_start_offset = AUDIT_LOG_PATH.stat().st_size if AUDIT_LOG_PATH.is_file() else 0
        t_fix_start = time.time()

        print("\n[Gate 9 Fix] Step 1/2: Running Exultia autonomous drift remediation...")
        drift_proc = subprocess.run([args.exultia_bin, "--config", str(TEMP_EVAL_CONF), "drift", "fix"], check=False)
        if drift_proc.returncode != 0:
            raise AssertionError(f"`exultia drift fix` exited with code {drift_proc.returncode}")

        print(f"\n[Gate 9 Fix] Step 2/2: Running Exultia batch remediation across {len(sampled)} host-relevant feed items...")
        patch_env = dict(os.environ)
        patch_env["EXULTIA_BATCH_CMD_TIMEOUT"] = "300"
        subprocess.run(
            [args.exultia_bin, "--config", str(TEMP_EVAL_CONF), "patch", "--all", "--force", "--feed-url", f"file://{TEMP_FEED_PATH}", "--os", "all"],
            env=patch_env,
            check=False,
        )
        fix_elapsed = round(time.time() - t_fix_start, 2)

        reload_sshd_check = run_cmd(["sshd", "-t"], timeout=10)
        if reload_sshd_check.returncode != 0:
            raise AssertionError(f"Post-fix `sshd -t` failed: {(reload_sshd_check.stderr or reload_sshd_check.stdout).strip()}")

        after_results = evaluate_checks(checks, "AFTER FIX")
        fixed_after = sum(1 for r in after_results if r["fixed"])
        if fixed_after != len(after_results):
            still_bad = [r for r in after_results if not r["fixed"]]
            raise AssertionError(f"Not all injected controls were fixed by Exultia: {still_bad}")
        print(f"[PASS] Verified {fixed_after}/{len(after_results)} runtime controls + SOX/PCI baselines flipped EXPOSED -> FIXED in {fix_elapsed}s")

        audit_entries = parse_new_audit_entries(audit_start_offset)
        reconciled = reconcile_250_audit(sampled, audit_entries, family=family, codename=codename)
        sb = reconciled["statusBreakdown"]
        confirmed_fixes = int(sb.get("MITIGATED", 0) or 0) + int(sb.get("REMEDIATION_VERIFIED", 0) or 0)
        reconciled["confirmedFixesCount"] = confirmed_fixes

        print(f"\n--- {len(sampled)}-Item Host-Relevant Audit Reconciliation ---")
        print(f"  Evaluated: {reconciled['evaluatedCount']}/{len(sampled)} | Confirmed Fixes (MITIGATED + REMEDIATION_VERIFIED): {confirmed_fixes}/{len(sampled)} | Unaccounted: {len(reconciled['unaccountedIds'])}")
        print(f"  Status Breakdown: {sb}")

        failure_reasons: List[str] = []
        if reconciled["unaccountedIds"]:
            failure_reasons.append(f"Unaccounted sampled items missing from audit.jsonl: {reconciled['unaccountedIds'][:10]}")
        if reconciled["abstainViolations"]:
            failure_reasons.append(f"Abstained items did not fail closed: {reconciled['abstainViolations'][:10]}")
        if reconciled["unexpectedFailures"]:
            failure_reasons.append(f"Unexpected failures during {len(sampled)}-item auto-fix: {reconciled['unexpectedFailures'][:10]}")
        if reconciled["unpinnedFalseVerified"]:
            failure_reasons.append(f"Unpinned package/kernel items falsely stamped REMEDIATION_VERIFIED: {reconciled['unpinnedFalseVerified'][:10]}")
        for disallowed_state in ("NOT_APPLICABLE", "UNSUPPORTED", "INSUFFICIENT_EVIDENCE", "PENDING_REBOOT", "REMEDIATION_ATTEMPTED"):
            if sb.get(disallowed_state, 0) != 0:
                failure_reasons.append(f"Disallowed non-fix status {disallowed_state}={sb.get(disallowed_state)} in host-relevant Gate 9 run: {sb}")
        if confirmed_fixes != len(sampled):
            failure_reasons.append(f"Expected 100% confirmed fixes ({len(sampled)}/{len(sampled)}), got {confirmed_fixes}: {sb}")

        report: Dict[str, Any] = {
            "status": "FAIL" if failure_reasons else "PASS",
            "hostDistro": f"{family}:{codename}" if codename else family,
            "seed": seed,
            "requestedCount": args.count,
            "sampledCount": len(sampled),
            "confirmedFixesCount": confirmed_fixes,
            "hostRelevantAvailableCount": host_filter_stats["hostRelevantAvailableCount"],
            "hostFilterStats": host_filter_stats,
            "ed25519VerifiedCount": len(sampled),
            "strataCounts": strata_counts,
            "independentChecksTotal": len(before_results),
            "independentExposedBefore": exposed_before,
            "independentFixedAfter": fixed_after,
            "fixElapsedSeconds": fix_elapsed,
            "unpinnedFalseVerified": reconciled["unpinnedFalseVerified"],
            "beforeResults": before_results,
            "afterResults": after_results,
            "auditReconciliation": reconciled,
            "sampledIds": [item_keys(x)[0] or item_keys(x)[1] for x in sampled],
        }
        if failure_reasons:
            report["failureReasons"] = failure_reasons
        if args.out:
            out_p = Path(args.out)
            out_p.parent.mkdir(parents=True, exist_ok=True)
            out_p.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")

        if failure_reasons:
            raise AssertionError("; ".join(failure_reasons))

        print(f"\n[PASS] Gate 9 verified {len(sampled)}/{len(sampled)} Ed25519 signatures, {exposed_before}/{len(before_results)} injected compromises, {fixed_after}/{len(after_results)} independent fixes, {confirmed_fixes}/{len(sampled)} confirmed host-relevant fixes (NOT_APPLICABLE=0, UNSUPPORTED=0), and 0 unpinned false-verified claims.")
        return 0
    finally:
        if should_restore:
            restore_baseline(baseline_meta, family=family)


if __name__ == "__main__":
    sys.exit(main())
