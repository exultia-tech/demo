export interface CveDetail {
  id: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  cvssScore: number;
  cvssVector?: string;
  cwe: string;
  summary: string;
  affectedVersions: string;
  fixedInVersion?: string;
  publishedDate: string;
  remediation: string;
}

export interface ThreatSignals {
  nvdGhsaOsv: {
    hasCve: boolean;
    cveList: string[];
    cvssMaxSeverity: number;
    advisory?: string;
    cveDetails?: CveDetail[];
  };
  cisaKev: {
    isKnownExploited: boolean;
    dateAdded?: string;
    ransomwareUse?: boolean;
    notes?: string;
  };
  msrcEclipse: {
    vendorCompliant: boolean;
    mfrStatus: "VERIFIED_OFFICIAL" | "COMMUNITY_CONTRIBUTED" | "VENDOR_ALERT" | "REVOKED";
    details: string;
  };
  trailOfBits: {
    hasMaliciousIoC: boolean;
    c2Detection: boolean;
    obfuscationFlag: boolean;
    details: string;
  };
  jfrog: {
    status: "REACHABLE_IPC" | "THEORETICAL_DEPS" | "CLEAN" | "EXPLOITABLE_REMOTE";
    runtimeExploitable: boolean;
    details: string;
  };
  aquaNautilus: {
    status: "TYPOSQUAT_FLAG" | "VERIFIED_PUBLISHER" | "IMPERSONATION_RISK" | "COMMUNITY";
    isTyposquat: boolean;
    details: string;
  };
  socketDev: {
    status: "MALICIOUS_HEURISTIC" | "CLEAN_BEHAVIOR" | "SUSPICIOUS_NETWORK" | "ENV_THEFT";
    credentialAccess: boolean;
    details: string;
  };
  snyk: {
    transitiveVulnerabilities: number;
    languageServerAudited: boolean;
    details: string;
  };
  openSsf: {
    score: number;
    branchProtection: boolean;
    pinnedDependencies: boolean;
    maliciousPackageDbFlag?: boolean;
    codeReviewScore?: number;
  };
}

export interface ThreatFeedRecord {
  id: string;
  namespace: string;
  name: string;
  displayName: string;
  purl: string;
  version: string;
  ecosystem: "vscode" | "npm" | "pypi" | "golang" | "cargo" | "maven";
  packageType: "IDE Extension" | "Language Server (LSP)" | "Compiler / Toolchain" | "Runtime Dependency";
  securityGrade: "A+" | "B" | "C";
  compositeScore: number;
  openCveCount: number;
  isDeprecated: boolean;
  deprecationReason?: string;
  replacementPackage?: string;
  verifiedPublisher: boolean;
  publisherDomain?: string;
  license: string;
  downloadCount?: number;
  description: string;
  threatSignals: ThreatSignals;
  lastAudited: string;
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
}

export const UVI_PUBLIC_FEED_SOURCES: PublicFeedSource[] = [
  {
    id: "nvd_cve",
    name: "NIST National Vulnerability Database (NVD) & CVE List",
    scope: "Universal Common Vulnerabilities and Exposures",
    access: "Public REST API 2.0",
    status: "Realtime",
    refreshRate: "Hourly",
    coverage: "Global standard for CVE definitions, CVSS metrics, and CWE classifications across all published software.",
    homepageUrl: "https://nvd.nist.gov",
    icon: "🏛️"
  },
  {
    id: "cisa_kev",
    name: "CISA Known Exploited Vulnerabilities (KEV) Catalog",
    scope: "Active In-The-Wild Exploitation & Ransomware Vectors",
    access: "Public JSON Feed",
    status: "Active",
    refreshRate: "Daily",
    coverage: "U.S. Cybersecurity & Infrastructure Security Agency catalog of vulnerabilities actively weaponized by adversaries.",
    homepageUrl: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
    icon: "🚨"
  },
  {
    id: "ghsa",
    name: "GitHub Advisory Database (GHSA)",
    scope: "Open Source Ecosystem Advisories",
    access: "Public GraphQL / REST",
    status: "Realtime",
    refreshRate: "Continuous",
    coverage: "Curated security advisories covering npm, PyPI, Go, Rust Crates, Maven, and VS Code extensions.",
    homepageUrl: "https://github.com/advisories",
    icon: "🐙"
  },
  {
    id: "osv_dev",
    name: "Open Source Vulnerabilities (OSV.dev)",
    scope: "OpenSSF Standardized Vulnerability Aggregation",
    access: "Public REST API",
    status: "Active",
    refreshRate: "Continuous",
    coverage: "Google & OpenSSF standardized schema unifying 30+ ecosystem databases into machine-readable JSON format.",
    homepageUrl: "https://osv.dev",
    icon: "🌐"
  },
  {
    id: "openssf_malicious",
    name: "OpenSSF Malicious Packages Repository & Scorecards",
    scope: "Supply Chain Malware, Typosquats & Repo Hygiene",
    access: "Public API",
    status: "Active",
    refreshRate: "Daily",
    coverage: "Automated analysis of repository security posture, branch protection, commit signing, and confirmed malware campaigns.",
    homepageUrl: "https://scorecard.dev",
    icon: "🛡️"
  },
  {
    id: "vendor_msrc_eclipse",
    name: "Microsoft Security Response Center (MSRC) & Eclipse Advisories",
    scope: "Official IDE Core Bulletins & Open VSX Notices",
    access: "Public Advisories",
    status: "Active",
    refreshRate: "Daily",
    coverage: "Vendor security bulletins targeting Visual Studio Code, Eclipse Theia, Monaco Editor, and Open VSX Registry.",
    homepageUrl: "https://msrc.microsoft.com",
    icon: "🏢"
  },
  {
    id: "trail_of_bits_vsix",
    name: "Trail of Bits vsix-audit Database & AST Scanner",
    scope: "Malicious Patterns, AST Inspection & C2 Network IoCs",
    access: "Public Open Source",
    status: "Active",
    refreshRate: "Continuous",
    coverage: "Static analysis engine auditing VS Code / Open VSX extension archives for obfuscation, IPC abuse, and hidden binaries.",
    homepageUrl: "https://github.com/trailofbits/vsix-audit",
    icon: "🔬"
  },
  {
    id: "socket_dev",
    name: "Socket.dev Threat Intelligence",
    scope: "Behavioral Heuristics, Env Theft & Subprocess Spawning",
    access: "Public Research / API",
    status: "Active",
    refreshRate: "Continuous",
    coverage: "Detects runtime behavioral risks: accessing SSH keys, reading environment variables, and spawning shell processes.",
    homepageUrl: "https://socket.dev",
    icon: "🔌"
  },
  {
    id: "jfrog_research",
    name: "JFrog Security Research Advisories",
    scope: "AST Call-Graph Reachability & Exploitability Analysis",
    access: "Public Advisories",
    status: "Active",
    refreshRate: "Weekly",
    coverage: "Distinguishes theoretical library CVEs from practically reachable execution paths in developer tooling.",
    homepageUrl: "https://jfrog.com/security",
    icon: "🐸"
  },
  {
    id: "aqua_nautilus",
    name: "Aqua Nautilus Cloud & Marketplace Research",
    scope: "Marketplace Impersonation, Namespace Squatting & Trojans",
    access: "Public Feed",
    status: "Active",
    refreshRate: "Weekly",
    coverage: "Specialized threat intel on extension marketplace typosquatting, publisher identity spoofing, and malicious updates.",
    homepageUrl: "https://www.aquasec.com/research",
    icon: "🌊"
  },
  {
    id: "snyk_vulndb",
    name: "Snyk Open Vulnerability Database",
    scope: "Transitive Dependency Trees & Language Server Security",
    access: "Public Database",
    status: "Active",
    refreshRate: "Daily",
    coverage: "Deep dependency tree auditing for nested npm/python components bundled inside standalone language servers.",
    homepageUrl: "https://snyk.io/vuln",
    icon: "🐕"
  },
  {
    id: "ecosystem_dbs",
    name: "Ecosystem Advisory Repositories (RustSec, Go VulnDB, PyPA)",
    scope: "Native Language Toolchain Security Advisories",
    access: "Public DBs / Git",
    status: "Realtime",
    refreshRate: "Hourly",
    coverage: "First-party security databases from the Rust Foundation, Google Go security team, and Python Software Foundation.",
    homepageUrl: "https://rustsec.org",
    icon: "📦"
  }
];

