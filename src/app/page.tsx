import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="fade-in">
      
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-badge">
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34D399' }}></span>
          Next-Gen Zero-Trust IDE Platform • v2.4 Active
        </div>

        <h1 className="hero-title">
          Build, Govern & Distribute <br/>
          <span className="gradient-text">Hardened Developer Workstations</span>
        </h1>

        <p className="hero-desc">
          Empower engineering teams with customized, zero-trust distributions across <strong>VS Code, Eclipse Theia, Zed (Rust), Neovim, and JupyterLab</strong> — bundled with pre-approved plugins, air-gapped proxies, deterministic policy hardening, and automated CycloneDX SBOMs.
        </p>

        <div className="hero-cta-group">
          <Link 
            href="/console" 
            className="btn-primary" 
            style={{ padding: '1rem 2rem', fontSize: '1.1rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Launch Builder Console
          </Link>
          <Link 
            href="/features" 
            style={{ padding: '1rem 1.75rem', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '1.05rem', transition: 'all 0.2s ease' }}>
            Explore Architecture →
          </Link>
        </div>
      </section>

      {/* CORE SECURITY PILLARS BAR */}
      <div style={{ maxWidth: '1100px', margin: '0 auto 5rem auto', padding: '0 2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2.5rem', flexWrap: 'wrap', opacity: 0.9 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#E2E8F0' }}>
            <span style={{ color: '#34D399' }}>✓</span> 5 Major IDE Engines (VS Code, Theia, Zed, Neovim, Jupyter)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#E2E8F0' }}>
            <span style={{ color: '#60A5FA' }}>✓</span> 0-CVE & Deprecation Policy Gating
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#E2E8F0' }}>
            <span style={{ color: '#A78BFA' }}>✓</span> 5-Source Threat Intelligence Feeds
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#E2E8F0' }}>
            <span style={{ color: '#FBBF24' }}>✓</span> Cryptographic CycloneDX 1.5 SBOMs
          </div>
        </div>
      </div>

      {/* INTERACTIVE VALUE SHOWCASE */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 6rem auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>Eliminate Rogue Extensions & Supply Chain Leaks</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto' }}>
            Standard open-source IDE distributions pull unvetted plugins directly from public cloud marketplaces with zero outbound telemetry controls. SecureIDE flips the model.
          </p>
        </div>

        <div className="feature-grid-3">
          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>Zero-Trust Extension Curation</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Bundle pre-approved toolchains with our Verified Publisher & 0-CVE Community Whitelist or private JFrog Artifactory proxy. No rogue binaries executed.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>CycloneDX 1.5 SBOM</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Every custom compiled release generates a cryptographically signed Software Bill of Materials with SHA-256 hashes and VCS source proofs.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/></svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>1-Click Team Blueprints</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Instantly provision role-based IDE setups for Full-Stack Web, Python AI/ML, Cloud DevOps, and Systems engineering in seconds.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a7 7 0 0 0 0 14 2.5 2.5 0 0 0 2.5-2.5c0-.8-.3-1.5-.8-2"/></svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>White-Label Brand Studio</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Brand the IDE binary as your own corporate product (e.g. <code>AcmeCode.exe</code>) with customized accent themes, splash screens, and internal IT helpdesks.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>Deterministic Policy as Code</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Bake zero-telemetry, extension auto-update freezes, and strict workspace trust rules directly into immutable <code>policy.json</code> configurations.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>Universal Multi-IDE Support</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              One unified governance platform for <strong>VS Code, Eclipse Theia, Zed (Rust), Neovim, and JupyterLab</strong>. Enforce policies consistently across all tools.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS ARCHITECTURE */}
      <section style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>How SecureIDE Works</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>From security policy definition to air-gapped developer delivery.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="glass-card" style={{ padding: '1.75rem', marginBottom: 0 }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>01</div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Curate Stack & Policies</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                Select pre-approved extensions or apply role-based blueprints. Configure zero-telemetry enforcement, proxy galleries, and deterministic hardening rules.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.75rem', marginBottom: 0 }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-secondary)', marginBottom: '0.75rem' }}>02</div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Compile Native Binary</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Our hardened orchestrator packages a zero-telemetry IDE distribution (VS Code, Eclipse Theia, Zed, Neovim, JupyterLab) with baked-in governance and corporate branding.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.75rem', marginBottom: 0 }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34D399', marginBottom: '0.75rem' }}>03</div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Sign, Audit & Deploy</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                Cryptographically sign the executable with HSM keys, generate exportable Signed Build Manifests & CycloneDX SBOMs, and deploy via MDM (Intune, Jamf) or CI/CD.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section style={{ maxWidth: '1000px', margin: '6rem auto 3rem auto', padding: '0 2rem' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '24px', padding: '4rem 2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
            Ready to Hardened Your Developer Workstations?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
            Test your configuration with instant dry-run validation, inspect the CycloneDX SBOM, or compile a custom release today.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/console" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', textDecoration: 'none' }}>
              Launch Builder Console →
            </Link>
            <Link href="/pricing" style={{ padding: '1rem 1.75rem', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border-color)', color: 'white', textDecoration: 'none', fontWeight: 600 }}>
              View Enterprise Plans
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
