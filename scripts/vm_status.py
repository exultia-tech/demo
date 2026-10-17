import paramiko

def check_vm():
    jump = paramiko.SSHClient()
    jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')
    transport = jump.get_transport()
    chan_u = transport.open_channel('direct-tcpip', ('127.0.0.1', 2222), ('127.0.0.1', 0))
    vm = paramiko.SSHClient()
    vm.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    vm.connect('127.0.0.1', port=2222, username='exultia', password='password123', sock=chan_u, timeout=5)

    stdin, stdout, stderr = vm.exec_command('ps aux')
    lines = stdout.read().decode('utf-8', errors='ignore').splitlines()
    for l in lines:
        if any(x in l for x in ['apt', 'dpkg', 'make', 'gcc']):
            print(l)

    stdin, stdout, stderr = vm.exec_command('which gcc make pdp11 simh-pdp11 git')
    print("Found binaries:\n" + stdout.read().decode('utf-8'))

if __name__ == '__main__':
    check_vm()
