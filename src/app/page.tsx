import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exultia | High-Assurance Deterministic Computing",
  description: "Exultia (exultia.tech) engineers deterministic infrastructure across zero-trust developer workstations (PureIDE), universal threat intelligence (UVI), and statutory open records compliance (Inquest).",
};

export default function HomePage() {
  return (
    <div className="fade-in" style={{ paddingBottom: "5rem" }}>
      {/* COMPACT SPLASH HERO */}
      <section className="hero-section" style={{ paddingTop: "3.5rem", paddingBottom: "3rem" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(59, 130, 246, 0.1)",
          border: "1px solid rgba(59, 130, 246, 0.25)",
          borderRadius: "999px",
          padding: "5px 16px",
          marginBottom: "1.5rem",
          boxShadow: "0 0 20px rgba(59, 130, 246, 0.15)"
        }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3B82F6", boxShadow: "0 0 8px #3B82F6" }} />
          <span style={{ fontSize: "0.82rem", color: "#93C5FD", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            High-Assurance Deterministic Systems
          </span>
        </div>

        <h1 className="hero-title" style={{ fontSize: "3.6rem", marginBottom: "1.25rem", letterSpacing: "-0.035em", lineHeight: 1.12 }}>
          Provable Trust. <br/>
          <span className="gradient-text">Deterministic Certainty.</span>
        </h1>

        <p className="hero-desc" style={{ maxWidth: "720px", marginBottom: "0", fontSize: "1.2rem", lineHeight: "1.65", color: "#94A3B8" }}>
          Exultia engineers deterministic infrastructure across zero-trust developer workstations, universal cyber threat intelligence, and statutory open records compliance.
        </p>
      </section>

      {/* CORE INFRASTRUCTURE PLATFORMS */}
      <section style={{ maxWidth: "1200px", margin: "0 auto 4rem auto", padding: "0 2rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#60A5FA", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Flagship Platforms
          </div>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#FFFFFF", marginTop: "4px" }}>
            Core Enterprise Infrastructure
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "1rem", maxWidth: "700px", margin: "0.4rem 0 0 0" }}>
            Deterministic developer workstations and synchronized threat intelligence engineered for zero-trust, high-assurance cyber defense.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "2rem" }}>
          
          {/* PRODUCT 1: PUREIDE */}
          <div className="glass-card" style={{
            padding: "2.5rem 2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            borderRadius: "18px",
            background: "linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(10, 15, 26, 0.95) 100%)",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
            marginBottom: 0
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #3B82F6, #2563EB)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)"
                }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <span className="badge badge-blue">Platform 01</span>
              </div>

              <h3 style={{ fontSize: "1.75rem", marginBottom: "0.4rem", color: "#FFFFFF", fontWeight: 700 }}>PureIDE</h3>
              <div style={{ color: "#60A5FA", fontWeight: 600, fontSize: "0.92rem", marginBottom: "1rem" }}>
                Zero-Trust Workstation Compiler
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "2rem" }}>
                Stateless compilation of sealed, air-gapped developer environments. Enforces extension socket firewalls, strips ambient telemetry, and outputs verifiable CycloneDX 1.5 SBOMs.
              </p>
            </div>

            <div>
              <Link 
                href="/products/pure-ide" 
                className="btn-primary" 
                style={{ width: "100%", textAlign: "center", textDecoration: "none", padding: "0.9rem", fontSize: "0.95rem", fontWeight: 600 }}>
                Explore PureIDE →
              </Link>
            </div>
          </div>

          {/* PRODUCT 2: UVI THREAT FEED */}
          <div className="glass-card" style={{
            padding: "2.5rem 2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            borderRadius: "18px",
            background: "linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(10, 15, 26, 0.95) 100%)",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
            marginBottom: 0
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)"
                }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <span className="badge badge-purple">Platform 02</span>
              </div>

              <h3 style={{ fontSize: "1.75rem", marginBottom: "0.4rem", color: "#FFFFFF", fontWeight: 700 }}>UVI Threat Feed</h3>
              <div style={{ color: "#A78BFA", fontWeight: 600, fontSize: "0.92rem", marginBottom: "1rem" }}>
                Universal Threat Intelligence & CVE Registry
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "2rem" }}>
                Cross-correlating 55 synchronized upstream cyber intelligence streams into normalized, pre-assigned UVI records with dual-perspective exposure scoring.
              </p>
            </div>

            <div>
              <Link 
                href="/threat-feed" 
                className="btn-primary" 
                style={{ width: "100%", textAlign: "center", textDecoration: "none", padding: "0.9rem", fontSize: "0.95rem", fontWeight: 600, background: "linear-gradient(135deg, #8B5CF6, #6366F1)" }}>
                Explore Threat Feed →
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* STANDALONE FOIA & PUBLIC RECORDS UTILITIES */}
      <section style={{ maxWidth: "1200px", margin: "0 auto 4.5rem auto", padding: "0 2rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#06B6D4", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Independent Public Utilities
          </div>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#FFFFFF", marginTop: "4px" }}>
            Standalone FOIA & Statutory Records Tools
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "1rem", maxWidth: "780px", margin: "0.4rem 0 0 0" }}>
            Maintained as independent, standalone tools for investigative researchers, journalists, and legal counsel to enforce open records mandates without coupling to enterprise developer toolchains.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "2rem" }}>
          
          {/* TOOL 1: EXULTIA INQUEST */}
          <div className="glass-card" style={{
            padding: "2.25rem 2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "1px solid rgba(6, 182, 212, 0.3)",
            borderRadius: "18px",
            background: "linear-gradient(180deg, rgba(8, 20, 35, 0.8) 0%, rgba(5, 12, 22, 0.95) 100%)",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
            marginBottom: 0
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #06B6D4, #0891B2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  boxShadow: "0 0 20px rgba(6, 182, 212, 0.4)"
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <span className="badge" style={{ background: "rgba(6, 182, 212, 0.15)", color: "#22D3EE", border: "1px solid rgba(6, 182, 212, 0.3)" }}>Standalone Tool</span>
              </div>

              <h3 style={{ fontSize: "1.6rem", marginBottom: "0.35rem", color: "#FFFFFF", fontWeight: 700 }}>Inquest</h3>
              <div style={{ color: "#06B6D4", fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.85rem" }}>
                Autonomous Open Records & FOIA Autopilot
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.75rem" }}>
                Codifies federal FOIA (5 U.S.C. § 552) and all 50 state open records laws into an autonomous statutory enforcement engine with 20-day countdown timers, fee segregation, and administrative appeal generators.
              </p>
            </div>

            <div>
              <Link 
                href="/products/inquest" 
                className="btn-primary" 
                style={{ width: "100%", textAlign: "center", textDecoration: "none", padding: "0.85rem", fontSize: "0.92rem", fontWeight: 600, background: "linear-gradient(135deg, #06B6D4, #0284C7)" }}>
                Launch Inquest →
              </Link>
            </div>
          </div>

          {/* TOOL 2: EXULTIA CIVICPULSE */}
          <div className="glass-card" style={{
            padding: "2.25rem 2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "18px",
            background: "linear-gradient(180deg, rgba(6, 25, 20, 0.8) 0%, rgba(4, 15, 12, 0.95) 100%)",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
            marginBottom: 0
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #10B981, #059669)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)"
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg>
                </div>
                <span className="badge" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34D399", border: "1px solid rgba(16, 185, 129, 0.3)" }}>Standalone Tool</span>
              </div>

              <h3 style={{ fontSize: "1.6rem", marginBottom: "0.35rem", color: "#FFFFFF", fontWeight: 700 }}>CivicPulse</h3>
              <div style={{ color: "#34D399", fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.85rem" }}>
                Municipal Records & Minutes Terminal
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.75rem" }}>
                Instant on-demand search across local government meeting agendas, transcribed minutes, roll-call voting records, and municipal ordinances across thousands of cities.
              </p>
            </div>

            <div>
              <Link 
                href="/products/civic-pulse" 
                className="btn-primary" 
                style={{ width: "100%", textAlign: "center", textDecoration: "none", padding: "0.85rem", fontSize: "0.92rem", fontWeight: 600, background: "linear-gradient(135deg, #10B981, #059669)" }}>
                Explore CivicPulse →
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* OPEN SECURITY & GOVERNANCE STANDARDS LAB BANNER */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(2, 6, 23, 0.95) 100%)",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          borderRadius: "18px",
          padding: "2.5rem",
          boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 30px rgba(59, 130, 246, 0.15)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "2rem"
        }}>
          <div style={{ maxWidth: "740px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(59, 130, 246, 0.15)", border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: "6px", padding: "3px 10px", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.75rem", color: "#60A5FA", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Exultia Standards Lab
              </span>
            </div>
            <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.5rem" }}>
              Open Security & Governance Control Frameworks
            </h3>
            <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
              Vendor-agnostic baseline standards, physical safety engineering, and algorithmic accountability standards applicable across enterprise campuses, logistics depots, critical infrastructure, and public environments. Explore <strong>ALPR-CSF v1.0</strong> (surveillance sensors & clear-zone crash standards) and <strong>RAIJ-CSF v1.0</strong> (responsible AI, cryptographic weight provenance & prompt injection defense).
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link 
              href="/governance/alpr-csf"
              className="btn-primary" 
              style={{
                textDecoration: "none",
                padding: "0.85rem 1.4rem",
                fontSize: "0.9rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                boxShadow: "0 0 15px rgba(59, 130, 246, 0.35)",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}>
              <span>ALPR-CSF Spec →</span>
            </Link>
            <Link 
              href="/governance/raij-csf"
              className="btn-primary" 
              style={{
                textDecoration: "none",
                padding: "0.85rem 1.4rem",
                fontSize: "0.9rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
                boxShadow: "0 0 15px rgba(139, 92, 246, 0.35)",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}>
              <span>RAIJ-CSF Spec →</span>
            </Link>
            <Link 
              href="/governance"
              style={{
                textDecoration: "none",
                padding: "0.85rem 1.2rem",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#E2E8F0",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "8px",
                display: "inline-flex",
                alignItems: "center"
              }}>
              <span>All Standards</span>
            </Link>
          </div>
        </div>

      </section>
    </div>
  );
}
