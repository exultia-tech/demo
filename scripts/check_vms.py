import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')

cmd = 'powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \\"Name like \'%qemu%\'\\" | Format-List ProcessId, CommandLine, CreationDate"'
stdin, stdout, stderr = client.exec_command(cmd)
out = stdout.read().decode('utf-8', errors='ignore')
err = stderr.read().decode('utf-8', errors='ignore')

print("QEMU PROCESSES ON ANGRYSQUARE:")
print(out)
if err:
    print("ERRORS:", err)

# Check listening ports 2222, 2223, 2224, 2225
cmd_ports = 'powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 2222, 2223, 2224, 2225 -ErrorAction SilentlyContinue | Format-Table LocalPort, State, OwningProcess"'
stdin, stdout, stderr = client.exec_command(cmd_ports)
print("VM SSH FORWARDING PORTS:")
print(stdout.read().decode('utf-8', errors='ignore'))

client.close()
