import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')

cmd = r'"C:\Program Files\qemu\qemu-img.exe" info C:\test-environments\ubuntu\ubuntu24-overlay.qcow2'
stdin, stdout, stderr = client.exec_command(cmd)
print("=== UBUNTU OVERLAY INFO ===")
print(stdout.read().decode('utf-8', errors='ignore'))
print(stderr.read().decode('utf-8', errors='ignore'))

client.close()
