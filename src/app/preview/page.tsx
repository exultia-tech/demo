"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Shield, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  Layers, 
  Terminal, 
  Key, 
  Activity, 
  Zap, 
  Server, 
  Database, 
  FileCheck, 
  RefreshCw, 
  Globe, 
  Building2,
  ChevronRight,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import { 
  ExultiaLogo, 
  VantageIcon, 
  PraxisIcon, 
  PureIdeIcon, 
  PureOsIcon, 
  AxiomIcon, 
  ErisIcon, 
  CrucibleIcon, 
  ValkyrieIcon, 
  DaedelusIcon 
} from "@/components/BrandIcons";

interface ProductCard {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  icon: React.ReactNode;
  tagline: string;
  description: string;
  features: string[];
}

const PRODUCTS: ProductCard[] = [
  {
    id: "kinetic",
    name: "Exultia Kinetic",
    badge: "FLAGSHIP ENGINE",
    badgeColor: "#00E5FF",
    icon: <Cpu size={28} color="#00E5FF" />,
    tagline: "Autonomous Linux Kernel Hotpatching",
    description: "Kernel-level remediation engine with sub-second deterministic rollback (<1ms). Operates zero-agent and air-gapped without requiring reboots.",
    features: [
      "Sub-second deterministic rollback (0.69ms verified)",
      "Zero-agent standalone ELF binary & universal zipapp",
      "Cryptographic pre- and post-flight state verification",
      "Automated canary staging & Ansible 10% formatting"
    ]
  },
  {
    id: "vantage",
    name: "Vantage / UVI",
    badge: "GLOBAL RADAR",
    badgeColor: "#F59E0B",
    icon: <VantageIcon size={28} />,
    tagline: "Universal Vulnerability Index (6,400+ Feeds)",
    description: "Multi-feed cyber radar aggregating live advisories from CISA KEV, OSV, ThreatFox, URLhaus, and national CERTs into actionable directives.",
    features: [
      "Real-time ingestion of 6,400+ active threat advisories",
      "Direct build-pipeline impact correlation",
      "Automated CVSS v3/v4 score normalization",
      "SLSA Level 3 cryptographic feed provenance"
    ]
  },
  {
    id: "argent",
    name: "Exultia Argent",
    badge: "AUTO-SYNTHESIS",
    badgeColor: "#34D399",
    icon: <Activity size={28} color="#34D399" />,
    tagline: "Autonomous OS Vulnerability Remediation",
    description: "Synthesizes targeted vendor remediation packages across Ubuntu, Debian, RedHat, and Alpine Linux distributions in under 0.1ms per advisory.",
    features: [
      "Multi-distro patch synthesis (deb, rpm, apk)",
      "Automated vendor baseline dependency resolution",
      "Hermetic test execution against simulated CVE vectors",
      "Sub-second rollback snapshot binding"
    ]
  },
  {
    id: "axiom",
    name: "Exultia Axiom",
    badge: "COMPLIANCE & LMS",
    badgeColor: "#A78BFA",
    icon: <AxiomIcon size={28} />,
    tagline: "Workforce Verification & Exam Simulation",
    description: "Enterprise security assessment platform featuring hands-on interactive exams, live threat evaluation, and LMS integration feeds.",
    features: [
      "Progressive exam evaluation without answer leakage",
      "Gated LMS simulator embedding feeds for Enterprise",
      "NIST SP 800-53 & CIS Controls mapping",
      "Automated compliance audit export (PDF/JSON)"
    ]
  },
  {
    id: "praxis",
    name: "Exultia Praxis",
    badge: "FLEET DELIVERY",
    badgeColor: "#38BDF8",
    icon: <PraxisIcon size={28} />,
    tagline: "Continuous Patch Distribution & CBOM",
    description: "Automates fleet-wide deployment orchestration and Cryptographic Bill of Materials (CBOM) compilation with immutable provenance.",
    features: [
      "Cryptographic Bill of Materials (CBOM) generation",
      "Canary rollout rings with anomaly self-abort",
      "Multi-node fleet staging and license attestation",
      "Continuous verification against Vantage intelligence"
    ]
  },
  {
    id: "pureide",
    name: "PureIDE & PureOS",
    badge: "IMMUTABLE WORKSPACE",
    badgeColor: "#EC4899",
    icon: <PureIdeIcon size={28} />,
    tagline: "Hardened Developer OS & Sandboxed IDE",
    description: "Tamper-proof Linux workstation with read-only root filesystems and cryptographically isolated extension execution environments.",
    features: [
      "Immutable system partitions with self-healing overlays",
      "Hermetic build sandboxes preventing supply-chain attacks",
      "Native offline air-gapped developer toolchains",
      "Zero telemetry leakage with strict egress firewalls"
    ]
  }
];

