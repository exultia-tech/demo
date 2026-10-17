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

    print("Checking /home/exultia on Ubuntu 24.04:")
    stdin, stdout, stderr = vm.exec_command('ls -lh /home/exultia')
    print(stdout.read().decode('utf-8'))

    # Query git remote tags for unix-history-repo
    print("Fetching tags from https://github.com/dspinellis/unix-history-repo.git:")
    stdin, stdout, stderr = vm.exec_command('git ls-remote --tags --heads https://github.com/dspinellis/unix-history-repo.git | grep -E "Research-|BSD|SysV" | head -n 35')
    tags = stdout.read().decode('utf-8')
    print(tags)

    vm.close()
    jump.close()

if __name__ == '__main__':
    main()
