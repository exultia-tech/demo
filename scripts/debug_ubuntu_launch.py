import paramiko
import time

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')

# Check if ubuntu24.qcow2 exists
stdin, stdout, stderr = client.exec_command('cmd /c dir C:\\test-environments\\ubuntu\\')
print("=== UBUNTU DIR ===")
print(stdout.read().decode('utf-8', errors='ignore'))

# Check listening ports
stdin, stdout, stderr = client.exec_command('powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 2222, 2223 -ErrorAction SilentlyContinue | Format-Table LocalPort, State, OwningProcess"')
print("=== PORTS ===")
print(stdout.read().decode('utf-8', errors='ignore'))

client.close()