export default function PreviewHoldingPage() {
  const [passkey, setPasskey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unlockedTier, setUnlockedTier] = useState<string | null>(null);
  const passkeyInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const autoKey = params.get("key");
      const errParam = params.get("error");

      if (autoKey) {
        window.location.href = `/api/preview/unlock?key=${encodeURIComponent(autoKey)}`;
      } else if (errParam === "invalid_key") {
        setError("Invalid authorization passkey. Please check your credentials or request an Enterprise VIP pass.");
      }
    }
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/preview/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: passkey }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Access denied. Invalid operator passkey.");
      } else {
        setUnlockedTier(data.tier || "operator");
        setTimeout(() => {
          window.location.href = data.redirect || "/";
        }, 600);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Failed to authenticate passkey");
    } finally {
      setLoading(false);
    }
  };

  const scrollToPortal = () => {
    const el = document.getElementById("access-portal");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        passkeyInputRef.current?.focus();
      }, 500);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at 50% 0%, #08111e 0%, #030608 100%)",
      color: "#E2F8FF",
      fontFamily: "var(--font-body, 'Inter', sans-serif)",
      position: "relative",
      overflowX: "hidden",
    }}>
      {/* Background Cyber Ambient Glows */}
      <div style={{
        position: "fixed",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "1000px",
        height: "500px",
        background: "radial-gradient(ellipse at top, rgba(0, 229, 255, 0.12) 0%, rgba(59, 130, 246, 0.04) 50%, transparent 80%)",
        filter: "blur(90px)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Top Header Navigation */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(16px)",
        background: "rgba(3, 6, 8, 0.75)",
        borderBottom: "1px solid rgba(0, 229, 255, 0.15)",
        padding: "1rem 2rem",
      }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}>
          {/* Logo Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ExultiaLogo size={36} palette="cyan" glow />
            <div>
              <div style={{
                fontFamily: "var(--font-display, 'Orbitron', sans-serif)",
                fontSize: "1.15rem",
                fontWeight: 900,
                letterSpacing: "0.08em",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}>
                EXULTIA
                <span style={{ fontSize: "0.75rem", color: "#00E5FF", fontWeight: 700, letterSpacing: "0.05em" }}>
                  SECURITY
                </span>
              </div>
              <div style={{ fontSize: "0.7rem", color: "#7E9EA8", letterSpacing: "0.04em" }}>
                Autonomous Self-Healing Linux
              </div>
            </div>
          </div>

          {/* Staging Pill & Quick Unlock */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{
              display: "none",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "9999px",
              background: "rgba(245, 158, 11, 0.12)",
              border: "1px solid rgba(245, 158, 11, 0.35)",
              color: "#FBBF24",
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }} className="desktop-pill">
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#F59E0B" }} />
              Pre-Launch Staging
            </div>

            <button
              onClick={scrollToPortal}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "0.55rem 1.1rem",
                borderRadius: "10px",
                background: "linear-gradient(135deg, rgba(0, 229, 255, 0.15) 0%, rgba(0, 112, 186, 0.25) 100%)",
                border: "1px solid rgba(0, 229, 255, 0.4)",
                color: "#00E5FF",
                fontSize: "0.82rem",
                fontWeight: 800,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <Key size={14} />
              <span>Enter Passkey</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 1.5rem 6rem 1.5rem", position: "relative", zIndex: 1 }}>
        
        {/* HERO SECTION */}
        <section style={{ textAlign: "center", maxWidth: "920px", margin: "0 auto 4rem auto" }}>
          
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "5px 16px",
            borderRadius: "9999px",
            background: "rgba(0, 229, 255, 0.1)",
            border: "1px solid rgba(0, 229, 255, 0.3)",
            color: "#00E5FF",
            fontSize: "0.78rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "1.5rem",
          }}>
            <Sparkles size={14} />
            <span>Next-Generation Autonomous Linux Defense Architecture</span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-display, 'Orbitron', sans-serif)",
            fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: "#FFFFFF",
            marginBottom: "1.25rem",
          }}>
            Autonomous Threat Remediation & Self-Healing Operating Systems
          </h1>

          <p style={{
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            color: "#94A3B8",
            lineHeight: 1.6,
            maxWidth: "780px",
            margin: "0 auto 2.5rem auto",
          }}>
            Exultia synthesizes real-time vulnerability intelligence into deterministic, kernel-level hotpatches with sub-second rollback — engineered for high-assurance infrastructure, defense operations, and zero-trust fleets.
          </p>

          {/* Quick Metrics Bar */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
            background: "rgba(6, 12, 16, 0.8)",
            border: "1px solid rgba(0, 229, 255, 0.2)",
            borderRadius: "18px",
            padding: "1.5rem",
            backdropFilter: "blur(12px)",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
            marginBottom: "3.5rem",
          }}>
            <div>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#00E5FF", fontFamily: "var(--font-mono, monospace)" }}>
                0.69ms
              </div>
              <div style={{ fontSize: "0.78rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "4px" }}>
                Sub-Second Rollback
              </div>
            </div>
            <div>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#34D399", fontFamily: "var(--font-mono, monospace)" }}>
                6,400+
              </div>
              <div style={{ fontSize: "0.78rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "4px" }}>
                Live Vantage Feeds
              </div>
            </div>
            <div>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#F59E0B", fontFamily: "var(--font-mono, monospace)" }}>
                SLSA L3
              </div>
              <div style={{ fontSize: "0.78rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "4px" }}>
                Cryptographic Provenance
              </div>
            </div>
            <div>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#A78BFA", fontFamily: "var(--font-mono, monospace)" }}>
                100%
              </div>
              <div style={{ fontSize: "0.78rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "4px" }}>
                Zero-Agent Standalone
              </div>
            </div>
          </div>
        </section>

        {/* PASSKEY UNLOCK & VIP PORTAL MODULE */}
        <section id="access-portal" style={{
          maxWidth: "580px",
          margin: "0 auto 6rem auto",
          background: "linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(6, 12, 16, 0.95) 100%)",
          border: "1px solid rgba(0, 229, 255, 0.35)",
          borderRadius: "24px",
          padding: "2.5rem 2rem",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px rgba(0, 229, 255, 0.15)",
          position: "relative",
          backdropFilter: "blur(16px)",
        }}>
          {/* Top Passkey Icon */}
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, rgba(0, 229, 255, 0.2) 0%, rgba(59, 130, 246, 0.3) 100%)",
            border: "1px solid rgba(0, 229, 255, 0.4)",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 1.25rem auto",
            color: "#00E5FF",
            boxShadow: "0 0 20px rgba(0, 229, 255, 0.25)",
          }}>
            <Lock size={26} />
          </div>

          <h2 style={{
            fontFamily: "var(--font-display, 'Orbitron', sans-serif)",
            fontSize: "1.45rem",
            fontWeight: 800,
            textAlign: "center",
            color: "#FFFFFF",
            marginBottom: "0.4rem",
          }}>
            Private Preview & VIP Access
          </h2>

          <p style={{
            fontSize: "0.86rem",
            color: "#94A3B8",
            textAlign: "center",
            lineHeight: 1.5,
            marginBottom: "1.75rem",
          }}>
            Authorized operators and enterprise clients can unlock full workspace access using their assigned passkey.
          </p>

          {error && (
            <div style={{
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.35)",
              borderRadius: "10px",
              padding: "0.75rem 1rem",
              color: "#FCA5A5",
              fontSize: "0.82rem",
              marginBottom: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          {unlockedTier && (
            <div style={{
              background: "rgba(52, 211, 153, 0.15)",
              border: "1px solid rgba(52, 211, 153, 0.35)",
              borderRadius: "10px",
              padding: "0.75rem 1rem",
              color: "#34D399",
              fontSize: "0.85rem",
              fontWeight: 700,
              marginBottom: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <CheckCircle2 size={16} />
              <span>Passkey verified ({unlockedTier.toUpperCase()}). Redirecting to workspace...</span>
            </div>
          )}

          <form onSubmit={handleUnlock} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            <div style={{ position: "relative" }}>
              <Key size={16} color="#64748B" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                ref={passkeyInputRef}
                type="password"
                placeholder="Enter Operator or Enterprise VIP Passkey..."
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem 0.85rem 2.6rem",
                  background: "rgba(0, 0, 0, 0.5)",
                  border: "1px solid rgba(0, 229, 255, 0.25)",
                  borderRadius: "12px",
                  color: "#FFFFFF",
                  fontSize: "0.88rem",
                  outline: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#00E5FF";
                  e.target.style.boxShadow = "0 0 15px rgba(0, 229, 255, 0.25)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(0, 229, 255, 0.25)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.9rem",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #00E5FF 0%, #0070BA 100%)",
                color: "#030712",
                fontWeight: 800,
                fontSize: "0.92rem",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 0 25px rgba(0, 229, 255, 0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "transform 0.15s ease",
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="spin" />
                  <span>Authenticating Passkey...</span>
                </>
              ) : (
                <>
                  <span>Unlock Workspace</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Notice */}
          <div style={{
            marginTop: "1.25rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            textAlign: "center",
            fontSize: "0.75rem",
            color: "#64748B",
            lineHeight: 1.5,
          }}>
            Evaluator passes grant instant Enterprise access across all flagship modules without sign-up. Contact your Exultia representative for an access code.
          </div>
        </section>

        {/* CORE ARCHITECTURE: 4-STEP PIPELINE */}
        <section style={{ marginBottom: "6rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{
              fontFamily: "var(--font-display, 'Orbitron', sans-serif)",
              fontSize: "2rem",
              fontWeight: 800,
              color: "#FFFFFF",
              marginBottom: "0.5rem",
            }}>
              Closed-Loop Autonomous Defense Cycle
            </h2>
            <p style={{ color: "#7E9EA8", fontSize: "0.95rem" }}>
              How Exultia detects, isolates, remediates, and verifies Linux threats in real time.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.25rem",
          }}>
            {[
              {
                step: "01",
                title: "Threat Ingestion",
                desc: "Vantage polls 6,400+ vulnerability databases (CISA KEV, OSV, national CERTs) and calculates build-pipeline exposure.",
                accent: "#00E5FF",
              },
              {
                step: "02",
                title: "Patch Synthesis",
                desc: "Argent generates targeted binary and configuration mitigations tailored to your specific kernel and distribution in <0.1ms.",
                accent: "#34D399",
              },
              {
                step: "03",
                title: "Live Execution",
                desc: "Kinetic hotpatches the running kernel zero-agent without rebooting, continuously verifying memory safety.",
                accent: "#F59E0B",
              },
              {
                step: "04",
                title: "Sub-Second Rollback",
                desc: "If any behavioral anomaly occurs, Kinetic executes sub-second deterministic rollback (0.69ms) to verified pre-flight baseline.",
                accent: "#EC4899",
              },
            ].map((st, i) => (
              <div key={i} style={{
                background: "rgba(6, 12, 16, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "18px",
                padding: "2rem 1.5rem",
                position: "relative",
                transition: "border-color 0.2s",
              }}>
                <div style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "1.8rem",
                  fontWeight: 900,
                  color: st.accent,
                  marginBottom: "0.75rem",
                  opacity: 0.8,
                }}>
                  {st.step}
                </div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.5rem" }}>
                  {st.title}
                </h3>
                <p style={{ color: "#94A3B8", fontSize: "0.85rem", lineHeight: 1.6 }}>
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FLAGSHIP PRODUCT SUITE GRID */}
        <section style={{ marginBottom: "6rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{
              fontFamily: "var(--font-display, 'Orbitron', sans-serif)",
              fontSize: "2rem",
              fontWeight: 800,
              color: "#FFFFFF",
              marginBottom: "0.5rem",
            }}>
              Exultia Enterprise Suite
            </h2>
            <p style={{ color: "#7E9EA8", fontSize: "0.95rem" }}>
              Integrated modular defenses spanning the entire operating system, build pipeline, and developer workstation.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "1.5rem",
          }}>
            {PRODUCTS.map((prod) => (
              <div key={prod.id} style={{
                background: "rgba(6, 12, 16, 0.85)",
                border: "1px solid rgba(0, 229, 255, 0.15)",
                borderRadius: "20px",
                padding: "2.25rem 1.75rem",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
              }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    display: "grid",
                    placeItems: "center",
                  }}>
                    {prod.icon}
                  </div>
                  <span style={{
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    background: `${prod.badgeColor}15`,
                    color: prod.badgeColor,
                    border: `1px solid ${prod.badgeColor}40`,
                  }}>
                    {prod.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.2rem" }}>
                  {prod.name}
                </h3>
                <div style={{ fontSize: "0.82rem", color: prod.badgeColor, fontWeight: 600, marginBottom: "0.85rem" }}>
                  {prod.tagline}
                </div>
                <p style={{ color: "#94A3B8", fontSize: "0.86rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                  {prod.description}
                </p>

                {/* Features List */}
                <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "1.25rem", marginTop: "auto" }}>
                  <div style={{ fontSize: "0.72rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
                    Verified Capabilities
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                    {prod.features.map((feat, fi) => (
                      <li key={fi} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "0.8rem", color: "#CBD5E1" }}>
                        <CheckCircle2 size={14} color={prod.badgeColor} style={{ marginTop: "2px", flexShrink: 0 }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ENTERPRISE COMPLIANCE & SECURITY HIGHLIGHTS */}
        <section style={{
          background: "linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(6, 12, 16, 0.8) 100%)",
          border: "1px solid rgba(0, 229, 255, 0.2)",
          borderRadius: "24px",
          padding: "3rem 2.5rem",
          marginBottom: "4rem",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2.5rem",
            alignItems: "center",
          }}>
            <div>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.74rem",
                color: "#34D399",
                background: "rgba(52, 211, 153, 0.1)",
                border: "1px solid rgba(52, 211, 153, 0.3)",
                padding: "3px 10px",
                borderRadius: "9999px",
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}>
                <ShieldCheck size={14} />
                Government & Enterprise Grade
              </div>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.75rem" }}>
                Built for High-Assurance Corporate Environments
              </h2>
              <p style={{ color: "#94A3B8", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                Fully compliant with corporate network gateways and strict inspection proxies including Zscaler, Cisco Umbrella, and Palo Alto Networks.
              </p>
              <button
                onClick={scrollToPortal}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "12px",
                  background: "rgba(0, 229, 255, 0.15)",
                  border: "1px solid rgba(0, 229, 255, 0.4)",
                  color: "#00E5FF",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                }}
              >
                <span>Request Enterprise Evaluation Pass</span>
                <ChevronRight size={16} />
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[
                { label: "Strict HSTS", sub: "Preload & Subdomains", val: "31.5M sec" },
                { label: "Content Security Policy", sub: "Strict XSS Defense", val: "Enforced" },
                { label: "NIST SP 800-207", sub: "Zero-Trust Architecture", val: "Compliant" },
                { label: "Air-Gapped Ops", sub: "Zero Egress Required", val: "Supported" },
              ].map((c, ci) => (
                <div key={ci} style={{
                  background: "rgba(0, 0, 0, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "14px",
                  padding: "1.25rem",
                }}>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "2px" }}>
                    {c.val}
                  </div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#00E5FF" }}>
                    {c.label}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "#64748B", marginTop: "2px" }}>
                    {c.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        background: "rgba(3, 6, 8, 0.9)",
        padding: "3rem 1.5rem 2rem 1.5rem",
        textAlign: "center",
        fontSize: "0.8rem",
        color: "#64748B",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
            <ExultiaLogo size={24} palette="cyan" />
            <span style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontWeight: 800, color: "#FFFFFF", fontSize: "0.9rem" }}>
              EXULTIA TECHNOLOGIES
            </span>
          </div>
          <p style={{ margin: "0 0 1.25rem 0", maxWidth: "600px", marginInline: "auto", lineHeight: 1.5 }}>
            Proprietary and Confidential. Autonomous Threat Remediation, Real-Time Vulnerability Intelligence, and Continuous Self-Healing for Linux.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", fontSize: "0.78rem" }}>
            <span>© 2026 Exultia Technologies, PBC. All rights reserved.</span>
            <span>•</span>
            <span style={{ color: "#00E5FF", cursor: "pointer" }} onClick={scrollToPortal}>Enterprise Passkey Portal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
