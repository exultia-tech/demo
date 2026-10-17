import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')

for f in ['start-rocky.ps1', 'start-ubuntu.ps1', 'status-vms.ps1']:
    cmd = f'powershell -NoProfile -Command "Get-Content C:\\test-environments\\{f}"'
    stdin, stdout, stderr = client.exec_command(cmd)
    print(f"=== {f} ===")
    print(stdout.read().decode('utf-8', errors='ignore'))

client.close()
