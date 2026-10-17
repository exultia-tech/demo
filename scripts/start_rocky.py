import paramiko
import time

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')

print(">>> Starting Rocky Linux 9 VM on angrysquare...")
cmd = 'powershell -NoProfile -Command "py C:\\test-environments\\scripts\\manage_vms.py start rocky"'
stdin, stdout, stderr = client.exec_command(cmd)
print(stdout.read().decode('utf-8', errors='ignore'))
err = stderr.read().decode('utf-8', errors='ignore')
if err:
    print("STDERR:", err)

# Check status
time.sleep(3)
cmd_status = 'powershell -NoProfile -Command "py C:\\test-environments\\scripts\\manage_vms.py status"'
stdin, stdout, stderr = client.exec_command(cmd_status)
print("VM STATUS:")
print(stdout.read().decode('utf-8', errors='ignore'))

client.close()
