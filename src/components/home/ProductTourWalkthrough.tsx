"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  VantageIcon, 
  PureIdeIcon, 
  PraxisIcon, 
  ErisIcon, 
  ValkyrieIcon,
  ExultiaLinuxIcon 
} from "@/components/BrandIcons";
import { 
  ArrowRight, 
  ArrowLeft, 
  Play, 
  Pause, 
  Check, 
  Copy, 
  RotateCcw, 
  ShieldCheck, 
  Terminal, 
  Layers, 
  ExternalLink, 
  Zap, 
  Cpu, 
  Radio, 
  ShieldAlert, 
  Code2, 
  Activity,
  CheckCircle2,
  Lock,
  ChevronRight
} from "lucide-react";

interface TourStage {
  id: string;
  orderNumber: string;
  shortName: string;
  productTitle: string;
  productBadge: string;
  subtitle: string;
  themeColor: string;
  accentGlow: string;
  bgGradient: string;
  icon: React.ReactNode;
  productHref: string;
  description: string;
  whyInOrder: string;
  pipeline: {
    input: string;
    engine: string;
    output: string;
    slaOrMetric: string;
  };
  telemetryLogs: {
    time: string;
    level: "INFO" | "WARN" | "CRIT" | "OK";
    message: string;
  }[];
  artifactView: {
    filename: string;
    language: string;
    code: string;
  };
  topologyFlow: string[];
}

