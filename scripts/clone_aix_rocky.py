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

    print(">>> Cloning IBM AIX 4.1.3 on Rocky 9...")
    stdin, stdout, stderr = vm.exec_command("if [ ! -d /home/exultia/aix-413 ]; then git clone --depth 1 https://github.com/Arquivotheca/AIX-4.1.3.git /home/exultia/aix-413; else echo 'Already cloned'; fi")
    print(stdout.read().decode('utf-8'))
    print(stderr.read().decode('utf-8'))

    print(">>> Searching candidate commands in AIX 4.1.3...")
    stdin, stdout, stderr = vm.exec_command("find /home/exultia/aix-413/bos/usr/bin -name 'banner.c' -o -name 'cal.c' -o -name 'echo.c' -o -name 'wc.c' -o -name 'cat.c' 2>/dev/null")
    c_files = stdout.read().decode('utf-8').strip().split('\n')
    print("Found candidate files in AIX:", c_files)

    for cf in c_files:
        if cf:
            cmd_name = cf.split('/')[-1].replace('.c', '')
            print(f"\nAttempting build of AIX {cmd_name} from {cf}...")
            stdin, stdout, stderr = vm.exec_command(f"gcc -D_AIX -D_ALL_SOURCE -Wno-implicit-function-declaration -Wno-int-conversion {cf} -o /home/exultia/aix_{cmd_name} 2>&1")
            res = stdout.read().decode('utf-8')
            print("Build result:\n" + res[:400])

            # Check if binary was created and runs!
            stdin, stdout, stderr = vm.exec_command(f"ls -l /home/exultia/aix_{cmd_name} 2>/dev/null && /home/exultia/aix_{cmd_name} 2>&1")
            print("Execution output:\n" + stdout.read().decode('utf-8')[:300])

    sys.stdout.flush()
    vm.close()
    jump.close()

if __name__ == '__main__':
    main()
