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

    print(">>> Installing build-essential, clang, make on Ubuntu VM...")
    stdin, stdout, stderr = vm.exec_command("echo password123 | sudo -S apt-get update -y && echo password123 | sudo -S apt-get install -y build-essential clang bison flex")
    out = stdout.read().decode('utf-8')
    err = stderr.read().decode('utf-8')
    print("Apt Output:\n" + out[-500:] if len(out) > 500 else out)
    if err:
        print("Apt Stderr:\n" + err[-500:] if len(err) > 500 else err)

    stdin, stdout, stderr = vm.exec_command("gcc --version && clang --version | head -n 1")
    print("Installed Compilers:\n" + stdout.read().decode('utf-8'))

    sys.stdout.flush()
    vm.close()
    jump.close()

if __name__ == '__main__':
    main()
