import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Exultia | Deterministic Computing & Trust",
  description: "Exultia (exultia.tech) builds high-assurance deterministic infrastructure for cyber defense, zero-trust developer tooling, and statutory public accountability.",
};

export default function AboutPage() {
  return (
    <div className="fade-in" style={{ paddingBottom: "5rem" }}>
      {/* HERO */}
      <section className="hero-section" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(59, 130, 246, 0.12)", border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: "999px", padding: "4px 14px", marginBottom: "1.5rem" }}>
          <span style={{ fontSize: "0.8rem", color: "#93C5FD", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            The Exultia Standard
          </span>
        </div>

        <h1 className="hero-title" style={{ fontSize: "3.4rem", marginBottom: "1.25rem", letterSpacing: "-0.03em", lineHeight: 1.15 }}>
          Engineering <span className="gradient-text">Provable Certainty</span>
        </h1>

        <p className="hero-desc" style={{ maxWidth: "760px", margin: "0 auto", fontSize: "1.2rem", lineHeight: "1.6", color: "#94A3B8" }}>
          We eliminate non-deterministic failure modes across software engineering, cyber threat intelligence, and civic governance.
        </p>
      </section>

      {/* CORE THESIS */}
      <section style={{ maxWidth: "1000px", margin: "0 auto 5rem auto", padding: "0 2rem" }}>
        <div className="glass-card" style={{ padding: "2.75rem", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem", color: "#FFFFFF" }}>Why Exultia?</h2>
          <p style={{ color: "#CBD5E1", fontSize: "1rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>
            In high-assurance computer science, provable determinism means that critical system properties remain unconditionally true regardless of external transformations, time delays, or ambient noise.
          </p>
          <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>
            Modern critical infrastructure is plagued by the opposite: <em>fragile non-determinism</em>. Developers build on unvetted, floating packages that leak telemetry back to proprietary clouds. Security teams react to fragmented, conflicting vulnerability disclosures across dozens of disconnected forums. Citizens and journalists requesting government records encounter arbitrary bureaucratic delays, unlawful fee demands, and pretextual redactions.
          </p>
          <p style={{ color: "#F8FAFC", fontSize: "1rem", lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
            Exultia was created to replace ambiguity with mathematical and statutory determinism.
          </p>
        </div>
      </section>

      {/* THREE CORE PILLARS OF EXULTIA */}
      <section style={{ maxWidth: "1300px", margin: "0 auto 5rem auto", padding: "0 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ fontSize: "0.8rem", color: "#60A5FA", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
            Core Architectural Thesis
          </span>
          <h2 style={{ fontSize: "2.2rem", marginTop: "0.35rem", marginBottom: "0.5rem" }}>The Three Pillars of Exultia</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.75rem" }}>
          
          <div className="glass-card" style={{ padding: "2.25rem", borderRadius: "14px", border: "1px solid rgba(59, 130, 246, 0.25)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🛡️</div>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem", color: "#FFFFFF" }}>1. Toolchain Determinism</h3>
            <div style={{ fontSize: "0.85rem", color: "#60A5FA", fontWeight: 600, marginBottom: "0.75rem" }}>
              PureIDE Foundation
            </div>
            <p style={{ color: "#94A3B8", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
              Workstations must be hermetically sealed. Extensions cannot open clandestine telemetry sockets, binaries must compile into bit-for-bit reproducible artifacts, and every dependency must be cryptographically attested in a verifiable CycloneDX 1.5 SBOM.
            </p>
          </div>

          <div className="glass-card" style={{ padding: "2.25rem", borderRadius: "14px", border: "1px solid rgba(139, 92, 246, 0.25)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚡</div>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem", color: "#FFFFFF" }}>2. Epistemic Verification</h3>
            <div style={{ fontSize: "0.85rem", color: "#A78BFA", fontWeight: 600, marginBottom: "0.75rem" }}>
              UVI Threat Feed Foundation
            </div>
            <p style={{ color: "#94A3B8", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
              Threat intelligence cannot rely on lagging commercial feeds alone. By synchronizing 55 upstream feeds into pre-assigned UVI records with dual-perspective impact scoring, security teams gain unambiguous ground truth on both server and workstation exposure.
            </p>
          </div>

          <div className="glass-card" style={{ padding: "2.25rem", borderRadius: "14px", border: "1px solid rgba(16, 185, 129, 0.25)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚖️</div>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem", color: "#FFFFFF" }}>3. Open Governance Standards</h3>
            <div style={{ fontSize: "0.85rem", color: "#34D399", fontWeight: 600, marginBottom: "0.75rem" }}>
              Standards Lab (ALPR-CSF & RAIJ-CSF)
            </div>
            <p style={{ color: "#94A3B8", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
              Bridging engineering rigor and algorithmic due process. We publish vendor-agnostic baseline standards governing surveillance sensors (AASHTO MASH crash testing, clear-zone setbacks, DPPA gates) and responsible artificial intelligence (cryptographic weights, prompt firewalls, 4/5ths disparate impact testing).
            </p>
          </div>

        </div>
      </section>

      {/* DEDICATED STANDALONE UTILITIES SECTION */}
      <section style={{ maxWidth: "1100px", margin: "0 auto 5rem auto", padding: "0 2rem" }}>
        <div className="glass-card" style={{ padding: "2.5rem", borderRadius: "16px", border: "1px solid rgba(6, 182, 212, 0.3)", background: "linear-gradient(180deg, rgba(8, 20, 35, 0.7) 0%, rgba(5, 12, 22, 0.9) 100%)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(6, 182, 212, 0.15)", border: "1px solid rgba(6, 182, 212, 0.3)", borderRadius: "6px", padding: "3px 10px", marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#22D3EE", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Independent Open-Access Utilities
            </span>
          </div>

          <h2 style={{ fontSize: "1.85rem", marginBottom: "0.75rem", color: "#FFFFFF" }}>
            Standalone Public Records & Statutory Transparency Tools
          </h2>

          <p style={{ color: "#CBD5E1", fontSize: "0.98rem", lineHeight: 1.7, marginBottom: "1.75rem" }}>
            In addition to our core commercial platforms and open control frameworks, Exultia maintains independent open-access tools for public records discovery and statutory compliance. These tools operate as standalone utilities outside our commercial developer workstation pipelines:
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <div style={{ padding: "1.5rem", borderRadius: "12px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <h3 style={{ fontSize: "1.2rem", color: "#22D3EE", marginBottom: "0.35rem" }}>Inquest FOIA Autopilot</h3>
              <p style={{ color: "#94A3B8", fontSize: "0.88rem", lineHeight: 1.6, margin: "0 0 1rem 0" }}>
                Translates federal FOIA (5 U.S.C. § 552) and all 50 state sunshine statutes into an automated enforcement engine with fee segregation and administrative appeal generators.
              </p>
              <Link href="/products/inquest" style={{ fontSize: "0.85rem", color: "#22D3EE", fontWeight: 600, textDecoration: "none" }}>
                View Inquest Utility →
              </Link>
            </div>

            <div style={{ padding: "1.5rem", borderRadius: "12px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <h3 style={{ fontSize: "1.2rem", color: "#34D399", marginBottom: "0.35rem" }}>CivicPulse Terminal</h3>
              <p style={{ color: "#94A3B8", fontSize: "0.88rem", lineHeight: 1.6, margin: "0 0 1rem 0" }}>
                Instant on-demand discovery across thousands of municipal meeting agendas, transcribed minutes, roll-call voting records, and local ordinances.
              </p>
              <Link href="/products/civic-pulse" style={{ fontSize: "0.85rem", color: "#34D399", fontWeight: 600, textDecoration: "none" }}>
                View CivicPulse Terminal →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 2rem" }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          borderRadius: "16px",
          padding: "3rem 2rem",
          textAlign: "center"
        }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Explore Our Systems & Standards</h2>
          <p style={{ color: "#94A3B8", maxWidth: "560px", margin: "0 auto 2rem auto", fontSize: "1.05rem" }}>
            See how Exultia (exultia.tech) brings provable certainty to developers, security operations, and governance engineers.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/console" className="btn-primary" style={{ padding: "0.9rem 2rem", fontSize: "1rem", textDecoration: "none" }}>
              Launch PureIDE →
            </Link>
            <Link href="/threat-feed" style={{ padding: "0.9rem 1.6rem", borderRadius: "10px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border-color)", color: "white", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem" }}>
              UVI Threat Feed
            </Link>
            <Link href="/governance" style={{ padding: "0.9rem 1.6rem", borderRadius: "10px", background: "rgba(59, 130, 246, 0.12)", border: "1px solid rgba(59, 130, 246, 0.3)", color: "#93C5FD", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem" }}>
              Governance Standards Lab
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
