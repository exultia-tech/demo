import paramiko
import time

def check():
    jump = paramiko.SSHClient()
    jump.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    jump.connect('angrysquare', username='joeangry', key_filename=r'C:\Users\angrysquare\.ssh\id_ed25519')
    
    stdin, stdout, stderr = jump.exec_command('powershell -Command "Get-Process -Name qemu* | Select-Object Id, ProcessName, WorkingSet64"')
    print("QEMU Processes:")
    print(stdout.read().decode('utf-8', errors='ignore'))
    
    stdin, stdout, stderr = jump.exec_command('powershell -Command "Get-NetTCPConnection -LocalPort 2222, 2223 | Select-Object LocalPort, State, OwningProcess"')
    print("Ports:")
    print(stdout.read().decode('utf-8', errors='ignore'))
    jump.close()

if __name__ == '__main__':
    check()
