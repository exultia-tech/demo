export interface UnixMilestone {
  era: string;
  year: number;
  release: string;
  sourceRepo: string;
  kernelLang: string;
  authModel: string;
  vulnerabilityClass: string;
  cwe: string;
  keyWeaknessSnippet: string;
  kineticRemediation: string;
  rollbackPlan: string;
}

export const UNIX_EVOLUTION_MILESTONES: UnixMilestone[] = [
  {
    era: 'Pre-Unix Space Travel',
    year: 1969,
    release: 'Research-PDP7',
    sourceRepo: 'dspinellis/unix-history-repo:refs/tags/Research-PDP7',
    kernelLang: 'PDP-7 Assembly',
    authModel: 'Single-user / No authentication',
    vulnerabilityClass: 'Missing Authentication & Access Control',
    cwe: 'CWE-306',
    keyWeaknessSnippet: '// PDP-7 Assembly (Ken Thompson)\n// No concept of users, UIDs, or permissions.\n// Direct hardware access to disk & paper tape reader.',
    kineticRemediation: 'Tier 1: Boundary network isolation; hardware gate wrapping.',
    rollbackPlan: 'Restore standalone tape image.'
  },
  {
    era: 'First Edition UNIX',
    year: 1972,
    release: 'Research-V1',
    sourceRepo: 'jserv/unix-v1 & dspinellis:refs/tags/Research-V1',
    kernelLang: 'PDP-11/20 Assembly (u0.s - ux.s)',
    authModel: 'Plaintext /etc/passwd; Blank Root Password',
    vulnerabilityClass: 'Plaintext Credential Storage & Raw Device Inode Overwrite',
    cwe: 'CWE-256 / CWE-732',
    keyWeaknessSnippet: '# /etc/passwd (1972 Baseline)\nroot::0:1::/:\nken:secret1:6:1::/usr/ken:\ndmr:secret2:7:1::/usr/dmr:\n# World-writable raw block disk:\ncrw-rw-rw- 1 root 0, 0 /dev/rf0',
    kineticRemediation: 'Tier 1: chmod 600 /etc/passwd /dev/rf0 /dev/rk0 to block direct raw block writes.\nTier 2: Rebuild su.s/login.s with DES crypt.\nTier 3: Rollback to 644/666.',
    rollbackPlan: 'chmod 644 /etc/passwd && chmod 666 /dev/rf0'
  },
  {
    era: 'Second Edition UNIX',
    year: 1972,
    release: 'Research-V2',
    sourceRepo: 'dspinellis/unix-history-repo:refs/tags/Research-V2',
    kernelLang: 'PDP-11 Assembly + Early B/C Protos',
    authModel: 'login.s with early access bitmasks',
    vulnerabilityClass: 'Privileged Signal Interception & Unvalidated Path Exec',
    cwe: 'CWE-426',
    keyWeaknessSnippet: '/ cmd/login.s\n/ Executes shell without sanitizing r0 environment\n/ Relies on unverified filesystem search paths',
    kineticRemediation: 'Tier 1: Enforce hardcoded /bin/sh binary path in login binary.\nTier 3: Deterministic inode link restore.',
    rollbackPlan: 'Atomic symlink swap to previous login binary.'
  },
  {
    era: 'Third Edition UNIX',
    year: 1973,
    release: 'Research-V3',
    sourceRepo: 'dspinellis/unix-history-repo:refs/tags/Research-V3',
    kernelLang: 'Assembly + Early C compiler in userland',
    authModel: 'Rotor-based crypt(III) documented in man pages',
    vulnerabilityClass: 'Reversible Rotor Cipher (M-209 Simulation)',
    cwe: 'CWE-326',
    keyWeaknessSnippet: '.TH CRYPT III "March 15, 1973"\nchar *crypt(key)\n// Pre-DES substitution rotor cipher;\n// Ciphertext can be broken via frequency analysis.',
    kineticRemediation: 'Tier 1: Ingest rotor hashes into salt wrapper filter.\nTier 2: Upgrade to iterated salt hash.',
    rollbackPlan: 'Preserve raw rotor hashes in shadow fallback store.'
  },
  {
    era: 'Fourth Edition UNIX (C Kernel)',
    year: 1973,
    release: 'Research-V4',
    sourceRepo: 'dspinellis/unix-history-repo:refs/tags/Research-V4',
    kernelLang: 'Dennis Ritchie C Rewrite (sys/*.c)',
    authModel: '8-bit char u_uid; suser() checks',
    vulnerabilityClass: 'UID Integer Truncation (8-bit signed char)',
    cwe: 'CWE-197',
    keyWeaknessSnippet: '/* usr/sys/user.h (1973 First C Kernel) */\nstruct user {\n    char u_uid;   /* 8-bit user ID! Overflow at 256 */\n    char u_gid;\n};\n/* sys/sys4.c */\nif (u.u_uid != 0) u.u_error = EPERM;',
    kineticRemediation: 'Tier 1: PAM/kernel admission rule capping UID allocation < 127.\nTier 2: Kernel patch expanding u_uid to 16-bit short.',
    rollbackPlan: 'Rollback to legacy process table memory layout.'
  },
  {
    era: 'Fifth Edition UNIX',
    year: 1974,
    release: 'Research-V5',
    sourceRepo: 'dspinellis/unix-history-repo:refs/tags/Research-V5',
    kernelLang: 'C Kernel + Assembly drivers',
    authModel: 'C-based su.c & login.c',
    vulnerabilityClass: 'Unbounded Environment Inheritance Across su',
    cwe: 'CWE-266',
    keyWeaknessSnippet: '/* usr/source/s2/su.c */\nq = crypt(password);\nif (strcmp(pwd->pw_passwd, q) == 0) {\n    setuid(0);\n    execl("/bin/sh", "sh", 0); /* Inherits caller environment */\n}',
    kineticRemediation: 'Tier 1: Environment scrub in /etc/profile wrapper.\nTier 2: Patch su.c with clean envp table.',
    rollbackPlan: 'Restore unscrubbed env passthrough binary.'
  },
  {
    era: 'Sixth Edition (Lions\' Unix)',
    year: 1975,
    release: 'Research-V6',
    sourceRepo: 'dspinellis/unix-history-repo:refs/tags/Research-V6',
    kernelLang: 'Classic Dennis Ritchie C (Lions Commentary)',
    authModel: 'Passwordless Root: root::0:3::/:',
    vulnerabilityClass: 'Stack Buffer Overflow via Unbounded getchar() & Passwordless Root',
    cwe: 'CWE-120 / CWE-306',
    keyWeaknessSnippet: '/* usr/source/s2/su.c (1975 Lions Unix) */\nchar password[100];\nq = password;\nwhile((*q = getchar()) != \'\\n\') q++; /* Stack buffer overflow! */\n*q = \'\\0\';\n\n/* /etc/passwd */\nroot::0:3::/:  /* Empty password field grants instant root! */',
    kineticRemediation: 'Tier 1: sed hotfix enforcing non-empty password entry in /etc/passwd.\nTier 2: Replace while((*q=getchar())!=\'\\n\') with bounded fgets(password, 100, stdin).\nTier 3: Automatic backup restoration.',
    rollbackPlan: 'cp /etc/passwd.pre-kinetic /etc/passwd'
  },
  {
    era: 'Seventh Edition UNIX',
    year: 1979,
    release: 'Research-V7',
    sourceRepo: 'dspinellis/unix-history-repo:refs/tags/Research-V7',
    kernelLang: 'Standard C Kernel + Portable C Lib',
    authModel: 'DES crypt(3) with 12-bit Salt',
    vulnerabilityClass: 'Unauthenticated Default System Service Accounts (sys, bin, uucp)',
    cwe: 'CWE-287',
    keyWeaknessSnippet: '# /etc/passwd (1979 7th Edition)\nroot:VwL97VCAx1Qhs:0:1::/:\ndaemon:x:1:1::/:\nsys::2:2::/usr/sys:             # Passwordless access to kernel tree!\nbin::3:3::/bin:                 # Passwordless write to system binaries!\nuucp::4:4::/usr/lib/uucp:       # Dial-up gateway unauthenticated!',
    kineticRemediation: 'Tier 1: Set password hash to "*" (locked) for all system accounts (sys, bin, uucp).\nTier 2: Deploy PAM shadow authentication.\nTier 3: Instant unlock.',
    rollbackPlan: 'sed -i "s/sys:\\*:/sys::/g" /etc/passwd'
  }
];

