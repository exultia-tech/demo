"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  PureIdeIcon, 
  VantageIcon, 
  PureOsIcon, 
  PraxisIcon, 
  AxiomIcon, 
  ErisIcon, 
  ValkyrieIcon,
  ExultiaLogo 
} from "@/components/BrandIcons";
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Terminal, 
  Sparkles, 
  AlertTriangle,
  Flame,
  Radio,
  Cpu,
  Layers,
  Activity,
  Server,
  Lock,
  ExternalLink,
  ChevronRight,
  Shield,
  Zap,
  Globe,
  Award
} from "lucide-react";

interface Scenario {
  id: string;
  name: string;
  cve: string;
  cvss: number;
  severity: "CRITICAL" | "HIGH";
  vector: string;
  targetService: string;
  vantageSummary: string;
  erisModule: string;
  valkyriePayload: string;
  praxisHotpatch: string;
  attestationSha: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "php-cgi",
    name: "PHP-CGI Argument Injection RCE",
    cve: "CVE-2024-4577",
    cvss: 9.8,
    severity: "CRITICAL",
    vector: "Windows Best-Fit %AD Mapping Bypass",
    targetService: "Apache/2.4.59 (Win64) PHP/8.2.19 (CGI)",
    vantageSummary: "CISA KEV active. Zero-day exploitation detected against unpatched Windows CGI instances via command line query parameter injection.",
    erisModule: "php_cgi_query_injection",
    valkyriePayload: "POST /test.php?%ADd+allow_url_include%3d1 HTTP/1.1",
    praxisHotpatch: "RewriteCond %{QUERY_STRING} ^(%AD|%ad)d [NC] -> RewriteRule .* - [F,L]",
    attestationSha: "sha256:4a8c9b2f10e7d532a89c3b1e920d58f3b2a1c0d4"
  },
  {
    id: "regresshion",
    name: "OpenSSH Signal Race Pre-Auth RCE",
    cve: "CVE-2024-6387",
    cvss: 8.1,
    severity: "CRITICAL",
    vector: "SIGALRM Handler Race Condition",
    targetService: "OpenSSH_9.2p1 Debian-2+deb12u2 (glibc)",
    vantageSummary: "Signal handler race condition in sshd allows unauthenticated root code execution on glibc-based Linux systems.",
    erisModule: "ssh_regresshion_signal_race",
    valkyriePayload: "TCP Handshake Port 22 -> Banner Probe (Safe Non-Destructive Canary)",
    praxisHotpatch: "sshd_config: LoginGraceTime 0 -> sysctl net.ipv4.tcp_max_syn_backlog=4096",
    attestationSha: "sha256:7b1e9a3c4d5f608192a3b4c5d6e7f8a9b0c1d2e3"
  },
  {
    id: "xz-backdoor",
    name: "XZ Utils Upstream Liblzma Backdoor",
    cve: "CVE-2024-3094",
    cvss: 10.0,
    severity: "CRITICAL",
    vector: "Supply-Chain IFUNC Hijack",
    targetService: "liblzma.so.5.6.0 / sshd systemd socket",
    vantageSummary: "Compromised upstream release tarballs containing malicious test files injecting unauthorized RSA decryption keys into sshd.",
    erisModule: "xz_liblzma_backdoor_injection",
    valkyriePayload: "ELF Section Inspection -> Symbol Check `_get_cpuid`",
    praxisHotpatch: "Atomic package rollback: liblzma 5.6.0 -> 5.4.5 + kill -HUP sshd",
    attestationSha: "sha256:9f8e7d6c5b4a392817263544536271809a8b7c6d"
  },
  {
    id: "log4shell",
    name: "Apache Log4j2 JNDI Remote Code Execution",
    cve: "CVE-2021-44228",
    cvss: 10.0,
    severity: "CRITICAL",
    vector: "JNDI LDAP Lookup Injection",
    targetService: "Apache Log4j 2.14.1 (Java 11 OpenJDK)",
    vantageSummary: "Unauthenticated remote code execution via recursive message lookup substitution parsing attacker-controlled JNDI strings.",
    erisModule: "log4j_jndi_ldap_injection",
    valkyriePayload: "${jndi:ldap://127.0.0.1:1389/CanaryProbe}",
    praxisHotpatch: "JVM flag: -Dlog4j2.formatMsgNoLookups=true + Classpath Bytecode Strip",
    attestationSha: "sha256:1a2b3c4d5e6f708192a3b4c5d6e7f8a9b0c1d2e3"
  }
];

