import paramiko

def check_both():
    jump = paramiko.SSHClient()
    jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')
    transport = jump.get_transport()

    print("=== UBUNTU 24.04 (port 2222) ===")
    try:
        chan_u = transport.open_channel('direct-tcpip', ('127.0.0.1', 2222), ('127.0.0.1', 0))
        vm_u = paramiko.SSHClient()
        vm_u.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        vm_u.connect('127.0.0.1', port=2222, username='exultia', password='password123', sock=chan_u, timeout=5)
        stdin, stdout, stderr = vm_u.exec_command('ps aux | grep -E "apt|dpkg|make|gcc"')
        for l in stdout.read().decode('utf-8', errors='ignore').splitlines():
            if 'grep' not in l:
                print("  ", l)
        stdin, stdout, stderr = vm_u.exec_command('which gcc make git pdp11')
        found = stdout.read().decode('utf-8').strip()
        if found:
            print("   FOUND:", found)
        vm_u.close()
    except Exception as e:
        print("  Error Ubuntu:", e)

    print("\n=== ROCKY LINUX 9 (port 2223) ===")
    try:
        chan_r = transport.open_channel('direct-tcpip', ('127.0.0.1', 2223), ('127.0.0.1', 0))
        vm_r = paramiko.SSHClient()
        vm_r.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        vm_r.connect('127.0.0.1', port=2223, username='exultia', password='password123', sock=chan_r, timeout=5)
        stdin, stdout, stderr = vm_r.exec_command('ps aux | grep -E "dnf|rpm|make|gcc"')
        for l in stdout.read().decode('utf-8', errors='ignore').splitlines():
            if 'grep' not in l:
                print("  ", l)
        stdin, stdout, stderr = vm_r.exec_command('which gcc make git pdp11')
        found_r = stdout.read().decode('utf-8').strip()
        if found_r:
            print("   FOUND:", found_r)
        vm_r.close()
    except Exception as e:
        print("  Error Rocky:", e)

    jump.close()

if __name__ == '__main__':
    check_both()
