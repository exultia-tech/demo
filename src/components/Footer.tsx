import Link from "next/link";

export default function Footer() {
  return (
    <footer className="public-footer">
      <div className="footer-grid">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', display: 'grid', placeItems: 'center', color: 'white' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>SecureIDE</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '320px' }}>
            The enterprise standard for compiling, governing, and distributing hardened, zero-trust developer environments.
          </p>
          <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className="github-badge">✓ Zero Outbound Telemetry</span>
            <span className="github-badge">✓ CycloneDX 1.5 SBOM</span>
          </div>
        </div>

        {/* COLUMN 1: PRODUCT */}
        <div className="footer-col">
          <h4>Product</h4>
          <ul>
            <li><Link href="/features">Features & Capabilities</Link></li>
            <li><Link href="/pricing">Plans & Pricing</Link></li>
            <li><Link href="/console">Builder Console</Link></li>
            <li><Link href="/security">Zero-Trust Security</Link></li>
            <li><Link href="/docs#pipeline">Multi-OS Matrix</Link></li>
          </ul>
        </div>

        {/* COLUMN 2: THREAT INTELLIGENCE */}
        <div className="footer-col">
          <h4>Threat Intelligence</h4>
          <ul>
            <li><Link href="/threat-feed">Universal Threat Feeds</Link></li>
            <li><a href="/api/threat-feed" target="_blank" rel="noreferrer">Open Threat API (JSON)</a></li>
            <li><Link href="/features#sandbox">Air-Gap Architecture</Link></li>
            <li><Link href="/features#hardening">Binary Hardening</Link></li>
            <li><Link href="/docs#sbom">CycloneDX SBOMs</Link></li>
          </ul>
        </div>

        {/* COLUMN 3: DEVELOPER RESOURCES */}
        <div className="footer-col">
          <h4>Developer Resources</h4>
          <ul>
            <li><Link href="/docs">Documentation</Link></li>
            <li><Link href="/docs#quickstart">Quickstart Guide</Link></li>
            <li><Link href="/docs#pipeline">Cloud Build Pipeline</Link></li>
            <li><Link href="/docs#tamperproof">Governance Specs</Link></li>
            <li><Link href="/docs#rest-api">Headless REST API</Link></li>
          </ul>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', flexWrap: 'wrap', gap: '1rem' }}>
        <div>© 2026 SecureIDE Inc. All rights reserved. Zero telemetry recorded.</div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <span>System Status: <strong style={{ color: '#34D399' }}>● 100% Operational</strong></span>
        </div>
      </div>
    </footer>
  );
}
