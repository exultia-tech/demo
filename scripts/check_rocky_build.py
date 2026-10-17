import paramiko

def check():
    jump = paramiko.SSHClient()
    jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')
    transport = jump.get_transport()
    chan_r = transport.open_channel('direct-tcpip', ('127.0.0.1', 2223), ('127.0.0.1', 0))
    vm = paramiko.SSHClient()
    vm.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    vm.connect('127.0.0.1', port=2223, username='exultia', password='password123', sock=chan_r, timeout=5)

    stdin, stdout, stderr = vm.exec_command('ls -la /home/exultia')
    print("Files in /home/exultia:\n" + stdout.read().decode('utf-8'))

    stdin, stdout, stderr = vm.exec_command('ps -ef')
    lines = stdout.read().decode('utf-8').splitlines()
    for l in lines:
        if any(w in l for w in ['git', 'make', 'gcc', 'pdp11', 'build_unix', 'dnf']):
            print("RUNNING:", l)

if __name__ == '__main__':
    check()
