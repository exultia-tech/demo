import paramiko

def install_rocky():
    print("Connecting to Rocky 9 VM (port 2223)...")
    jump = paramiko.SSHClient()
    jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')
    transport = jump.get_transport()
    chan_r = transport.open_channel('direct-tcpip', ('127.0.0.1', 2223), ('127.0.0.1', 0))
    vm_r = paramiko.SSHClient()
    vm_r.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    vm_r.connect('127.0.0.1', port=2223, username='exultia', password='password123', sock=chan_r, timeout=5)

    print("Running: dnf install -y gcc make git on Rocky 9...")
    stdin, stdout, stderr = vm_r.exec_command('echo password123 | sudo -S dnf install -y gcc make git')
    out = stdout.read().decode('utf-8', errors='ignore')
    err = stderr.read().decode('utf-8', errors='ignore')
    print("Rocky 9 DNF Output:\n" + out)
    if err:
        print("Rocky 9 DNF Errors:\n" + err)

    stdin, stdout, stderr = vm_r.exec_command('which gcc make git')
    print("Rocky 9 Binaries:\n" + stdout.read().decode('utf-8'))
    vm_r.close()
    jump.close()

if __name__ == '__main__':
    install_rocky()
