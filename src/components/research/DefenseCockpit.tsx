"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  VantageIcon, 
  PraxisIcon, 
  ErisIcon, 
  ValkyrieIcon 
} from "@/components/BrandIcons";
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Activity, 
  Terminal, 
  Sparkles, 
  AlertTriangle,
  Flame,
  Radio,
  Cpu,
  Layers,
  Server,
  Lock,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

export interface Scenario {
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

export const SCENARIOS: Scenario[] = [
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

export default function DefenseCockpit() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStage, setActiveStage] = useState<number>(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "EXULTIA KINETIC AUTONOMOUS KERNEL DAEMON v2.4.0 (x86_64-linux-gnu)",
    "Status: DAEMON_ARMORED • 110+ authoritative feeds synchronized • 0 active alerts",
    "Ready. Select a CVE scenario above and click 'Run Closed-Loop Defense'."
  ]);
  const [isMitigated, setIsMitigated] = useState(false);
  const [isRolledBack, setIsRolledBack] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);

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

  return (
    <div style={{ background: "rgba(8, 14, 26, 0.95)", border: "1px solid rgba(0, 229, 255, 0.25)", borderRadius: "18px", overflow: "hidden", boxShadow: "0 0 45px rgba(0, 229, 255, 0.12)" }}>
      {/* Titlebar */}
      <div style={{
        background: "rgba(10, 15, 26, 0.9)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "10px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#00E5FF", boxShadow: "0 0 10px #00E5FF" }} />
          <h3 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", margin: 0, letterSpacing: "0.04em" }}>
            Interactive Closed-Loop Defense Cockpit
          </h3>
        </div>
        <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.76rem", color: "#64748B" }}>
          Kinetic Threat &amp; Hotpatch Proving Ground
        </span>
      </div>

      {/* Scenario Pills Selector */}
      <div style={{
        background: "rgba(15, 23, 42, 0.8)",
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "10px",
        borderBottom: "1px solid rgba(0, 229, 255, 0.15)"
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
      <div className="cyber-cockpit" style={{ borderRadius: "0 0 18px 18px" }}>
        
        {/* LEFT PANE: 4-Stage Interactive Pipeline */}
        <div>
          <div style={{ marginBottom: "1.25rem" }}>
            <div style={{ fontSize: "0.72rem", color: "#64748B", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Target Adversary Scenario
            </div>
            <h4 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "1.15rem", fontWeight: 800, color: "#FFFFFF", margin: "4px 0" }}>
              {selectedScenario.name}
            </h4>
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
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF" }}>Eris Chaos Range</div>
                </div>
              </div>
              <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono, monospace)", color: activeStage >= 2 ? "#EF4444" : "#64748B" }}>
                {activeStage > 2 ? "SANDBOX ARMED ✓" : activeStage === 2 ? "SPINNING UP..." : "STANDBY"}
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
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF" }}>Valkyrie Non-Destructive Probe</div>
                </div>
              </div>
              <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono, monospace)", color: activeStage >= 3 ? "#06B6D4" : "#64748B" }}>
                {activeStage > 3 ? "EXPLOITABLE (VULNERABLE) ⚠️" : activeStage === 3 ? "PROBING..." : "STANDBY"}
              </span>
            </div>

            {/* Stage 4: Praxis / Kinetic */}
            <div style={{
              background: activeStage >= 4 ? "rgba(245, 158, 11, 0.2)" : "rgba(255, 255, 255, 0.02)",
              border: activeStage >= 4 ? "1px solid #F59E0B" : "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "10px",
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <PraxisIcon size={24} />
                <div>
                  <div style={{ fontSize: "0.68rem", color: "#FBBF24", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>STAGE 04 &bull; REMEDIATE</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF" }}>Praxis / Kinetic In-Memory Hotpatch</div>
                </div>
              </div>
              <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono, monospace)", color: activeStage >= 4 ? "#10B981" : "#64748B" }}>
                {activeStage === 5 ? "HOST ARMORED ✓" : activeStage === 4 ? "INJECTING PATCH..." : "STANDBY"}
              </span>
            </div>

          </div>

          {/* Action Triggers */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              onClick={runSequence}
              disabled={isRunning || isMitigated}
              style={{
                flex: 1,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                background: isMitigated 
                  ? "rgba(16, 185, 129, 0.2)" 
                  : isRunning 
                  ? "rgba(0, 229, 255, 0.15)" 
                  : "linear-gradient(135deg, #00E5FF 0%, #3B82F6 100%)",
                border: isMitigated ? "1px solid #10B981" : "none",
                color: isMitigated ? "#34D399" : isRunning ? "#67E8F9" : "#030608",
                fontFamily: "var(--font-display, 'Orbitron', sans-serif)",
                fontWeight: 800,
                fontSize: "0.85rem",
                padding: "12px",
                borderRadius: "8px",
                cursor: isRunning || isMitigated ? "not-allowed" : "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {isMitigated ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>Host Armored (Mitigated)</span>
                </>
              ) : isRunning ? (
                <>
                  <Activity size={16} className="animate-spin" />
                  <span>Executing Pipeline...</span>
                </>
              ) : (
                <>
                  <Play size={16} />
                  <span>Run Closed-Loop Defense</span>
                </>
              )}
            </button>

            {isMitigated && (
              <button
                onClick={triggerRollback}
                disabled={isRunning}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  color: "#F87171",
                  fontFamily: "var(--font-mono, monospace)",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  cursor: isRunning ? "not-allowed" : "pointer"
                }}
                title="Trigger 18ms Deterministic Atomic Rollback"
              >
                <RotateCcw size={15} />
                <span>Rollback</span>
              </button>
            )}
          </div>
        </div>

        {/* RIGHT PANE: Live Terminal Telemetry Output */}
        <div style={{
          background: "#050811",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "12px",
          padding: "14px",
          display: "flex",
          flexDirection: "column",
          fontFamily: "var(--font-mono, monospace)",
          minHeight: "360px"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "8px", marginBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Terminal size={14} color="#00E5FF" />
              <span style={{ fontSize: "0.74rem", color: "#64748B", fontWeight: 700 }}>
                TELEMETRY CONSOLE
              </span>
            </div>
            <span style={{ fontSize: "0.7rem", color: isMitigated ? "#34D399" : isRunning ? "#FDE047" : "#64748B" }}>
              {isMitigated ? "STATE: SECURED [L3 ATTESTED]" : isRunning ? "STATE: IN FLIGHT" : "STATE: IDLE"}
            </span>
          </div>

          <div 
            ref={terminalEndRef} 
            style={{ 
              flex: 1, 
              overflowY: "auto", 
              fontSize: "0.78rem", 
              lineHeight: 1.6, 
              display: "flex", 
              flexDirection: "column", 
              gap: "4px" 
            }}
          >
            {terminalLines.map((line, i) => (
              <div key={i} style={{
                color: line.includes("⚠️") || line.includes("VULNERABLE") 
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
    </div>
  );
}
