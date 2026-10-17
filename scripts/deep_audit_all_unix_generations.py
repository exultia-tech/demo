import paramiko
import json

def main():
    jump = paramiko.SSHClient()
    jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')
    transport = jump.get_transport()

    chan_u = transport.open_channel('direct-tcpip', ('127.0.0.1', 2222), ('127.0.0.1', 0))
    vm = paramiko.SSHClient()
    vm.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    vm.connect('127.0.0.1', port=2222, username='exultia', password='password123', sock=chan_u, timeout=10)

    milestones = [
        ('PDP-7 (1969)', '/home/exultia/research-pdp7'),
        ('Research V1 (1972)', '/home/exultia/research-v1'),
        ('Research V2 (1972)', '/home/exultia/research-v2'),
        ('Research V3 (1973)', '/home/exultia/research-v3'),
        ('Research V4 (1973)', '/home/exultia/research-v4'),
        ('Research V5 (1974)', '/home/exultia/research-v5'),
        ('Research V6 (1975)', '/home/exultia/research-v6'),
        ('Research V7 (1979)', '/home/exultia/research-v7'),
    ]

    report = {}

    for name, path in milestones:
        print(f"=== Auditing {name} in {path} ===")
        entry = {"name": name, "path": path}
        
        # 1. Total files and languages
        stdin, stdout, stderr = vm.exec_command(f"find {path} -maxdepth 3 -type f | wc -l")
        entry["fileCount"] = stdout.read().decode('utf-8').strip()

        # 2. Check for passwd file
        stdin, stdout, stderr = vm.exec_command(f"find {path} -name passwd -o -name \"*pass*\" 2>/dev/null")
        entry["passwdFiles"] = stdout.read().decode('utf-8').strip().splitlines()

        # 3. Check for su / login implementations
        stdin, stdout, stderr = vm.exec_command(f"find {path} -name \"su.*\" -o -name \"login.*\" 2>/dev/null")
        entry["authSources"] = stdout.read().decode('utf-8').strip().splitlines()

        # 4. Check for crypt() or hashing
        stdin, stdout, stderr = vm.exec_command(f"grep -rn \"crypt(\" {path} 2>/dev/null | head -n 5")
        entry["cryptUsage"] = stdout.read().decode('utf-8').strip().splitlines()

        # 5. Check sample contents
        if "research-v1" in path:
            stdin, stdout, stderr = vm.exec_command(f"cat {path}/etc/passwd 2>/dev/null || cat {path}/*/passwd 2>/dev/null")
            entry["samplePasswd"] = stdout.read().decode('utf-8').strip()
        elif "research-v6" in path:
            stdin, stdout, stderr = vm.exec_command(f"cat {path}/etc/passwd 2>/dev/null")
            entry["samplePasswd"] = stdout.read().decode('utf-8').strip()
            stdin, stdout, stderr = vm.exec_command(f"cat {path}/usr/source/s1/su.c 2>/dev/null | grep -A 10 \"getchar\"")
            entry["suVulnCode"] = stdout.read().decode('utf-8').strip()
        elif "research-v7" in path:
            stdin, stdout, stderr = vm.exec_command(f"cat {path}/etc/passwd 2>/dev/null")
            entry["samplePasswd"] = stdout.read().decode('utf-8').strip()
            stdin, stdout, stderr = vm.exec_command(f"cat {path}/usr/src/cmd/su.c 2>/dev/null | grep -A 8 \"getpass\"")
            entry["suCode"] = stdout.read().decode('utf-8').strip()
        elif "research-v4" in path:
            stdin, stdout, stderr = vm.exec_command(f"grep -n \"u_uid\" {path}/sys/user.h 2>/dev/null || grep -rn \"u_uid\" {path}/usr/sys/user.h 2>/dev/null")
            entry["uidDef"] = stdout.read().decode('utf-8').strip()

        report[name] = entry

    print("\n--- Summary Report ---")
    print(json.dumps(report, indent=2))

    with open('unix_evolution_audit.json', 'w') as f:
        json.dump(report, f, indent=2)

    vm.close()
    jump.close()

if __name__ == '__main__':
    main()
