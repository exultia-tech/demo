import paramiko
import time

jump = paramiko.SSHClient()
jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')

transport = jump.get_transport()

for attempt in range(15):
    try:
        channel = transport.open_channel("direct-tcpip", ("127.0.0.1", 2222), ("127.0.0.1", 0))
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect("127.0.0.1", port=2222, username="exultia", password="password123", sock=channel, timeout=5, banner_timeout=10)
        print("CONNECTED TO UBUNTU SSH!")
        stdin, stdout, stderr = client.exec_command("uname -a && cat /etc/os-release | grep PRETTY && df -h /")
        print(stdout.read().decode('utf-8'))
        client.close()
        break
    except Exception as e:
        print(f"Attempt {attempt+1}: {e}")
        time.sleep(3)

jump.close()
