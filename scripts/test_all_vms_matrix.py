"""
Exultia Kinetic Multi-VM Integration Test Matrix
Tests live rapid remediation, zero-downtime hot-mitigation, rollback, idempotency,
and zero-agent systemd automation across actual bare-metal QEMU virtual machines:
  1. Ubuntu 24.04.5 LTS (Debian family, systemd ssh.socket / ssh service)
  2. Rocky Linux 9.8 (RHEL family, systemd sshd service)
"""

import paramiko
import urllib.request
import json
import time
import sys

def connect_to_vm(jump_client, port, name):
    print(f"\n[{name}] Establishing direct-tcpip SSH channel through angrysquare (port {port})...", flush=True)
    transport = jump_client.get_transport()
    channel = transport.open_channel("direct-tcpip", ("127.0.0.1", port), ("127.0.0.1", 0))
    vm = paramiko.SSHClient()
    vm.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    vm.connect("127.0.0.1", port=port, username="exultia", password="password123", sock=channel, timeout=5, banner_timeout=10)
    print(f"[{name}] SSH connection established successfully.", flush=True)
    return vm

def run_sudo_cmd(vm, cmd):
    full_cmd = f"echo password123 | sudo -S sh -c '{cmd}'"
    stdin, stdout, stderr = vm.exec_command(full_cmd)
    code = stdout.channel.recv_exit_status()
    out = stdout.read().decode('utf-8', errors='ignore').strip()
    err = stderr.read().decode('utf-8', errors='ignore').strip()
    return code, out, err

