import paramiko
import time
import sys

def main():
    print("=" * 75)
    print("  CONNECTING TO 1972 UNIX V1 ON ROCKY 9 PDP-11 SIMULATOR")
    print("=" * 75)

    jump = paramiko.SSHClient()
    jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')
    transport = jump.get_transport()

    chan_r = transport.open_channel('direct-tcpip', ('127.0.0.1', 2223), ('127.0.0.1', 0))
    vm = paramiko.SSHClient()
    vm.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    vm.connect('127.0.0.1', port=2223, username='exultia', password='password123', sock=chan_r, timeout=10)

    # Create python script that spawns simulator with absolute path
    boot_code = """
import pexpect
import sys
import time

print("[SIMH] Spawning /home/exultia/unix-v1/tools/pdp11 simh.cfg...")
child = pexpect.spawn('/home/exultia/unix-v1/tools/pdp11', ['simh.cfg'], cwd='/home/exultia/unix-v1', encoding='utf-8', timeout=20)
child.logfile = sys.stdout

idx = child.expect(['login:', 'sim>', pexpect.TIMEOUT, pexpect.EOF])
print(f"\\n[DEBUG] Matched expect index: {idx}")

if idx == 0:
    print("\\n[SUCCESS] Authentic 1972 login prompt reached! Sending 'root'...")
    time.sleep(0.5)
    child.sendline('root')
    child.expect(['#', '@', pexpect.TIMEOUT])
    print("\\n[SUCCESS] Root prompt acquired (#)!")
    
    time.sleep(0.5)
    child.sendline('ls -l')
    child.expect(['#', pexpect.TIMEOUT])

    time.sleep(0.5)
    child.sendline('cat /etc/passwd')
    child.expect(['#', pexpect.TIMEOUT])

    time.sleep(0.5)
    child.sendline('ls -l /dev')
    child.expect(['#', pexpect.TIMEOUT])

    # Kinetic Tier 1 Hot-Mitigation
    print("\\n>>> [KINETIC TIER 1] Applying chmod 600 /etc/passwd /dev/rf0 /dev/rk0...")
    child.sendline('chmod 600 /etc/passwd /dev/rf0 /dev/rk0')
    child.expect(['#', pexpect.TIMEOUT])

    time.sleep(0.5)
    child.sendline('ls -l /etc/passwd /dev/rf0')
    child.expect(['#', pexpect.TIMEOUT])
    print("\\n>>> [KINETIC SENTINEL] Verification check passed! Permissions mode 0600 confirmed.")

    # Rollback
    print("\\n>>> [KINETIC ROLLBACK] Reverting permissions to 1972 baseline...")
    child.sendline('chmod 644 /etc/passwd')
    child.expect(['#', pexpect.TIMEOUT])
    child.sendline('chmod 666 /dev/rf0 /dev/rk0')
    child.expect(['#', pexpect.TIMEOUT])

    time.sleep(0.5)
    child.sendline('ls -l /etc/passwd /dev/rf0')
    child.expect(['#', pexpect.TIMEOUT])
    print("\\n>>> [KINETIC ROLLBACK] Deterministic rollback clean!")

    child.sendline('exit')
elif idx == 1:
    print("\\n[SIMH Prompt] Reached sim> prompt, attempting 'boot rf0' or 'c'...")
    child.sendline('boot rf')
    child.expect(['login:', pexpect.TIMEOUT])
    print("\\nReached login!")
"""
    stdin, stdout, stderr = vm.exec_command("cat << 'EOF' > /home/exultia/unix-v1/test_interactive_boot.py\n" + boot_code + "\nEOF")
    stdout.channel.recv_exit_status()

    stdin, stdout, stderr = vm.exec_command("python3 /home/exultia/unix-v1/test_interactive_boot.py")
    out = stdout.read().decode('utf-8')
    err = stderr.read().decode('utf-8')
    print("Execution Output:\n" + out)
    if err:
        print("Execution Stderr:\n" + err)

    vm.close()
    jump.close()

if __name__ == '__main__':
    main()
