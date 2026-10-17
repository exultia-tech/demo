import paramiko

def main():
    jump = paramiko.SSHClient()
    jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')

    for name, port in [('Rocky 9', 2223), ('Ubuntu 24.04', 2222)]:
        try:
            c = jump.get_transport().open_channel('direct-tcpip', ('127.0.0.1', port), ('127.0.0.1', 0))
            v = paramiko.SSHClient()
            v.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            v.connect('127.0.0.1', port=port, username='exultia', password='password123', sock=c, timeout=5)
            _, o, _ = v.exec_command('df -h /')
            print(f"=== {name} Disk Space ===")
            print(o.read().decode('utf-8'))
            v.close()
        except Exception as e:
            print(f"=== {name} Error ===", e)

    jump.close()

if __name__ == '__main__':
    main()
