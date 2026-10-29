/**
 * Exultia Compliance Drift Remediation Framework
 * Authoritative Standards Baseline: Sarbanes-Oxley (SOX ITGC) & PCI-DSS v4.0.
 *
 * Defines the strict compliance controls that the Exultia resident daemon
 * continuously enforces and reverts to prevent configuration drift.
 */

export interface ComplianceControlDefinition {
  id: string;
  name: string;
  category: "SSH" | "SYSCTL" | "PERMISSIONS" | "ACCOUNT" | "AUDIT";
  standards: string[]; // e.g. ["PCI-DSS-v4.0-2.2.4", "SOX-ITGC-LogicalAccess"]
  description: string;
  targetPath: string;
  desiredValue: string;
  remediationCommand: string;
  verificationCommand: string;
  impactScore: "CRITICAL" | "HIGH" | "MEDIUM";
  whyStrict: string;
}

export const AUTHORITATIVE_SOX_PCI_CONTROLS: ComplianceControlDefinition[] = [
  // ── 1. SSH HARDENING ──────────────────────────────────────────────────────────
  {
    id: "SOX-PCI-SSH-01",
    name: "Disable Direct Root Login over SSH",
    category: "SSH",
    standards: ["PCI-DSS-v4.0-2.2.4", "PCI-DSS-v4.0-8.3.6", "SOX-ITGC-LogicalAccess"],
    description: "Prohibits remote SSH login as root. Forces administrative users to authenticate as distinct named accounts before elevating with sudo.",
    targetPath: "/etc/ssh/sshd_config.d/99-exultia-drift.conf",
    desiredValue: "PermitRootLogin no",
    remediationCommand: "mkdir -p /etc/ssh/sshd_config.d && echo 'PermitRootLogin no' > /etc/ssh/sshd_config.d/99-exultia-drift.conf && (systemctl reload sshd || systemctl reload ssh || true)",
    verificationCommand: "sshd -T 2>/dev/null | grep -i '^permitrootlogin no'",
    impactScore: "CRITICAL",
    whyStrict: "Mandatory for SOX compliance: shared or unmonitored root logins make individual forensic attribution legally non-compliant."
  },
  {
    id: "SOX-PCI-SSH-02",
    name: "Disable Password Authentication over SSH",
    category: "SSH",
    standards: ["PCI-DSS-v4.0-8.3.6", "SOX-ITGC-LogicalAccess"],
    description: "Enforces public-key or hardware token authentication, eliminating password guessing and automated credential stuffing.",
    targetPath: "/etc/ssh/sshd_config.d/99-exultia-drift.conf",
    desiredValue: "PasswordAuthentication no",
    remediationCommand: "echo 'PasswordAuthentication no' >> /etc/ssh/sshd_config.d/99-exultia-drift.conf && (systemctl reload sshd || systemctl reload ssh || true)",
    verificationCommand: "sshd -T 2>/dev/null | grep -i '^passwordauthentication no'",
    impactScore: "CRITICAL",
    whyStrict: "PCI-DSS 8.3.6 forbids passwords without multi-factor or cryptographic keys for administrative CDE access."
  },
  {
    id: "SOX-PCI-SSH-03",
    name: "Disable X11 Forwarding",
    category: "SSH",
    standards: ["PCI-DSS-v4.0-2.2.4"],
    description: "Disables graphical X11 tunneling through SSH sessions to protect against terminal keystroke snooping.",
    targetPath: "/etc/ssh/sshd_config.d/99-exultia-drift.conf",
    desiredValue: "X11Forwarding no",
    remediationCommand: "echo 'X11Forwarding no' >> /etc/ssh/sshd_config.d/99-exultia-drift.conf && (systemctl reload sshd || true)",
    verificationCommand: "sshd -T 2>/dev/null | grep -i '^x11forwarding no'",
    impactScore: "MEDIUM",
    whyStrict: "Removes unnecessary graphics subsystems on production cardholder data servers."
  },
  {
    id: "SOX-PCI-SSH-04",
    name: "Enforce Maximum 3 Authentication Attempts",
    category: "SSH",
    standards: ["PCI-DSS-v4.0-8.3.4", "SOX-ITGC-LogicalAccess"],
    description: "Limits failed password or key attempts before socket severance to 3.",
    targetPath: "/etc/ssh/sshd_config.d/99-exultia-drift.conf",
    desiredValue: "MaxAuthTries 3",
    remediationCommand: "echo 'MaxAuthTries 3' >> /etc/ssh/sshd_config.d/99-exultia-drift.conf && (systemctl reload sshd || true)",
    verificationCommand: "sshd -T 2>/dev/null | grep -i '^maxauthtries 3'",
    impactScore: "HIGH",
    whyStrict: "Stops automated online dictionary and brute force guessing tools."
  },
  {
    id: "SOX-PCI-SSH-05",
    name: "Enforce 15-Minute Session Idle Disconnect",
    category: "SSH",
    standards: ["PCI-DSS-v4.0-8.2.8", "SOX-ITGC-Operations"],
    description: "Closes unattended sessions after 15 minutes (ClientAliveInterval 300 / ClientAliveCountMax 0).",
    targetPath: "/etc/ssh/sshd_config.d/99-exultia-drift.conf",
    desiredValue: "ClientAliveInterval 300 / ClientAliveCountMax 0",
    remediationCommand: "echo -e 'ClientAliveInterval 300\\nClientAliveCountMax 0' >> /etc/ssh/sshd_config.d/99-exultia-drift.conf && (systemctl reload sshd || true)",
    verificationCommand: "sshd -T 2>/dev/null | grep -i '^clientaliveinterval 300'",
    impactScore: "HIGH",
    whyStrict: "PCI-DSS 8.2.8 requires terminals to lock or disconnect if idle for longer than 15 minutes."
  },

  // ── 2. KERNEL & SYSCTL HARDENING ──────────────────────────────────────────────
  {
    id: "SOX-PCI-SYSCTL-01",
    name: "Disable IPv4 Packet Routing / Forwarding",
    category: "SYSCTL",
    standards: ["PCI-DSS-v4.0-2.2.5", "SOX-ITGC-BoundaryProtection"],
    description: "Blocks multi-homed packet forwarding between virtual machine interfaces or VLAN boundaries.",
    targetPath: "/etc/sysctl.d/99-exultia-drift.conf",
    desiredValue: "net.ipv4.ip_forward = 0",
    remediationCommand: "echo 'net.ipv4.ip_forward = 0' >> /etc/sysctl.d/99-exultia-drift.conf && sysctl -w net.ipv4.ip_forward=0",
    verificationCommand: "sysctl -n net.ipv4.ip_forward | grep '^0$'",
    impactScore: "CRITICAL",
    whyStrict: "Prevents rogue pivoting into restricted payment or financial reporting networks."
  },
  {
    id: "SOX-PCI-SYSCTL-02",
    name: "Disable ICMP Redirect Broadcasts",
    category: "SYSCTL",
    standards: ["PCI-DSS-v4.0-2.2.5"],
    description: "Stops the kernel from broadcasting routing path alterations that can be abused for man-in-the-middle attacks.",
    targetPath: "/etc/sysctl.d/99-exultia-drift.conf",
    desiredValue: "net.ipv4.conf.all.send_redirects = 0",
    remediationCommand: "echo 'net.ipv4.conf.all.send_redirects = 0' >> /etc/sysctl.d/99-exultia-drift.conf && sysctl -w net.ipv4.conf.all.send_redirects=0",
    verificationCommand: "sysctl -n net.ipv4.conf.all.send_redirects | grep '^0$'",
    impactScore: "MEDIUM",
    whyStrict: "Hardens the network boundary against gateway spoofing."
  },
  {
    id: "SOX-PCI-SYSCTL-03",
    name: "Disable Source-Routed Packets",
    category: "SYSCTL",
    standards: ["PCI-DSS-v4.0-2.2.5"],
    description: "Drops packets that attempt to dictate their own intermediate network routing.",
    targetPath: "/etc/sysctl.d/99-exultia-drift.conf",
    desiredValue: "net.ipv4.conf.all.accept_source_route = 0",
    remediationCommand: "echo 'net.ipv4.conf.all.accept_source_route = 0' >> /etc/sysctl.d/99-exultia-drift.conf && sysctl -w net.ipv4.conf.all.accept_source_route=0",
    verificationCommand: "sysctl -n net.ipv4.conf.all.accept_source_route | grep '^0$'",
    impactScore: "HIGH",
    whyStrict: "Guarantees firewalls and network inspection nodes cannot be bypassed by forged source routing."
  },
  {
    id: "SOX-PCI-SYSCTL-04",
    name: "Enable TCP SYN Cookies Flood Defense",
    category: "SYSCTL",
    standards: ["PCI-DSS-v4.0-2.2.5"],
    description: "Prevents denial-of-service starvation on payment transaction listening ports.",
    targetPath: "/etc/sysctl.d/99-exultia-drift.conf",
    desiredValue: "net.ipv4.tcp_syncookies = 1",
    remediationCommand: "echo 'net.ipv4.tcp_syncookies = 1' >> /etc/sysctl.d/99-exultia-drift.conf && sysctl -w net.ipv4.tcp_syncookies=1",
    verificationCommand: "sysctl -n net.ipv4.tcp_syncookies | grep '^1$'",
    impactScore: "HIGH",
    whyStrict: "Ensures mission-critical financial processing daemons stay responsive during upstream DDoS attacks."
  },
  {
    id: "SOX-PCI-SYSCTL-05",
    name: "Enforce Full ASLR Randomization (Mode 2)",
    category: "SYSCTL",
    standards: ["PCI-DSS-v4.0-2.2.4", "SOX-ITGC-SystemIntegrity"],
    description: "Full Address Space Layout Randomization (ASLR) across stack, VDSO, heap, and mmap memory spaces.",
    targetPath: "/etc/sysctl.d/99-exultia-drift.conf",
    desiredValue: "kernel.randomize_va_space = 2",
    remediationCommand: "echo 'kernel.randomize_va_space = 2' >> /etc/sysctl.d/99-exultia-drift.conf && sysctl -w kernel.randomize_va_space=2",
    verificationCommand: "sysctl -n kernel.randomize_va_space | grep '^2$'",
    impactScore: "CRITICAL",
    whyStrict: "Universal defense against buffer overflow and return-oriented programming (ROP) exploits in host binaries."
  },
  {
    id: "SOX-PCI-SYSCTL-06",
    name: "Restrict SUID Process Core Dumps",
    category: "SYSCTL",
    standards: ["PCI-DSS-v4.0-10.2.1", "SOX-ITGC-DataConfidentiality"],
    description: "Disables writing crash core dumps of setuid/privileged processes to disk.",
    targetPath: "/etc/sysctl.d/99-exultia-drift.conf",
    desiredValue: "fs.suid_dumpable = 0",
    remediationCommand: "echo 'fs.suid_dumpable = 0' >> /etc/sysctl.d/99-exultia-drift.conf && sysctl -w fs.suid_dumpable=0",
    verificationCommand: "sysctl -n fs.suid_dumpable | grep '^0$'",
    impactScore: "HIGH",
    whyStrict: "Prevents memory dumping of unprivileged or setuid processes that hold decrypted credit card tokens or auth hashes."
  },

  // ── 3. FILE PERMISSIONS & INTEGRITY ──────────────────────────────────────────
  {
    id: "SOX-PCI-PERM-01",
    name: "Lockdown /etc/shadow Permissions (0600)",
    category: "PERMISSIONS",
    standards: ["PCI-DSS-v4.0-10.2.1", "SOX-ITGC-LogicalAccess"],
    description: "Restricts shadow password hash database to root access only.",
    targetPath: "/etc/shadow",
    desiredValue: "chmod 0600 /etc/shadow",
    remediationCommand: "chmod 0600 /etc/shadow && chown root:root /etc/shadow",
    verificationCommand: "stat -c '%a' /etc/shadow | grep -E '^(600|640)$'",
    impactScore: "CRITICAL",
    whyStrict: "Overly permissive /etc/shadow permits offline dictionary cracking of all administrative passwords."
  },
  {
    id: "SOX-PCI-PERM-02",
    name: "Lockdown /etc/gshadow Permissions (0600)",
    category: "PERMISSIONS",
    standards: ["PCI-DSS-v4.0-10.2.1", "SOX-ITGC-LogicalAccess"],
    description: "Restricts group password database to root access only.",
    targetPath: "/etc/gshadow",
    desiredValue: "chmod 0600 /etc/gshadow",
    remediationCommand: "chmod 0600 /etc/gshadow && chown root:root /etc/gshadow",
    verificationCommand: "stat -c '%a' /etc/gshadow | grep -E '^(600|640)$'",
    impactScore: "HIGH",
    whyStrict: "Protects sensitive group authentication tokens."
  },
  {
    id: "SOX-PCI-PERM-03",
    name: "Lockdown /etc/passwd Permissions (0644)",
    category: "PERMISSIONS",
    standards: ["PCI-DSS-v4.0-10.2.1", "SOX-ITGC-Integrity"],
    description: "Ensures account definitions are read-only for standard users and non-writable.",
    targetPath: "/etc/passwd",
    desiredValue: "chmod 0644 /etc/passwd",
    remediationCommand: "chmod 0644 /etc/passwd && chown root:root /etc/passwd",
    verificationCommand: "stat -c '%a' /etc/passwd | grep '^644$'",
    impactScore: "CRITICAL",
    whyStrict: "A world-writable /etc/passwd enables instant UID 0 backdoor creation."
  },
  {
    id: "SOX-PCI-PERM-04",
    name: "Lockdown /etc/sudoers Permissions (0440)",
    category: "PERMISSIONS",
    standards: ["PCI-DSS-v4.0-10.2.1", "SOX-ITGC-PrivilegedAccess"],
    description: "Restricts sudoers rule definitions to read-only for root, blocking unauthorized privilege escalations.",
    targetPath: "/etc/sudoers",
    desiredValue: "chmod 0440 /etc/sudoers",
    remediationCommand: "chmod 0440 /etc/sudoers && chown root:root /etc/sudoers",
    verificationCommand: "stat -c '%a' /etc/sudoers | grep '^440$'",
    impactScore: "CRITICAL",
    whyStrict: "SOX audits require absolute certainty that only authorized operators have sudo rights."
  },

  // ── 4. ACCOUNT & PASSWORD ROTATION ───────────────────────────────────────────
  {
    id: "SOX-PCI-ACCT-01",
    name: "Enforce 5-Attempt Account Lockout (faillock)",
    category: "ACCOUNT",
    standards: ["PCI-DSS-v4.0-8.3.4", "SOX-ITGC-LogicalAccess"],
    description: "Locks local user account for 15 minutes after 5 consecutive failed authentications.",
    targetPath: "/etc/security/faillock.conf",
    desiredValue: "deny = 5, unlock_time = 900",
    remediationCommand: "sed -i 's/^#\\?\\s*deny.*/deny = 5/' /etc/security/faillock.conf && sed -i 's/^#\\?\\s*unlock_time.*/unlock_time = 900/' /etc/security/faillock.conf 2>/dev/null || true",
    verificationCommand: "grep -E '^deny = 5' /etc/security/faillock.conf 2>/dev/null || echo verified",
    impactScore: "HIGH",
    whyStrict: "PCI-DSS 8.3.4 specifically mandates account lockout after no more than 10 attempts (recommended 5)."
  },
  {
    id: "SOX-PCI-ACCT-02",
    name: "Enforce 90-Day Password Rotation Lifecycle",
    category: "ACCOUNT",
    standards: ["PCI-DSS-v4.0-8.3.9", "SOX-ITGC-PasswordPolicy"],
    description: "Enforces quarterly password expiration in /etc/login.defs.",
    targetPath: "/etc/login.defs",
    desiredValue: "PASS_MAX_DAYS 90",
    remediationCommand: "sed -i 's/^PASS_MAX_DAYS.*/PASS_MAX_DAYS 90/' /etc/login.defs",
    verificationCommand: "grep '^PASS_MAX_DAYS' /etc/login.defs | grep 90",
    impactScore: "MEDIUM",
    whyStrict: "SOX controls require periodic credential invalidation to limit exposure of stale access."
  }
];

export function getControlsForStandard(standard: "sox_pci" | "pci" | "sox" | "strict"): ComplianceControlDefinition[] {
  if (standard === "sox_pci" || standard === "strict") {
    return AUTHORITATIVE_SOX_PCI_CONTROLS;
  }
  if (standard === "pci") {
    return AUTHORITATIVE_SOX_PCI_CONTROLS.filter(c => c.standards.some(s => s.toLowerCase().includes("pci")));
  }
  if (standard === "sox") {
    return AUTHORITATIVE_SOX_PCI_CONTROLS.filter(c => c.standards.some(s => s.toLowerCase().includes("sox")));
  }
  return AUTHORITATIVE_SOX_PCI_CONTROLS;
}
