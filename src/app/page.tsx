import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="fade-in">
      
      {/* HERO SECTION */}
      <section className="hero-section" style={{ paddingBottom: '3rem' }}>
        <div className="hero-badge">
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34D399' }}></span>
          Zero-Trust Developer Workstation Platform
        </div>

        <h1 className="hero-title" style={{ fontSize: '3.3rem', marginBottom: '1.25rem' }}>
          Hardened Developer Workstations, <br/>
          <span className="gradient-text">Built & Governed in Seconds</span>
        </h1>

        <p className="hero-desc" style={{ maxWidth: '780px', marginBottom: '2rem' }}>
          SecureIDE compiles and distributes zero-trust, enterprise-hardened IDE releases across <strong>VS Code, Eclipse Theia, Zed (Rust), Neovim, JupyterLab, and VSCodium</strong> — sealed with tamper-proof binary encapsulation, gated by Unified Vulnerability Intelligence (UVI), and verified with CycloneDX SBOMs.
        </p>

        <div className="hero-cta-group">
          <Link 
            href="/console" 
            className="btn-primary" 
            style={{ padding: '0.9rem 1.85rem', fontSize: '1rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Launch Builder Console →
          </Link>
          <Link 
            href="/features" 
            style={{ padding: '0.9rem 1.6rem', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
            Explore Architecture
          </Link>
        </div>
      </section>

      {/* 4 CORE PRODUCT PILLARS (POINT-BY-POINT) */}
      <section style={{ maxWidth: '1240px', margin: '0 auto 5.5rem auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#34D399', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
            Product Summary
          </span>
          <h2 style={{ fontSize: '2rem', marginTop: '0.4rem', letterSpacing: '-0.01em' }}>
            The Platform in 4 Key Points
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          
          <div className="glass-card" style={{ padding: '1.75rem', marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', display: 'grid', placeItems: 'center', color: '#60A5FA', fontWeight: 800 }}>1</div>
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Multi-IDE Engine Assembly</h3>
            </div>
            <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <li><strong>6 Supported Engines</strong>: VS Code, Eclipse Theia, Zed (Rust), Neovim, JupyterLab, VSCodium.</li>
              <li><strong>Cross-Platform</strong>: Compiles simultaneously for Windows (MSI), macOS (PKG), and Linux (AppImage/Deb).</li>
              <li><strong>Zero Local Infrastructure</strong>: Assembled on-demand in ephemeral cloud sandboxes.</li>
            </ul>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem', marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(52, 211, 153, 0.15)', display: 'grid', placeItems: 'center', color: '#34D399', fontWeight: 800 }}>2</div>
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>UVI Threat Intelligence Gate</h3>
            </div>
            <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <li><strong>12+ Ingested Feeds</strong>: NIST NVD, CISA KEV, GHSA, OSV.dev, Trail of Bits, JFrog, Socket.dev.</li>
              <li><strong>Build-Time Enforcement</strong>: Strict 0-CVE baseline blocks poisoned updates and typosquats.</li>
              <li><strong>AST Reachability</strong>: Correlates IPC call graphs to detect exploitable execution paths.</li>
            </ul>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem', marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(167, 139, 250, 0.15)', display: 'grid', placeItems: 'center', color: '#A78BFA', fontWeight: 800 }}>3</div>
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Immutable Binary Hardening</h3>
            </div>
            <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <li><strong>Sealed Rules</strong>: Policies and air-gap proxy routes compiled directly into runtime binary storage.</li>
              <li><strong>Tamper-Proof</strong>: Eliminates plaintext configuration files on developer disks.</li>
              <li><strong>EDR Compliance</strong>: Digitally signed binaries integrate with Windows WDAC & macOS Gatekeeper.</li>
            </ul>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem', marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(251, 191, 36, 0.15)', display: 'grid', placeItems: 'center', color: '#FBBF24', fontWeight: 800 }}>4</div>
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>SBOMs & Zero Telemetry</h3>
            </div>
            <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <li><strong>CycloneDX 1.5 JSON</strong>: Cryptographic package hashes and source proofs with every release.</li>
              <li><strong>Strict Zero Outbound</strong>: Excision of telemetry daemons, tracking beacons, and crash reporters.</li>
              <li><strong>Zero Custody</strong>: Stateless runner never stores customer source code or private keys.</li>
            </ul>
          </div>

        </div>
      </section>

      {/* CORE PRODUCT CAPABILITIES (POINT-BY-POINT GRID) */}
      <section style={{ maxWidth: '1240px', margin: '0 auto 6rem auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Product Capabilities Breakdown</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '650px', margin: '0 auto' }}>
            Everything required to secure, customize, and govern developer workstations across your enterprise.
          </p>
        </div>

        <div className="feature-grid-3">
          
          <div className="feature-box" style={{ padding: '1.75rem' }}>
            <div className="feature-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Extension Sandboxing</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              • Blocks unauthorized outbound network sockets<br/>
              • Audits and restricts subprocess execution<br/>
              • Isolates sensitive environment tokens and credentials
            </p>
          </div>

          <div className="feature-box" style={{ padding: '1.75rem' }}>
            <div className="feature-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>1-Click Role Blueprints</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              • Full-Stack Web (Node.js, TypeScript, React, Tailwind)<br/>
              • Python AI / Data Science (PyTorch, Jupyter, Ruff)<br/>
              • Cloud DevOps (Terraform, Docker, K8s, Go)
            </p>
          </div>

          <div className="feature-box" style={{ padding: '1.75rem' }}>
            <div className="feature-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a7 7 0 0 0 0 14 2.5 2.5 0 0 0 2.5-2.5c0-.8-.3-1.5-.8-2"/></svg>
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>White-Label Studio</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              • Custom enterprise branding and splash screens<br/>
              • Internal registry proxy routing (JFrog Artifactory)<br/>
              • Standardized corporate window titles and themes
            </p>
          </div>

          <div className="feature-box" style={{ padding: '1.75rem' }}>
            <div className="feature-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Air-Gapped Localization (i18n)</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              • Pre-provisions 12+ verified language packs<br/>
              • Native offline locale enforcement<br/>
              • Zero runtime external marketplace dependency
            </p>
          </div>

          <div className="feature-box" style={{ padding: '1.75rem' }}>
            <div className="feature-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Automated SBOM Attestation</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              • CycloneDX 1.5 JSON specification compliance<br/>
              • SHA-256 binary digests for all packaged components<br/>
              • Meets Executive Order 14028 software supply chain criteria
            </p>
          </div>

          <div className="feature-box" style={{ padding: '1.75rem' }}>
            <div className="feature-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>MDM & CI/CD Deployment</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              • Native installers for Microsoft Intune, Jamf & Ansible<br/>
              • Headless Build REST API for automated CI/CD pipelines<br/>
              • Instant dry-run verification before packaging
            </p>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS (3 CONCISE STEPS) */}
      <section style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '4.5rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>How It Works in 3 Steps</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Deterministic workflow from curation to workstation deployment.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            
            <div className="glass-card" style={{ padding: '1.75rem', marginBottom: 0 }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
                01. Curate
              </div>
              <strong style={{ fontSize: '1rem', display: 'block', marginBottom: '0.35rem' }}>Select Engine & Stack</strong>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                Choose your IDE engine, apply a role blueprint or custom extension list, and set zero-telemetry and proxy rules.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.75rem', marginBottom: 0 }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-secondary)', marginBottom: '0.5rem' }}>
                02. Assemble
              </div>
              <strong style={{ fontSize: '1rem', display: 'block', marginBottom: '0.35rem' }}>Cloud Sandbox Compilation</strong>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                Our stateless cloud runner correlates UVI threat signals, strips telemetry, and compiles sealed binaries for Win, Mac, and Linux.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.75rem', marginBottom: 0 }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34D399', marginBottom: '0.5rem' }}>
                03. Deploy
              </div>
              <strong style={{ fontSize: '1rem', display: 'block', marginBottom: '0.35rem' }}>Download & Distribute</strong>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                Download digitally signed native installers with exportable CycloneDX 1.5 JSON SBOMs for MDM and enterprise audits.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ maxWidth: '1000px', margin: '5rem auto 3rem auto', padding: '0 2rem' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '20px', padding: '3.5rem 2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Ready to Build Your Hardened Workstation?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            Launch a zero-trust custom build in under 60 seconds with our interactive web console.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/console" className="btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1rem', textDecoration: 'none' }}>
              Launch Builder Console →
            </Link>
            <Link href="/pricing" style={{ padding: '0.9rem 1.75rem', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border-color)', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
              View Pricing Plans
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
