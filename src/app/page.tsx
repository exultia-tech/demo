import Link from "next/link";
import { Metadata } from "next";
import { UVI_PUBLIC_FEED_SOURCES } from "@/lib/threat-feed-data";
import { JURISDICTIONS_LIST } from "@/lib/foia/statutes";

export const metadata: Metadata = {
  title: "Invariant Technologies | High-Assurance Deterministic Computing",
  description: "Invariant Technologies engineers deterministic infrastructure for zero-trust developer workstations (SecureIDE), universal threat intelligence (UVI), and statutory open records compliance (LexPublica).",
};

export default function ParentHomePage() {
  const totalUpstreamRecords = UVI_PUBLIC_FEED_SOURCES.reduce((acc, f) => acc + f.recordsIngested, 0);

  return (
    <div className="fade-in" style={{ paddingBottom: "6rem" }}>
      {/* HERO SECTION */}
      <section className="hero-section" style={{ paddingTop: "3.5rem", paddingBottom: "4rem" }}>
        {/* BADGE PILL */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(59, 130, 246, 0.1)",
          border: "1px solid rgba(59, 130, 246, 0.25)",
          borderRadius: "999px",
          padding: "5px 16px",
          marginBottom: "1.75rem",
          boxShadow: "0 0 20px rgba(59, 130, 246, 0.15)"
        }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3B82F6", boxShadow: "0 0 8px #3B82F6" }} />
          <span style={{ fontSize: "0.82rem", color: "#93C5FD", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            High-Assurance Deterministic Systems
          </span>
        </div>

        {/* HEADLINE */}
        <h1 className="hero-title" style={{ fontSize: "3.8rem", marginBottom: "1.35rem", letterSpacing: "-0.035em", lineHeight: 1.12 }}>
          Provable Trust. <br/>
          <span className="gradient-text">Deterministic Certainty.</span>
        </h1>

        {/* SUBTITLE */}
        <p className="hero-desc" style={{ maxWidth: "780px", marginBottom: "2.5rem", fontSize: "1.25rem", lineHeight: "1.65", color: "#94A3B8" }}>
          Invariant Technologies builds mathematically and legally deterministic infrastructure—uniting zero-trust developer workstation compilers, universal vulnerability intelligence, and statutory open records compliance.
        </p>

        {/* PRIMARY CALL TO ACTIONS */}
        <div className="hero-cta-group" style={{ marginBottom: "2rem" }}>
          <Link 
            href="/products/secure-ide" 
            className="btn-primary" 
            style={{ padding: "0.95rem 1.85rem", fontSize: "1rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            <span>Explore SecureIDE</span>
          </Link>

          <Link 
            href="/threat-feed" 
            style={{
              padding: "0.95rem 1.6rem",
              borderRadius: "10px",
              background: "rgba(139, 92, 246, 0.12)",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              color: "#C4B5FD",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            <span>UVI Threat Feed</span>
          </Link>

          <Link 
            href="/products/foia" 
            style={{
              padding: "0.95rem 1.6rem",
              borderRadius: "10px",
              background: "rgba(6, 182, 212, 0.12)",
              border: "1px solid rgba(6, 182, 212, 0.3)",
              color: "#67E8F9",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <span>LexPublica FOIA</span>
          </Link>

          <a 
            href="#products" 
            style={{
              padding: "0.95rem 1.4rem",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#94A3B8",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
            <span>Product Suite</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </a>
        </div>
      </section>

      {/* LIVE GLOBAL INVARIANT TELEMETRY BANNER */}
      <section style={{ maxWidth: "1240px", margin: "0 auto 5.5rem auto", padding: "0 2rem" }}>
        <div style={{
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          padding: "2rem 2.5rem",
          boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.6)"
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem" }}>
            
            <div>
              <div style={{ fontSize: "0.75rem", color: "#60A5FA", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                SecureIDE Invariant
              </div>
              <div style={{ fontSize: "2.3rem", fontWeight: 900, color: "#FFFFFF", marginTop: "0.25rem", letterSpacing: "-0.03em" }}>
                100% Sealed
              </div>
              <div style={{ fontSize: "0.82rem", color: "#94A3B8", marginTop: "0.25rem" }}>
                Zero ambient telemetry, air-gapped sandboxes, and automated CycloneDX 1.5 SBOMs.
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", color: "#A78BFA", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Threat Intelligence Invariant
              </div>
              <div style={{ fontSize: "2.3rem", fontWeight: 900, color: "#FFFFFF", marginTop: "0.25rem", letterSpacing: "-0.03em" }}>
                {UVI_PUBLIC_FEED_SOURCES.length} Feeds
              </div>
              <div style={{ fontSize: "0.82rem", color: "#94A3B8", marginTop: "0.25rem" }}>
                {(totalUpstreamRecords / 1000000).toFixed(1)}M+ indicators correlated into pre-assigned UVI records.
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", color: "#06B6D4", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Civic & Legal Invariant
              </div>
              <div style={{ fontSize: "2.3rem", fontWeight: 900, color: "#FFFFFF", marginTop: "0.25rem", letterSpacing: "-0.03em" }}>
                {JURISDICTIONS_LIST.length} Jurisdictions
              </div>
              <div style={{ fontSize: "0.82rem", color: "#94A3B8", marginTop: "0.25rem" }}>
                Federal FOIA + 50-state sunshine laws with automated segregability & appeal drafting.
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", color: "#34D399", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Cryptographic Integrity
              </div>
              <div style={{ fontSize: "2.3rem", fontWeight: 900, color: "#FFFFFF", marginTop: "0.25rem", letterSpacing: "-0.03em" }}>
                SHA-256
              </div>
              <div style={{ fontSize: "0.82rem", color: "#94A3B8", marginTop: "0.25rem" }}>
                Immutable digest verification across workstation bundles and legal filings.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* THREE FLAGSHIP PRODUCTS PORTFOLIO */}
      <section id="products" style={{ maxWidth: "1240px", margin: "0 auto 6rem auto", padding: "0 2rem", scrollMarginTop: "2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span style={{ fontSize: "0.8rem", color: "#60A5FA", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
            Unified Portfolio
          </span>
          <h2 style={{ fontSize: "2.5rem", marginTop: "0.4rem", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
            The Invariant Product Suite
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "1.05rem", maxWidth: "680px", margin: "0 auto" }}>
            Three specialized platforms engineered for organizations that demand total determinism in software development, threat visibility, and public accountability.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem" }}>
          
          {/* PRODUCT CARD 1: SECUREIDE */}
          <div className="glass-card" style={{
            padding: "2.5rem 2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            borderRadius: "18px",
            background: "linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(10, 15, 26, 0.95) 100%)",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7)"
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

              <h3 style={{ fontSize: "1.75rem", marginBottom: "0.5rem", color: "#FFFFFF" }}>SecureIDE</h3>
              <div style={{ color: "#60A5FA", fontWeight: 600, fontSize: "0.92rem", marginBottom: "1rem" }}>
                Zero-Trust Workstation Compiler
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                Stateless cloud compilation of sealed VSCodium, Eclipse Theia, and VSCode environments. Enforces extension socket firewalls, strips ambient telemetry, and outputs verifiable CycloneDX 1.5 JSON SBOMs.
              </p>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem 0", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "#CBD5E1" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#34D399" }}>✓</span> Multi-engine support (VSCodium, Theia, VSCode, Zed)
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#34D399" }}>✓</span> Portable offline bundles for air-gapped SCIFs
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#34D399" }}>✓</span> Continuous hash evaluation against UVI intelligence
                </li>
              </ul>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Link href="/products/secure-ide" className="btn-primary" style={{ flex: 1, textAlign: "center", textDecoration: "none", padding: "0.85rem", fontSize: "0.92rem" }}>
                Product Overview →
              </Link>
              <Link href="/console" style={{ padding: "0.85rem 1.25rem", borderRadius: "10px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border-color)", color: "white", textDecoration: "none", fontWeight: 600, fontSize: "0.92rem" }}>
                Console
              </Link>
            </div>
          </div>

          {/* PRODUCT CARD 2: UVI THREAT FEED */}
          <div className="glass-card" style={{
            padding: "2.5rem 2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            borderRadius: "18px",
            background: "linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(10, 15, 26, 0.95) 100%)",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7)"
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

              <h3 style={{ fontSize: "1.75rem", marginBottom: "0.5rem", color: "#FFFFFF" }}>UVI Threat Feed</h3>
              <div style={{ color: "#A78BFA", fontWeight: 600, fontSize: "0.92rem", marginBottom: "1rem" }}>
                Universal Threat Intelligence & CVE Registry
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                Cross-correlating 55 synchronized upstream cyber intelligence streams into normalized, pre-assigned UVI records. Features dual-perspective scoring for production servers vs developer toolchains.
              </p>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem 0", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "#CBD5E1" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#34D399" }}>✓</span> 55 public feeds (Malware, C2, CISA KEV, PortSwigger, Krebs)
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#34D399" }}>✓</span> Dual-perspective scoring: Software vs Developer Exposure
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#34D399" }}>✓</span> Machine-readable JSON REST API (`/api/threat-feed`)
                </li>
              </ul>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Link href="/threat-feed" className="btn-primary" style={{ flex: 1, textAlign: "center", textDecoration: "none", padding: "0.85rem", fontSize: "0.92rem", background: "linear-gradient(135deg, #8B5CF6, #3B82F6)" }}>
                Feed Registry →
              </Link>
              <a href="/api/threat-feed" target="_blank" rel="noreferrer" style={{ padding: "0.85rem 1.25rem", borderRadius: "10px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border-color)", color: "white", textDecoration: "none", fontWeight: 600, fontSize: "0.92rem" }}>
                JSON API
              </a>
            </div>
          </div>

          {/* PRODUCT CARD 3: LEXPUBLICA FOIA */}
          <div className="glass-card" style={{
            padding: "2.5rem 2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "1px solid rgba(6, 182, 212, 0.3)",
            borderRadius: "18px",
            background: "linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(10, 15, 26, 0.95) 100%)",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7)"
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

              <h3 style={{ fontSize: "1.75rem", marginBottom: "0.5rem", color: "#FFFFFF" }}>LexPublica FOIA</h3>
              <div style={{ color: "#06B6D4", fontWeight: 600, fontSize: "0.92rem", marginBottom: "1rem" }}>
                Deterministic Open Records Autopilot
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                Autonomous statutory open records platform. Codifies 50-state sunshine laws and federal FOIA to eliminate bureaucratic delays, mandate segregability, and synthesize administrative appeal briefs.
              </p>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem 0", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "#CBD5E1" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#34D399" }}>✓</span> 50-state + Federal statutory legal engine
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#34D399" }}>✓</span> Exemption 4/5/7 denial analysis & appeal drafting
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#34D399" }}>✓</span> SHA-256 cryptographic filing digests & deadline timers
                </li>
              </ul>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Link href="/products/foia" className="btn-primary" style={{ flex: 1, textAlign: "center", textDecoration: "none", padding: "0.85rem", fontSize: "0.92rem", background: "linear-gradient(135deg, #06B6D4, #3B82F6)" }}>
                Product Overview →
              </Link>
              <Link href="/foia" style={{ padding: "0.85rem 1.25rem", borderRadius: "10px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border-color)", color: "white", textDecoration: "none", fontWeight: 600, fontSize: "0.92rem" }}>
                Workspace
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* THE INVARIANT PHILOSOPHY SECTION */}
      <section id="architecture" style={{ background: "rgba(255,255,255,0.015)", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)", padding: "5rem 2rem", marginBottom: "5.5rem" }}>
        <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{ fontSize: "0.8rem", color: "#60A5FA", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
              Engineering Philosophy
            </span>
            <h2 style={{ fontSize: "2.3rem", marginTop: "0.35rem", marginBottom: "0.5rem" }}>
              The Power of Deterministic Invariants
            </h2>
            <p style={{ color: "#94A3B8", fontSize: "1rem", maxWidth: "640px", margin: "0 auto" }}>
              Why mathematical determinism is the antidote to software supply chain collapse and institutional opacity.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
            
            <div className="glass-card" style={{ padding: "2rem" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(59, 130, 246, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60A5FA", marginBottom: "1rem" }}>
                1
              </div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem", color: "#FFFFFF" }}>Hermetic Build Invariants</h3>
              <p style={{ color: "#94A3B8", fontSize: "0.88rem", lineHeight: 1.6, margin: 0 }}>
                Traditional developer laptops download floating npm dependencies and unvetted marketplace plugins in an unsealed environment. Invariant isolates the toolchain, blocks ambient network sockets, and creates bit-for-bit reproducible, sealed binaries.
              </p>
            </div>

            <div className="glass-card" style={{ padding: "2rem" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(139, 92, 246, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#A78BFA", marginBottom: "1rem" }}>
                2
              </div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem", color: "#FFFFFF" }}>Epistemic Threat Invariants</h3>
              <p style={{ color: "#94A3B8", fontSize: "0.88rem", lineHeight: 1.6, margin: 0 }}>
                Security teams are paralyzed by conflicting vulnerability ratings between commercial vendors, CISA KEV, and open-source researchers. Invariant continuously ingests 55 streams, resolving discrepancies into a single, pre-assigned truth.
              </p>
            </div>

            <div className="glass-card" style={{ padding: "2rem" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(6, 182, 212, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#06B6D4", marginBottom: "1rem" }}>
                3
              </div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem", color: "#FFFFFF" }}>Statutory Legal Invariants</h3>
              <p style={{ color: "#94A3B8", fontSize: "0.88rem", lineHeight: 1.6, margin: 0 }}>
                Public records laws contain unambiguous statutory deadlines, fee waiver standards, and segregability mandates. When agencies exploit requester ambiguity, LexPublica provides automated, cryptographic, and statutory legal enforcement.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* FINAL CALLOUT */}
      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 2rem" }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(139, 92, 246, 0.12) 50%, rgba(6, 182, 212, 0.12) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "20px",
          padding: "3.5rem 2.5rem",
          textAlign: "center",
          boxShadow: "0 25px 50px -15px rgba(0, 0, 0, 0.8)"
        }}>
          <h2 style={{ fontSize: "2.3rem", marginBottom: "1rem", letterSpacing: "-0.02em" }}>
            Experience the Invariant Platform
          </h2>
          <p style={{ color: "#94A3B8", maxWidth: "600px", margin: "0 auto 2.25rem auto", fontSize: "1.1rem", lineHeight: 1.6 }}>
            Compile zero-trust workstations, interrogate global threat intelligence, or automate complex open records filings with deterministic precision.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/console" className="btn-primary" style={{ padding: "0.95rem 2rem", fontSize: "1rem", textDecoration: "none" }}>
              Launch SecureIDE Builder →
            </Link>
            <Link href="/threat-feed" style={{ padding: "0.95rem 1.75rem", borderRadius: "10px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border-color)", color: "white", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem" }}>
              Explore UVI Threat Feed
            </Link>
            <Link href="/foia" style={{ padding: "0.95rem 1.75rem", borderRadius: "10px", background: "rgba(6, 182, 212, 0.12)", border: "1px solid rgba(6, 182, 212, 0.3)", color: "#67E8F9", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem" }}>
              Launch LexPublica FOIA
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
