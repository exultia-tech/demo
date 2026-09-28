import Link from "next/link";
import { Metadata } from "next";
import { PureIdeIcon } from "@/components/BrandIcons";

export const metadata: Metadata = {
  title: "Exultia PureIDE | Secure Developer Workstations, On-Demand",
  description: "Package, customize, and deploy secure developer IDEs in seconds with Exultia PureIDE. Block telemetry, audit plugins, enforce zero-trust policies, and generate full SBOM reports.",
};

export default function PureIdeLandingPage() {
  return (
    <div className="fade-in" style={{ paddingBottom: "5rem" }}>
      {/* PRODUCT HERO */}
      <section className="hero-section" style={{ paddingTop: "3.5rem", paddingBottom: "3.5rem" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
          <PureIdeIcon size={64} glow={true} />
        </div>
        <h1 className="hero-title" style={{ fontSize: "3.6rem", marginBottom: "1.25rem", letterSpacing: "-0.025em", lineHeight: 1.1 }}>
          Secure Development, <br />
          <span className="gradient-text">On-Demand</span>
        </h1>

        <p className="hero-desc" style={{ maxWidth: "760px", margin: "0 auto 2.25rem auto", fontSize: "1.2rem", lineHeight: "1.65", color: "#94A3B8" }}>
          Package, customize, and distribute hardened developer environments in seconds with Exultia PureIDE. Block untrusted plugins, eliminate unwanted background telemetry, and automatically generate full software bill-of-materials (SBOMs).
        </p>

        <div className="hero-cta-group" style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <Link 
            href="/app/pureide" 
            className="btn-primary" 
            style={{ padding: "0.95rem 2rem", fontSize: "1rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.55rem" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Launch Builder Console →
          </Link>
          <a 
            href="#architecture" 
            style={{ padding: "0.95rem 1.7rem", borderRadius: "10px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border-color)", color: "white", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem" }}>
            Explore Architecture
          </a>
          <Link 
            href="/products/pure-ide/pricing" 
            style={{ padding: "0.95rem 1.7rem", borderRadius: "10px", background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.3)", color: "#93C5FD", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem" }}>
            Pricing Plans
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS (3 CONCISE STEPS) */}
      <section style={{ background: "rgba(255,255,255,0.015)", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)", padding: "4.5rem 2rem", marginBottom: "5.5rem" }}>
        <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
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
                Our stateless cloud runner correlates threat signals, strips telemetry, and compiles sealed binaries for Windows, macOS, and Linux.
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

      {/* SECTION 1: 4 DEFENSE-IN-DEPTH CONTAINMENT LAYERS */}
      <section id="architecture" style={{ maxWidth: "1280px", margin: "0 auto 5rem auto", padding: "0 2rem" }}>
        <div id="security" style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "2.3rem", marginBottom: "0.75rem" }}>The 4 Defense-in-Depth Containment Layers</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", maxWidth: "780px", margin: "0 auto" }}>
            A four-tier containment architecture ensuring developer releases cannot be tampered with on disk, bypassed locally, or compromised via unvetted marketplace access.
          </p>
        </div>

        <div className="containment-layers-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
          
          <div id="hardening" className="glass-card" style={{ padding: "2rem", marginBottom: 0 }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(59, 130, 246, 0.15)", border: "1px solid rgba(59, 130, 246, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60A5FA", fontSize: "1.25rem", fontWeight: 800, marginBottom: "1.25rem" }}>
              1
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.6rem" }}>Immutable Binary Encapsulation</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.6" }}>
              Governance rules, air-gap registry routes, and core security boundaries are sealed directly into the native runtime binary, eliminating editable plaintext configurations on disk.
            </p>
          </div>

          <div className="glass-card" style={{ padding: "2rem", marginBottom: 0 }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(52, 211, 153, 0.15)", border: "1px solid rgba(52, 211, 153, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#34D399", fontSize: "1.25rem", fontWeight: 800, marginBottom: "1.25rem" }}>
              2
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.6rem" }}>OS-Protected Directory Scopes</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.6" }}>
              Installers target root system directories (<code>Program Files</code> / <code>Applications</code>), enforcing standard non-admin read-only permissions so users cannot modify bundled extension payloads.
            </p>
          </div>

          <div className="glass-card" style={{ padding: "2rem", marginBottom: 0 }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(167, 139, 250, 0.15)", border: "1px solid rgba(167, 139, 250, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#A78BFA", fontSize: "1.25rem", fontWeight: 800, marginBottom: "1.25rem" }}>
              3
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.6rem" }}>Code-Signing & EDR Integrity</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.6" }}>
              Cryptographic signatures bind binary contents. Any disk-level modification invalidates the digital signature, triggering immediate Windows Defender WDAC and macOS Gatekeeper execution blocks.
            </p>
          </div>

          <div className="glass-card" style={{ padding: "2rem", marginBottom: 0 }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(251, 191, 36, 0.15)", border: "1px solid rgba(251, 191, 36, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FBBF24", fontSize: "1.25rem", fontWeight: 800, marginBottom: "1.25rem" }}>
              4
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.6rem" }}>Network Egress Sandboxing</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.6" }}>
              Default public marketplace endpoints are removed. Editor network traffic is restricted to your private internal registry proxy (e.g. JFrog Artifactory) or completely air-gapped from outbound traffic.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 2: STRICT ZERO TELEMETRY PROTOCOL */}
      <section style={{ maxWidth: "1280px", margin: "0 auto 5rem auto", padding: "0 2rem" }}>
        <div id="telemetry" className="glass-card" style={{ padding: "2.5rem", background: "rgba(52, 211, 153, 0.03)", border: "1px solid rgba(52, 211, 153, 0.25)", borderRadius: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(52, 211, 153, 0.15)", display: "grid", placeItems: "center", color: "#34D399", fontSize: "1.35rem" }}>
              🛡️
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.35rem" }}>Strict Zero Outbound Telemetry Protocol</h3>
              <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--text-muted)" }}>Engineered for air-gapped financial institutions, defense contractors, and regulated environments.</p>
            </div>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.94rem", lineHeight: "1.65", margin: 0 }}>
            All upstream telemetry modules, usage analytics probes, remote crash reporting daemons, and Microsoft/Google tracking endpoints are permanently excised from the source tree during compilation. Your engineering team&apos;s keystrokes, repository names, file structures, and code remain 100% private to your workstations.
          </p>
        </div>
      </section>

      {/* SECTION 3: WIDESCREEN DUAL SECTION: EXTENSION SANDBOXING & CLOUD PIPELINE */}
      <section style={{ maxWidth: "1280px", margin: "0 auto 6rem auto", padding: "0 2rem" }}>
        <div className="widescreen-duo-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "2rem" }}>
          
          {/* CARD 1: SUPPLY CHAIN SANDBOXING & UNIVERSAL ENGINES */}
          <div id="sandbox" className="glass-card" style={{ padding: "2.5rem", marginBottom: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", borderRadius: "16px" }}>
            <div>
              <h2 style={{ fontSize: "1.85rem", marginBottom: "0.6rem", letterSpacing: "-0.01em" }}>
                Zero-Trust Extension Sandboxing Across 6 IDE Engines
              </h2>
              <p style={{ color: "var(--text-muted)", lineHeight: "1.6", fontSize: "0.92rem", marginBottom: "1.75rem" }}>
                Standard IDEs allow arbitrary marketplace plugins to execute native code with root-level access. PureIDE enforces strict policy boundaries and pre-approved extension toolchains across 6 engines.
              </p>

              {/* CHECKLIST HIGHLIGHTS */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.85rem 1.1rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "10px" }}>
                  <span style={{ color: "#34D399", fontSize: "1.1rem", lineHeight: "1.3" }}>✓</span> 
                  <div>
                    <strong style={{ fontSize: "0.9rem", color: "#fff" }}>Strict 0 Open CVEs Baseline</strong>
                    <p style={{ margin: "0.15rem 0 0 0", color: "var(--text-muted)", fontSize: "0.82rem", lineHeight: "1.4" }}>Any extension with active CVEs is blocked from bundling.</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.85rem 1.1rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "10px" }}>
                  <span style={{ color: "#60A5FA", fontSize: "1.1rem", lineHeight: "1.3" }}>✓</span> 
                  <div>
                    <strong style={{ fontSize: "0.9rem", color: "#fff" }}>Universal IDE Matrix</strong>
                    <p style={{ margin: "0.15rem 0 0 0", color: "var(--text-muted)", fontSize: "0.82rem", lineHeight: "1.4" }}>VS Code, Theia, Zed (Rust), Neovim, JupyterLab, and VSCodium.</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.85rem 1.1rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "10px" }}>
                  <span style={{ color: "#A78BFA", fontSize: "1.1rem", lineHeight: "1.3" }}>✓</span> 
                  <div>
                    <strong style={{ fontSize: "0.9rem", color: "#fff" }}>Air-Gapped Localization (i18n)</strong>
                    <p style={{ margin: "0.15rem 0 0 0", color: "var(--text-muted)", fontSize: "0.82rem", lineHeight: "1.4" }}>12+ verified language packs pre-provisioned for offline use.</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.85rem 1.1rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "10px" }}>
                  <span style={{ color: "#FBBF24", fontSize: "1.1rem", lineHeight: "1.3" }}>✓</span> 
                  <div>
                    <strong style={{ fontSize: "0.9rem", color: "#fff" }}>Auto-Included Remote-SSH</strong>
                    <p style={{ margin: "0.15rem 0 0 0", color: "var(--text-muted)", fontSize: "0.82rem", lineHeight: "1.4" }}>Secure remote development bridges bundled across all toolchains.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: CLOUD PIPELINE, SBOMs & ZERO CUSTODY */}
          <div id="pipeline" className="glass-card" style={{ padding: "2.5rem", marginBottom: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", borderRadius: "16px" }}>
            <div>
              <h2 style={{ fontSize: "1.85rem", marginBottom: "0.6rem", letterSpacing: "-0.01em" }}>
                Isolated Multi-OS Cloud Pipeline & Attestation
              </h2>
              <p style={{ color: "var(--text-muted)", lineHeight: "1.6", fontSize: "0.92rem", marginBottom: "1.75rem" }}>
                Builds execute inside dedicated, ephemeral cloud runners. Each sandbox is provisioned on-demand, compiles sealed binaries, and is permanently destroyed upon completion.
              </p>

              {/* PIPELINE CAPABILITIES CHECKLIST */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.85rem 1.1rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "10px" }}>
                  <span style={{ color: "#34D399", fontSize: "1.1rem", lineHeight: "1.3" }}>✓</span> 
                  <div>
                    <strong style={{ fontSize: "0.9rem", color: "#fff" }}>Zero Local Server Overhead</strong>
                    <p style={{ margin: "0.15rem 0 0 0", color: "var(--text-muted)", fontSize: "0.82rem", lineHeight: "1.4" }}>No dedicated build hardware or local OS runners required.</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.85rem 1.1rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "10px" }}>
                  <span style={{ color: "#60A5FA", fontSize: "1.1rem", lineHeight: "1.3" }}>✓</span> 
                  <div>
                    <strong style={{ fontSize: "0.9rem", color: "#fff" }}>Zero Customer Code Custody</strong>
                    <p style={{ margin: "0.15rem 0 0 0", color: "var(--text-muted)", fontSize: "0.82rem", lineHeight: "1.4" }}>We never store customer source code, keys, or build logs.</p>
                  </div>
                </div>

                <div id="sbom" style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.85rem 1.1rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "10px" }}>
                  <span style={{ color: "#A78BFA", fontSize: "1.1rem", lineHeight: "1.3" }}>✓</span> 
                  <div>
                    <strong style={{ fontSize: "0.9rem", color: "#fff" }}>CycloneDX 1.5 JSON SBOMs</strong>
                    <p style={{ margin: "0.15rem 0 0 0", color: "var(--text-muted)", fontSize: "0.82rem", lineHeight: "1.4" }}>SLSA-compliant Software Bill of Materials with SHA-256 binary digests.</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.85rem 1.1rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "10px" }}>
                  <span style={{ color: "#FBBF24", fontSize: "1.1rem", lineHeight: "1.3" }}>✓</span> 
                  <div>
                    <strong style={{ fontSize: "0.9rem", color: "#fff" }}>Multi-OS Cross-Compilation & REST API</strong>
                    <p style={{ margin: "0.15rem 0 0 0", color: "var(--text-muted)", fontSize: "0.82rem", lineHeight: "1.4" }}>Simultaneous output for Windows, macOS, and Linux with CI/CD triggers.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CORE PRODUCT CAPABILITIES (POINT-BY-POINT GRID) */}
      <section style={{ maxWidth: "1280px", margin: "0 auto 6rem auto", padding: "0 2rem" }}>
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
            <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>Zero Background Telemetry</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>
              • Strips vendor tracking and analytics probes from builds<br/>
              • Local DNS blackholing for reporting endpoints<br/>
              • Built for privacy-conscious and air-gapped workloads
            </p>
          </div>

          <div className="feature-box" style={{ padding: "1.75rem" }}>
            <div className="feature-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>Automated CycloneDX SBOM</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>
              • CycloneDX 1.5 JSON specification compliance<br/>
              • SHA-256 digests for all packaged components<br/>
              • Clear audit trail for enterprise security reviews
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
            Ready to Build Your Custom Workstation?
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", maxWidth: "600px", margin: "0 auto 2rem auto" }}>
            Build a clean, custom IDE package in under 60 seconds with our interactive web console.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/app/pureide" className="btn-primary" style={{ padding: "0.95rem 2.25rem", fontSize: "1rem", textDecoration: "none" }}>
              Launch Builder Console Free →
            </Link>
            <Link href="/products/pure-ide/pricing" style={{ padding: "0.95rem 1.85rem", borderRadius: "10px", background: "rgba(255,255,255,0.08)", border: "1px solid var(--border-color)", color: "white", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem" }}>
              View Pricing Plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
