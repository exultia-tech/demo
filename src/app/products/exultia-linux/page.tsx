import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ExultiaLinuxIcon, PureOsIcon, PraxisIcon, VantageIcon } from "@/components/BrandIcons";
import ExultiaLinuxClientView from "./ExultiaLinuxClientView";

export const metadata: Metadata = {
  title: "Exultia Linux | Sovereign Declarative Operating System",
  description:
    "The official sovereign Linux operating system with continuous autonomous threat remediation, zero-downtime hotpatching, and guaranteed sub-50ms atomic rollbacks.",
};

export default function ExultiaLinuxProductPage() {
  return (
    <div className="fade-in" style={{ paddingBottom: "6rem" }}>
      {/* ── HERO SECTION ──────────────────────────────────────────────────────── */}
      <section className="hero-section" style={{ paddingTop: "3.5rem", paddingBottom: "4rem", textAlign: "center" }}>
        
        {/* Status Pill Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(6, 182, 212, 0.12)", border: "1px solid rgba(6, 182, 212, 0.35)", padding: "6px 16px", borderRadius: "999px", marginBottom: "1.75rem" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22D3EE", boxShadow: "0 0 10px #22D3EE" }} />
          <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.82rem", fontWeight: 700, color: "#67E8F9", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Sovereign OS • Kinetic™ Engine Native • Declarative Immutability
          </span>
        </div>

        {/* Brand Icon & Glow */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <ExultiaLinuxIcon size={76} glow={true} />
        </div>

        {/* Title */}
        <h1 className="hero-title" style={{ fontSize: "3.8rem", marginBottom: "1.25rem", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
          <span className="gradient-text" style={{ backgroundImage: "linear-gradient(135deg, #E0F2FE 0%, #38BDF8 40%, #22D3EE 70%, #10B981 100%)" }}>
            Exultia Linux
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle" style={{ maxWidth: "820px", margin: "0 auto 2.5rem auto", fontSize: "1.18rem", lineHeight: 1.6, color: "var(--text-muted)" }}>
          The sovereign, declarative operating system engineered for high-consequence enterprise infrastructure.
          Built on a cryptographically immutable base, Exultia Linux continuously monitors its running workloads,
          applies surgical zero-downtime hotfixes with <strong style={{ color: "#22D3EE" }}>sub-second runtime execution</strong>, and provides
          a guaranteed <strong style={{ color: "#34D399" }}>&lt;50ms deterministic rollback SLA</strong> with zero dropped TCP sockets.
        </p>

        {/* CTA Button Array */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3rem" }}>
          <a 
            href="#deployment-options" 
            className="btn-primary" 
            style={{ 
              padding: "0.95rem 2.25rem", 
              fontSize: "1rem", 
              textDecoration: "none", 
              background: "linear-gradient(135deg, #06B6D4 0%, #0284C7 100%)",
              boxShadow: "0 0 25px rgba(6, 182, 212, 0.4)",
              fontWeight: 700
            }}
          >
            Deploy Virtual Appliance →
          </a>
          <a 
            href="#interactive-telemetry" 
            style={{ 
              padding: "0.95rem 1.85rem", 
              borderRadius: "10px", 
              background: "rgba(255,255,255,0.06)", 
              border: "1px solid rgba(255, 255, 255, 0.15)", 
              color: "white", 
              textDecoration: "none", 
              fontWeight: 600, 
              fontSize: "0.95rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <span>▶</span> View Live Sentinel Telemetry
          </a>
          <Link 
            href="/account/subscription" 
            style={{ 
              padding: "0.95rem 1.85rem", 
              borderRadius: "10px", 
              background: "rgba(16, 185, 129, 0.15)", 
              border: "1px solid rgba(16, 185, 129, 0.35)", 
              color: "#34D399", 
              textDecoration: "none", 
              fontWeight: 700, 
              fontSize: "0.95rem" 
            }}
          >
            Fleet Enterprise Plans
          </Link>
        </div>

        {/* Key Metrics Banner */}
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", padding: "0 1rem" }}>
          <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "1.25rem 1rem", borderRadius: "14px" }}>
            <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "1.8rem", fontWeight: 900, color: "#38BDF8" }}>Sub-Second</div>
            <div style={{ fontSize: "0.82rem", color: "#94A3B8", marginTop: "4px" }}>Local Runtime Hotfix (~300ms)</div>
          </div>
          <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "1.25rem 1rem", borderRadius: "14px" }}>
            <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "1.8rem", fontWeight: 900, color: "#34D399" }}>0 Sockets</div>
            <div style={{ fontSize: "0.82rem", color: "#94A3B8", marginTop: "4px" }}>Disrupted During Patching</div>
          </div>
          <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "1.25rem 1rem", borderRadius: "14px" }}>
            <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "1.8rem", fontWeight: 900, color: "#FBBF24" }}>&lt; 50ms</div>
            <div style={{ fontSize: "0.82rem", color: "#94A3B8", marginTop: "4px" }}>Deterministic Rollback SLA</div>
          </div>
          <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "1.25rem 1rem", borderRadius: "14px" }}>
            <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "1.8rem", fontWeight: 900, color: "#A7F3D0" }}>0 Findings</div>
            <div style={{ fontSize: "0.82rem", color: "#94A3B8", marginTop: "4px" }}>Continuous Trivy Rootfs Audit</div>
          </div>
        </div>
      </section>

      {/* ── CLIENT INTERACTIVE VIEW (TERMINAL + COMPARISONS + FLAKE CODE) ─────── */}
      <ExultiaLinuxClientView />
    </div>
  );
}