const TOUR_STAGES: TourStage[] = [
  {
    id: "vantage",
    orderNumber: "01",
    shortName: "Threat Ingest",
    productTitle: "Vantage Intel",
    productBadge: "INTEL & TRIAGE",
    subtitle: "Universal Threat Monitoring & Vulnerability Ingestion",
    themeColor: "#C084FC",
    accentGlow: "rgba(192, 132, 252, 0.4)",
    bgGradient: "linear-gradient(180deg, rgba(28, 12, 45, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)",
    icon: <VantageIcon size={38} />,
    productHref: "/app/uvi",
    description: "Before defense can begin, the system must know what exists. Vantage continuously monitors 110+ upstream authoritative feeds, dark web disclosures, NIST NVD, and CISA KEV to identify newly disclosed vulnerabilities hours or days before public weaponization.",
    whyInOrder: "Every remediation cycle begins with intelligence. Without real-time ingest, engineers react blindly to exploits already underway in the wild.",
    pipeline: {
      input: "110+ global registries (CISA KEV, NIST NVD, Linux Errata, PHP, OpenSSL)",
      engine: "Algorithmic deduplication, CVSS 4.0 vector scoring & fleet inventory matching",
      output: "Cryptographic Vulnerability Manifest (.json) with impacted binary checksums",
      slaOrMetric: "Continuous synchronization (< 60s ingestion latency)"
    },
    telemetryLogs: [
      { time: "00:00.012", level: "INFO", message: "Synchronized with 114 authoritative advisory feeds (NVD, CISA KEV, Ubuntu USN)." },
      { time: "00:00.045", level: "WARN", message: "CRITICAL ADVISORY: CVE-2024-6387 (RegreSSHion OpenSSH race condition) parsed." },
      { time: "00:00.089", level: "INFO", message: "Querying fleet software inventory: 42 running instances of OpenSSH 9.2p1 detected." },
      { time: "00:00.120", level: "CRIT", message: "Attack vector: Pre-auth signal handler SIGALRM race. CVSS 9.8 Critical." },
      { time: "00:00.145", level: "OK",   message: "Manifest #EX-2024-6387 compiled & signed with Cosign. Forwarding to PureIDE Enclave." }
    ],
    artifactView: {
      filename: "manifest_cve_2024_6387.json",
      language: "json",
      code: `{
  "vulnerability_id": "CVE-2024-6387",
  "alias": "RegreSSHion",
  "severity": "CRITICAL",
  "cvss_v3_score": 9.8,
  "affected_packages": [
    {
      "name": "openssh-server",
      "vulnerable_versions": [">=8.5p1", "<9.8p1"],
      "impacted_fleet_nodes": 42
    }
  ],
  "exploitation_vector": "remote_unauthenticated_signal_handler_rce",
  "cosign_signature": "sha256:7f9b88a38c...d019f",
  "next_enclave_destination": "pureide://workspace/cve-2024-6387"
}`
    },
    topologyFlow: [
      "110+ Upstream Registries",
      "Vantage Normalizer",
      "Fleet Impact Matcher",
      "Signed Vulnerability Manifest"
    ]
  },
  {
    id: "pureide",
    orderNumber: "02",
    shortName: "Secure Authoring",
    productTitle: "PureIDE Enclave",
    productBadge: "AIR-GAPPED DEV",
    subtitle: "Zero-Telemetry Developer Workstation & Hotpatch Engineering",
    themeColor: "#60A5FA",
    accentGlow: "rgba(96, 165, 250, 0.4)",
    bgGradient: "linear-gradient(180deg, rgba(12, 25, 55, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)",
    icon: <PureIdeIcon size={38} />,
    productHref: "/products/pure-ide",
    description: "Once the vulnerability manifest arrives, security engineers and systems developers author or review the hotpatch inside PureIDE. Operating in complete air-gap mode with 100% egress telemetry blocked, sensitive zero-day research and proprietary code never leak to third-party cloud AI vendors.",
    whyInOrder: "Zero-day hotpatch engineering requires absolute secrecy. Standard developer tools silently phone home code snippets and crash dumps to telemetry servers.",
    pipeline: {
      input: "Signed Vulnerability Manifest + target binary ELF headers & debug symbols",
      engine: "Hermetic sandbox, local LLM copilot & in-memory compiler toolchain",
      output: "Compiled eBPF filter probe & C livepatch ELF delta (.kpatch)",
      slaOrMetric: "100% Egress blocked; zero telemetry packets permitted"
    },
    telemetryLogs: [
      { time: "00:00.010", level: "INFO", message: "PureIDE air-gap enclave initialized. Egress firewall: DENY_ALL outbound." },
      { time: "00:00.035", level: "INFO", message: "Imported manifest #EX-2024-6387 into isolated workspace." },
      { time: "00:00.070", level: "INFO", message: "Hermetic toolchain loaded: clang 18.1 with BPF target support." },
      { time: "00:00.110", level: "OK",   message: "Synthesizing sigalrm_guard.bpf.c hook to suppress asynchronous unsafe calls." },
      { time: "00:00.165", level: "OK",   message: "Hotpatch binary compilation complete: sha256:e3b0c44298fc1c149afbf4c8." }
    ],
    artifactView: {
      filename: "sigalrm_guard.bpf.c",
      language: "c",
      code: `// PureIDE Hermetic Hotpatch: CVE-2024-6387 Mitigation
#include <linux/bpf.h>
#include <bpf/bpf_helpers.h>

SEC("kprobe/sigdie")
int BPF_KPROBE(trace_sigdie, int sig) {
    if (sig == 14 /* SIGALRM */) {
        // Enforce async-signal-safe termination; abort unsafe syslog formatting
        bpf_printk("PUREIDE_GUARD: Intercepted unsafe SIGALRM in sshd handler\\n");
        return 0;
    }
    return 0;
}
char LICENSE[] SEC("license") = "Dual MIT/GPL";`
    },
    topologyFlow: [
      "Signed Vulnerability Manifest",
      "Air-Gapped PureIDE Enclave",
      "Hermetic Local Toolchain",
      "Compiled Hotpatch ELF / eBPF Bytecode"
    ]
  },
  {
    id: "eris-valkyrie",
    orderNumber: "03",
    shortName: "Canary Proving",
    productTitle: "Eris & Valkyrie",
    productBadge: "BREACH SIMULATION",
    subtitle: "Ephemeral Chaos Sandboxing & Safe Exploit Proof Validation",
    themeColor: "#EF4444",
    accentGlow: "rgba(239, 68, 68, 0.4)",
    bgGradient: "linear-gradient(180deg, rgba(45, 12, 15, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)",
    icon: (
      <div style={{ display: "flex", gap: "6px" }}>
        <ErisIcon size={34} glow={false} />
        <ValkyrieIcon size={34} glow={false} />
      </div>
    ),
    productHref: "/app/eris",
    description: "Never deploy an untested patch to production. Eris automatically spins up an isolated digital twin sandbox replicating the host environment. Valkyrie dispatches safe, non-destructive breach probes to confirm weaponizability before and after patch application with cryptographic HMAC proofs.",
    whyInOrder: "Hotpatching without verification risks breaking mission-critical services or applying a placebo fix. Eris & Valkyrie guarantee the exploit works, and the patch neutralizes it.",
    pipeline: {
      input: "Compiled hotpatch binary + digital twin microVM target environment",
      engine: "Eris 5-container isolated chaos range with 10-minute automated self-destruct watchdog",
      output: "Non-destructive HMAC-SHA256 Exploit Verification Certificate",
      slaOrMetric: "100% Non-destructive test isolation with automatic teardown"
    },
    telemetryLogs: [
      { time: "00:00.015", level: "INFO", message: "Eris: Instantiating digital twin microVM (Debian 12 + OpenSSH 9.2p1 replica)." },
      { time: "00:00.050", level: "WARN", message: "Valkyrie BAS: Launching non-destructive timing probe against twin port 2222." },
      { time: "00:00.095", level: "CRIT", message: "Valkyrie: Race condition verified! Heap manipulation window confirmed (1.42s)." },
      { time: "00:00.125", level: "INFO", message: "Applying candidate hotpatch to digital twin in-memory..." },
      { time: "00:00.155", level: "OK",   message: "Re-running Valkyrie attack probe: Exploitation payload NEUTRALIZED. Exploit failed." },
      { time: "00:00.180", level: "OK",   message: "HMAC Proof generated: PROOF-OK-9812. Approving cluster-wide rollout." }
    ],
    artifactView: {
      filename: "valkyrie_verification_proof.json",
      language: "json",
      code: `{
  "proof_id": "PROOF-VALKYRIE-2024-6387",
  "timestamp": "2026-10-25T18:35:00Z",
  "target_environment": "eris-microvm-replica-node-04",
  "pre_patch_exploitability": {
    "status": "VULNERABLE",
    "heap_leak_confirmed": true,
    "race_window_ms": 1420
  },
  "post_patch_exploitability": {
    "status": "IMMUNE",
    "race_window_ms": 0,
    "sigalrm_diverted": true
  },
  "integrity_verdict": "SAFE_FOR_FLEET_INJECTION",
  "hmac_sha256": "4a7d6e8f1c9902...bca1"
}`
    },
    topologyFlow: [
      "Compiled Hotpatch Binary",
      "Eris MicroVM Digital Twin",
      "Valkyrie Non-Destructive Probe",
      "Cryptographic Verification Proof"
    ]
  },
  {
    id: "praxis",
    orderNumber: "04",
    shortName: "Live Hotpatch",
    productTitle: "Praxis & Kinetic",
    productBadge: "RUNTIME REMEDIATION",
    subtitle: "Zero-Downtime In-Memory Injection & Progressive Canary Rollout",
    themeColor: "#F59E0B",
    accentGlow: "rgba(245, 158, 11, 0.4)",
    bgGradient: "linear-gradient(180deg, rgba(45, 30, 10, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)",
    icon: <PraxisIcon size={38} />,
    productHref: "/app/praxis",
    description: "With verification proven, the Praxis engine dispatches the payload to the resident Kinetic™ agent on each host. The patch is injected directly into process memory or kernel kprobes without dropping TCP sockets or restarting services, backed by an instant pre-image rollback guarantee.",
    whyInOrder: "This is where the actual defense execution happens. Because previous stages already verified safety, patch rollout is completely automated and fearless.",
    pipeline: {
      input: "Validated hotpatch binary + HMAC verification proof + rollout policy",
      engine: "Resident Kinetic™ daemon performing ptrace/eBPF runtime memory injection",
      output: "Remediated process memory, 0 socket drops & pre-flight memory snapshot",
      slaOrMetric: "<350ms host execution latency; <50ms atomic rollback SLA"
    },
    telemetryLogs: [
      { time: "00:00.005", level: "INFO", message: "Praxis: Initiating progressive rollout. Ring 0 (Canary 5%): 2 nodes." },
      { time: "00:00.040", level: "INFO", message: "Kinetic [Host node-prod-01]: Snapshotting PID 1024 memory state for rollback." },
      { time: "00:00.080", level: "INFO", message: "Kinetic: Attaching eBPF trampoline into sshd address space at 0x7fff92a4000." },
      { time: "00:00.142", level: "OK",   message: "Injection successful in 142ms. 18 active SSH sessions preserved (0 sockets dropped)." },
      { time: "00:00.220", level: "OK",   message: "Ring 0 telemetry stable. Broadening to Ring 1 (100% fleet: 42 nodes)." },
      { time: "00:00.345", level: "OK",   message: "Fleet-wide remediation complete. All nodes verified IMMUNE." }
    ],
    artifactView: {
      filename: "kinetic_injection_receipt.json",
      language: "json",
      code: `{
  "action": "KINETIC_IN_MEMORY_HOTPATCH",
  "target_pid": 1024,
  "binary": "/run/current-system/sw/bin/sshd",
  "injection_latency_ms": 142.4,
  "preserved_connections": 18,
  "dropped_sockets": 0,
  "pre_image_snapshot": {
    "hash": "sha256:88a10bcfe3...9192",
    "rollback_sla_ms": 50,
    "empirical_rollback_ms": 18.4
  },
  "status": "REMEDIATED_ACTIVE"
}`
    },
    topologyFlow: [
      "Verification Certificate",
      "Praxis Canary Dispatcher",
      "Kinetic Resident Agent",
      "Live Process Memory (0 Socket Drops)"
    ]
  },
  {
    id: "exultia-linux",
    orderNumber: "05",
    shortName: "Sovereign Host",
    productTitle: "Exultia Linux",
    productBadge: "FLAGSHIP OS",
    subtitle: "Declarative Immutable Host, Hardware Attestation & Audit Trail",
    themeColor: "#22D3EE",
    accentGlow: "rgba(34, 211, 238, 0.4)",
    bgGradient: "linear-gradient(180deg, rgba(8, 25, 45, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)",
    icon: <ExultiaLinuxIcon size={38} glow={true} />,
    productHref: "/products/exultia-linux",
    description: "The foundation that makes sub-second defense possible. Exultia Linux provides an immutable, content-addressed host filesystem (/nix/store mounted read-only) where running workloads are cryptographically anchored. Any unauthorized drift or tamper is immediately blocked at the kernel boundary.",
    whyInOrder: "Defense does not end when a patch injects. Exultia Linux locks the system into a provably secure, immutable state, generating SLSA L3 attestations that satisfy regulators and auditors.",
    pipeline: {
      input: "Patched runtime state + Nix generation delta + Cosign cryptographic root",
      engine: "Read-only content-addressed Nix store, TPM 2.0 measured boot & eBPF enforcement",
      output: "Permanent declarative system profile & immutable compliance audit log",
      slaOrMetric: "0 Open Trivy findings; 100% tamper-evident declarative generations"
    },
    telemetryLogs: [
      { time: "00:00.010", level: "INFO", message: "Exultia Linux Kernel: Validating immutable /nix/store content-addressed paths." },
      { time: "00:00.030", level: "INFO", message: "Cosign signature verified against hardware TPM 2.0 PCR-7 secure boot register." },
      { time: "00:00.075", level: "OK",   message: "Kinetic hotpatch anchored to generation profile /nix/var/nix/profiles/system-42." },
      { time: "00:00.110", level: "OK",   message: "Trivy full-host vulnerability scan: 0 CRITICAL, 0 HIGH, 0 MEDIUM findings." },
      { time: "00:00.130", level: "OK",   message: "Deterministic rollback checkpoint persisted. Sovereign defense cycle CLOSED." }
    ],
    artifactView: {
      filename: "configuration.nix",
      language: "nix",
      code: `# Exultia Linux Sovereign Node Configuration
{ config, pkgs, ... }:

{
  system.stateVersion = "24.05";
  nix.settings.experimental-features = [ "nix-command" "flakes" ];
  
  # Kinetic Resident Autonomous Hotpatching Daemon
  services.kinetic = {
    enable = true;
    enforcePreImageSnapshots = true;
    rollbackSlaMs = 50;
    allowedSigners = [ "cosign:exultia-sovereign-root.pub" ];
  };

  # Immutable Read-Only Store Enforcement
  fileSystems."/nix/store".options = [ "ro" "noexec" "nodev" ];
  security.tpm2.enable = true;
}`
    },
    topologyFlow: [
      "In-Memory Hotpatch State",
      "Immutable /nix/store Anchor",
      "Cosign SLSA Attestation",
      "Zero-Drift Sovereign Host"
    ]
  }
];

