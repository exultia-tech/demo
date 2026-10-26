import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface PurePackage {
  id: string;
  name: string;
  ecosystem: "npm" | "pypi" | "crates" | "deb" | "apk" | "nix" | "rpm";
  version: string;
  description: string;
  author: string;
  status: "clean" | "pure-patched" | "quarantined";
  disclosedCves: number;
  slsaLevel: "SLSA L3" | "SLSA L2";
  openVexHash: string;
  cosignDigest: string;
  downloadsWeekly: string;
  license: string;
  lastAudited: string;
  hotpatchInfo?: {
    cveId: string;
    description: string;
    hotpatchLatencyMs: number;
    purePatchVersion: string;
  };
  quarantineDetails?: {
    cveId: string;
    cvss: number;
    severity: "CRITICAL" | "HIGH";
    refusalReason: string;
    safeAlternative: string;
  };
}

export const CATALOG_PACKAGES: PurePackage[] = [
  // ── 1. CLEAN PACKAGES (0 Disclosed CVEs) ──────────────────────────────────
  {
    id: "pkg-tokio",
    name: "tokio",
    ecosystem: "crates",
    version: "1.39.2",
    description: "An event-driven, non-blocking I/O platform for writing asynchronous applications in Rust.",
    author: "Tokio Contributors",
    status: "clean",
    disclosedCves: 0,
    slsaLevel: "SLSA L3",
    openVexHash: "sha256:8f4b23c9e10a8d76...",
    cosignDigest: "cosign-key-tokio-v1.39.2.sig",
    downloadsWeekly: "4,210,000",
    license: "MIT",
    lastAudited: "10 minutes ago"
  },
  {
    id: "pkg-fastapi",
    name: "fastapi",
    ecosystem: "pypi",
    version: "0.111.0",
    description: "Modern, high-performance web framework for building APIs with Python 3.8+ based on standard Python type hints.",
    author: "Sebastián Ramírez",
    status: "clean",
    disclosedCves: 0,
    slsaLevel: "SLSA L3",
    openVexHash: "sha256:d4c3b2a19e8f...",
    cosignDigest: "cosign-key-fastapi-v0.111.0.sig",
    downloadsWeekly: "8,940,000",
    license: "MIT",
    lastAudited: "14 minutes ago"
  },
  {
    id: "pkg-zod",
    name: "zod",
    ecosystem: "npm",
    version: "3.23.8",
    description: "TypeScript-first schema validation with static type inference. Zero dependencies and zero disclosures.",
    author: "Colin McDonnell",
    status: "clean",
    disclosedCves: 0,
    slsaLevel: "SLSA L3",
    openVexHash: "sha256:1a2b3c4d5e6f...",
    cosignDigest: "cosign-key-zod-v3.23.8.sig",
    downloadsWeekly: "16,500,000",
    license: "MIT",
    lastAudited: "4 minutes ago"
  },
  {
    id: "pkg-ripgrep",
    name: "ripgrep",
    ecosystem: "deb",
    version: "14.1.0-pure1",
    description: "Line-oriented search tool that recursively searches the current directory for a regex pattern.",
    author: "Andrew Gallant",
    status: "clean",
    disclosedCves: 0,
    slsaLevel: "SLSA L3",
    openVexHash: "sha256:aa99bb88cc77...",
    cosignDigest: "cosign-key-ripgrep-v14.1.0.sig",
    downloadsWeekly: "1,120,000",
    license: "MIT / UNLICENSE",
    lastAudited: "22 minutes ago"
  },
  {
    id: "pkg-musl-dev",
    name: "musl-dev",
    ecosystem: "apk",
    version: "1.2.5-r0",
    description: "The musl c library standard development headers and static linkage libraries for Alpine Linux.",
    author: "Alpine Core Team",
    status: "clean",
    disclosedCves: 0,
    slsaLevel: "SLSA L3",
    openVexHash: "sha256:55ee44dd33cc...",
    cosignDigest: "cosign-key-musl-v1.2.5.sig",
    downloadsWeekly: "6,800,000",
    license: "MIT",
    lastAudited: "8 minutes ago"
  },

  // ── 2. PURE-PATCHED PACKAGES (CVE neutralized via Kinetic / Vantage) ───────
  {
    id: "pkg-openssh-pure",
    name: "openssh-server",
    ecosystem: "deb",
    version: "9.7p1-pure1",
    description: "Secure shell server with resident Kinetic hotpatch neutralizing RegreSSHion signal handler race condition.",
    author: "OpenBSD / Exultia Pure Labs",
    status: "pure-patched",
    disclosedCves: 0, // Clean because hotpatch is verified and verified in-memory!
    slsaLevel: "SLSA L3",
    openVexHash: "sha256:cve-2024-6387-neutralized-9a8b...",
    cosignDigest: "cosign-attestation-praxis-hotpatch-06387.sig",
    downloadsWeekly: "3,400,000",
    license: "BSD",
    lastAudited: "2 minutes ago",
    hotpatchInfo: {
      cveId: "CVE-2024-6387",
      description: "RegreSSHion SIGALRM race condition eliminated via atomic LoginGraceTime zero-allocation trap.",
      hotpatchLatencyMs: 142,
      purePatchVersion: "9.7p1-pure1"
    }
  },
  {
    id: "pkg-php-cgi-pure",
    name: "php-cgi",
    ecosystem: "apk",
    version: "8.2.19-pure1",
    description: "FastCGI implementation with surgical Best-Fit character encoding filter neutralizing argument injection.",
    author: "PHP Group / Exultia Pure Labs",
    status: "pure-patched",
    disclosedCves: 0,
    slsaLevel: "SLSA L3",
    openVexHash: "sha256:cve-2024-4577-neutralized-44dd...",
    cosignDigest: "cosign-attestation-praxis-hotpatch-04577.sig",
    downloadsWeekly: "890,000",
    license: "PHP License 3.01",
    lastAudited: "5 minutes ago",
    hotpatchInfo: {
      cveId: "CVE-2024-4577",
      description: "Windows / FastCGI soft-hyphen (0xAD) query parameter bypass filtered before command line invocation.",
      hotpatchLatencyMs: 18,
      purePatchVersion: "8.2.19-pure1"
    }
  },
  {
    id: "pkg-urllib3-pure",
    name: "urllib3",
    ecosystem: "pypi",
    version: "2.0.7-pure1",
    description: "HTTP library with cookie leak header stripping hotpatch applied on HTTP redirects to different origins.",
    author: "urllib3 team / Exultia Pure Labs",
    status: "pure-patched",
    disclosedCves: 0,
    slsaLevel: "SLSA L3",
    openVexHash: "sha256:cve-2023-45803-neutralized...",
    cosignDigest: "cosign-attestation-praxis-hotpatch-45803.sig",
    downloadsWeekly: "18,200,000",
    license: "MIT",
    lastAudited: "12 minutes ago",
    hotpatchInfo: {
      cveId: "CVE-2023-45803",
      description: "Proxy-Authorization and Cookie header stripping on cross-origin redirects enforced hermetically.",
      hotpatchLatencyMs: 4,
      purePatchVersion: "2.0.7-pure1"
    }
  },

  // ── 3. QUARANTINED PACKAGES (Blocked from Install with Cryptographic Refusal) ─
  {
    id: "pkg-xz-quarantined",
    name: "xz",
    ecosystem: "deb",
    version: "5.6.0 (VULNERABLE)",
    description: "Data compression library containing malicious backdoor bytecode in build m4 macros.",
    author: "Jia Tan (Compromised Upstream)",
    status: "quarantined",
    disclosedCves: 1,
    slsaLevel: "SLSA L2",
    openVexHash: "sha256:cve-2024-3094-quarantine-blocked",
    cosignDigest: "UNSIGNED_REJECTED",
    downloadsWeekly: "0 (BLOCKED)",
    license: "Public Domain / LGPL",
    lastAudited: "1 minute ago",
    quarantineDetails: {
      cveId: "CVE-2024-3094",
      cvss: 10.0,
      severity: "CRITICAL",
      refusalReason: "Cryptographic Trojan injected into build system targeting OpenSSH RSA_public_decrypt symbol hijacking.",
      safeAlternative: "xz@5.4.6 or xz@5.6.1-pure1"
    }
  },
  {
    id: "pkg-log4j-quarantined",
    name: "log4j-core",
    ecosystem: "npm", // Also modeled for universal package queries
    version: "2.14.1 (VULNERABLE)",
    description: "Java logging framework containing JNDI LDAP lookup arbitrary code execution backdoor.",
    author: "Apache Software Foundation",
    status: "quarantined",
    disclosedCves: 1,
    slsaLevel: "SLSA L2",
    openVexHash: "sha256:cve-2021-44228-quarantine-blocked",
    cosignDigest: "UNSIGNED_REJECTED",
    downloadsWeekly: "0 (BLOCKED)",
    license: "Apache-2.0",
    lastAudited: "3 minutes ago",
    quarantineDetails: {
      cveId: "CVE-2021-44228",
      cvss: 10.0,
      severity: "CRITICAL",
      refusalReason: "JNDI message lookup parsing allows unauthenticated RCE via ldap:// attacker-controlled URLs.",
      safeAlternative: "log4j-core@2.17.1 or pure-log4j@2.14.1-pure1"
    }
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';
  const ecosystem = searchParams.get('ecosystem')?.toLowerCase() || 'all';
  const status = searchParams.get('status')?.toLowerCase() || 'all';

  let filtered = CATALOG_PACKAGES;

  if (ecosystem !== 'all') {
    filtered = filtered.filter(p => p.ecosystem === ecosystem);
  }

  if (status !== 'all') {
    filtered = filtered.filter(p => p.status === status);
  }

  if (query) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.author.toLowerCase().includes(query) ||
      p.hotpatchInfo?.cveId.toLowerCase().includes(query) ||
      p.quarantineDetails?.cveId.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({
    status: "success",
    timestamp: new Date().toISOString(),
    totalVerifiedClean: CATALOG_PACKAGES.filter(p => p.status !== "quarantined").length,
    quarantinedCount: CATALOG_PACKAGES.filter(p => p.status === "quarantined").length,
    activeFeedsTracked: 110,
    enforcementPolicy: "ZERO_DISCLOSED_CVES_REQUIRED",
    packages: filtered
  });
}
