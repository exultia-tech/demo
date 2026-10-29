import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ExultiaLinuxIcon, PraxisIcon, VantageIcon } from "@/components/BrandIcons";
import ExultiaLinuxClientView from "./ExultiaLinuxClientView";

export const metadata: Metadata = {
  title: "Exultia | Portable Autonomous Threat Remediation Daemon for Linux",
  description:
    "Portable autonomous threat remediation daemon for Linux. Pre-baked offline UVI feed, continuous 60-second self-healing loop, in-memory patch injection, and zero downtime.",
};

export default function ExultiaLinuxProductPage() {
  return (
    <div className="fade-in" style={{ paddingBottom: "3.5rem" }}>
      {/* ── HERO SECTION ──────────────────────────────────────────────────────── */}
      <section className="hero-section" style={{ paddingTop: "2rem", paddingBottom: "1.25rem", textAlign: "center" }}>
        

        {/* Brand Icon & Glow */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem" }}>
          <ExultiaLinuxIcon size={56} glow={true} />
        </div>

        {/* Title */}
        <h1 className="hero-title" style={{ fontSize: "clamp(2.2rem, 4.2vw, 3.2rem)", marginBottom: "0.6rem", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
          <span className="gradient-text" style={{ backgroundImage: "linear-gradient(135deg, #A5F3FC 0%, #00E5FF 40%, #0284C7 70%, #0369A1 100%)" }}>
            The Portable Exultia Daemon for Linux
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle" style={{ maxWidth: "820px", margin: "0 auto 1.25rem auto", fontSize: "1.02rem", lineHeight: 1.55, color: "var(--text-muted)" }}>
          Don&apos;t wipe your servers or migrate distributions. The portable Exultia daemon drops directly onto your existing Linux infrastructure as a standalone binary, systemd service, container, or Kubernetes DaemonSet. 
          Engineered with an autonomous 60-second remediation loop, offline <strong style={{ color: "#FFFFFF" }}>24,388 UVI threat advisories</strong>, in-memory surgical trampolines, and dual-channel <strong style={{ color: "#34D399" }}>STIX 2.1 / TAXII 2.1</strong> threat ingestion.
        </p>

        {/* CTA Button Array */}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1rem" }}>
          <a 
            href="#deployment-options" 
            className="btn-primary" 
            style={{ 
              padding: "0.7rem 1.6rem", 
              fontSize: "0.9rem", 
              textDecoration: "none", 
              background: "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
              boxShadow: "0 0 20px rgba(0, 229, 255, 0.35)",
              fontWeight: 700
            }}
          >
            Deploy Exultia Daemon →
          </a>
        </div>
      </section>

      {/* ── CLIENT INTERACTIVE VIEW ─────── */}
      <ExultiaLinuxClientView />
    </div>
  );
}
