import paramiko

def main():
    jump = paramiko.SSHClient()
    jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')
    transport = jump.get_transport()

    chan_u = transport.open_channel('direct-tcpip', ('127.0.0.1', 2222), ('127.0.0.1', 0))
    vm = paramiko.SSHClient()
    vm.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    vm.connect('127.0.0.1', port=2222, username='exultia', password='password123', sock=chan_u, timeout=10)

    stdin, stdout, stderr = vm.exec_command('git ls-remote --tags --heads https://github.com/dspinellis/unix-history-repo.git | grep "Research-"')
    tags = stdout.read().decode('utf-8')
    print("Research tags/branches:\n" + tags)

    vm.close()
    jump.close()

if __name__ == '__main__':
    main()
