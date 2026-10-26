import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { DaedelusIcon } from "@/components/BrandIcons";
import DaedelusClientView from "./DaedelusClientView";

export const metadata: Metadata = {
  title: "Daedelus | Sovereign Developer Platform & Clean-Room Artifact Forge",
  description:
    "The unified sovereign developer ecosystem: air-gapped workstations, locked hermetic blueprints, negative-admission zero-CVE packages, distroless OCI containers, and autonomous retroactive self-healing.",
};

export default function DaedelusPage() {
  return (
    <div className="fade-in" style={{ paddingBottom: "6rem" }}>
      {/* ── HERO SECTION ──────────────────────────────────────────────────────── */}
      <section className="hero-section" style={{ paddingTop: "3.5rem", paddingBottom: "3rem", textAlign: "center" }}>
        
        {/* Status Pill Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.35)", padding: "6px 18px", borderRadius: "999px", marginBottom: "1.75rem" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#34D399", boxShadow: "0 0 10px #34D399" }} />
          <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.82rem", fontWeight: 700, color: "#6EE7B7", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Daedelus • Workstations • Packages • Containers • Zero CVEs
          </span>
        </div>

        {/* Brand Icon & Glow */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <DaedelusIcon size={80} glow={true} />
        </div>

        {/* Title */}
        <h1 className="hero-title" style={{ fontSize: "4rem", marginBottom: "1.25rem", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
          <span className="gradient-text" style={{ backgroundImage: "linear-gradient(135deg, #ECFDF5 0%, #34D399 40%, #06B6D4 70%, #3B82F6 100%)" }}>
            Daedelus
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle" style={{ maxWidth: "840px", margin: "0 auto 2.5rem auto", fontSize: "1.18rem", lineHeight: 1.6, color: "var(--text-muted)" }}>
          The sovereign developer platform and clean-room artifact forge.
          Engineered to eradicate software supply chain vulnerabilities at every layer:
          from <strong style={{ color: "#FFFFFF" }}>air-gapped workstations</strong>, to <strong style={{ color: "#34D399" }}>negative-admission zero-CVE packages</strong>, to <strong style={{ color: "#22D3EE" }}>hardened distroless OCI containers</strong> with continuous retroactive self-healing.
        </p>

        {/* Quick Highlights Counter */}
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", 
            gap: "1rem", 
            maxWidth: "880px", 
            margin: "0 auto 3rem auto" 
          }}
        >
          <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(16, 185, 129, 0.25)", borderRadius: "12px", padding: "1rem" }}>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#34D399", fontFamily: "var(--font-mono, monospace)" }}>
              0
            </div>
            <div style={{ fontSize: "0.78rem", color: "#94A3B8", fontWeight: 700, textTransform: "uppercase" }}>
              Admitted CVEs
            </div>
          </div>

          <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(6, 182, 212, 0.25)", borderRadius: "12px", padding: "1rem" }}>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#22D3EE", fontFamily: "var(--font-mono, monospace)" }}>
              &lt; 50ms
            </div>
            <div style={{ fontSize: "0.78rem", color: "#94A3B8", fontWeight: 700, textTransform: "uppercase" }}>
              ABI-Verified Swap
            </div>
          </div>

          <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(139, 92, 246, 0.25)", borderRadius: "12px", padding: "1rem" }}>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#A78BFA", fontFamily: "var(--font-mono, monospace)" }}>
              100%
            </div>
            <div style={{ fontSize: "0.78rem", color: "#94A3B8", fontWeight: 700, textTransform: "uppercase" }}>
              Air-Gapped &amp; Hermetic
            </div>
          </div>

          <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(245, 158, 11, 0.25)", borderRadius: "12px", padding: "1rem" }}>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#FBBF24", fontFamily: "var(--font-mono, monospace)" }}>
              SLSA 4
            </div>
            <div style={{ fontSize: "0.78rem", color: "#94A3B8", fontWeight: 700, textTransform: "uppercase" }}>
              Signed OpenVEX
            </div>
          </div>
        </div>
      </section>

      {/* ── CLIENT INTERACTIVE TABS & TESTBED ─────────────────────────────────── */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        <DaedelusClientView />
      </section>
    </div>
  );
}
