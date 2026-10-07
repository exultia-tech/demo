import Link from "next/link";
import { Metadata } from "next";
import { InquestIcon } from "@/components/BrandIcons";
import { JURISDICTIONS_LIST } from "@/lib/foia/statutes";
import { AGENCIES_DATABASE } from "@/lib/foia/agencies";

export const metadata: Metadata = {
  title: "Exultia Inquest | Public Records & FOIA Assistant",
  description: "Automated public records assistant. Covers 50-state sunshine laws and federal FOIA to help you cite relevant statutes, track deadlines, and generate appeal letters.",
};

export default function InquestProductLandingPage() {
  return (
    <div className="fade-in" style={{ paddingBottom: "5rem" }}>
      {/* PRODUCT HERO */}
      <section className="hero-section" style={{ paddingTop: "3rem", paddingBottom: "3.5rem" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
          <InquestIcon size={64} glow={true} />
        </div>
        <h1 className="hero-title" style={{ fontSize: "3.6rem", marginBottom: "1.25rem", letterSpacing: "-0.03em", lineHeight: 1.12 }}>
          Exultia <span style={{ color: "#06B6D4" }}>Inquest</span>
          <br />
          <span className="gradient-text">Public Records, Simplified</span>
        </h1>

        <p className="hero-desc" style={{ maxWidth: "780px", margin: "0 auto 2.25rem auto", fontSize: "1.2rem", lineHeight: "1.65", color: "#94A3B8" }}>
          A modern public records assistant. Covers {JURISDICTIONS_LIST.length} state and federal sunshine frameworks to help you cite the right laws, track statutory deadlines, and draft formal appeals.
        </p>

        <div className="hero-cta-group" style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <Link 
            href="/app/inquest" 
            className="btn-primary" 
            style={{ padding: "0.95rem 2rem", fontSize: "1rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.55rem", background: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Launch Inquest Workspace →
          </Link>
          <Link 
            href="/app/inquest?tab=agencies" 
            style={{ padding: "0.95rem 1.7rem", borderRadius: "10px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border-color)", color: "white", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem" }}>
            50-State Agency Directory
          </Link>
          <Link 
            href="/products/inquest/pricing" 
            style={{ padding: "0.95rem 1.7rem", borderRadius: "10px", background: "rgba(6, 182, 212, 0.1)", border: "1px solid rgba(6, 182, 212, 0.3)", color: "#67E8F9", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem" }}>
            Plans & Pricing ($0, $49, $149)
          </Link>
        </div>
      </section>

      {/* QUICK STATS BANNER */}
      <section style={{ background: "rgba(255,255,255,0.015)", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)", padding: "3rem 2rem", marginBottom: "5rem" }}>
        <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem", textAlign: "center" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#67E8F9", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Legal Coverage
              </div>
              <div style={{ fontSize: "2.3rem", fontWeight: 900, color: "#FFFFFF", marginTop: "0.25rem" }}>
                50 States + FOIA
              </div>
              <div style={{ fontSize: "0.82rem", color: "#94A3B8", marginTop: "0.25rem" }}>
                Federal 5 U.S.C. § 552 and all state sunshine statutes
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", color: "#60A5FA", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Agency Directory
              </div>
              <div style={{ fontSize: "2.3rem", fontWeight: 900, color: "#FFFFFF", marginTop: "0.25rem" }}>
                {AGENCIES_DATABASE.length}+
              </div>
              <div style={{ fontSize: "0.82rem", color: "#94A3B8", marginTop: "0.25rem" }}>
                Federal departments, state bureaus, and municipal offices
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", color: "#34D399", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Privacy Model
              </div>
              <div style={{ fontSize: "2.3rem", fontWeight: 900, color: "#FFFFFF", marginTop: "0.25rem" }}>
                100% Local
              </div>
              <div style={{ fontSize: "0.82rem", color: "#94A3B8", marginTop: "0.25rem" }}>
                Case drafts and files stay directly in your browser
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", color: "#A78BFA", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Statutory Timers
              </div>
              <div style={{ fontSize: "2.3rem", fontWeight: 900, color: "#FFFFFF", marginTop: "0.25rem" }}>
                Auto-Tracked
              </div>
              <div style={{ fontSize: "0.82rem", color: "#94A3B8", marginTop: "0.25rem" }}>
                Calculates working days excluding federal & state holidays
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 CORE CAPABILITIES */}
      <section style={{ maxWidth: "1240px", margin: "0 auto 6rem auto", padding: "0 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ fontSize: "0.8rem", color: "#06B6D4", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
            Key Features
          </span>
          <h2 style={{ fontSize: "2.2rem", marginTop: "0.35rem", marginBottom: "0.5rem" }}>How Inquest Helps You</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: "650px", margin: "0 auto" }}>
            Tools to make requesting public records faster, clearer, and more effective.
          </p>
        </div>

        <div className="feature-grid-3">
          <div className="feature-box" style={{ padding: "1.75rem" }}>
            <div className="feature-icon-wrapper" style={{ color: "#06B6D4" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>Accurate Legal Citations</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>
              • Exact legal citations for all 50 states + Federal FOIA<br/>
              • Built-in segregability clauses requesting partial release<br/>
              • Fee waiver justifications for journalists, non-profits, and educators
            </p>
          </div>

          <div className="feature-box" style={{ padding: "1.75rem" }}>
            <div className="feature-icon-wrapper" style={{ color: "#06B6D4" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            </div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>Denial Letter Analyzer</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>
              • Paste agency denial letters to identify cited exemptions<br/>
              • Explains why an exemption was claimed in plain English<br/>
              • Drafts complete administrative appeal letters with legal arguments
            </p>
          </div>

          <div className="feature-box" style={{ padding: "1.75rem" }}>
            <div className="feature-icon-wrapper" style={{ color: "#06B6D4" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>Response Deadline Timers</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>
              • Tracks statutory countdowns (e.g. 20 working days under FOIA)<br/>
              • Automatically adjusts for weekends and official holidays<br/>
              • Follow-up letter templates when agencies miss deadlines
            </p>
          </div>

          <div className="feature-box" style={{ padding: "1.75rem" }}>
            <div className="feature-icon-wrapper" style={{ color: "#06B6D4" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>Private Local Storage</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>
              • Case drafts and notes are stored directly in your browser<br/>
              • No tracking or third-party data sharing<br/>
              • Export encrypted JSON backups whenever you want
            </p>
          </div>

          <div className="feature-box" style={{ padding: "1.75rem" }}>
            <div className="feature-icon-wrapper" style={{ color: "#06B6D4" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>Verification & Proof of Filing</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>
              • Generates cryptographic timestamps for all outgoing requests<br/>
              • Verifiable logs establishing filing dates and exact wording<br/>
              • Organized documentation for formal appeals or legal records
            </p>
          </div>

          <div className="feature-box" style={{ padding: "1.75rem" }}>
            <div className="feature-icon-wrapper" style={{ color: "#06B6D4" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>1-Click Email & PDF Export</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>
              • Pre-populates email drafts with proper subject lines and agency contacts<br/>
              • Exports clean, formatted PDF letters ready to mail or upload<br/>
              • Quick copy for government web portals (FOIA.gov, NextRequest)
            </p>
          </div>
        </div>
      </section>

      {/* PRICING TIERS PREVIEW */}
      <section style={{ maxWidth: "1180px", margin: "5rem auto 0 auto", padding: "0 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontSize: "0.8rem", color: "#67E8F9", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
            Plans & Pricing
          </div>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Free for Individuals · Scaled for Newsrooms & Teams
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", maxWidth: "680px", margin: "0.5rem auto 0 auto" }}>
            The core request builder and 50-state database are completely free for individuals. Upgrade for multi-agency campaigns and collaborative team dockets.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {/* Civic Card */}
          <div style={{
            background: "rgba(10, 15, 26, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#FFFFFF" }}>Community</h3>
                <span style={{ fontSize: "0.7rem", color: "#34D399", background: "rgba(52, 211, 153, 0.15)", padding: "2px 8px", borderRadius: "999px", fontWeight: 700 }}>
                  Free Forever
                </span>
              </div>
              <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#FFFFFF", marginBottom: "0.75rem" }}>
                $0 <span style={{ fontSize: "0.85rem", color: "#94A3B8", fontWeight: 500 }}>/ forever</span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#94A3B8", lineHeight: "1.5", marginBottom: "1.25rem" }}>
                Full access to all 50 state sunshine laws, letter drafting, and private local storage.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.82rem", color: "#CBD5E1" }}>
                <li>✓ All 50 state sunshine laws + Federal FOIA</li>
                <li>✓ Built-in segregability and fee-waiver clauses</li>
                <li>✓ Bring-Your-Own Gemini API Key (0 token fees)</li>
                <li>✓ Verifiable request timestamps and receipts</li>
              </ul>
            </div>
            <Link 
              href="/app/inquest" 
              style={{
                marginTop: "1.75rem",
                display: "block",
                textAlign: "center",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#FFFFFF",
                fontSize: "0.88rem",
                fontWeight: 700,
                textDecoration: "none"
              }}>
              Start Free Workspace →
            </Link>
          </div>

          {/* Pro Card */}
          <div style={{
            background: "linear-gradient(180deg, rgba(6, 182, 212, 0.12) 0%, rgba(10, 15, 26, 0.8) 100%)",
            border: "2px solid #06B6D4",
            borderRadius: "16px",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 15px 30px -10px rgba(6, 182, 212, 0.3)"
          }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#FFFFFF" }}>Pro</h3>
                <span style={{ fontSize: "0.7rem", color: "#67E8F9", background: "rgba(6, 182, 212, 0.2)", padding: "2px 8px", borderRadius: "999px", fontWeight: 700 }}>
                  1 User License
                </span>
              </div>
              <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#FFFFFF", marginBottom: "0.75rem" }}>
                $49 <span style={{ fontSize: "0.85rem", color: "#94A3B8", fontWeight: 500 }}>/ mo ($39 billed annually)</span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#94A3B8", lineHeight: "1.5", marginBottom: "1.25rem" }}>
                Multi-agency sweeps, automated follow-up scheduling, and inbound reply parsing for single investigators.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.82rem", color: "#F1F5F9" }}>
                <li>✓ Single Investigator License (1 User Seat)</li>
                <li>✓ Multi-Agency Campaign Sweeps (all 50 states)</li>
                <li>✓ Automated Deadline Follow-Up Reminders</li>
                <li>✓ Inbound Email Tracking (@inquest.exultia.tech)</li>
                <li>✓ Cloud Docket Sync & Calendar Reminders</li>
              </ul>
            </div>
            <Link 
              href="/account/subscription?product=inquest" 
              className="btn-primary"
              style={{
                marginTop: "1.75rem",
                display: "block",
                textAlign: "center",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)",
                color: "#041019",
                fontSize: "0.88rem",
                fontWeight: 800,
                textDecoration: "none"
              }}>
              Subscribe Pro ($49/mo) →
            </Link>
          </div>

          {/* Newsroom Card */}
          <div style={{
            background: "rgba(10, 15, 26, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#FFFFFF" }}>Enterprise</h3>
                <span style={{ fontSize: "0.7rem", color: "#A78BFA", background: "rgba(167, 139, 250, 0.15)", padding: "2px 8px", borderRadius: "999px", fontWeight: 700 }}>
                  5 Licenses (Volume Entitlement)
                </span>
              </div>
              <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#FFFFFF", marginBottom: "0.75rem" }}>
                $149 <span style={{ fontSize: "0.85rem", color: "#94A3B8", fontWeight: 500 }}>/ mo ($119 billed annually)</span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#94A3B8", lineHeight: "1.5", marginBottom: "1.25rem" }}>
                Shared team docket, duplicate request warnings, and exportable evidence packages.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.82rem", color: "#CBD5E1" }}>
                <li>✓ Collaborative Team Docket (5 volume licenses included)</li>
                <li>✓ Duplicate Request Warning Alerts</li>
                <li>✓ Legal Precedent & Exemption Citations</li>
                <li>✓ Exportable Certified Documentation Dossiers</li>
              </ul>
            </div>
            <Link 
              href="/account/subscription?product=inquest" 
              style={{
                marginTop: "1.75rem",
                display: "block",
                textAlign: "center",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                background: "rgba(167, 139, 250, 0.15)",
                border: "1px solid rgba(167, 139, 250, 0.3)",
                color: "#E2E8F0",
                fontSize: "0.88rem",
                fontWeight: 700,
                textDecoration: "none"
              }}>
              Subscribe Newsroom ($149/mo) →
            </Link>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link 
            href="/products/inquest/pricing" 
            style={{ color: "#67E8F9", fontSize: "0.95rem", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            Compare complete feature matrix & FAQ →
          </Link>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ maxWidth: "1000px", margin: "5rem auto 3rem auto", padding: "0 2rem" }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(59, 130, 246, 0.15))",
          border: "1px solid rgba(6, 182, 212, 0.3)",
          borderRadius: "20px",
          padding: "3.5rem 2rem",
          textAlign: "center",
          boxShadow: "0 20px 40px -15px rgba(0,0,0,0.8)"
        }}>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "0.75rem" }}>
            Draft Your First Public Records Request
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", maxWidth: "600px", margin: "0 auto 2rem auto" }}>
            Automated statutory citations, fee waiver arguments, and partial-release clauses in under 2 minutes.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/app/inquest" className="btn-primary" style={{ padding: "0.95rem 2.25rem", fontSize: "1rem", textDecoration: "none", background: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)" }}>
              Open Inquest Workspace Free →
            </Link>
            <Link href="/app/inquest?tab=agencies" style={{ padding: "0.95rem 1.85rem", borderRadius: "10px", background: "rgba(255,255,255,0.08)", border: "1px solid var(--border-color)", color: "white", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem" }}>
              Browse Agency Directory
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
