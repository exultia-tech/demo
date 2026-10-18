import paramiko
import time

def restart_ubuntu():
    jump = paramiko.SSHClient()
    jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')
    
    print("Stopping hung Ubuntu process (PID 13476)...")
    jump.exec_command('taskkill /F /PID 13476')
    time.sleep(2)
    
    # Clear serial log
    jump.exec_command('cmd /c "type nul > C:\\test-environments\\ubuntu\\serial.log"')
    time.sleep(1)

    print("Launching fresh Ubuntu QEMU process...")
    ubuntu_cmd = (
        r'"C:\Program Files\qemu\qemu-system-x86_64.exe" -cpu max -m 2048 -smp 2 '
        r'-drive file=C:\test-environments\ubuntu\ubuntu24-overlay.qcow2,if=virtio '
        r'-net nic,model=virtio -net user,hostfwd=tcp::2222-:22,hostfwd=tcp::8082-:8080 '
        r'-display none -serial file:C:\test-environments\ubuntu\serial.log '
        r'-drive file=C:\test-environments\ubuntu\seed.iso,media=cdrom'
    )
    launch_ps = f"Invoke-WmiMethod -Class Win32_Process -Name Create -ArgumentList '{ubuntu_cmd}'"
    _, stdout, stderr = jump.exec_command(f'powershell -NoProfile -Command "{launch_ps}"')
    print("Launch output:", stdout.read().decode('utf-8', errors='ignore').strip()[:150])

    print("Waiting for Ubuntu to boot...")
    transport = jump.get_transport()
    connected = False
    for attempt in range(20):
        time.sleep(4)
        try:
            chan = transport.open_channel('direct-tcpip', ('127.0.0.1', 2222), ('127.0.0.1', 0))
            vm = paramiko.SSHClient()
            vm.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            vm.connect('127.0.0.1', port=2222, username='exultia', password='password123', sock=chan, timeout=3, banner_timeout=5)
            print(f"Connected to Ubuntu on attempt {attempt+1}!")
            _, stdout, _ = vm.exec_command('uname -a')
            print("System:", stdout.read().decode().strip())
            vm.close()
            connected = True
            break
        except Exception as e:
            print(f"Attempt {attempt+1}: {e}")

    jump.close()
    return connected

if __name__ == '__main__':
    restart_ubuntu()
