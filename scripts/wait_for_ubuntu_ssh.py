import paramiko
import time

def wait_for_ubuntu():
    print(">>> Connecting to angrysquare jump host...", flush=True)
    jump = paramiko.SSHClient()
    jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')
    transport = jump.get_transport()

    print(">>> Polling Ubuntu 24.04 SSH server on 127.0.0.1:2222...", flush=True)
    vm = None
    for i in range(30):
        try:
            channel = transport.open_channel("direct-tcpip", ("127.0.0.1", 2222), ("127.0.0.1", 0))
            client = paramiko.SSHClient()
            client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            client.connect("127.0.0.1", port=2222, username="exultia", password="password123", sock=channel, timeout=4, banner_timeout=8)
            vm = client
            print(f">>> [SUCCESS] Logged into Ubuntu 24.04 on attempt {i+1}!", flush=True)
            break
        except Exception as e:
            # Check tail of serial log
            _, s_out, _ = jump.exec_command('powershell -NoProfile -Command "Get-Content C:\\test-environments\\ubuntu\\serial.log -Tail 1"')
            tail = s_out.read().decode('utf-8', errors='ignore').strip()
            print(f"    Attempt {i+1}/30: ({type(e).__name__}) Booting... {tail[-80:] if tail else ''}", flush=True)
            time.sleep(5)

    if vm:
        print(">>> GATHERING VM ENVIRONMENT DETAILS:", flush=True)
        _, stdout, _ = vm.exec_command("uname -a && cat /etc/os-release | grep PRETTY_NAME && df -h /")
        print(stdout.read().decode('utf-8'))
        vm.close()

    jump.close()

if __name__ == "__main__":
    wait_for_ubuntu()
