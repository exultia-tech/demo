import paramiko

jump = paramiko.SSHClient()
jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')
transport = jump.get_transport()
chan_r = transport.open_channel('direct-tcpip', ('127.0.0.1', 2223), ('127.0.0.1', 0))
vm = paramiko.SSHClient()
vm.set_missing_host_key_policy(paramiko.AutoAddPolicy())
vm.connect('127.0.0.1', port=2223, username='exultia', password='password123', sock=chan_r, timeout=5)

stdin, stdout, stderr = vm.exec_command('ls -la /home/exultia/unix-v1/tools/pdp11 /home/exultia/unix-v1/images /home/exultia/unix-v1/tools/mkfs 2>/dev/null')
print("Status of pdp11 & images:\n" + stdout.read().decode('utf-8'))

stdin, stdout, stderr = vm.exec_command('ps -ef')
lines = [l for l in stdout.read().decode('utf-8').splitlines() if any(k in l for k in ['make', 'gcc', 'cc1', 'pdp11', 'python3'])]
for l in lines:
    print("  ", l)

vm.close()
jump.close()
