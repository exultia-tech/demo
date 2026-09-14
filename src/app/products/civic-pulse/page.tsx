import Link from "next/link";
import { Metadata } from "next";
import { CivicPulseTerminal } from "@/components/civic-pulse/CivicPulseTerminal";
import { SUPPORTED_CITIES } from "@/lib/civic-pulse/mockData";
import { 
  Landmark, 
  Building2, 
  Search, 
  UserCheck, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Users, 
  Sparkles,
  ArrowRight,
  ExternalLink
} from "lucide-react";

export const metadata: Metadata = {
  title: "Exultia CivicPulse | Deterministic Municipal Intelligence & Council Records",
  description: "Autonomous municipal public information platform. Query city council meeting minutes, ordinances, and roll-call votes on-demand without filing FOIA requests, backed by human research specialists.",
};

export default function CivicPulseProductLandingPage() {
  return (
    <div className="fade-in" style={{ paddingBottom: "6rem" }}>
      
      {/* HERO SECTION */}
      <section className="hero-section" style={{ paddingTop: "3rem", paddingBottom: "3.5rem" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(16, 185, 129, 0.12)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          borderRadius: "999px",
          padding: "5px 16px",
          marginBottom: "1.5rem",
          boxShadow: "0 0 15px rgba(16, 185, 129, 0.2)"
        }}>
          <Landmark size={14} color="#10B981" />
          <span style={{ fontSize: "0.8rem", color: "#34D399", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Product 04 · Deterministic Municipal Intelligence
          </span>
        </div>

        <h1 className="hero-title" style={{ fontSize: "3.6rem", marginBottom: "1.25rem", letterSpacing: "-0.03em", lineHeight: 1.12 }}>
          Exultia <span style={{ color: "#10B981" }}>CivicPulse</span>
          <br />
          <span className="gradient-text">Public Records Without the FOIA Bureaucracy</span>
        </h1>

        <p className="hero-desc" style={{ maxWidth: "800px", margin: "0 auto 2.25rem auto", fontSize: "1.2rem", lineHeight: "1.65", color: "#94A3B8" }}>
          Over 90% of civic information—from city council minutes and zoning variances to police oversight votes—is already legally public, yet buried in broken municipal portals. CivicPulse lets citizens query official local records on demand, backed by human research specialists when portals fail.
        </p>

        <div className="hero-cta-group" style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <Link 
            href="/civic-pulse" 
            className="btn-primary" 
            style={{ padding: "0.95rem 2rem", fontSize: "1rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.55rem", background: "linear-gradient(135deg, #10B981 0%, #059669 100%)", color: "#FFFFFF", fontWeight: 800 }}>
            <Search size={18} />
            Launch CivicPulse Terminal →
          </Link>
          <a 
            href="#interactive-terminal" 
            style={{ padding: "0.95rem 1.7rem", borderRadius: "10px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border-color)", color: "white", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem" }}>
            Test Live Municipal Query ↓
          </a>
        </div>
      </section>

      {/* STATISTICAL BANNER */}
      <section style={{ maxWidth: "1180px", margin: "0 auto 5rem auto", padding: "0 2rem" }}>
        <div style={{
          background: "rgba(10, 15, 26, 0.7)",
          border: "1px solid rgba(16, 185, 129, 0.25)",
          borderRadius: "16px",
          padding: "2rem 2.5rem",
          boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7)"
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#34D399", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Target Municipalities
              </div>
              <div style={{ fontSize: "2.3rem", fontWeight: 900, color: "#FFFFFF", marginTop: "0.25rem" }}>
                19,000+
              </div>
              <div style={{ fontSize: "0.82rem", color: "#94A3B8", marginTop: "0.25rem" }}>
                Cities, towns, & counties across all 50 states
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", color: "#60A5FA", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Platform Connectors
              </div>
              <div style={{ fontSize: "2.3rem", fontWeight: 900, color: "#FFFFFF", marginTop: "0.25rem" }}>
                Legistar · Granicus · CivicPlus
              </div>
              <div style={{ fontSize: "0.82rem", color: "#94A3B8", marginTop: "0.25rem" }}>
                + Laserfiche, PrimeGov, & Municipal Direct
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", color: "#FBBF24", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Human Specialist Backup
              </div>
              <div style={{ fontSize: "2.3rem", fontWeight: 900, color: "#FFFFFF", marginTop: "0.25rem" }}>
                100% Resolution
              </div>
              <div style={{ fontSize: "0.82rem", color: "#94A3B8", marginTop: "0.25rem" }}>
                Civic Desk research specialists resolve broken portals
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE QUERY TERMINAL SECTION */}
      <section id="interactive-terminal" style={{ maxWidth: "1180px", margin: "0 auto 5rem auto", padding: "0 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontSize: "0.8rem", color: "#34D399", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
            Live Demonstration
          </div>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Query Your City Council Meeting Records
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", maxWidth: "680px", margin: "0.5rem auto 0 auto" }}>
            Enter any city and state to watch the autonomous retrieval engine scan official municipal portals, extract roll-call votes, and verify meeting minutes.
          </p>
        </div>

        <CivicPulseTerminal />
      </section>

      {/* CORE ARCHITECTURE / 4 PILLARS */}
      <section style={{ maxWidth: "1180px", margin: "0 auto 5rem auto", padding: "0 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontSize: "0.8rem", color: "#34D399", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
            Engine Architecture
          </div>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800 }}>How CivicPulse Unlocks Municipal Data</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
          <div className="feature-box" style={{ padding: "1.75rem" }}>
            <div className="feature-icon-wrapper" style={{ color: "#10B981" }}>
              <Building2 size={24} />
            </div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>1. Municipal Platform Discovery</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>
              Automatically detects whether your city publishes records on Legistar, Granicus, CivicPlus, or legacy municipal servers, mapping direct agenda URLs.
            </p>
          </div>

          <div className="feature-box" style={{ padding: "1.75rem" }}>
            <div className="feature-icon-wrapper" style={{ color: "#10B981" }}>
              <Users size={24} />
            </div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>2. Roll-Call Vote Extraction</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>
              Parses meeting minutes to isolate individual council member votes (Yeas, Nays, Recusals) rather than generic passed/failed summaries.
            </p>
          </div>

          <div className="feature-box" style={{ padding: "1.75rem" }}>
            <div className="feature-icon-wrapper" style={{ color: "#10B981" }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>3. Deterministic Source Attestation</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>
              Every extracted excerpt links directly to the official stamped municipal PDF, preserving clerk seals and exact document page numbers.
            </p>
          </div>

          <div className="feature-box" style={{ padding: "1.75rem" }}>
            <div className="feature-icon-wrapper" style={{ color: "#10B981" }}>
              <UserCheck size={24} />
            </div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>4. Human Civic Desk Escalation</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>
              When city websites are offline or audio recordings lack transcripts, an Exultia researcher directly contacts the city clerk to retrieve the file.
            </p>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 2rem" }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          borderRadius: "20px",
          padding: "3.5rem 2rem",
          textAlign: "center",
          boxShadow: "0 20px 40px -15px rgba(0,0,0,0.8)"
        }}>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "0.75rem" }}>
            Explore What Your City Council Voted on This Week
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", maxWidth: "600px", margin: "0 auto 2rem auto", lineHeight: "1.6" }}>
            No filing fees. No 20-day FOIA waiting periods. Just deterministic municipal records directly from official meeting minutes.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link 
              href="/civic-pulse" 
              className="btn-primary" 
              style={{ padding: "0.95rem 2.25rem", fontSize: "1rem", textDecoration: "none", background: "linear-gradient(135deg, #10B981 0%, #059669 100%)", color: "#FFFFFF", fontWeight: 800 }}>
              Open CivicPulse Terminal Free →
            </Link>
            <Link 
              href="/products/inquest" 
              style={{ padding: "0.95rem 1.85rem", borderRadius: "10px", background: "rgba(255,255,255,0.08)", border: "1px solid var(--border-color)", color: "white", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem" }}>
              Need Formal FOIA? Explore Inquest
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
