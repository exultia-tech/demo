import paramiko

def check_rocky():
    jump = paramiko.SSHClient()
    jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')
    transport = jump.get_transport()
    chan_r = transport.open_channel('direct-tcpip', ('127.0.0.1', 2223), ('127.0.0.1', 0))
    vm_r = paramiko.SSHClient()
    vm_r.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    vm_r.connect('127.0.0.1', port=2223, username='exultia', password='password123', sock=chan_r, timeout=5)

    stdin, stdout, stderr = vm_r.exec_command('which gcc make git pdp11')
    print("Rocky 9 Tools:\n" + stdout.read().decode('utf-8'))
    vm_r.close()
    jump.close()

if __name__ == '__main__':
    check_rocky()
