import { NextRequest, NextResponse } from "next/server";

export interface CandidateEvaluation {
  version: string;
  releaseType: "UPSTREAM_PATCH" | "HISTORICAL_STABLE_FALLBACK" | "SURGICAL_MICROPATCH" | "REJECTED_TAINTED";
  cveCount: number;
  abiCompatible: boolean;
  score: number;
  status: "SELECTED" | "REJECTED" | "STANDBY";
  rejectionReason?: string;
  storePath: string;
  sha256: string;
}

export interface SelfHealingResponse {
  timestamp: string;
  adversaryScenario: string;
  cveId: string;
  cvss: number;
  threatSummary: string;
  affectedPackage: {
    name: string;
    installedVersion: string;
    storePath: string;
    status: "TAINTED_QUARANTINED";
  };
  remediationPlan: {
    strategy: "DOWNGRADE_TO_HISTORICAL_STABLE" | "UPGRADE_TO_PATCHED_RELEASE" | "PRAXIS_INMEMORY_TRAMPOLINE";
    selectedCandidate: CandidateEvaluation;
    candidateMatrix: CandidateEvaluation[];
    abiVerification: {
      soname: string;
      symbolEquivalenceRatio: number;
      missingSymbols: string[];
      sonameMatch: boolean;
      verdict: "STRICT_ABI_COMPATIBLE" | "ABI_BREAKAGE_DETECTED";
    };
    executionTimeline: {
      stage: string;
      durationMs: number;
      detail: string;
    }[];
    totalRemediationMs: number;
    atomicRollbackSlaMs: number;
    openVexAttestationSha: string;
  };
}

