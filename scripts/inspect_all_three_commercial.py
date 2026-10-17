import paramiko
import sys

def main():
    jump = paramiko.SSHClient()
    jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')
    transport = jump.get_transport()

    chan_u = transport.open_channel('direct-tcpip', ('127.0.0.1', 2222), ('127.0.0.1', 0))
    vm = paramiko.SSHClient()
    vm.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    vm.connect('127.0.0.1', port=2222, username='exultia', password='password123', sock=chan_u, timeout=10)

    print("=== Commercial Unices Overview on Ubuntu VM ===")
    stdin, stdout, stderr = vm.exec_command("du -sh /home/exultia/solaris-illumos /home/exultia/aix-413 /home/exultia/hpux-910 2>/dev/null")
    print(stdout.read().decode('utf-8'))
    sys.stdout.flush()

    print("=== AIX 4.1.3 Structure ===")
    stdin, stdout, stderr = vm.exec_command("ls -F /home/exultia/aix-413")
    print(stdout.read().decode('utf-8'))
    sys.stdout.flush()

    print("=== AIX 4.1.3 Security & Commands Search ===")
    stdin, stdout, stderr = vm.exec_command("find /home/exultia/aix-413 -maxdepth 4 -type d | grep -E 'cmd|bin|security|etc|usr' | head -n 30")
    print(stdout.read().decode('utf-8'))
    sys.stdout.flush()

    print("=== HP-UX 9.10 Structure ===")
    stdin, stdout, stderr = vm.exec_command("ls -F /home/exultia/hpux-910")
    print(stdout.read().decode('utf-8'))
    sys.stdout.flush()

    print("=== HP-UX 9.10 Commands Search ===")
    stdin, stdout, stderr = vm.exec_command("find /home/exultia/hpux-910 -maxdepth 4 -type d | grep -E 'cmd|bin|security|etc|usr' | head -n 30")
    print(stdout.read().decode('utf-8'))
    sys.stdout.flush()

    vm.close()
    jump.close()

if __name__ == '__main__':
    main()
