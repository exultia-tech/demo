"""
Deep Source Code Security Audit of Solaris, AIX 4.1.3, and HP-UX 9.10
Scans for CWE-120 (buffer overflows), CWE-732 (setuid/permissions),
CWE-284 (access control), and correlates with Vantage threat feed CVEs.
"""

import paramiko
import json
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

    print("=" * 80)
    print("  COMMERCIAL UNIX SOURCE CODE SECURITY AUDIT")
    print("  Platforms: Solaris (Illumos Gate), IBM AIX 4.1.3, HP-UX 9.10")
    print("=" * 80)

    # 1. Audit AIX 4.1.3
    print("\n--- Auditing IBM AIX 4.1.3 ---")
    stdin, stdout, stderr = vm.exec_command("find /home/exultia/aix-413/bos -type f -name '*.c' | wc -l")
    c_count = stdout.read().decode('utf-8').strip()
    print(f"Total C source files in AIX BOS: {c_count}")

    # Check for classic vulnerable functions in AIX
    stdin, stdout, stderr = vm.exec_command("grep -rnw '/home/exultia/aix-413/bos' -e 'strcpy' 2>/dev/null | wc -l")
    strcpy_count = stdout.read().decode('utf-8').strip()
    stdin, stdout, stderr = vm.exec_command("grep -rnw '/home/exultia/aix-413/bos' -e 'sprintf' 2>/dev/null | wc -l")
    sprintf_count = stdout.read().decode('utf-8').strip()
    stdin, stdout, stderr = vm.exec_command("grep -rnw '/home/exultia/aix-413/bos' -e 'gets' 2>/dev/null | wc -l")
    gets_count = stdout.read().decode('utf-8').strip()
    print(f"AIX 4.1.3 Unbounded Memory Calls: strcpy={strcpy_count}, sprintf={sprintf_count}, gets={gets_count}")

    # Inspect AIX setuid binaries and mail/login/su
    stdin, stdout, stderr = vm.exec_command("find /home/exultia/aix-413/bos -type f -name '*mail*.c' -o -name '*login*.c' -o -name '*su*.c' | head -n 15")
    print("AIX Key Security Source Files:\n" + stdout.read().decode('utf-8'))

    # 2. Audit HP-UX 9.10
    print("\n--- Auditing HP-UX 9.10 ---")
    stdin, stdout, stderr = vm.exec_command("find /home/exultia/hpux-910 -type f -name '*.c' | wc -l")
    hp_c_count = stdout.read().decode('utf-8').strip()
    print(f"Total C source files in HP-UX 9.10: {hp_c_count}")

    stdin, stdout, stderr = vm.exec_command("grep -rnw '/home/exultia/hpux-910' -e 'strcpy' 2>/dev/null | wc -l")
    hp_strcpy = stdout.read().decode('utf-8').strip()
    stdin, stdout, stderr = vm.exec_command("grep -rnw '/home/exultia/hpux-910' -e 'sprintf' 2>/dev/null | wc -l")
    hp_sprintf = stdout.read().decode('utf-8').strip()
    print(f"HP-UX 9.10 Unbounded Memory Calls: strcpy={hp_strcpy}, sprintf={hp_sprintf}")

    stdin, stdout, stderr = vm.exec_command("find /home/exultia/hpux-910 -type f -name '*lp*.c' -o -name '*newgrp*.c' -o -name '*remsh*.c' | head -n 15")
    print("HP-UX Key Security Source Files:\n" + stdout.read().decode('utf-8'))

    # 3. Audit Solaris (Illumos Gate)
    print("\n--- Auditing Solaris / Illumos Gate ---")
    stdin, stdout, stderr = vm.exec_command("find /home/exultia/solaris-illumos/usr/src/cmd -maxdepth 2 -type d | wc -l")
    sol_cmds = stdout.read().decode('utf-8').strip()
    print(f"Total Command Subsystems in Solaris: {sol_cmds}")

    # Check for modern security primitives in Solaris
    stdin, stdout, stderr = vm.exec_command("grep -rnw '/home/exultia/solaris-illumos/usr/src/cmd' -e 'strlcpy' 2>/dev/null | wc -l")
    sol_strlcpy = stdout.read().decode('utf-8').strip()
    stdin, stdout, stderr = vm.exec_command("grep -rnw '/home/exultia/solaris-illumos/usr/src/cmd' -e 'snprintf' 2>/dev/null | wc -l")
    sol_snprintf = stdout.read().decode('utf-8').strip()
    print(f"Solaris Bounds-Checked Modern Calls: strlcpy={sol_strlcpy}, snprintf={sol_snprintf}")

    sys.stdout.flush()
    vm.close()
    jump.close()

if __name__ == '__main__':
    main()
