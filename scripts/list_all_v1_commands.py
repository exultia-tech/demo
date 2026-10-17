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

    stdin, stdout, stderr = vm.exec_command('ls /home/exultia/unix-v1/fs/root/bin')
    bins = stdout.read().decode('utf-8').split()
    print(f"Total binaries in V1 /bin: {len(bins)}")
    print("Binaries: " + ", ".join(bins))

    # Also list /usr/bin if any
    stdin, stdout, stderr = vm.exec_command('ls /home/exultia/unix-v1/fs/root/usr/bin 2>/dev/null')
    usr_bins = stdout.read().decode('utf-8').split()
    print(f"Total binaries in V1 /usr/bin: {len(usr_bins)}")

    # Check V1 kernel syscalls in u0.s..ux.s
    stdin, stdout, stderr = vm.exec_command('grep -rn "sys " /home/exultia/unix-v1/src/ | head -n 30')
    print("Kernel syscall invocations:\n" + stdout.read().decode('utf-8')[:500])

    vm.close()
    jump.close()

if __name__ == '__main__':
    main()
