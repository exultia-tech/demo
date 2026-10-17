import paramiko
import sys

def main():
    jump = paramiko.SSHClient()
    jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')
    transport = jump.get_transport()

    chan_r = transport.open_channel('direct-tcpip', ('127.0.0.1', 2223), ('127.0.0.1', 0))
    vm = paramiko.SSHClient()
    vm.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    vm.connect('127.0.0.1', port=2223, username='exultia', password='password123', sock=chan_r, timeout=10)

    stdin, stdout, stderr = vm.exec_command("ps aux | grep -E 'pdp11|python'")
    print("Processes:\n" + stdout.read().decode('utf-8'))

    stdin, stdout, stderr = vm.exec_command("ls -lh /home/exultia/unix-v1/exhaustive_pdp11_results.json 2>/dev/null")
    print("Results file:\n" + stdout.read().decode('utf-8'))
    sys.stdout.flush()

    vm.close()
    jump.close()

if __name__ == '__main__':
    main()
