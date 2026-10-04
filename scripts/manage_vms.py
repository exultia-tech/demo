"""
Exultia Test Environment Manager
Controls local QEMU virtual machines on angrysquare for multi-OS compatibility testing.
Supported targets:
  - Ubuntu 24.04 LTS (x86_64)
  - Rocky Linux 9 (x86_64)
  - FreeBSD 14.5 (x86_64)
  - Ancient UNIX SVR4 / Solaris / POSIX reference (i386 / SPARC / x86_64)
"""

import os
import sys
import io
import time
import socket
import subprocess
import argparse
from pathlib import Path

BASE_DIR = Path("C:/test-environments")
QEMU_DIR = Path("C:/Program Files/qemu")
QEMU_SYSTEM_X86 = QEMU_DIR / "qemu-system-x86_64.exe"
QEMU_SYSTEM_I386 = QEMU_DIR / "qemu-system-i386.exe"
QEMU_IMG = QEMU_DIR / "qemu-img.exe"

VM_CONFIGS = {
    "rocky": {
        "dir": BASE_DIR / "rocky",
        "disk": BASE_DIR / "rocky" / "rocky9.qcow2",
        "base_disk": BASE_DIR / "rocky" / "rocky9-base.qcow2",
        "seed_iso": BASE_DIR / "rocky" / "seed.iso",
        "ssh_port": 2223,
        "api_port": 8081,
        "ram": "2048",
        "smp": "2",
        "arch": "x86_64",
        "user": "exultia",
        "url": "https://download.rockylinux.org/pub/rocky/9/images/x86_64/Rocky-9-GenericCloud-Base.latest.x86_64.qcow2"
    },
    "ubuntu": {
        "dir": BASE_DIR / "ubuntu",
        "disk": BASE_DIR / "ubuntu" / "ubuntu24.qcow2",
        "base_disk": BASE_DIR / "ubuntu" / "ubuntu24-base.img",
        "seed_iso": BASE_DIR / "ubuntu" / "seed.iso",
        "ssh_port": 2222,
        "api_port": 8080,
        "ram": "2048",
        "smp": "2",
        "arch": "x86_64",
        "user": "exultia",
        "url": "https://cloud-images.ubuntu.com/releases/24.04/release/ubuntu-24.04-server-cloudimg-amd64.img"
    },
    "freebsd": {
        "dir": BASE_DIR / "freebsd",
        "disk": BASE_DIR / "freebsd" / "freebsd14.qcow2",
        "base_disk": BASE_DIR / "freebsd" / "freebsd14-base.qcow2",
        "seed_iso": None,
        "ssh_port": 2224,
        "api_port": None,
        "ram": "2048",
        "smp": "2",
        "arch": "x86_64",
        "user": "root",
        "url": "https://download.freebsd.org/releases/VM-IMAGES/14.5-RELEASE/amd64/Latest/FreeBSD-14.5-RELEASE-amd64.qcow2.xz"
    },
    "unix-svr4": {
        "dir": BASE_DIR / "unix-svr4",
        "disk": BASE_DIR / "unix-svr4" / "svr4.qcow2",
        "base_disk": None,
        "seed_iso": None,
        "ssh_port": 2225,
        "api_port": None,
        "ram": "128",
        "smp": "1",
        "arch": "i386",
        "user": "root",
        "url": None
    }
}


def create_cloud_init_iso(output_iso_path: Path, hostname: str, username: str = "exultia", password: str = "exultia"):
    """Creates a standard cloud-init NoCloud ISO (volume label cidata) using pycdlib."""
    import pycdlib

    user_data = f"""#cloud-config
preserve_hostname: false
hostname: {hostname}
fqdn: {hostname}.local
users:
  - default
  - name: {username}
    gecos: Exultia Test User
    sudo: ALL=(ALL) NOPASSWD:ALL
    lock_passwd: false
    passwd: "$6$rounds=4096$exultiasalt$sM6XhRk8V7b7QoT2Zf9D1v1.gV7K4S3/k4F6c8hY7a6a4P4k0T8d4Q8y4R8c0W4e4"
    shell: /bin/bash
chpasswd:
  list: |
    {username}:{password}
    root:{password}
  expire: False
ssh_pwauth: True
disable_root: false
ssh_authorized_keys: []
runcmd:
  - systemctl enable ssh || systemctl enable sshd
  - systemctl start ssh || systemctl start sshd
""".encode("utf-8")

    meta_data = f"""instance-id: exultia-{hostname}-01
local-hostname: {hostname}
""".encode("utf-8")

    iso = pycdlib.PyCdlib()
    iso.new(interchange_level=1, joliet=3, rock_ridge="1.09", vol_ident="cidata")
    iso.add_fp(io.BytesIO(user_data), len(user_data), "/USERDATA.;1", rr_name="user-data", joliet_path="/user-data")
    iso.add_fp(io.BytesIO(meta_data), len(meta_data), "/METADATA.;1", rr_name="meta-data", joliet_path="/meta-data")
    output_iso_path.parent.mkdir(parents=True, exist_ok=True)
    if output_iso_path.exists():
        output_iso_path.unlink()
    iso.write(str(output_iso_path))
    iso.close()
    print(f"Generated cloud-init ISO: {output_iso_path}")


