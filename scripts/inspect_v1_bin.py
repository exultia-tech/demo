import paramiko

def main():
    jump = paramiko.SSHClient()
    jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')
    transport = jump.get_transport()

    chan_r = transport.open_channel('direct-tcpip', ('127.0.0.1', 2223), ('127.0.0.1', 0))
    vm = paramiko.SSHClient()
    vm.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    vm.connect('127.0.0.1', port=2223, username='exultia', password='password123', sock=chan_r, timeout=10)

    runner = """
import pexpect
import sys

child = pexpect.spawn('/home/exultia/unix-v1/tools/pdp11', ['simh.cfg'], cwd='/home/exultia/unix-v1', encoding='utf-8', timeout=20)
child.expect('login:')
child.sendline('root')
child.expect(['#', '@'])
child.sendline('ls -l /bin')
child.expect(['#', '@'])
print(child.before)
child.sendline('exit')
"""
    stdin, stdout, stderr = vm.exec_command("cat << 'EOF' > /home/exultia/unix-v1/list_bin.py\n" + runner + "\nEOF")
    stdout.channel.recv_exit_status()

    stdin, stdout, stderr = vm.exec_command("python3 /home/exultia/unix-v1/list_bin.py")
    out = stdout.read().decode('utf-8')
    print("=== /bin listing in 1972 Unix V1 ===")
    print(out)

    vm.close()
    jump.close()

if __name__ == '__main__':
    main()
