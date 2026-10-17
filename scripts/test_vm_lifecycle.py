import paramiko
import time
import urllib.request

def test_lifecycle():
    print("=================================================================", flush=True)
    print("  EXULTIA KINETIC VM LIFECYCLE & IDEMPOTENCY INTEGRATION TEST   ", flush=True)
    print("  Target: Rocky Linux 9.8 (Blue Onyx) QEMU VM @ angrysquare      ", flush=True)
    print("=================================================================", flush=True)

    jump = paramiko.SSHClient()
    jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')

    transport = jump.get_transport()
    channel = transport.open_channel("direct-tcpip", ("127.0.0.1", 2223), ("127.0.0.1", 0))

    vm = paramiko.SSHClient()
    vm.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    vm.connect("127.0.0.1", port=2223, username="exultia", password="password123", sock=channel)

    print(">>> [TEST 1: ROLLBACK EXECUTION] Testing automated rollback command...", flush=True)
    # Fetch rollback command for PAT-2026-0089 from live feed JSON
    import json
    with urllib.request.urlopen("http://localhost:3000/api/patches/feed") as resp:
        feed = json.loads(resp.read().decode('utf-8'))
    
    p89 = next(p for p in feed['patches'] if p['id'] == 'PAT-2026-0089')
    rollback_cmd = p89['remediationTier']['tier1_hotMitigation']['rollbackCommand']
    print("    Rollback command:", rollback_cmd, flush=True)

    stdin, stdout, stderr = vm.exec_command(f"echo password123 | sudo -S {rollback_cmd}")
    code = stdout.channel.recv_exit_status()
    print("    Rollback exit code:", code, flush=True)

    # Check that drop-in was removed
    _, stdout, _ = vm.exec_command("test -f /etc/ssh/sshd_config.d/00-exultia-regrsshion-fix.conf && echo 'EXISTS' || echo 'REMOVED'")
    dropin_status = stdout.read().decode().strip()
    print("    Drop-in file status:", dropin_status, flush=True)
    assert dropin_status == 'REMOVED', "Expected drop-in to be removed on rollback!"

    print(">>> [TEST 2: IDEMPOTENT RE-APPLICATION] Re-running patch feed twice...", flush=True)
    with urllib.request.urlopen("http://localhost:3000/api/patches/feed?format=bash&os=rocky") as resp:
        bash_script = resp.read().decode('utf-8')

    sftp = vm.open_sftp()
    with sftp.file('/tmp/kinetic_reapply.sh', 'w') as f:
        f.write(bash_script)
    sftp.close()

    # Pass 1
    stdin, stdout, stderr = vm.exec_command("echo password123 | sudo -S sh /tmp/kinetic_reapply.sh")
    pass1_code = stdout.channel.recv_exit_status()
    print("    Pass 1 application exit code:", pass1_code, flush=True)
    assert pass1_code == 0, "Pass 1 should exit 0"

    # Pass 2 (immediate repeat to test idempotency)
    stdin, stdout, stderr = vm.exec_command("echo password123 | sudo -S sh /tmp/kinetic_reapply.sh")
    pass2_code = stdout.channel.recv_exit_status()
    print("    Pass 2 application exit code (idempotency check):", pass2_code, flush=True)
    assert pass2_code == 0, "Pass 2 should exit 0 without errors"

    print(">>> [TEST 3: SYSTEMD SERVICE UPTIME] Verifying sshd active state...", flush=True)
    _, stdout, _ = vm.exec_command("systemctl is-active sshd")
    sshd_state = stdout.read().decode().strip()
    print("    SSHD service status:", sshd_state, flush=True)
    assert sshd_state == 'active', "sshd should be active!"

    _, stdout, _ = vm.exec_command("echo password123 | sudo -S sshd -T | grep -i logingracetime")
    print("    Active sshd LoginGraceTime:", stdout.read().decode().strip(), flush=True)

    vm.close()
    jump.close()
    print("\n>>> ALL VM LIFECYCLE, ROLLBACK, AND IDEMPOTENCY TESTS PASSED WITH 100% SUCCESS!", flush=True)

if __name__ == "__main__":
    test_lifecycle()
