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

    print("=== Testing Solaris Utility Compilation on Ubuntu with GCC 13 ===")
    
    # Check standalone utilities in usr/src/cmd/
    # Try banner, echo, cal, true, false, yes, sleep
    cmds_to_try = [
        ('yes', '/home/exultia/solaris-illumos/usr/src/cmd/yes/yes.c'),
        ('true', '/home/exultia/solaris-illumos/usr/src/cmd/true/true.sh'),
        ('banner', '/home/exultia/solaris-illumos/usr/src/cmd/banner/banner.c'),
        ('sleep', '/home/exultia/solaris-illumos/usr/src/cmd/sleep/sleep.c'),
        ('echo', '/home/exultia/solaris-illumos/usr/src/cmd/echo/echo.c'),
        ('cal', '/home/exultia/solaris-illumos/usr/src/cmd/cal/cal.c')
    ]

    for name, src in cmds_to_try:
        print(f"\n>>> Compiling Solaris {name} from {src}...")
        if src.endswith('.sh'):
            stdin, stdout, stderr = vm.exec_command(f"cp {src} /home/exultia/solaris_{name} && chmod +x /home/exultia/solaris_{name}")
            print(f"Shell script utility copied to /home/exultia/solaris_{name}")
        else:
            inc_flags = "-I/home/exultia/solaris-illumos/usr/src/head -I/home/exultia/solaris-illumos/usr/src/uts/common -D_REENTRANT -Wno-implicit-function-declaration -Wno-int-conversion"
            stdin, stdout, stderr = vm.exec_command(f"gcc {inc_flags} {src} -o /home/exultia/solaris_{name} 2>&1")
            res = stdout.read().decode('utf-8')
            print("Compile log:\n" + res[:400])

        stdin, stdout, stderr = vm.exec_command(f"ls -l /home/exultia/solaris_{name} 2>/dev/null && /home/exultia/solaris_{name} 2>&1 | head -n 5")
        out = stdout.read().decode('utf-8')
        print(f"Execution test for solaris_{name}:\n{out[:300]}")

    # Inspect what built
    stdin, stdout, stderr = vm.exec_command("ls -lh /home/exultia/solaris_* 2>/dev/null")
    print("\n=== Compiled Solaris Binaries ===")
    print(stdout.read().decode('utf-8'))

    sys.stdout.flush()
    vm.close()
    jump.close()

if __name__ == '__main__':
    main()
