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
            Plans & Pricing
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

      {/* COMPREHENSIVE FEATURES & CAPABILITIES */}
      <section id="features" style={{ maxWidth: "1240px", margin: "0 auto 6rem auto", padding: "0 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ fontSize: "0.8rem", color: "#06B6D4", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
            Comprehensive Feature Set
          </span>
          <h2 style={{ fontSize: "2.4rem", marginTop: "0.35rem", marginBottom: "0.75rem", fontWeight: 800 }}>Everything You Need to Request, Track, and Appeal</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", maxWidth: "720px", margin: "0 auto 2rem auto" }}>
            A unified suite for journalists, legal teams, researchers, and public interest advocates to streamline public records requests across all 50 states and federal agencies.
          </p>

          {/* QUICK JUMP BUTTONS */}
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3.5rem" }}>
            <a href="#legal-engine" className="subnav-pill">50-State Legal Engine</a>
            <a href="#agency-directory" className="subnav-pill">Agency Directory</a>
            <a href="#denial-analyzer" className="subnav-pill">Denial Analyzer</a>
            <a href="#deadline-timers" className="subnav-pill">Statutory Timers</a>
            <a href="#local-privacy" className="subnav-pill">Local-First Privacy</a>
          </div>
        </div>

        {/* DETAILED FEATURES SECTIONS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "3.5rem" }}>
          
          {/* FEATURE 1: LEGAL ENGINE & REQUEST GENERATOR */}
          <section id="legal-engine" className="glass-card" style={{ padding: "3rem", position: "relative", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "3rem", alignItems: "center" }}>
              <div>
                <div style={{ color: "#06B6D4", fontWeight: 700, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                  Feature 01 · Legal Precision
                </div>
                <h3 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1rem", lineHeight: 1.25 }}>
                  50-State Sunshine & Federal FOIA Legal Engine
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.65, marginBottom: "1.5rem" }}>
                  Public records laws vary dramatically across states and federal bodies. Inquest embeds exact statutory citations, standard response deadlines, and mandatory segregability language into every request draft.
                </p>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "2rem" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                    <div style={{ color: "#06B6D4", marginTop: "2px" }}>✓</div>
                    <div style={{ fontSize: "0.9rem", color: "#E2E8F0" }}>
                      <strong>Statutory Accuracy:</strong> Automatically injects the correct state sunshine acts (e.g. California PRA Gov Code § 7920, Texas Gov Code § 552, Florida Ch. 119, New York FOIL Pub. Off. Law § 87).
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                    <div style={{ color: "#06B6D4", marginTop: "2px" }}>✓</div>
                    <div style={{ fontSize: "0.9rem", color: "#E2E8F0" }}>
                      <strong>Fee Waiver Justifications:</strong> Formats tailored fee waiver arguments for journalists, educational institutions, and public interest researchers.
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                    <div style={{ color: "#06B6D4", marginTop: "2px" }}>✓</div>
                    <div style={{ fontSize: "0.9rem", color: "#E2E8F0" }}>
                      <strong>Segregability & Appeal Clauses:</strong> Enforces legal demands to release all reasonably segregable non-exempt portions of requested records.
                    </div>
                  </div>
                </div>

                <Link 
                  href="/app/inquest?tab=wizard" 
                  style={{
                    background: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
                    border: "none",
                    boxShadow: "0 0 20px rgba(6, 182, 212, 0.35)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    color: "white",
                    fontWeight: 700,
                    textDecoration: "none"
                  }}
                >
                  Launch Request Generator →
                </Link>
              </div>

              {/* PREVIEW CARD */}
              <div style={{
                background: "rgba(10, 15, 26, 0.8)",
                border: "1px solid rgba(6, 182, 212, 0.25)",
                borderRadius: "14px",
                padding: "1.75rem",
                fontFamily: "monospace",
                fontSize: "0.82rem",
                color: "#94A3B8",
                lineHeight: 1.6
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "0.75rem" }}>
                  <span style={{ color: "#67E8F9", fontWeight: 700 }}>AUTOGENERATED STATUTORY HEADER</span>
                  <span style={{ color: "#34D399", fontSize: "0.75rem", background: "rgba(52, 211, 153, 0.12)", padding: "2px 8px", borderRadius: "4px" }}>READY TO FILE</span>
                </div>
                <p style={{ color: "#E2E8F0" }}>
                  Re: PUBLIC RECORDS REQUEST PURSUANT TO 5 U.S.C. § 552 / STATE SUNSHINE ACT
                </p>
                <p>
                  Pursuant to statutory disclosure requirements, I hereby request copies of all agency records, correspondence, and digital files regarding...
                </p>
                <p style={{ color: "#60A5FA" }}>
                  [STATUTORY REQUIREMENT: 20 Business Days Response Window]
                </p>
                <p style={{ color: "#FCD34D", margin: 0 }}>
                  If any record is withheld, please specify the statutory exemption claimed and release all segregable non-exempt portions.
                </p>
              </div>
            </div>
          </section>

          {/* FEATURE 2: AGENCY CUSTODIAN DIRECTORY */}
          <section id="agency-directory" className="glass-card" style={{ padding: "3rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "3rem", alignItems: "center" }}>
              {/* DIRECTORY PREVIEW CARDS */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{
                  background: "rgba(15, 23, 42, 0.75)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  padding: "1.25rem"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 700, color: "#FFFFFF", fontSize: "0.95rem" }}>Department of Justice (DOJ)</div>
                      <div style={{ fontSize: "0.78rem", color: "#94A3B8" }}>Federal · Office of Information Policy</div>
                    </div>
                    <span style={{ fontSize: "0.72rem", background: "rgba(6, 182, 212, 0.15)", color: "#67E8F9", padding: "2px 8px", borderRadius: "4px" }}>20 Days</span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#60A5FA", marginTop: "0.6rem" }}>foia.mail@usdoj.gov</div>
                </div>

                <div style={{
                  background: "rgba(15, 23, 42, 0.75)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  padding: "1.25rem"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 700, color: "#FFFFFF", fontSize: "0.95rem" }}>California Dept. of Public Health</div>
                      <div style={{ fontSize: "0.78rem", color: "#94A3B8" }}>State · California PRA Gov Code § 7920</div>
                    </div>
                    <span style={{ fontSize: "0.72rem", background: "rgba(52, 211, 153, 0.15)", color: "#34D399", padding: "2px 8px", borderRadius: "4px" }}>10 Days</span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#60A5FA", marginTop: "0.6rem" }}>pra@cdph.ca.gov</div>
                </div>

                <div style={{
                  background: "rgba(15, 23, 42, 0.75)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  padding: "1.25rem"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 700, color: "#FFFFFF", fontSize: "0.95rem" }}>New York State Police</div>
                      <div style={{ fontSize: "0.78rem", color: "#94A3B8" }}>State · NY FOIL Pub. Off. Law § 87</div>
                    </div>
                    <span style={{ fontSize: "0.72rem", background: "rgba(251, 191, 36, 0.15)", color: "#FBBF24", padding: "2px 8px", borderRadius: "4px" }}>5 Days</span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#60A5FA", marginTop: "0.6rem" }}>foil@troopers.ny.gov</div>
                </div>
              </div>

              <div>
                <div style={{ color: "#34D399", fontWeight: 700, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                  Feature 02 · Contact Database
                </div>
                <h3 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1rem", lineHeight: 1.25 }}>
                  Comprehensive Agency Custodian Directory
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.65, marginBottom: "1.5rem" }}>
                  Stop searching obscure agency portals to find contact info. Inquest maintains a verified directory of federal agencies, state departments, and local custodians with their direct submission emails, portal URLs, and legal turnaround timeframes.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "2rem" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                    <div style={{ color: "#34D399", marginTop: "2px" }}>✓</div>
                    <div style={{ fontSize: "0.9rem", color: "#E2E8F0" }}>
                      <strong>{AGENCIES_DATABASE.length}+ Verified Records Liaisons:</strong> Direct email addresses, online portal endpoints, and mailing contacts.
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                    <div style={{ color: "#34D399", marginTop: "2px" }}>✓</div>
                    <div style={{ fontSize: "0.9rem", color: "#E2E8F0" }}>
                      <strong>One-Click Insertion:</strong> Automatically populate selected custodian details and statutory timelines directly into your active draft.
                    </div>
                  </div>
                </div>

                <Link 
                  href="/app/inquest?tab=agencies" 
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    border: "1px solid rgba(52, 211, 153, 0.4)",
                    color: "#34D399",
                    fontWeight: 700,
                    textDecoration: "none"
                  }}
                >
                  Open Agency Directory →
                </Link>
              </div>
            </div>
          </section>

          {/* FEATURE 3: DENIAL & EXEMPTION ANALYZER */}
          <section id="denial-analyzer" className="glass-card" style={{ padding: "3rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "3rem", alignItems: "center" }}>
              <div>
                <div style={{ color: "#F43F5E", fontWeight: 700, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                  Feature 03 · Appeals & Rebuttals
                </div>
                <h3 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1rem", lineHeight: 1.25 }}>
                  Denial Letter & Exemption Analyzer
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.65, marginBottom: "1.5rem" }}>
                  Agencies often issue broad or boilerplate denial letters citing exemptions without proper justification. Inquest parses denial notices to highlight weak claims and draft strong administrative appeals.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "2rem" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                    <div style={{ color: "#F43F5E", marginTop: "2px" }}>✓</div>
                    <div style={{ fontSize: "0.9rem", color: "#E2E8F0" }}>
                      <strong>Exemption Breakdown:</strong> Clarifies complex citations like Exemption 5 (deliberative process), Exemption 6/7C (privacy), or Exemption 4 (commercial).
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                    <div style={{ color: "#F43F5E", marginTop: "2px" }}>✓</div>
                    <div style={{ fontSize: "0.9rem", color: "#E2E8F0" }}>
                      <strong>Foreseeable Harm Test:</strong> Challenges improper withholdings using the FOIA Improvement Act requirement that agencies prove actual foreseeable harm.
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                    <div style={{ color: "#F43F5E", marginTop: "2px" }}>✓</div>
                    <div style={{ fontSize: "0.9rem", color: "#E2E8F0" }}>
                      <strong>Appeal Letter Generator:</strong> Instantly prepares a complete administrative appeal letter ready for submission.
                    </div>
                  </div>
                </div>

                <Link 
                  href="/app/inquest?tab=analyzer" 
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    border: "1px solid rgba(244, 63, 94, 0.4)",
                    color: "#FB7185",
                    fontWeight: 700,
                    textDecoration: "none"
                  }}
                >
                  Launch Denial Analyzer →
                </Link>
              </div>

              {/* APPEAL PREVIEW */}
              <div style={{
                background: "rgba(10, 15, 26, 0.8)",
                border: "1px solid rgba(244, 63, 94, 0.25)",
                borderRadius: "14px",
                padding: "1.75rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem", color: "#FB7185", fontWeight: 700, fontSize: "0.85rem" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  IDENTIFIED EXEMPTION: EXEMPTION 5 (b)(5)
                </div>
                <div style={{ fontSize: "0.82rem", color: "#CBD5E1", lineHeight: 1.6, background: "rgba(255,255,255,0.03)", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
                  <strong>Rebuttal Ground:</strong> Pure factual materials cannot be withheld under the deliberative process privilege. Under the FOIA Improvement Act of 2016, the agency must identify specific, non-speculative foreseeable harm to agency deliberations.
                </div>
                <div style={{ fontSize: "0.78rem", color: "#94A3B8" }}>
                  Generated argument includes citations to <em>EPA v. Mink</em> and <em>NLRB v. Sears, Roebuck & Co.</em>
                </div>
              </div>
            </div>
          </section>

          {/* FEATURE 4: DEADLINE TIMERS & CASE DASHBOARD */}
          <section id="deadline-timers" className="glass-card" style={{ padding: "3rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "3rem", alignItems: "center" }}>
              {/* DASHBOARD PREVIEW */}
              <div style={{
                background: "rgba(10, 15, 26, 0.8)",
                border: "1px solid rgba(168, 85, 247, 0.25)",
                borderRadius: "14px",
                padding: "1.75rem"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                  <span style={{ fontWeight: 700, color: "#C084FC", fontSize: "0.88rem" }}>ACTIVE CASE MONITOR</span>
                  <span style={{ fontSize: "0.75rem", background: "rgba(168, 85, 247, 0.15)", color: "#C084FC", padding: "3px 8px", borderRadius: "4px" }}>3 CASES TRACKED</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div style={{ padding: "0.75rem", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
                      <strong style={{ color: "#fff" }}>EPA Water Quality Audit</strong>
                      <span style={{ color: "#34D399" }}>4 Days Remaining</span>
                    </div>
                    <div style={{ fontSize: "0.74rem", color: "#94A3B8", marginTop: "4px" }}>FOIA-2026-08819 · Due in 4 business days</div>
                  </div>
                  <div style={{ padding: "0.75rem", background: "rgba(239, 68, 68, 0.05)", borderRadius: "8px", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
                      <strong style={{ color: "#fff" }}>City Transit Contracts</strong>
                      <span style={{ color: "#EF4444", fontWeight: 700 }}>2 Days Overdue</span>
                    </div>
                    <div style={{ fontSize: "0.74rem", color: "#FCA5A5", marginTop: "4px" }}>Constructive Denial Eligible · Appeal Available</div>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ color: "#A855F7", fontWeight: 700, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                  Feature 04 · Tracking & Compliance
                </div>
                <h3 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1rem", lineHeight: 1.25 }}>
                  Statutory Timers & Case Dashboard
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.65, marginBottom: "1.5rem" }}>
                  Never miss an appeal deadline or lose track of an overdue records request. Inquest tracks every filed case, computes business-day deadlines according to state statutes, and alerts you when constructive denial conditions are met.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "2rem" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                    <div style={{ color: "#A855F7", marginTop: "2px" }}>✓</div>
                    <div style={{ fontSize: "0.9rem", color: "#E2E8F0" }}>
                      <strong>Business Day Calculations:</strong> Automatically excludes weekends and recognized government holidays.
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                    <div style={{ color: "#A855F7", marginTop: "2px" }}>✓</div>
                    <div style={{ fontSize: "0.9rem", color: "#E2E8F0" }}>
                      <strong>Constructive Denial Alerts:</strong> Immediate notifications when an agency misses statutory windows, triggering administrative appeal rights.
                    </div>
                  </div>
                </div>

                <Link 
                  href="/app/inquest?tab=cases" 
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    border: "1px solid rgba(168, 85, 247, 0.4)",
                    color: "#C084FC",
                    fontWeight: 700,
                    textDecoration: "none"
                  }}
                >
                  Open Case Dashboard →
                </Link>
              </div>
            </div>
          </section>

          {/* FEATURE 5: LOCAL-FIRST PRIVACY & ENCRYPTION */}
          <section id="local-privacy" className="glass-card" style={{ padding: "3rem", background: "rgba(59, 130, 246, 0.03)", border: "1px solid rgba(59, 130, 246, 0.25)" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(59, 130, 246, 0.15)",
                color: "#60A5FA",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 1.25rem auto"
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <div style={{ color: "#60A5FA", fontWeight: 700, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                Feature 05 · Complete Privacy
              </div>
              <h3 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1rem" }}>
                Zero-Cloud Local-First Privacy
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.98rem", lineHeight: 1.7, marginBottom: "2rem" }}>
                Investigative records requests often involve confidential research, sensitive legal strategies, and private requester information. Inquest operates 100% in your browser. No cases, drafts, correspondence, or identity details are ever stored on central servers.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", textAlign: "left" }}>
                <div style={{ padding: "1.25rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "10px" }}>
                  <strong style={{ color: "#fff", display: "block", marginBottom: "0.35rem", fontSize: "0.92rem" }}>Browser Storage Only</strong>
                  <span style={{ fontSize: "0.82rem", color: "#94A3B8" }}>Cases and drafts live securely in your browser's private local storage.</span>
                </div>
                <div style={{ padding: "1.25rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "10px" }}>
                  <strong style={{ color: "#fff", display: "block", marginBottom: "0.35rem", fontSize: "0.92rem" }}>Bring Your Own Key (BYOK)</strong>
                  <span style={{ fontSize: "0.82rem", color: "#94A3B8" }}>Connect your private AI key directly without intermediary proxies.</span>
                </div>
                <div style={{ padding: "1.25rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "10px" }}>
                  <strong style={{ color: "#fff", display: "block", marginBottom: "0.35rem", fontSize: "0.92rem" }}>Export Anytime</strong>
                  <span style={{ fontSize: "0.82rem", color: "#94A3B8" }}>Export complete case archives, records logs, and letters as JSON or plain text.</span>
                </div>
              </div>
            </div>
          </section>

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
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#34D399", marginBottom: "0.75rem" }}>
                Included Free Tier
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
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#67E8F9", marginBottom: "0.75rem" }}>
                Professional Tier
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
              Explore Pro Plan →
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
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#C084FC", marginBottom: "0.75rem" }}>
                Enterprise Tier
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
              Explore Enterprise Plan →
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

      {/* INLINE CSS FOR PILLS */}
      <style>{`
        .subnav-pill {
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #94A3B8;
          text-decoration: none;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.2s ease;
        }
        .subnav-pill:hover {
          color: #67E8F9;
          background: rgba(6, 182, 212, 0.12);
          border-color: rgba(6, 182, 212, 0.35);
        }
      `}</style>
    </div>
  );
}
