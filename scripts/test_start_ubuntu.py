import paramiko
import time

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')

cmd = 'py C:\\test-environments\\scripts\\manage_vms.py start ubuntu'
stdin, stdout, stderr = client.exec_command(cmd)
print("=== START UBUNTU OUTPUT ===")
print(stdout.read().decode('utf-8', errors='ignore'))
print(stderr.read().decode('utf-8', errors='ignore'))

time.sleep(3)

cmd_status = 'py C:\\test-environments\\scripts\\manage_vms.py status'
stdin, stdout, stderr = client.exec_command(cmd_status)
print("=== STATUS ===")
print(stdout.read().decode('utf-8', errors='ignore'))

# Check console.log in ubuntu dir
stdin, stdout, stderr = client.exec_command('type C:\\test-environments\\ubuntu\\console.log')
print("=== CONSOLE.LOG ===")
print(stdout.read().decode('utf-8', errors='ignore'))

client.close()
