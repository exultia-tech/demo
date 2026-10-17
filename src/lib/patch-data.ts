export interface PatchFeedItem {
  id: string;
  cveId: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  cvss: number;
  cisaKev: boolean;
  publishedAt: string;
  slaDeadline: string;
  affectedPackages: string[];
  affectedDistros: ('ubuntu' | 'debian' | 'rhel' | 'rocky' | 'alpine' | 'windows' | 'k8s')[];
  remediationTier: {
    tier1_hotMitigation: {
      summary: string;
      downtimeRequired: boolean;
      commands: string[];
      verificationCommand: string;
      rollbackCommand: string;
    };
    tier2_packageUpgrade: {
      summary: string;
      distroCommands: Record<string, string>;
    };
    tier3_fleetAutomation: {
      ansiblePlaybook: string;
      kubernetesDaemonSet?: string;
    };
  };
  provenance: {
    signedBy: string;
    cosignDigest: string;
    slsaLevel: number;
    testValidation: {
      targetEnv: string;
      testedAt: string;
      exitCode: number;
      durationSec: number;
    };
  };
}

export const SAMPLE_PATCH_FEED: PatchFeedItem[] = [
  {
    id: 'PAT-2026-0089',
    cveId: 'CVE-2024-6387',
    title: 'OpenSSH Server Race Condition in Signal Handler (RegreSSHion)',
    severity: 'CRITICAL',
    cvss: 9.8,
    cisaKev: true,
    publishedAt: '2026-10-15T18:00:00Z',
    slaDeadline: '2026-10-16T18:00:00Z', // 24h KEV window
    affectedPackages: ['openssh-server >= 8.5p1 < 9.8p1'],
    affectedDistros: ['ubuntu', 'debian', 'rhel', 'rocky', 'alpine'],
    remediationTier: {
      tier1_hotMitigation: {
        summary: 'Instant 0-downtime workaround: Set LoginGraceTime to 0 in sshd configuration. Eliminates the SIGALRM race condition window.',
        downtimeRequired: false,
        commands: [
          'mkdir -p /etc/ssh/sshd_config.d',
          'echo "LoginGraceTime 0" > /etc/ssh/sshd_config.d/00-exultia-regrsshion-fix.conf',
          'sshd -t && (systemctl reload sshd 2>/dev/null || systemctl reload ssh 2>/dev/null || true)'
        ],
        verificationCommand: 'sshd -T | grep -i logingracetime',
        rollbackCommand: 'rm -f /etc/ssh/sshd_config.d/00-exultia-regrsshion-fix.conf && (systemctl reload sshd 2>/dev/null || systemctl reload ssh 2>/dev/null || true)'
      },
      tier2_packageUpgrade: {
        summary: 'Vendor patch backport: atomic single-package upgrade to patched vendor package without touching general system state.',
        distroCommands: {
          ubuntu: 'apt-get update && apt-get install --only-upgrade -y openssh-server',
          debian: 'apt-get update && apt-get install --only-upgrade -y openssh-server',
          rocky: 'dnf upgrade -y openssh-server',
          rhel: 'dnf upgrade -y openssh-server',
          alpine: 'apk add --upgrade openssh'
        }
      },
      tier3_fleetAutomation: {
        ansiblePlaybook: `---
- name: Emergency Hotfix - CVE-2024-6387 (RegreSSHion)
  hosts: all
  become: yes
  serial: "10%" # Canary rollout
  tasks:
    - name: Deploy LoginGraceTime 0 Drop-in
      ansible.builtin.copy:
        dest: /etc/ssh/sshd_config.d/00-exultia-regrsshion-fix.conf
        content: |
          # Exultia Kinetic Patch Feed Hot-Mitigation
          LoginGraceTime 0
        owner: root
        group: root
        mode: '0600'
      notify: Reload SSHD

    - name: Validate SSH Configuration Syntax
      ansible.builtin.command: sshd -t
      changed_when: false

  handlers:
    - name: Reload SSHD
      ansible.builtin.service:
        name: "{{ 'ssh' if ansible_os_family == 'Debian' else 'sshd' }}"
        state: reloaded`
      }
    },
    provenance: {
      signedBy: 'security@exultia.tech (Cosign OIDC Keyless)',
      cosignDigest: 'sha256:7c9e83f092b1a8d052c93847abfe210948cbb34d7812903847abfe210948cbb3',
      slsaLevel: 3,
      testValidation: {
        targetEnv: 'Rocky Linux 9.4 (QEMU bare-metal test node)',
        testedAt: '2026-10-15T18:15:32Z',
        exitCode: 0,
        durationSec: 1.4
      }
    }
  },
  {
    id: 'PAT-2026-0088',
    cveId: 'CVE-2024-47176',
    title: 'CUPS cups-browsed Remote Code Execution via Malicious UDP Packets',
    severity: 'HIGH',
    cvss: 8.4,
    cisaKev: true,
    publishedAt: '2026-10-14T21:00:00Z',
    slaDeadline: '2026-10-16T21:00:00Z',
    affectedPackages: ['cups-browsed <= 2.0.1'],
    affectedDistros: ['ubuntu', 'debian', 'rhel', 'rocky'],
    remediationTier: {
      tier1_hotMitigation: {
        summary: 'Instant 0-downtime workaround: Halt and disable cups-browsed daemon and drop UDP port 631 at iptables/nftables level.',
        downtimeRequired: false,
        commands: [
          'systemctl stop cups-browsed 2>/dev/null || true',
          'systemctl disable cups-browsed 2>/dev/null || true',
          'iptables -I INPUT -p udp --dport 631 -j DROP || true'
        ],
        verificationCommand: 'systemctl is-active cups-browsed ; iptables -L INPUT -n | grep 631',
        rollbackCommand: 'iptables -D INPUT -p udp --dport 631 -j DROP 2>/dev/null ; systemctl enable --now cups-browsed'
      },
      tier2_packageUpgrade: {
        summary: 'Disable printer discovery broadcast listener in configuration if cups is strictly required.',
        distroCommands: {
          ubuntu: 'sed -i "s/^BrowseRemoteProtocols.*/BrowseRemoteProtocols none/" /etc/cups/cups-browsed.conf && systemctl restart cups-browsed',
          rocky: 'sed -i "s/^BrowseRemoteProtocols.*/BrowseRemoteProtocols none/" /etc/cups/cups-browsed.conf && systemctl restart cups-browsed'
        }
      },
      tier3_fleetAutomation: {
        ansiblePlaybook: `---
- name: Emergency Neutralization - CUPS cups-browsed CVE-2024-47176
  hosts: all
  become: yes
  tasks:
    - name: Halt and mask cups-browsed service
      ansible.builtin.systemd:
        name: cups-browsed
        state: stopped
        enabled: no
        masked: yes
      ignore_errors: yes

    - name: Firewall drop inbound UDP 631
      ansible.posix.firewalld:
        port: 631/udp
        state: disabled
        permanent: yes
        immediate: yes
      when: ansible_os_family == 'RedHat'`
      }
    },
    provenance: {
      signedBy: 'security@exultia.tech (Cosign OIDC Keyless)',
      cosignDigest: 'sha256:1a84f391823bc094182937401928347102938471029384710293847102938471',
      slsaLevel: 3,
      testValidation: {
        targetEnv: 'Ubuntu 24.04 LTS (QEMU bare-metal test node)',
        testedAt: '2026-10-14T21:22:10Z',
        exitCode: 0,
        durationSec: 0.9
      }
    }
  },
  {
    id: 'PAT-2026-0085',
    cveId: 'CVE-2024-3094',
    title: 'XZ Utils Backdoor in liblzma upstream tarballs (Payload Injection)',
    severity: 'CRITICAL',
    cvss: 10.0,
    cisaKev: true,
    publishedAt: '2026-10-12T14:00:00Z',
    slaDeadline: '2026-10-13T14:00:00Z',
    affectedPackages: ['xz-utils == 5.6.0', 'xz-utils == 5.6.1'],
    affectedDistros: ['debian', 'ubuntu', 'rocky', 'alpine'],
    remediationTier: {
      tier1_hotMitigation: {
        summary: 'Emergency rollback: Force downgrade to verified pristine 5.4.x series or terminate sshd processes linked against compromised liblzma.so.5.',
        downtimeRequired: false,
        commands: [
          'sh -c "strings $(which xz) | grep -q \'5.6.[01]\' && echo \'COMPROMISED\' || echo \'CLEAN\'"',
          'apt-get install -y --allow-downgrades xz-utils=5.4.5* liblzma5=5.4.5* 2>/dev/null || true'
        ],
        verificationCommand: 'xz --version',
        rollbackCommand: 'echo "Rollback not applicable for malicious binary downgrade"'
      },
      tier2_packageUpgrade: {
        summary: 'Downgrade packages across Debian/Ubuntu/Fedora raw repositories.',
        distroCommands: {
          debian: 'apt-get update && apt-get install --allow-downgrades -y xz-utils=5.4.5-0.3 liblzma5=5.4.5-0.3',
          rocky: 'dnf downgrade -y xz xz-libs'
        }
      },
      tier3_fleetAutomation: {
        ansiblePlaybook: `---
- name: Purge XZ Backdoor Artifacts
  hosts: all
  become: yes
  tasks:
    - name: Check XZ version
      ansible.builtin.command: xz --version
      register: xz_ver
      changed_when: false

    - name: Fail if compromised 5.6.0 or 5.6.1 present
      ansible.builtin.fail:
        msg: "CRITICAL: Malicious XZ detected on {{ inventory_hostname }}"
      when: "'5.6.0' in xz_ver.stdout or '5.6.1' in xz_ver.stdout"`
      }
    },
    provenance: {
      signedBy: 'security@exultia.tech (Cosign OIDC Keyless)',
      cosignDigest: 'sha256:593a8e2918340192837401928347102938471029384710293847102938471029',
      slsaLevel: 3,
      testValidation: {
        targetEnv: 'Debian 12 Bookworm (Container Test Matrix)',
        testedAt: '2026-10-12T14:18:40Z',
        exitCode: 0,
        durationSec: 2.1
      }
    }
  }
];
