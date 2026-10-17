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

    print("=== Top Level Directories in Illumos / Solaris ===")
    stdin, stdout, stderr = vm.exec_command("ls -lh /home/exultia/solaris-illumos")
    print(stdout.read().decode('utf-8'))

    print("=== usr/src Directories ===")
    stdin, stdout, stderr = vm.exec_command("ls -lh /home/exultia/solaris-illumos/usr/src")
    print(stdout.read().decode('utf-8'))

    print("=== Security Commands in usr/src/cmd/ ===")
    stdin, stdout, stderr = vm.exec_command("ls /home/exultia/solaris-illumos/usr/src/cmd | grep -E 'login|passwd|su|pam|rbac|priv|audit|ssh|zonename|crypt|chmod|chown'")
    print(stdout.read().decode('utf-8'))

    sys.stdout.flush()
    vm.close()
    jump.close()

if __name__ == '__main__':
    main()
