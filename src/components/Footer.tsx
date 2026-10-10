"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExultiaLogo } from "@/components/BrandIcons";
import { isIsolatedThreatFeed } from "@/config/site-config";

export default function Footer() {
  const pathname = usePathname();

  // Hide full footer links on private preview / holding page
  if (pathname === "/preview") {
    return null;
  }
  
  const isIsolated = isIsolatedThreatFeed(
    pathname,
    typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null
  );

  const isStandaloneRoute = pathname?.startsWith("/app/uvi/standalone") || pathname?.startsWith("/app/uvi/isolated");
  const threatFeedHome = isStandaloneRoute ? "/app/uvi/standalone" : "/app/uvi";
  const threatFeedStats = isStandaloneRoute ? "/app/uvi/standalone/stats" : "/app/uvi/stats";

  if (isIsolated) {
    return (
      <footer className="public-footer no-print">
        <div className="footer-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2.5rem" }}>
          
          {/* BRAND & MISSION - ISOLATED Vantage FOCUS */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <ExultiaLogo size={34} />
              <div style={{ display: "flex", alignItems: "baseline", gap: "5px" }}>
                <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF" }}>Exultia</span>
                <span style={{ fontSize: "0.7rem", color: "#60A5FA", fontWeight: 700, textTransform: "lowercase" }}>.tech</span>
                <span style={{
                  marginLeft: "4px",
                  fontSize: "0.65rem",
                  background: "rgba(139, 92, 246, 0.2)",
                  color: "#C084FC",
                  border: "1px solid rgba(139, 92, 246, 0.35)",
                  padding: "1px 6px",
                  borderRadius: "4px",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase"
                }}>
                  Vantage
                </span>
              </div>
            </div>

            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.6", maxWidth: "320px" }}>
              Vantage aggregates 110+ authoritative security feeds, CVE databases, active zero-days, and real-time malware telemetry into a unified open intelligence platform.
            </p>

            <div style={{ marginTop: "1.25rem", display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
              <span className="github-badge">✓ 110+ Live Feeds</span>
              <span className="github-badge">✓ Real-Time Consensus</span>
              <span className="github-badge">✓ Open Threat Data</span>
            </div>
          </div>

          {/* COLUMN 1: Vantage THREAT PLATFORM */}
          <div className="footer-col">
            <div style={{ fontSize: "0.72rem", color: "#A78BFA", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>Platform</div>
            <h4>Threat Intelligence</h4>
            <ul>
              <li><Link href={threatFeedHome}>Threat Feed Registry</Link></li>
              <li><Link href={threatFeedStats}>Global Statistics Dashboard</Link></li>
              <li><a href="/api/threat-feed" target="_blank" rel="noreferrer">Consolidated REST API (JSON)</a></li>
              <li><a href="/api/threat-feed/stats" target="_blank" rel="noreferrer">Telemetry API Endpoint</a></li>
            </ul>
          </div>

          {/* COLUMN 2: AUTHORITATIVE FEEDS */}
          <div className="footer-col">
            <div style={{ fontSize: "0.72rem", color: "#60A5FA", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>Intelligence Sources</div>
            <h4>Coverage & Feeds</h4>
            <ul>
              <li><a href="https://www.cisa.gov/known-exploited-vulnerabilities-catalog" target="_blank" rel="noreferrer">CISA KEV Catalog Sync</a></li>
              <li><a href="https://www.cve.org" target="_blank" rel="noreferrer">CVE Program v5 & NVD</a></li>
              <li><a href="https://urlhaus.abuse.ch" target="_blank" rel="noreferrer">abuse.ch Malware Streams</a></li>
              <li><a href="https://osv.dev" target="_blank" rel="noreferrer">OSV Supply Chain Advisories</a></li>
            </ul>
          </div>

          {/* COLUMN 3: STANDARDS & TRANSPARENCY */}
          <div className="footer-col">
            <div style={{ fontSize: "0.72rem", color: "#34D399", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>Transparency</div>
            <h4>Open Security Data</h4>
            <ul>
              <li><Link href={`${threatFeedHome}#sources`}>110+ Source Registry</Link></li>
              <li><Link href={threatFeedStats}>Empirical CNA Metrics</Link></li>
              <li><span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>CC-BY-4.0 Open License</span></li>
              <li><span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Zero Tracking / Privacy-First</span></li>
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
            © {new Date().getFullYear()} Exultia Threat Intelligence (exultia.tech). Open & auditable security data.
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <Link href={threatFeedHome} style={{ color: "#94A3B8", textDecoration: "none" }}>Feed Registry</Link>
            <Link href={threatFeedStats} style={{ color: "#94A3B8", textDecoration: "none" }}>Statistics</Link>
            <a href="/api/threat-feed" target="_blank" rel="noreferrer" style={{ color: "#94A3B8", textDecoration: "none" }}>REST API</a>
          </div>
        </div>
      </footer>
    );
  }

  // STANDARD MULTI-PRODUCT FOOTER
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
            <li><Link href="/app/pureide">Builder Console</Link></li>
            <li><Link href="/products/pure-ide/pricing">Plans & Pricing</Link></li>
          </ul>
        </div>

        {/* COLUMN 2: CORE PLATFORMS - Vantage */}
        <div className="footer-col">
          <div style={{ fontSize: "0.72rem", color: "#A78BFA", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>Cyber Intelligence</div>
          <h4>Vantage</h4>
          <ul>
            <li><Link href="/app/uvi">Threat Feed Registry</Link></li>
            <li><Link href="/app/uvi/stats">Global Statistics</Link></li>
            <li><a href="/api/threat-feed" target="_blank" rel="noreferrer">Vantage REST API (JSON)</a></li>
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
            <li><Link href="/app/inquest">Inquest Workspace</Link></li>
          </ul>
        </div>

        {/* COLUMN 4: CORE PLATFORMS - SECURITY TOOLS */}
        <div className="footer-col">
          <div style={{ fontSize: "0.72rem", color: "#34D399", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>DevSecOps Tooling</div>
          <h4>Remediation & Hardening</h4>
          <ul>
            <li><Link href="/app/praxis">Praxis Generator</Link></li>
            <li><Link href="/products/praxis/pricing">Praxis Licensing</Link></li>
            <li><Link href="/app/pureos">PureOS</Link></li>
            <li><Link href="/products/pure-os">PureOS Overview</Link></li>
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
          <Link href="/app/uvi" style={{ color: "#94A3B8", textDecoration: "none" }}>Vantage</Link>
          <Link href="/app/inquest" style={{ color: "#94A3B8", textDecoration: "none" }}>Inquest</Link>
        </div>
      </div>
    </footer>
  );
}