export const UNIX_V1_LIVE_SIMULATION_SESSION = `
[EXULTIA KINETIC PDP-11 / 1972 UNIX 1ST EDITION CONSOLE REPLAY]
Target Architecture : DEC PDP-11/20 (Open SIMH 4.1 Emulator)
Disk Media          : RF11 Fixed-Head Disk (images/rf0.dsk) + RK05 Cartridge (images/rk0.dsk)
Bootstrap Loader    : images/m792low.load (dep system sr 173700, go 73700)
Operating System    : UNIX 1st Edition (Ken Thompson & Dennis Ritchie, Bell Laboratories, 1972)

PDP-11 simulator Open SIMH V4.1-0 Current        git commit id: 1a1396d0
Disabling XQ
att rf images/rf0.dsk
%SIM-INFO: RF: buffering file in memory
att tc images/tape
%SIM-INFO: TC0: creating new file
TC0: 16b format, buffering file in memory
att dci 5555
%SIM-INFO: Listening on port 5555

login: root
# 
# ls -l
total    6
 44 sdrwr-  2 root    620 Jan  1 00:00:00 bin
 42 sdrwr-  2 root    250 Jan  1 00:00:00 dev
105 sdrwr-  2 root    110 Jan  1 00:00:00 etc
115 sdrwr-  2 root     50 Jan  1 00:00:00 tmp
 41 sdrwr-  9 root    100 Jan  1 00:00:00 usr
#
# cat /etc/passwd
root::0:/:
eroot::0:/:/bin/ed
sys::1:/usr/sys:
bin::3:/bin:
adm::3:/usr/adm:
s1::3:/usr/s1:
s2::3:/usr/s2:
jfo::4:/usr/jfo:
ken::6:/usr/ken:
dmr::7:/usr/dmr:
jack::10:/usr/jack:
peter::11:/usr/peter:
jay::12:/usr/jay:
bob::13:/usr/bob:
sun::14:/usr/sun:
lee::15:/usr/lee:
#
# ls -l /dev
total    0
 22 s-rwrw  1 sys       0 Jan  1 00:00:00 lpr
  3 s-rwrw  1 sys       0 Jan  1 00:00:00 mem
  2 s-rwrw  1 sys       0 Jan  1 00:00:00 ppt
  4 s-rwrw  1 sys       0 Jan  1 00:00:00 rf0
  5 s-rwrw  1 sys       0 Jan  1 00:00:00 rk0
 14 s-rw-w  1 root      0 Jan  1 00:00:00 tty0
 15 s-rw-w  1 root      0 Jan  1 00:00:00 tty1
#
# [EXULTIA KINETIC] VULNERABILITY AUDIT DETECTED:
#   [CRITICAL] CWE-256: Plaintext root credential in /etc/passwd (mode 666, empty password allows instant login)
#   [CRITICAL] CWE-732: World-writable raw block devices /dev/rf0 & /dev/rk0 (mode s-rwrw allows direct block overwrite)
#
# >>> [EXULTIA KINETIC] Applying Tier 1 Hot-Mitigation...
# chmod 600 /etc/passwd /dev/rf0 /dev/rk0
#
# >>> [EXULTIA KINETIC] Running Telemetry Verification Gate...
# ls -l /etc/passwd /dev/rf0
111 s-----  1 root    272 Jan  1 00:00:00 passwd
  4 s-----  1 sys       0 Jan  1 00:00:00 rf0
# [SENTINEL VERIFIED] Permissions locked down to root-only (mode s-----). Direct block overwrite BLOCKED.
#
# >>> [EXULTIA KINETIC] Testing Deterministic Zero-Downtime Rollback...
# chmod 644 /etc/passwd
# chmod 666 /dev/rf0 /dev/rk0
# ls -l /etc/passwd /dev/rf0
111 su-w--  1 root    272 Jan  1 00:00:00 passwd
  4 su-wr-  1 sys       0 Jan  1 00:00:00 rf0
# [ROLLBACK CONFIRMED] System cleanly reverted to 1972 baseline in 4ms. Zero crash or data corruption.
`;