def prepare_overlay_disk(cfg: dict):
    """Creates a copy-on-write overlay disk using qemu-img from base image if not exists."""
    disk = cfg["disk"]
    base = cfg["base_disk"]
    if not disk.exists() and base and base.exists():
        print(f"Creating overlay disk {disk} backed by {base}...")
        cmd = [str(QEMU_IMG), "create", "-f", "qcow2", "-F", "qcow2", "-b", str(base), str(disk)]
        subprocess.run(cmd, check=True)
    elif not disk.exists() and not base:
        print(f"Base disk for {cfg} does not exist.")


def is_port_listening(port: int, host: str = "127.0.0.1") -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(1.0)
        return s.connect_ex((host, port)) == 0


def get_pid_file(name: str) -> Path:
    return VM_CONFIGS[name]["dir"] / "qemu.pid"


def is_vm_running(name: str) -> bool:
    pid_file = get_pid_file(name)
    if not pid_file.exists():
        return False
    try:
        pid = int(pid_file.read_text().strip())
        res = subprocess.run(["tasklist", "/FI", f"PID eq {pid}", "/FO", "CSV"], capture_output=True, text=True)
        if str(pid) in res.stdout and "qemu" in res.stdout.lower():
            return True
        else:
            pid_file.unlink(missing_ok=True)
            return False
    except Exception:
        return False


def start_vm(name: str):
    if name not in VM_CONFIGS:
        print(f"Unknown VM: {name}")
        return

    cfg = VM_CONFIGS[name]
    if is_vm_running(name):
        print(f"VM '{name}' is already running!")
        return

    prepare_overlay_disk(cfg)
    disk = cfg["disk"]
    if not disk.exists():
        print(f"Disk {disk} does not exist. Please download/prepare base image first.")
        return

    if cfg["seed_iso"]:
        create_cloud_init_iso(cfg["seed_iso"], hostname=f"{name}-test", username=cfg["user"], password="password123")

    binary = QEMU_SYSTEM_X86 if cfg["arch"] == "x86_64" else QEMU_SYSTEM_I386

    net_fwd = f"hostfwd=tcp::{cfg['ssh_port']}-:22"
    if cfg.get("api_port"):
        net_fwd += f",hostfwd=tcp::{cfg['api_port']}-:8080"

    cmd = [
        str(binary),
        "-m", cfg["ram"],
        "-smp", cfg["smp"],
        "-drive", f"file={disk},if=virtio",
        "-net", "nic,model=virtio",
        "-net", f"user,{net_fwd}",
        "-display", "none",
        "-serial", f"file:{cfg['dir']}/serial.log"
    ]

    if cfg["seed_iso"] and cfg["seed_iso"].exists():
        cmd.extend(["-drive", f"file={cfg['seed_iso']},media=cdrom"])

    log_path = cfg["dir"] / "console.log"
    log_file = open(log_path, "w")

    print(f"Launching {name} VM in background...")
    proc = subprocess.Popen(cmd, stdout=log_file, stderr=subprocess.STDOUT)
    get_pid_file(name).write_text(str(proc.pid))
    print(f"VM '{name}' started with PID {proc.pid}. SSH forwarded to 127.0.0.1:{cfg['ssh_port']}.")


def stop_vm(name: str):
    pid_file = get_pid_file(name)
    if not pid_file.exists():
        print(f"VM '{name}' is not running.")
        return
    try:
        pid = int(pid_file.read_text().strip())
        print(f"Stopping VM '{name}' (PID: {pid})...")
        subprocess.run(["taskkill", "/F", "/PID", str(pid)], capture_output=True)
        pid_file.unlink(missing_ok=True)
        print(f"VM '{name}' stopped.")
    except Exception as e:
        print(f"Error stopping VM '{name}': {e}")


def status():
    print(f"{'VM Name':<12} | {'Status':<10} | {'SSH Port':<10} | {'PID':<8} | {'Port Open'}")
    print("-" * 55)
    for name, cfg in VM_CONFIGS.items():
        running = is_vm_running(name)
        pid = get_pid_file(name).read_text().strip() if running else "-"
        ssh_port = cfg["ssh_port"]
        port_open = is_port_listening(ssh_port)
        status_str = "RUNNING" if running else "STOPPED"
        print(f"{name:<12} | {status_str:<10} | {ssh_port:<10} | {pid:<8} | {'YES' if port_open else 'NO'}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Exultia VM Manager")
    parser.add_argument("action", choices=["start", "stop", "status", "prepare"], help="Action to perform")
    parser.add_argument("vm", nargs="?", choices=list(VM_CONFIGS.keys()) + ["all"], default="all", help="Target VM")
    args = parser.parse_args()

    if args.action == "status":
        status()
    elif args.action == "start":
        vms = list(VM_CONFIGS.keys()) if args.vm == "all" else [args.vm]
        for v in vms:
            start_vm(v)
    elif args.action == "stop":
        vms = list(VM_CONFIGS.keys()) if args.vm == "all" else [args.vm]
        for v in vms:
            stop_vm(v)
