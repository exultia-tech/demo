import paramiko
import time

def setup_and_launch_ubuntu():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')

    print(">>> 1. Checking and killing any stray Ubuntu QEMU processes...")
    # Kill any process listening on 2222 or running ubuntu24
    kill_cmd = 'powershell -NoProfile -Command "Get-Process *qemu* -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -like \'*ubuntu*\' -or $_.CommandLine -like \'*2222*\' } | Stop-Process -Force -ErrorAction SilentlyContinue"'
    client.exec_command(kill_cmd)
    time.sleep(2)

    print(">>> 2. Removing old 3.5G ubuntu24.qcow2 and creating fresh 25G overlay disk...")
    # Remove old overlay
    client.exec_command('cmd /c del /f /q C:\\test-environments\\ubuntu\\ubuntu24.qcow2')
    time.sleep(1)

    # Create new 25G overlay
    create_cmd = r'"C:\Program Files\qemu\qemu-img.exe" create -f qcow2 -b C:\test-environments\ubuntu\ubuntu24-base.img -F qcow2 C:\test-environments\ubuntu\ubuntu24.qcow2 25G'
    stdin, stdout, stderr = client.exec_command(create_cmd)
    print("    Create output:", stdout.read().decode().strip())
    print("    Create stderr:", stderr.read().decode().strip())

    print(">>> 3. Regenerating cloud-init seed.iso with pycdlib...")
    seed_cmd = 'py -c "import sys; sys.path.append(r\'C:\\test-environments\\scripts\'); from manage_vms import create_cloud_init_iso; from pathlib import Path; create_cloud_init_iso(Path(r\'C:\\test-environments\\ubuntu\\seed.iso\'), \'ubuntu-test\', \'exultia\', \'password123\')"'
    stdin, stdout, stderr = client.exec_command(seed_cmd)
    print("    Seed generation:", stdout.read().decode().strip())

    print(">>> 4. Starting Ubuntu 24.04 QEMU VM...")
    qemu_cmd = (
        r'"C:\Program Files\qemu\qemu-system-x86_64.exe" -cpu max -m 3072 -smp 4 '
        r'-drive file=C:\test-environments\ubuntu\ubuntu24.qcow2,if=virtio '
        r'-net nic,model=virtio -net user,hostfwd=tcp::2222-:22,hostfwd=tcp::8080-:8080 '
        r'-display none -serial file:C:\test-environments\ubuntu\serial.log '
        r'-drive file=C:\test-environments\ubuntu\seed.iso,media=cdrom'
    )
    launch_ps = f"Invoke-WmiMethod -Class Win32_Process -Name Create -ArgumentList '{qemu_cmd}'"
    stdin, stdout, stderr = client.exec_command(f'powershell -NoProfile -Command "{launch_ps}"')
    res = stdout.read().decode().strip()
    print("    WMI Launch Result:", res[:200])

    print(">>> 5. Waiting for Ubuntu 24.04 to boot and accept SSH connections (port 2222)...")
    transport = client.get_transport()
    connected = False
    vm_client = None

    for attempt in range(35):
        time.sleep(5)
        try:
            channel = transport.open_channel("direct-tcpip", ("127.0.0.1", 2222), ("127.0.0.1", 0))
            candidate = paramiko.SSHClient()
            candidate.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            candidate.connect("127.0.0.1", port=2222, username="exultia", password="password123", sock=channel, timeout=5, banner_timeout=10)
            vm_client = candidate
            connected = True
            print(f"    [SUCCESS] Connected to Ubuntu 24.04 VM SSH server on attempt {attempt+1}!")
            break
        except Exception as e:
            # Let's peek at serial log every 3 attempts
            if (attempt + 1) % 3 == 0:
                _, s_out, _ = client.exec_command('powershell -NoProfile -Command "Get-Content C:\\test-environments\\ubuntu\\serial.log -Tail 3"')
                tail = s_out.read().decode('utf-8', errors='ignore').strip()
                print(f"    Attempt {attempt+1}: waiting for cloud-init/sshd... (serial: {tail[-120:] if tail else 'empty'})")

    if connected and vm_client:
        print("\n>>> 6. Inspecting booted Ubuntu VM disk space & OS:")
        _, out_df, _ = vm_client.exec_command("df -h /")
        print("    Disk Space:\n" + out_df.read().decode().strip())
        _, out_os, _ = vm_client.exec_command("cat /etc/os-release | grep PRETTY_NAME")
        print("    OS Release: " + out_os.read().decode().strip())
        vm_client.close()

    client.close()

if __name__ == "__main__":
    setup_and_launch_ubuntu()
