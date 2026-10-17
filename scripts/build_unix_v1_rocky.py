"""
Automated Build, Boot, and Security Remediation Test of 1972 1st Edition UNIX
Target: Rocky Linux 9 VM (port 2223) or Ubuntu 24.04 VM (port 2222)
"""

import paramiko
import time
import sys

def run_cmd(vm, cmd, sudo=False):
    full_cmd = f"echo password123 | sudo -S {cmd}" if sudo else cmd
    stdin, stdout, stderr = vm.exec_command(full_cmd)
    code = stdout.channel.recv_exit_status()
    out = stdout.read().decode('utf-8', errors='ignore')
    err = stderr.read().decode('utf-8', errors='ignore')
    return code, out, err

def main():
    print("=" * 72)
    print("  EXULTIA KINETIC vs. 1972 UNIX 1ST EDITION (KEN & DENNIS RESTORATION)")
    print("=" * 72)

    jump = paramiko.SSHClient()
    jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')
    transport = jump.get_transport()

    # We will try Rocky 9 first
    print("\n>>> [1/5] Connecting to Linux build node (Rocky 9 on port 2223)...")
    chan_r = transport.open_channel('direct-tcpip', ('127.0.0.1', 2223), ('127.0.0.1', 0))
    vm = paramiko.SSHClient()
    vm.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    vm.connect('127.0.0.1', port=2223, username='exultia', password='password123', sock=chan_r, timeout=10)

    # Wait for dnf if still running
    print("    Checking if DNF installation is complete...")
    for _ in range(60):
        code, out, _ = run_cmd(vm, "which gcc make git")
        if "gcc" in out and "make" in out:
            print(f"    [OK] Build toolchain ready:\n{out.strip()}")
            break
        print("    Waiting for compiler toolchain to finish installation...")
        time.sleep(3)
    else:
        print("    Timeout waiting for toolchain on Rocky 9. Checking status...")

    # Step 2: Clone jserv/unix-v1
    print("\n>>> [2/5] Cloning 1972 1st Edition UNIX (jserv/unix-v1) with full submodules...")
    run_cmd(vm, "rm -rf /home/exultia/unix-v1")
    code, out, err = run_cmd(vm, "git clone --recursive https://github.com/jserv/unix-v1.git /home/exultia/unix-v1")
    print(f"    Git Clone Exit Code: {code}")
    if code != 0:
        print(f"    Git Clone Output: {out}\n{err}")
    
    code, out, _ = run_cmd(vm, "ls -la /home/exultia/unix-v1")
    print(f"    Repository contents:\n{out}")

    # Step 3: Compile unix-v1 (tools, PDP-11 simulator, filesystem, kernel)
    print("\n>>> [3/5] Compiling 1st Edition UNIX (tools, assembler, PDP-11 kernel, disks)...")
    code, out, err = run_cmd(vm, "cd /home/exultia/unix-v1 && make")
    print(f"    Make Exit Code: {code}")
    print(f"    Make Output (last 20 lines):\n" + "\n".join(out.splitlines()[-25:]))
    if err and code != 0:
        print(f"    Make Errors:\n{err}")

    # Inspect images
    code, out, _ = run_cmd(vm, "ls -la /home/exultia/unix-v1/images /home/exultia/unix-v1/tools/pdp11")
    print(f"    Generated artifacts:\n{out}")

    # Step 4: Boot Unix V1 in SIMH and capture 1972 console session
    print("\n>>> [4/5] Booting 1972 1st Edition UNIX on PDP-11 Simulator...")
    # Create an expect/interactive python or shell runner that feeds commands into pdp11 simh.cfg
    boot_script = """
import pexpect
import sys

print("[BOOT] Launching PDP-11 simulator with simh.cfg...")
child = pexpect.spawn('tools/pdp11 simh.cfg', cwd='/home/exultia/unix-v1', encoding='utf-8', timeout=15)
child.logfile = sys.stdout

idx = child.expect(['login:', 'sim>', pexpect.TIMEOUT, pexpect.EOF])
if idx == 0:
    print("\\n[BOOT] Reached 1972 Unix V1 login prompt! Logging in as root...")
    child.sendline('root')
    child.expect(['#', '@', pexpect.TIMEOUT])
    print("\\n[BOOT] Root shell acquired (#)! Running 1972 commands...")
    
    child.sendline('ls -l')
    child.expect(['#', pexpect.TIMEOUT])
    
    child.sendline('cat /etc/passwd')
    child.expect(['#', pexpect.TIMEOUT])
    
    child.sendline('chdir /usr')
    child.expect(['#', pexpect.TIMEOUT])
    
    child.sendline('ls -l')
    child.expect(['#', pexpect.TIMEOUT])
    
    child.sendline('exit')
else:
    print(f"\\n[BOOT] Unexpected simulator state: index {idx}")
"""
    run_cmd(vm, "cat << 'EOF' > /home/exultia/unix-v1/boot_test.py\n" + boot_script + "\nEOF")
    # Check if python3-pexpect is available or install it
    run_cmd(vm, "dnf install -y python3-pexpect", sudo=True)
    code, boot_out, boot_err = run_cmd(vm, "python3 /home/exultia/unix-v1/boot_test.py")
    print(f"    Console Output:\n{boot_out}")

    vm.close()
    jump.close()

if __name__ == '__main__':
    main()
