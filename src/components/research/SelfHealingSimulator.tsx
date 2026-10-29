"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  ShieldCheck, 
  AlertTriangle, 
  Play, 
  RotateCcw, 
  Activity, 
  CheckCircle2, 
  Terminal, 
  Layers, 
  Cpu, 
  Server, 
  Sparkles, 
  Lock, 
  ArrowRight, 
  RefreshCw,
  GitBranch,
  FileCheck,
  Check,
  Zap
} from "lucide-react";

export interface PackageScenario {
  id: string;
  name: string;
  vulnVersion: string;
  cleanVersion: string;
  cve: string;
  cvss: number;
  severity: "CRITICAL" | "HIGH";
  scenarioTitle: string;
  threatDescription: string;
  solverStrategy: "DOWNGRADE_TO_HISTORICAL_STABLE" | "UPGRADE_TO_PATCHED_RELEASE";
  abiTarget: string;
  totalTimeMs: number;
  candidates: {
    version: string;
    type: string;
    cves: number;
    abi: boolean;
    score: number;
    status: "SELECTED" | "REJECTED" | "STANDBY";
    note: string;
  }[];
  timeline: {
    step: string;
    title: string;
    durationMs: number;
    log: string;
  }[];
  attestationSha: string;
}

export const HEALING_SCENARIOS: PackageScenario[] = [
  {
    id: "xz-utils",
    name: "xz-utils",
    vulnVersion: "5.6.1",
    cleanVersion: "5.4.6",
    cve: "CVE-2024-3094",
    cvss: 10.0,
    severity: "CRITICAL",
    scenarioTitle: "Upstream Supply Chain Backdoor in liblzma",
    threatDescription: "Malicious IFUNC resolver injection in upstream build scripts hijacks RSA_public_decrypt, granting unauthenticated pre-auth root RCE over SSH.",
    solverStrategy: "DOWNGRADE_TO_HISTORICAL_STABLE",
    abiTarget: "liblzma.so.5",
    totalTimeMs: 38.4,
    candidates: [
      {
        version: "5.6.1",
        type: "Active Installed",
        cves: 1,
        abi: true,
        score: 0.0,
        status: "REJECTED",
        note: "TAINTED: Active CVE-2024-3094 payload detected"
      },
      {
        version: "5.6.0",
        type: "Adjacent Upstream",
        cves: 1,
        abi: true,
        score: 0.0,
        status: "REJECTED",
        note: "TAINTED: Contains proto-backdoor artifacts"
      },
      {
        version: "5.4.6",
        type: "Historical Clean Stable",
        cves: 0,
        abi: true,
        score: 98.4,
        status: "SELECTED",
        note: "ZERO-CVE: 100% ABI compliant, clean provenance"
      }
    ],
    timeline: [
      {
        step: "TAINT",
        title: "1. Zero-Day Ingestion & Immediate Taint",
        durationMs: 4.2,
        log: "[VANTAGE] Ingested CVE-2024-3094 (CVSS 10.0). Flagged store path /nix/store/7x91...-xz-5.6.1 as TAINTED. Stripped world-execute bits (chmod 0000)."
      },
      {
        step: "SOLVE",
        title: "2. Next-Best Non-Vulnerable Candidate Solver",
        durationMs: 12.8,
        log: "[SOLVER] Constraint query: name=xz-utils cve_count=0 abi_compatible=true. Rejected 5.6.0 (infected). Selected historical stable 5.4.6 (Score: 98.4)."
      },
      {
        step: "ABI_CHECK",
        title: "3. ELF Soname & Symbol Table Verification",
        durationMs: 6.1,
        log: "[ABI_AUDIT] Verifying liblzma.so.5 across 14 dependent packages (sshd, systemd, dpkg). Symbol equivalence ratio: 100%. Missing symbols: 0. VERDICT: PASS."
      },
      {
        step: "ATOMIC_SWITCH",
        title: "4. Atomic Nix Generation Activation",
        durationMs: 8.4,
        log: "[NIX] Realized profile generation 843 -> /nix/store/1h39...-xz-5.4.6. Swapped /nix/var/nix/profiles/system symlink in 8.4ms. Zero filesystem collisions."
      },
      {
        step: "HANDOVER",
        title: "5. Zero-Socket Daemon Handover & OpenVEX Sign",
        durationMs: 6.9,
        log: "[KINETIC] Reloaded dependent daemons with SCM_RIGHTS socket preservation. Generated SLSA L3 OpenVEX attestation: sha256:9f8e7d... System 100% HEALTHY."
      }
    ],
    attestationSha: "sha256:9f8e7d6c5b4a3120192837465abecdf1234567890abcdef1234567890abcdef1"
  },
  {
    id: "openssh",
    name: "openssh-server",
    vulnVersion: "9.6p1",
    cleanVersion: "9.8p1",
    cve: "CVE-2024-6387",
    cvss: 8.1,
    severity: "HIGH",
    scenarioTitle: "RegreSSHion Pre-Auth Signal Race Condition",
    threatDescription: "Signal handler race condition in sshd on glibc-based Linux allows unauthenticated remote attackers to trigger heap corruption and execute arbitrary code as root.",
    solverStrategy: "UPGRADE_TO_PATCHED_RELEASE",
    abiTarget: "sshd (OpenSSH Protocol 2.0)",
    totalTimeMs: 34.1,
    candidates: [
      {
        version: "9.6p1",
        type: "Active Installed",
        cves: 1,
        abi: true,
        score: 0.0,
        status: "REJECTED",
        note: "TAINTED: Active CVE-2024-6387 signal race flaw"
      },
      {
        version: "9.8p1",
        type: "Official Upstream Patch",
        cves: 0,
        abi: true,
        score: 99.2,
        status: "SELECTED",
        note: "ZERO-CVE: Official upstream mitigation, 100% compatible"
      },
      {
        version: "9.5p1",
        type: "Historical Clean Stable",
        cves: 0,
        abi: true,
        score: 91.0,
        status: "STANDBY",
        note: "STANDBY: Kept in reserve if 9.8p1 compilation fails"
      }
    ],
    timeline: [
      {
        step: "TAINT",
        title: "1. Zero-Day Ingestion & eBPF Rate Limit",
        durationMs: 3.8,
        log: "[VANTAGE] Ingested CVE-2024-6387 (CVSS 8.1). Activated eBPF SIGALRM ingress filter on sshd listening port 22. Marked 9.6p1 TAINTED."
      },
      {
        step: "SOLVE",
        title: "2. Next-Best Candidate Search in Binary Cache",
        durationMs: 10.4,
        log: "[SOLVER] Located verified build for openssh-9.8p1 in Exultia Sovereign Binary Cache. 0 open CVEs. Verified Cosign cryptographic signature."
      },
      {
        step: "ABI_CHECK",
        title: "3. SSH Protocol & PAM Configuration Check",
        durationMs: 5.9,
        log: "[CONFIG] Validated /etc/ssh/sshd_config against 9.8p1 parser. PAM authentication modules and host keys verified. Zero schema warnings."
      },
      {
        step: "ATOMIC_SWITCH",
        title: "4. Profile Generation Switch",
        durationMs: 7.2,
        log: "[NIX] Activated system generation 844. Relinked sshd target in /run/current-system/sw/bin in 7.2ms."
      },
      {
        step: "HANDOVER",
        title: "5. Kinetic Live Socket Handover (0 Drop)",
        durationMs: 6.8,
        log: "[KINETIC] Executed seamless socket handover via SCM_RIGHTS. 14 active developer SSH sessions preserved with 0 disconnects. Attestation signed."
      }
    ],
    attestationSha: "sha256:a1b2c3d4e5f60718293a4b5c6d7e8f901a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d"
  },
  {
    id: "curl",
    name: "curl & libcurl",
    vulnVersion: "8.4.0",
    cleanVersion: "8.5.0",
    cve: "CVE-2023-38545",
    cvss: 9.8,
    severity: "CRITICAL",
    scenarioTitle: "SOCKS5 Proxy Hostname Heap Buffer Overflow",
    threatDescription: "Buffer overflow vulnerability in SOCKS5 proxy handshake enables remote code execution during long hostname resolution under client requests.",
    solverStrategy: "UPGRADE_TO_PATCHED_RELEASE",
    abiTarget: "libcurl.so.4",
    totalTimeMs: 31.2,
    candidates: [
      {
        version: "8.4.0",
        type: "Active Installed",
        cves: 1,
        abi: true,
        score: 0.0,
        status: "REJECTED",
        note: "TAINTED: Critical heap buffer overflow vulnerability"
      },
      {
        version: "8.5.0",
        type: "Official Upstream Patch",
        cves: 0,
        abi: true,
        score: 99.5,
        status: "SELECTED",
        note: "ZERO-CVE: Verified patch release with strict ABI compatibility"
      },
      {
        version: "8.3.0",
        type: "Historical Clean Stable",
        cves: 0,
        abi: true,
        score: 89.2,
        status: "STANDBY",
        note: "STANDBY: Safe fallback if upstream upgrade fails"
      }
    ],
    timeline: [
      {
        step: "TAINT",
        title: "1. Zero-Day Ingestion & Library Tainting",
        durationMs: 3.5,
        log: "[VANTAGE] Ingested CVE-2023-38545 (CVSS 9.8). Tainted /nix/store/2m11...-curl-8.4.0. Quarantined dynamic library libcurl.so.4."
      },
      {
        step: "SOLVE",
        title: "2. Next-Best Solver Formulation",
        durationMs: 9.8,
        log: "[SOLVER] Queried Sovereign Cache. Selected 8.5.0 as prime candidate (0 CVEs, deterministic build hash match)."
      },
      {
        step: "ABI_CHECK",
        title: "3. Shared Library ABI & Consumer Tree Audit",
        durationMs: 5.2,
        log: "[ABI_AUDIT] Evaluated libcurl.so.4 soname compatibility across 38 consumer utilities (git, cargo, docker). 100% symbol match confirmed."
      },
      {
        step: "ATOMIC_SWITCH",
        title: "4. Atomic Profile Symlink Switch",
        durationMs: 7.9,
        log: "[NIX] Swapped store path symlinks in 7.9ms. System generation 845 live."
      },
      {
        step: "HANDOVER",
        title: "5. Smoke Testing & Compliance Attestation",
        durationMs: 4.8,
        log: "[SENTINEL] Ran automated integration curl test suite. Confirmed 0 memory leaks, 0 crashes. OpenVEX attestation signed."
      }
    ],
    attestationSha: "sha256:b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3"
  }
];

