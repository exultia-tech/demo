import Link from "next/link";
import { ExultiaLogo } from "@/components/BrandIcons";

export default function Footer() {
  return (
    <footer className="public-footer no-print">
      <div className="footer-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2.5rem" }}>
        
        {/* BRAND & MISSION */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <ExultiaLogo size={34} />
            <div style={{ display: "flex", alignItems: "baseline", gap: "5px" }}>
              <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF" }}>Exultia</span>
              <span style={{ fontSize: "0.7rem", color: "#60A5FA", fontWeight: 700, textTransform: "lowercase" }}>.tech</span>
            </div>
          </div>

          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.6", maxWidth: "300px" }}>
            Practical tools for developer workstation security, global threat intelligence, and public records transparency.
          </p>

          <div style={{ marginTop: "1.25rem", display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            <span className="github-badge">✓ Open & Auditable</span>
            <span className="github-badge">✓ Privacy-First</span>
            <span className="github-badge">✓ Multi-Platform</span>
          </div>
        </div>

        {/* COLUMN 1: CORE PLATFORMS - PUREIDE */}
        <div className="footer-col">
          <div style={{ fontSize: "0.72rem", color: "#60A5FA", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>Core Platform</div>
          <h4>PureIDE</h4>
          <ul>
            <li><Link href="/products/pure-ide">Product Overview & Features</Link></li>
            <li><Link href="/products/pure-ide#architecture">Security Architecture</Link></li>
            <li><Link href="/console">Builder Console</Link></li>
            <li><Link href="/pricing">Plans & Pricing</Link></li>
          </ul>
        </div>

        {/* COLUMN 2: CORE PLATFORMS - UVI */}
        <div className="footer-col">
          <div style={{ fontSize: "0.72rem", color: "#A78BFA", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>Cyber Intelligence</div>
          <h4>Universal Vulnerability Intelligence (UVI)</h4>
          <ul>
            <li><Link href="/threat-feed">Threat Feed Registry</Link></li>
            <li><Link href="/threat-feed/stats">Global Statistics</Link></li>
            <li><a href="/api/threat-feed" target="_blank" rel="noreferrer">UVI REST API (JSON)</a></li>
            <li><Link href="/products/pure-ide#sandbox">Air-Gapped Sandboxing</Link></li>
          </ul>
        </div>

        {/* COLUMN 3: CORE PLATFORMS - INQUEST */}
        <div className="footer-col">
          <div style={{ fontSize: "0.72rem", color: "#06B6D4", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>Statutory Compliance</div>
          <h4>Inquest</h4>
          <ul>
            <li><Link href="/products/inquest">Product Overview</Link></li>
            <li><Link href="/products/inquest/features">Features & Tools</Link></li>
            <li><Link href="/products/inquest/pricing">Plans & Pricing</Link></li>
            <li><Link href="/inquest">Inquest Workspace</Link></li>
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
          <Link href="/#products" style={{ color: "#94A3B8", textDecoration: "none" }}>Products</Link>
          <Link href="/threat-feed" style={{ color: "#94A3B8", textDecoration: "none" }}>Universal Vulnerability Intelligence (UVI)</Link>
          <Link href="/inquest" style={{ color: "#94A3B8", textDecoration: "none" }}>Inquest</Link>
        </div>
      </div>
    </footer>
  );
}
