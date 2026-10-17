"""
Incremental Classic Unix Security Evolution Audit & Remediation
Clones shallow tags from https://github.com/dspinellis/unix-history-repo:
  - Research-V1 (1972)
  - Research-V6 (1975)
  - Research-V7 (1979)
And evaluates the evolution of security vulnerabilities and Kinetic remediations.
"""

import paramiko
import time

def run_cmd(vm, cmd):
    stdin, stdout, stderr = vm.exec_command(cmd)
    code = stdout.channel.recv_exit_status()
    out = stdout.read().decode('utf-8', errors='ignore')
    err = stderr.read().decode('utf-8', errors='ignore')
    return code, out, err

def main():
    print("=" * 72)
    print("  EXULTIA KINETIC: HISTORICAL UNIX EVOLUTION SECURITY AUDIT (V1 - V7)")
    print("=" * 72)

    jump = paramiko.SSHClient()
    jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')
    transport = jump.get_transport()

    chan_u = transport.open_channel('direct-tcpip', ('127.0.0.1', 2222), ('127.0.0.1', 0))
    vm = paramiko.SSHClient()
    vm.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    vm.connect('127.0.0.1', port=2222, username='exultia', password='password123', sock=chan_u, timeout=10)

    tags = ["Research-V1", "Research-V6", "Research-V7"]
    repo_url = "https://github.com/dspinellis/unix-history-repo.git"

    for tag in tags:
        dest = f"/home/exultia/{tag.lower()}"
        print(f"\n>>> Fetching shallow snapshot of {tag}...")
        run_cmd(vm, f"rm -rf {dest}")
        code, out, err = run_cmd(vm, f"git clone --depth 1 --branch {tag} {repo_url} {dest}")
        print(f"    Clone {tag}: Exit {code}")
        
        # Check files
        code, out, _ = run_cmd(vm, f"ls -la {dest}")
        print(f"    Files in {tag}:\n" + "\n".join(out.splitlines()[:10]))
        
        # Check password file if exists
        code, out, _ = run_cmd(vm, f"find {dest} -name passwd -o -name su.c -o -name su.s -o -name login.c -o -name login.s")
        print(f"    Security-relevant files found:\n{out.strip()}")

    vm.close()
    jump.close()

if __name__ == '__main__':
    main()
