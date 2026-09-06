export type ThreatSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type ThreatCategory = 
  | "Runtimes & Toolchains"
  | "Infrastructure & Cloud"
  | "Supply Chain Malware"
  | "Dependencies & Libraries"
  | "Operating Systems & Kernels"
  | "Developer Tools & IDEs"
  | "Networking & Cryptography";

export interface UpstreamSignalContribution {
  sourceId: string;
  sourceName: string;
  badge: string;
  finding: string;
  signalType: "CVE_RECORD" | "ACTIVE_EXPLOITATION" | "AST_IOC" | "TYPOSQUAT" | "BEHAVIORAL_ALERT" | "REACHABILITY" | "HYGIENE_SCORE";
  confidence: "CONFIRMED" | "PROBABLE" | "THEORETICAL";
}

export interface UviAdvisoryRecord {
  uviId: string; // Standardized: UVI-YYYY-NNNN
  title: string;
  headline: string;
  summary: string;
  technicalDetails: string;
  severity: ThreatSeverity;
  cvssScore: number;
  cvssVector: string;
  cwe: string;
  category: ThreatCategory;
  attackVector: "NETWORK" | "LOCAL" | "ADJACENT" | "PHYSICAL";
  attackComplexity: "LOW" | "HIGH";
  privilegesRequired: "NONE" | "LOW" | "HIGH";
  userInteraction: "NONE" | "REQUIRED";
  scope: "UNCHANGED" | "CHANGED";
  cveList: string[];
  ghsaId?: string;
  osvId?: string;
  msrcId?: string;
  affectedTargets: {
    product: string;
    ecosystem: string;
    affectedVersions: string;
    fixedInVersion?: string;
    purl?: string;
  }[];
  cisaKev: {
    isKnownExploited: boolean;
    dateAdded?: string;
    ransomwareUse?: boolean;
    notes?: string;
  };
  upstreamSignals: UpstreamSignalContribution[];
  remediation: {
    recommendedAction: string;
    patchDetails: string;
    workarounds?: string[];
  };
  publishedDate: string;
  lastUpdatedDate: string;
}

export interface PublicFeedSource {
  id: string;
  name: string;
  scope: string;
  access: string;
  status: "Active" | "Synced" | "Realtime";
  refreshRate: string;
  coverage: string;
  homepageUrl: string;
  icon: string;
  recordsIngested: number;
}

export const UVI_PUBLIC_FEED_SOURCES: PublicFeedSource[] = [
  {
    id: "nvd_cve",
    name: "NIST National Vulnerability Database (NVD)",
    scope: "Universal Common Vulnerabilities and Exposures (CVEs)",
    access: "Public REST API 2.0",
    status: "Realtime",
    refreshRate: "Hourly",
    coverage: "Primary global index for official CVE identifiers, CVSS v3.1/v4.0 scoring, and CWE weakness taxonomy.",
    homepageUrl: "https://nvd.nist.gov",
    icon: "🏛️",
    recordsIngested: 248000
  },
  {
    id: "cisa_kev",
    name: "CISA Known Exploited Vulnerabilities (KEV)",
    scope: "Active In-The-Wild Exploitation & Weaponized CVEs",
    access: "Public JSON Feed",
    status: "Active",
    refreshRate: "Daily",
    coverage: "Authoritative catalog of vulnerabilities confirmed to be actively weaponized by advanced threat actors and ransomware syndicates.",
    homepageUrl: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
    icon: "🚨",
    recordsIngested: 1250
  },
  {
    id: "ghsa",
    name: "GitHub Advisory Database (GHSA)",
    scope: "Open Source Ecosystem Security Advisories",
    access: "Public GraphQL / REST",
    status: "Realtime",
    refreshRate: "Continuous",
    coverage: "Curated security bulletins spanning npm, PyPI, Go, Rust Crates, Maven, Packagist, and RubyGems.",
    homepageUrl: "https://github.com/advisories",
    icon: "🐙",
    recordsIngested: 185000
  },
  {
    id: "osv_dev",
    name: "Open Source Vulnerabilities (OSV.dev)",
    scope: "OpenSSF Standardized Aggregation Database",
    access: "Public REST API",
    status: "Active",
    refreshRate: "Continuous",
    coverage: "OpenSSF distributed vulnerability format consolidating Linux distributions, Android, and 30+ language ecosystems.",
    homepageUrl: "https://osv.dev",
    icon: "🌐",
    recordsIngested: 310000
  },
  {
    id: "openssf_malicious",
    name: "OpenSSF Malicious Packages Repository",
    scope: "Supply Chain Malware, Typosquats & Token Harvesters",
    access: "Public API / Git",
    status: "Active",
    refreshRate: "Continuous",
    coverage: "Real-time automated ingestion of confirmed malicious packages uploaded to public open-source registries.",
    homepageUrl: "https://github.com/ossf/malicious-packages",
    icon: "🛡️",
    recordsIngested: 22000
  },
  {
    id: "vendor_msrc_eclipse",
    name: "Microsoft MSRC & Eclipse Advisories",
    scope: "Vendor Bulletins, Runtime Security & Platform Bulletins",
    access: "Public Advisories",
    status: "Active",
    refreshRate: "Daily",
    coverage: "Official security notices targeting Windows, VS Code Core, Electron, Eclipse Theia, and Open VSX.",
    homepageUrl: "https://msrc.microsoft.com",
    icon: "🏢",
    recordsIngested: 14500
  },
  {
    id: "trail_of_bits_vsix",
    name: "Trail of Bits Security Research & IoCs",
    scope: "Static AST Analysis, Obfuscation & Binary Auditing",
    access: "Public Open Source",
    status: "Active",
    refreshRate: "Continuous",
    coverage: "Deep AST inspection heuristics, command injection vectors, and indicators of compromise (IoCs).",
    homepageUrl: "https://github.com/trailofbits/vsix-audit",
    icon: "🔬",
    recordsIngested: 8400
  },
  {
    id: "socket_dev",
    name: "Socket.dev Threat Intelligence",
    scope: "Behavioral Heuristics, Env/SSH Theft & Shell Spawning",
    access: "Public Research / API",
    status: "Active",
    refreshRate: "Continuous",
    coverage: "Detects runtime behavioral anomalies: reading ~/.ssh, accessing environment variables, and spawning background processes.",
    homepageUrl: "https://socket.dev",
    icon: "🔌",
    recordsIngested: 45000
  },
  {
    id: "jfrog_research",
    name: "JFrog Security Research Advisories",
    scope: "AST Call-Graph Reachability & Real-World Exploitability",
    access: "Public Advisories",
    status: "Active",
    refreshRate: "Weekly",
    coverage: "Separates theoretical dependency vulnerabilities from executable attack paths across software architectures.",
    homepageUrl: "https://jfrog.com/security",
    icon: "🐸",
    recordsIngested: 6800
  },
  {
    id: "aqua_nautilus",
    name: "Aqua Nautilus Cloud Threat Research",
    scope: "Registry Impersonation, Namespace Squatting & Droppers",
    access: "Public Feed",
    status: "Active",
    refreshRate: "Weekly",
    coverage: "Targeted threat intelligence tracking publisher impersonation campaigns, trojanized builds, and namespace takeovers.",
    homepageUrl: "https://www.aquasec.com/research",
    icon: "🌊",
    recordsIngested: 11200
  },
  {
    id: "snyk_vulndb",
    name: "Snyk Open Vulnerability Database",
    scope: "Transitive Dependency Trees & Parser Vulnerabilities",
    access: "Public Database",
    status: "Active",
    refreshRate: "Daily",
    coverage: "Deep dependency tree auditing for nested sub-dependencies in developer runtimes and cloud applications.",
    homepageUrl: "https://snyk.io/vuln",
    icon: "🐕",
    recordsIngested: 195000
  },
  {
    id: "ecosystem_dbs",
    name: "Ecosystem Advisory DBs (RustSec, Go VulnDB, PyPA)",
    scope: "Native Language Toolchain & Compiler Security",
    access: "Public DBs / Git",
    status: "Realtime",
    refreshRate: "Hourly",
    coverage: "First-party security databases from the Rust Foundation, Google Go security team, and Python Software Foundation.",
    homepageUrl: "https://rustsec.org",
    icon: "📦",
    recordsIngested: 16000
  }
];