export default function ProductTourWalkthrough() {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"telemetry" | "artifact" | "topology">("telemetry");
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [logStepCount, setLogStepCount] = useState(TOUR_STAGES[0].telemetryLogs.length);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeStage = TOUR_STAGES[activeStageIndex];

  // Auto-play progression
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setActiveStageIndex((prev) => (prev + 1) % TOUR_STAGES.length);
      }, 7000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  // Reset copied feedback on stage change
  useEffect(() => {
    setCopied(false);
    setLogStepCount(TOUR_STAGES[activeStageIndex].telemetryLogs.length);
  }, [activeStageIndex]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeStage.artifactView.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNext = () => {
    setActiveStageIndex((prev) => (prev + 1) % TOUR_STAGES.length);
  };

  const handlePrev = () => {
    setActiveStageIndex((prev) => (prev - 1 + TOUR_STAGES.length) % TOUR_STAGES.length);
  };

  return (
    <div style={{
      background: "linear-gradient(180deg, rgba(6, 12, 20, 0.95) 0%, rgba(3, 6, 10, 0.98) 100%)",
      border: "1px solid rgba(0, 229, 255, 0.25)",
      borderRadius: "24px",
      padding: "2.5rem 2rem",
      boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5), inset 0 0 40px rgba(0, 229, 255, 0.03)",
      marginBottom: "5rem",
      position: "relative",
      overflow: "hidden"
    }}>
      
      {/* Background Ambience Glow */}
      <div style={{
        position: "absolute",
        top: "-120px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "600px",
        height: "300px",
        background: `radial-gradient(circle, ${activeStage.accentGlow} 0%, transparent 70%)`,
        opacity: 0.35,
        filter: "blur(60px)",
        pointerEvents: "none",
        transition: "background 0.5s ease"
      }} />

      {/* ── HEADER & INTRO ──────────────────────────────────────────────────────── */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem", position: "relative", zIndex: 1 }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(0, 229, 255, 0.08)",
          border: "1px solid rgba(0, 229, 255, 0.3)",
          padding: "4px 14px",
          borderRadius: "20px",
          marginBottom: "0.85rem",
          fontSize: "0.75rem",
          fontFamily: "var(--font-mono, monospace)",
          color: "#67E8F9",
          letterSpacing: "0.08em",
          textTransform: "uppercase"
        }}>
          <Radio size={13} className="pulse" />
          <span>Interactive Guided Tour</span>
        </div>

        <h2 style={{
          fontFamily: "var(--font-display, 'Orbitron', sans-serif)",
          fontSize: "clamp(1.8rem, 3.2vw, 2.5rem)",
          fontWeight: 800,
          color: "#FFFFFF",
          margin: "0 0 0.75rem 0",
          lineHeight: 1.2
        }}>
          How The Sovereign Defense Stack Is Applied
        </h2>
        <p style={{ color: "#94A3B8", fontSize: "1.02rem", maxWidth: "760px", margin: "0 auto", lineHeight: 1.6 }}>
          Step through the exact chronological lifecycle — from global zero-day intelligence ingestion to air-gapped authoring, canary emulation, sub-second hotpatching, and immutable OS root of trust.
        </p>
      </div>

      {/* ── 5-STEP TIMELINE NAVIGATOR ───────────────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "0.75rem",
        marginBottom: "2rem",
        position: "relative",
        zIndex: 1
      }}>
        {TOUR_STAGES.map((stage, idx) => {
          const isActive = idx === activeStageIndex;
          const isPassed = idx < activeStageIndex;

          return (
            <button
              key={stage.id}
              onClick={() => {
                setActiveStageIndex(idx);
                setIsPlaying(false);
              }}
              style={{
                background: isActive 
                  ? "rgba(15, 23, 42, 0.9)" 
                  : isPassed 
                    ? "rgba(15, 23, 42, 0.4)" 
                    : "rgba(10, 15, 25, 0.3)",
                border: isActive 
                  ? `1px solid ${stage.themeColor}` 
                  : isPassed 
                    ? "1px solid rgba(255, 255, 255, 0.15)" 
                    : "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: "14px",
                padding: "1rem 0.85rem",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.25s ease",
                boxShadow: isActive ? `0 0 20px ${stage.accentGlow}` : "none",
                display: "flex",
                flexDirection: "column",
                gap: "6px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  color: isActive ? stage.themeColor : isPassed ? "#34D399" : "#64748B"
                }}>
                  STAGE {stage.orderNumber}
                </span>
                {isPassed ? (
                  <CheckCircle2 size={13} color="#34D399" />
                ) : (
                  <span style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: isActive ? stage.themeColor : "rgba(255, 255, 255, 0.2)"
                  }} />
                )}
              </div>

              <div style={{
                fontFamily: "var(--font-display, 'Orbitron', sans-serif)",
                fontSize: "0.92rem",
                fontWeight: 700,
                color: isActive ? "#FFFFFF" : "#94A3B8"
              }}>
                {stage.productTitle.split(" ")[0]}
              </div>

              <div style={{
                fontSize: "0.72rem",
                color: isActive ? stage.themeColor : "#64748B",
                fontFamily: "var(--font-mono, monospace)",
                fontWeight: 600
              }}>
                {stage.shortName}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── CONTROLS & AUTO-PLAY BAR ────────────────────────────────────────────── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
        marginBottom: "2rem",
        padding: "0.6rem 1rem",
        background: "rgba(10, 15, 26, 0.6)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "12px",
        position: "relative",
        zIndex: 1
      }}>
        {/* Progress Bar & Stage Indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: "260px" }}>
          <div style={{
            fontSize: "0.82rem",
            fontFamily: "var(--font-mono, monospace)",
            color: "#94A3B8",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}>
            <span style={{ color: activeStage.themeColor, fontWeight: 800 }}>
              Stage {activeStageIndex + 1} of {TOUR_STAGES.length}
            </span>
            <span>&bull;</span>
            <span style={{ color: "#E2E8F0" }}>{activeStage.subtitle}</span>
          </div>
          
          <div style={{
            flex: 1,
            height: "4px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "2px",
            overflow: "hidden",
            maxWidth: "180px"
          }}>
            <div style={{
              height: "100%",
              width: `${((activeStageIndex + 1) / TOUR_STAGES.length) * 100}%`,
              background: activeStage.themeColor,
              boxShadow: `0 0 10px ${activeStage.themeColor}`,
              transition: "width 0.3s ease"
            }} />
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              background: isPlaying ? "rgba(0, 229, 255, 0.2)" : "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: isPlaying ? "#67E8F9" : "#94A3B8",
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "0.78rem",
              fontFamily: "var(--font-mono, monospace)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            <span>{isPlaying ? "Pause Auto-Tour" : "Auto-Advance"}</span>
          </button>

          <button
            onClick={handlePrev}
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#FFFFFF",
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "0.8rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <ArrowLeft size={14} />
            <span>Prev</span>
          </button>

          <button
            onClick={handleNext}
            style={{
              background: `linear-gradient(135deg, ${activeStage.themeColor} 0%, #3B82F6 100%)`,
              border: "none",
              color: "#030608",
              fontWeight: 800,
              padding: "6px 14px",
              borderRadius: "8px",
              fontSize: "0.8rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              boxShadow: `0 0 15px ${activeStage.accentGlow}`
            }}
          >
            <span>Next Stage</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ── STAGE CONTENT PRESENTATION (2-COLUMN ARCHITECTURE DECK) ─────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
        gap: "2rem",
        position: "relative",
        zIndex: 1
      }}>
        
        {/* LEFT COLUMN: THE NARRATIVE & LIFECYCLE ORDER */}
        <div style={{
          background: "rgba(10, 15, 26, 0.7)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "18px",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <div>
            {/* Stage Tag */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {activeStage.icon}
                <div>
                  <span style={{
                    fontSize: "0.68rem",
                    fontFamily: "var(--font-mono, monospace)",
                    color: activeStage.themeColor,
                    background: "rgba(255, 255, 255, 0.05)",
                    border: `1px solid ${activeStage.themeColor}40`,
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontWeight: 800,
                    textTransform: "uppercase"
                  }}>
                    {activeStage.productBadge}
                  </span>
                  <div style={{
                    fontSize: "0.74rem",
                    fontFamily: "var(--font-mono, monospace)",
                    color: "#94A3B8",
                    marginTop: "3px"
                  }}>
                    STEP {activeStage.orderNumber} IN DEFENSE LIFECYCLE
                  </div>
                </div>
              </div>
            </div>

            {/* Product Title */}
            <h3 style={{
              fontFamily: "var(--font-display, 'Orbitron', sans-serif)",
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#FFFFFF",
              margin: "0 0 0.5rem 0"
            }}>
              {activeStage.productTitle}
            </h3>

            {/* Subtitle */}
            <div style={{
              fontSize: "0.95rem",
              color: activeStage.themeColor,
              fontWeight: 700,
              fontFamily: "var(--font-mono, monospace)",
              marginBottom: "1.25rem"
            }}>
              {activeStage.subtitle}
            </div>

            {/* Story Description */}
            <p style={{ color: "#E2E8F0", fontSize: "0.95rem", lineHeight: 1.65, margin: "0 0 1.25rem 0" }}>
              {activeStage.description}
            </p>

            {/* Why This Comes In This Order */}
            <div style={{
              background: "rgba(255, 255, 255, 0.03)",
              borderLeft: `3px solid ${activeStage.themeColor}`,
              padding: "0.85rem 1rem",
              borderRadius: "0 8px 8px 0",
              marginBottom: "1.5rem"
            }}>
              <div style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono, monospace)", color: activeStage.themeColor, fontWeight: 800, textTransform: "uppercase", marginBottom: "4px" }}>
                Why Applied In This Order:
              </div>
              <div style={{ fontSize: "0.85rem", color: "#94A3B8", lineHeight: 1.5 }}>
                {activeStage.whyInOrder}
              </div>
            </div>

            {/* Pipeline Dataflow Matrix */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "0.5rem",
              background: "rgba(5, 10, 18, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "10px",
              padding: "1rem",
              fontSize: "0.82rem",
              fontFamily: "var(--font-mono, monospace)",
              marginBottom: "1.5rem"
            }}>
              <div>
                <span style={{ color: "#64748B", fontWeight: 700 }}>INPUT &rarr; </span>
                <span style={{ color: "#94A3B8" }}>{activeStage.pipeline.input}</span>
              </div>
              <div>
                <span style={{ color: "#64748B", fontWeight: 700 }}>ENGINE &rarr; </span>
                <span style={{ color: "#E2E8F0" }}>{activeStage.pipeline.engine}</span>
              </div>
              <div>
                <span style={{ color: activeStage.themeColor, fontWeight: 700 }}>OUTPUT &rarr; </span>
                <span style={{ color: "#E2F8FF" }}>{activeStage.pipeline.output}</span>
              </div>
              <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "0.5rem", marginTop: "0.25rem" }}>
                <span style={{ color: "#10B981", fontWeight: 700 }}>BENCHMARK &rarr; </span>
                <span style={{ color: "#34D399" }}>{activeStage.pipeline.slaOrMetric}</span>
              </div>
            </div>
          </div>

          {/* Action Link */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "1.25rem" }}>
            <Link
              href={activeStage.productHref}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: activeStage.themeColor,
                fontFamily: "var(--font-mono, monospace)",
                fontWeight: 800,
                fontSize: "0.85rem",
                textDecoration: "none"
              }}
            >
              <span>Explore {activeStage.productTitle} Specs</span>
              <ChevronRight size={16} />
            </Link>

            <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", color: "#64748B" }}>
              STAGE {activeStage.orderNumber} / 05
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: HIGH-TECH TELEMETRY & ARTIFACT TERMINAL */}
        <div style={{
          background: "rgba(5, 8, 14, 0.95)",
          border: `1px solid ${activeStage.themeColor}50`,
          borderRadius: "18px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: `0 0 30px ${activeStage.accentGlow}25`
        }}>
          
          {/* Terminal Titlebar */}
          <div style={{
            background: "rgba(10, 15, 26, 0.9)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            padding: "0.75rem 1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.5rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#EF4444", display: "inline-block" }} />
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#F59E0B", display: "inline-block" }} />
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10B981", display: "inline-block" }} />
              <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.78rem", color: "#94A3B8", marginLeft: "6px" }}>
                exultia://sovereign-bus/stage-{activeStage.orderNumber}
              </span>
            </div>

            {/* View Switcher Tabs */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <button
                onClick={() => setActiveTab("telemetry")}
                style={{
                  background: activeTab === "telemetry" ? "rgba(255, 255, 255, 0.12)" : "transparent",
                  border: "none",
                  color: activeTab === "telemetry" ? "#FFFFFF" : "#64748B",
                  padding: "4px 8px",
                  borderRadius: "5px",
                  fontSize: "0.72rem",
                  fontFamily: "var(--font-mono, monospace)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <Terminal size={12} />
                <span>Live Event Stream</span>
              </button>

              <button
                onClick={() => setActiveTab("artifact")}
                style={{
                  background: activeTab === "artifact" ? "rgba(255, 255, 255, 0.12)" : "transparent",
                  border: "none",
                  color: activeTab === "artifact" ? "#FFFFFF" : "#64748B",
                  padding: "4px 8px",
                  borderRadius: "5px",
                  fontSize: "0.72rem",
                  fontFamily: "var(--font-mono, monospace)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <Code2 size={12} />
                <span>Artifact Payload</span>
              </button>

              <button
                onClick={() => setActiveTab("topology")}
                style={{
                  background: activeTab === "topology" ? "rgba(255, 255, 255, 0.12)" : "transparent",
                  border: "none",
                  color: activeTab === "topology" ? "#FFFFFF" : "#64748B",
                  padding: "4px 8px",
                  borderRadius: "5px",
                  fontSize: "0.72rem",
                  fontFamily: "var(--font-mono, monospace)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <Layers size={12} />
                <span>Dataflow</span>
              </button>
            </div>
          </div>

          {/* Terminal Body */}
          <div style={{
            padding: "1.5rem",
            flex: 1,
            overflowY: "auto",
            minHeight: "340px",
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "0.82rem",
            lineHeight: 1.6
          }}>
            
            {/* VIEW 1: LIVE EVENT STREAM */}
            {activeTab === "telemetry" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ color: "#64748B", fontSize: "0.75rem", marginBottom: "0.5rem" }}>
                  // LIVE STAGE {activeStage.orderNumber} TELEMETRY STREAM &bull; AUTONOMOUS DEFENSE BUS
                </div>
                {activeStage.telemetryLogs.slice(0, logStepCount).map((log, lIdx) => {
                  let badgeColor = "#38BDF8";
                  let badgeBg = "rgba(56, 189, 248, 0.15)";

                  if (log.level === "CRIT") {
                    badgeColor = "#F87171";
                    badgeBg = "rgba(239, 68, 68, 0.2)";
                  } else if (log.level === "WARN") {
                    badgeColor = "#FBBF24";
                    badgeBg = "rgba(245, 158, 11, 0.2)";
                  } else if (log.level === "OK") {
                    badgeColor = "#34D399";
                    badgeBg = "rgba(16, 185, 129, 0.2)";
                  }

                  return (
                    <div key={lIdx} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <span style={{ color: "#475569", flexShrink: 0, fontSize: "0.75rem" }}>
                        [{log.time}]
                      </span>
                      <span style={{
                        color: badgeColor,
                        background: badgeBg,
                        padding: "1px 5px",
                        borderRadius: "3px",
                        fontSize: "0.68rem",
                        fontWeight: 800,
                        flexShrink: 0
                      }}>
                        {log.level}
                      </span>
                      <span style={{ color: log.level === "CRIT" ? "#FECACA" : "#E2E8F0" }}>
                        {log.message}
                      </span>
                    </div>
                  );
                })}

                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  color: activeStage.themeColor,
                  fontSize: "0.75rem",
                  marginTop: "1rem"
                }}>
                  <span className="pulse" style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: activeStage.themeColor }} />
                  <span>Daemon active. Ready for next pipeline trigger.</span>
                </div>
              </div>
            )}

            {/* VIEW 2: ARTIFACT PAYLOAD */}
            {activeTab === "artifact" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <span style={{ color: "#94A3B8", fontSize: "0.75rem" }}>
                    File: <code style={{ color: activeStage.themeColor }}>{activeStage.artifactView.filename}</code>
                  </span>
                  <button
                    onClick={handleCopyCode}
                    style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: copied ? "#34D399" : "#E2E8F0",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontSize: "0.72rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copied ? "Copied" : "Copy Payload"}</span>
                  </button>
                </div>

                <pre style={{
                  background: "rgba(0, 0, 0, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  padding: "1rem",
                  borderRadius: "8px",
                  overflowX: "auto",
                  color: "#A5B4FC",
                  fontSize: "0.78rem",
                  lineHeight: 1.55,
                  margin: 0
                }}>
                  <code>{activeStage.artifactView.code}</code>
                </pre>
              </div>
            )}

            {/* VIEW 3: TOPOLOGY DATAFLOW */}
            {activeTab === "topology" && (
              <div>
                <div style={{ color: "#64748B", fontSize: "0.75rem", marginBottom: "1rem" }}>
                  // PRODUCT HANDOFF TOPOLOGY: FROM SOURCE TO DESTINATION
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {activeStage.topologyFlow.map((node, nIdx) => (
                    <div key={nIdx} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: nIdx === activeStage.topologyFlow.length - 1 ? activeStage.themeColor : "rgba(255, 255, 255, 0.1)",
                        color: nIdx === activeStage.topologyFlow.length - 1 ? "#030608" : "#94A3B8",
                        display: "grid",
                        placeItems: "center",
                        fontSize: "0.75rem",
                        fontWeight: 900
                      }}>
                        {nIdx + 1}
                      </div>
                      <div style={{
                        background: nIdx === activeStage.topologyFlow.length - 1 ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.03)",
                        border: nIdx === activeStage.topologyFlow.length - 1 ? `1px solid ${activeStage.themeColor}50` : "1px solid rgba(255, 255, 255, 0.06)",
                        padding: "8px 14px",
                        borderRadius: "8px",
                        flex: 1,
                        color: nIdx === activeStage.topologyFlow.length - 1 ? "#FFFFFF" : "#94A3B8",
                        fontWeight: nIdx === activeStage.topologyFlow.length - 1 ? 700 : 500
                      }}>
                        {node}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Terminal Footer */}
          <div style={{
            background: "rgba(10, 15, 26, 0.9)",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            padding: "0.6rem 1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.72rem",
            fontFamily: "var(--font-mono, monospace)",
            color: "#64748B"
          }}>
            <span>ENCLAVE DISPATCH: SECURE</span>
            <span style={{ color: "#34D399" }}>HMAC INTEGRITY: VERIFIED</span>
          </div>

        </div>

      </div>

    </div>
  );
}
