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

    print(">>> Cloning HP-UX 9.10 on Rocky 9...")
    stdin, stdout, stderr = vm.exec_command("if [ ! -d /home/exultia/hpux-910 ]; then git clone --depth 1 https://github.com/calmsacibis995/hpux-910-src.git /home/exultia/hpux-910; else echo 'Already cloned'; fi")
    print(stdout.read().decode('utf-8'))
    print(stderr.read().decode('utf-8'))

    print(">>> Testing GCC compilation of HP-UX utilities on Rocky 9...")
    # Find some C files in HP-UX
    stdin, stdout, stderr = vm.exec_command("find /home/exultia/hpux-910 -name 'cal.c' -o -name 'echo.c' -o -name 'banner.c' -o -name 'cat.c'")
    c_files = stdout.read().decode('utf-8').strip().split('\n')
    print("Found candidate files:", c_files)

    for cf in c_files:
        if cf:
            cmd_name = cf.split('/')[-1].replace('.c', '')
            print(f"\nAttempting build of {cmd_name} from {cf}...")
            stdin, stdout, stderr = vm.exec_command(f"gcc -D_HPUX_SOURCE -Wno-implicit-function-declaration -Wno-int-conversion {cf} -o /home/exultia/hpux_{cmd_name} 2>&1")
            res = stdout.read().decode('utf-8')
            print("Build result:\n" + res[:400])

            # Check if binary was created and runs!
            stdin, stdout, stderr = vm.exec_command(f"ls -l /home/exultia/hpux_{cmd_name} 2>/dev/null && /home/exultia/hpux_{cmd_name} --help 2>&1 || /home/exultia/hpux_{cmd_name} 2026")
            print("Execution output:\n" + stdout.read().decode('utf-8')[:300])

    sys.stdout.flush()
    vm.close()
    jump.close()

if __name__ == '__main__':
    main()