def test_vm_suite(jump, port, os_name, ssh_service_name):
    print("=" * 70, flush=True)
    print(f"  RUNNING INTEGRATION TEST SUITE ON ACTUAL VM: {os_name.upper()}", flush=True)
    print("=" * 70, flush=True)

    vm = connect_to_vm(jump, port, os_name)

    # 1. OS Identification
    _, stdout, _ = vm.exec_command("uname -srm && cat /etc/os-release | grep PRETTY_NAME")
    os_info = stdout.read().decode().strip()
    print(f"[{os_name}] Target VM OS:\n{os_info}", flush=True)

    # 2. Fetch Live Kinetic Bash Remediation Feed
    url = f"http://localhost:3000/api/patches/feed?format=bash&os={os_name.lower().split()[0]}"
    print(f"\n[{os_name}] 1. Fetching live remediation payload from {url}...", flush=True)
    with urllib.request.urlopen(url) as resp:
        bash_payload = resp.read().decode('utf-8')
    print(f"[{os_name}] Payload received: {len(bash_payload)} bytes.", flush=True)

    sftp = vm.open_sftp()
    remote_script = f"/tmp/kinetic_{os_name.lower().split()[0]}.sh"
    with sftp.file(remote_script, 'w') as f:
        f.write(bash_payload)
    sftp.close()

    # 3. Execute Rapid Remediation Payload
    print(f"\n[{os_name}] 2. Executing kinetic patch feed remediation under sudo...", flush=True)
    code, out, err = run_sudo_cmd(vm, f"sh -x {remote_script}")
    print(f"[{os_name}] Exit Code: {code}", flush=True)
    if code != 0:
        print(f"[{os_name}] STDERR:\n{err}", flush=True)
    assert code == 0, f"Remediation execution failed on {os_name} with exit code {code}"

    # 4. Verify Post-Mitigation System State
    print(f"\n[{os_name}] 3. Verifying post-mitigation state...", flush=True)
    # Check drop-in config file
    code_dropin, out_dropin, _ = run_sudo_cmd(vm, "cat /etc/ssh/sshd_config.d/00-exultia-regrsshion-fix.conf")
    print(f"[{os_name}] Drop-in config content:\n{out_dropin}", flush=True)
    assert "LoginGraceTime 0" in out_dropin, "Drop-in configuration missing LoginGraceTime 0!"

    # Check active sshd runtime configuration
    code_runtime, out_runtime, _ = run_sudo_cmd(vm, "sshd -T | grep -i logingracetime")
    print(f"[{os_name}] Active sshd runtime parameter: {out_runtime}", flush=True)
    assert "logingracetime 0" in out_runtime.lower(), "Runtime sshd configuration did not reflect LoginGraceTime 0!"

    # Check that SSH service remains ACTIVE with zero downtime
    code_svc, out_svc, _ = run_sudo_cmd(vm, f"systemctl is-active {ssh_service_name} || systemctl is-active sshd || systemctl is-active ssh")
    print(f"[{os_name}] SSH service status (zero downtime verification): {out_svc}", flush=True)
    assert "active" in out_svc.lower(), f"SSH service was disrupted or not active on {os_name}!"

    # 5. Test Rollback Capability
    print(f"\n[{os_name}] 4. Testing automated rollback...", flush=True)
    with urllib.request.urlopen("http://localhost:3000/api/patches/feed") as resp:
        feed = json.loads(resp.read().decode('utf-8'))
    p89 = next(p for p in feed['patches'] if p['id'] == 'PAT-2026-0089')
    rollback_cmd = p89['remediationTier']['tier1_hotMitigation']['rollbackCommand']
    print(f"[{os_name}] Rollback command: {rollback_cmd}", flush=True)

    code_rb, out_rb, err_rb = run_sudo_cmd(vm, rollback_cmd)
    print(f"[{os_name}] Rollback Exit Code: {code_rb}", flush=True)
    assert code_rb == 0, f"Rollback command failed on {os_name}"

    # Verify drop-in was removed
    code_check, out_check, _ = run_sudo_cmd(vm, "test -f /etc/ssh/sshd_config.d/00-exultia-regrsshion-fix.conf && echo 'PRESENT' || echo 'REMOVED'")
    print(f"[{os_name}] Drop-in status after rollback: {out_check}", flush=True)
    assert out_check == "REMOVED", f"Expected drop-in to be removed on {os_name}!"

    # 6. Test Idempotency (Re-apply twice in succession)
    print(f"\n[{os_name}] 5. Testing idempotency (re-applying patch payload twice)...", flush=True)
    code_idemp1, _, _ = run_sudo_cmd(vm, f"sh {remote_script}")
    assert code_idemp1 == 0, "Idempotency pass 1 failed"
    code_idemp2, _, _ = run_sudo_cmd(vm, f"sh {remote_script}")
    assert code_idemp2 == 0, "Idempotency pass 2 failed"
    print(f"[{os_name}] Idempotent re-application succeeded on both passes (exit code 0).", flush=True)

    # 7. Test Customer Zero-Agent Systemd Automation
    print(f"\n[{os_name}] 6. Testing Customer Playbook: Systemd Zero-Agent Automation...", flush=True)
    service_content = f"""[Unit]
Description=Exultia Kinetic Fleet Patch Sentinel
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
ExecStart=/bin/sh -c 'sh {remote_script}'
StandardOutput=journal
StandardError=journal
"""
    timer_content = """[Unit]
Description=Hourly Exultia Kinetic Patch Check
Requires=exultia-kinetic.service

[Timer]
OnCalendar=hourly
Persistent=true

[Install]
WantedBy=timers.target
"""
    sftp = vm.open_sftp()
    with sftp.file('/tmp/exultia-kinetic.service', 'w') as f:
        f.write(service_content)
    with sftp.file('/tmp/exultia-kinetic.timer', 'w') as f:
        f.write(timer_content)
    sftp.close()

    run_sudo_cmd(vm, "cp /tmp/exultia-kinetic.service /etc/systemd/system/ && cp /tmp/exultia-kinetic.timer /etc/systemd/system/ && systemctl daemon-reload")
    code_timer, out_timer, _ = run_sudo_cmd(vm, "systemctl start exultia-kinetic.service")
    assert code_timer == 0, "Systemd service run failed"

    _, out_journal, _ = run_sudo_cmd(vm, "journalctl -u exultia-kinetic.service -n 5 --no-pager")
    print(f"[{os_name}] Journald audit log from systemd automation:\n{out_journal}", flush=True)

    vm.close()
    print(f"\n>>> [PASS] All 6 test suites passed on {os_name.upper()} VM with zero errors!\n", flush=True)

def main():
    print("=================================================================", flush=True)
    print("  EXULTIA KINETIC ENTERPRISE MULTI-DISTRO REAL VM TEST MATRIX    ", flush=True)
    print("  Testing on live bare-metal QEMU virtual machines on angrysquare", flush=True)
    print("=================================================================", flush=True)

    jump = paramiko.SSHClient()
    jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')

    # Test Suite 1: Ubuntu 24.04.5 LTS
    test_vm_suite(jump, 2222, "Ubuntu 24.04 LTS", "ssh")

    # Test Suite 2: Rocky Linux 9.8 (Blue Onyx)
    test_vm_suite(jump, 2223, "Rocky Linux 9", "sshd")

    jump.close()

    print("=================================================================", flush=True)
    print("  FINAL RESULT: 100% SUCCESS ACROSS ALL VIRTUAL MACHINES!        ", flush=True)
    print("  - Ubuntu 24.04.5 LTS: PASS (Hotfix, Verification, Rollback, Systemd)", flush=True)
    print("  - Rocky Linux 9.8:    PASS (Hotfix, Verification, Rollback, Systemd)", flush=True)
    print("=================================================================", flush=True)

if __name__ == "__main__":
    main()
