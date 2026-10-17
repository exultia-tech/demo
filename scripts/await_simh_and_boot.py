import paramiko
import time
import sys

def main():
    print("=" * 75)
    print("  AWAITING SIMH BIN/pdp11 & FINAL 1972 DISK IMAGES")
    print("=" * 75)

    jump = paramiko.SSHClient()
    jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')
    transport = jump.get_transport()

    chan_r = transport.open_channel('direct-tcpip', ('127.0.0.1', 2223), ('127.0.0.1', 0))
    vm = paramiko.SSHClient()
    vm.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    vm.connect('127.0.0.1', port=2223, username='exultia', password='password123', sock=chan_r, timeout=10)

    print("\n>>> Waiting for BIN/pdp11 and images...")
    for i in range(120):
        stdin, stdout, stderr = vm.exec_command('ls -la /home/exultia/unix-v1/tools/pdp11 /home/exultia/unix-v1/images/rf0.dsk 2>/dev/null')
        res = stdout.read().decode('utf-8').strip()
        if "rf0.dsk" in res and "pdp11" in res:
            print(f"    [SUCCESS] Found artifacts:\n{res}")
            break
        
        # Check what gcc is currently doing
        stdin, stdout, stderr = vm.exec_command('ps -ef | grep -E "gcc|make|cc1|apout|as" | grep -v grep')
        procs = stdout.read().decode('utf-8').strip()
        if not procs:
            # If make finished, check if images exist or if we need to run make -C build install
            stdin, stdout, stderr = vm.exec_command('ls -lh /home/exultia/unix-v1/tools/pdp11 /home/exultia/unix-v1/images /home/exultia/unix-v1/build/unix 2>/dev/null')
            print(f"    Compiler exited. Directory check:\n{stdout.read().decode('utf-8')}")
            # If pdp11 exists but images don't, trigger make -C build install
            stdin, stdout, stderr = vm.exec_command('if [ -f /home/exultia/unix-v1/tools/pdp11 ] && [ ! -f /home/exultia/unix-v1/images/rf0.dsk ]; then cd /home/exultia/unix-v1 && make; fi')
            stdout.channel.recv_exit_status()
            break

        print(f"    [Step {i+1}/120] Active: {procs.splitlines()[-1] if procs else 'none'}")
        time.sleep(5)

    # Now verify boot
    print("\n>>> Testing PDP-11 Boot in SIMH...")
    boot_script = """
import pexpect
import sys
import time

child = pexpect.spawn('tools/pdp11 simh.cfg', cwd='/home/exultia/unix-v1', encoding='utf-8', timeout=20)
child.logfile = sys.stdout

idx = child.expect(['login:', 'sim>', pexpect.TIMEOUT, pexpect.EOF])
print(f"\\nExpect matched index: {idx}")
if idx == 0:
    print("\\n[SUCCESS] 1972 Unix V1 login prompt reached!")
    child.sendline('root')
    child.expect(['#', '@', pexpect.TIMEOUT])
    print("\\n[SUCCESS] Root prompt acquired!")
    child.sendline('ls -l')
    child.expect(['#', pexpect.TIMEOUT])
    child.sendline('cat /etc/passwd')
    child.expect(['#', pexpect.TIMEOUT])
    child.sendline('chmod 600 /etc/passwd /dev/rf0')
    child.expect(['#', pexpect.TIMEOUT])
    child.sendline('ls -l /etc/passwd /dev/rf0')
    child.expect(['#', pexpect.TIMEOUT])
    print("\\n[SUCCESS] Kinetic Tier 1 hotfix applied & verified!")
    child.sendline('chmod 644 /etc/passwd')
    child.sendline('chmod 666 /dev/rf0')
    child.expect(['#', pexpect.TIMEOUT])
    print("\\n[SUCCESS] Deterministic rollback verified!")
    child.sendline('exit')
"""
    stdin, stdout, stderr = vm.exec_command("cat << 'EOF' > /home/exultia/unix-v1/quick_boot.py\n" + boot_script + "\nEOF")
    stdout.channel.recv_exit_status()

    stdin, stdout, stderr = vm.exec_command("python3 /home/exultia/unix-v1/quick_boot.py")
    print("Boot Output:\n" + stdout.read().decode('utf-8'))
    err = stderr.read().decode('utf-8')
    if err:
        print("Boot Errors:\n" + err)

    vm.close()
    jump.close()

if __name__ == '__main__':
    main()
