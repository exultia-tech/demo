import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')

# Run in PowerShell and capture output
cmd = 'powershell -NoProfile -Command "Start-Process -FilePath \'C:\\Program Files\\qemu\\qemu-system-x86_64.exe\' -ArgumentList \'-cpu max -m 2048 -smp 2 -drive file=C:\\test-environments\\ubuntu\\ubuntu24-overlay.qcow2,if=virtio -net nic,model=virtio -net user,hostfwd=tcp::2222-:22 -display none -serial file:C:\\test-environments\\ubuntu\\serial.log -drive file=C:\\test-environments\\ubuntu\\seed.iso,media=cdrom\' -PassThru"'
stdin, stdout, stderr = client.exec_command(cmd)
print("=== START-PROCESS ===")
print("STDOUT:", stdout.read().decode('utf-8', errors='ignore'))
print("STDERR:", stderr.read().decode('utf-8', errors='ignore'))

client.close()
