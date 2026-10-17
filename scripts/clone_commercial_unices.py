import paramiko
import time

def main():
    print("=" * 75)
    print("  CLONING COMMERCIAL CLASSIC UNIX RESOURCING: SOLARIS, AIX, HP-UX")
    print("=" * 75)

    jump = paramiko.SSHClient()
    jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')
    transport = jump.get_transport()

    chan_u = transport.open_channel('direct-tcpip', ('127.0.0.1', 2222), ('127.0.0.1', 0))
    vm = paramiko.SSHClient()
    vm.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    vm.connect('127.0.0.1', port=2222, username='exultia', password='password123', sock=chan_u, timeout=10)

    repos = [
        ('Solaris (Illumos Gate)', 'https://github.com/illumos/illumos-gate.git', '/home/exultia/solaris-illumos'),
        ('IBM AIX 4.1.3', 'https://github.com/Arquivotheca/AIX-4.1.3.git', '/home/exultia/aix-413'),
        ('HP-UX 9.10', 'https://github.com/calmsacibis995/hpux-910-src.git', '/home/exultia/hpux-910')
    ]

    for name, url, path in repos:
        print(f"\n>>> Checking {name} at {url}...")
        stdin, stdout, stderr = vm.exec_command(f"if [ ! -d {path} ]; then echo 'Cloning shallow...'; git clone --depth 1 {url} {path}; else echo 'Already cloned'; fi")
        stdout.channel.recv_exit_status()
        out = stdout.read().decode('utf-8')
        err = stderr.read().decode('utf-8')
        print(f"Clone log for {name}:\n{out}\n{err}")

        # Inspect directory
        stdin, stdout, stderr = vm.exec_command(f"ls -lh {path} | head -n 20")
        print(f"Directory contents for {name}:\n{stdout.read().decode('utf-8')}")

    vm.close()
    jump.close()

if __name__ == '__main__':
    main()
