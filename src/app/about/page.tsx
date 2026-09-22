import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Exultia | Practical Tools for Security & Transparency",
  description: "Exultia builds transparent software for developer workstation security, global cyber threat intelligence, and public records accountability.",
};

export default function AboutPage() {
  return (
    <div className="fade-in" style={{ paddingBottom: "5rem" }}>
      {/* HERO */}
      <section className="hero-section" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
        <h1 className="hero-title" style={{ fontSize: "3.4rem", marginBottom: "1.25rem", letterSpacing: "-0.03em", lineHeight: 1.15 }}>
          Software Built for <span className="gradient-text">Clarity & Trust</span>
        </h1>

        <p className="hero-desc" style={{ maxWidth: "760px", margin: "0 auto", fontSize: "1.2rem", lineHeight: "1.6", color: "#94A3B8" }}>
          We build practical, transparent tools for software developers, security teams, and civic researchers.
        </p>
      </section>

      {/* CORE THESIS */}
      <section style={{ maxWidth: "1000px", margin: "0 auto 5rem auto", padding: "0 2rem" }}>
        <div className="glass-card" style={{ padding: "2.75rem", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem", color: "#FFFFFF" }}>Why Exultia?</h2>
          <p style={{ color: "#CBD5E1", fontSize: "1rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>
            Modern software and security workflows are full of black boxes. Developer tools silently phone home with telemetry. Vulnerability databases are noisy and fragmented. And navigating public records laws often feels like an uphill bureaucratic battle.
          </p>
          <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>
            Exultia builds tools where you are always in control: offline-capable development environments with verified plugins, unified threat feeds that cut through the noise, and open tools that make public-records access simple and reliable.
          </p>
          <p style={{ color: "#F8FAFC", fontSize: "1rem", lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
            Every product we build is designed to be auditable, transparent, and respectful of your privacy.
          </p>
        </div>
      </section>

      {/* THREE CORE PILLARS OF EXULTIA */}
      <section style={{ maxWidth: "1300px", margin: "0 auto 5rem auto", padding: "0 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ fontSize: "0.8rem", color: "#60A5FA", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
            Core Focus Areas
          </span>
          <h2 style={{ fontSize: "2.2rem", marginTop: "0.35rem", marginBottom: "0.5rem" }}>What We Build</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.75rem" }}>
          
          <div className="glass-card" style={{ padding: "2.25rem", borderRadius: "14px", border: "1px solid rgba(59, 130, 246, 0.25)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🛡️</div>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem", color: "#FFFFFF" }}>1. Clean Developer Toolchains</h3>
            <div style={{ fontSize: "0.85rem", color: "#60A5FA", fontWeight: 600, marginBottom: "0.75rem" }}>
              PureIDE
            </div>
            <p style={{ color: "#94A3B8", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
              Development environments shouldn&apos;t come with mystery background tracking or unvetted marketplace extensions. We make it simple to package, customize, and distribute clean, hardened IDE builds that your team can inspect and trust.
            </p>
          </div>

          <div className="glass-card" style={{ padding: "2.25rem", borderRadius: "14px", border: "1px solid rgba(139, 92, 246, 0.25)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚡</div>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem", color: "#FFFFFF" }}>2. Unified Threat Intelligence</h3>
            <div style={{ fontSize: "0.85rem", color: "#A78BFA", fontWeight: 600, marginBottom: "0.75rem" }}>
              UVI
            </div>
            <p style={{ color: "#94A3B8", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
              Security teams spend too much time sorting through duplicate and conflicting alerts. We correlate 110+ global security feeds, active zero-day trackers, and supply chain warnings into a single, high-fidelity feed.
            </p>
          </div>

          <div className="glass-card" style={{ padding: "2.25rem", borderRadius: "14px", border: "1px solid rgba(6, 182, 212, 0.25)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚖️</div>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem", color: "#FFFFFF" }}>3. Accessible Public Records</h3>
            <div style={{ fontSize: "0.85rem", color: "#22D3EE", fontWeight: 600, marginBottom: "0.75rem" }}>
              Inquest
            </div>
            <p style={{ color: "#94A3B8", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
              Government transparency is essential to a healthy democracy, but filing FOIA and state records requests is notoriously cumbersome. Inquest automates legal citations, response countdowns, and formal appeal letters for all 50 states.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 2rem" }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          borderRadius: "16px",
          padding: "3rem 2rem",
          textAlign: "center"
        }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Explore Our Tools</h2>
          <p style={{ color: "#94A3B8", maxWidth: "560px", margin: "0 auto 2rem auto", fontSize: "1.05rem" }}>
            Try our workstation builder, check live security feeds, or draft a public records request.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/console" className="btn-primary" style={{ padding: "0.9rem 2rem", fontSize: "1rem", textDecoration: "none" }}>
              Launch PureIDE →
            </Link>
            <Link href="/threat-feed" style={{ padding: "0.9rem 1.6rem", borderRadius: "10px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border-color)", color: "white", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem" }}>
              View UVI Feed →
            </Link>
            <Link href="/products/inquest" style={{ padding: "0.9rem 1.6rem", borderRadius: "10px", background: "rgba(6, 182, 212, 0.12)", border: "1px solid rgba(6, 182, 212, 0.3)", color: "#67E8F9", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem" }}>
              Open Inquest →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
