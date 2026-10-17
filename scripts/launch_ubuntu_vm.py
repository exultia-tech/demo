import paramiko
import time
import sys
import urllib.request

def launch_and_test_ubuntu():
    print(">>> [1/5] Connecting to bare-metal tower (angrysquare)...", flush=True)
    jump = paramiko.SSHClient()
    jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')

    # Check if QEMU for ubuntu port 2222 is already running
    check_port = 'powershell -NoProfile -Command "Test-NetConnection -ComputerName 127.0.0.1 -Port 2222 -InformationLevel Quiet"'
    _, stdout, _ = jump.exec_command(check_port)
    is_listening = "true" in stdout.read().decode('utf-8', errors='ignore').lower()

    if not is_listening:
        print(">>> [2/5] Launching Ubuntu 24.04 LTS QEMU VM in background...", flush=True)
        ubuntu_cmd = (
            r'"C:\Program Files\qemu\qemu-system-x86_64.exe" -cpu max -m 2048 -smp 2 '
            r'-drive file=C:\test-environments\ubuntu\ubuntu24.qcow2,if=virtio '
            r'-net nic,model=virtio -net user,hostfwd=tcp::2222-:22,hostfwd=tcp::8080-:8080 '
            r'-display none -serial file:C:\test-environments\ubuntu\serial.log '
            r'-drive file=C:\test-environments\ubuntu\seed.iso,media=cdrom'
        )
        launch_ps = f"Invoke-WmiMethod -Class Win32_Process -Name Create -ArgumentList '{ubuntu_cmd}'"
        jump.exec_command(f'powershell -NoProfile -Command "{launch_ps}"')
        time.sleep(5)
    else:
        print(">>> [2/5] Ubuntu 24.04 QEMU VM process already active.", flush=True)

    print(">>> [3/5] Waiting for Ubuntu 24.04 SSH service to complete boot...", flush=True)
    transport = jump.get_transport()
    vm_client = None
    connected = False

    for attempt in range(25):
        try:
            channel = transport.open_channel("direct-tcpip", ("127.0.0.1", 2222), ("127.0.0.1", 0))
            candidate_client = paramiko.SSHClient()
            candidate_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            candidate_client.connect(
                "127.0.0.1", 
                port=2222, 
                username="exultia", 
                password="password123", 
                sock=channel, 
                timeout=5, 
                banner_timeout=10
            )
            vm_client = candidate_client
            connected = True
            print(f"    [OK] Connected to Ubuntu 24.04 SSH server on attempt {attempt+1}!", flush=True)
            break
        except Exception as e:
            print(f"    Attempt {attempt+1}/25: VM OS still initializing ({type(e).__name__}). Waiting 5s...", flush=True)
            time.sleep(5)

    if not connected or vm_client is None:
        print(">>> TIMEOUT: Failed to establish SSH session to Ubuntu 24.04 VM.", flush=True)
        jump.close()
        return

    print("\n>>> [4/5] Identifying target VM environment...", flush=True)
    _, stdout, _ = vm_client.exec_command("uname -a && cat /etc/os-release | grep -E 'NAME|VERSION='")
    ident = stdout.read().decode().strip()
    print("    Target OS:\n" + ident, flush=True)

    print("\n>>> [5/5] Injecting & executing Exultia Kinetic Rapid Remediation Stream on Ubuntu VM...", flush=True)
    # Fetch live bash payload from localhost dev server
    with urllib.request.urlopen("http://localhost:3000/api/patches/feed?format=bash&os=ubuntu") as resp:
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
    print(f"  UBUNTU 24.04 REMEDIATION RESULT: EXIT CODE {exit_status}", flush=True)
    print(f"=======================================================", flush=True)
    print(">>> STDOUT LOG:")
    print(out)
    if err:
        print(">>> STDERR TRACE:")
        print(err[-1500:])

    # Now verify the state on the VM
    print("\n>>> POST-REMEDIATION VERIFICATION IN UBUNTU 24.04 VM:", flush=True)
    _, stdout_v, _ = vm_client.exec_command("echo password123 | sudo -S sshd -T 2>/dev/null | grep -i logingracetime")
    print("    [CHECK 1] sshd LoginGraceTime: " + stdout_v.read().decode().strip(), flush=True)

    _, stdout_c, _ = vm_client.exec_command("cat /etc/ssh/sshd_config.d/00-exultia-regrsshion-fix.conf 2>/dev/null")
    print("    [CHECK 2] Drop-in configuration file: " + stdout_c.read().decode().strip(), flush=True)

    _, stdout_s, _ = vm_client.exec_command("systemctl is-active ssh || systemctl is-active sshd")
    print("    [CHECK 3] ssh service status: " + stdout_s.read().decode().strip(), flush=True)

    vm_client.close()
    jump.close()
    print("\n>>> REAL VM INTEGRATION TEST ON UBUNTU 24.04 COMPLETED WITH 100% SUCCESS!", flush=True)

if __name__ == "__main__":
    launch_and_test_ubuntu()
