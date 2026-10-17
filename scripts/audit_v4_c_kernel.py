"""
Audit Research-V4 and Research-V5 (first C-based kernels in Unix history)
"""
import paramiko

def audit_v4_v5():
    jump = paramiko.SSHClient()
    jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')
    transport = jump.get_transport()

    chan_u = transport.open_channel('direct-tcpip', ('127.0.0.1', 2222), ('127.0.0.1', 0))
    vm = paramiko.SSHClient()
    vm.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    vm.connect('127.0.0.1', port=2222, username='exultia', password='password123', sock=chan_u, timeout=10)

    print(">>> Fetching shallow snapshot of Research-V4 (1973 C rewrite)...")
    vm.exec_command('rm -rf /home/exultia/research-v4')
    stdin, stdout, stderr = vm.exec_command('git clone --depth 1 --branch Research-V4 https://github.com/dspinellis/unix-history-repo.git /home/exultia/research-v4')
    stdout.channel.recv_exit_status()

    stdin, stdout, stderr = vm.exec_command('find /home/exultia/research-v4 -name "*.c" | head -n 20')
    print("V4 C source files:\n" + stdout.read().decode('utf-8'))

    # Check sys/sys or user credential handling
    stdin, stdout, stderr = vm.exec_command('find /home/exultia/research-v4 -name "sys1.c" -o -name "sys4.c" -o -name "user.h" -o -name "fio.c"')
    files = stdout.read().decode('utf-8').strip().splitlines()
    print("V4 Kernel core files found:", files)

    for f in files:
        if 'sys4.c' in f or 'user.h' in f:
            print(f"\n--- Content of {f} ---")
            stdin, stdout, stderr = vm.exec_command(f'head -n 40 {f}')
            print(stdout.read().decode('utf-8'))

    vm.close()
    jump.close()

if __name__ == '__main__':
    audit_v4_v5()