export default function SelfHealingSimulator() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("xz-utils");
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const consoleBottomRef = useRef<HTMLDivElement>(null);

  const scenario = HEALING_SCENARIOS.find(s => s.id === selectedScenarioId) || HEALING_SCENARIOS[0];

  // Auto-scroll console
  useEffect(() => {
    if (consoleBottomRef.current) {
      consoleBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [consoleLogs]);

  // Reset when scenario changes
  const handleSelectScenario = (id: string) => {
    setSelectedScenarioId(id);
    setCurrentStepIndex(-1);
    setIsRunning(false);
    setIsCompleted(false);
    setConsoleLogs([
      `[SYSTEM] Exultia Sentinel resident surveillance active.`,
      `[MONITOR] Inspecting active system generation. Watching for zero-day disclosures...`
    ]);
  };

  // Run the simulation sequence
  const startSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setIsCompleted(false);
    setCurrentStepIndex(0);
    setConsoleLogs([
      `[ALERT] Zero-Day vulnerability disclosure published: ${scenario.cve} (${scenario.severity} CVSS ${scenario.cvss})!`,
      `[ALERT] Affected active component: ${scenario.name} v${scenario.vulnVersion}`,
      `>>> INITIATING AUTONOMOUS SELF-HEALING RE-SYNTHESIS...`
    ]);

    let step = 0;
    const runStep = () => {
      if (step < scenario.timeline.length) {
        const item = scenario.timeline[step];
        setCurrentStepIndex(step);
        setConsoleLogs(prev => [...prev, item.log]);
        step++;
        setTimeout(runStep, 1100);
      } else {
        setIsRunning(false);
        setIsCompleted(true);
        setConsoleLogs(prev => [
          ...prev,
          `=============================================================`,
          `✔ AUTONOMOUS RE-SYNTHESIS COMPLETE: ${scenario.totalTimeMs}ms total latency.`,
          `✔ Evicted: ${scenario.name} ${scenario.vulnVersion} (TAINTED / QUARANTINED)`,
          `✔ Active Replacement: ${scenario.name} ${scenario.cleanVersion} (0 CVEs, ABI VERIFIED)`,
          `✔ Active TCP / Process Connections: 0 DROPPED SOCKETS`,
          `✔ Attestation Proof: ${scenario.attestationSha.slice(0, 32)}...`,
          `=============================================================`
        ]);
      }
    };

    setTimeout(runStep, 700);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setCurrentStepIndex(-1);
    setConsoleLogs([
      `[SYSTEM] State reverted. Ready to simulate zero-day disclosure.`
    ]);
  };

  return (
    <div style={{
      background: "linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 30, 0.98) 100%)",
      borderRadius: "24px",
      border: "1px solid rgba(6, 182, 212, 0.3)",
      boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(6, 182, 212, 0.15)",
      padding: "2.25rem",
      color: "#FFFFFF",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Glow backdrop accent */}
      <div style={{
        position: "absolute",
        top: "-120px",
        right: "-100px",
        width: "350px",
        height: "350px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      {/* Header bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "4px 12px", borderRadius: "9999px", fontSize: "0.78rem", fontWeight: 700, color: "#34D399", marginBottom: "0.75rem", letterSpacing: "0.04em" }}>
            <Sparkles size={13} /> AUTONOMOUS RESILIENT DAEMON RUNTIME
          </div>
          <h2 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "1.85rem", fontWeight: 800, margin: 0, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
            Autonomous Vulnerability Self-Correction
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "0.95rem", margin: "0.4rem 0 0 0", maxWidth: "720px", lineHeight: 1.6 }}>
            When a zero-day disclosure strikes an installed package, the Exultia daemon does not wait for manual intervention. The resident daemon immediately revokes execution permissions, resolves the <strong style={{ color: "#38BDF8" }}>Next-Best Safe Version</strong> (patched release or clean historical stable), verifies strict ABI compatibility, and atomically mutates memory in <strong style={{ color: "#34D399" }}>&lt;50ms with 0 dropped sockets</strong>.
          </p>
        </div>

        {/* Live Status Pill */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: isRunning ? "rgba(245, 158, 11, 0.15)" : isCompleted ? "rgba(16, 185, 129, 0.15)" : "rgba(6, 182, 212, 0.12)",
            border: isRunning ? "1px solid rgba(245, 158, 11, 0.4)" : isCompleted ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(6, 182, 212, 0.3)",
            padding: "6px 14px",
            borderRadius: "10px",
            fontSize: "0.82rem",
            fontWeight: 700,
            color: isRunning ? "#FBBF24" : isCompleted ? "#34D399" : "#22D3EE"
          }}>
            <span style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: isRunning ? "#FBBF24" : isCompleted ? "#34D399" : "#22D3EE",
              boxShadow: isRunning ? "0 0 8px #FBBF24" : isCompleted ? "0 0 8px #34D399" : "0 0 8px #22D3EE",
              animation: isRunning ? "pulse 1.5s infinite" : "none"
            }} />
            {isRunning ? "SELF-HEALING SOLVER ACTIVE" : isCompleted ? "SYSTEM RE-SYNTHESIZED (0 CVEs)" : "SENTINEL WATCHING"}
          </div>
          <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Deterministic Atomic Rollback Ready</span>
        </div>
      </div>

      {/* Scenario Selector Buttons */}
      <div style={{ marginBottom: "1.75rem" }}>
        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "0.75rem" }}>
          Select Zero-Day Disclosure Adversary Scenario:
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          {HEALING_SCENARIOS.map(s => {
            const isSelected = s.id === selectedScenarioId;
            return (
              <button
                key={s.id}
                onClick={() => handleSelectScenario(s.id)}
                disabled={isRunning}
                style={{
                  textAlign: "left",
                  padding: "1rem 1.25rem",
                  borderRadius: "14px",
                  background: isSelected 
                    ? "rgba(6, 182, 212, 0.12)" 
                    : "rgba(15, 23, 42, 0.6)",
                  border: isSelected 
                    ? "1px solid rgba(6, 182, 212, 0.5)" 
                    : "1px solid rgba(255, 255, 255, 0.07)",
                  cursor: isRunning ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 800, fontSize: "0.95rem", color: isSelected ? "#38BDF8" : "#E2E8F0" }}>
                    {s.name}
                  </span>
                  <span style={{ 
                    fontSize: "0.72rem", 
                    fontWeight: 800, 
                    padding: "2px 8px", 
                    borderRadius: "6px",
                    background: s.severity === "CRITICAL" ? "rgba(239, 68, 68, 0.2)" : "rgba(245, 158, 11, 0.2)",
                    color: s.severity === "CRITICAL" ? "#F87171" : "#FBBF24",
                    border: s.severity === "CRITICAL" ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid rgba(245, 158, 11, 0.4)"
                  }}>
                    {s.cve} (CVSS {s.cvss})
                  </span>
                </div>
                <span style={{ fontSize: "0.82rem", color: "#94A3B8", lineHeight: 1.4 }}>
                  {s.scenarioTitle}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px", fontSize: "0.75rem", color: "#64748B" }}>
                  <span>Active: <span style={{ color: "#F87171", textDecoration: "line-through" }}>v{s.vulnVersion}</span></span>
                  <ArrowRight size={12} />
                  <span>Target: <span style={{ color: "#34D399", fontWeight: 700 }}>v{s.cleanVersion}</span></span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Simulation Viewport (Grid: Left Pipeline, Right Solver & Terminal) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.75rem", marginBottom: "1.75rem" }}>
        
        {/* Left: The 5-Stage Live Self-Healing Pipeline */}
        <div style={{
          background: "rgba(10, 15, 30, 0.7)",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "0.75rem" }}>
            <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "#E2E8F0", textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "8px" }}>
              <Activity size={16} color="#22D3EE" /> Pipeline Execution Stages
            </span>
            <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
              Latency Target: <strong style={{ color: "#34D399" }}>{scenario.totalTimeMs}ms</strong>
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {scenario.timeline.map((item, idx) => {
              const isPast = idx < currentStepIndex || isCompleted;
              const isCurrent = idx === currentStepIndex && isRunning;
              return (
                <div
                  key={item.step}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    background: isCurrent 
                      ? "rgba(6, 182, 212, 0.15)" 
                      : isPast 
                        ? "rgba(16, 185, 129, 0.08)" 
                        : "rgba(255, 255, 255, 0.02)",
                    border: isCurrent 
                      ? "1px solid rgba(6, 182, 212, 0.4)" 
                      : isPast 
                        ? "1px solid rgba(16, 185, 129, 0.25)" 
                        : "1px solid rgba(255, 255, 255, 0.04)",
                    transition: "all 0.3s ease"
                  }}
                >
                  <div style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    background: isPast 
                      ? "rgba(16, 185, 129, 0.25)" 
                      : isCurrent 
                        ? "rgba(6, 182, 212, 0.3)" 
                        : "rgba(255, 255, 255, 0.08)",
                    color: isPast ? "#34D399" : isCurrent ? "#22D3EE" : "#64748B",
                    flexShrink: 0,
                    marginTop: "2px"
                  }}>
                    {isPast ? <Check size={14} /> : idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ 
                        fontSize: "0.85rem", 
                        fontWeight: 700, 
                        color: isPast ? "#34D399" : isCurrent ? "#22D3EE" : "#94A3B8" 
                      }}>
                        {item.title}
                      </span>
                      <span style={{ fontSize: "0.72rem", color: "#64748B" }}>
                        {item.durationMs}ms
                      </span>
                    </div>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.78rem", color: "#64748B", lineHeight: 1.4 }}>
                      {idx === 0 && "Revokes execution permissions (chmod 0000) & detaches process from PATH."}
                      {idx === 1 && "Formulates multi-objective constraint: zero CVEs + valid hash provenance."}
                      {idx === 2 && `Validates ${scenario.abiTarget} symbols; confirms 0 broken dynamically linked consumers.`}
                      {idx === 3 && "Cryptographic profile swap updates system symlink in single atomic syscall."}
                      {idx === 4 && "Socket descriptor passing (SCM_RIGHTS) keeps active client streams alive."}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action triggers */}
          <div style={{ display: "flex", gap: "10px", marginTop: "0.5rem" }}>
            <button
              onClick={startSimulation}
              disabled={isRunning || isCompleted}
              style={{
                flex: 1,
                padding: "12px 18px",
                borderRadius: "10px",
                background: isCompleted 
                  ? "rgba(16, 185, 129, 0.2)" 
                  : "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)",
                border: isCompleted ? "1px solid rgba(16, 185, 129, 0.4)" : "none",
                color: "#FFFFFF",
                fontWeight: 800,
                fontSize: "0.88rem",
                cursor: isRunning || isCompleted ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: isCompleted ? "none" : "0 4px 20px rgba(6, 182, 212, 0.35)",
                transition: "all 0.2s ease"
              }}
            >
              {isRunning ? (
                <>
                  <RefreshCw size={16} className="spin" /> Solving & Replacing...
                </>
              ) : isCompleted ? (
                <>
                  <CheckCircle2 size={16} color="#34D399" /> System Successfully Re-Synthesized
                </>
              ) : (
                <>
                  <Play size={16} fill="white" /> Simulate Zero-Day Disclosure ({scenario.cve})
                </>
              )}
            </button>

            <button
              onClick={resetSimulation}
              disabled={isRunning || (!isCompleted && currentStepIndex === -1)}
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#94A3B8",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: isRunning ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
              title="Reset State"
            >
              <RotateCcw size={15} /> Reset
            </button>
          </div>
        </div>

        {/* Right: Candidate Evaluation Matrix & Live Telemetry Console */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          {/* Candidate Solver Matrix */}
          <div style={{
            background: "rgba(10, 15, 30, 0.7)",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            padding: "1.25rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <span style={{ fontWeight: 800, fontSize: "0.82rem", color: "#E2E8F0", textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "8px" }}>
                <GitBranch size={15} color="#38BDF8" /> Next-Best Candidate Scoring Matrix
              </span>
              <span style={{ fontSize: "0.72rem", color: "#64748B" }}>Multi-Objective Constraint Solver</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {scenario.candidates.map(c => {
                const isSelected = isCompleted && c.status === "SELECTED";
                const isTainted = c.status === "REJECTED";
                return (
                  <div
                    key={c.version}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      background: isSelected 
                        ? "rgba(16, 185, 129, 0.12)" 
                        : isTainted && (isRunning || isCompleted)
                          ? "rgba(239, 68, 68, 0.08)"
                          : "rgba(255, 255, 255, 0.03)",
                      border: isSelected 
                        ? "1px solid rgba(16, 185, 129, 0.4)" 
                        : isTainted && (isRunning || isCompleted)
                          ? "1px solid rgba(239, 68, 68, 0.25)"
                          : "1px solid rgba(255, 255, 255, 0.05)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontWeight: 800, fontSize: "0.88rem", color: isSelected ? "#34D399" : isTainted ? "#F87171" : "#E2E8F0" }}>
                          v{c.version}
                        </span>
                        <span style={{ fontSize: "0.72rem", color: "#94A3B8" }}>({c.type})</span>
                      </div>
                      <span style={{ fontSize: "0.72rem", color: "#64748B" }}>{c.note}</span>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <span style={{ 
                        fontSize: "0.72rem", 
                        fontWeight: 800, 
                        padding: "2px 8px", 
                        borderRadius: "6px",
                        background: isSelected 
                          ? "rgba(16, 185, 129, 0.2)" 
                          : isTainted 
                            ? "rgba(239, 68, 68, 0.2)" 
                            : "rgba(245, 158, 11, 0.2)",
                        color: isSelected ? "#34D399" : isTainted ? "#F87171" : "#FBBF24"
                      }}>
                        {c.status} {c.score > 0 ? `(${c.score})` : ""}
                      </span>
                      <div style={{ fontSize: "0.7rem", color: "#64748B", marginTop: "2px" }}>
                        CVEs: {c.cves} &bull; ABI: {c.abi ? "OK" : "BREAK"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Telemetry Terminal */}
          <div style={{
            background: "#050914",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "1.25rem",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: "220px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", paddingBottom: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Terminal size={14} color="#38BDF8" />
                <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", color: "#94A3B8", fontWeight: 700 }}>
                  journalctl -u exultia-sentinel.service -f
                </span>
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#EF4444" }} />
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#F59E0B" }} />
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981" }} />
              </div>
            </div>

            <div style={{ 
              fontFamily: "var(--font-mono, monospace)", 
              fontSize: "0.76rem", 
              lineHeight: 1.6, 
              color: "#CBD5E1", 
              overflowY: "auto", 
              maxHeight: "180px",
              flex: 1
            }}>
              {consoleLogs.map((log, index) => {
                const isAlert = log.includes("[ALERT]");
                const isSuccess = log.includes("✔") || log.includes("100% HEALTHY");
                const isHeading = log.includes("===") || log.includes(">>>");
                return (
                  <div 
                    key={index}
                    style={{
                      color: isAlert ? "#F87171" : isSuccess ? "#34D399" : isHeading ? "#38BDF8" : "#94A3B8",
                      fontWeight: (isAlert || isSuccess || isHeading) ? 700 : 400
                    }}
                  >
                    {log}
                  </div>
                );
              })}
              <div ref={consoleBottomRef} />
            </div>
          </div>

        </div>

      </div>

      {/* Comparison Callout: Why Standard Linux Fails at Self-Healing */}
      <div style={{
        background: "rgba(15, 23, 42, 0.5)",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "1.5rem",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1.5rem"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#EF4444" }} />
            <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "#F87171" }}>
              Standard Linux Deployments
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: "0.82rem", color: "#94A3B8", lineHeight: 1.6 }}>
            Packages mutate files in-place (`/usr/bin`, `/usr/lib`). Upgrades while services are active risk library mismatch, half-unpacked states, and dropped socket connections. If a zero-day drops without an immediate vendor deb/rpm, the server remains vulnerable for days or weeks with no automated downgrade path.
          </p>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#34D399" }} />
            <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "#34D399" }}>
              Exultia Sovereign Linux + Pure Catalog
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: "0.82rem", color: "#94A3B8", lineHeight: 1.6 }}>
            Packages reside immutably across cryptographic package stores and read-only commit trees. The constraint solver dynamically shifts system profiles deterministically without file collisions. Kinetic passes live open file descriptors via `SCM_RIGHTS`, guaranteeing that incoming web traffic, SSH sessions, and database transactions continue uninterrupted.
          </p>
        </div>
      </div>

    </div>
  );
}
