import Link from "next/link";

export default function Footer() {
  return (
    <footer className="public-footer no-print">
      <div className="footer-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2.5rem" }}>
        
        {/* BRAND & MISSION */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={{
              width: "34px",
              height: "34px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #06B6D4 100%)",
              display: "grid",
              placeItems: "center",
              color: "white"
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                <line x1="12" y1="22" x2="12" y2="15.5" />
              </svg>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "5px" }}>
              <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF" }}>Exultia</span>
              <span style={{ fontSize: "0.7rem", color: "#60A5FA", fontWeight: 700, textTransform: "lowercase" }}>.tech</span>
            </div>
          </div>

          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.6", maxWidth: "300px" }}>
            High-assurance deterministic infrastructure for zero-trust developer workstations, global cyber threat intelligence, and open governance standards.
          </p>

          <div style={{ marginTop: "1.25rem", display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            <span className="github-badge">✓ 100% Deterministic</span>
            <span className="github-badge">✓ Zero Ambient Telemetry</span>
            <span className="github-badge">✓ Vendor-Agnostic</span>
          </div>
        </div>

        {/* COLUMN 1: CORE PLATFORMS - PUREIDE */}
        <div className="footer-col">
          <div style={{ fontSize: "0.72rem", color: "#60A5FA", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>Core Platform</div>
          <h4>PureIDE</h4>
          <ul>
            <li><Link href="/products/pure-ide">Product Overview</Link></li>
            <li><Link href="/console">Builder Console</Link></li>
            <li><Link href="/features">Architecture & Specs</Link></li>
            <li><Link href="/pricing">Plans & Pricing</Link></li>
            <li><Link href="/docs">Technical Docs</Link></li>
          </ul>
        </div>

        {/* COLUMN 2: CORE PLATFORMS - THREAT INTEL */}
        <div className="footer-col">
          <div style={{ fontSize: "0.72rem", color: "#A78BFA", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>Cyber Intelligence</div>
          <h4>UVI Threat Feed</h4>
          <ul>
            <li><Link href="/threat-feed">Threat Feed Registry</Link></li>
            <li><a href="/api/threat-feed" target="_blank" rel="noreferrer">UVI REST API (JSON)</a></li>
            <li><Link href="/features#sandbox">Air-Gapped Sandboxing</Link></li>
            <li><Link href="/features#hardening">Workstation Binary Hardening</Link></li>
            <li><Link href="/docs#sbom">CycloneDX 1.5 JSON SBOMs</Link></li>
          </ul>
        </div>

        {/* COLUMN 3: STANDALONE FOIA & CIVIC UTILITIES */}
        <div className="footer-col">
          <div style={{ fontSize: "0.72rem", color: "#06B6D4", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>Standalone Utility</div>
          <h4>Inquest FOIA</h4>
          <ul>
            <li><Link href="/products/inquest">Utility Overview</Link></li>
            <li><Link href="/products/inquest/pricing">Access & Subscriptions</Link></li>
            <li><Link href="/inquest">Request Wizard</Link></li>
            <li><Link href="/inquest?tab=agencies">50-State Agency Directory</Link></li>
            <li><Link href="/inquest?tab=analyzer">Denial & Exemption Analyzer</Link></li>
            <li><Link href="/products/civic-pulse">CivicPulse Terminal</Link></li>
          </ul>
        </div>

        {/* COLUMN 4: OPEN GOVERNANCE STANDARDS */}
        <div className="footer-col">
          <div style={{ fontSize: "0.72rem", color: "#34D399", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>Standards Lab</div>
          <h4>Governance Standards</h4>
          <ul>
            <li><Link href="/governance">Frameworks Hub</Link></li>
            <li><Link href="/governance/alpr-csf">ALPR-CSF (Surveillance Standard)</Link></li>
            <li><Link href="/governance/raij-csf">RAIJ-CSF (Responsible AI Standard)</Link></li>
            <li><Link href="/governance/raij-csf#ai-cross-walk-matrix">NIST / ISO / OMB Cross-Walks</Link></li>
            <li><Link href="/governance/raij-csf#ai-compliance-assessment">Interactive Compliance Audits</Link></li>
          </ul>
        </div>

      </div>

      {/* FOOTER BOTTOM */}
      <div style={{
        marginTop: "3rem",
        paddingTop: "1.5rem",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
        fontSize: "0.8rem",
        color: "#64748B"
      }}>
        <div>
          © {new Date().getFullYear()} Exultia (exultia.tech). All rights reserved. CC-BY-4.0 Open Intelligence.
        </div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <Link href="/about" style={{ color: "#94A3B8", textDecoration: "none" }}>About</Link>
          <Link href="/#products" style={{ color: "#94A3B8", textDecoration: "none" }}>Products</Link>
          <Link href="/docs" style={{ color: "#94A3B8", textDecoration: "none" }}>Docs</Link>
          <Link href="/threat-feed" style={{ color: "#94A3B8", textDecoration: "none" }}>Threat Feed</Link>
          <Link href="/foia" style={{ color: "#94A3B8", textDecoration: "none" }}>FOIA</Link>
        </div>
      </div>
    </footer>
  );
}