export const THREAT_INTELLIGENCE_CATALOG: ThreatFeedRecord[] = [
  // 1. Meta Pyrefly (A+)
  {
    id: "ext-meta-pyrefly",
    namespace: "meta",
    name: "pyrefly",
    displayName: "Pyrefly - Python Language Tooling",
    purl: "pkg:vscode/meta/pyrefly@1.4.2",
    version: "1.4.2",
    ecosystem: "vscode",
    packageType: "IDE Extension",
    securityGrade: "A+",
    compositeScore: 98,
    openCveCount: 0,
    isDeprecated: false,
    verifiedPublisher: true,
    publisherDomain: "meta.com",
    license: "MIT",
    downloadCount: 420000,
    description: "Next-generation Python language server and type checking engine built by Meta. Zero telemetry, sandboxed LSP process.",
    threatSignals: {
      nvdGhsaOsv: { hasCve: false, cveList: [], cvssMaxSeverity: 0 },
      cisaKev: { isKnownExploited: false },
      msrcEclipse: { vendorCompliant: true, mfrStatus: "VERIFIED_OFFICIAL", details: "Adheres to Open VSX & VS Code API schemas." },
      trailOfBits: { hasMaliciousIoC: false, c2Detection: false, obfuscationFlag: false, details: "vsix-audit: 0 suspicious AST patterns or C2 signatures." },
      jfrog: { status: "CLEAN", runtimeExploitable: false, details: "0 AST injection vectors; IPC sandboxed." },
      aquaNautilus: { status: "VERIFIED_PUBLISHER", isTyposquat: false, details: "Verified Meta Open Source publisher domain." },
      socketDev: { status: "CLEAN_BEHAVIOR", credentialAccess: false, details: "Zero subprocess exfiltration or credential leaks." },
      snyk: { transitiveVulnerabilities: 0, languageServerAudited: true, details: "Language server dependencies locked and scanned clean." },
      openSsf: { score: 9.4, branchProtection: true, pinnedDependencies: true, maliciousPackageDbFlag: false, codeReviewScore: 9.6 }
    },
    lastAudited: "2026-09-04T12:00:00Z"
  },
  // 2. Astral Ruff (A+)
  {
    id: "ext-astral-ruff",
    namespace: "charliermarsh",
    name: "ruff",
    displayName: "Ruff Linter & Formatter",
    purl: "pkg:vscode/charliermarsh/ruff@0.6.1",
    version: "0.6.1",
    ecosystem: "vscode",
    packageType: "IDE Extension",
    securityGrade: "A+",
    compositeScore: 99,
    openCveCount: 0,
    isDeprecated: false,
    verifiedPublisher: true,
    publisherDomain: "astral.sh",
    license: "MIT",
    downloadCount: 1850000,
    description: "Extremely fast Python linter and formatter, written in Rust. Statically compiled binary without node runtime vulnerabilities.",
    threatSignals: {
      nvdGhsaOsv: { hasCve: false, cveList: [], cvssMaxSeverity: 0 },
      cisaKev: { isKnownExploited: false },
      msrcEclipse: { vendorCompliant: true, mfrStatus: "VERIFIED_OFFICIAL", details: "Compliant with Open VSX packaging specifications." },
      trailOfBits: { hasMaliciousIoC: false, c2Detection: false, obfuscationFlag: false, details: "vsix-audit: Native Rust binary statically verified." },
      jfrog: { status: "CLEAN", runtimeExploitable: false, details: "Native Rust binary; static bounds checking validated." },
      aquaNautilus: { status: "VERIFIED_PUBLISHER", isTyposquat: false, details: "Official Astral Software maintainer." },
      socketDev: { status: "CLEAN_BEHAVIOR", credentialAccess: false, details: "No network socket listening; strictly offline." },
      snyk: { transitiveVulnerabilities: 0, languageServerAudited: true, details: "Static native binary without node runtime dependencies." },
      openSsf: { score: 9.8, branchProtection: true, pinnedDependencies: true, maliciousPackageDbFlag: false, codeReviewScore: 10.0 }
    },
    lastAudited: "2026-09-04T12:00:00Z"
  },
  // 3. rust-analyzer (A+)
  {
    id: "ext-rust-rust-analyzer",
    namespace: "rust-lang",
    name: "rust-analyzer",
    displayName: "rust-analyzer (Rust Language Server)",
    purl: "pkg:vscode/rust-lang/rust-analyzer@0.3.2084",
    version: "0.3.2084",
    ecosystem: "vscode",
    packageType: "Language Server (LSP)",
    securityGrade: "A+",
    compositeScore: 100,
    openCveCount: 0,
    isDeprecated: false,
    verifiedPublisher: true,
    publisherDomain: "rust-lang.org",
    license: "Apache-2.0",
    downloadCount: 3900000,
    description: "Official Rust Foundation language server implementation. Full LSP compliant, zero telemetry, memory-safe execution profile.",
    threatSignals: {
      nvdGhsaOsv: { hasCve: false, cveList: [], cvssMaxSeverity: 0 },
      cisaKev: { isKnownExploited: false },
      msrcEclipse: { vendorCompliant: true, mfrStatus: "VERIFIED_OFFICIAL", details: "Official Rust Foundation toolchain package." },
      trailOfBits: { hasMaliciousIoC: false, c2Detection: false, obfuscationFlag: false, details: "vsix-audit: Clean memory-safe execution profile." },
      jfrog: { status: "CLEAN", runtimeExploitable: false, details: "Memory-safe Rust architecture; zero unsafe blocks in LSP loop." },
      aquaNautilus: { status: "VERIFIED_PUBLISHER", isTyposquat: false, details: "Official Rust Foundation organization." },
      socketDev: { status: "CLEAN_BEHAVIOR", credentialAccess: false, details: "Strict IPC channels." },
      snyk: { transitiveVulnerabilities: 0, languageServerAudited: true, details: "0 CVEs in language server engine." },
      openSsf: { score: 9.9, branchProtection: true, pinnedDependencies: true, maliciousPackageDbFlag: false, codeReviewScore: 9.9 }
    },
    lastAudited: "2026-09-04T12:00:00Z"
  },
  // 4. Google Go (A+)
  {
    id: "ext-golang-go",
    namespace: "golang",
    name: "Go",
    displayName: "Go Language Extension (Google)",
    purl: "pkg:vscode/golang/Go@0.42.0",
    version: "0.42.0",
    ecosystem: "vscode",
    packageType: "IDE Extension",
    securityGrade: "A+",
    compositeScore: 99,
    openCveCount: 0,
    isDeprecated: false,
    verifiedPublisher: true,
    publisherDomain: "go.dev",
    license: "MIT",
    downloadCount: 8200000,
    description: "Rich language support for the Go programming language, maintained by the Google Go Core development team.",
    threatSignals: {
      nvdGhsaOsv: { hasCve: false, cveList: [], cvssMaxSeverity: 0 },
      cisaKev: { isKnownExploited: false },
      msrcEclipse: { vendorCompliant: true, mfrStatus: "VERIFIED_OFFICIAL", details: "Maintained by Google Go Core team." },
      trailOfBits: { hasMaliciousIoC: false, c2Detection: false, obfuscationFlag: false, details: "vsix-audit: Passed all AST & integrity checks." },
      jfrog: { status: "CLEAN", runtimeExploitable: false, details: "Gopls server isolated with workspace trust bounds." },
      aquaNautilus: { status: "VERIFIED_PUBLISHER", isTyposquat: false, details: "Official Golang publisher." },
      socketDev: { status: "CLEAN_BEHAVIOR", credentialAccess: false, details: "Zero telemetry transmissions." },
      snyk: { transitiveVulnerabilities: 0, languageServerAudited: true, details: "Gopls 0.16.x verified clean." },
      openSsf: { score: 9.9, branchProtection: true, pinnedDependencies: true, maliciousPackageDbFlag: false, codeReviewScore: 9.8 }
    },
    lastAudited: "2026-09-04T12:00:00Z"
  },
  // 5. ESLint (A+)
  {
    id: "ext-dbaeumer-eslint",
    namespace: "dbaeumer",
    name: "vscode-eslint",
    displayName: "ESLint Static Code Analyzer",
    purl: "pkg:vscode/dbaeumer/vscode-eslint@3.0.10",
    version: "3.0.10",
    ecosystem: "vscode",
    packageType: "IDE Extension",
    securityGrade: "A+",
    compositeScore: 97,
    openCveCount: 0,
    isDeprecated: false,
    verifiedPublisher: true,
    publisherDomain: "eslint.org",
    license: "MIT",
    downloadCount: 31000000,
    description: "Integrates ESLint JavaScript and TypeScript static analysis into your IDE with automated autofix capabilities.",
    threatSignals: {
      nvdGhsaOsv: { hasCve: false, cveList: [], cvssMaxSeverity: 0 },
      cisaKev: { isKnownExploited: false },
      msrcEclipse: { vendorCompliant: true, mfrStatus: "VERIFIED_OFFICIAL", details: "Co-maintained with Microsoft Developer Division." },
      trailOfBits: { hasMaliciousIoC: false, c2Detection: false, obfuscationFlag: false, details: "vsix-audit: Verified publisher signature." },
      jfrog: { status: "CLEAN", runtimeExploitable: false, details: "Node execution isolated from host environment variables." },
      aquaNautilus: { status: "VERIFIED_PUBLISHER", isTyposquat: false, details: "Verified ESLint team publisher." },
      socketDev: { status: "CLEAN_BEHAVIOR", credentialAccess: false, details: "Zero credential reading." },
      snyk: { transitiveVulnerabilities: 0, languageServerAudited: true, details: "Nested npm packages audited clean." },
      openSsf: { score: 9.2, branchProtection: true, pinnedDependencies: true, maliciousPackageDbFlag: false, codeReviewScore: 9.4 }
    },
    lastAudited: "2026-09-04T12:00:00Z"
  },
  // 6. Prettier (A+)
  {
    id: "ext-esbenp-prettier",
    namespace: "esbenp",
    name: "prettier-vscode",
    displayName: "Prettier Opinionated Code Formatter",
    purl: "pkg:vscode/esbenp/prettier-vscode@10.4.0",
    version: "10.4.0",
    ecosystem: "vscode",
    packageType: "IDE Extension",
    securityGrade: "A+",
    compositeScore: 98,
    openCveCount: 0,
    isDeprecated: false,
    verifiedPublisher: true,
    publisherDomain: "prettier.io",
    license: "MIT",
    downloadCount: 38000000,
    description: "Multi-language code formatting tool enforcing consistent code styling. Runs locally within editor process sandboxing.",
    threatSignals: {
      nvdGhsaOsv: { hasCve: false, cveList: [], cvssMaxSeverity: 0 },
      cisaKev: { isKnownExploited: false },
      msrcEclipse: { vendorCompliant: true, mfrStatus: "VERIFIED_OFFICIAL", details: "Official Prettier maintainer account." },
      trailOfBits: { hasMaliciousIoC: false, c2Detection: false, obfuscationFlag: false, details: "vsix-audit: 0 suspicious AST patterns." },
      jfrog: { status: "CLEAN", runtimeExploitable: false, details: "Pure formatting AST execution; isolated from filesystem." },
      aquaNautilus: { status: "VERIFIED_PUBLISHER", isTyposquat: false, details: "Verified Prettier core team publisher." },
      socketDev: { status: "CLEAN_BEHAVIOR", credentialAccess: false, details: "Zero telemetry transmissions." },
      snyk: { transitiveVulnerabilities: 0, languageServerAudited: true, details: "AST engine verified 0 CVEs." },
      openSsf: { score: 9.3, branchProtection: true, pinnedDependencies: true, maliciousPackageDbFlag: false, codeReviewScore: 9.5 }
    },
    lastAudited: "2026-09-04T12:00:00Z"
  },
  // 7. gopls (Golang Ecosystem LSP) (A+)
  {
    id: "pkg-golang-gopls",
    namespace: "golang.org/x/tools",
    name: "gopls",
    displayName: "gopls Language Server Protocol Daemon",
    purl: "pkg:golang/golang.org/x/tools/gopls@0.16.2",
    version: "0.16.2",
    ecosystem: "golang",
    packageType: "Language Server (LSP)",
    securityGrade: "A+",
    compositeScore: 99,
    openCveCount: 0,
    isDeprecated: false,
    verifiedPublisher: true,
    publisherDomain: "golang.org",
    license: "BSD-3-Clause",
    downloadCount: 6500000,
    description: "Official language server protocol (LSP) daemon for Go. Provides diagnostics, type navigation, and code refactoring.",
    threatSignals: {
      nvdGhsaOsv: { hasCve: false, cveList: [], cvssMaxSeverity: 0 },
      cisaKev: { isKnownExploited: false },
      msrcEclipse: { vendorCompliant: true, mfrStatus: "VERIFIED_OFFICIAL", details: "Official Go language server toolchain." },
      trailOfBits: { hasMaliciousIoC: false, c2Detection: false, obfuscationFlag: false, details: "Clean binary static analysis." },
      jfrog: { status: "CLEAN", runtimeExploitable: false, details: "Isolated LSP process bounds." },
      aquaNautilus: { status: "VERIFIED_PUBLISHER", isTyposquat: false, details: "Official Go toolchain namespace." },
      socketDev: { status: "CLEAN_BEHAVIOR", credentialAccess: false, details: "Clean IPC heuristics." },
      snyk: { transitiveVulnerabilities: 0, languageServerAudited: true, details: "Transitive Go modules audited clean." },
      openSsf: { score: 9.9, branchProtection: true, pinnedDependencies: true, maliciousPackageDbFlag: false, codeReviewScore: 10.0 }
    },
    lastAudited: "2026-09-04T12:00:00Z"
  },
  // 8. Semgrep Code Scanner (A+)
  {
    id: "ext-semgrep-semgrep",
    namespace: "Semgrep",
    name: "semgrep",
    displayName: "Semgrep Enterprise Code Scanner",
    purl: "pkg:vscode/Semgrep/semgrep@1.12.0",
    version: "1.12.0",
    ecosystem: "vscode",
    packageType: "IDE Extension",
    securityGrade: "A+",
    compositeScore: 98,
    openCveCount: 0,
    isDeprecated: false,
    verifiedPublisher: true,
    publisherDomain: "semgrep.dev",
    license: "LGPL-2.1",
    downloadCount: 520000,
    description: "Fast, lightweight static analysis for finding bugs and enforcing security standards. Operates with local rule evaluation.",
    threatSignals: {
      nvdGhsaOsv: { hasCve: false, cveList: [], cvssMaxSeverity: 0 },
      cisaKev: { isKnownExploited: false },
      msrcEclipse: { vendorCompliant: true, mfrStatus: "VERIFIED_OFFICIAL", details: "Semgrep Enterprise verified vendor." },
      trailOfBits: { hasMaliciousIoC: false, c2Detection: false, obfuscationFlag: false, details: "vsix-audit: Verified static security engine." },
      jfrog: { status: "CLEAN", runtimeExploitable: false, details: "AST engine runs locally with read-only workspace bounds." },
      aquaNautilus: { status: "VERIFIED_PUBLISHER", isTyposquat: false, details: "Official Semgrep Inc. organization." },
      socketDev: { status: "CLEAN_BEHAVIOR", credentialAccess: false, details: "Clean behavioral heuristics." },
      snyk: { transitiveVulnerabilities: 0, languageServerAudited: true, details: "0 CVEs in analysis binaries." },
      openSsf: { score: 9.7, branchProtection: true, pinnedDependencies: true, maliciousPackageDbFlag: false, codeReviewScore: 9.6 }
    },
    lastAudited: "2026-09-04T12:00:00Z"
  },
  // 9. Tailwind CSS IntelliSense (A+)
  {
    id: "ext-tailwind-intellisense",
    namespace: "bradlc",
    name: "vscode-tailwindcss",
    displayName: "Tailwind CSS IntelliSense",
    purl: "pkg:vscode/bradlc/vscode-tailwindcss@0.12.7",
    version: "0.12.7",
    ecosystem: "vscode",
    packageType: "IDE Extension",
    securityGrade: "A+",
    compositeScore: 96,
    openCveCount: 0,
    isDeprecated: false,
    verifiedPublisher: true,
    publisherDomain: "tailwindcss.com",
    license: "MIT",
    downloadCount: 16400000,
    description: "Intelligent Tailwind CSS tooling for VS Code and Theia including autocomplete, syntax highlighting, and linting.",
    threatSignals: {
      nvdGhsaOsv: { hasCve: false, cveList: [], cvssMaxSeverity: 0 },
      cisaKev: { isKnownExploited: false },
      msrcEclipse: { vendorCompliant: true, mfrStatus: "VERIFIED_OFFICIAL", details: "Official Tailwind Labs publisher account." },
      trailOfBits: { hasMaliciousIoC: false, c2Detection: false, obfuscationFlag: false, details: "Clean JavaScript bundle; no suspicious eval() invocations." },
      jfrog: { status: "CLEAN", runtimeExploitable: false, details: "Pure CSS parser; sandbox verified." },
      aquaNautilus: { status: "VERIFIED_PUBLISHER", isTyposquat: false, details: "Authentic Tailwind Labs team." },
      socketDev: { status: "CLEAN_BEHAVIOR", credentialAccess: false, details: "No network requests made during design-time autocomplete." },
      snyk: { transitiveVulnerabilities: 0, languageServerAudited: true, details: "Zero CVEs in parser dependencies." },
      openSsf: { score: 9.1, branchProtection: true, pinnedDependencies: true, maliciousPackageDbFlag: false, codeReviewScore: 9.0 }
    },
    lastAudited: "2026-09-04T12:00:00Z"
  },

  // 10. Grade B: Legacy Formatter with Transitive Warning
  {
    id: "ext-formatex-legacy",
    namespace: "formatex",
    name: "json-tools-pro",
    displayName: "JSON Tools Pro & Validator",
    purl: "pkg:vscode/formatex/json-tools-pro@2.1.4",
    version: "2.1.4",
    ecosystem: "vscode",
    packageType: "IDE Extension",
    securityGrade: "B",
    compositeScore: 78,
    openCveCount: 1,
    isDeprecated: false,
    verifiedPublisher: false,
    license: "Apache-2.0",
    downloadCount: 88000,
    description: "JSON parsing and tree inspection tooling. Flags low-severity transitive vulnerability in bundled JSON5 prototype parser.",
    threatSignals: {
      nvdGhsaOsv: {
        hasCve: true,
        cveList: ["CVE-2022-46175"],
        cvssMaxSeverity: 5.3,
        advisory: "GHSA-9c47-m6qq-7p4h: JSON5 prototype pollution in parse method.",
        cveDetails: [
          {
            id: "CVE-2022-46175",
            title: "Prototype Pollution in JSON5 parse()",
            severity: "MEDIUM",
            cvssScore: 5.3,
            cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:L/A:N",
            cwe: "CWE-1321: Improperly Controlled Modification of Object Prototype",
            summary: "JSON5 before v2.2.2 does not restrict modifying Object.prototype via __proto__ keys when parsing untrusted JSON5 strings.",
            affectedVersions: "<2.2.2",
            fixedInVersion: "2.2.2",
            publishedDate: "2022-12-24",
            remediation: "Upgrade bundled json5 dependency to >=2.2.2. Workspace trust restricts execution on untrusted directories."
          }
        ]
      },
      cisaKev: { isKnownExploited: false },
      msrcEclipse: { vendorCompliant: true, mfrStatus: "COMMUNITY_CONTRIBUTED", details: "Community package; conforms to extension manifest v2." },
      trailOfBits: { hasMaliciousIoC: false, c2Detection: false, obfuscationFlag: false, details: "Theoretical parser pollution; no active C2 or disk persistence found." },
      jfrog: { status: "THEORETICAL_DEPS", runtimeExploitable: false, details: "Non-exploitable under standard VS Code worker sandbox." },
      aquaNautilus: { status: "COMMUNITY", isTyposquat: false, details: "Established community project; not a typosquat." },
      socketDev: { status: "CLEAN_BEHAVIOR", credentialAccess: false, details: "No environment or credential exfiltration attempts." },
      snyk: { transitiveVulnerabilities: 1, languageServerAudited: false, details: "1 moderate vulnerability in bundled json5 package." },
      openSsf: { score: 6.8, branchProtection: false, pinnedDependencies: false, maliciousPackageDbFlag: false, codeReviewScore: 7.0 }
    },
    lastAudited: "2026-09-02T16:00:00Z"
  },

  // 11. Grade B: PyPI Language Package with Transitive Vulnerability
  {
    id: "pkg-pypi-jinja2-lsp",
    namespace: "pallets",
    name: "jinja2-lsp",
    displayName: "jinja2-lsp Language Server Protocol",
    purl: "pkg:pypi/jinja2-lsp@0.8.1",
    version: "0.8.1",
    ecosystem: "pypi",
    packageType: "Language Server (LSP)",
    securityGrade: "B",
    compositeScore: 74,
    openCveCount: 1,
    isDeprecated: false,
    verifiedPublisher: true,
    publisherDomain: "palletsprojects.com",
    license: "BSD-3-Clause",
    downloadCount: 310000,
    description: "Jinja template language server daemon. Transitive warning on bundled markdown parser when rendering hover documentation.",
    threatSignals: {
      nvdGhsaOsv: {
        hasCve: true,
        cveList: ["CVE-2024-34064"],
        cvssMaxSeverity: 5.4,
        advisory: "GHSA-g2j5-57x7-q3hm: Jinja HTML attribute injection in xmlattr filter.",
        cveDetails: [
          {
            id: "CVE-2024-34064",
            title: "HTML Attribute Injection in Jinja xmlattr Filter",
            severity: "MEDIUM",
            cvssScore: 5.4,
            cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N",
            cwe: "CWE-79: Cross-site Scripting (XSS)",
            summary: "Passing keys containing spaces to the xmlattr filter can result in injecting arbitrary HTML attributes into rendered documentation.",
            affectedVersions: "<3.1.4",
            fixedInVersion: "3.1.4",
            publishedDate: "2024-05-06",
            remediation: "Upgrade jinja2 runtime to >=3.1.4 in LSP virtualenv."
          }
        ]
      },
      cisaKev: { isKnownExploited: false },
      msrcEclipse: { vendorCompliant: true, mfrStatus: "COMMUNITY_CONTRIBUTED", details: "Third-party template LSP implementation." },
      trailOfBits: { hasMaliciousIoC: false, c2Detection: false, obfuscationFlag: false, details: "Clean static analysis; no malicious payload detected." },
      jfrog: { status: "THEORETICAL_DEPS", runtimeExploitable: false, details: "Requires attacker to control Jinja template variable keys." },
      aquaNautilus: { status: "VERIFIED_PUBLISHER", isTyposquat: false, details: "Authentic Pallets Projects ecosystem contributor." },
      socketDev: { status: "CLEAN_BEHAVIOR", credentialAccess: false, details: "Normal template compilation behavior." },
      snyk: { transitiveVulnerabilities: 1, languageServerAudited: true, details: "1 medium severity CVE in jinja2 rendering engine." },
      openSsf: { score: 7.4, branchProtection: true, pinnedDependencies: false, maliciousPackageDbFlag: false, codeReviewScore: 8.0 }
    },
    lastAudited: "2026-09-01T10:00:00Z"
  },

  // 12. Grade C: CRITICAL CVE & Workspace Trust Bypass RCE
  {
    id: "ext-debug-workspace-rce",
    namespace: "vulnerable-lab",
    name: "remote-debugger-core",
    displayName: "Remote Debugger Core (Compromised / Exploit Vector)",
    purl: "pkg:vscode/vulnerable-lab/remote-debugger-core@1.0.8",
    version: "1.0.8",
    ecosystem: "vscode",
    packageType: "IDE Extension",
    securityGrade: "C",
    compositeScore: 28,
    openCveCount: 2,
    isDeprecated: true,
    deprecationReason: "Critical remote code execution vulnerability (CVE-2023-36742). Quarantined by SecureIDE Governance Engine.",
    replacementPackage: "pkg:vscode/ms-vscode/js-debug@latest",
    verifiedPublisher: false,
    license: "GPL-3.0",
    downloadCount: 45000,
    description: "Legacy debugging bridge containing arbitrary shell command injection via unescaped socket connection parameters.",
    threatSignals: {
      nvdGhsaOsv: {
        hasCve: true,
        cveList: ["CVE-2023-36742", "CVE-2023-36743"],
        cvssMaxSeverity: 9.8,
        advisory: "CVE-2023-36742: Unauthenticated Remote Code Execution in IDE Debug Bridge via malicious workspace configuration.",
        cveDetails: [
          {
            id: "CVE-2023-36742",
            title: "Remote Code Execution via launch.json Parameter Injection",
            severity: "CRITICAL",
            cvssScore: 9.8,
            cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
            cwe: "CWE-78: Improper Neutralization of Special Elements used in an OS Command",
            summary: "Opening an untrusted workspace with a crafted .vscode/launch.json enables remote attackers to execute arbitrary commands without user confirmation.",
            affectedVersions: "<=1.0.8",
            publishedDate: "2023-09-12",
            remediation: "Immediately remove extension. Replace with hardened js-debug runtime with workspace trust enforcement."
          },
          {
            id: "CVE-2023-36743",
            title: "Local Privilege Escalation via Temporary Named Pipes",
            severity: "HIGH",
            cvssScore: 7.8,
            cvssVector: "CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H",
            cwe: "CWE-377: Insecure Temporary File",
            summary: "Insecure creation of debugging IPC pipes in shared /tmp directories permits local privilege escalation.",
            affectedVersions: "<=1.0.8",
            publishedDate: "2023-09-12",
            remediation: "Disallow non-root pipe access in hardened IDE container."
          }
        ]
      },
      cisaKev: {
        isKnownExploited: true,
        dateAdded: "2023-10-18",
        ransomwareUse: false,
        notes: "Targeted in developer workstation supply chain intrusion campaigns."
      },
      msrcEclipse: { vendorCompliant: false, mfrStatus: "VENDOR_ALERT", details: "Microsoft MSRC Security Bulletin: Revoked from marketplace index." },
      trailOfBits: { hasMaliciousIoC: true, c2Detection: true, obfuscationFlag: true, details: "vsix-audit: Shell command spawned via child_process.exec with unsanitized arguments." },
      jfrog: { status: "EXPLOITABLE_REMOTE", runtimeExploitable: true, details: "Direct AST call graph leads to exec() with unsanitized workspace arguments." },
      aquaNautilus: { status: "IMPERSONATION_RISK", isTyposquat: false, details: "Publisher domain expired and seized." },
      socketDev: { status: "MALICIOUS_HEURISTIC", credentialAccess: true, details: "Attempts to read SSH keys during debugger attachment." },
      snyk: { transitiveVulnerabilities: 4, languageServerAudited: false, details: "Multiple unpatched high-severity CVEs in embedded RPC layer." },
      openSsf: { score: 2.1, branchProtection: false, pinnedDependencies: false, maliciousPackageDbFlag: true, codeReviewScore: 1.0 }
    },
    lastAudited: "2026-08-28T09:00:00Z"
  },

  // 13. Grade C: Aqua Nautilus Flagged Typosquat
  {
    id: "ext-aqua-typosquat-prettier",
    namespace: "esben-p",
    name: "prettier-code-formatter",
    displayName: "Prettier - Code Formatter (Typosquat Trojan)",
    purl: "pkg:vscode/esben-p/prettier-code-formatter@9.9.0",
    version: "9.9.0",
    ecosystem: "vscode",
    packageType: "IDE Extension",
    securityGrade: "C",
    compositeScore: 12,
    openCveCount: 1,
    isDeprecated: true,
    deprecationReason: "Malicious typosquatting imposter impersonating esbenp.prettier-vscode. Exfiltrates environment tokens to external webhook.",
    replacementPackage: "pkg:vscode/esbenp/prettier-vscode@latest",
    verifiedPublisher: false,
    license: "MIT",
    downloadCount: 12400,
    description: "Counterfeit extension identified by Aqua Nautilus mimicking official Prettier formatter with hidden data exfiltration logic.",
    threatSignals: {
      nvdGhsaOsv: {
        hasCve: true,
        cveList: ["GHSA-malware-2024-9182"],
        cvssMaxSeverity: 9.6,
        advisory: "GHSA-malware-2024-9182: Malicious npm/vscode package harvesting AWS and GitHub API credentials.",
        cveDetails: [
          {
            id: "GHSA-malware-2024-9182",
            title: "Credential Harvesting Trojan in Typosquatted Extension",
            severity: "CRITICAL",
            cvssScore: 9.6,
            cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:N",
            cwe: "CWE-506: Embedded Malicious Code",
            summary: "On activation, iterates process.env searching for GITHUB_TOKEN, AWS_SECRET_ACCESS_KEY, and sends Base64 payload to discord webhook.",
            affectedVersions: "All",
            publishedDate: "2024-03-15",
            remediation: "Revoke all developer credentials immediately. Quarantine extension in fleet governance whitelist."
          }
        ]
      },
      cisaKev: { isKnownExploited: true, dateAdded: "2024-04-02", ransomwareUse: false, notes: "Credential harvester used in enterprise token theft campaigns." },
      msrcEclipse: { vendorCompliant: false, mfrStatus: "REVOKED", details: "Marketplace trust violation: Identity impersonation." },
      trailOfBits: { hasMaliciousIoC: true, c2Detection: true, obfuscationFlag: true, details: "vsix-audit: Base64 obfuscated payload detected in dist/extension.js." },
      jfrog: { status: "EXPLOITABLE_REMOTE", runtimeExploitable: true, details: "Direct exfiltration hook in activate() function." },
      aquaNautilus: { status: "TYPOSQUAT_FLAG", isTyposquat: true, details: "Aqua Nautilus Alert: Publisher 'esben-p' impersonates official 'esbenp'." },
      socketDev: { status: "ENV_THEFT", credentialAccess: true, details: "Critical Alert: Detected reading of sensitive cloud credentials from disk and environment." },
      snyk: { transitiveVulnerabilities: 2, languageServerAudited: false, details: "Contains malicious dropper code." },
      openSsf: { score: 1.2, branchProtection: false, pinnedDependencies: false, maliciousPackageDbFlag: true, codeReviewScore: 0.0 }
    },
    lastAudited: "2026-08-25T11:00:00Z"
  },

  // 14. Grade C: Deprecated Package (Beautify)
  {
    id: "ext-hookyqr-beautify",
    namespace: "HookyQR",
    name: "beautify",
    displayName: "Beautify javascript, JSON, CSS",
    purl: "pkg:vscode/HookyQR/beautify@1.5.0",
    version: "1.5.0",
    ecosystem: "vscode",
    packageType: "IDE Extension",
    securityGrade: "C",
    compositeScore: 35,
    openCveCount: 1,
    isDeprecated: true,
    deprecationReason: "Project unmaintained since 2018. Contains unpatched dependencies and conflicts with modern VS Code language APIs.",
    replacementPackage: "pkg:vscode/esbenp/prettier-vscode@latest",
    verifiedPublisher: false,
    license: "MIT",
    downloadCount: 11000000,
    description: "Legacy code beautifier. Deprecated by author and replaced by Prettier. Contains vulnerabilities in outdated js-beautify sub-dependency.",
    threatSignals: {
      nvdGhsaOsv: {
        hasCve: true,
        cveList: ["CVE-2021-23358"],
        cvssMaxSeverity: 7.2,
        advisory: "CVE-2021-23358: js-beautify regular expression denial of service (ReDoS).",
        cveDetails: [
          {
            id: "CVE-2021-23358",
            title: "Regular Expression Denial of Service (ReDoS) in js-beautify",
            severity: "HIGH",
            cvssScore: 7.2,
            cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H",
            cwe: "CWE-1333: Inefficient Regular Expression Complexity",
            summary: "Vulnerable regex in js-beautify enables attackers to freeze IDE execution by supplying crafted CSS files.",
            affectedVersions: "<1.13.6",
            publishedDate: "2021-03-24",
            remediation: "Migrate to Prettier or modern language formatter."
          }
        ]
      },
      cisaKev: { isKnownExploited: false },
      msrcEclipse: { vendorCompliant: false, mfrStatus: "VENDOR_ALERT", details: "Unmaintained extension: Deprecated API usage." },
      trailOfBits: { hasMaliciousIoC: false, c2Detection: false, obfuscationFlag: false, details: "vsix-audit: Abandoned repository; high technical debt." },
      jfrog: { status: "THEORETICAL_DEPS", runtimeExploitable: false, details: "ReDoS vector triggers main-thread freeze on crafted formatting input." },
      aquaNautilus: { status: "COMMUNITY", isTyposquat: false, details: "Original package, but unmaintained for >6 years." },
      socketDev: { status: "CLEAN_BEHAVIOR", credentialAccess: false, details: "No malicious activity detected; purely abandoned codebase." },
      snyk: { transitiveVulnerabilities: 3, languageServerAudited: false, details: "3 unresolved CVEs in abandoned npm dependencies." },
      openSsf: { score: 3.4, branchProtection: false, pinnedDependencies: false, maliciousPackageDbFlag: false, codeReviewScore: 2.0 }
    },
    lastAudited: "2026-08-20T14:00:00Z"
  },

  // 15. Grade A+: Cargo / Rust Crates Security LSP
  {
    id: "pkg-cargo-cargo-audit-lsp",
    namespace: "rustsec",
    name: "cargo-audit-lsp",
    displayName: "cargo-audit Dependency Inspector (RustSec)",
    purl: "pkg:cargo/rustsec/cargo-audit-lsp@0.20.0",
    version: "0.20.0",
    ecosystem: "cargo",
    packageType: "Compiler / Toolchain",
    securityGrade: "A+",
    compositeScore: 99,
    openCveCount: 0,
    isDeprecated: false,
    verifiedPublisher: true,
    publisherDomain: "rustsec.org",
    license: "Apache-2.0",
    downloadCount: 890000,
    description: "Official RustSec advisory database client for Cargo. Scans Cargo.lock dependencies in real time against RustSec advisories.",
    threatSignals: {
      nvdGhsaOsv: { hasCve: false, cveList: [], cvssMaxSeverity: 0 },
      cisaKev: { isKnownExploited: false },
      msrcEclipse: { vendorCompliant: true, mfrStatus: "VERIFIED_OFFICIAL", details: "Official RustSec advisory toolchain." },
      trailOfBits: { hasMaliciousIoC: false, c2Detection: false, obfuscationFlag: false, details: "Statically analyzed Rust binary; zero unsafe blocks." },
      jfrog: { status: "CLEAN", runtimeExploitable: false, details: "Zero reachability vulnerabilities." },
      aquaNautilus: { status: "VERIFIED_PUBLISHER", isTyposquat: false, details: "Verified RustSec advisory team." },
      socketDev: { status: "CLEAN_BEHAVIOR", credentialAccess: false, details: "Deterministic local analysis." },
      snyk: { transitiveVulnerabilities: 0, languageServerAudited: true, details: "0 CVEs in advisory client." },
      openSsf: { score: 9.8, branchProtection: true, pinnedDependencies: true, maliciousPackageDbFlag: false, codeReviewScore: 9.9 }
    },
    lastAudited: "2026-09-04T12:00:00Z"
  },

  // 16. Grade A+: Maven Java Language Server
  {
    id: "pkg-maven-jdtls",
    namespace: "org.eclipse.jdt",
    name: "org.eclipse.jdt.ls",
    displayName: "Eclipse JDT Language Server (Java)",
    purl: "pkg:maven/org.eclipse.jdt/org.eclipse.jdt.ls@1.39.0",
    version: "1.39.0",
    ecosystem: "maven",
    packageType: "Language Server (LSP)",
    securityGrade: "A+",
    compositeScore: 96,
    openCveCount: 0,
    isDeprecated: false,
    verifiedPublisher: true,
    publisherDomain: "eclipse.org",
    license: "EPL-2.0",
    downloadCount: 5400000,
    description: "Java language server implementation backed by the Eclipse Foundation and Red Hat. Fully audited against JVM deserialization vectors.",
    threatSignals: {
      nvdGhsaOsv: { hasCve: false, cveList: [], cvssMaxSeverity: 0 },
      cisaKev: { isKnownExploited: false },
      msrcEclipse: { vendorCompliant: true, mfrStatus: "VERIFIED_OFFICIAL", details: "Official Eclipse Foundation flagship project." },
      trailOfBits: { hasMaliciousIoC: false, c2Detection: false, obfuscationFlag: false, details: "JVM security policy enforces strict classpath sandboxing." },
      jfrog: { status: "CLEAN", runtimeExploitable: false, details: "0 unauthenticated deserialization gadgets." },
      aquaNautilus: { status: "VERIFIED_PUBLISHER", isTyposquat: false, details: "Official Eclipse Foundation namespace." },
      socketDev: { status: "CLEAN_BEHAVIOR", credentialAccess: false, details: "Clean IPC heuristics." },
      snyk: { transitiveVulnerabilities: 0, languageServerAudited: true, details: "All transitive Maven dependencies patched." },
      openSsf: { score: 9.3, branchProtection: true, pinnedDependencies: true, maliciousPackageDbFlag: false, codeReviewScore: 9.4 }
    },
    lastAudited: "2026-09-03T18:00:00Z"
  },

  // 17. Grade C: npm Command Injection in Language Server Tool
  {
    id: "pkg-npm-malicious-lsp-bridge",
    namespace: "nodetools",
    name: "language-server-bridge",
    displayName: "Language Server Node IPC Bridge (Command Injection)",
    purl: "pkg:npm/nodetools/language-server-bridge@1.2.3",
    version: "1.2.3",
    ecosystem: "npm",
    packageType: "Runtime Dependency",
    securityGrade: "C",
    compositeScore: 22,
    openCveCount: 1,
    isDeprecated: true,
    deprecationReason: "Critical remote command execution (CVE-2024-27982) via unquoted arguments to child_process.spawn.",
    verifiedPublisher: false,
    license: "ISC",
    downloadCount: 72000,
    description: "Legacy Node.js IPC bridge library used by community language server wrappers. Permits command injection on Windows workstations.",
    threatSignals: {
      nvdGhsaOsv: {
        hasCve: true,
        cveList: ["CVE-2024-27982"],
        cvssMaxSeverity: 9.8,
        advisory: "CVE-2024-27982: Remote Code Execution in Node.js child_process.spawn on Windows via .bat/.cmd argument injection.",
        cveDetails: [
          {
            id: "CVE-2024-27982",
            title: "Command Injection in Windows child_process via batch files",
            severity: "CRITICAL",
            cvssScore: 9.8,
            cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
            cwe: "CWE-78: Improper Neutralization of Special Elements used in an OS Command",
            summary: "Executing .bat or .cmd files through child_process on Windows without explicit escaping allows malicious workspace arguments to execute commands.",
            affectedVersions: "<1.3.0",
            publishedDate: "2024-04-10",
            remediation: "Upgrade to version >=1.3.0 or isolate execution within air-gapped Docker container."
          }
        ]
      },
      cisaKev: { isKnownExploited: true, dateAdded: "2024-04-25", ransomwareUse: false, notes: "Exploited in target developer spear-phishing repositories." },
      msrcEclipse: { vendorCompliant: false, mfrStatus: "VENDOR_ALERT", details: "Windows RCE vulnerability flagged across multiple community extensions." },
      trailOfBits: { hasMaliciousIoC: true, c2Detection: false, obfuscationFlag: false, details: "vsix-audit: Vulnerable spawn pattern without shell:false protection." },
      jfrog: { status: "EXPLOITABLE_REMOTE", runtimeExploitable: true, details: "Directly exploitable on Windows machines via workspace repo." },
      aquaNautilus: { status: "COMMUNITY", isTyposquat: false, details: "Unmaintained dependency in 14 community extensions." },
      socketDev: { status: "SUSPICIOUS_NETWORK", credentialAccess: false, details: "Spawns cmd.exe with unescaped workspace parameters." },
      snyk: { transitiveVulnerabilities: 2, languageServerAudited: false, details: "Critical CVE-2024-27982 detected in dependency graph." },
      openSsf: { score: 2.9, branchProtection: false, pinnedDependencies: false, maliciousPackageDbFlag: false, codeReviewScore: 1.5 }
    },
    lastAudited: "2026-08-22T13:00:00Z"
  },

  // 18. Grade A+: Docker Container Tooling (A+)
  {
    id: "ext-ms-azuretools-docker",
    namespace: "ms-azuretools",
    name: "vscode-docker",
    displayName: "Docker Container Integration",
    purl: "pkg:vscode/ms-azuretools/vscode-docker@1.29.0",
    version: "1.29.0",
    ecosystem: "vscode",
    packageType: "IDE Extension",
    securityGrade: "A+",
    compositeScore: 97,
    openCveCount: 0,
    isDeprecated: false,
    verifiedPublisher: true,
    publisherDomain: "microsoft.com",
    license: "MIT",
    downloadCount: 29000000,
    description: "Manage containerized development environments with image scanning, compose orchestrations, and rootless daemon support.",
    threatSignals: {
      nvdGhsaOsv: { hasCve: false, cveList: [], cvssMaxSeverity: 0 },
      cisaKev: { isKnownExploited: false },
      msrcEclipse: { vendorCompliant: true, mfrStatus: "VERIFIED_OFFICIAL", details: "Official Microsoft toolchain package." },
      trailOfBits: { hasMaliciousIoC: false, c2Detection: false, obfuscationFlag: false, details: "Socket operations restricted to local Docker pipe." },
      jfrog: { status: "CLEAN", runtimeExploitable: false, details: "Docker daemon interaction enforces workspace trust checks." },
      aquaNautilus: { status: "VERIFIED_PUBLISHER", isTyposquat: false, details: "Verified Microsoft publisher identity." },
      socketDev: { status: "CLEAN_BEHAVIOR", credentialAccess: false, details: "No unauthorized socket exposure." },
      snyk: { transitiveVulnerabilities: 0, languageServerAudited: true, details: "Zero CVEs in container management code." },
      openSsf: { score: 9.4, branchProtection: true, pinnedDependencies: true, maliciousPackageDbFlag: false, codeReviewScore: 9.6 }
    },
    lastAudited: "2026-09-04T12:00:00Z"
  }
];
