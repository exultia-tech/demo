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

      {/* PRODUCT SUITE LINEUP (SPLASH PAGE) */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
          
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
                <span className="badge badge-blue">Product 01</span>
              </div>

              <h2 style={{ fontSize: "1.75rem", marginBottom: "0.4rem", color: "#FFFFFF", fontWeight: 700 }}>PureIDE</h2>
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
                <span className="badge badge-purple">Product 02</span>
              </div>

              <h2 style={{ fontSize: "1.75rem", marginBottom: "0.4rem", color: "#FFFFFF", fontWeight: 700 }}>UVI Threat Feed</h2>
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

          {/* PRODUCT 3: EXULTIA INQUEST */}
          <div className="glass-card" style={{
            padding: "2.5rem 2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "1px solid rgba(6, 182, 212, 0.3)",
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
                  background: "linear-gradient(135deg, #06B6D4, #0891B2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  boxShadow: "0 0 20px rgba(6, 182, 212, 0.4)"
                }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <span className="badge badge-green">Product 03</span>
              </div>

              <h2 style={{ fontSize: "1.75rem", marginBottom: "0.4rem", color: "#FFFFFF", fontWeight: 700 }}>Inquest</h2>
              <div style={{ color: "#06B6D4", fontWeight: 600, fontSize: "0.92rem", marginBottom: "1rem" }}>
                Deterministic Open Records Autopilot
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "2rem" }}>
                Autonomous statutory open records platform. Codifies federal FOIA and 50-state sunshine laws to eliminate bureaucratic delays, mandate segregability, and draft appeals.
              </p>
            </div>

            <div>
              <Link 
                href="/products/inquest" 
                className="btn-primary" 
                style={{ width: "100%", textAlign: "center", textDecoration: "none", padding: "0.9rem", fontSize: "0.95rem", fontWeight: 600, background: "linear-gradient(135deg, #06B6D4, #0284C7)" }}>
                Explore Inquest →
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
