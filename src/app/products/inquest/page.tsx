import Link from "next/link";
import { Metadata } from "next";
import { JURISDICTIONS_LIST } from "@/lib/foia/statutes";
import { AGENCIES_DATABASE } from "@/lib/foia/agencies";

export const metadata: Metadata = {
  title: "Exultia Inquest | Deterministic Open Records Autopilot",
  description: "Autonomous statutory open records platform. Codifies 50-state sunshine laws and federal FOIA to eliminate bureaucratic delays, mandate segregability, and synthesize administrative appeal briefs.",
};

export default function InquestProductLandingPage() {
  return (
    <div className="fade-in" style={{ paddingBottom: "5rem" }}>
      {/* PRODUCT HERO */}
      <section className="hero-section" style={{ paddingTop: "3rem", paddingBottom: "3.5rem" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(6, 182, 212, 0.12)",
          border: "1px solid rgba(6, 182, 212, 0.3)",
          borderRadius: "999px",
          padding: "5px 16px",
          marginBottom: "1.5rem",
          boxShadow: "0 0 15px rgba(6, 182, 212, 0.2)"
        }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#06B6D4", boxShadow: "0 0 8px #06B6D4" }} />
          <span style={{ fontSize: "0.8rem", color: "#67E8F9", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Product 03: Deterministic Open Records Autopilot
          </span>
        </div>

        <h1 className="hero-title" style={{ fontSize: "3.6rem", marginBottom: "1.25rem", letterSpacing: "-0.03em", lineHeight: 1.12 }}>
          Exultia <span style={{ color: "#06B6D4" }}>Inquest</span>
          <br />
          <span className="gradient-text">Statutory Open Records, Automated</span>
        </h1>

        <p className="hero-desc" style={{ maxWidth: "780px", margin: "0 auto 2.25rem auto", fontSize: "1.2rem", lineHeight: "1.65", color: "#94A3B8" }}>
          Autonomous public records intelligence platform. Codifies {JURISDICTIONS_LIST.length} statutory sunshine frameworks to mandate legal segregability, track mandatory 20-day countdowns, and synthesize ironclad administrative appeal briefs.
        </p>

        <div className="hero-cta-group" style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <Link 
            href="/inquest" 
            className="btn-primary" 
            style={{ padding: "0.95rem 2rem", fontSize: "1rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.55rem", background: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Launch Inquest Workspace →
          </Link>
          <Link 
            href="/inquest?tab=agencies" 
            style={{ padding: "0.95rem 1.7rem", borderRadius: "10px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border-color)", color: "white", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem" }}>
            50-State Agency Directory
          </Link>
          <Link 
            href="/inquest?tab=analyzer" 
            style={{ padding: "0.95rem 1.7rem", borderRadius: "10px", background: "rgba(6, 182, 212, 0.1)", border: "1px solid rgba(6, 182, 212, 0.3)", color: "#67E8F9", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem" }}>
            Denial Letter Analyzer
          </Link>
        </div>
      </section>

      {/* STATUTORY NUMBERS BANNER */}
      <section style={{ maxWidth: "1180px", margin: "0 auto 5rem auto", padding: "0 2rem" }}>
        <div style={{
          background: "rgba(10, 15, 26, 0.7)",
          border: "1px solid rgba(6, 182, 212, 0.25)",
          borderRadius: "16px",
          padding: "2rem 2.5rem",
          boxShadow: "0 20px 40px -15px rgba(0,0,0,0.7)"
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#67E8F9", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Jurisdictions Codified
              </div>
              <div style={{ fontSize: "2.3rem", fontWeight: 900, color: "#FFFFFF", marginTop: "0.25rem" }}>
                {JURISDICTIONS_LIST.length}
              </div>
              <div style={{ fontSize: "0.82rem", color: "#94A3B8", marginTop: "0.25rem" }}>
                Federal 5 U.S.C. § 552 + 50 State Sunshine Laws
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", color: "#60A5FA", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Government Agencies
              </div>
              <div style={{ fontSize: "2.3rem", fontWeight: 900, color: "#FFFFFF", marginTop: "0.25rem" }}>
                {AGENCIES_DATABASE.length}+ Preloaded
              </div>
              <div style={{ fontSize: "0.82rem", color: "#94A3B8", marginTop: "0.25rem" }}>
                Verified FOIA officer emails, portals, & fee schedule addresses
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", color: "#34D399", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Audit Fingerprints
              </div>
              <div style={{ fontSize: "2.3rem", fontWeight: 900, color: "#FFFFFF", marginTop: "0.25rem" }}>
                SHA-256
              </div>
              <div style={{ fontSize: "0.82rem", color: "#94A3B8", marginTop: "0.25rem" }}>
                Cryptographic timestamp & delivery attestation receipts
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", color: "#A78BFA", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Statutory Timers
              </div>
              <div style={{ fontSize: "2.3rem", fontWeight: 900, color: "#FFFFFF", marginTop: "0.25rem" }}>
                100% Deterministic
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
            Legal Determinism
          </span>
          <h2 style={{ fontSize: "2.2rem", marginTop: "0.35rem", marginBottom: "0.5rem" }}>The Inquest Advantage</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: "650px", margin: "0 auto" }}>
            Transforming adversarial bureaucracy into enforceable legal code.
          </p>
        </div>

        <div className="feature-grid-3">
          <div className="feature-box" style={{ padding: "1.75rem" }}>
            <div className="feature-icon-wrapper" style={{ color: "#06B6D4" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>Codified Sunshine Frameworks</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>
              • Exact statutory citations for all 50 states + Federal FOIA<br/>
              • Mandatory segregability enforcement (5 U.S.C. § 552(b))<br/>
              • Automatic fee waiver justification for journalists and non-profits
            </p>
          </div>

          <div className="feature-box" style={{ padding: "1.75rem" }}>
            <div className="feature-icon-wrapper" style={{ color: "#06B6D4" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            </div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>Denial Letter NLP Analyzer</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>
              • Instant extraction of cited exemptions (b)(4), (b)(5), (b)(7)<br/>
              • Evaluates pretextual redactions against DOJ FOIA guidelines<br/>
              • Synthesizes complete administrative appeal briefs with case law
            </p>
          </div>

          <div className="feature-box" style={{ padding: "1.75rem" }}>
            <div className="feature-icon-wrapper" style={{ color: "#06B6D4" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>Statutory Deadline Timers</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>
              • Precision countdown tracking (e.g. 20 working days for federal)<br/>
              • Automatic adjustment for state legal holidays and weekends<br/>
              • Auto-generates constructive denial notices when deadlines lapse
            </p>
          </div>

          <div className="feature-box" style={{ padding: "1.75rem" }}>
            <div className="feature-icon-wrapper" style={{ color: "#06B6D4" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>Zero-Custody Local Storage</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>
              • All case notes, drafts, and receipts stored in your browser's IndexedDB<br/>
              • Zero telemetry or ambient data leakage to third parties<br/>
              • Export portable, encrypted JSON backups at any time
            </p>
          </div>

          <div className="feature-box" style={{ padding: "1.75rem" }}>
            <div className="feature-icon-wrapper" style={{ color: "#06B6D4" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>Cryptographic SHA-256 Attestation</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>
              • Computes immutable cryptographic hash for every sent letter<br/>
              • Verifiable audit trails establishing exact filing dates and wording<br/>
              • Admissible proof in state and federal FOIA judicial challenges
            </p>
          </div>

          <div className="feature-box" style={{ padding: "1.75rem" }}>
            <div className="feature-icon-wrapper" style={{ color: "#06B6D4" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>1-Click Mailto & PDF Dispatch</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>
              • Opens pre-populated emails with correct agency subject headers<br/>
              • Generates court-ready PDF documents formatted with statutory headers<br/>
              • Clipboard copy for government web portals (FOIA.gov, NextRequest)
            </p>
          </div>
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
            Draft Your First Deterministic FOIA Request
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", maxWidth: "600px", margin: "0 auto 2rem auto" }}>
            Experience automated statutory citation, fee waiver arguments, and segregability protection in under 2 minutes.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/inquest" className="btn-primary" style={{ padding: "0.95rem 2.25rem", fontSize: "1rem", textDecoration: "none", background: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)" }}>
              Open Inquest Workspace Free →
            </Link>
            <Link href="/inquest?tab=agencies" style={{ padding: "0.95rem 1.85rem", borderRadius: "10px", background: "rgba(255,255,255,0.08)", border: "1px solid var(--border-color)", color: "white", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem" }}>
              Browse Agency Directory
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
