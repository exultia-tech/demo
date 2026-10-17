import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')

cmd = r'cmd /c ""C:\Program Files\qemu\qemu-system-x86_64.exe" -cpu max -m 2048 -smp 2 -drive file=C:\test-environments\ubuntu\ubuntu24-overlay.qcow2,if=virtio -net nic,model=virtio -net user,hostfwd=tcp::2222-:22,hostfwd=tcp::8080-:8080 -display none -serial file:C:\test-environments\ubuntu\serial.log -drive file=C:\test-environments\ubuntu\seed.iso,media=cdrom 2> C:\test-environments\ubuntu\qemu_err.log"'
client.exec_command(cmd)

import time
time.sleep(2)

stdin, stdout, stderr = client.exec_command('type C:\\test-environments\\ubuntu\\qemu_err.log')
print("=== QEMU ERROR LOG ===")
print(stdout.read().decode('utf-8', errors='ignore'))

client.close()