const KNOWLEDGE_BASE: Record<string, SelfHealingResponse> = {
  "xz-utils": {
    timestamp: new Date().toISOString(),
    adversaryScenario: "Upstream Supply Chain Backdoor (CVE-2024-3094)",
    cveId: "CVE-2024-3094",
    cvss: 10.0,
    threatSummary: "Obfuscated payload in upstream release tarballs hijacks RSA_public_decrypt in liblzma via IFUNC resolver, granting unauthorized pre-auth RCE in OpenSSH.",
    affectedPackage: {
      name: "xz-utils",
      installedVersion: "5.6.1",
      storePath: "/nix/store/7x91akw3v9d21882m-xz-5.6.1",
      status: "TAINTED_QUARANTINED"
    },
    remediationPlan: {
      strategy: "DOWNGRADE_TO_HISTORICAL_STABLE",
      selectedCandidate: {
        version: "5.4.6",
        releaseType: "HISTORICAL_STABLE_FALLBACK",
        cveCount: 0,
        abiCompatible: true,
        score: 98.4,
        status: "SELECTED",
        storePath: "/nix/store/1h390bmq7v9x4p20a-xz-5.4.6",
        sha256: "b9c1d0e82f763914a8b7c2518e90e729a4f6d13b6c20173e1f0e49a8c17b5f21"
      },
      candidateMatrix: [
        {
          version: "5.6.1",
          releaseType: "REJECTED_TAINTED",
          cveCount: 1,
          abiCompatible: true,
          score: 0.0,
          status: "REJECTED",
          rejectionReason: "Active Disclosure: Backdoored IFUNC payload (CVE-2024-3094, CVSS 10.0)",
          storePath: "/nix/store/7x91akw3v9d21882m-xz-5.6.1",
          sha256: "9b3c4a2d8e7f10b28491823746a5c891e2b4f6d7a8c901e23f4b5c6d7e8f9a0b"
        },
        {
          version: "5.6.0",
          releaseType: "REJECTED_TAINTED",
          cveCount: 1,
          abiCompatible: true,
          score: 0.0,
          status: "REJECTED",
          rejectionReason: "Active Disclosure: Upstream tarball contains initial staged backdoor payload",
          storePath: "/nix/store/3v84m1px9a21b476m-xz-5.6.0",
          sha256: "8a1b2c3d4e5f60718293a4b5c6d7e8f901a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6"
        },
        {
          version: "5.4.6",
          releaseType: "HISTORICAL_STABLE_FALLBACK",
          cveCount: 0,
          abiCompatible: true,
          score: 98.4,
          status: "SELECTED",
          storePath: "/nix/store/1h390bmq7v9x4p20a-xz-5.4.6",
          sha256: "b9c1d0e82f763914a8b7c2518e90e729a4f6d13b6c20173e1f0e49a8c17b5f21"
        }
      ],
      abiVerification: {
        soname: "liblzma.so.5",
        symbolEquivalenceRatio: 1.0,
        missingSymbols: [],
        sonameMatch: true,
        verdict: "STRICT_ABI_COMPATIBLE"
      },
      executionTimeline: [
        { stage: "Vantage Ingestion & Taint Flagging", durationMs: 4.2, detail: "Ingested CVE-2024-3094. Tainted /nix/store/7x91akw3v9d21882m-xz-5.6.1. Revoked execute permissions." },
        { stage: "Constraint Solver Search", durationMs: 12.8, detail: "Evaluated 3 candidates. Disqualified 5.6.0 (infected). Selected clean historical stable 5.4.6." },
        { stage: "ELF & Soname ABI Verification", durationMs: 6.1, detail: "Inspected liblzma.so.5 against 14 dependent services (sshd, systemd, dpkg). 100% symbol match." },
        { stage: "Atomic Generation Re-Link", durationMs: 8.4, detail: "Shifted /nix/var/nix/profiles/system to generation 843. Swapped store symlink atomically." },
        { stage: "Socket-Preserving Daemon Reload", durationMs: 6.9, detail: "Kinetic signaled dependent daemons with SCM_RIGHTS socket handover. Zero dropped TCP sockets." }
      ],
      totalRemediationMs: 38.4,
      atomicRollbackSlaMs: 50,
      openVexAttestationSha: "sha256:9f8e7d6c5b4a3120192837465abecdf1234567890abcdef1234567890abcdef1"
    }
  },
  "openssh": {
    timestamp: new Date().toISOString(),
    adversaryScenario: "Pre-Auth Remote Code Execution (RegreSSHion CVE-2024-6387)",
    cveId: "CVE-2024-6387",
    cvss: 8.1,
    threatSummary: "Signal handler race condition in OpenSSH Server (sshd) on glibc-based Linux allows unauthenticated remote attackers to execute arbitrary code as root.",
    affectedPackage: {
      name: "openssh",
      installedVersion: "9.6p1",
      storePath: "/nix/store/9k82vd3m710apw81b-openssh-9.6p1",
      status: "TAINTED_QUARANTINED"
    },
    remediationPlan: {
      strategy: "UPGRADE_TO_PATCHED_RELEASE",
      selectedCandidate: {
        version: "9.8p1",
        releaseType: "UPSTREAM_PATCH",
        cveCount: 0,
        abiCompatible: true,
        score: 99.2,
        status: "SELECTED",
        storePath: "/nix/store/4p91x0vma817b293c-openssh-9.8p1",
        sha256: "c18e9a2b7f3d4e5a6b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a"
      },
      candidateMatrix: [
        {
          version: "9.6p1",
          releaseType: "REJECTED_TAINTED",
          cveCount: 1,
          abiCompatible: true,
          score: 0.0,
          status: "REJECTED",
          rejectionReason: "Active Disclosure: Signal handler race condition (CVE-2024-6387, CVSS 8.1)",
          storePath: "/nix/store/9k82vd3m710apw81b-openssh-9.6p1",
          sha256: "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5"
        },
        {
          version: "9.8p1",
          releaseType: "UPSTREAM_PATCH",
          cveCount: 0,
          abiCompatible: true,
          score: 99.2,
          status: "SELECTED",
          storePath: "/nix/store/4p91x0vma817b293c-openssh-9.8p1",
          sha256: "c18e9a2b7f3d4e5a6b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a"
        },
        {
          version: "9.5p1",
          releaseType: "HISTORICAL_STABLE_FALLBACK",
          cveCount: 0,
          abiCompatible: true,
          score: 91.0,
          status: "STANDBY",
          rejectionReason: "Standby backup: Upstream official clean patch 9.8p1 is available with higher capability parity",
          storePath: "/nix/store/6m18b4va9271c384d-openssh-9.5p1",
          sha256: "e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6"
        }
      ],
      abiVerification: {
        soname: "sshd",
        symbolEquivalenceRatio: 1.0,
        missingSymbols: [],
        sonameMatch: true,
        verdict: "STRICT_ABI_COMPATIBLE"
      },
      executionTimeline: [
        { stage: "Vantage Ingestion & Taint Flagging", durationMs: 3.8, detail: "Ingested CVE-2024-6387. Identified active process sshd (PID 1120). Enabled eBPF ingress guard." },
        { stage: "Constraint Solver Search", durationMs: 10.4, detail: "Evaluated 3 candidates. Identified 9.8p1 official patch with 0 open CVEs in Exultia Binary Cache." },
        { stage: "Configuration & PAM Compatibility Check", durationMs: 5.9, detail: "Parsed /etc/ssh/sshd_config against 9.8p1 schema. Confirmed 100% parameter compatibility." },
        { stage: "Atomic Generation Re-Link", durationMs: 7.2, detail: "Activated profile generation 844. Relinked binary targets in /run/current-system/sw/bin." },
        { stage: "Kinetic Socket Handover", durationMs: 6.8, detail: "Passed listening fd (port 22) and active client sessions to 9.8p1 daemon. Zero dropped SSH sessions." }
      ],
      totalRemediationMs: 34.1,
      atomicRollbackSlaMs: 50,
      openVexAttestationSha: "sha256:a1b2c3d4e5f60718293a4b5c6d7e8f901a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d"
    }
  },
  "curl": {
    timestamp: new Date().toISOString(),
    adversaryScenario: "SOCKS5 Heap Buffer Overflow (CVE-2023-38545)",
    cveId: "CVE-2023-38545",
    cvss: 9.8,
    threatSummary: "Flaw in SOCKS5 proxy handshake copies long hostnames into fixed-size heap buffer, resulting in heap corruption and potential code execution.",
    affectedPackage: {
      name: "curl",
      installedVersion: "8.4.0",
      storePath: "/nix/store/2m11c9x81v4a73b90-curl-8.4.0",
      status: "TAINTED_QUARANTINED"
    },
    remediationPlan: {
      strategy: "UPGRADE_TO_PATCHED_RELEASE",
      selectedCandidate: {
        version: "8.5.0",
        releaseType: "UPSTREAM_PATCH",
        cveCount: 0,
        abiCompatible: true,
        score: 99.5,
        status: "SELECTED",
        storePath: "/nix/store/8c91a0b3e721v492m-curl-8.5.0",
        sha256: "f0e1d2c3b4a5968778695a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d"
      },
      candidateMatrix: [
        {
          version: "8.4.0",
          releaseType: "REJECTED_TAINTED",
          cveCount: 1,
          abiCompatible: true,
          score: 0.0,
          status: "REJECTED",
          rejectionReason: "Active Disclosure: SOCKS5 heap overflow (CVE-2023-38545, CVSS 9.8)",
          storePath: "/nix/store/2m11c9x81v4a73b90-curl-8.4.0",
          sha256: "1a2b3c4d5e6f708192a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5"
        },
        {
          version: "8.5.0",
          releaseType: "UPSTREAM_PATCH",
          cveCount: 0,
          abiCompatible: true,
          score: 99.5,
          status: "SELECTED",
          storePath: "/nix/store/8c91a0b3e721v492m-curl-8.5.0",
          sha256: "f0e1d2c3b4a5968778695a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d"
        },
        {
          version: "8.3.0",
          releaseType: "HISTORICAL_STABLE_FALLBACK",
          cveCount: 0,
          abiCompatible: true,
          score: 89.2,
          status: "STANDBY",
          rejectionReason: "Standby backup: Upstream official clean patch 8.5.0 is available",
          storePath: "/nix/store/5k291m0b7a84v193c-curl-8.3.0",
          sha256: "3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c"
        }
      ],
      abiVerification: {
        soname: "libcurl.so.4",
        symbolEquivalenceRatio: 1.0,
        missingSymbols: [],
        sonameMatch: true,
        verdict: "STRICT_ABI_COMPATIBLE"
      },
      executionTimeline: [
        { stage: "Vantage Ingestion & Taint Flagging", durationMs: 3.5, detail: "Ingested CVE-2023-38545. Quarantined libcurl.so.4. Revoked world-executable permissions." },
        { stage: "Constraint Solver Search", durationMs: 9.8, detail: "Evaluated 3 candidates. Identified 8.5.0 as zero-CVE upgrade." },
        { stage: "ELF & Shared Library ABI Check", durationMs: 5.2, detail: "Verified libcurl.so.4 soname compatibility across 38 consumer packages (git, docker, cargo)." },
        { stage: "Atomic Generation Re-Link", durationMs: 7.9, detail: "Swapped profile symlinks in 7.9ms. System generation incremented." },
        { stage: "Process Verification & Attestation", durationMs: 4.8, detail: "Spawned sentinel smoke tests for curl client. Emitted OpenVEX attestation." }
      ],
      totalRemediationMs: 31.2,
      atomicRollbackSlaMs: 50,
      openVexAttestationSha: "sha256:b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3"
    }
  }
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pkg = searchParams.get("package") || "xz-utils";

  const data = KNOWLEDGE_BASE[pkg.toLowerCase()] || KNOWLEDGE_BASE["xz-utils"];

  return NextResponse.json({
    success: true,
    availablePackages: Object.keys(KNOWLEDGE_BASE),
    data
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pkg = (body.package || "xz-utils").toLowerCase();
    const data = KNOWLEDGE_BASE[pkg] || KNOWLEDGE_BASE["xz-utils"];

    return NextResponse.json({
      success: true,
      message: `Autonomous self-healing solver simulation completed for ${pkg}.`,
      data
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON payload" },
      { status: 400 }
    );
  }
}
