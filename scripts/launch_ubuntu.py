import paramiko
import time

jump = paramiko.SSHClient()
jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')

ubuntu_cmd = (
    r'"C:\Program Files\qemu\qemu-system-x86_64.exe" -cpu max -m 2048 -smp 2 '
    r'-drive file=C:\test-environments\ubuntu\ubuntu24-overlay.qcow2,if=virtio '
    r'-net nic,model=virtio -net user,hostfwd=tcp::2222-:22,hostfwd=tcp::8082-:8080 '
    r'-display none -serial file:C:\test-environments\ubuntu\serial.log '
    r'-drive file=C:\test-environments\ubuntu\seed.iso,media=cdrom'
)
launch_ps = f"Invoke-WmiMethod -Class Win32_Process -Name Create -ArgumentList '{ubuntu_cmd}'"
_, stdout, stderr = jump.exec_command(f'powershell -NoProfile -Command "{launch_ps}"')
print("WMI Output:", stdout.read().decode('utf-8', errors='ignore'))
print("WMI Error:", stderr.read().decode('utf-8', errors='ignore'))

time.sleep(3)

# Check QEMU processes
_, stdout, _ = jump.exec_command('powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \\"Name like \'%qemu%\'\\" | Format-Table ProcessId, CommandLine"')
print(stdout.read().decode('utf-8', errors='ignore'))

jump.close()
