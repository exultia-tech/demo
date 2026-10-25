"use client";

import React from "react";
import Link from "next/link";
import { 
  PureIdeIcon, 
  VantageIcon, 
  PureOsIcon, 
  PraxisIcon, 
  AxiomIcon, 
  ErisIcon, 
  ValkyrieIcon,
  ExultiaLinuxIcon
} from "@/components/BrandIcons";
import { 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  Layers, 
  Activity, 
  Server, 
  Lock, 
  ChevronRight, 
  Shield, 
  Zap, 
  RotateCcw,
  Terminal,
  ExternalLink
} from "lucide-react";

export default function HomeCommandDeck() {
  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1.5rem 1rem 5rem 1rem" }}>
      
      {/* ── 1. HERO HEADLINE & SOVEREIGN MISSION ─────────────────────────────────── */}
      <section style={{ textAlign: "center", marginBottom: "4rem" }}>
        
        {/* Status Pill Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(0, 229, 255, 0.08)",
          border: "1px solid rgba(0, 229, 255, 0.25)",
          padding: "5px 14px",
          borderRadius: "20px",
          marginBottom: "1.5rem",
          fontSize: "0.78rem",
          fontFamily: "var(--font-mono, monospace)",
          color: "#67E8F9",
          letterSpacing: "0.08em",
          textTransform: "uppercase"
        }}>
          <Sparkles size={13} />
          <span>The Unified Cyber Sovereignty Ecosystem</span>
        </div>

        {/* Hero Title */}
        <h1 style={{ 
          fontFamily: "var(--font-display, 'Orbitron', sans-serif)", 
          fontSize: "clamp(2.3rem, 4.5vw, 3.8rem)", 
          fontWeight: 900, 
          color: "#FFFFFF", 
          letterSpacing: "-0.02em", 
          marginBottom: "1.25rem",
          lineHeight: 1.12
        }}>
          Autonomous Cyber Defense.
          <span style={{ 
            display: "block", 
            background: "linear-gradient(135deg, #00E5FF 0%, #38BDF8 40%, #818CF8 70%, #C084FC 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Deterministic Sovereignty.
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{ color: "#94A3B8", fontSize: "1.15rem", maxWidth: "860px", margin: "0 auto 2.5rem auto", lineHeight: 1.6 }}>
          Zero-day threats move in minutes. Upstream vendor security patches take weeks. Exultia closes the loop: continuous universal threat intelligence, a sovereign declarative operating system, and sub-second zero-downtime hotpatching.
        </p>

        {/* Action CTAs */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
          <Link
            href="/products/exultia-linux"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "linear-gradient(135deg, #06B6D4 0%, #0284C7 100%)",
              color: "#FFFFFF",
              fontFamily: "var(--font-display, 'Orbitron', sans-serif)",
              fontWeight: 800,
              fontSize: "0.95rem",
              letterSpacing: "0.04em",
              padding: "14px 26px",
              borderRadius: "10px",
              textDecoration: "none",
              boxShadow: "0 0 30px rgba(6, 182, 212, 0.4)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease"
            }}
          >
            <ExultiaLinuxIcon size={22} glow={false} />
            <span>Explore Exultia Linux (OS) →</span>
          </Link>

          <Link
            href="/account/subscription"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(0, 229, 255, 0.3)",
              color: "#E2F8FF",
              fontFamily: "var(--font-mono, monospace)",
              fontWeight: 700,
              fontSize: "0.92rem",
              padding: "14px 22px",
              borderRadius: "10px",
              textDecoration: "none",
              transition: "all 0.2s ease"
            }}
          >
            <span>Launch Console ($100/mo)</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/wiki?tab=cockpit"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(168, 85, 247, 0.12)",
              border: "1px solid rgba(168, 85, 247, 0.35)",
              color: "#D8B4FE",
              fontFamily: "var(--font-mono, monospace)",
              fontWeight: 700,
              fontSize: "0.92rem",
              padding: "14px 22px",
              borderRadius: "10px",
              textDecoration: "none",
              transition: "all 0.2s ease"
            }}
          >
            <Activity size={16} color="#C084FC" />
            <span>Live Defense Cockpit (Wiki) ↗</span>
          </Link>
        </div>

        {/* Architectural Trust Badges */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "2rem", flexWrap: "wrap", fontSize: "0.85rem", color: "#64748B", fontFamily: "var(--font-mono, monospace)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <Lock size={14} color="#00E5FF" /> 100% Zero-Telemetry Workstations
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <RotateCcw size={14} color="#10B981" /> &lt;50ms Deterministic Rollback SLA
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <ShieldCheck size={14} color="#A855F7" /> Cosign SLSA L3 Attestations
          </span>
        </div>
      </section>

      {/* ── 2. THE 4 FLAGSHIP CORE FOUNDATIONS (HIGH PROMINENCE) ───────────────── */}
      <section style={{ marginBottom: "5rem" }}>
        
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(6, 182, 212, 0.1)",
            border: "1px solid rgba(6, 182, 212, 0.25)",
            padding: "4px 14px",
            borderRadius: "20px",
            marginBottom: "0.75rem",
            fontSize: "0.74rem",
            fontFamily: "var(--font-mono, monospace)",
            color: "#22D3EE",
            letterSpacing: "0.08em",
            textTransform: "uppercase"
          }}>
            <span>The Core Defensive Architecture</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "2.1rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.5rem 0" }}>
            Four Sovereign Pillars
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "1rem", maxWidth: "680px", margin: "0 auto" }}>
            Engineered to replace fragmented point solutions with an integrated, self-healing sovereign runtime.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "1.5rem" }}>
          
          {/* PILLAR 1: Exultia Linux */}
          <Link
            href="/products/exultia-linux"
            className="glass-card"
            style={{
              padding: "2rem",
              borderRadius: "20px",
              border: "1px solid rgba(6, 182, 212, 0.3)",
              background: "linear-gradient(180deg, rgba(8, 20, 35, 0.8) 0%, rgba(15, 23, 42, 0.7) 100%)",
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 8px 30px rgba(6, 182, 212, 0.12)",
              transition: "transform 0.2s ease, border-color 0.2s ease"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                <ExultiaLinuxIcon size={46} glow={true} />
                <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono, monospace)", color: "#22D3EE", background: "rgba(6, 182, 212, 0.15)", border: "1px solid rgba(6, 182, 212, 0.35)", padding: "3px 8px", borderRadius: "5px", fontWeight: 800, textTransform: "uppercase" }}>
                  FLAGSHIP OS
                </span>
              </div>
              <h3 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "1.35rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 6px 0" }}>
                Exultia Linux
              </h3>
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.78rem", color: "#67E8F9", fontWeight: 700, marginBottom: "0.85rem" }}>
                Sovereign Declarative Operating System
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.88rem", lineHeight: 1.6, margin: "0 0 1.5rem 0" }}>
                Content-addressed, immutable OS built upon a Nix base. Resident Kinetic™ daemon autonomously patches running workloads in &lt;300ms with 0 dropped sockets and a &lt;50ms atomic rollback SLA.
              </p>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "1rem" }}>
              <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", color: "#34D399", fontWeight: 700 }}>
                • 0 Open Findings (Trivy Audit)
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#22D3EE", fontSize: "0.82rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>
                <span>Specs &amp; Image</span> <ChevronRight size={15} />
              </span>
            </div>
          </Link>

          {/* PILLAR 2: Vantage */}
          <Link
            href="/app/uvi"
            className="glass-card"
            style={{
              padding: "2rem",
              borderRadius: "20px",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              background: "linear-gradient(180deg, rgba(20, 10, 35, 0.8) 0%, rgba(15, 23, 42, 0.7) 100%)",
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 8px 30px rgba(168, 85, 247, 0.12)",
              transition: "transform 0.2s ease, border-color 0.2s ease"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                <VantageIcon size={46} />
                <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono, monospace)", color: "#C084FC", background: "rgba(168, 85, 247, 0.15)", border: "1px solid rgba(168, 85, 247, 0.35)", padding: "3px 8px", borderRadius: "5px", fontWeight: 800, textTransform: "uppercase" }}>
                  INTEL FEED
                </span>
              </div>
              <h3 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "1.35rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 6px 0" }}>
                Vantage Intel
              </h3>
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.78rem", color: "#C084FC", fontWeight: 700, marginBottom: "0.85rem" }}>
                Universal Vulnerability Aggregator
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.88rem", lineHeight: 1.6, margin: "0 0 1.5rem 0" }}>
                Real-time universal threat intelligence pipeline synchronizing 110+ authoritative registries (CISA KEV, NIST NVD, Linux vendor advisories) with algorithmic hotfix playbook synthesis.
              </p>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "1rem" }}>
              <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", color: "#C084FC", fontWeight: 700 }}>
                • 110+ Ingestion Registries
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#C084FC", fontSize: "0.82rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>
                <span>Live Feed</span> <ChevronRight size={15} />
              </span>
            </div>
          </Link>

          {/* PILLAR 3: PureIDE */}
          <Link
            href="/products/pure-ide"
            className="glass-card"
            style={{
              padding: "2rem",
              borderRadius: "20px",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              background: "linear-gradient(180deg, rgba(10, 20, 45, 0.8) 0%, rgba(15, 23, 42, 0.7) 100%)",
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 8px 30px rgba(59, 130, 246, 0.12)",
              transition: "transform 0.2s ease, border-color 0.2s ease"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                <PureIdeIcon size={46} />
                <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono, monospace)", color: "#60A5FA", background: "rgba(59, 130, 246, 0.15)", border: "1px solid rgba(59, 130, 246, 0.35)", padding: "3px 8px", borderRadius: "5px", fontWeight: 800, textTransform: "uppercase" }}>
                  DEV ENCLAVE
                </span>
              </div>
              <h3 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "1.35rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 6px 0" }}>
                PureIDE
              </h3>
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.78rem", color: "#60A5FA", fontWeight: 700, marginBottom: "0.85rem" }}>
                Zero-Telemetry Developer Workstation
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.88rem", lineHeight: 1.6, margin: "0 0 1.5rem 0" }}>
                Air-gapped, supply-chain hardened development environment. Pre-configured build isolation, automated SBOM generation, and live vulnerability linting right at compile time.
              </p>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "1rem" }}>
              <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", color: "#60A5FA", fontWeight: 700 }}>
                • 100% Egress Blocking
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#60A5FA", fontSize: "0.82rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>
                <span>Workstation</span> <ChevronRight size={15} />
              </span>
            </div>
          </Link>

          {/* PILLAR 4: Praxis */}
          <Link
            href="/app/praxis"
            className="glass-card"
            style={{
              padding: "2rem",
              borderRadius: "20px",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              background: "linear-gradient(180deg, rgba(35, 25, 10, 0.8) 0%, rgba(15, 23, 42, 0.7) 100%)",
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 8px 30px rgba(245, 158, 11, 0.12)",
              transition: "transform 0.2s ease, border-color 0.2s ease"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                <PraxisIcon size={46} />
                <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono, monospace)", color: "#FBBF24", background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.35)", padding: "3px 8px", borderRadius: "5px", fontWeight: 800, textTransform: "uppercase" }}>
                  HOTPATCH ENGINE
                </span>
              </div>
              <h3 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "1.35rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 6px 0" }}>
                Praxis &amp; Kinetic
              </h3>
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.78rem", color: "#FBBF24", fontWeight: 700, marginBottom: "0.85rem" }}>
                Autonomous Fleet Remediation
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.88rem", lineHeight: 1.6, margin: "0 0 1.5rem 0" }}>
                Sub-second in-memory patch injection engine. Enforces ring-based progressive canary rollouts, automated eBPF firewall ACL synthesis, and instant cryptographic pre-image rollbacks.
              </p>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "1rem" }}>
              <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", color: "#FBBF24", fontWeight: 700 }}>
                • 0 Disrupted TCP Sockets
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#FBBF24", fontSize: "0.82rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>
                <span>Fleet Console</span> <ChevronRight size={15} />
              </span>
            </div>
          </Link>

        </div>
      </section>

      {/* ── 3. THE 4-STAGE CONTINUOUS DEFENSE LOOP (OODA PIPELINE) ─────────────── */}
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
                Valkyrie Pentest
              </h3>
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.75rem", color: "#67E8F9", marginBottom: "0.75rem", fontWeight: 700 }}>
                Safe Breach Probes
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.85rem", lineHeight: 1.5, margin: "0 0 1rem 0" }}>
                Safe, non-destructive canary payloads confirming true exploitability before dispatching autonomous hotpatches.
              </p>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "0.75rem" }}>
              <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono, monospace)", color: "#64748B" }}>HMAC Proofs</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#06B6D4", fontSize: "0.78rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>
                <span>Probes</span> <ChevronRight size={14} />
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
                <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono, monospace)", color: "#FBBF24", background: "rgba(245, 158, 11, 0.15)", padding: "2px 7px", borderRadius: "4px", fontWeight: 800 }}>
                  04 // REMEDIATE
                </span>
              </div>
              <h3 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 4px 0" }}>
                Praxis Hotpatch
              </h3>
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.75rem", color: "#FBBF24", marginBottom: "0.75rem", fontWeight: 700 }}>
                Kinetic Memory Remediator
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.85rem", lineHeight: 1.5, margin: "0 0 1rem 0" }}>
                In-memory hotpatching and eBPF filters deployed in sub-second runtime. Zero daemon restarts. Instant atomic rollback.
              </p>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "0.75rem" }}>
              <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono, monospace)", color: "#64748B" }}>&lt;50ms Rollback</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#F59E0B", fontSize: "0.78rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>
                <span>Remediate</span> <ChevronRight size={14} />
              </span>
            </div>
          </Link>

        </div>

        {/* ── COCKPIT LINK BANNER (CALLOUT TO RESEARCH WIKI) ─── */}
        <div style={{
          marginTop: "2rem",
          background: "linear-gradient(135deg, rgba(8, 20, 35, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)",
          border: "1px solid rgba(0, 229, 255, 0.3)",
          borderRadius: "16px",
          padding: "1.5rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.25rem",
          boxShadow: "0 0 35px rgba(0, 229, 255, 0.1)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(0, 229, 255, 0.15)", border: "1px solid rgba(0, 229, 255, 0.3)", display: "grid", placeItems: "center", color: "#22D3EE" }}>
              <Terminal size={22} />
            </div>
            <div>
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#FFFFFF", fontFamily: "var(--font-display, 'Orbitron', sans-serif)" }}>
                Interactive Closed-Loop Defense Cockpit
              </div>
              <div style={{ fontSize: "0.85rem", color: "#94A3B8", marginTop: "2px" }}>
                Test simulated adversary scenarios (PHP-CGI, OpenSSH RegreSSHion, XZ backdoor) live in the Research Wiki.
              </div>
            </div>
          </div>

          <Link
            href="/wiki?tab=cockpit"
            className="btn-primary"
            style={{
              padding: "10px 22px",
              fontSize: "0.88rem",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "linear-gradient(135deg, #00E5FF 0%, #3B82F6 100%)",
              color: "#030608",
              fontWeight: 800
            }}
          >
            <span>Launch Cockpit Simulator ↗</span>
          </Link>
        </div>

      </section>

      {/* ── 4. ARCHITECTURAL COMPARISON: SOVEREIGN VS. LEGACY ─────────────────── */}
      <section style={{ marginBottom: "5rem" }}>
        
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "2rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.5rem 0" }}>
            The Sovereign Architectural Moat
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "0.95rem" }}>
            Why high-consequence enterprise infrastructure cannot rely on legacy patchwork security.
          </p>
        </div>

        <div style={{
          background: "rgba(10, 15, 26, 0.8)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          overflow: "hidden"
        }}>
          <table className="comparison-table" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)", background: "rgba(255, 255, 255, 0.02)" }}>
                <th style={{ width: "24%" }}>Capability / Metric</th>
                <th style={{ width: "38%" }}>Fragmented Legacy Vendors</th>
                <th style={{ width: "38%" }} className="sovereign-col">Exultia Sovereign Platform</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 700, color: "#FFFFFF" }}>Host Hotpatch Execution</td>
                <td style={{ color: "#F87171" }}>Disruptive service restarts, dropped TCP sockets &amp; deferred maintenance windows</td>
                <td className="sovereign-col" style={{ color: "#34D399" }}>
                  <strong>Sub-second runtime injection</strong> with 0 dropped sockets (benchmarked &lt; 350ms)
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
                  <strong>&lt;50ms Deterministic SLA</strong> (Empirical: 18.6ms pre-flight snapshot revert)
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
                  <strong>1 Unified Subscription ($100/mo)</strong> unlocking all 8 engines &amp; platforms
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </section>

      {/* ── 5. UNIFIED SOVEREIGN PLATFORM TIERS ───────────────────────────────── */}
      <section style={{ marginBottom: "4rem" }}>
        
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "2rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.5rem 0" }}>
            Transparent Unified Platform Access
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "0.95rem" }}>
            Zero per-engine surcharges. All defense technologies unified under one simple subscription.
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
              Access Community Tools
            </Link>
          </div>

          {/* Tier 2: Enterprise Sovereign (Flagship) */}
          <div style={{
            background: "linear-gradient(180deg, rgba(8, 20, 35, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)",
            border: "1px solid rgba(0, 229, 255, 0.4)",
            borderRadius: "16px",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 0 35px rgba(0, 229, 255, 0.15)",
            position: "relative"
          }}>
            <div style={{
              position: "absolute",
              top: "-11px",
              right: "20px",
              background: "linear-gradient(135deg, #00E5FF 0%, #3B82F6 100%)",
              color: "#030608",
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "0.68rem",
              fontWeight: 900,
              padding: "2px 10px",
              borderRadius: "12px",
              letterSpacing: "0.08em",
              textTransform: "uppercase"
            }}>
              MOST POPULAR
            </div>

            <div>
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.75rem", color: "#67E8F9", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Full Autonomous Defense
              </div>
              <h3 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "1.4rem", fontWeight: 900, color: "#FFFFFF", margin: "6px 0 12px 0" }}>
                Enterprise Sovereign
              </h3>
              <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#FFFFFF", fontFamily: "var(--font-display, 'Orbitron', sans-serif)", marginBottom: "1rem" }}>
                $100 <span style={{ fontSize: "0.9rem", color: "#64748B", fontWeight: 500 }}>/ month</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem 0", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "#E2E8F0" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={15} color="#00E5FF" /> Exultia Linux OS Node Deployments</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={15} color="#00E5FF" /> Full Vantage Threat Feed (110+ Registries &amp; CISA KEV)</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={15} color="#00E5FF" /> Air-Gapped PureIDE with Zero Telemetry</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={15} color="#00E5FF" /> Praxis &amp; Kinetic In-Memory Hotpatching</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={15} color="#00E5FF" /> Eris Chaos Adversary Inoculation Range</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={15} color="#00E5FF" /> Valkyrie Automated Non-Destructive Exploit Probes</li>
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
                fontFamily: "var(--font-display, 'Orbitron', sans-serif)",
                fontWeight: 900,
                fontSize: "0.85rem",
                boxShadow: "0 0 20px rgba(0, 229, 255, 0.3)"
              }}
            >
              Subscribe Now ($100/mo) →
            </Link>
          </div>

          {/* Tier 3: Sovereign Government / High-Consequence */}
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
                Defense &bull; Classified &bull; High-Consequence
              </div>
              <h3 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "1.4rem", fontWeight: 900, color: "#FFFFFF", margin: "6px 0 12px 0" }}>
                Sovereign Enclave
              </h3>
              <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#FFFFFF", fontFamily: "var(--font-display, 'Orbitron', sans-serif)", marginBottom: "1rem" }}>
                Custom <span style={{ fontSize: "0.9rem", color: "#64748B", fontWeight: 500 }}>/ annual SLA</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem 0", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "#94A3B8" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={15} color="#10B981" /> 100% Air-Gapped Datacenter Appliance Deployments</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={15} color="#10B981" /> Custom Kernel &amp; Hardware Cryptographic Roots of Trust</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={15} color="#10B981" /> Dedicated Sovereign Key Management (HSM / KMS)</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={15} color="#10B981" /> 24/7 Dedicated Principal Systems Architect Escalation</li>
              </ul>
            </div>

            <Link
              href="/support"
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
              Contact Enterprise Lab
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
