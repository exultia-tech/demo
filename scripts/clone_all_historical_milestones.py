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

    milestones = [
        ('Research-PDP7', 'research-pdp7'),
        ('Research-V2', 'research-v2'),
        ('Research-V3', 'research-v3'),
        ('Research-V5', 'research-v5'),
    ]

    for tag, dir_name in milestones:
        print(f"Checking {dir_name} ({tag})...")
        stdin, stdout, stderr = vm.exec_command(f"if [ ! -d /home/exultia/{dir_name} ]; then git clone --depth 1 --branch {tag} https://github.com/dspinellis/unix-history-repo.git /home/exultia/{dir_name}; fi")
        stdout.channel.recv_exit_status()

    stdin, stdout, stderr = vm.exec_command("ls -lh /home/exultia")
    print("Ubuntu 24.04 Unix Milestones:\n" + stdout.read().decode('utf-8'))

    vm.close()
    jump.close()

if __name__ == '__main__':
    main()
