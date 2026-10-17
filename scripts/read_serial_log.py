import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')

cmd = 'powershell -NoProfile -Command "Get-Content C:\\test-environments\\rocky\\serial.log -Tail 30"'
stdin, stdout, stderr = client.exec_command(cmd)
print("=== SERIAL.LOG TAIL ===")
print(stdout.read().decode('utf-8', errors='ignore'))

# Also check processes on angrysquare
cmd_proc = 'powershell -NoProfile -Command "Get-Process *qemu* -ErrorAction SilentlyContinue | Format-Table Id, ProcessName, CPU, WorkingSet"'
stdin, stdout, stderr = client.exec_command(cmd_proc)
print("=== QEMU STATUS ===")
print(stdout.read().decode('utf-8', errors='ignore'))

client.close()
