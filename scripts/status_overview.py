import paramiko

def check_rocky(jump):
    try:
        chan = jump.get_transport().open_channel('direct-tcpip', ('127.0.0.1', 2223), ('127.0.0.1', 0))
        vm = paramiko.SSHClient()
        vm.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        vm.connect('127.0.0.1', port=2223, username='exultia', password='password123', sock=chan, timeout=3)
        stdin, stdout, stderr = vm.exec_command('ps -ef | grep -E "gcc|make|cc1|pdp11" | grep -v grep')
        procs = stdout.read().decode('utf-8').strip()
        stdin, stdout, stderr = vm.exec_command('ls -lh /home/exultia/unix-v1/tools/pdp11 /home/exultia/unix-v1/images/rf0.dsk 2>/dev/null')
        artifacts = stdout.read().decode('utf-8').strip()
        vm.close()
        return f"[ROCKY 9 - port 2223]\nActive compiler procs:\n{procs or 'None'}\nArtifacts:\n{artifacts or 'None'}"
    except Exception as e:
        return f"[ROCKY 9] Error: {e}"

def check_ubuntu(jump):
    try:
        chan = jump.get_transport().open_channel('direct-tcpip', ('127.0.0.1', 2222), ('127.0.0.1', 0))
        vm = paramiko.SSHClient()
        vm.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        vm.connect('127.0.0.1', port=2222, username='exultia', password='password123', sock=chan, timeout=3)
        stdin, stdout, stderr = vm.exec_command('ls -lh /home/exultia')
        home = stdout.read().decode('utf-8').strip()
        stdin, stdout, stderr = vm.exec_command('ps -ef | grep -E "git|ls-remote" | grep -v grep')
        git_procs = stdout.read().decode('utf-8').strip()
        vm.close()
        return f"[UBUNTU 24.04 - port 2222]\n/home/exultia:\n{home}\nGit procs:\n{git_procs or 'None'}"
    except Exception as e:
        return f"[UBUNTU 24.04] Error: {e}"

def main():
    jump = paramiko.SSHClient()
    jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')
    print(check_rocky(jump))
    print("-" * 50)
    print(check_ubuntu(jump))
    jump.close()

if __name__ == '__main__':
    main()
