import paramiko
import time

def launch_ubuntu():
    print(">>> 1. Connecting to angrysquare...")
    jump = paramiko.SSHClient()
    jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')

    # Check if port 2222 is listening
    check_port = 'powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 2222 -ErrorAction SilentlyContinue"'
    _, stdout, _ = jump.exec_command(check_port)
    out = stdout.read().decode('utf-8', errors='ignore').strip()

    if not out:
        print(">>> 2. Launching Ubuntu 24.04 QEMU VM with 30GB overlay...")
        # Clear serial log so we see fresh boot
        jump.exec_command('cmd /c "type nul > C:\\test-environments\\ubuntu\\serial.log"')
        time.sleep(1)

        ubuntu_cmd = (
            r'"C:\Program Files\qemu\qemu-system-x86_64.exe" -cpu max -m 2048 -smp 2 '
            r'-drive file=C:\test-environments\ubuntu\ubuntu24-overlay.qcow2,if=virtio '
            r'-net nic,model=virtio -net user,hostfwd=tcp::2222-:22,hostfwd=tcp::8080-:8080 '
            r'-display none -serial file:C:\test-environments\ubuntu\serial.log '
            r'-drive file=C:\test-environments\ubuntu\seed.iso,media=cdrom'
        )
        launch_ps = f"Invoke-WmiMethod -Class Win32_Process -Name Create -ArgumentList '{ubuntu_cmd}'"
        _, stdout, _ = jump.exec_command(f'powershell -NoProfile -Command "{launch_ps}"')
        print("    WMI launch result:\n" + stdout.read().decode('utf-8', errors='ignore').strip()[:200])
        time.sleep(5)
    else:
        print(">>> 2. Ubuntu 24.04 VM is already listening on port 2222.")

    print(">>> 3. Checking QEMU processes...")
    _, stdout, _ = jump.exec_command('powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \\"Name like \'%qemu%\'\\" | Format-Table ProcessId, CommandLine"')
    print(stdout.read().decode('utf-8', errors='ignore'))

    print(">>> 4. Polling SSH port 2222 with serial log monitoring...")
    transport = jump.get_transport()
    vm_client = None
    connected = False

    for attempt in range(25):
        time.sleep(5)
        try:
            channel = transport.open_channel("direct-tcpip", ("127.0.0.1", 2222), ("127.0.0.1", 0))
            candidate = paramiko.SSHClient()
            candidate.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            candidate.connect("127.0.0.1", port=2222, username="exultia", password="password123", sock=channel, timeout=4, banner_timeout=8)
            vm_client = candidate
            connected = True
            print(f"    [CONNECTED!] Successfully logged into Ubuntu 24.04 VM via SSH on attempt {attempt+1}!")
            break
        except Exception:
            _, s_out, _ = jump.exec_command('powershell -NoProfile -Command "Get-Content C:\\test-environments\\ubuntu\\serial.log -Tail 2"')
            tail = s_out.read().decode('utf-8', errors='ignore').strip()
            print(f"    Attempt {attempt+1}/25: Booting... Last log: {tail[-100:] if tail else 'starting...'}")

    if connected and vm_client:
        print("\n>>> 5. Gathering Ubuntu 24.04 VM System Info:")
        _, stdout, _ = vm_client.exec_command("uname -a && cat /etc/os-release | grep PRETTY_NAME && df -h /")
        print(stdout.read().decode('utf-8', errors='ignore'))
        vm_client.close()

    jump.close()

if __name__ == "__main__":
    launch_ubuntu()