export const CONSOLIDATED_UVI_ADVISORIES: UviAdvisoryRecord[] = [
  // 1. XZ Utils Liblzma Backdoor (UVI-2024-3094)
  {
    uviId: "UVI-2024-3094",
    title: "XZ Utils / Liblzma Upstream Supply Chain Backdoor in sshd Authentication",
    headline: "Critical malicious backdoor inserted into xz-utils liblzma enabling unauthorized authentication bypass in OpenSSH daemon.",
    summary: "A malicious backdoor was deliberately planted into upstream xz-utils (liblzma) versions 5.6.0 and 5.6.1 via obfuscated build scripts. The payload hooks RSA_public_decrypt in OpenSSH through systemd integration, permitting unauthorized remote code execution.",
    technicalDetails: "The backdoor injects code during the build stage via M4 macro extraction from test files. In target Linux environments where sshd links against libsystemd (which links against liblzma), it intercepts RSA verification routines using GNU IFUNC symbols. This enables an attacker holding a private key to execute arbitrary payload commands on port 22.",
    severity: "CRITICAL",
    cvssScore: 10.0,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H",
    cwe: "CWE-506: Embedded Malicious Code",
    category: "Supply Chain Malware",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "CHANGED",
    cveList: ["CVE-2024-3094"],
    ghsaId: "GHSA-rxwq-x6h5-x525",
    osvId: "OSV-2024-3094",
    affectedTargets: [
      { product: "xz-utils / liblzma", ecosystem: "Linux", affectedVersions: "5.6.0 - 5.6.1", fixedInVersion: "5.6.1-r1 / 5.4.6 LTS", purl: "pkg:deb/debian/xz-utils@5.6.0" },
      { product: "OpenSSH Daemon (via libsystemd)", ecosystem: "Linux", affectedVersions: "Fedora 40, Rawhide, Debian Sid", fixedInVersion: "Reverted to 5.4.x", purl: "pkg:deb/debian/openssh-server" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2024-04-01",
      ransomwareUse: false,
      notes: "Nation-state level supply chain infiltration targeted at enterprise Linux distributions."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 10.0", finding: "Maximum severity remote pre-auth code execution in OpenSSH.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "cisa_kev", sourceName: "CISA KEV", badge: "Exploitation Alert", finding: "Confirmed weaponized supply chain backdoor.", signalType: "ACTIVE_EXPLOITATION", confidence: "CONFIRMED" },
      { sourceId: "trail_of_bits_vsix", sourceName: "Trail of Bits", badge: "AST & IFUNC Hook", finding: "Reverse-engineered IFUNC hook manipulating OpenSSH RSA_public_decrypt.", signalType: "AST_IOC", confidence: "CONFIRMED" },
      { sourceId: "openssf_malicious", sourceName: "OpenSSF Malicious Packages", badge: "Account Takeover", finding: "Multi-year social engineering campaign targeting xz maintainership.", signalType: "TYPOSQUAT", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Downgrade xz-utils to version 5.4.6 or install distribution vendor emergency hotfixes immediately.",
      patchDetails: "Revert liblzma shared library to uncompromised 5.4.6 release. Recompile sshd without systemd notify linkage where feasible.",
      workarounds: ["Isolate SSH access behind VPN/bastion.", "Audit /usr/lib64/liblzma.so checksums against trusted baseline."]
    },
    publishedDate: "2024-03-29",
    lastUpdatedDate: "2026-08-30"
  },

  // 2. Node.js Windows Batch Command Injection (UVI-2024-27982)
  {
    uviId: "UVI-2024-27982",
    title: "Node.js child_process Argument Injection Leading to Remote Code Execution on Windows",
    headline: "Unquoted batch and cmd script invocation in Node.js child_process.spawn enables arbitrary command execution on Windows workstations.",
    summary: "Due to legacy Windows batch file argument parsing quirks, child_process.spawn and spawnSync in Node.js did not properly escape arguments when calling .bat or .cmd files, allowing untrusted arguments to break out and execute arbitrary commands.",
    technicalDetails: "When invoking cmd.exe to run a batch script, Windows parses command-line arguments using complex unquoting rules. Passing arguments containing spaces, quotes, and %-variables without explicit CMD sanitization enables command substitution and execution of arbitrary binaries, even with shell:false specified.",
    severity: "CRITICAL",
    cvssScore: 9.8,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
    cwe: "CWE-78: Improper Neutralization of Special Elements used in an OS Command",
    category: "Runtimes & Toolchains",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: ["CVE-2024-27982"],
    ghsaId: "GHSA-m8v8-2fcw-f29v",
    osvId: "OSV-2024-27982",
    affectedTargets: [
      { product: "Node.js Runtime", ecosystem: "npm", affectedVersions: "<18.20.2, <20.12.2, <21.7.3", fixedInVersion: "18.20.2, 20.12.2, 21.7.3", purl: "pkg:generic/nodejs@20.11.0" },
      { product: "Language Server Node Bridges", ecosystem: "vscode", affectedVersions: "All calling .cmd wrappers on Windows", fixedInVersion: "Node.js upgrade" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2024-04-25",
      ransomwareUse: false,
      notes: "Observed in targeted phishing campaigns delivering malicious git repos to developers."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 9.8", finding: "Remote code execution in core runtime subprocess API.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "cisa_kev", sourceName: "CISA KEV", badge: "Active Weaponization", finding: "Exploited in developer workstation targeting campaigns.", signalType: "ACTIVE_EXPLOITATION", confidence: "CONFIRMED" },
      { sourceId: "jfrog_research", sourceName: "JFrog Research", badge: "Direct Reachability", finding: "Identified in 42% of developer automation CLI wrappers on Windows.", signalType: "REACHABILITY", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade Node.js to 18.20.2+, 20.12.2+, or 21.7.3+ across all development workstations and CI/CD runners.",
      patchDetails: "Node runtime now forces explicit quoting and refuses to execute batch files with shell:false unless explicitly configured.",
      workarounds: ["Avoid calling .bat/.cmd directly from Node.js; invoke executable binaries directly.", "Run toolchains inside Docker containers on Windows."]
    },
    publishedDate: "2024-04-10",
    lastUpdatedDate: "2026-09-02"
  },

  // 3. runc Container Breakout via Leaked File Descriptor (UVI-2024-21626)
  {
    uviId: "UVI-2024-21626",
    title: "runc Leaked Host File Descriptor Container Breakout (Leaky Vessels)",
    headline: "Internal file descriptor leakage in runc allows container processes to escape to host filesystem during container execution.",
    summary: "Vulnerabilities in runc allowed a malicious container image or attacker inside a container to access leaked file descriptors referencing the host's /sys/fs/cgroup or host root filesystem, leading to complete host takeover.",
    technicalDetails: "During container startup and exec, runc opened file descriptors to the host filesystem before pivoting to the container rootfs without setting the O_CLOEXEC flag. A malicious entrypoint process could inspect /proc/self/fd/ to locate the leaked descriptor and write files to the host.",
    severity: "HIGH",
    cvssScore: 8.6,
    cvssVector: "CVSS:3.1/AV:L/AC:L/PR:N/UI:R/S:C/C:H/I:H/A:H",
    cwe: "CWE-403: Exposure of File Descriptor to Unintended Control Sphere",
    category: "Infrastructure & Cloud",
    attackVector: "LOCAL",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "REQUIRED",
    scope: "CHANGED",
    cveList: ["CVE-2024-21626"],
    ghsaId: "GHSA-c3cr-m6c4-2nhx",
    osvId: "OSV-2024-21626",
    affectedTargets: [
      { product: "runc", ecosystem: "golang", affectedVersions: ">=1.0.0-rc93, <=1.1.11", fixedInVersion: "1.1.12", purl: "pkg:golang/github.com/opencontainers/runc@1.1.11" },
      { product: "Docker Engine / containerd", ecosystem: "Infrastructure", affectedVersions: "<25.0.2 / <1.7.13", fixedInVersion: "containerd 1.7.13" },
      { product: "Kubernetes Kubelet", ecosystem: "Kubernetes", affectedVersions: "All clusters using unpatched runc", fixedInVersion: "Node runc 1.1.12 update" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2024-03-12",
      ransomwareUse: false,
      notes: "Targeted in multi-tenant cloud container escape demonstrations."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 8.6", finding: "Container escape to host filesystem via leaked file descriptors.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "snyk_vulndb", sourceName: "Snyk Research", badge: "Leaky Vessels", finding: "Identified in Snyk security research on container runtime security.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "trail_of_bits_vsix", sourceName: "Trail of Bits", badge: "Kernel FD Audit", finding: "Verified /proc/self/fd traversal exploitability on modern Linux kernels.", signalType: "AST_IOC", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade runc to >=1.1.12 and containerd to >=1.7.13 across all Kubernetes nodes and developer Docker engines.",
      patchDetails: "runc now audits all internal file descriptors before execve and closes any non-standard descriptors.",
      workarounds: ["Enable user namespaces in Docker daemon.", "Do not run untrusted container images with host root privileges."]
    },
    publishedDate: "2024-01-31",
    lastUpdatedDate: "2026-08-28"
  },

  // 4. Rust Toolchain Windows Bat Argument Injection (UVI-2024-24576)
  {
    uviId: "UVI-2024-24576",
    title: "Rust Standard Library Command Execution Vulnerability on Windows (BatBadBut)",
    headline: "Improper argument escaping in Rust std::process::Command on Windows allows arbitrary shell execution when calling batch files.",
    summary: "The Rust standard library did not escape arguments properly when invoking .bat and .cmd files on Windows, allowing an attacker passing untrusted input to an executable to execute arbitrary shell commands.",
    technicalDetails: "Due to CMD.EXE argument concatenation rules, passing arguments containing special characters (&, |, <, >, ^) to a batch script via std::process::Command allowed command injection because Rust relied on Windows CommandLineToArgvW rules which CMD.EXE does not follow.",
    severity: "CRITICAL",
    cvssScore: 10.0,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H",
    cwe: "CWE-78: Improper Neutralization of Special Elements used in an OS Command",
    category: "Runtimes & Toolchains",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "CHANGED",
    cveList: ["CVE-2024-24576"],
    ghsaId: "GHSA-q455-m66c-m2j8",
    osvId: "OSV-2024-24576",
    affectedTargets: [
      { product: "Rust Toolchain (rustc / std)", ecosystem: "cargo", affectedVersions: "<1.77.2", fixedInVersion: "1.77.2", purl: "pkg:cargo/rustc@1.77.1" },
      { product: "Rust Language Servers & Tools", ecosystem: "Developer Tools", affectedVersions: "All binaries compiled with rustc <1.77.2", fixedInVersion: "Recompiled with 1.77.2+" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2024-04-18",
      ransomwareUse: false,
      notes: "Part of the multi-language BatBadBut vulnerability disclosure."
    },
    upstreamSignals: [
      { sourceId: "ecosystem_dbs", sourceName: "RustSec Advisory DB", badge: "RUSTSEC-2024-0332", finding: "Critical advisory issued by Rust Security Response WG.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 10.0", finding: "Maximum severity command injection on Windows systems.", signalType: "CVE_RECORD", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade Rust toolchain via rustup update to >=1.77.2 and recompile all Windows binaries.",
      patchDetails: "std::process::Command now returns an error when calling .bat or .cmd files with arguments that cannot be safely escaped.",
      workarounds: ["Manually quote arguments or avoid invoking batch files directly from Rust."]
    },
    publishedDate: "2024-04-09",
    lastUpdatedDate: "2026-08-25"
  },

  // 5. OpenSSH RegreSSHion Remote Code Execution (UVI-2024-6387)
  {
    uviId: "UVI-2024-6387",
    title: "OpenSSH Server Signal Handler Race Condition Remote Code Execution (regreSSHion)",
    headline: "Signal handler race condition in sshd allows unauthenticated remote code execution as root on glibc-based Linux systems.",
    summary: "A signal handler race condition in OpenSSH's sshd server permits unauthenticated remote code execution as root on 32-bit and 64-bit Linux systems when LoginGraceTime expires.",
    technicalDetails: "If a client does not authenticate within LoginGraceTime (default 120s), sshd's SIGALRM handler is invoked asynchronously. The handler calls syslog() which is not async-signal-safe, causing memory corruption in glibc heap state and enabling remote heap exploitation.",
    severity: "HIGH",
    cvssScore: 8.1,
    cvssVector: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H",
    cwe: "CWE-364: Signal Handler Race Condition",
    category: "Infrastructure & Cloud",
    attackVector: "NETWORK",
    attackComplexity: "HIGH",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: ["CVE-2024-6387"],
    ghsaId: "GHSA-5g29-p879-x65m",
    osvId: "OSV-2024-6387",
    affectedTargets: [
      { product: "OpenSSH (sshd)", ecosystem: "Linux", affectedVersions: "8.5p1 <= version < 9.8p1", fixedInVersion: "9.8p1", purl: "pkg:deb/debian/openssh-server@9.2p1" }
    ],
    cisaKev: {
      isKnownExploited: false,
      notes: "Proof of concept exploits available; mass scanning observed."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 8.1", finding: "Unauthenticated remote root code execution in sshd.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "trail_of_bits_vsix", sourceName: "Trail of Bits", badge: "Heap Race Audit", finding: "Analyzed signal safety of glibc malloc & syslog calls in daemon contexts.", signalType: "AST_IOC", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade OpenSSH to version 9.8p1 or set LoginGraceTime 0 in sshd_config as an immediate mitigation.",
      patchDetails: "Refactored SIGALRM handler to avoid non-async-signal-safe functions.",
      workarounds: ["Set 'LoginGraceTime 0' in /etc/ssh/sshd_config and reload sshd (prevents RCE, but opens DoS vector)."]
    },
    publishedDate: "2024-07-01",
    lastUpdatedDate: "2026-08-20"
  },

  // 6. Windows TCP/IP Remote Code Execution (UVI-2024-38063)
  {
    uviId: "UVI-2024-38063",
    title: "Windows TCP/IP Network Stack IPv6 Remote Code Execution",
    headline: "Zero-click remote code execution in Windows TCP/IP stack via specially crafted IPv6 packets.",
    summary: "An integer underflow vulnerability in the Windows TCP/IP network stack (tcpip.sys) allows an unauthenticated remote attacker to execute arbitrary code on Windows workstations and servers by sending crafted IPv6 packets.",
    technicalDetails: "The vulnerability occurs during the processing of IPv6 extension headers with packet fragmentation. Integer underflow results in an out-of-bounds write in kernel memory, enabling arbitrary kernel-level code execution without any user interaction.",
    severity: "CRITICAL",
    cvssScore: 9.8,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
    cwe: "CWE-191: Integer Underflow (Wrap or Wraparound)",
    category: "Operating Systems & Kernels",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: ["CVE-2024-38063"],
    msrcId: "MSRC-CVE-2024-38063",
    affectedTargets: [
      { product: "Microsoft Windows 10 & 11", ecosystem: "Operating Systems", affectedVersions: "All unpatched versions", fixedInVersion: "August 2024 Security Update", purl: "pkg:generic/microsoft/windows-11" },
      { product: "Microsoft Windows Server", ecosystem: "Operating Systems", affectedVersions: "2016, 2019, 2022, 2025", fixedInVersion: "August 2024 Security Update" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2024-08-20",
      ransomwareUse: false,
      notes: "Aggressive network scanning and worm development observed in telemetry."
    },
    upstreamSignals: [
      { sourceId: "vendor_msrc_eclipse", sourceName: "Microsoft MSRC", badge: "Critical Bulletin", finding: "Zero-click remote code execution in tcpip.sys.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "cisa_kev", sourceName: "CISA KEV", badge: "Weaponized Alert", finding: "Added to CISA KEV catalog due to high exploitation likelihood.", signalType: "ACTIVE_EXPLOITATION", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Apply Microsoft August 2024 Cumulative Security Updates immediately across all Windows systems.",
      patchDetails: "Patched tcpip.sys packet header bounds validation checks.",
      workarounds: ["Disable IPv6 on network adapters if updating immediately is not possible."]
    },
    publishedDate: "2024-08-13",
    lastUpdatedDate: "2026-08-30"
  },

  // 7. cURL SOCKS5 Heap Buffer Overflow (UVI-2023-38545)
  {
    uviId: "UVI-2023-38545",
    title: "cURL / libcurl SOCKS5 Heap Buffer Overflow",
    headline: "Heap buffer overflow in cURL SOCKS5 proxy handshake allows remote attackers to execute code via slow hostname resolution.",
    summary: "A heap-based buffer overflow in libcurl's SOCKS5 proxy handshake implementation enables remote code execution when cURL is directed to resolve a long hostname via a SOCKS5 proxy.",
    technicalDetails: "When cURL connects to a SOCKS5 proxy (socks5h://), it passes the destination hostname to the proxy. If the hostname exceeds 255 bytes, cURL switches to local resolution but incorrectly recalculates the buffer offset, causing up to 64KB of heap memory to be overwritten.",
    severity: "CRITICAL",
    cvssScore: 9.8,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
    cwe: "CWE-122: Heap-based Buffer Overflow",
    category: "Dependencies & Libraries",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: ["CVE-2023-38545"],
    ghsaId: "GHSA-rf2r-263q-x5g4",
    osvId: "OSV-2023-38545",
    affectedTargets: [
      { product: "cURL & libcurl", ecosystem: "C/C++", affectedVersions: "7.69.0 <= version < 8.4.0", fixedInVersion: "8.4.0", purl: "pkg:generic/curl@8.3.0" },
      { product: "Git, Python pycurl, PHP curl", ecosystem: "Developer Tools", affectedVersions: "Linked against libcurl <8.4.0", fixedInVersion: "libcurl 8.4.0 update" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2023-10-18",
      ransomwareUse: false,
      notes: "Targeted in proxy evasion and network interception vectors."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 9.8", finding: "High-impact heap corruption in pervasive internet library.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "cisa_kev", sourceName: "CISA KEV", badge: "Active In KEV", finding: "Confirmed exploitable in enterprise perimeter appliances.", signalType: "ACTIVE_EXPLOITATION", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade curl and libcurl to >=8.4.0 across all host operating systems, container images, and language bindings.",
      patchDetails: "Fixed buffer bounds check in socks.c.",
      workarounds: ["Avoid using socks5h:// proxy prefixes.", "Set CURLOPT_BUFFERSIZE to default (16KB) or enforce hostname length <=255 bytes."]
    },
    publishedDate: "2023-10-11",
    lastUpdatedDate: "2026-08-15"
  },

  // 8. VS Code / Electron Workspace Trust Command Execution (UVI-2023-36742)
  {
    uviId: "UVI-2023-36742",
    title: "Visual Studio Code Workspace Trust Remote Code Execution via launch.json Injection",
    headline: "Untrusted workspace breakout allows malicious repositories to execute commands automatically upon workspace folder opening.",
    summary: "Opening an untrusted workspace in Visual Studio Code or Eclipse Theia containing crafted debug configurations or task definitions permitted arbitrary code execution before Workspace Trust confirmation.",
    technicalDetails: "Certain debugger extension providers registered auto-discovery hooks that parsed .vscode/launch.json and evaluated environment variables without verifying workspace trust status, enabling command interpolation ($(...)) on repository clone.",
    severity: "CRITICAL",
    cvssScore: 9.8,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
    cwe: "CWE-78: OS Command Injection",
    category: "Developer Tools & IDEs",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: ["CVE-2023-36742"],
    msrcId: "MSRC-CVE-2023-36742",
    affectedTargets: [
      { product: "Visual Studio Code Core", ecosystem: "vscode", affectedVersions: "<1.82.0", fixedInVersion: "1.82.0", purl: "pkg:generic/vscode@1.81.0" },
      { product: "Eclipse Theia Workbench", ecosystem: "Developer Tools", affectedVersions: "<1.41.0", fixedInVersion: "1.41.0" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2023-10-18",
      ransomwareUse: false,
      notes: "Targeted in developer workstation supply chain intrusion campaigns via cloned GitHub repos."
    },
    upstreamSignals: [
      { sourceId: "vendor_msrc_eclipse", sourceName: "Microsoft MSRC", badge: "MSRC Bulletin", finding: "Remote code execution in VS Code developer environment.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "cisa_kev", sourceName: "CISA KEV", badge: "Active Campaign", finding: "Recorded in developer workstation targeting operations.", signalType: "ACTIVE_EXPLOITATION", confidence: "CONFIRMED" },
      { sourceId: "trail_of_bits_vsix", sourceName: "Trail of Bits", badge: "Workspace Trust Audit", finding: "Verified command injection before user trust prompt in debuggers.", signalType: "AST_IOC", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade IDE engine to VS Code 1.82.0+ or SecureIDE Hardened Core with Air-Gap Policy.",
      patchDetails: "Enforce strict Restricted Mode isolation blocking all task and debugger evaluations until explicit user confirmation.",
      workarounds: ["Always inspect cloned repositories in Restricted Mode.", "Disable automatic task and launch configuration discovery."]
    },
    publishedDate: "2023-09-12",
    lastUpdatedDate: "2026-08-25"
  },

  // 9. PyPI & npm Malicious Typosquat Credential Harvester (UVI-2024-4291)
  {
    uviId: "UVI-2024-4291",
    title: "Aqua Nautilus & Socket.dev Flagged Multi-Registry Developer Credential Harvester",
    headline: "Malicious package typosquatting campaign harvesting AWS, GitHub, and SSH credentials from developer workstations.",
    summary: "A coordinated threat campaign uploaded 140+ typosquatted packages to npm and PyPI (impersonating prettier, colorize, and requests) containing an obfuscated telemetry payload that exfiltrates environment secrets to Discord and Telegram webhooks.",
    technicalDetails: "On package installation or import, the setup.py or postinstall hook executes an obfuscated Base64 payload. The script checks for process.env tokens (AWS_SECRET_ACCESS_KEY, GITHUB_TOKEN, NPM_TOKEN, SLACK_BOT_TOKEN) and inspects ~/.aws/credentials, ~/.ssh/id_rsa, and sends encrypted JSON via HTTPS.",
    severity: "CRITICAL",
    cvssScore: 9.6,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:N",
    cwe: "CWE-506: Embedded Malicious Code",
    category: "Supply Chain Malware",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "CHANGED",
    cveList: ["GHSA-malware-2024-9182"],
    ghsaId: "GHSA-malware-2024-9182",
    affectedTargets: [
      { product: "esben-p/prettier-code-formatter", ecosystem: "npm", affectedVersions: "All", fixedInVersion: "Revoked / Blocked", purl: "pkg:npm/esben-p/prettier-code-formatter@9.9.0" },
      { product: "reqeusts-fast / py-colorizer", ecosystem: "pypi", affectedVersions: "All", fixedInVersion: "Revoked / Blocked", purl: "pkg:pypi/reqeusts-fast@2.31.0" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2024-04-02",
      ransomwareUse: false,
      notes: "Credential harvester used in enterprise token theft campaigns."
    },
    upstreamSignals: [
      { sourceId: "aqua_nautilus", sourceName: "Aqua Nautilus", badge: "Typosquat Campaign", finding: "Detected coordinated impersonator packages with malicious postinstall hooks.", signalType: "TYPOSQUAT", confidence: "CONFIRMED" },
      { sourceId: "socket_dev", sourceName: "Socket.dev", badge: "Env & SSH Theft", finding: "Behavioral alert: reads process.env and exfiltrates via webhook.", signalType: "BEHAVIORAL_ALERT", confidence: "CONFIRMED" },
      { sourceId: "openssf_malicious", sourceName: "OpenSSF Malicious Packages", badge: "Quarantine", finding: "Added to global open-source malicious package registry.", signalType: "TYPOSQUAT", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Block and quarantine typosquatted packages in enterprise registries (Artifactory, Nexus). Rotate all developer tokens immediately.",
      patchDetails: "Packages removed from public upstream registries.",
      workarounds: ["Use SecureIDE Registry Proxy to enforce publisher domain whitelist.", "Disable postinstall scripts in npm/pnpm."]
    },
    publishedDate: "2024-03-15",
    lastUpdatedDate: "2026-08-20"
  },

  // 10. Spring Cloud Function SpEL Remote Code Execution (UVI-2022-22963)
  {
    uviId: "UVI-2022-22963",
    title: "Spring Cloud Function Spring Expression Language (SpEL) Remote Code Execution (Spring4Shell)",
    headline: "Unauthenticated remote code execution via routing-expression HTTP header in Spring Cloud Function applications.",
    summary: "Spring Cloud Function allowed routing expressions to be supplied in the spring.cloud.function.routing-expression HTTP header. Untrusted input evaluated as SpEL enabled remote code execution.",
    technicalDetails: "The SimpleFunctionRegistry evaluated the routing expression using a standard SpEL expression parser without restricting execution contexts. An attacker could craft a header such as T(java.lang.Runtime).getRuntime().exec(...) to achieve arbitrary code execution.",
    severity: "CRITICAL",
    cvssScore: 9.8,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
    cwe: "CWE-917: Improper Neutralization of Special Elements used in an Expression Language Statement",
    category: "Dependencies & Libraries",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: ["CVE-2022-22963"],
    ghsaId: "GHSA-r874-v45r-4jgq",
    affectedTargets: [
      { product: "Spring Cloud Function", ecosystem: "maven", affectedVersions: "3.1.6, 3.2.2, older unsupported", fixedInVersion: "3.1.7, 3.2.3", purl: "pkg:maven/org.springframework.cloud/spring-cloud-function-context@3.1.6" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2022-04-04",
      ransomwareUse: true,
      notes: "Extensively exploited in cryptocurrency mining and botnet campaigns."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 9.8", finding: "Critical SpEL injection vulnerability in enterprise Java framework.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "cisa_kev", sourceName: "CISA KEV", badge: "Ransomware Use", finding: "Active weaponization by multiple ransomware and botnet actors.", signalType: "ACTIVE_EXPLOITATION", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade spring-cloud-function to version 3.1.7 or 3.2.3 immediately.",
      patchDetails: "Spring framework now uses SimpleEvaluationContext to prevent arbitrary class instantiation.",
      workarounds: ["Block the spring.cloud.function.routing-expression header at WAF / ingress."]
    },
    publishedDate: "2022-03-29",
    lastUpdatedDate: "2026-08-10"
  },

  // 11. libwebp Heap Buffer Overflow in WebP Rendering (UVI-2023-4863)
  {
    uviId: "UVI-2023-4863",
    title: "libwebp Heap Buffer Overflow in Lossless WebP Image Decoding",
    headline: "Universal zero-click heap buffer overflow in libwebp affecting Chrome, Electron, Firefox, and hundreds of client applications.",
    summary: "A heap-based buffer overflow in libwebp's BuildHuffmanTable function allowed attackers to execute arbitrary code via a specially crafted WebP image. Widely exploited across browsers, chat apps, and Electron-based IDEs.",
    technicalDetails: "When decoding lossless WebP streams, BuildHuffmanTable allocated insufficient memory for Huffman tables when processing malformed bitstream entries. An attacker could construct an image that overruns the allocated table buffer, overwriting adjacent heap allocations.",
    severity: "HIGH",
    cvssScore: 8.8,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H",
    cwe: "CWE-122: Heap-based Buffer Overflow",
    category: "Dependencies & Libraries",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "REQUIRED",
    scope: "UNCHANGED",
    cveList: ["CVE-2023-4863", "CVE-2023-5129"],
    ghsaId: "GHSA-j7hp-h8jx-5ppr",
    affectedTargets: [
      { product: "libwebp", ecosystem: "C/C++", affectedVersions: "0.5.0 <= version < 1.3.2", fixedInVersion: "1.3.2", purl: "pkg:generic/libwebp@1.3.1" },
      { product: "Electron Framework (VS Code, Slack, Discord)", ecosystem: "Developer Tools", affectedVersions: "Electron <22.3.24, <24.8.3, <25.8.1", fixedInVersion: "Electron 25.8.1+" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2023-09-13",
      ransomwareUse: false,
      notes: "Exploited in high-profile zero-day spyware deployment chains."
    },
    upstreamSignals: [
      { sourceId: "cisa_kev", sourceName: "CISA KEV", badge: "Zero-Day Exploitation", finding: "Active weaponization in commercial surveillance spyware.", signalType: "ACTIVE_EXPLOITATION", confidence: "CONFIRMED" },
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 8.8", finding: "Widespread heap overflow affecting all client rendering software.", signalType: "CVE_RECORD", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade libwebp to >=1.3.2 and update all Electron runtimes across developer tools.",
      patchDetails: "Added bounds checks to Huffman table allocation size calculations.",
      workarounds: ["Disable WebP image preview rendering in file managers and IDEs."]
    },
    publishedDate: "2023-09-12",
    lastUpdatedDate: "2026-08-15"
  },

  // 12. Go net/http Content-Length Desynchronization (UVI-2024-45338)
  {
    uviId: "UVI-2024-45338",
    title: "Golang net/http HTTP Request Smuggling via Chunked Header Processing",
    headline: "HTTP request smuggling and cache poisoning in Go net/http reverse proxies and web servers.",
    summary: "The Go net/http package did not properly validate Content-Length and Transfer-Encoding header combinations in specific chunked transfer states, enabling HTTP request smuggling against reverse proxy architectures.",
    technicalDetails: "When processing requests with chunked extensions containing trailing whitespace and duplicate Content-Length headers, the net/http server and client parsed message boundaries inconsistently, allowing an attacker to smuggle a second request.",
    severity: "HIGH",
    cvssScore: 7.5,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:N",
    cwe: "CWE-444: Inconsistent Interpretation of HTTP Requests",
    category: "Networking & Cryptography",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: ["CVE-2024-45338"],
    affectedTargets: [
      { product: "Go Standard Library (net/http)", ecosystem: "golang", affectedVersions: "<1.22.8, <1.23.2", fixedInVersion: "1.22.8, 1.23.2", purl: "pkg:golang/std@1.23.1" }
    ],
    cisaKev: {
      isKnownExploited: false,
      notes: "Used in security research and CDN cache poisoning demonstrations."
    },
    upstreamSignals: [
      { sourceId: "ecosystem_dbs", sourceName: "Go VulnDB", badge: "GO-2024-3152", finding: "Official advisory issued by Google Go security team.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 7.5", finding: "Request smuggling in cloud microservices and ingress proxies.", signalType: "CVE_RECORD", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade Go toolchain to 1.22.8+ or 1.23.2+ and recompile cloud services.",
      patchDetails: "net/http now strictly rejects malformed chunked transfer encoding lines.",
      workarounds: ["Enforce HTTP/2 or HTTP/3 at edge reverse proxies."]
    },
    publishedDate: "2024-09-04",
    lastUpdatedDate: "2026-09-05"
  },

  // 13. Jinja2 Template Attribute Injection (UVI-2024-34064)
  {
    uviId: "UVI-2024-34064",
    title: "Jinja2 Template Engine HTML Attribute Injection in xmlattr Filter",
    headline: "Attribute injection vulnerability in Jinja2 allows Cross-Site Scripting (XSS) when rendering user-controlled dictionary keys.",
    summary: "The xmlattr filter in Jinja2 does not sanitize whitespace in dictionary keys, allowing attackers to inject arbitrary HTML attributes (e.g. onerror=alert(1)) into rendered web pages or documentation hover tools.",
    technicalDetails: "When rendering a dictionary using {{ dict | xmlattr }}, Jinja2 assumed keys were valid XML attribute names. Passing keys with embedded spaces or special characters broke out of attribute quotes.",
    severity: "MEDIUM",
    cvssScore: 5.4,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N",
    cwe: "CWE-79: Cross-site Scripting (XSS)",
    category: "Dependencies & Libraries",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "REQUIRED",
    scope: "CHANGED",
    cveList: ["CVE-2024-34064"],
    ghsaId: "GHSA-g2j5-57x7-q3hm",
    affectedTargets: [
      { product: "Jinja2", ecosystem: "pypi", affectedVersions: "<3.1.4", fixedInVersion: "3.1.4", purl: "pkg:pypi/jinja2@3.1.3" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 5.4", finding: "Attribute injection in popular Python template engine.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "ecosystem_dbs", sourceName: "PyPA Advisory DB", badge: "PYSEC-2024-48", finding: "Fixed in Jinja2 3.1.4 release.", signalType: "CVE_RECORD", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade jinja2 to >=3.1.4 in requirements.txt or pyproject.toml.",
      patchDetails: "xmlattr filter now validates that all dictionary keys match valid XML attribute regex patterns.",
      workarounds: ["Sanitize dictionary keys before passing them to the xmlattr filter."]
    },
    publishedDate: "2024-05-06",
    lastUpdatedDate: "2026-08-10"
  },

  // 14. OpenSSL ChaCha20-Poly1305 Cipher State Corruption (UVI-2024-52303)
  {
    uviId: "UVI-2024-52303",
    title: "OpenSSL ChaCha20-Poly1305 TLS Cipher State Corruption Denial of Service",
    headline: "Memory corruption in OpenSSL's ChaCha20-Poly1305 assembly routine causing application crashes during TLS negotiation.",
    summary: "A flaw in the AVX-512 assembly implementation of ChaCha20-Poly1305 in OpenSSL could cause state corruption under high concurrency, leading to daemon crash and denial of service.",
    technicalDetails: "On processors supporting AVX-512, an incorrect register spill in chacha-x86_64.pl corrupted the stack frame when handling specific message alignments during TLS record decryption.",
    severity: "MEDIUM",
    cvssScore: 5.9,
    cvssVector: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:N/I:N/A:H",
    cwe: "CWE-662: Improper Synchronization",
    category: "Networking & Cryptography",
    attackVector: "NETWORK",
    attackComplexity: "HIGH",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: ["CVE-2024-52303"],
    affectedTargets: [
      { product: "OpenSSL", ecosystem: "C/C++", affectedVersions: "3.0.0 - 3.0.14, 3.1.0 - 3.1.6, 3.2.0 - 3.2.2, 3.3.0 - 3.3.1", fixedInVersion: "3.0.15, 3.1.7, 3.2.3, 3.3.2", purl: "pkg:generic/openssl@3.3.1" }
    ],
    cisaKev: { isKnownExploited: false },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 5.9", finding: "Denial of service in AVX-512 cryptographic implementation.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "trail_of_bits_vsix", sourceName: "Trail of Bits", badge: "Cryptographic Audit", finding: "Assembly register spill verified via symbolic execution.", signalType: "AST_IOC", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Upgrade OpenSSL to 3.0.15+, 3.1.7+, 3.2.3+, or 3.3.2+.",
      patchDetails: "Corrected AVX-512 register preservation in ChaCha20 assembly loops.",
      workarounds: ["Disable ChaCha20-Poly1305 cipher suites in server configuration."]
    },
    publishedDate: "2024-08-20",
    lastUpdatedDate: "2026-09-01"
  },

  // 15. nghttp2 HTTP/2 CONTINUATION Flood Denial of Service (UVI-2024-28182)
  {
    uviId: "UVI-2024-28182",
    title: "HTTP/2 CONTINUATION Frame Flood Denial of Service across Web Servers & Proxies",
    headline: "Unbounded HTTP/2 CONTINUATION frame processing permits remote resource exhaustion and server crash.",
    summary: "An attacker can trigger out-of-memory crashes and 100% CPU utilization on HTTP/2 servers by sending a continuous stream of CONTINUATION frames without ending the header block.",
    technicalDetails: "Many HTTP/2 implementations, including nghttp2, Node.js http2, Go net/http, and Apache Tomcat, did not enforce a limit on the number of CONTINUATION frames received per stream as long as the END_HEADERS flag was omitted.",
    severity: "HIGH",
    cvssScore: 7.5,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H",
    cwe: "CWE-400: Uncontrolled Resource Consumption",
    category: "Networking & Cryptography",
    attackVector: "NETWORK",
    attackComplexity: "LOW",
    privilegesRequired: "NONE",
    userInteraction: "NONE",
    scope: "UNCHANGED",
    cveList: ["CVE-2024-28182"],
    affectedTargets: [
      { product: "nghttp2 / Envoy / Node.js", ecosystem: "Networking", affectedVersions: "<1.61.0", fixedInVersion: "1.61.0", purl: "pkg:generic/nghttp2@1.60.0" }
    ],
    cisaKev: {
      isKnownExploited: true,
      dateAdded: "2024-05-02",
      ransomwareUse: false,
      notes: "Observed in distributed denial of service attacks against cloud infrastructure."
    },
    upstreamSignals: [
      { sourceId: "nvd_cve", sourceName: "NIST NVD", badge: "CVSS 7.5", finding: "Universal HTTP/2 denial of service attack vector.", signalType: "CVE_RECORD", confidence: "CONFIRMED" },
      { sourceId: "cisa_kev", sourceName: "CISA KEV", badge: "Active In KEV", finding: "Active exploitation in cloud edge network disruptions.", signalType: "ACTIVE_EXPLOITATION", confidence: "CONFIRMED" }
    ],
    remediation: {
      recommendedAction: "Apply HTTP/2 CONTINUATION flood security updates across all reverse proxies, API gateways, and web servers.",
      patchDetails: "Enforce strict limits on unparsed header frames per HTTP/2 stream.",
      workarounds: ["Limit maximum header list size or disable HTTP/2 temporarily if patches cannot be applied."]
    },
    publishedDate: "2024-04-03",
    lastUpdatedDate: "2026-08-22"
  }
];
