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

    # Create SunOS libc compatibility shim
    shim_code = """
#include <stdio.h>
#include <wchar.h>

/* SunOS SVR4 libc __iob export compatibility */
FILE *__iob = NULL;

int __putwchar_xpg5(wchar_t wc) {
    return putwchar(wc);
}
"""
    stdin, stdout, stderr = vm.exec_command("cat << 'EOF' > /home/exultia/sunos_shim.c\n" + shim_code + "\nEOF")
    stdout.channel.recv_exit_status()

    # Try building Solaris banner and yes with intel machtypes and shim
    inc = "-I/home/exultia/solaris-illumos/usr/src/uts/intel -I/home/exultia/solaris-illumos/usr/src/uts/common -I/home/exultia/solaris-illumos/usr/src/head -D_REENTRANT -Wno-implicit-function-declaration -Wno-int-conversion"
    
    print(">>> Compiling Solaris banner with Intel architecture headers...")
    stdin, stdout, stderr = vm.exec_command(f"gcc {inc} /home/exultia/solaris-illumos/usr/src/cmd/banner/banner.c -o /home/exultia/solaris_banner 2>&1")
    print(stdout.read().decode('utf-8'))

    stdin, stdout, stderr = vm.exec_command("ls -l /home/exultia/solaris_banner && /home/exultia/solaris_banner 'SOLARIS'")
    print("Banner output:\n" + stdout.read().decode('utf-8'))

    sys.stdout.flush()
    vm.close()
    jump.close()

if __name__ == '__main__':
    main()