export default function HomeCommandDeck() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStage, setActiveStage] = useState<number>(0); // 0=idle, 1=detect, 2=emulate, 3=verify, 4=remediate, 5=complete
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "EXULTIA KINETIC AUTONOMOUS KERNEL DAEMON v2.4.0 (x86_64-linux-gnu)",
    "Status: DAEMON_ARMORED • 110+ authoritative feeds synchronized • 0 active alerts",
    "Ready. Select a CVE scenario above and click 'Run Closed-Loop Defense'."
  ]);
  const [isMitigated, setIsMitigated] = useState(false);
  const [isRolledBack, setIsRolledBack] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const simulatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollTop = terminalEndRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const handleScenarioChange = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setActiveStage(0);
    setIsRunning(false);
    setIsMitigated(false);
    setIsRolledBack(false);
    setTerminalLines([
      `SCENARIO ARMED: ${scenario.name} (${scenario.cve})`,
      `CVSS Score: ${scenario.cvss} [${scenario.severity}] • Vector: ${scenario.vector}`,
      `Target Service: ${scenario.targetService}`,
      "Click 'Run Closed-Loop Defense' to execute detection, emulation, and in-memory hotpatching."
    ]);
  };

  const runSequence = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setIsMitigated(false);
    setIsRolledBack(false);

    const now = () => {
      const d = new Date();
      return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}.${d.getMilliseconds().toString().padStart(3, "0")}`;
    };

    setTerminalLines([
      `[${now()}] 🚀 INITIALIZING AUTONOMOUS CLOSED-LOOP DEFENSE SEQUENCE`,
      `[${now()}] TARGET CVE: ${selectedScenario.cve} (${selectedScenario.name})`,
      `[${now()}] -------------------------------------------------------------`
    ]);

    // STAGE 1: DETECT
    setActiveStage(1);
    await new Promise((r) => setTimeout(r, 600));
    setTerminalLines((prev) => [
      ...prev,
      `[${now()}] 📡 [STAGE 1: VANTAGE DETECT] Ingested advisory ${selectedScenario.cve} (CVSS: ${selectedScenario.cvss})`,
      `[${now()}]    Source: CISA KEV & NIST NVD • Impact: Critical remote compromise`,
      `[${now()}]    Vector breakdown: ${selectedScenario.vector}`
    ]);

    // STAGE 2: EMULATE
    setActiveStage(2);
    await new Promise((r) => setTimeout(r, 700));
    setTerminalLines((prev) => [
      ...prev,
      `[${now()}] 🧪 [STAGE 2: ERIS EMULATE] Initializing isolated chaos container sandbox`,
      `[${now()}]    Module: ${selectedScenario.erisModule} • Binding ephemeral socket`,
      `[${now()}]    Target service running: ${selectedScenario.targetService}`,
      `[${now()}]    Watchdog failsafe armed: 10m auto-kill timer`
    ]);

    // STAGE 3: VERIFY
    setActiveStage(3);
    await new Promise((r) => setTimeout(r, 700));
    setTerminalLines((prev) => [
      ...prev,
      `[${now()}] 🎯 [STAGE 3: VALKYRIE VERIFY] Injecting safe non-destructive canary probe`,
      `[${now()}]    Payload: ${selectedScenario.valkyriePayload}`,
      `[${now()}]    ⚠️ RESULT: EXPLOITABILITY CONFIRMED [Target Vulnerable]`
    ]);

    // STAGE 4: REMEDIATE
    setActiveStage(4);
    await new Promise((r) => setTimeout(r, 800));
    setTerminalLines((prev) => [
      ...prev,
      `[${now()}] 🔧 [STAGE 4: PRAXIS REMEDIATE] Synthesizing targeted in-memory hotpatch`,
      `[${now()}]    Rule: ${selectedScenario.praxisHotpatch}`,
      `[${now()}]    Taking atomic snapshot: /var/lib/kinetic/snapshots/${selectedScenario.cve}/`,
      `[${now()}] ⚡ KINETIC: Hotpatch injected in 34ms! Zero daemon restart. Zero downtime.`
    ]);

    // STAGE 5: POST-FLIGHT ATTESTATION
    setActiveStage(5);
    await new Promise((r) => setTimeout(r, 600));
    setIsMitigated(true);
    setIsRunning(false);
    setTerminalLines((prev) => [
      ...prev,
      `[${now()}] 🛡️ [STAGE 5: POST-FLIGHT PROVE] Re-executing Valkyrie canary probe`,
      `[${now()}]    HTTP Status: 403 Forbidden [Payload Blocked]`,
      `[${now()}] ✅ CRYPTOGRAPHIC ATTESTATION: ${selectedScenario.attestationSha}`,
      `[${now()}] 🎉 CLOSED LOOP COMPLETE in 198ms. Host armored against ${selectedScenario.cve}.`
    ]);
  };

  const triggerRollback = async () => {
    if (isRunning || !isMitigated) return;
    setIsRunning(true);

    const now = () => {
      const d = new Date();
      return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}.${d.getMilliseconds().toString().padStart(3, "0")}`;
    };

    setTerminalLines((prev) => [
      ...prev,
      `[${now()}] 🔄 USER TRIGGERED DETERMINISTIC ROLLBACK: sudo kinetic rollback --cve=${selectedScenario.cve}`,
      `[${now()}] Restoring pre-flight atomic snapshot...`
    ]);

    await new Promise((r) => setTimeout(r, 500));
    setIsMitigated(false);
    setIsRolledBack(true);
    setIsRunning(false);
    setActiveStage(0);

    setTerminalLines((prev) => [
      ...prev,
      `[${now()}] ✅ ATOMIC ROLLBACK SUCCESSFUL in 14ms! Restored original binary & firewall state.`,
      `[${now()}] Host returned to baseline state.`
    ]);
  };

  const scrollToSimulator = () => {
    if (simulatorRef.current) {
      simulatorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1.5rem 1rem 5rem 1rem" }}>
      
      {/* ── HERO HEADLINE & CONFIDENT MISSION ─────────────────────────────────── */}
      <section style={{ textAlign: "center", marginBottom: "3.5rem" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(0, 229, 255, 0.08)",
          border: "1px solid rgba(0, 229, 255, 0.25)",
          padding: "5px 14px",
          borderRadius: "20px",
          marginBottom: "1.25rem",
          fontSize: "0.78rem",
          fontFamily: "var(--font-mono, monospace)",
          color: "#67E8F9",
          letterSpacing: "0.08em",
          textTransform: "uppercase"
        }}>
          <Sparkles size={13} />
          <span>The Unified Cyber Sovereignty Ecosystem</span>
        </div>

        <h1 style={{ 
          fontFamily: "var(--font-display, 'Orbitron', sans-serif)", 
          fontSize: "clamp(2.2rem, 4.4vw, 3.6rem)", 
          fontWeight: 900, 
          color: "#FFFFFF", 
          letterSpacing: "-0.02em", 
          marginBottom: "1rem",
          lineHeight: 1.15
        }}>
          Autonomous Cyber Defense.
          <span style={{ 
            display: "block", 
            background: "linear-gradient(135deg, #00E5FF 0%, #3B82F6 50%, #A855F7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Deterministic Sovereignty.
          </span>
        </h1>

        <p style={{ color: "#94A3B8", fontSize: "1.1rem", maxWidth: "840px", margin: "0 auto 2rem auto", lineHeight: 1.6 }}>
          Zero-day threats move in minutes. Upstream vendor security patches take weeks. Exultia closes the loop: real-time universal threat detection, isolated adversary emulation, non-destructive pentest probes, and sub-second in-memory hotpatching.
        </p>

        {/* Hero CTAs */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          <Link
            href="/account/subscription"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "linear-gradient(135deg, #00E5FF 0%, #3B82F6 100%)",
              color: "#030608",
              fontFamily: "var(--font-display, 'Orbitron', sans-serif)",
              fontWeight: 900,
              fontSize: "0.95rem",
              letterSpacing: "0.05em",
              padding: "14px 28px",
              borderRadius: "8px",
              textDecoration: "none",
              boxShadow: "0 0 25px rgba(0, 229, 255, 0.4)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease"
            }}
          >
            <span>Launch Sovereign Console ($59/mo)</span>
            <ArrowRight size={16} />
          </Link>

          <button
            onClick={scrollToSimulator}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(0, 229, 255, 0.3)",
              color: "#E2F8FF",
              fontFamily: "var(--font-mono, monospace)",
              fontWeight: 700,
              fontSize: "0.9rem",
              padding: "14px 22px",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            <Activity size={16} color="#00E5FF" />
            <span>Interactive Defense Simulator ↓</span>
          </button>
        </div>

        {/* Architectural Truth Badges */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.75rem", flexWrap: "wrap", fontSize: "0.82rem", color: "#64748B", fontFamily: "var(--font-mono, monospace)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <Lock size={13} color="#00E5FF" /> 100% Zero-Telemetry Workstations
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <RotateCcw size={13} color="#10B981" /> 14ms Deterministic Rollback
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <ShieldCheck size={13} color="#A855F7" /> HMAC-SHA256 Cryptographic Proof
          </span>
        </div>
      </section>

      {/* ── THE INTERACTIVE CLOSED-LOOP PROVING GROUND (COCKPIT CENTERPIECE) ─── */}
      <section ref={simulatorRef} style={{ marginBottom: "5rem" }}>
        
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#00E5FF", boxShadow: "0 0 12px #00E5FF" }} />
            <h2 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "1.25rem", fontWeight: 800, color: "#FFFFFF", margin: 0, letterSpacing: "0.04em" }}>
              Interactive Closed-Loop Defense Cockpit
            </h2>
          </div>
          <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.78rem", color: "#64748B" }}>
            Real-Time Kinetic Kernel Simulator
          </span>
        </div>

        {/* Scenario Pills Selector */}
        <div style={{
          background: "rgba(10, 15, 26, 0.8)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "12px 12px 0 0",
          padding: "12px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
          borderBottom: "1px solid rgba(0, 229, 255, 0.2)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.74rem", color: "#64748B", fontFamily: "var(--font-mono, monospace)", fontWeight: 700 }}>
              SELECT ADVERSARY THREAT:
            </span>
            {SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                disabled={isRunning}
                onClick={() => handleScenarioChange(sc)}
                style={{
                  background: selectedScenario.id === sc.id ? "rgba(0, 229, 255, 0.2)" : "rgba(255, 255, 255, 0.03)",
                  border: selectedScenario.id === sc.id ? "1px solid #00E5FF" : "1px solid rgba(255, 255, 255, 0.1)",
                  color: selectedScenario.id === sc.id ? "#FFFFFF" : "#94A3B8",
                  padding: "5px 12px",
                  borderRadius: "6px",
                  fontSize: "0.76rem",
                  fontFamily: "var(--font-mono, monospace)",
                  fontWeight: 800,
                  cursor: isRunning ? "not-allowed" : "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                {sc.cve}
              </button>
            ))}
          </div>

          <div style={{ fontSize: "0.76rem", fontFamily: "var(--font-mono, monospace)", color: "#EF4444" }}>
            SEVERITY: <strong>CVSS {selectedScenario.cvss} [CRITICAL]</strong>
          </div>
        </div>

        {/* Dual-Pane Display */}
        <div className="cyber-cockpit" style={{ borderRadius: "0 0 20px 20px" }}>
          
          {/* LEFT PANE: 4-Stage Interactive Pipeline */}
          <div>
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ fontSize: "0.72rem", color: "#64748B", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Target Adversary Scenario
              </div>
              <h3 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", margin: "4px 0" }}>
                {selectedScenario.name}
              </h3>
              <p style={{ color: "#94A3B8", fontSize: "0.85rem", lineHeight: 1.5, margin: 0 }}>
                {selectedScenario.vantageSummary}
              </p>
            </div>

            {/* 4-Stage OODA Visual Track */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "1.5rem" }}>
              
              {/* Stage 1: Vantage */}
              <div style={{
                background: activeStage === 1 ? "rgba(168, 85, 247, 0.2)" : activeStage > 1 ? "rgba(168, 85, 247, 0.08)" : "rgba(255, 255, 255, 0.02)",
                border: activeStage === 1 ? "1px solid #A855F7" : activeStage > 1 ? "1px solid rgba(168, 85, 247, 0.35)" : "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "10px",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <VantageIcon size={24} />
                  <div>
                    <div style={{ fontSize: "0.68rem", color: "#C084FC", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>STAGE 01 &bull; DETECT</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF" }}>Vantage Threat Intelligence</div>
                  </div>
                </div>
                <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono, monospace)", color: activeStage >= 1 ? "#A855F7" : "#64748B" }}>
                  {activeStage > 1 ? "ADVISORY INGESTED ✓" : activeStage === 1 ? "ANALYZING..." : "STANDBY"}
                </span>
              </div>

              {/* Stage 2: Eris */}
              <div style={{
                background: activeStage === 2 ? "rgba(239, 68, 68, 0.2)" : activeStage > 2 ? "rgba(239, 68, 68, 0.08)" : "rgba(255, 255, 255, 0.02)",
                border: activeStage === 2 ? "1px solid #EF4444" : activeStage > 2 ? "1px solid rgba(239, 68, 68, 0.35)" : "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "10px",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <ErisIcon size={24} glow={false} />
                  <div>
                    <div style={{ fontSize: "0.68rem", color: "#F87171", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>STAGE 02 &bull; EMULATE</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF" }}>Eris Chaos Sandbox Range</div>
                  </div>
                </div>
                <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono, monospace)", color: activeStage >= 2 ? "#EF4444" : "#64748B" }}>
                  {activeStage > 2 ? "SANDBOX PROVISIONED ✓" : activeStage === 2 ? "REPLICATING..." : "STANDBY"}
                </span>
              </div>

              {/* Stage 3: Valkyrie */}
              <div style={{
                background: activeStage === 3 ? "rgba(6, 182, 212, 0.2)" : activeStage > 3 ? "rgba(6, 182, 212, 0.08)" : "rgba(255, 255, 255, 0.02)",
                border: activeStage === 3 ? "1px solid #06B6D4" : activeStage > 3 ? "1px solid rgba(6, 182, 212, 0.35)" : "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "10px",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <ValkyrieIcon size={24} glow={false} />
                  <div>
                    <div style={{ fontSize: "0.68rem", color: "#67E8F9", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>STAGE 03 &bull; VERIFY</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF" }}>Valkyrie On-Demand Pentest BAS</div>
                  </div>
                </div>
                <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono, monospace)", color: activeStage >= 3 ? "#06B6D4" : "#64748B" }}>
                  {activeStage > 3 ? "EXPLOIT PROVEN ✓" : activeStage === 3 ? "FIRING PROBE..." : "STANDBY"}
                </span>
              </div>

              {/* Stage 4: Praxis */}
              <div style={{
                background: activeStage === 4 || activeStage === 5 ? "rgba(245, 158, 11, 0.2)" : "rgba(255, 255, 255, 0.02)",
                border: activeStage === 4 || activeStage === 5 ? "1px solid #F59E0B" : "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "10px",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <PraxisIcon size={24} />
                  <div>
                    <div style={{ fontSize: "0.68rem", color: "#FDE68A", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>STAGE 04 &bull; REMEDIATE</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF" }}>Praxis Autonomous Hotpatch</div>
                  </div>
                </div>
                <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono, monospace)", color: activeStage >= 4 ? "#F59E0B" : "#64748B" }}>
                  {activeStage === 5 ? "HOTPATCH COMMITTED ✓" : activeStage === 4 ? "INJECTING PATCH..." : "STANDBY"}
                </span>
              </div>

            </div>

            {/* Execution Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <button
                disabled={isRunning}
                onClick={runSequence}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: isRunning 
                    ? "rgba(0, 229, 255, 0.2)" 
                    : "linear-gradient(135deg, #00E5FF 0%, #3B82F6 100%)",
                  color: "#030608",
                  fontFamily: "var(--font-mono, monospace)",
                  fontWeight: 900,
                  fontSize: "0.88rem",
                  padding: "12px 22px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: isRunning ? "not-allowed" : "pointer",
                  boxShadow: isRunning ? "none" : "0 4px 20px rgba(0, 229, 255, 0.4)",
                  transition: "all 0.2s ease"
                }}
              >
                <Play size={16} fill="#030608" />
                <span>{isRunning ? "Running Autonomous Defense..." : "Run Closed-Loop Defense"}</span>
              </button>

              {isMitigated && (
                <button
                  disabled={isRunning}
                  onClick={triggerRollback}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                    color: "#FCA5A5",
                    fontFamily: "var(--font-mono, monospace)",
                    fontWeight: 800,
                    fontSize: "0.82rem",
                    padding: "12px 18px",
                    borderRadius: "8px",
                    cursor: isRunning ? "not-allowed" : "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  <RotateCcw size={14} />
                  <span>Test Sub-Second Rollback (Revert in 14ms)</span>
                </button>
              )}
            </div>

            <div style={{ marginTop: "1rem", fontSize: "0.76rem", color: "#64748B", fontFamily: "var(--font-mono, monospace)" }}>
              Target Host Architecture: <span style={{ color: "#CBD5E1" }}>{selectedScenario.targetService}</span>
            </div>
          </div>

          {/* RIGHT PANE: Real-Time Operational Console (Terminal) */}
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", color: "#00E5FF" }}>
                <Terminal size={14} />
                <span>KERNEL OPERATIONAL TELEMETRY STREAM</span>
              </div>
              <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono, monospace)", color: "#10B981" }}>
                LIVE FEED ●
              </span>
            </div>

            <div 
              ref={terminalEndRef}
              style={{
                flex: 1,
                minHeight: "360px",
                maxHeight: "440px",
                background: "#03060C",
                border: "1px solid rgba(0, 229, 255, 0.2)",
                borderRadius: "12px",
                padding: "1.25rem",
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "0.82rem",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                lineHeight: 1.55,
                boxShadow: "inset 0 0 35px rgba(0, 0, 0, 0.95)"
              }}
            >
              {terminalLines.map((line, idx) => (
                <div key={idx} style={{
                  color: line.includes("CRITICAL") || line.includes("⚠️") 
                    ? "#F87171" 
                    : line.includes("✅") || line.includes("COMPLETE") || line.includes("ARMORED") 
                    ? "#34D399" 
                    : line.includes("STAGE") 
                    ? "#FDE047" 
                    : line.includes("KINETIC") 
                    ? "#38BDF8" 
                    : "#94A3B8"
                }}>
                  {line}
                </div>
              ))}
            </div>
          </div>

        </div>

      </section>

      {/* ── ARCHITECTURAL BLUEPRINT: THE OODA KINETIC RESPONSE LOOP (NO CARDS!) ── */}
      <section style={{ marginBottom: "5rem" }}>
        
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(168, 85, 247, 0.1)",
            border: "1px solid rgba(168, 85, 247, 0.3)",
            padding: "4px 12px",
            borderRadius: "20px",
            marginBottom: "0.75rem",
            fontSize: "0.74rem",
            fontFamily: "var(--font-mono, monospace)",
            color: "#C084FC",
            letterSpacing: "0.1em",
            textTransform: "uppercase"
          }}>
            <span>The Continuous Security Operations Plane</span>
          </div>

          <h2 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "2rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.5rem 0" }}>
            The 4 Stages of Kinetic Autonomous Defense
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "0.95rem", maxWidth: "700px", margin: "0 auto", lineHeight: 1.5 }}>
            A unified pipeline executing OODA (Observe &bull; Orient &bull; Decide &bull; Act) at machine speed with zero human lag.
          </p>
        </div>

        {/* 4 Connected Pipeline Nodes */}
        <div className="ooda-circuit">
          
          {/* Node 1: Vantage */}
          <Link 
            href="/app/uvi"
            className="ooda-node"
            style={{
              // @ts-ignore
              "--node-accent": "#A855F7",
              "--node-glow": "rgba(168, 85, 247, 0.35)",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <VantageIcon size={38} />
                <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono, monospace)", color: "#C084FC", background: "rgba(168, 85, 247, 0.15)", padding: "2px 7px", borderRadius: "4px", fontWeight: 800 }}>
                  01 // DETECT
                </span>
              </div>
              <h3 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 4px 0" }}>
                Vantage Intel
              </h3>
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.75rem", color: "#C084FC", marginBottom: "0.75rem", fontWeight: 700 }}>
                Universal Advisory Registry
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.85rem", lineHeight: 1.5, margin: "0 0 1rem 0" }}>
                Continuous aggregation across 110+ authoritative registries (NIST NVD, CISA KEV, Linux errata, PHP, OpenSSL).
              </p>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "0.75rem" }}>
              <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono, monospace)", color: "#64748B" }}>6,391 Ingested</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#C084FC", fontSize: "0.78rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>
                <span>Feed</span> <ChevronRight size={14} />
              </span>
            </div>
          </Link>

          {/* Node 2: Eris */}
          <Link 
            href="/app/eris"
            className="ooda-node"
            style={{
              // @ts-ignore
              "--node-accent": "#EF4444",
              "--node-glow": "rgba(239, 68, 68, 0.35)",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <ErisIcon size={38} glow={false} />
                <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono, monospace)", color: "#F87171", background: "rgba(239, 68, 68, 0.15)", padding: "2px 7px", borderRadius: "4px", fontWeight: 800 }}>
                  02 // EMULATE
                </span>
              </div>
              <h3 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 4px 0" }}>
                Eris Chaos Lab
              </h3>
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.75rem", color: "#F87171", marginBottom: "0.75rem", fontWeight: 700 }}>
                Adversary Proving Ground
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.85rem", lineHeight: 1.5, margin: "0 0 1rem 0" }}>
                Intentional vulnerability inoculation. Replicate live CVEs in 5-container Docker ranges with automated watchdog rollbacks.
              </p>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "0.75rem" }}>
              <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono, monospace)", color: "#64748B" }}>10m Watchdog</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#EF4444", fontSize: "0.78rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>
                <span>Sandbox</span> <ChevronRight size={14} />
              </span>
            </div>
          </Link>

          {/* Node 3: Valkyrie */}
          <Link 
            href="/app/valkyrie"
            className="ooda-node"
            style={{
              // @ts-ignore
              "--node-accent": "#06B6D4",
              "--node-glow": "rgba(6, 182, 212, 0.35)",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <ValkyrieIcon size={38} glow={false} />
                <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono, monospace)", color: "#67E8F9", background: "rgba(6, 182, 212, 0.15)", padding: "2px 7px", borderRadius: "4px", fontWeight: 800 }}>
                  03 // VERIFY
                </span>
              </div>
              <h3 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 4px 0" }}>
                Valkyrie BAS
              </h3>
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.75rem", color: "#67E8F9", marginBottom: "0.75rem", fontWeight: 700 }}>
                On-Demand Exploit Prober
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.85rem", lineHeight: 1.5, margin: "0 0 1rem 0" }}>
                Breach &amp; attack simulation. Probe endpoints with safe non-destructive canaries to prove exploitability with HMAC tokens.
              </p>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "0.75rem" }}>
              <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono, monospace)", color: "#64748B" }}>HMAC Signed</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#06B6D4", fontSize: "0.78rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>
                <span>Prober</span> <ChevronRight size={14} />
              </span>
            </div>
          </Link>

          {/* Node 4: Praxis */}
          <Link 
            href="/app/praxis"
            className="ooda-node"
            style={{
              // @ts-ignore
              "--node-accent": "#F59E0B",
              "--node-glow": "rgba(245, 158, 11, 0.35)",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <PraxisIcon size={38} />
                <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono, monospace)", color: "#FDE68A", background: "rgba(245, 158, 11, 0.15)", padding: "2px 7px", borderRadius: "4px", fontWeight: 800 }}>
                  04 // REMEDIATE
                </span>
              </div>
              <h3 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 4px 0" }}>
                Praxis Hotpatch
              </h3>
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.75rem", color: "#FDE68A", marginBottom: "0.75rem", fontWeight: 700 }}>
                Autonomous Remediation
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.85rem", lineHeight: 1.5, margin: "0 0 1rem 0" }}>
                Sub-second deterministic hotpatching with atomic snapshots, Ansible canary rollouts, and hardware firewall synthesis.
              </p>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "0.75rem" }}>
              <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono, monospace)", color: "#64748B" }}>&lt;40ms Patch</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#F59E0B", fontSize: "0.78rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>
                <span>Engine</span> <ChevronRight size={14} />
              </span>
            </div>
          </Link>

        </div>

      </section>

      {/* ── ARCHITECTURAL BLUEPRINT: THE SOVEREIGN FOUNDATIONS (3 COLUMNS) ──── */}
      <section style={{ marginBottom: "5rem" }}>
        
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            padding: "4px 12px",
            borderRadius: "20px",
            marginBottom: "0.75rem",
            fontSize: "0.74rem",
            fontFamily: "var(--font-mono, monospace)",
            color: "#93C5FD",
            letterSpacing: "0.1em",
            textTransform: "uppercase"
          }}>
            <span>The Foundational Engineering &amp; Runtime Plane</span>
          </div>

          <h2 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "2rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.5rem 0" }}>
            Hermetic Toolchains, Hardened Runtimes &amp; Workforce Readiness
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "0.95rem", maxWidth: "700px", margin: "0 auto", lineHeight: 1.5 }}>
            Security is not just an operational response. It is built into developer compilers, container bases, and human competence.
          </p>
        </div>

        <div className="foundation-stack">
          
          {/* Foundation 1: PureIDE */}
          <Link 
            href="/products/pure-ide"
            className="foundation-card"
            style={{
              // @ts-ignore
              "--card-accent": "#3B82F6",
              "--card-glow": "rgba(59, 130, 246, 0.35)",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
                <PureIdeIcon size={42} glow={false} />
                <div>
                  <h3 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "1.25rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
                    PureIDE
                  </h3>
                  <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.74rem", color: "#93C5FD", fontWeight: 700 }}>
                    Hermetic Compiler Workstation
                  </div>
                </div>
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.88rem", lineHeight: 1.5, margin: "0 0 1.25rem 0" }}>
                Air-gapped, zero-telemetry development workstations with kernel network egress sandboxing and automated CycloneDX SBOM cosign verification.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono, monospace)", color: "#93C5FD", background: "rgba(59, 130, 246, 0.15)", padding: "2px 7px", borderRadius: "3px" }}>Zero-Telemetry</span>
                <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono, monospace)", color: "#CBD5E1", background: "rgba(255, 255, 255, 0.05)", padding: "2px 7px", borderRadius: "3px" }}>Egress Gate</span>
                <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono, monospace)", color: "#CBD5E1", background: "rgba(255, 255, 255, 0.05)", padding: "2px 7px", borderRadius: "3px" }}>CycloneDX SBOM</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginTop: "1.25rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "0.75rem" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#3B82F6", fontSize: "0.82rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>
                <span>Specifications</span> <ArrowRight size={14} />
              </span>
            </div>
          </Link>

          {/* Foundation 2: PureOS */}
          <Link 
            href="/app/pureos"
            className="foundation-card"
            style={{
              // @ts-ignore
              "--card-accent": "#10B981",
              "--card-glow": "rgba(16, 185, 129, 0.35)",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
                <PureOsIcon size={42} glow={false} />
                <div>
                  <h3 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "1.25rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
                    PureOS Containers
                  </h3>
                  <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.74rem", color: "#6EE7B7", fontWeight: 700 }}>
                    CIS-Benchmarked Images
                  </div>
                </div>
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.88rem", lineHeight: 1.5, margin: "0 0 1.25rem 0" }}>
                Minimal distroless and CIS Level 1 &amp; 2 pre-hardened container base images continuously synchronized against active Vantage CVE disclosures.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono, monospace)", color: "#6EE7B7", background: "rgba(16, 185, 129, 0.15)", padding: "2px 7px", borderRadius: "3px" }}>CIS L1 / L2</span>
                <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono, monospace)", color: "#CBD5E1", background: "rgba(255, 255, 255, 0.05)", padding: "2px 7px", borderRadius: "3px" }}>Distroless Base</span>
                <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono, monospace)", color: "#CBD5E1", background: "rgba(255, 255, 255, 0.05)", padding: "2px 7px", borderRadius: "3px" }}>Daily Sync</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginTop: "1.25rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "0.75rem" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#10B981", fontSize: "0.82rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>
                <span>Image Catalog</span> <ArrowRight size={14} />
              </span>
            </div>
          </Link>

          {/* Foundation 3: Axiom */}
          <Link 
            href="/app/axiom"
            className="foundation-card"
            style={{
              // @ts-ignore
              "--card-accent": "#F43F5E",
              "--card-glow": "rgba(244, 63, 94, 0.35)",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
                <AxiomIcon size={42} />
                <div>
                  <h3 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "1.25rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
                    Axiom Platform
                  </h3>
                  <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.74rem", color: "#FDA4AF", fontWeight: 700 }}>
                    Defense Certification &amp; LMS API
                  </div>
                </div>
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.88rem", lineHeight: 1.5, margin: "0 0 1.25rem 0" }}>
                Hands-on cybersecurity exam simulation (Security+, CySA+, CC) with verifiable SHA-256 certs and institutional LMS deep linking (SCORM / LTI 1.3).
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono, monospace)", color: "#FDA4AF", background: "rgba(244, 63, 94, 0.15)", padding: "2px 7px", borderRadius: "3px" }}>SHA-256 Certs</span>
                <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono, monospace)", color: "#CBD5E1", background: "rgba(255, 255, 255, 0.05)", padding: "2px 7px", borderRadius: "3px" }}>SCORM / LTI API</span>
                <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono, monospace)", color: "#CBD5E1", background: "rgba(255, 255, 255, 0.05)", padding: "2px 7px", borderRadius: "3px" }}>Question Banks</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginTop: "1.25rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "0.75rem" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#F43F5E", fontSize: "0.82rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>
                <span>Launch Simulator</span> <ArrowRight size={14} />
              </span>
            </div>
          </Link>

        </div>

      </section>

      {/* ── THE SOVEREIGN DIFFERENCE: EMPIRICAL BENCHMARKS TABLE ─────────────── */}
      <section style={{ marginBottom: "5rem" }}>
        
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "1.8rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.5rem 0" }}>
            The Sovereign Difference
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "0.95rem" }}>
            Raw engineering realities comparing fragmented legacy vendors with Exultia's unified closed-loop platform.
          </p>
        </div>

        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th style={{ width: "24%" }}>Capability Dimension</th>
                <th style={{ width: "38%" }}>Legacy Enterprise Tools (CrowdStrike / Snyk / Splunk)</th>
                <th style={{ width: "38%" }} className="sovereign-col">Exultia Sovereign Platform</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 700, color: "#FFFFFF" }}>Zero-Day Response Latency</td>
                <td style={{ color: "#F87171" }}>14 &ndash; 45 days waiting for upstream vendor patch release</td>
                <td className="sovereign-col" style={{ color: "#34D399" }}>
                  <strong>&lt; 40 milliseconds</strong> autonomous in-memory hotpatching
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, color: "#FFFFFF" }}>Exploit Verification</td>
                <td style={{ color: "#F87171" }}>Manual third-party penetration testing ($15,000+ per engagement)</td>
                <td className="sovereign-col" style={{ color: "#67E8F9" }}>
                  <strong>Automated Valkyrie BAS</strong> with non-destructive HMAC-SHA256 proofs
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, color: "#FFFFFF" }}>Rollback Guarantee</td>
                <td style={{ color: "#F87171" }}>Risky host reboot, service outage, and manual image re-flashing</td>
                <td className="sovereign-col" style={{ color: "#38BDF8" }}>
                  <strong>14ms Sub-Second Atomic Revert</strong> via pre-flight snapshot
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, color: "#FFFFFF" }}>Developer Telemetry</td>
                <td style={{ color: "#F87171" }}>Phoning home to vendor cloud; source code and AI prompts analyzed</td>
                <td className="sovereign-col" style={{ color: "#A7F3D0" }}>
                  <strong>100% Air-Gapped PureIDE</strong>; zero telemetry by design
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, color: "#FFFFFF" }}>Commercial Architecture</td>
                <td style={{ color: "#F87171" }}>5 &ndash; 7 fragmented subscriptions ($1,200+/month total)</td>
                <td className="sovereign-col" style={{ color: "#FDE047" }}>
                  <strong>1 Unified Subscription ($59/mo)</strong> unlocking all 7 engines
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </section>

      {/* ── UNIFIED SOVEREIGN PLATFORM TIERS ─────────────────────────────────── */}
      <section style={{ marginBottom: "4rem" }}>
        
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "1.8rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.5rem 0" }}>
            Transparent Unified Platform Access
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "0.95rem" }}>
            Zero per-engine surcharges. All 7 defense technologies unified under one simple subscription.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          
          {/* Tier 1: Community Sovereign */}
          <div style={{
            background: "rgba(15, 23, 42, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
            <div>
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.75rem", color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Individual Researcher
              </div>
              <h3 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "1.4rem", fontWeight: 900, color: "#FFFFFF", margin: "6px 0 12px 0" }}>
                Community Sovereign
              </h3>
              <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#FFFFFF", fontFamily: "var(--font-display, 'Orbitron', sans-serif)", marginBottom: "1rem" }}>
                $0 <span style={{ fontSize: "0.9rem", color: "#64748B", fontWeight: 500 }}>/ forever</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem 0", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "#94A3B8" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={15} color="#10B981" /> Vantage Public Threat Feed (NIST NVD)</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={15} color="#10B981" /> PureOS Community Distroless Base Images</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={15} color="#10B981" /> Axiom Free Question Bank Modules</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={15} color="#10B981" /> Basic Valkyrie non-destructive probes</li>
              </ul>
            </div>

            <Link
              href="/account/subscription"
              style={{
                display: "block",
                textAlign: "center",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#FFFFFF",
                padding: "10px",
                borderRadius: "8px",
                textDecoration: "none",
                fontFamily: "var(--font-mono, monospace)",
                fontWeight: 700,
                fontSize: "0.85rem"
              }}
            >
              Get Free Community Access
            </Link>
          </div>

          {/* Tier 2: Professional Operator (Featured) */}
          <div style={{
            background: "linear-gradient(180deg, rgba(0, 229, 255, 0.1) 0%, rgba(15, 23, 42, 0.95) 100%)",
            border: "2px solid #00E5FF",
            borderRadius: "16px",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 10px 40px -10px rgba(0, 229, 255, 0.35)",
            position: "relative"
          }}>
            <div style={{
              position: "absolute",
              top: "-12px",
              right: "20px",
              background: "#00E5FF",
              color: "#030608",
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "0.68rem",
              fontWeight: 900,
              padding: "2px 10px",
              borderRadius: "10px",
              letterSpacing: "0.08em"
            }}>
              RECOMMENDED PLATFORM
            </div>

            <div>
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.75rem", color: "#00E5FF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Full Kinetic Defense Fleet
              </div>
              <h3 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "1.4rem", fontWeight: 900, color: "#FFFFFF", margin: "6px 0 12px 0" }}>
                Professional Operator
              </h3>
              <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#FFFFFF", fontFamily: "var(--font-display, 'Orbitron', sans-serif)", marginBottom: "1rem" }}>
                $59 <span style={{ fontSize: "0.9rem", color: "#67E8F9", fontWeight: 500 }}>/ month</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem 0", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "#E2F8FF" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={15} color="#00E5FF" /> <strong>All 7 Defense Engines Unlocked</strong></li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={15} color="#00E5FF" /> Unlimited Praxis in-memory hotpatches</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={15} color="#00E5FF" /> Private Eris chaos sandbox ranges</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={15} color="#00E5FF" /> Valkyrie BAS with signed HMAC tokens</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={15} color="#00E5FF" /> PureIDE air-gap cosign &amp; PureOS CIS L1/L2</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={15} color="#00E5FF" /> Axiom cert simulator with SHA-256 certs</li>
              </ul>
            </div>

            <Link
              href="/account/subscription"
              style={{
                display: "block",
                textAlign: "center",
                background: "linear-gradient(135deg, #00E5FF 0%, #3B82F6 100%)",
                color: "#030608",
                padding: "12px",
                borderRadius: "8px",
                textDecoration: "none",
                fontFamily: "var(--font-mono, monospace)",
                fontWeight: 900,
                fontSize: "0.9rem",
                boxShadow: "0 4px 15px rgba(0, 229, 255, 0.4)"
              }}
            >
              Start Operator Access ($59/mo)
            </Link>
          </div>

          {/* Tier 3: Enterprise Fleet */}
          <div style={{
            background: "rgba(15, 23, 42, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
            <div>
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.75rem", color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Institutional Infrastructure
              </div>
              <h3 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "1.4rem", fontWeight: 900, color: "#FFFFFF", margin: "6px 0 12px 0" }}>
                Enterprise Fleet
              </h3>
              <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#FFFFFF", fontFamily: "var(--font-display, 'Orbitron', sans-serif)", marginBottom: "1rem" }}>
                $399 <span style={{ fontSize: "0.9rem", color: "#64748B", fontWeight: 500 }}>/ month</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem 0", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "#94A3B8" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={15} color="#10B981" /> Everything in Professional Operator</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={15} color="#10B981" /> Multi-node Kubernetes &amp; Docker swarm hotpatching</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={15} color="#10B981" /> Custom hotpatch rule authoring &amp; audit keys</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={15} color="#10B981" /> SCORM &amp; LTI 1.3 LMS deep linking for colleges</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={15} color="#10B981" /> 24/7 dedicated SOC support and SLA guarantee</li>
              </ul>
            </div>

            <Link
              href="/account/subscription"
              style={{
                display: "block",
                textAlign: "center",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#FFFFFF",
                padding: "10px",
                borderRadius: "8px",
                textDecoration: "none",
                fontFamily: "var(--font-mono, monospace)",
                fontWeight: 700,
                fontSize: "0.85rem"
              }}
            >
              Configure Enterprise Fleet
            </Link>
          </div>

        </div>

      </section>

      {/* ── PERSISTENT TACTICAL SOVEREIGN DOCK (DIRECT ENGINE LAUNCHER) ───────── */}
      <div className="sovereign-dock">
        <span style={{ fontSize: "0.72rem", color: "#64748B", fontFamily: "var(--font-mono, monospace)", marginRight: "6px" }}>
          ENGINE DOCK:
        </span>
        <Link href="/app/uvi" className="dock-item">
          <VantageIcon size={18} />
          <span>Vantage</span>
        </Link>
        <Link href="/app/praxis" className="dock-item">
          <PraxisIcon size={18} />
          <span>Praxis</span>
        </Link>
        <Link href="/app/eris" className="dock-item">
          <ErisIcon size={18} glow={false} />
          <span>Eris</span>
        </Link>
        <Link href="/app/valkyrie" className="dock-item">
          <ValkyrieIcon size={18} glow={false} />
          <span>Valkyrie</span>
        </Link>
        <Link href="/products/pure-ide" className="dock-item">
          <PureIdeIcon size={18} glow={false} />
          <span>PureIDE</span>
        </Link>
        <Link href="/app/pureos" className="dock-item">
          <PureOsIcon size={18} glow={false} />
          <span>PureOS</span>
        </Link>
        <Link href="/app/axiom" className="dock-item">
          <AxiomIcon size={18} />
          <span>Axiom</span>
        </Link>
      </div>

    </div>
  );
}
