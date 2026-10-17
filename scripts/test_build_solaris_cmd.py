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

    print("=== Checking Compiler & Build Tools on Ubuntu ===")
    stdin, stdout, stderr = vm.exec_command("gcc --version && make --version | head -n 1")
    print(stdout.read().decode('utf-8'))

    print("=== Inspecting Solaris cmd/chmod Source ===")
    stdin, stdout, stderr = vm.exec_command("ls -la /home/exultia/solaris-illumos/usr/src/cmd/chmod")
    print(stdout.read().decode('utf-8'))

    print("=== Inspecting Solaris cmd/su Source ===")
    stdin, stdout, stderr = vm.exec_command("ls -la /home/exultia/solaris-illumos/usr/src/cmd/su")
    print(stdout.read().decode('utf-8'))

    print("=== Inspecting Solaris cmd/login Source ===")
    stdin, stdout, stderr = vm.exec_command("ls -la /home/exultia/solaris-illumos/usr/src/cmd/login")
    print(stdout.read().decode('utf-8'))

    print("=== Attempting compilation of Solaris chmod utility with gcc ===")
    stdin, stdout, stderr = vm.exec_command("gcc -I/home/exultia/solaris-illumos/usr/src/head -I/home/exultia/solaris-illumos/usr/src/uts/common -c /home/exultia/solaris-illumos/usr/src/cmd/chmod/chmod.c -o /tmp/solaris_chmod.o 2>&1")
    res = stdout.read().decode('utf-8')
    print("Compilation output for Solaris chmod:\n" + res[:1000])

    sys.stdout.flush()
    vm.close()
    jump.close()

if __name__ == '__main__':
    main()
