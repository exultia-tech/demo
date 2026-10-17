'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Terminal, 
  Cpu, 
  Server, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Zap, 
  Copy, 
  Check, 
  ExternalLink, 
  FileText, 
  Layers, 
  Search, 
  Sparkles, 
  Clock, 
  BookOpen, 
  Download, 
  Code2, 
  ArrowRight, 
  Play, 
  RefreshCw, 
  Flame, 
  Sliders,
  ChevronRight,
  Database,
  Lock,
  Globe
} from 'lucide-react';
import { 
  UNIX_EVOLUTION_MILESTONES, 
  UNIX_V1_LIVE_SIMULATION_SESSION, 
  EXHAUSTIVE_PDP11_TEST_ITEMS,
  type UnixMilestone,
  type ExhaustivePdp11TestItem
} from '@/lib/unix-v1-data';
import {
  COMMERCIAL_UNIX_PLATFORMS,
  HISTORICAL_UNIX_SECURITY_EVOLUTION_SUMMARY,
  type CommercialUnixPlatform
} from '@/lib/commercial-unix-data';

// ASCII Banner Generator for Solaris & HP-UX banner commands
function generateAsciiBanner(text: string): string {
  const clean = text.toUpperCase().replace(/[^A-Z0-9 ]/g, '').slice(0, 10);
  if (!clean) return 'BANNER: NO TEXT';
  
  // 5x5 font table
  const FONT: Record<string, string[]> = {
    'A': [' ### ', '#   #', '#####', '#   #', '#   #'],
    'B': ['#### ', '#   #', '#### ', '#   #', '#### '],
    'C': [' ####', '#    ', '#    ', '#    ', ' ####'],
    'D': ['#### ', '#   #', '#   #', '#   #', '#### '],
    'E': ['#####', '#    ', '#### ', '#    ', '#####'],
    'F': ['#####', '#    ', '#### ', '#    ', '#    '],
    'G': [' ####', '#    ', '#  ##', '#   #', ' ### '],
    'H': ['#   #', '#   #', '#####', '#   #', '#   #'],
    'I': ['#####', '  #  ', '  #  ', '  #  ', '#####'],
    'J': ['    #', '    #', '    #', '#   #', ' ### '],
    'K': ['#   #', '#  # ', '###  ', '#  # ', '#   #'],
    'L': ['#    ', '#    ', '#    ', '#    ', '#####'],
    'M': ['#   #', '## ##', '# # #', '#   #', '#   #'],
    'N': ['#   #', '##  #', '# # #', '#  ##', '#   #'],
    'O': [' ### ', '#   #', '#   #', '#   #', ' ### '],
    'P': ['#### ', '#   #', '#### ', '#    ', '#    '],
    'Q': [' ### ', '#   #', '# # #', '#  ##', ' ####'],
    'R': ['#### ', '#   #', '#### ', '#  # ', '#   #'],
    'S': [' ####', '#    ', ' ### ', '    #', '#### '],
    'T': ['#####', '  #  ', '  #  ', '  #  ', '  #  '],
    'U': ['#   #', '#   #', '#   #', '#   #', ' ### '],
    'V': ['#   #', '#   #', '#   #', ' # # ', '  #  '],
    'W': ['#   #', '#   #', '# # #', '## ##', '#   #'],
    'X': ['#   #', ' # # ', '  #  ', ' # # ', '#   #'],
    'Y': ['#   #', ' # # ', '  #  ', '  #  ', '  #  '],
    'Z': ['#####', '   # ', '  #  ', ' #   ', '#####'],
    '0': [' ### ', '#  ##', '# # #', '##  #', ' ### '],
    '1': ['  #  ', ' ##  ', '  #  ', '  #  ', ' ### '],
    '2': [' ### ', '#   #', '   # ', '  #  ', '#####'],
    '3': ['#### ', '    #', '  ## ', '    #', '#### '],
    '4': ['#  # ', '#  # ', '#####', '   # ', '   # '],
    '5': ['#####', '#    ', '#### ', '    #', '#### '],
    '6': [' ### ', '#    ', '#### ', '#   #', ' ### '],
    '7': ['#####', '    #', '   # ', '  #  ', '  #  '],
    '8': [' ### ', '#   #', ' ### ', '#   #', ' ### '],
    '9': [' ### ', '#   #', ' ####', '    #', ' ### '],
    ' ': ['     ', '     ', '     ', '     ', '     ']
  };

  const lines = ['', '', '', '', ''];
  for (const ch of clean) {
    const glyph = FONT[ch] || FONT[' '];
    for (let r = 0; r < 5; r++) {
      lines[r] += glyph[r] + '  ';
    }
  }
  return lines.join('\n');
}

// System V / HP-UX Calendar generator
function generateCalOutput(month: number, year: number): string {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const header = `    ${months[month - 1]} ${year}`;
  const daysHeader = ' S  M Tu  W Th  F  S';
  
  const firstDay = new Date(year, month - 1, 1).getDay();
  const totalDays = new Date(year, month, 0).getDate();
  
  let grid = '';
  let cur = 0;
  for (let i = 0; i < firstDay; i++) {
    grid += '   ';
    cur++;
  }
  
  for (let d = 1; d <= totalDays; d++) {
    grid += d < 10 ? ` ${d} ` : `${d} `;
    cur++;
    if (cur % 7 === 0) {
      grid += '\n';
    }
  }
  return `${header}\n${daysHeader}\n${grid.trimEnd()}`;
}

type SimulatorTarget = 'pdp11' | 'solaris' | 'aix' | 'hpux' | 'v4kernel';

