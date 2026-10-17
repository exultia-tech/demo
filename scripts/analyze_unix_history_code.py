"""
Analyze Security Architecture & Vulnerabilities Across Classic Unix Milestones
(Research-V1 vs. Research-V6 vs. Research-V7)
From https://github.com/dspinellis/unix-history-repo
"""

import paramiko

def analyze():
    jump = paramiko.SSHClient()
    jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')
    transport = jump.get_transport()

    chan_u = transport.open_channel('direct-tcpip', ('127.0.0.1', 2222), ('127.0.0.1', 0))
    vm = paramiko.SSHClient()
    vm.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    vm.connect('127.0.0.1', port=2222, username='exultia', password='password123', sock=chan_u, timeout=10)

    print("=" * 75)
    print("  EXULTIA KINETIC: HISTORICAL EVOLUTION OF UNIX SECURITY VULNERABILITIES")
    print("=" * 75)

    # 1. Research-V6 su.c vs Research-V7 su.c
    print("\n>>> [1/3] Examining su.c in Research-V6 (1975):")
    stdin, stdout, stderr = vm.exec_command('cat /home/exultia/research-v6/usr/source/s2/su.c')
    v6_su = stdout.read().decode('utf-8')
    print(v6_su[:1000])

    print("\n>>> [2/3] Examining su.c in Research-V7 (1979):")
    stdin, stdout, stderr = vm.exec_command('cat /home/exultia/research-v7/usr/src/cmd/su.c')
    v7_su = stdout.read().decode('utf-8')
    print(v7_su[:1200])

    # 2. Check /etc/passwd in V6 vs V7
    print("\n>>> [3/3] Examining /etc/passwd in Research-V6 (1975):")
    stdin, stdout, stderr = vm.exec_command('cat /home/exultia/research-v6/etc/passwd')
    print(stdout.read().decode('utf-8'))

    print("Examining /etc/passwd in Research-V7 (1979):")
    stdin, stdout, stderr = vm.exec_command('cat /home/exultia/research-v7/etc/passwd')
    print(stdout.read().decode('utf-8'))

    vm.close()
    jump.close()

if __name__ == '__main__':
    analyze()
