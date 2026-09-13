import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exultia PureIDE | Zero-Trust Development, On-Demand",
  description: "Compile, harden and distribute secure dev environments in seconds with Exultia PureIDE. Eliminate ambient telemetry, enforce air-gapped extension sandboxes, and export verifiable CycloneDX 1.5 SBOMs.",
};

export default function PureIdeLandingPage() {
  return (
    <div className="fade-in" style={{ paddingBottom: "5rem" }}>
      {/* PRODUCT HERO */}
      <section className="hero-section" style={{ paddingTop: "3rem", paddingBottom: "3.5rem" }}>
        <h1 className="hero-title" style={{ fontSize: "3.6rem", marginBottom: "1.25rem", letterSpacing: "-0.025em", lineHeight: 1.1 }}>
          Zero-Trust Development, <br />
          <span className="gradient-text">On-Demand</span>
        </h1>

        <p className="hero-desc" style={{ maxWidth: "720px", margin: "0 auto 2.25rem auto", fontSize: "1.25rem", lineHeight: "1.6", color: "#94A3B8" }}>
          Compile, harden and distribute secure dev environments in seconds with Exultia PureIDE.
        </p>

        <div className="hero-cta-group" style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <Link 
            href="/console" 
            className="btn-primary" 
            style={{ padding: "0.95rem 2rem", fontSize: "1rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.55rem" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Launch Builder Console →
          </Link>
          <Link 
            href="/features" 
            style={{ padding: "0.95rem 1.7rem", borderRadius: "10px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border-color)", color: "white", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem" }}>
            Explore Architecture
          </Link>
          <Link 
            href="/pricing" 
            style={{ padding: "0.95rem 1.7rem", borderRadius: "10px", background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.3)", color: "#93C5FD", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem" }}>
            Pricing Plans
          </Link>
          <Link 
            href="/docs" 
            style={{ padding: "0.95rem 1.5rem", borderRadius: "10px", background: "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "#CBD5E1", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem" }}>
            Documentation
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS (3 CONCISE STEPS) */}
      <section style={{ background: "rgba(255,255,255,0.015)", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)", padding: "4.5rem 2rem", marginBottom: "5.5rem" }}>
        <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{ fontSize: "0.8rem", color: "#60A5FA", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
              Deterministic Workflow
            </span>
            <h2 style={{ fontSize: "2.2rem", marginTop: "0.35rem", marginBottom: "0.5rem" }}>How PureIDE Works in 3 Steps</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "600px", margin: "0 auto" }}>
              From stack curation and threat validation to signed workstation distribution.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <div className="glass-card" style={{ padding: "1.75rem", marginBottom: 0 }}>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--accent-primary)", marginBottom: "0.5rem" }}>
                01. Curate
              </div>
              <strong style={{ fontSize: "1.05rem", display: "block", marginBottom: "0.35rem" }}>Select Engine & Stack</strong>
              <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: "1.5", margin: 0 }}>
                Choose your IDE engine, apply a curated role blueprint or custom extension list, and set zero-telemetry and proxy rules.
              </p>
            </div>

            <div className="glass-card" style={{ padding: "1.75rem", marginBottom: 0 }}>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--accent-secondary)", marginBottom: "0.5rem" }}>
                02. Assemble
              </div>
              <strong style={{ fontSize: "1.05rem", display: "block", marginBottom: "0.35rem" }}>Cloud Sandbox Compilation</strong>
              <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: "1.5", margin: 0 }}>
                Our stateless cloud runner correlates UVI threat signals, strips telemetry, and compiles sealed binaries for Win, Mac, and Linux.
              </p>
            </div>

            <div className="glass-card" style={{ padding: "1.75rem", marginBottom: 0 }}>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#34D399", marginBottom: "0.5rem" }}>
                03. Deploy
              </div>
              <strong style={{ fontSize: "1.05rem", display: "block", marginBottom: "0.35rem" }}>Download & Distribute</strong>
              <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: "1.5", margin: 0 }}>
                Download digitally signed native installers with exportable CycloneDX 1.5 JSON SBOMs for MDM and enterprise audits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE PRODUCT CAPABILITIES (POINT-BY-POINT GRID) */}
      <section style={{ maxWidth: "1240px", margin: "0 auto 6rem auto", padding: "0 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "2.2rem", marginBottom: "0.5rem" }}>Product Capabilities Breakdown</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: "650px", margin: "0 auto" }}>
            Everything required to secure, customize, and govern developer workstations across your enterprise.
          </p>
        </div>

        <div className="feature-grid-3">
          <div className="feature-box" style={{ padding: "1.75rem" }}>
            <div className="feature-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>Extension Sandboxing</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>
              • Blocks unauthorized outbound network sockets<br/>
              • Audits and restricts subprocess execution<br/>
              • Isolates sensitive environment tokens and credentials
            </p>
          </div>

          <div className="feature-box" style={{ padding: "1.75rem" }}>
            <div className="feature-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            </div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>1-Click Role Blueprints</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>
              • Full-Stack Web (Node.js, TypeScript, React, Tailwind)<br/>
              • Python AI / Data Science (PyTorch, Jupyter, Ruff)<br/>
              • Cloud DevOps & SecOps (Terraform, Docker, K8s, Go)
            </p>
          </div>

          <div className="feature-box" style={{ padding: "1.75rem" }}>
            <div className="feature-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>Zero Ambient Telemetry</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>
              • Excises proprietary analytics probes at compilation<br/>
              • Hard-coded DNS blackholing for vendor reporting endpoints<br/>
              • Guaranteed compliance for classified & HIPAA workloads
            </p>
          </div>

          <div className="feature-box" style={{ padding: "1.75rem" }}>
            <div className="feature-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>Automated CycloneDX SBOM</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>
              • CycloneDX 1.5 JSON specification compliance<br/>
              • SHA-256 binary digests for all packaged components<br/>
              • Meets Executive Order 14028 software supply chain criteria
            </p>
          </div>

          <div className="feature-box" style={{ padding: "1.75rem" }}>
            <div className="feature-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a7 7 0 0 0 0 14 2.5 2.5 0 0 0 2.5-2.5c0-.8-.3-1.5-.8-2"/></svg>
            </div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>White-Label Studio</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>
              • Custom enterprise branding and splash screens<br/>
              • Internal registry proxy routing (JFrog Artifactory)<br/>
              • Standardized corporate window titles and theme tokens
            </p>
          </div>

          <div className="feature-box" style={{ padding: "1.75rem" }}>
            <div className="feature-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>MDM & CI/CD Deployment</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>
              • Native installers for Microsoft Intune, Jamf & Ansible<br/>
              • Headless Build REST API for automated CI/CD pipelines<br/>
              • Instant dry-run verification before packaging
            </p>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section style={{ maxWidth: "1000px", margin: "5rem auto 3rem auto", padding: "0 2rem" }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          borderRadius: "20px",
          padding: "3.5rem 2rem",
          textAlign: "center",
          boxShadow: "0 20px 40px -15px rgba(0,0,0,0.8)"
        }}>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "0.75rem" }}>
            Ready to Build Your Hardened Workstation?
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", maxWidth: "600px", margin: "0 auto 2rem auto" }}>
            Launch a zero-trust custom build in under 60 seconds with our interactive web console.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/console" className="btn-primary" style={{ padding: "0.95rem 2.25rem", fontSize: "1rem", textDecoration: "none" }}>
              Launch Builder Console Free →
            </Link>
            <Link href="/pricing" style={{ padding: "0.95rem 1.85rem", borderRadius: "10px", background: "rgba(255,255,255,0.08)", border: "1px solid var(--border-color)", color: "white", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem" }}>
              View Pricing Plans
            </Link>
            <Link href="/docs" style={{ padding: "0.95rem 1.6rem", borderRadius: "10px", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "#CBD5E1", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem" }}>
              Read Technical Docs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
