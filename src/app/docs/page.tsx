import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="fade-in" style={{ padding: '3rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
      
      <div style={{ marginBottom: '3rem' }}>
        <span className="hero-badge">Developer & DevOps Documentation</span>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          SecureIDE Technical Documentation
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '850px' }}>
          Architecture reference, cloud build engine specifications, REST API documentation, and CycloneDX 1.5 SBOM governance.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '3rem', alignItems: 'flex-start' }}>
        
        {/* DOCS SIDEBAR */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', position: 'sticky', top: '90px' }}>
          <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Documentation Index</strong>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <li><a href="#quickstart" style={{ color: '#60A5FA', textDecoration: 'none', fontSize: '0.85rem' }}>1. Quickstart Guide</a></li>
            <li><a href="#pipeline" style={{ color: '#34D399', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>2. Multi-OS Cloud Engine</a></li>
            <li><a href="#tamperproof" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>3. Tamper-Proof Binary Hardening</a></li>
            <li><a href="#threat-intel" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>4. 5-Source Threat Intelligence API</a></li>
            <li><a href="#rest-api" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>5. Headless Build REST API</a></li>
            <li><a href="#sbom" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>6. CycloneDX 1.5 SBOM Attestation</a></li>
          </ul>
        </div>

        {/* DOCS CONTENT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          {/* SECTION 1: QUICKSTART */}
          <section id="quickstart" className="glass-card" style={{ padding: '2rem', marginBottom: 0 }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>1. Quickstart Guide</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
              Building a secure, air-gapped IDE distribution takes under 60 seconds using the SecureIDE Builder Console.
            </p>
            <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <li>
                <strong style={{ color: 'var(--text-main)' }}>Select Your Engine & Tier</strong>: Choose your base IDE (<code>VS Code</code>, <code>Eclipse Theia</code>, <code>Zed</code>, <code>Neovim</code>, or <code>JupyterLab</code>) and subscription tier.
              </li>
              <li>
                <strong style={{ color: 'var(--text-main)' }}>Curate Plugins & Blueprints</strong>: Search the catalog or apply any role-based blueprint stack.
              </li>
              <li>
                <strong style={{ color: 'var(--text-main)' }}>Validate & Compile</strong>: Click <strong>"Dry Run Validation"</strong> to inspect the CycloneDX 1.5 SBOM, then click <strong>"Compile Release"</strong> to trigger the multi-OS cloud build.
              </li>
            </ol>
          </section>

          {/* SECTION 2: MULTI-OS CLOUD ENGINE */}
          <section id="pipeline" className="glass-card" style={{ padding: '2.25rem', marginBottom: 0, border: '1px solid rgba(52, 211, 153, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', margin: 0 }}>2. Multi-OS Cloud Build Architecture</h2>
                <span style={{ fontSize: '0.8rem', color: '#34D399', fontWeight: 600 }}>Multi-OS Matrix • Ephemeral Virtual Sandboxes</span>
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem', fontSize: '0.92rem' }}>
              SecureIDE executes deterministic packaging inside clean, ephemeral cloud sandboxes. Target operating system payloads are assembled in parallel with zero persistent server footprint:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: '#93C5FD', display: 'block', fontSize: '0.85rem' }}>Windows Target</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Assembles hardened native binaries, portable archives, and enterprise Windows installers (.exe).</span>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: '#34D399', display: 'block', fontSize: '0.85rem' }}>Linux Target</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Compiles hardened Linux distributions into portable tar.gz and system packages with zero outbound beacons.</span>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: '#FBBF24', display: 'block', fontSize: '0.85rem' }}>macOS Target</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Builds signed Apple Silicon .app bundles with Gatekeeper integrity support.</span>
              </div>
            </div>
          </section>

          {/* SECTION 3: TAMPER-PROOF BINARY HARDENING */}
          <section id="tamperproof" className="glass-card" style={{ padding: '2rem', marginBottom: 0 }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>3. Tamper-Proof Binary Hardening & Governance</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem', fontSize: '0.92rem' }}>
              To ensure that developers cannot manually alter marketplace URLs or telemetry settings on local workstations, SecureIDE enforces security policies at the binary level:
            </p>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              <li><strong>Zero Plaintext Config Files</strong>: Configuration settings and policies are sealed inside the native binary distribution and removed from disk.</li>
              <li><strong>Immutable Governance Rules</strong>: Telemetry disablement and air-gap gallery locks are enforced at application runtime.</li>
              <li><strong>System Directory Protection</strong>: Delivered via enterprise installers requiring administrative elevation to modify.</li>
            </ul>
          </section>

          {/* SECTION 4: 5-SOURCE THREAT INTELLIGENCE */}
          <section id="threat-intel" className="glass-card" style={{ padding: '2rem', marginBottom: 0 }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>4. 5-Source Threat Intelligence & Public API</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem', fontSize: '0.92rem' }}>
              SecureIDE aggregates security signals across NIST NVD, JFrog Security Research, Aqua Nautilus, Socket.dev, and OpenSSF Scorecards:
            </p>
            <pre style={{ background: '#0F172A', padding: '1.25rem', borderRadius: '8px', color: '#38BDF8', fontSize: '0.8rem', lineHeight: '1.6', overflowX: 'auto', fontFamily: 'monospace', border: '1px solid rgba(255,255,255,0.06)' }}>
{`# Query live threat intelligence feed
curl -s "https://secureide.dev/api/threat-feed" | jq .

# Filter by Grade A+ packages only
curl -s "https://secureide.dev/api/threat-feed?grade=A+" | jq .records`}
            </pre>
          </section>

          {/* SECTION 5: HEADLESS REST BUILD API */}
          <section id="rest-api" className="glass-card" style={{ padding: '2rem', marginBottom: 0 }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>5. Headless REST Build API (Enterprise)</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem', fontSize: '0.92rem' }}>
              Trigger hardened builds and retrieve signed release packages, CycloneDX SBOMs, and checksums programmatically from internal corporate CI/CD pipelines:
            </p>
            <pre style={{ background: '#0F172A', padding: '1.25rem', borderRadius: '8px', color: '#38BDF8', fontSize: '0.8rem', lineHeight: '1.6', overflowX: 'auto', fontFamily: 'monospace', border: '1px solid rgba(255,255,255,0.06)' }}>
{`# Dispatch an automated multi-OS enterprise build
curl -X POST https://api.secureide.dev/api/build \\
  -H "Authorization: Bearer sec_live_enterprise_token" \\
  -H "Content-Type: application/json" \\
  -d '{
    "engine": "vscode",
    "tier": "ENTERPRISE",
    "targetOs": "windows",
    "brandName": "Citadel Studio",
    "locale": "es",
    "registryUrl": "https://artifactory.corp.internal/vscode/gallery",
    "extensions": ["dbaeumer.vscode-eslint", "esbenp.prettier-vscode"]
  }'`}
            </pre>
          </section>

          {/* SECTION 6: CYCLONEDX 1.5 SBOM */}
          <section id="sbom" className="glass-card" style={{ padding: '2rem', marginBottom: 0 }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>6. CycloneDX 1.5 SBOM Attestation</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem', fontSize: '0.92rem' }}>
              Every compiled distribution outputs a standard CycloneDX 1.5 JSON Software Bill of Materials containing cryptographic integrity digests for all packaged components:
            </p>
            <pre style={{ background: '#0F172A', padding: '1.25rem', borderRadius: '8px', color: '#38BDF8', fontSize: '0.8rem', lineHeight: '1.6', overflowX: 'auto', fontFamily: 'monospace', border: '1px solid rgba(255,255,255,0.06)' }}>
{`{
  "bomFormat": "CycloneDX",
  "specVersion": "1.5",
  "version": 1,
  "metadata": {
    "component": {
      "type": "application",
      "name": "SecureIDE Studio",
      "version": "1.135.0"
    }
  },
  "components": [
    {
      "type": "application",
      "name": "SecureIDE_Studio.exe",
      "hashes": [{ "alg": "SHA-256", "content": "9b1d..." }]
    },
    {
      "type": "framework",
      "name": "runtime-core",
      "hashes": [{ "alg": "SHA-256", "content": "4e7a..." }]
    }
  ]
}`}
            </pre>
          </section>

        </div>
      </div>

    </div>
  );
}
