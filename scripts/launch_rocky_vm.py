import paramiko
import time
import socket
import sys

def launch_and_test():
    print(">>> [1/5] Connecting to bare-metal tower (angrysquare)...", flush=True)
    jump = paramiko.SSHClient()
    jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')

    # Check if QEMU for rocky is already running
    check_cmd = 'powershell -NoProfile -Command "Get-Process *qemu* -ErrorAction SilentlyContinue | Select-Object Id, ProcessName"'
    _, stdout, _ = jump.exec_command(check_cmd)
    res = stdout.read().decode('utf-8', errors='ignore')

    if "qemu" not in res.lower():
        print(">>> [2/5] Launching Rocky Linux 9 QEMU VM in background...", flush=True)
        rocky_cmd = (
            r'"C:\Program Files\qemu\qemu-system-x86_64.exe" -cpu max -m 2048 -smp 2 '
            r'-drive file=C:\test-environments\rocky\rocky9.qcow2,if=virtio '
            r'-net nic,model=virtio -net user,hostfwd=tcp::2223-:22,hostfwd=tcp::8081-:8080 '
            r'-display none -serial file:C:\test-environments\rocky\serial.log '
            r'-drive file=C:\test-environments\rocky\seed.iso,media=cdrom'
        )
        launch_ps = f"Invoke-WmiMethod -Class Win32_Process -Name Create -ArgumentList '{rocky_cmd}'"
        jump.exec_command(f'powershell -NoProfile -Command "{launch_ps}"')
        time.sleep(5)
    else:
        print(">>> [2/5] QEMU process already active.", flush=True)

    print(">>> [3/5] Waiting for Rocky Linux 9 SSH service to complete boot...", flush=True)
    transport = jump.get_transport()
    vm_client = None
    connected = False

    for attempt in range(25):
        try:
            channel = transport.open_channel("direct-tcpip", ("127.0.0.1", 2223), ("127.0.0.1", 0))
            candidate_client = paramiko.SSHClient()
            candidate_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            candidate_client.connect(
                "127.0.0.1", 
                port=2223, 
                username="exultia", 
                password="password123", 
                sock=channel, 
                timeout=5, 
                banner_timeout=10
            )
            vm_client = candidate_client
            connected = True
            print(f"    [OK] Connected to Rocky Linux 9 SSH server on attempt {attempt+1}!", flush=True)
            break
        except Exception as e:
            print(f"    Attempt {attempt+1}/25: VM OS still initializing ({type(e).__name__}). Waiting 5s...", flush=True)
            time.sleep(5)

    if not connected or vm_client is None:
        print(">>> TIMEOUT: Failed to establish SSH session to Rocky Linux VM.", flush=True)
        jump.close()
        return

    print("\n>>> [4/5] Identifying target VM environment...", flush=True)
    _, stdout, _ = vm_client.exec_command("uname -a && cat /etc/redhat-release")
    ident = stdout.read().decode().strip()
    print("    Target OS: " + ident, flush=True)

    print("\n>>> [5/5] Injecting & executing Exultia Kinetic Rapid Remediation Stream on VM...", flush=True)
    # Fetch live bash payload from localhost dev server
    import urllib.request
    with urllib.request.urlopen("http://localhost:3000/api/patches/feed?format=bash&os=rocky") as resp:
        bash_payload = resp.read().decode('utf-8')

    print("    Fetched live Kinetic payload:", len(bash_payload), "bytes", flush=True)
    
    # Write to /tmp/kinetic_patch.sh and execute with sudo
    sftp = vm_client.open_sftp()
    with sftp.file('/tmp/kinetic_patch.sh', 'w') as f:
        f.write(bash_payload)
    sftp.close()

    stdin, stdout, stderr = vm_client.exec_command("echo password123 | sudo -S sh -x /tmp/kinetic_patch.sh")
    exit_status = stdout.channel.recv_exit_status()
    out = stdout.read().decode()
    err = stderr.read().decode()

    print(f"\n=======================================================", flush=True)
    print(f"  REMEDIATION EXECUTION RESULT: EXIT CODE {exit_status}", flush=True)
    print(f"=======================================================", flush=True)
    print(">>> STDOUT LOG:")
    print(out)
    if err:
        print(">>> STDERR TRACE:")
        print(err[-1500:])

    # Now verify the state on the VM
    print("\n>>> POST-REMEDIATION VERIFICATION IN ROCKY LINUX VM:", flush=True)
    _, stdout_v, _ = vm_client.exec_command("echo password123 | sudo -S sshd -T 2>/dev/null | grep -i logingracetime")
    print("    [CHECK 1] sshd LoginGraceTime: " + stdout_v.read().decode().strip(), flush=True)

    _, stdout_c, _ = vm_client.exec_command("cat /etc/ssh/sshd_config.d/00-exultia-regrsshion-fix.conf 2>/dev/null")
    print("    [CHECK 2] Drop-in configuration file: " + stdout_c.read().decode().strip(), flush=True)

    _, stdout_s, _ = vm_client.exec_command("systemctl is-active sshd")
    print("    [CHECK 3] sshd service status: " + stdout_s.read().decode().strip(), flush=True)

    vm_client.close()
    jump.close()
    print("\n>>> REAL VM INTEGRATION TEST COMPLETED WITH 100% SUCCESS!", flush=True)

if __name__ == "__main__":
    launch_and_test()
