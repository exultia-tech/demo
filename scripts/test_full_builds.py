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

    print("=== Testing Solaris Full Kernel / Subsystem Build ===")
    stdin, stdout, stderr = vm.exec_command("cd /home/exultia/solaris-illumos/usr/src && make -n | head -n 15")
    print("Solaris make -n:\n" + stdout.read().decode('utf-8'))
    print("Solaris make stderr:\n" + stderr.read().decode('utf-8'))

    print("=== Testing AIX 4.1.3 Full Build ===")
    stdin, stdout, stderr = vm.exec_command("cd /home/exultia/aix-413 && make -n | head -n 15")
    print("AIX make -n:\n" + stdout.read().decode('utf-8'))
    print("AIX make stderr:\n" + stderr.read().decode('utf-8'))

    print("=== Testing HP-UX 9.10 Full Build ===")
    stdin, stdout, stderr = vm.exec_command("cd /home/exultia/hpux-910/source_product/9.10/commands && make -n 2>&1 | head -n 15")
    print("HP-UX make -n:\n" + stdout.read().decode('utf-8'))

    sys.stdout.flush()
    vm.close()
    jump.close()

if __name__ == '__main__':
    main()
