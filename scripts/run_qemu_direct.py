import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')

qemu_cmd = r'"C:\Program Files\qemu\qemu-system-x86_64.exe" -m 2048 -smp 2 -drive file=C:\test-environments\ubuntu\ubuntu24.qcow2,if=virtio -net nic,model=virtio -net user,hostfwd=tcp::2222-:22 -display none -serial stdio'
stdin, stdout, stderr = client.exec_command(qemu_cmd, timeout=5)
try:
    print("STDOUT:", stdout.read().decode('utf-8', errors='ignore')[:500])
    print("STDERR:", stderr.read().decode('utf-8', errors='ignore')[:500])
except Exception as e:
    print("EXC:", e)

client.close()
