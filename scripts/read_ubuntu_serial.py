import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')

cmd = 'powershell -NoProfile -Command "Get-Content C:\\test-environments\\ubuntu\\serial.log -Tail 60"'
stdin, stdout, stderr = client.exec_command(cmd)
print("=== UBUNTU SERIAL.LOG ===")
print(stdout.read().decode('utf-8', errors='ignore'))
client.close()