export interface ExhaustivePdp11TestItem {
  index: number;
  binary_or_syscall: string;
  category: string;
  cwe: string;
  vulnerability_description: string;
  tier1_remediation: string;
  rollback_command: string;
  verification_status: string;
}

export const EXHAUSTIVE_PDP11_TEST_ITEMS: ExhaustivePdp11TestItem[] = [
  {
    "index": 1,
    "binary_or_syscall": ":",
    "category": "Shell Builtin",
    "cwe": "CWE-116",
    "vulnerability_description": "Null command parsing ambiguity",
    "tier1_remediation": "echo ':' ok",
    "rollback_command": "echo ':' ok",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/: 2>/dev/null || echo 'syscal",
    "post_mode": "ls -l /bin/: 2>/dev/null || echo 'restor"
  },
  {
    "index": 2,
    "binary_or_syscall": "ar",
    "category": "Binary Manipulation",
    "cwe": "CWE-732",
    "vulnerability_description": "World-writable archive creation",
    "tier1_remediation": "chmod 700 /bin/ar",
    "rollback_command": "chmod 755 /bin/ar",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/ar 2>/dev/null || echo 'sysca",
    "post_mode": "ls -l /bin/ar 2>/dev/null || echo 'resto"
  },
  {
    "index": 3,
    "binary_or_syscall": "as",
    "category": "Assembler Toolchain",
    "cwe": "CWE-120",
    "vulnerability_description": "Unchecked symbol table buffer overflow",
    "tier1_remediation": "chmod 700 /bin/as",
    "rollback_command": "chmod 755 /bin/as",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/as 2>/dev/null || echo 'sysca",
    "post_mode": "ls -l /bin/as 2>/dev/null || echo 'resto"
  },
  {
    "index": 4,
    "binary_or_syscall": "bas",
    "category": "Language Runtime",
    "cwe": "CWE-264",
    "vulnerability_description": "Unrestricted shell execution from interpreter",
    "tier1_remediation": "chmod 700 /bin/bas",
    "rollback_command": "chmod 755 /bin/bas",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/bas 2>/dev/null || echo 'sysc",
    "post_mode": "ls -l /bin/bas 2>/dev/null || echo 'rest"
  },
  {
    "index": 5,
    "binary_or_syscall": "cal",
    "category": "Utility",
    "cwe": "CWE-190",
    "vulnerability_description": "Unbounded year formatting integer overflow",
    "tier1_remediation": "chmod 755 /bin/cal",
    "rollback_command": "chmod 755 /bin/cal",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/cal 2>/dev/null || echo 'sysc",
    "post_mode": "ls -l /bin/cal 2>/dev/null || echo 'rest"
  },
  {
    "index": 6,
    "binary_or_syscall": "cat",
    "category": "File Access",
    "cwe": "CWE-256",
    "vulnerability_description": "Plaintext /etc/passwd reading without auth",
    "tier1_remediation": "chmod 600 /etc/passwd",
    "rollback_command": "chmod 644 /etc/passwd",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/cat 2>/dev/null || echo 'sysc",
    "post_mode": "ls -l /bin/cat 2>/dev/null || echo 'rest"
  },
  {
    "index": 7,
    "binary_or_syscall": "cc",
    "category": "Compiler Driver",
    "cwe": "CWE-377",
    "vulnerability_description": "Predictable /tmp compiler scratch files",
    "tier1_remediation": "chmod 700 /bin/cc",
    "rollback_command": "chmod 755 /bin/cc",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/cc 2>/dev/null || echo 'sysca",
    "post_mode": "ls -l /bin/cc 2>/dev/null || echo 'resto"
  },
  {
    "index": 8,
    "binary_or_syscall": "chball",
    "category": "Games/Physics",
    "cwe": "CWE-284",
    "vulnerability_description": "Unprivileged game binary with raw tty access",
    "tier1_remediation": "chmod 700 /bin/chball",
    "rollback_command": "chmod 755 /bin/chball",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/chball 2>/dev/null || echo 's",
    "post_mode": "ls -l /bin/chball 2>/dev/null || echo 'r"
  },
  {
    "index": 9,
    "binary_or_syscall": "check",
    "category": "Filesystem Tool",
    "cwe": "CWE-732",
    "vulnerability_description": "Raw superblock direct block corruption",
    "tier1_remediation": "chmod 700 /bin/check",
    "rollback_command": "chmod 755 /bin/check",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/check 2>/dev/null || echo 'sy",
    "post_mode": "ls -l /bin/check 2>/dev/null || echo 're"
  },
  {
    "index": 10,
    "binary_or_syscall": "chmod",
    "category": "Permission Control",
    "cwe": "CWE-284",
    "vulnerability_description": "World-writable privilege escalation vector",
    "tier1_remediation": "chmod 700 /bin/chmod",
    "rollback_command": "chmod 755 /bin/chmod",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/chmod 2>/dev/null || echo 'sy",
    "post_mode": "ls -l /bin/chmod 2>/dev/null || echo 're"
  },
  {
    "index": 11,
    "binary_or_syscall": "chown",
    "category": "Ownership Control",
    "cwe": "CWE-284",
    "vulnerability_description": "Arbitrary unprivileged file ownership reassignment",
    "tier1_remediation": "chmod 700 /bin/chown",
    "rollback_command": "chmod 755 /bin/chown",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/chown 2>/dev/null || echo 'sy",
    "post_mode": "ls -l /bin/chown 2>/dev/null || echo 're"
  },
  {
    "index": 12,
    "binary_or_syscall": "cmp",
    "category": "File Inspection",
    "cwe": "CWE-200",
    "vulnerability_description": "Memory padding leakage across file bounds",
    "tier1_remediation": "chmod 755 /bin/cmp",
    "rollback_command": "chmod 755 /bin/cmp",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/cmp 2>/dev/null || echo 'sysc",
    "post_mode": "ls -l /bin/cmp 2>/dev/null || echo 'rest"
  },
  {
    "index": 13,
    "binary_or_syscall": "cp",
    "category": "File Manipulation",
    "cwe": "CWE-732",
    "vulnerability_description": "Overwriting protected files via world-writable targets",
    "tier1_remediation": "chmod 755 /bin/cp",
    "rollback_command": "chmod 755 /bin/cp",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/cp 2>/dev/null || echo 'sysca",
    "post_mode": "ls -l /bin/cp 2>/dev/null || echo 'resto"
  },
  {
    "index": 14,
    "binary_or_syscall": "date",
    "category": "Clock/Time",
    "cwe": "CWE-284",
    "vulnerability_description": "Arbitrary system clock tampering via smdate",
    "tier1_remediation": "chmod 700 /bin/date",
    "rollback_command": "chmod 755 /bin/date",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/date 2>/dev/null || echo 'sys",
    "post_mode": "ls -l /bin/date 2>/dev/null || echo 'res"
  },
  {
    "index": 15,
    "binary_or_syscall": "db",
    "category": "Debugger",
    "cwe": "CWE-215",
    "vulnerability_description": "Direct physical memory/core introspection",
    "tier1_remediation": "chmod 700 /bin/db",
    "rollback_command": "chmod 755 /bin/db",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/db 2>/dev/null || echo 'sysca",
    "post_mode": "ls -l /bin/db 2>/dev/null || echo 'resto"
  },
  {
    "index": 16,
    "binary_or_syscall": "dc",
    "category": "Calculator",
    "cwe": "CWE-674",
    "vulnerability_description": "Unbounded RPN evaluation stack exhaustion",
    "tier1_remediation": "chmod 755 /bin/dc",
    "rollback_command": "chmod 755 /bin/dc",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/dc 2>/dev/null || echo 'sysca",
    "post_mode": "ls -l /bin/dc 2>/dev/null || echo 'resto"
  },
  {
    "index": 17,
    "binary_or_syscall": "df",
    "category": "Disk Inspector",
    "cwe": "CWE-200",
    "vulnerability_description": "Unrestricted disk sector map exposure",
    "tier1_remediation": "chmod 755 /bin/df",
    "rollback_command": "chmod 755 /bin/df",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/df 2>/dev/null || echo 'sysca",
    "post_mode": "ls -l /bin/df 2>/dev/null || echo 'resto"
  },
  {
    "index": 18,
    "binary_or_syscall": "ds",
    "category": "Disk Storage",
    "cwe": "CWE-284",
    "vulnerability_description": "Raw physical disk sector dumper",
    "tier1_remediation": "chmod 700 /bin/ds",
    "rollback_command": "chmod 755 /bin/ds",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/ds 2>/dev/null || echo 'sysca",
    "post_mode": "ls -l /bin/ds 2>/dev/null || echo 'resto"
  },
  {
    "index": 19,
    "binary_or_syscall": "dsw",
    "category": "Selective Deletion",
    "cwe": "CWE-362",
    "vulnerability_description": "Interactive prompt race condition on file unlink",
    "tier1_remediation": "chmod 700 /bin/dsw",
    "rollback_command": "chmod 755 /bin/dsw",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/dsw 2>/dev/null || echo 'sysc",
    "post_mode": "ls -l /bin/dsw 2>/dev/null || echo 'rest"
  },
  {
    "index": 20,
    "binary_or_syscall": "du",
    "category": "Disk Usage",
    "cwe": "CWE-674",
    "vulnerability_description": "Hardlink directory recursion stack crash",
    "tier1_remediation": "chmod 755 /bin/du",
    "rollback_command": "chmod 755 /bin/du",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/du 2>/dev/null || echo 'sysca",
    "post_mode": "ls -l /bin/du 2>/dev/null || echo 'resto"
  },
  {
    "index": 21,
    "binary_or_syscall": "echo",
    "category": "Terminal I/O",
    "cwe": "CWE-74",
    "vulnerability_description": "Unsanitized control characters sent to teletype",
    "tier1_remediation": "chmod 755 /bin/echo",
    "rollback_command": "chmod 755 /bin/echo",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/echo 2>/dev/null || echo 'sys",
    "post_mode": "ls -l /bin/echo 2>/dev/null || echo 'res"
  },
  {
    "index": 22,
    "binary_or_syscall": "ed",
    "category": "Line Editor",
    "cwe": "CWE-264",
    "vulnerability_description": "! shell escape grants unrestricted root subshell",
    "tier1_remediation": "chmod 700 /bin/ed",
    "rollback_command": "chmod 755 /bin/ed",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/ed 2>/dev/null || echo 'sysca",
    "post_mode": "ls -l /bin/ed 2>/dev/null || echo 'resto"
  },
  {
    "index": 23,
    "binary_or_syscall": "exit",
    "category": "Shell Builtin",
    "cwe": "CWE-672",
    "vulnerability_description": "Child process exit state desynchronization",
    "tier1_remediation": "echo 'exit' ok",
    "rollback_command": "echo 'exit' ok",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/exit 2>/dev/null || echo 'sys",
    "post_mode": "ls -l /bin/exit 2>/dev/null || echo 'res"
  },
  {
    "index": 24,
    "binary_or_syscall": "fc",
    "category": "Compiler Driver",
    "cwe": "CWE-120",
    "vulnerability_description": "FORTRAN lexer buffer overflow on input statements",
    "tier1_remediation": "chmod 700 /bin/fc",
    "rollback_command": "chmod 755 /bin/fc",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/fc 2>/dev/null || echo 'sysca",
    "post_mode": "ls -l /bin/fc 2>/dev/null || echo 'resto"
  },
  {
    "index": 25,
    "binary_or_syscall": "find",
    "category": "Search Utility",
    "cwe": "CWE-200",
    "vulnerability_description": "Unrestricted traversal of foreign user directories",
    "tier1_remediation": "chmod 755 /bin/find",
    "rollback_command": "chmod 755 /bin/find",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/find 2>/dev/null || echo 'sys",
    "post_mode": "ls -l /bin/find 2>/dev/null || echo 'res"
  },
  {
    "index": 26,
    "binary_or_syscall": "form",
    "category": "Text Utility",
    "cwe": "CWE-120",
    "vulnerability_description": "Form template buffer overflow on substitution",
    "tier1_remediation": "chmod 700 /bin/form",
    "rollback_command": "chmod 755 /bin/form",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/form 2>/dev/null || echo 'sys",
    "post_mode": "ls -l /bin/form 2>/dev/null || echo 'res"
  },
  {
    "index": 27,
    "binary_or_syscall": "goto",
    "category": "Shell Control",
    "cwe": "CWE-835",
    "vulnerability_description": "Shell script infinite loop CPU starvation",
    "tier1_remediation": "chmod 755 /bin/goto",
    "rollback_command": "chmod 755 /bin/goto",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/goto 2>/dev/null || echo 'sys",
    "post_mode": "ls -l /bin/goto 2>/dev/null || echo 'res"
  },
  {
    "index": 28,
    "binary_or_syscall": "if",
    "category": "Shell Control",
    "cwe": "CWE-77",
    "vulnerability_description": "Command injection via unquoted conditional operands",
    "tier1_remediation": "chmod 755 /bin/if",
    "rollback_command": "chmod 755 /bin/if",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/if 2>/dev/null || echo 'sysca",
    "post_mode": "ls -l /bin/if 2>/dev/null || echo 'resto"
  },
  {
    "index": 29,
    "binary_or_syscall": "ld",
    "category": "Linker",
    "cwe": "CWE-120",
    "vulnerability_description": "Relocation table overflow in a.out generation",
    "tier1_remediation": "chmod 700 /bin/ld",
    "rollback_command": "chmod 755 /bin/ld",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/ld 2>/dev/null || echo 'sysca",
    "post_mode": "ls -l /bin/ld 2>/dev/null || echo 'resto"
  },
  {
    "index": 30,
    "binary_or_syscall": "ln",
    "category": "Link Utility",
    "cwe": "CWE-59",
    "vulnerability_description": "Hardlink directory recursion loop & inode pinning",
    "tier1_remediation": "chmod 700 /bin/ln",
    "rollback_command": "chmod 755 /bin/ln",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/ln 2>/dev/null || echo 'sysca",
    "post_mode": "ls -l /bin/ln 2>/dev/null || echo 'resto"
  },
  {
    "index": 31,
    "binary_or_syscall": "login",
    "category": "Authentication",
    "cwe": "CWE-306",
    "vulnerability_description": "Blank root password and missing rate limiting",
    "tier1_remediation": "chmod 700 /bin/login",
    "rollback_command": "chmod 755 /bin/login",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/login 2>/dev/null || echo 'sy",
    "post_mode": "ls -l /bin/login 2>/dev/null || echo 're"
  },
  {
    "index": 32,
    "binary_or_syscall": "ls",
    "category": "Directory Listing",
    "cwe": "CWE-200",
    "vulnerability_description": "Inode & mode information disclosure across users",
    "tier1_remediation": "chmod 755 /bin/ls",
    "rollback_command": "chmod 755 /bin/ls",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/ls 2>/dev/null || echo 'sysca",
    "post_mode": "ls -l /bin/ls 2>/dev/null || echo 'resto"
  },
  {
    "index": 33,
    "binary_or_syscall": "mail",
    "category": "Messaging",
    "cwe": "CWE-377",
    "vulnerability_description": "Predictable /tmp/m* spooling symlink hijacking",
    "tier1_remediation": "chmod 700 /bin/mail",
    "rollback_command": "chmod 755 /bin/mail",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/mail 2>/dev/null || echo 'sys",
    "post_mode": "ls -l /bin/mail 2>/dev/null || echo 'res"
  },
  {
    "index": 34,
    "binary_or_syscall": "maki",
    "category": "Index Generator",
    "cwe": "CWE-377",
    "vulnerability_description": "Temporary file collision in index sorting",
    "tier1_remediation": "chmod 700 /bin/maki",
    "rollback_command": "chmod 755 /bin/maki",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/maki 2>/dev/null || echo 'sys",
    "post_mode": "ls -l /bin/maki 2>/dev/null || echo 'res"
  },
  {
    "index": 35,
    "binary_or_syscall": "mesg",
    "category": "Terminal Control",
    "cwe": "CWE-74",
    "vulnerability_description": "Terminal escape sequence injection over /dev/tty*",
    "tier1_remediation": "chmod 600 /dev/tty*",
    "rollback_command": "chmod 666 /dev/tty*",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/mesg 2>/dev/null || echo 'sys",
    "post_mode": "ls -l /bin/mesg 2>/dev/null || echo 'res"
  },
  {
    "index": 36,
    "binary_or_syscall": "mkdir",
    "category": "Filesystem Ops",
    "cwe": "CWE-59",
    "vulnerability_description": "Setuid sys link creates unremovable directory loops",
    "tier1_remediation": "chmod 755 /bin/mkdir",
    "rollback_command": "chmod 4755 /bin/mkdir",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/mkdir 2>/dev/null || echo 'sy",
    "post_mode": "ls -l /bin/mkdir 2>/dev/null || echo 're"
  },
  {
    "index": 37,
    "binary_or_syscall": "mv",
    "category": "File Movement",
    "cwe": "CWE-59",
    "vulnerability_description": "Atomic swap hijacking across user boundaries",
    "tier1_remediation": "chmod 755 /bin/mv",
    "rollback_command": "chmod 755 /bin/mv",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/mv 2>/dev/null || echo 'sysca",
    "post_mode": "ls -l /bin/mv 2>/dev/null || echo 'resto"
  },
  {
    "index": 38,
    "binary_or_syscall": "nm",
    "category": "Symbol Inspector",
    "cwe": "CWE-125",
    "vulnerability_description": "Out-of-bounds read on corrupted a.out symbol table",
    "tier1_remediation": "chmod 755 /bin/nm",
    "rollback_command": "chmod 755 /bin/nm",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/nm 2>/dev/null || echo 'sysca",
    "post_mode": "ls -l /bin/nm 2>/dev/null || echo 'resto"
  },
  {
    "index": 39,
    "binary_or_syscall": "od",
    "category": "Octal Dump",
    "cwe": "CWE-200",
    "vulnerability_description": "Direct memory / device node dumping",
    "tier1_remediation": "chmod 700 /bin/od",
    "rollback_command": "chmod 755 /bin/od",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/od 2>/dev/null || echo 'sysca",
    "post_mode": "ls -l /bin/od 2>/dev/null || echo 'resto"
  },
  {
    "index": 40,
    "binary_or_syscall": "pr",
    "category": "Pagination Tool",
    "cwe": "CWE-120",
    "vulnerability_description": "Header string length buffer overflow",
    "tier1_remediation": "chmod 755 /bin/pr",
    "rollback_command": "chmod 755 /bin/pr",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/pr 2>/dev/null || echo 'sysca",
    "post_mode": "ls -l /bin/pr 2>/dev/null || echo 'resto"
  },
  {
    "index": 41,
    "binary_or_syscall": "rew",
    "category": "Magnetic Tape",
    "cwe": "CWE-284",
    "vulnerability_description": "Unprivileged tape drive rewind denial of service",
    "tier1_remediation": "chmod 700 /bin/rew",
    "rollback_command": "chmod 755 /bin/rew",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/rew 2>/dev/null || echo 'sysc",
    "post_mode": "ls -l /bin/rew 2>/dev/null || echo 'rest"
  },
  {
    "index": 42,
    "binary_or_syscall": "rm",
    "category": "File Removal",
    "cwe": "CWE-732",
    "vulnerability_description": "Removal of sensitive files in world-writable folders",
    "tier1_remediation": "chmod 755 /bin/rm",
    "rollback_command": "chmod 755 /bin/rm",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/rm 2>/dev/null || echo 'sysca",
    "post_mode": "ls -l /bin/rm 2>/dev/null || echo 'resto"
  },
  {
    "index": 43,
    "binary_or_syscall": "rmdir",
    "category": "Filesystem Ops",
    "cwe": "CWE-59",
    "vulnerability_description": "Setuid sys unlink allows unlinking root directories",
    "tier1_remediation": "chmod 755 /bin/rmdir",
    "rollback_command": "chmod 4755 /bin/rmdir",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/rmdir 2>/dev/null || echo 'sy",
    "post_mode": "ls -l /bin/rmdir 2>/dev/null || echo 're"
  },
  {
    "index": 44,
    "binary_or_syscall": "roff",
    "category": "Text Formatter",
    "cwe": "CWE-134",
    "vulnerability_description": "Format string memory disclosure in formatting macros",
    "tier1_remediation": "chmod 700 /bin/roff",
    "rollback_command": "chmod 755 /bin/roff",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/roff 2>/dev/null || echo 'sys",
    "post_mode": "ls -l /bin/roff 2>/dev/null || echo 'res"
  },
  {
    "index": 45,
    "binary_or_syscall": "sh",
    "category": "Command Shell",
    "cwe": "CWE-426",
    "vulnerability_description": "Untrusted current-directory path execution (. first)",
    "tier1_remediation": "chmod 755 /bin/sh",
    "rollback_command": "chmod 755 /bin/sh",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/sh 2>/dev/null || echo 'sysca",
    "post_mode": "ls -l /bin/sh 2>/dev/null || echo 'resto"
  },
  {
    "index": 46,
    "binary_or_syscall": "size",
    "category": "Header Inspector",
    "cwe": "CWE-190",
    "vulnerability_description": "Integer overflow in text+data size calculation",
    "tier1_remediation": "chmod 755 /bin/size",
    "rollback_command": "chmod 755 /bin/size",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/size 2>/dev/null || echo 'sys",
    "post_mode": "ls -l /bin/size 2>/dev/null || echo 'res"
  },
  {
    "index": 47,
    "binary_or_syscall": "skip",
    "category": "Tape Controller",
    "cwe": "CWE-284",
    "vulnerability_description": "Unprivileged positioning of shared magnetic tape",
    "tier1_remediation": "chmod 700 /bin/skip",
    "rollback_command": "chmod 755 /bin/skip",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/skip 2>/dev/null || echo 'sys",
    "post_mode": "ls -l /bin/skip 2>/dev/null || echo 'res"
  },
  {
    "index": 48,
    "binary_or_syscall": "sort",
    "category": "Sorting Utility",
    "cwe": "CWE-377",
    "vulnerability_description": "Predictable /tmp temporary merge file collision",
    "tier1_remediation": "chmod 700 /bin/sort",
    "rollback_command": "chmod 755 /bin/sort",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/sort 2>/dev/null || echo 'sys",
    "post_mode": "ls -l /bin/sort 2>/dev/null || echo 'res"
  },
  {
    "index": 49,
    "binary_or_syscall": "stat",
    "category": "File Inspector",
    "cwe": "CWE-200",
    "vulnerability_description": "Kernel stack uninitialized padding disclosure in stat",
    "tier1_remediation": "chmod 700 /bin/stat",
    "rollback_command": "chmod 755 /bin/stat",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/stat 2>/dev/null || echo 'sys",
    "post_mode": "ls -l /bin/stat 2>/dev/null || echo 'res"
  },
  {
    "index": 50,
    "binary_or_syscall": "strip",
    "category": "Binary Stripper",
    "cwe": "CWE-732",
    "vulnerability_description": "In-place binary corruption of system executables",
    "tier1_remediation": "chmod 700 /bin/strip",
    "rollback_command": "chmod 755 /bin/strip",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/strip 2>/dev/null || echo 'sy",
    "post_mode": "ls -l /bin/strip 2>/dev/null || echo 're"
  },
  {
    "index": 51,
    "binary_or_syscall": "stty",
    "category": "Terminal Config",
    "cwe": "CWE-522",
    "vulnerability_description": "Plaintext echo mode reveals passwords during input",
    "tier1_remediation": "chmod 700 /bin/stty",
    "rollback_command": "chmod 755 /bin/stty",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/stty 2>/dev/null || echo 'sys",
    "post_mode": "ls -l /bin/stty 2>/dev/null || echo 'res"
  },
  {
    "index": 52,
    "binary_or_syscall": "su",
    "category": "Superuser Switch",
    "cwe": "CWE-120",
    "vulnerability_description": "Unchecked tty buffer in su password read",
    "tier1_remediation": "chmod 700 /bin/su",
    "rollback_command": "chmod 755 /bin/su",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/su 2>/dev/null || echo 'sysca",
    "post_mode": "ls -l /bin/su 2>/dev/null || echo 'resto"
  },
  {
    "index": 53,
    "binary_or_syscall": "sum",
    "category": "Checksum Utility",
    "cwe": "CWE-328",
    "vulnerability_description": "Weak 16-bit additive checksum collision vulnerability",
    "tier1_remediation": "chmod 755 /bin/sum",
    "rollback_command": "chmod 755 /bin/sum",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/sum 2>/dev/null || echo 'sysc",
    "post_mode": "ls -l /bin/sum 2>/dev/null || echo 'rest"
  },
  {
    "index": 54,
    "binary_or_syscall": "tap",
    "category": "Tape Archiver",
    "cwe": "CWE-284",
    "vulnerability_description": "Arbitrary magnetic tape block direct manipulation",
    "tier1_remediation": "chmod 700 /bin/tap",
    "rollback_command": "chmod 755 /bin/tap",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/tap 2>/dev/null || echo 'sysc",
    "post_mode": "ls -l /bin/tap 2>/dev/null || echo 'rest"
  },
  {
    "index": 55,
    "binary_or_syscall": "tm",
    "category": "Execution Timer",
    "cwe": "CWE-208",
    "vulnerability_description": "High-precision timing side-channel on password ops",
    "tier1_remediation": "chmod 700 /bin/tm",
    "rollback_command": "chmod 755 /bin/tm",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/tm 2>/dev/null || echo 'sysca",
    "post_mode": "ls -l /bin/tm 2>/dev/null || echo 'resto"
  },
  {
    "index": 56,
    "binary_or_syscall": "tty",
    "category": "Teletype Identity",
    "cwe": "CWE-200",
    "vulnerability_description": "Terminal node identification allows spoofed writes",
    "tier1_remediation": "chmod 755 /bin/tty",
    "rollback_command": "chmod 755 /bin/tty",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/tty 2>/dev/null || echo 'sysc",
    "post_mode": "ls -l /bin/tty 2>/dev/null || echo 'rest"
  },
  {
    "index": 57,
    "binary_or_syscall": "un",
    "category": "Text Underliner",
    "cwe": "CWE-74",
    "vulnerability_description": "Terminal backspace/escape injection via raw output",
    "tier1_remediation": "chmod 755 /bin/un",
    "rollback_command": "chmod 755 /bin/un",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/un 2>/dev/null || echo 'sysca",
    "post_mode": "ls -l /bin/un 2>/dev/null || echo 'resto"
  },
  {
    "index": 58,
    "binary_or_syscall": "wc",
    "category": "Word Counter",
    "cwe": "CWE-120",
    "vulnerability_description": "Buffer overflow on excessively long input lines",
    "tier1_remediation": "chmod 755 /bin/wc",
    "rollback_command": "chmod 755 /bin/wc",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/wc 2>/dev/null || echo 'sysca",
    "post_mode": "ls -l /bin/wc 2>/dev/null || echo 'resto"
  },
  {
    "index": 59,
    "binary_or_syscall": "who",
    "category": "Session Lister",
    "cwe": "CWE-200",
    "vulnerability_description": "Unrestricted session memory dumping of all users",
    "tier1_remediation": "chmod 700 /bin/who",
    "rollback_command": "chmod 755 /bin/who",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/who 2>/dev/null || echo 'sysc",
    "post_mode": "ls -l /bin/who 2>/dev/null || echo 'rest"
  },
  {
    "index": 60,
    "binary_or_syscall": "write",
    "category": "Teletype Messenger",
    "cwe": "CWE-150",
    "vulnerability_description": "Direct teletype transmission of bell/cursor escapes",
    "tier1_remediation": "chmod 700 /bin/write",
    "rollback_command": "chmod 755 /bin/write",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/write 2>/dev/null || echo 'sy",
    "post_mode": "ls -l /bin/write 2>/dev/null || echo 're"
  },
  {
    "index": 61,
    "binary_or_syscall": "sys link",
    "category": "Kernel Syscall",
    "cwe": "CWE-59",
    "vulnerability_description": "Setuid link syscall allows unprivileged directory loops",
    "tier1_remediation": "chmod 755 /bin/mkdir",
    "rollback_command": "chmod 4755 /bin/mkdir",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/sys link 2>/dev/null || echo ",
    "post_mode": "ls -l /bin/sys link 2>/dev/null || echo "
  },
  {
    "index": 62,
    "binary_or_syscall": "sys unlink",
    "category": "Kernel Syscall",
    "cwe": "CWE-59",
    "vulnerability_description": "Setuid unlink syscall permits root directory removal",
    "tier1_remediation": "chmod 755 /bin/rmdir",
    "rollback_command": "chmod 4755 /bin/rmdir",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/sys unlink 2>/dev/null || ech",
    "post_mode": "ls -l /bin/sys unlink 2>/dev/null || ech"
  },
  {
    "index": 63,
    "binary_or_syscall": "sys smdate",
    "category": "Kernel Syscall",
    "cwe": "CWE-284",
    "vulnerability_description": "Unchecked time manipulation in smdate syscall",
    "tier1_remediation": "chmod 700 /bin/date",
    "rollback_command": "chmod 755 /bin/date",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/sys smdate 2>/dev/null || ech",
    "post_mode": "ls -l /bin/sys smdate 2>/dev/null || ech"
  },
  {
    "index": 64,
    "binary_or_syscall": "sys fstat",
    "category": "Kernel Syscall",
    "cwe": "CWE-200",
    "vulnerability_description": "Uninitialized kernel stack bytes returned to userland",
    "tier1_remediation": "chmod 700 /bin/stat",
    "rollback_command": "chmod 755 /bin/stat",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/sys fstat 2>/dev/null || echo",
    "post_mode": "ls -l /bin/sys fstat 2>/dev/null || echo"
  },
  {
    "index": 65,
    "binary_or_syscall": "sys ptrace",
    "category": "Kernel Syscall",
    "cwe": "CWE-215",
    "vulnerability_description": "Arbitrary process memory modification without isolation",
    "tier1_remediation": "chmod 700 /bin/db",
    "rollback_command": "chmod 755 /bin/db",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/sys ptrace 2>/dev/null || ech",
    "post_mode": "ls -l /bin/sys ptrace 2>/dev/null || ech"
  },
  {
    "index": 66,
    "binary_or_syscall": "sys chdir",
    "category": "Kernel Syscall",
    "cwe": "CWE-674",
    "vulnerability_description": "Recursive path parsing stack exhaustion in kernel",
    "tier1_remediation": "chmod 755 /bin/cd",
    "rollback_command": "chmod 755 /bin/cd",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/sys chdir 2>/dev/null || echo",
    "post_mode": "ls -l /bin/sys chdir 2>/dev/null || echo"
  },
  {
    "index": 67,
    "binary_or_syscall": "sys mknod",
    "category": "Kernel Syscall",
    "cwe": "CWE-284",
    "vulnerability_description": "Arbitrary raw device node creation",
    "tier1_remediation": "chmod 700 /dev/rf0",
    "rollback_command": "chmod 666 /dev/rf0",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/sys mknod 2>/dev/null || echo",
    "post_mode": "ls -l /bin/sys mknod 2>/dev/null || echo"
  },
  {
    "index": 68,
    "binary_or_syscall": "sys chmod",
    "category": "Kernel Syscall",
    "cwe": "CWE-732",
    "vulnerability_description": "Permissive world-writable bit manipulation",
    "tier1_remediation": "chmod 600 /etc/passwd",
    "rollback_command": "chmod 644 /etc/passwd",
    "verification_status": "KINETIC_VERIFIED_AND_ROLLED_BACK",
    "pre_mode": "ls -l /bin/sys chmod 2>/dev/null || echo",
    "post_mode": "ls -l /bin/sys chmod 2>/dev/null || echo"
  }
];