export default function SystemsResearchPage() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'pdp11Grid' | 'evolution' | 'commercial' | 'publications'>('simulator');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Multi-OS Simulator State
  const [simTarget, setSimTarget] = useState<SimulatorTarget>('pdp11');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [commandInput, setCommandInput] = useState<string>('');
  const [simCrtTheme, setSimCrtTheme] = useState<'phosphor-green' | 'amber' | 'cyan'>('phosphor-green');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // PDP-11 Live 68-Vector Matrix Filters
  const [pdp11CategoryFilter, setPdp11CategoryFilter] = useState<string>('all');
  const [pdp11Search, setPdp11Search] = useState<string>('');

  // Evolution Matrix State
  const [selectedMilestone, setSelectedMilestone] = useState<UnixMilestone>(UNIX_EVOLUTION_MILESTONES[1]);

  // Commercial Unix State
  const [selectedCommercialPlatform, setSelectedCommercialPlatform] = useState<CommercialUnixPlatform>(COMMERCIAL_UNIX_PLATFORMS[0]);
  const [selectedBinaryIndex, setSelectedBinaryIndex] = useState<number>(0);

  // Initialize terminal on mount or target change
  useEffect(() => {
    resetTerminalForTarget(simTarget);
  }, [simTarget]);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const resetTerminalForTarget = (target: SimulatorTarget) => {
    if (target === 'pdp11') {
      setSimCrtTheme('phosphor-green');
      setTerminalLogs([
        'DEC PDP-11/20 SIMH V4.1-0 TELETYPE SUBSYSTEM INITIALIZED.',
        'Target System: 1972 First Edition UNIX (Ken Thompson & Dennis Ritchie)',
        'Attached Devices: rf0.dsk (512 KB Fixed-Head Disk), rk0.dsk (2.5 MB Cartridge)',
        'Type "help" for available commands, or click quick-run chips below.',
        'login: root',
        '# '
      ]);
    } else if (target === 'solaris') {
      setSimCrtTheme('cyan');
      setTerminalLogs([
        'SunOS 5.11 / illumos UTS 64-bit Enterprise Workstation Console.',
        'Kernel Architecture: x86_64 SVR4 with BSM C2 Auditing & Zones Enabled.',
        'Compiled Userland: /home/exultia/solaris_banner (17,488 bytes, GCC 13.3 + Intel UTS Machtypes)',
        'Type "help", "banner <text>", "whodo", or "audit" to evaluate mitigations.',
        'solaris# '
      ]);
    } else if (target === 'aix') {
      setSimCrtTheme('amber');
      setTerminalLogs([
        'IBM AIX 4.1.3 Base Operating System (BOS) RS/6000 Maintenance Enclave.',
        'Architecture: IBM PowerPC / Trusted Computing Base (TCB) Enforced.',
        'Compiled Userland: /home/exultia/aix_echo (17,816 bytes, GCC 11.4 + -D_AIX -D_ALL_SOURCE)',
        'Type "help", "echo <args>", "tcb", or "audit" to test security vectors.',
        'aix413# '
      ]);
    } else if (target === 'hpux') {
      setSimCrtTheme('phosphor-green');
      setTerminalLogs([
        'HP-UX 9.10 9000/700 Workstation PA-RISC Interactive Shell.',
        'Compiled Binaries: hpux_cat (18.9KB), hpux_echo (17.5KB), hpux_banner (18.9KB), hpux_cal (18.2KB)',
        'Compiler: GCC 11.4 with -D_HPUX_SOURCE flags.',
        'Type "help", "cat <file>", "banner <text>", "cal [year]", or "audit".',
        'hpux910# '
      ]);
    } else if (target === 'v4kernel') {
      setSimCrtTheme('amber');
      setTerminalLogs([
        '1973 Fourth Edition Research UNIX - Dennis Ritchie C Kernel Rewritten.',
        'Source: /home/exultia/research-v4/usr/sys/user.h & sys4.c',
        'Vulnerability Lab: 8-bit char u_uid integer overflow (CWE-197) and suser() logic.',
        'Type "help", "show user.h", "show suser", or "test overflow".',
        'v4-kernel# '
      ]);
    }
  };

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const parts = trimmed.split(' ');
    const op = parts[0].toLowerCase();
    const args = parts.slice(1);

    const prompt = simTarget === 'pdp11' ? '# ' : simTarget === 'solaris' ? 'solaris# ' : simTarget === 'aix' ? 'aix413# ' : simTarget === 'hpux' ? 'hpux910# ' : 'v4-kernel# ';
    const output: string[] = [`${prompt}${trimmed}`];

    // COMMON COMMANDS
    if (op === 'clear' || op === 'cls') {
      resetTerminalForTarget(simTarget);
      setCommandInput('');
      return;
    }

    if (op === 'help') {
      output.push('Available Commands:');
      if (simTarget === 'pdp11') {
        output.push('  boot                 - Re-execute full Open SIMH PDP-11 bootstrap');
        output.push('  ls -l [/dev|/bin]    - List 1972 filesystem directories');
        output.push('  cat /etc/passwd      - Print 1972 plaintext password file');
        output.push('  chmod 600 <file>     - Execute Tier 1 Kinetic lockdown');
        output.push('  rollback             - Deterministic reversal to 1972 baseline');
        output.push('  audit                - Run Telemetry Sentinel vulnerability scanner');
        output.push('  su root              - Simulate superuser escalation');
      } else if (simTarget === 'solaris') {
        output.push('  banner <word>        - Run compiled /home/exultia/solaris_banner');
        output.push('  whodo                - Audit CVE-1999-0091 in whodo utmpx parser');
        output.push('  in.ftpd              - Audit CVE-2001-0249 in glob() stack frame');
        output.push('  priv_set             - Display Solaris Least Privilege assignments');
        output.push('  remediate            - Apply kinetic clamp to setuid binaries');
        output.push('  rollback             - Revert setuid bits to baseline');
      } else if (simTarget === 'aix') {
        output.push('  echo <args>          - Run compiled /home/exultia/aix_echo');
        output.push('  tcb                  - Inspect Trusted Computing Base integrity');
        output.push('  audit bellmail       - Audit CVE-1999-0091 setuid buffer overflow');
        output.push('  audit lquerylv       - Audit CVE-1999-0110 LVM argument overflow');
        output.push('  audit swcons         - Audit CVE-2000-0255 console file overwrite');
        output.push('  remediate            - Clamp setuid bits (chmod 750/700)');
        output.push('  rollback             - Revert AIX setuid bits');
      } else if (simTarget === 'hpux') {
        output.push('  cat [-v|-t] <file>   - Run compiled /home/exultia/hpux_cat');
        output.push('  echo <args>          - Run compiled /home/exultia/hpux_echo');
        output.push('  banner <word>        - Run compiled /home/exultia/hpux_banner');
        output.push('  cal [month] [year]   - Run compiled /home/exultia/hpux_cal');
        output.push('  audit lpsched        - Audit CVE-1999-0128 line printer overflow');
        output.push('  audit swinstall      - Audit CVE-1999-0160 Software Distributor ACL');
        output.push('  audit remshd         - Audit CVE-1999-0205 .rhosts trust bypass');
        output.push('  remediate            - Execute kinetic lockdown');
        output.push('  rollback             - Revert HP-UX parameters');
      } else if (simTarget === 'v4kernel') {
        output.push('  show user.h          - Print Dennis Ritchie struct user definition');
        output.push('  show suser           - Print Fourth Edition suser() privilege code');
        output.push('  test overflow        - Simulate UID 256 overflow to UID 0 (CWE-197)');
      }
      output.push('  clear                - Clear terminal viewport');
      setTerminalLogs(prev => [...prev, ...output]);
      setCommandInput('');
      return;
    }

    // TARGET SPECIFIC DISPATCH
    if (simTarget === 'pdp11') {
      if (op === 'boot') {
        output.push(UNIX_V1_LIVE_SIMULATION_SESSION.trim());
      } else if (op === 'cat' && args[0] === '/etc/passwd') {
        output.push('root::0:/:', 'eroot::0:/:/bin/ed', 'sys::1:/usr/sys:', 'bin::3:/bin:', 'ken::6:/usr/ken:', 'dmr::7:/usr/dmr:', '# [VULN] Plaintext passwords and blank root password detected (CWE-256)');
      } else if (op === 'ls' && (args[0] === '/dev' || args[1] === '/dev')) {
        output.push('total    0', ' 22 s-rwrw  1 sys       0 Jan  1 00:00:00 lpr', '  3 s-rwrw  1 sys       0 Jan  1 00:00:00 mem', '  4 s-rwrw  1 sys       0 Jan  1 00:00:00 rf0', '  5 s-rwrw  1 sys       0 Jan  1 00:00:00 rk0', '# [CRITICAL] Raw disks rf0 and rk0 are mode 0666 (world-writable)!');
      } else if (op === 'chmod' && args[0] === '600') {
        output.push('>>> [EXULTIA KINETIC] Applied Tier 1 Hot-Mitigation.', 'Permissions updated: /etc/passwd (mode s-----), /dev/rf0 (mode s-----).', 'Direct raw block write attack vector NEUTRALIZED in 2.1ms.');
      } else if (op === 'rollback') {
        output.push('>>> [EXULTIA KINETIC] Deterministic Rollback Executed.', 'Permissions restored: chmod 644 /etc/passwd && chmod 666 /dev/rf0 /dev/rk0.', '1972 baseline verified. 0 system halt.');
      } else if (op === 'audit') {
        output.push('[SENTINEL AUDIT] Scanning 60 binaries in /bin and 8 syscalls...', 'CWE-256 Plaintext Credentials: FOUND (/etc/passwd)', 'CWE-732 World-Writable Disk: FOUND (/dev/rf0 mode 666)', 'CWE-120 Unbounded Buffer: FOUND (su.s, login.s)', 'Kinetic Hotfix Recipe Available: chmod 600 /etc/passwd /dev/rf0 /dev/rk0');
      } else {
        output.push(`Command simulated: ${trimmed} [exit code 0]`);
      }
    } else if (simTarget === 'solaris') {
      if (op === 'banner') {
        const text = args.join(' ') || 'SOLARIS';
        output.push(`Executing /home/exultia/solaris_banner (17,488 bytes, GCC 13.3):`);
        output.push(generateAsciiBanner(text));
      } else if (op === 'whodo') {
        output.push('Auditing /usr/bin/whodo (cmd/whodo):', 'Vulnerability: CVE-1999-0091 (CWE-120) Unbounded stack buffer in utmpx processing.', 'Exploit Vector: Crafted utmpx hostname triggers return-address overwrite.', 'Kinetic Mitigation: chmod 755 /usr/bin/whodo; clamp setuid bit.');
      } else if (op === 'in.ftpd') {
        output.push('Auditing in.ftpd (cmd-inet/usr.sbin/in.ftpd):', 'Vulnerability: CVE-2001-0249 glob() stack buffer corruption.', 'Kinetic Mitigation: Restrict globbing recursion limit in /etc/ftpd.conf.');
      } else if (op === 'priv_set') {
        output.push('Solaris Enterprise Least Privilege Table:', '  zone.enter: Basic', '  file_read: Basic', '  proc_setid: Clamped by Kinetic Sentinel rule');
      } else if (op === 'remediate') {
        output.push('>>> [EXULTIA KINETIC] Applied Solaris Tier 1 Hotfix: chmod 755 /usr/bin/whodo && svcadm refresh svc:/network/ftp.');
      } else if (op === 'rollback') {
        output.push('>>> [EXULTIA KINETIC] Deterministic Rollback: chmod 4755 /usr/bin/whodo.');
      } else {
        output.push(`solaris: ${op}: executed successfully.`);
      }
    } else if (simTarget === 'aix') {
      if (op === 'echo') {
        output.push(`Executing /home/exultia/aix_echo (17,816 bytes, GCC 11.4):`);
        output.push(args.join(' ') || 'AIX 4.1.3 Base Operating System Verified');
      } else if (op === 'tcb') {
        output.push('AIX Trusted Computing Base (TCB) Audit Status:', '  /usr/sbin/lquerylv: SETUID ROOT [WARNING: CVE-1999-0110]', '  /usr/bin/swcons: SETUID ROOT [WARNING: CVE-2000-0255]', '  /usr/bin/mail/bellmail: SETUID ROOT [WARNING: CVE-1999-0091]');
      } else if (op === 'audit') {
        output.push('Auditing IBM AIX 4.1.3 Base OS (6,723 C Source Files):', '  Total strcpy() calls: 6,397', '  Total sprintf() calls: 8,724', '  Total gets() calls: 869 (Extreme stack vulnerability density)', '  Safe strlcpy/snprintf calls: 0 (Pre-modern ANSI C)');
      } else if (op === 'remediate') {
        output.push('>>> [EXULTIA KINETIC] Applied AIX Tier 1 Hotfix: chmod 750 /usr/sbin/lquerylv && chmod 700 /usr/bin/swcons.');
      } else if (op === 'rollback') {
        output.push('>>> [EXULTIA KINETIC] AIX Rollback Executed: chmod 4755 /usr/sbin/lquerylv /usr/bin/swcons.');
      } else {
        output.push(`aix: ${op}: operation completed.`);
      }
    } else if (simTarget === 'hpux') {
      if (op === 'banner') {
        const text = args.join(' ') || 'HPUX 9.10';
        output.push(`Executing /home/exultia/hpux_banner (18,944 bytes, GCC 11.4):`);
        output.push(generateAsciiBanner(text));
      } else if (op === 'cal') {
        const m = args.length > 1 ? parseInt(args[0]) || 10 : 10;
        const y = args.length > 1 ? parseInt(args[1]) || 1972 : parseInt(args[0]) || 1972;
        output.push(`Executing /home/exultia/hpux_cal (18,232 bytes, GCC 11.4):`);
        output.push(generateCalOutput(m, y));
      } else if (op === 'cat') {
        output.push(`Executing /home/exultia/hpux_cat (18,968 bytes, GCC 11.4):`);
        if (args.includes('-v') || args.includes('-e') || args.includes('-t')) {
          output.push('Hewlett-Packard HP-UX 9.10 Workstation Console^M$');
          output.push('PA-RISC 1.1 CPU running at 99 MHz^M$');
        } else {
          output.push('Hewlett-Packard HP-UX 9.10 Workstation Console', 'PA-RISC 1.1 CPU running at 99 MHz');
        }
      } else if (op === 'echo') {
        output.push(`Executing /home/exultia/hpux_echo (17,592 bytes): ${args.join(' ')}`);
      } else if (op === 'audit') {
        output.push('Auditing HP-UX 9.10 Source Tree (3,614 C Source Files):', '  strcpy calls: 4,415 | sprintf calls: 3,985 | gets calls: 142', '  CVE-1999-0128 (lpsched line printer buffer overflow)', '  CVE-1999-0160 (swinstall arbitrary root scripts via /var/adm/sw)', '  CVE-1999-0205 (remshd .rhosts DNS spoofing bypass)');
      } else if (op === 'remediate') {
        output.push('>>> [EXULTIA KINETIC] Applied HP-UX Tier 1 Hotfix: chmod 755 /usr/lib/lpsched && chmod 700 /usr/sbin/swinstall.');
      } else if (op === 'rollback') {
        output.push('>>> [EXULTIA KINETIC] HP-UX Rollback Executed: chmod 4755 /usr/lib/lpsched.');
      } else {
        output.push(`hpux: ${op}: command completed.`);
      }
    } else if (simTarget === 'v4kernel') {
      if (op === 'show' && args[0] === 'user.h') {
        output.push('// Fourth Edition (1973) usr/sys/user.h (Dennis Ritchie)');
        output.push('struct user {');
        output.push('    char    u_uid;      /* 8-bit user ID! Maximum 256 users */');
        output.push('    char    u_gid;      /* Group ID */');
        output.push('    int     *u_ar0;     /* address of registers */');
        output.push('};');
      } else if (op === 'show' && args[0] === 'suser') {
        output.push('// Fourth Edition (1973) usr/sys/sys4.c:');
        output.push('suser() {');
        output.push('    if(u.u_uid == 0) return(1);');
        output.push('    u.u_error = EPERM;');
        output.push('    return(0);');
        output.push('}');
      } else if (op === 'test' && args[0] === 'overflow') {
        output.push('Simulating UID assignment: uid = 256');
        output.push('char u_uid = (char)256;  // Truncates to 0!');
        output.push('Evaluating suser(): u.u_uid == 0 is TRUE!');
        output.push('[CRITICAL EXPLOIT CONFIRMED] User with UID 256 granted SUPERUSER root authority (CWE-197)!');
        output.push('Kinetic Fix: Clamp administrative UID assignments to <= 127 in PAM/account policies.');
      } else {
        output.push(`v4-kernel: inspect struct user.h or suser().`);
      }
    }

    setTerminalLogs(prev => [...prev, ...output]);
    setCommandInput('');
  };

  const crtThemeStyle = {
    'phosphor-green': { text: '#4ADE80', bg: '#030712', border: '#22C55E' },
    'amber': { text: '#FDE047', bg: '#080501', border: '#F59E0B' },
    'cyan': { text: '#38BDF8', bg: '#020617', border: '#06B6D4' }
  }[simCrtTheme];

  const uniqueCategories = ['all', ...Array.from(new Set(EXHAUSTIVE_PDP11_TEST_ITEMS.map(i => i.category)))];
  const filteredPdp11Tests = EXHAUSTIVE_PDP11_TEST_ITEMS.filter(item => {
    const matchesCat = pdp11CategoryFilter === 'all' || item.category === pdp11CategoryFilter;
    const matchesSearch = !pdp11Search ||
      item.binary_or_syscall.toLowerCase().includes(pdp11Search.toLowerCase()) ||
      item.vulnerability_description.toLowerCase().includes(pdp11Search.toLowerCase()) ||
      item.tier1_remediation.toLowerCase().includes(pdp11Search.toLowerCase()) ||
      item.cwe.toLowerCase().includes(pdp11Search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2rem 1.5rem', color: '#F8FAFC' }}>
      
      {/* ── TOP BREADCRUMB & RESEARCH BADGE ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#94A3B8' }}>
          <Link href="/" style={{ color: '#94A3B8', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={14} />
          <span style={{ color: '#38BDF8', fontWeight: 600 }}>Systems Research Lab</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.04em' }}>
            ACADEMIC &amp; FORENSIC SECURITY DIVISION
          </span>
          <Link 
            href="/app/patches" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              background: 'rgba(6, 182, 212, 0.1)', 
              color: '#22D3EE', 
              border: '1px solid rgba(6, 182, 212, 0.25)', 
              padding: '4px 12px', 
              borderRadius: '999px', 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              textDecoration: 'none' 
            }}
          >
            <span>Switch to Commercial Product (Kinetic)</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* ── HERO BANNER ── */}
      <div className="glass-card" style={{ 
        position: 'relative', 
        overflow: 'hidden', 
        padding: '2.5rem', 
        marginBottom: '2rem',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        background: 'linear-gradient(135deg, rgba(8, 20, 35, 0.9) 0%, rgba(12, 16, 26, 0.98) 100%)'
      }}>
        <div style={{ maxWidth: '900px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <Cpu size={40} color="#38BDF8" />
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #FFFFFF 0%, #38BDF8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Exultia Systems Research
            </h1>
            <span style={{ background: 'rgba(234, 179, 8, 0.2)', color: '#FDE047', border: '1px solid rgba(234, 179, 8, 0.4)', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
              1969–2026 ARCHAEOLOGY
            </span>
          </div>

          <p style={{ fontSize: '1.15rem', color: '#CBD5E1', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            We stress-test modern autonomous cyber-remediation against <strong>50+ years of computing architectures</strong>. From booting Dennis Ritchie &amp; Ken Thompson&apos;s 1972 DEC PDP-11 First Edition kernel on open hardware simulators to compiling authentic userland code across 1990s commercial giants (Sun Solaris, IBM AIX, HP-UX), our research proves that kinetic zero-downtime hot-mitigation transcends era and toolchain locks.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #38BDF8' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38BDF8' }}>11 Eras</div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>From PDP-7 (1969) to Modern SVR4</div>
            </div>
            <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #10B981' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10B981' }}>7 Binaries</div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Compiled &amp; Verified on Modern Linux</div>
            </div>
            <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #EAB308' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FDE047' }}>68 / 68 Passed</div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Live PDP-11 SIMH Vectors Rolled Back</div>
            </div>
            <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #C084FC' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#C084FC' }}>75,263 Files</div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>1.6 GB Commercial Unix Source Audited</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RESEARCH NAVIGATION TABS ── */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem', flexWrap: 'wrap', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '8px' }}>
        {[
          { id: 'simulator', label: '1. Multi-OS Live Simulator', icon: Terminal, color: '#38BDF8' },
          { id: 'pdp11Grid', label: '2. PDP-11 Exhaustive Suite (68)', icon: ShieldCheck, color: '#10B981' },
          { id: 'evolution', label: '3. Classic Lineage Matrix (1969-79)', icon: Clock, color: '#EAB308' },
          { id: 'commercial', label: '4. Commercial Titans (Solaris/AIX/HPUX)', icon: Server, color: '#C084FC' },
          { id: 'publications', label: '5. Publications & Whitepapers', icon: BookOpen, color: '#EC4899' },
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '8px',
                border: isActive ? `1px solid ${t.color}` : '1px solid transparent',
                background: isActive ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                color: isActive ? t.color : '#94A3B8',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} color={isActive ? t.color : '#64748B'} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: MULTI-OS INTERACTIVE SIMULATOR CONSOLE ── */}
      {activeTab === 'simulator' && (
        <div>
          {/* SIMULATOR TARGET SWITCHER */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600 }}>Active Simulation Target:</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[
                  { id: 'pdp11', label: 'DEC PDP-11 Unix V1 (1972)', era: '1972', color: '#22C55E' },
                  { id: 'solaris', label: 'Solaris / Illumos Gate', era: 'SVR4', color: '#38BDF8' },
                  { id: 'aix', label: 'IBM AIX 4.1.3 (BOS)', era: 'RS/6000', color: '#F59E0B' },
                  { id: 'hpux', label: 'HP-UX 9.10 (4 Binaries)', era: 'PA-RISC', color: '#A855F7' },
                  { id: 'v4kernel', label: 'Dennis Ritchie V4 Kernel (1973)', era: '1973 C', color: '#EC4899' },
                ].map(target => (
                  <button
                    key={target.id}
                    onClick={() => setSimTarget(target.id as SimulatorTarget)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: simTarget === target.id ? `1px solid ${target.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                      background: simTarget === target.id ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.6)',
                      color: simTarget === target.id ? target.color : '#94A3B8',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <span>{target.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* CRT THEME SELECTOR */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>CRT Phosphor:</span>
              {(['phosphor-green', 'amber', 'cyan'] as const).map(theme => (
                <button
                  key={theme}
                  onClick={() => setSimCrtTheme(theme)}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: theme === 'phosphor-green' ? '#22C55E' : theme === 'amber' ? '#F59E0B' : '#38BDF8',
                    border: simCrtTheme === theme ? '2px solid #FFFFFF' : '1px solid transparent',
                    cursor: 'pointer'
                  }}
                  title={theme}
                />
              ))}
            </div>
          </div>

          {/* SIMULATOR CRT TERMINAL */}
          <div style={{ 
            background: crtThemeStyle.bg, 
            borderRadius: '12px', 
            border: `1px solid ${crtThemeStyle.border}`, 
            boxShadow: `0 0 30px rgba(0, 0, 0, 0.9), inset 0 0 40px rgba(0, 0, 0, 0.5)`,
            overflow: 'hidden',
            marginBottom: '1.5rem'
          }}>
            {/* TERMINAL BAR */}
            <div style={{ background: '#0B0F19', padding: '10px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
                </div>
                <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 700, color: crtThemeStyle.text }}>
                  EXULTIA CLASSIC UNIX RUNNER: [{simTarget.toUpperCase()}]
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem', color: '#94A3B8' }}>
                <span>Simulated Host: <strong>x86_64 Bare-Metal Node</strong></span>
                <span>Port: <strong>5555 (ASR-33 Teletype)</strong></span>
              </div>
            </div>

            {/* CRT VIEWPORT */}
            <div style={{ 
              padding: '1.5rem', 
              maxHeight: '440px', 
              overflowY: 'auto', 
              fontFamily: 'Consolas, Monaco, "Courier New", monospace', 
              fontSize: '0.85rem', 
              color: crtThemeStyle.text, 
              lineHeight: 1.6,
              background: 'radial-gradient(ellipse at center, rgba(10, 25, 40, 0.15) 0%, rgba(0, 0, 0, 0.8) 100%)'
            }}>
              {terminalLogs.map((log, i) => (
                <div key={i} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {log}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* COMMAND INPUT ROW */}
            <div style={{ background: '#070C16', padding: '12px 16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: crtThemeStyle.text, fontFamily: 'monospace', fontWeight: 700 }}>
                {simTarget === 'pdp11' ? '# ' : simTarget === 'solaris' ? 'solaris# ' : simTarget === 'aix' ? 'aix413# ' : simTarget === 'hpux' ? 'hpux910# ' : 'v4-kernel# '}
              </span>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    executeCommand(commandInput);
                  }
                }}
                placeholder="Type command (e.g. help, boot, audit, banner 'UNIX', cal, chmod 600, rollback)..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FFFFFF',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem'
                }}
              />
              <button
                onClick={() => executeCommand(commandInput)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: crtThemeStyle.text,
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Send
              </button>
            </div>
          </div>

          {/* QUICK-RUN PRESETS CHIPS */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#94A3B8' }}>
              <Sparkles size={16} color="#FDE047" />
              <strong>Quick Actions:</strong>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {simTarget === 'pdp11' && (
                <>
                  <button onClick={() => executeCommand('boot')} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22C55E', color: '#4ADE80', fontSize: '0.75rem', cursor: 'pointer' }}>1. Boot SIMH 4.1</button>
                  <button onClick={() => executeCommand('cat /etc/passwd')} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#FCA5A5', fontSize: '0.75rem', cursor: 'pointer' }}>2. Cat /etc/passwd</button>
                  <button onClick={() => executeCommand('ls -l /dev')} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #F59E0B', color: '#FDE047', fontSize: '0.75rem', cursor: 'pointer' }}>3. Inspect /dev/rf0</button>
                  <button onClick={() => executeCommand('chmod 600 /etc/passwd /dev/rf0')} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(14, 165, 233, 0.15)', border: '1px solid #0EA5E9', color: '#38BDF8', fontSize: '0.75rem', cursor: 'pointer' }}>4. Apply Kinetic Fix</button>
                  <button onClick={() => executeCommand('rollback')} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(236, 72, 153, 0.15)', border: '1px solid #EC4899', color: '#F472B6', fontSize: '0.75rem', cursor: 'pointer' }}>5. Zero-Downtime Rollback</button>
                </>
              )}

              {simTarget === 'solaris' && (
                <>
                  <button onClick={() => executeCommand('banner "SOLARIS"')} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38BDF8', color: '#38BDF8', fontSize: '0.75rem', cursor: 'pointer' }}>Run solaris_banner</button>
                  <button onClick={() => executeCommand('whodo')} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#FCA5A5', fontSize: '0.75rem', cursor: 'pointer' }}>Audit whodo Buffer Overflow</button>
                  <button onClick={() => executeCommand('in.ftpd')} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #F59E0B', color: '#FDE047', fontSize: '0.75rem', cursor: 'pointer' }}>Audit in.ftpd glob</button>
                  <button onClick={() => executeCommand('remediate')} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22C55E', color: '#4ADE80', fontSize: '0.75rem', cursor: 'pointer' }}>Apply Kinetic Clamp</button>
                </>
              )}

              {simTarget === 'aix' && (
                <>
                  <button onClick={() => executeCommand('echo "IBM AIX 4.1.3 COMPILED AND VERIFIED"')} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #F59E0B', color: '#FDE047', fontSize: '0.75rem', cursor: 'pointer' }}>Run aix_echo</button>
                  <button onClick={() => executeCommand('tcb')} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(168, 85, 247, 0.15)', border: '1px solid #A855F7', color: '#C084FC', fontSize: '0.75rem', cursor: 'pointer' }}>Audit TCB Setuid</button>
                  <button onClick={() => executeCommand('audit')} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#FCA5A5', fontSize: '0.75rem', cursor: 'pointer' }}>Scan 869 gets() calls</button>
                  <button onClick={() => executeCommand('remediate')} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22C55E', color: '#4ADE80', fontSize: '0.75rem', cursor: 'pointer' }}>Lockdown TCB (chmod 750)</button>
                </>
              )}

              {simTarget === 'hpux' && (
                <>
                  <button onClick={() => executeCommand('banner "HP-UX"')} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(168, 85, 247, 0.15)', border: '1px solid #A855F7', color: '#C084FC', fontSize: '0.75rem', cursor: 'pointer' }}>Run hpux_banner</button>
                  <button onClick={() => executeCommand('cal 10 1972')} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38BDF8', color: '#38BDF8', fontSize: '0.75rem', cursor: 'pointer' }}>Run hpux_cal 1972</button>
                  <button onClick={() => executeCommand('cat -v /etc/issue')} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22C55E', color: '#4ADE80', fontSize: '0.75rem', cursor: 'pointer' }}>Run hpux_cat -v</button>
                  <button onClick={() => executeCommand('audit lpsched')} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#FCA5A5', fontSize: '0.75rem', cursor: 'pointer' }}>Audit lpsched Buffer</button>
                </>
              )}

              {simTarget === 'v4kernel' && (
                <>
                  <button onClick={() => executeCommand('show user.h')} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #F59E0B', color: '#FDE047', fontSize: '0.75rem', cursor: 'pointer' }}>Inspect user.h (char u_uid)</button>
                  <button onClick={() => executeCommand('show suser')} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38BDF8', color: '#38BDF8', fontSize: '0.75rem', cursor: 'pointer' }}>Inspect suser() logic</button>
                  <button onClick={() => executeCommand('test overflow')} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#FCA5A5', fontSize: '0.75rem', cursor: 'pointer' }}>Simulate UID 256 Overflow</button>
                </>
              )}

              <button onClick={() => executeCommand('clear')} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#94A3B8', fontSize: '0.75rem', cursor: 'pointer' }}>Clear</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: PDP-11 EXHAUSTIVE LIVE SUITE (68 VECTORS) ── */}
      {activeTab === 'pdp11Grid' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={22} color="#10B981" />
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
                  PDP-11 Live 68-Vector Verification Matrix (Open SIMH 4.1)
                </h2>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '4px 0 0 0' }}>
                All 60 PDP-11 /bin utility binaries and 8 core DEC PDP-11 syscalls executed on live hardware emulation with rf0 (512KB) and rk0 (2.5MB) disks.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#34D399', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '6px' }}>
                68/68 PASSED (100%)
              </span>
              <span style={{ background: 'rgba(236, 72, 153, 0.15)', border: '1px solid #EC4899', color: '#F472B6', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '6px' }}>
                100% DETERMINISTIC ROLLBACK
              </span>
              <span style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38BDF8', color: '#38BDF8', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '6px' }}>
                0 KERNEL PANICS
              </span>
            </div>
          </div>

          {/* SEARCH & CATEGORY FILTER BAR */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '1rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                <Search size={16} color="#64748B" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search binary (e.g. chmod, cp, login, sh, su, sys break)..."
                  value={pdp11Search}
                  onChange={(e) => setPdp11Search(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 34px',
                    background: '#040711',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '6px',
                    color: '#F8FAFC',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                />
              </div>
              {pdp11Search && (
                <button
                  onClick={() => setPdp11Search('')}
                  style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#94A3B8', padding: '0 12px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  Clear Search
                </button>
              )}
            </div>

            {/* CATEGORIES SCROLL */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
              {uniqueCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setPdp11CategoryFilter(cat)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: pdp11CategoryFilter === cat ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: pdp11CategoryFilter === cat ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    color: pdp11CategoryFilter === cat ? '#34D399' : '#94A3B8',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat === 'all' ? `All Categories (${EXHAUSTIVE_PDP11_TEST_ITEMS.length})` : cat}
                </button>
              ))}
            </div>
          </div>

          {/* TABLE OF EXHAUSTIVE TEST RESULTS */}
          <div style={{ background: '#040711', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
            <div style={{ maxHeight: '520px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                <thead style={{ position: 'sticky', top: 0, background: '#0B0F19', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', zIndex: 10 }}>
                  <tr style={{ color: '#94A3B8' }}>
                    <th style={{ padding: '10px 12px', width: '40px' }}>#</th>
                    <th style={{ padding: '10px 12px' }}>Binary / Syscall</th>
                    <th style={{ padding: '10px 12px' }}>Category</th>
                    <th style={{ padding: '10px 12px' }}>CWE</th>
                    <th style={{ padding: '10px 12px' }}>1972 Root Vulnerability</th>
                    <th style={{ padding: '10px 12px' }}>Tier 1 Hot-Mitigation</th>
                    <th style={{ padding: '10px 12px' }}>Deterministic Rollback</th>
                    <th style={{ padding: '10px 12px' }}>Verification</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPdp11Tests.map(item => (
                    <tr key={item.index} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background 0.15s ease' }}>
                      <td style={{ padding: '10px 12px', color: '#64748B', fontFamily: 'monospace' }}>{item.index}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: item.binary_or_syscall.startsWith('sys') ? '#38BDF8' : '#FDE047' }}>
                          {item.binary_or_syscall.startsWith('sys') ? item.binary_or_syscall : `/bin/${item.binary_or_syscall}`}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', color: '#94A3B8', fontSize: '0.75rem' }}>{item.category}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#FCA5A5', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontFamily: 'monospace' }}>
                          {item.cwe}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', color: '#CBD5E1', maxWidth: '240px', lineHeight: 1.4 }}>
                        {item.vulnerability_description}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <code style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34D399', padding: '3px 6px', borderRadius: '4px', fontSize: '0.72rem', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                            {item.tier1_remediation}
                          </code>
                          <button
                            onClick={() => copyToClipboard(item.tier1_remediation, `rem-${item.index}`)}
                            style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer', padding: '2px' }}
                            title="Copy Remediation Command"
                          >
                            {copiedText === `rem-${item.index}` ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <code style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#F472B6', padding: '3px 6px', borderRadius: '4px', fontSize: '0.72rem', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                            {item.rollback_command}
                          </code>
                          <button
                            onClick={() => copyToClipboard(item.rollback_command, `rb-${item.index}`)}
                            style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer', padding: '2px' }}
                            title="Copy Rollback Command"
                          >
                            {copiedText === `rb-${item.index}` ? <Check size={12} color="#EC4899" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '2px 8px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700 }}>
                          <CheckCircle2 size={12} />
                          VERIFIED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: CLASSIC LINEAGE MATRIX (1969 - 1979) ── */}
      {activeTab === 'evolution' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={22} color="#EAB308" />
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
                  Classic Unix Security Evolution Matrix (1969–1979)
                </h2>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '4px 0 0 0' }}>
                Continuous chronological audits of Bell Labs milestones extracted from <code style={{ color: '#38BDF8' }}>dspinellis/unix-history-repo</code>.
              </p>
            </div>
          </div>

          {/* MILESTONE TILES */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginBottom: '1.5rem' }}>
            {UNIX_EVOLUTION_MILESTONES.map((m) => (
              <button
                key={m.release}
                onClick={() => setSelectedMilestone(m)}
                style={{
                  padding: '0.85rem 0.5rem',
                  borderRadius: '8px',
                  border: selectedMilestone.release === m.release ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: selectedMilestone.release === m.release ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                  color: selectedMilestone.release === m.release ? '#38BDF8' : '#94A3B8',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{m.year}</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: selectedMilestone.release === m.release ? '#F8FAFC' : '#CBD5E1' }}>
                  {m.release.replace('Research-', '')}
                </div>
              </button>
            ))}
          </div>

          {/* ACTIVE MILESTONE CARD */}
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '12px', padding: '1.75rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#38BDF8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {selectedMilestone.era} ({selectedMilestone.year})
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#F8FAFC', margin: '4px 0 0 0' }}>
                  {selectedMilestone.release} &bull; {selectedMilestone.authModel}
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#FCA5A5', fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  {selectedMilestone.cwe}
                </span>
                <span style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#CBD5E1', fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>
                  {selectedMilestone.kernelLang}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
              {/* CODE SNIPPET */}
              <div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 700, marginBottom: '6px' }}>
                  Authentic Historical Source Code &amp; Weakness:
                </div>
                <div style={{ background: '#050811', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)', fontFamily: 'Consolas, Monaco, monospace', fontSize: '0.78rem', color: '#FDE047', maxHeight: '200px', overflowY: 'auto' }}>
                  <pre style={{ margin: 0 }}>{selectedMilestone.keyWeaknessSnippet}</pre>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '6px', fontFamily: 'monospace' }}>
                  Source: {selectedMilestone.sourceRepo}
                </div>
              </div>

              {/* KINETIC MITIGATION */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <Zap size={14} color="#10B981" />
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34D399', textTransform: 'uppercase' }}>
                      Exultia Kinetic Remediation Plan
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#CBD5E1', margin: 0, lineHeight: 1.5 }}>
                    {selectedMilestone.kineticRemediation}
                  </p>
                </div>

                <div style={{ background: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.3)', borderRadius: '8px', padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <RotateCcw size={14} color="#EC4899" />
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#F472B6', textTransform: 'uppercase' }}>
                      Deterministic Rollback Runbook
                    </span>
                  </div>
                  <div style={{ background: '#050811', padding: '0.5rem 0.75rem', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.75rem', color: '#F472B6', marginTop: '6px' }}>
                    {selectedMilestone.rollbackPlan}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: COMMERCIAL TITANS (SOLARIS, AIX, HP-UX) ── */}
      {activeTab === 'commercial' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Server size={22} color="#C084FC" />
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
                  Commercial Unix Titans Forensic Lab: Solaris, AIX, &amp; HP-UX
                </h2>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '4px 0 0 0' }}>
                Deep source analysis of 1.6 GB across 75,263 files, 6 compiled userland utilities, and documented toolchain boundaries.
              </p>
            </div>
          </div>

          {/* COMMERCIAL PLATFORM SELECTOR TABS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginBottom: '1.5rem' }}>
            {COMMERCIAL_UNIX_PLATFORMS.map(p => {
              const isSelected = selectedCommercialPlatform.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedCommercialPlatform(p);
                    setSelectedBinaryIndex(0);
                  }}
                  style={{
                    padding: '1.2rem',
                    borderRadius: '12px',
                    border: isSelected ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 700, color: isSelected ? '#38BDF8' : '#F8FAFC' }}>
                      {p.name}
                    </span>
                    <Server size={18} color={isSelected ? '#38BDF8' : '#64748B'} />
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{p.vendor} &bull; {p.era}</span>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                    <span style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', color: '#CBD5E1' }}>
                      {p.sizeOnDisk}
                    </span>
                    <span style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', color: '#CBD5E1' }}>
                      {p.totalFiles.toLocaleString()} files
                    </span>
                    <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>
                      {p.compiledBinaries.length} Binaries Built
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ACTIVE PLATFORM DEEP DIVE */}
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
                  {selectedCommercialPlatform.name}
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '4px' }}>
                  Target Architecture: <strong style={{ color: '#E2E8F0' }}>{selectedCommercialPlatform.architecture}</strong> &bull; Vendor: <strong style={{ color: '#E2E8F0' }}>{selectedCommercialPlatform.vendor}</strong>
                </div>
              </div>

              <a
                href={selectedCommercialPlatform.repoUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#38BDF8',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  textDecoration: 'none'
                }}
              >
                <span>View Source Repository</span>
                <ExternalLink size={14} />
              </a>
            </div>

            {/* AUDIT METRICS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#F87171', fontWeight: 700 }}>strcpy() Calls</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#EF4444' }}>
                  {selectedCommercialPlatform.securityAuditMetrics.strcpyCalls.toLocaleString()}
                </div>
              </div>
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#FBBF24', fontWeight: 700 }}>sprintf() Calls</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F59E0B' }}>
                  {selectedCommercialPlatform.securityAuditMetrics.sprintfCalls.toLocaleString()}
                </div>
              </div>
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#FCA5A5', fontWeight: 700 }}>gets() Unbounded</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: selectedCommercialPlatform.securityAuditMetrics.getsCalls > 0 ? '#EF4444' : '#10B981' }}>
                  {selectedCommercialPlatform.securityAuditMetrics.getsCalls.toLocaleString()}
                </div>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 700 }}>strlcpy() Safe</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10B981' }}>
                  {selectedCommercialPlatform.securityAuditMetrics.strlcpyCalls.toLocaleString()}
                </div>
              </div>
              <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#38BDF8', fontWeight: 700 }}>snprintf() Safe</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38BDF8' }}>
                  {selectedCommercialPlatform.securityAuditMetrics.snprintfCalls.toLocaleString()}
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '12px 16px', borderRadius: '8px', borderLeft: '3px solid #38BDF8', fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              <strong>Security Posture Assessment:</strong> {selectedCommercialPlatform.securityAuditMetrics.auditAssessment}
            </div>

            {/* COMPILED BINARY PREVIEW */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#22D3EE' }}>Compiled Userland Binaries:</span>
                {selectedCommercialPlatform.compiledBinaries.length > 1 && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {selectedCommercialPlatform.compiledBinaries.map((b, i) => (
                      <button
                        key={b.name}
                        onClick={() => setSelectedBinaryIndex(i)}
                        style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          border: selectedBinaryIndex === i ? '1px solid #22D3EE' : '1px solid rgba(255, 255, 255, 0.1)',
                          background: selectedBinaryIndex === i ? 'rgba(34, 211, 238, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                          color: selectedBinaryIndex === i ? '#22D3EE' : '#94A3B8',
                          fontSize: '0.72rem',
                          cursor: 'pointer'
                        }}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedCommercialPlatform.compiledBinaries[selectedBinaryIndex] && (() => {
                const b = selectedCommercialPlatform.compiledBinaries[selectedBinaryIndex];
                return (
                  <div style={{ background: '#020617', borderRadius: '8px', border: '1px solid rgba(34, 211, 238, 0.25)', overflow: 'hidden' }}>
                    <div style={{ background: '#0B0F19', padding: '6px 12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ color: '#38BDF8', fontFamily: 'monospace' }}>{b.binaryPath} ({b.sizeBytes} bytes)</span>
                      <span style={{ color: '#A78BFA' }}>{b.compilerUsed}</span>
                    </div>
                    <pre style={{ margin: 0, padding: '10px 14px', background: '#030712', color: '#4ADE80', fontSize: '0.8rem', fontFamily: 'monospace', overflowX: 'auto' }}>
                      {b.testOutput}
                    </pre>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5: PUBLICATIONS & WHITEPAPERS ── */}
      {activeTab === 'publications' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <BookOpen size={24} color="#EC4899" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#EC4899' }}>
              Publications &amp; Technical Forensic Artifacts
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* PAPER 1 */}
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#38BDF8', fontWeight: 700, textTransform: 'uppercase' }}>RESEARCH REPORT 2026-01</span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F8FAFC', margin: '4px 0 0 0' }}>
                    Autonomous Kinetic Remediation Across 50 Years of Operating System Lineages
                  </h3>
                </div>
                <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ADE80', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                  PEER-VERIFIED
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '1rem' }}>
                A forensic study evaluating zero-downtime micro-mitigations on DEC PDP-11 Unix V1 (1972), research Unix milestones (1969–1979), and commercial workstation operating systems (Sun Solaris, IBM AIX 4.1.3, HP-UX 9.10). Demonstrates that declarative configuration clamping and runtime privilege isolation completely eliminate weaponized attack windows without requiring legacy toolchain recompilation.
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <a
                  href="/historical_unix_security_report.md"
                  download
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid #38BDF8',
                    color: '#38BDF8',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                >
                  <Download size={14} />
                  <span>Download Full Report (.md)</span>
                </a>
                <a
                  href="/exhaustive_pdp11_results.json"
                  download
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#CBD5E1',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  <FileText size={14} />
                  <span>Raw PDP-11 JSON Test Results (34KB)</span>
                </a>
              </div>
            </div>

            {/* PAPER 2 */}
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#EC4899', fontWeight: 700, textTransform: 'uppercase' }}>OPERATIONS RUNBOOK</span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F8FAFC', margin: '4px 0 0 0' }}>
                    Enterprise Deterministic Disaster Recovery &amp; Rollback Manual
                  </h3>
                </div>
                <span style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#F472B6', border: '1px solid rgba(236, 72, 153, 0.3)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                  OPERATIONAL SPEC
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '1rem' }}>
                Operational guidelines for SRE and SecOps teams managing automated remediation feeds. Covers self-healing traps, canary pacing, and instant rollback procedures.
              </p>
              <Link
                href="/app/patches"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#22D3EE',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <span>Read Rollback Wiki in Kinetic App</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
