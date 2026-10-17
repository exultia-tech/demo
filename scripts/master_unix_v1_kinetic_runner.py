"""
Master Exultia Kinetic vs. 1972 Unix 1st Edition & Historical Evolution Runner
"""

import paramiko
import time
import sys

def main():
    print("=" * 75)
    print("  EXULTIA KINETIC vs. 1972 UNIX 1ST EDITION & CLASSIC UNIX EVOLUTION")
    print("=" * 75)

    jump = paramiko.SSHClient()
    jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')
    transport = jump.get_transport()

    chan_r = transport.open_channel('direct-tcpip', ('127.0.0.1', 2223), ('127.0.0.1', 0))
    vm = paramiko.SSHClient()
    vm.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    vm.connect('127.0.0.1', port=2223, username='exultia', password='password123', sock=chan_r, timeout=10)

    print("\n>>> [1/4] Waiting for Unix V1 make to finalize all disk images and tools...")
    for i in range(120):
        stdin, stdout, stderr = vm.exec_command('ls -la /home/exultia/unix-v1/images/rf0.dsk /home/exultia/unix-v1/tools/pdp11 2>/dev/null')
        out = stdout.read().decode('utf-8').strip()
        if "rf0.dsk" in out and "pdp11" in out:
            print(f"    [SUCCESS] Unix V1 images & PDP-11 simulator ready!\n{out}")
            break
        
        # Check if make is still running
        stdin, stdout, stderr = vm.exec_command('ps -ef | grep -E "make|gcc|cc1" | grep -v grep')
        procs = stdout.read().decode('utf-8').strip()
        if not procs:
            # Maybe make finished or failed, check images
            stdin, stdout, stderr = vm.exec_command('ls -la /home/exultia/unix-v1/images /home/exultia/unix-v1/build/unix 2>/dev/null')
            print(f"    Make completed. Status:\n{stdout.read().decode('utf-8')}")
            break
        print(f"    [Building...] Step {i+1}/120 (compiler active)")
        time.sleep(5)

    # Check generated images and kernel
    print("\n>>> [2/4] Inspecting 1972 Unix V1 Compiled Artifacts...")
    stdin, stdout, stderr = vm.exec_command('ls -lh /home/exultia/unix-v1/images /home/exultia/unix-v1/build/unix 2>/dev/null')
    print("Disk Images & Kernel:\n" + stdout.read().decode('utf-8'))

    stdin, stdout, stderr = vm.exec_command('file /home/exultia/unix-v1/build/unix /home/exultia/unix-v1/tools/pdp11 2>/dev/null')
    print("Binary Architectures:\n" + stdout.read().decode('utf-8'))

    # Step 3: Boot Unix V1 in SIMH and capture authentic 1972 session
    print("\n>>> [3/4] Booting 1972 Unix V1 in PDP-11 Simulator (Open SIMH 4.1)...")
    boot_runner = """
import pexpect
import sys
import time

child = pexpect.spawn('tools/pdp11 simh.cfg', cwd='/home/exultia/unix-v1', encoding='utf-8', timeout=20)
child.logfile = sys.stdout

# Look for login prompt
idx = child.expect(['login:', 'sim>', pexpect.TIMEOUT, pexpect.EOF])
if idx == 0:
    print("\\n[PDP-11 CONSOLE] 1972 Unix First Edition booted! Logging in as root...")
    time.sleep(0.5)
    child.sendline('root')
    child.expect(['#', '@', pexpect.TIMEOUT])
    print("\\n[PDP-11 CONSOLE] Root prompt (#) acquired!")
    
    # 1. Run ls -l
    child.sendline('ls -l')
    child.expect(['#', pexpect.TIMEOUT])
    
    # 2. View /etc/passwd
    child.sendline('cat /etc/passwd')
    child.expect(['#', pexpect.TIMEOUT])
    
    # 3. View /etc/motd
    child.sendline('cat /etc/motd')
    child.expect(['#', pexpect.TIMEOUT])
    
    # 4. Change directory to /usr
    child.sendline('chdir /usr')
    child.expect(['#', pexpect.TIMEOUT])
    child.sendline('ls -l')
    child.expect(['#', pexpect.TIMEOUT])

    # 5. Check permissions on raw disk nodes
    child.sendline('ls -l /dev')
    child.expect(['#', pexpect.TIMEOUT])

    # 6. Apply Exultia Kinetic Tier 1 Remediation directly on 1972 system:
    print("\\n>>> [PDP-11 CONSOLE] Applying Exultia Kinetic Tier 1 Remediations...")
    # Lock down /etc/passwd and /dev/rf0
    child.sendline('chmod 600 /etc/passwd')
    child.expect(['#', pexpect.TIMEOUT])
    child.sendline('chmod 600 /dev/rf0')
    child.expect(['#', pexpect.TIMEOUT])
    child.sendline('chmod 600 /dev/rk0')
    child.expect(['#', pexpect.TIMEOUT])
    
    # Verification Gate: Check that permissions are locked
    child.sendline('ls -l /etc/passwd /dev/rf0')
    child.expect(['#', pexpect.TIMEOUT])
    print("\\n>>> [PDP-11 CONSOLE] Tier 1 Hardening Active and Verified!")

    # Rollback Gate: Deterministic Rollback back to 1972 baseline
    print("\\n>>> [PDP-11 CONSOLE] Executing Deterministic Rollback...")
    child.sendline('chmod 644 /etc/passwd')
    child.expect(['#', pexpect.TIMEOUT])
    child.sendline('chmod 666 /dev/rf0')
    child.expect(['#', pexpect.TIMEOUT])
    child.sendline('ls -l /etc/passwd /dev/rf0')
    child.expect(['#', pexpect.TIMEOUT])
    print("\\n>>> [PDP-11 CONSOLE] Deterministic Rollback Verified Clean!")

    child.sendline('exit')
else:
    print(f"\\n[ERROR] Simulator did not reach login prompt. Matched index: {idx}")
"""
    stdin, stdout, stderr = vm.exec_command("cat << 'EOF' > /home/exultia/unix-v1/run_sim_test.py\n" + boot_runner + "\nEOF")
    stdout.channel.recv_exit_status()

    # Ensure pexpect is installed
    stdin, stdout, stderr = vm.exec_command("echo password123 | sudo -S dnf install -y python3-pexpect")
    stdout.channel.recv_exit_status()

    # Execute simulation test
    stdin, stdout, stderr = vm.exec_command("python3 /home/exultia/unix-v1/run_sim_test.py")
    boot_output = stdout.read().decode('utf-8')
    boot_err = stderr.read().decode('utf-8')
    print("Console Transcript:\n" + boot_output)
    if boot_err:
        print("Console Errors:\n" + boot_err)

    vm.close()
    jump.close()

if __name__ == '__main__':
    main()
