import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { PureIdeIcon, VantageIcon, InquestIcon, PureOsIcon, PraxisIcon, AxiomIcon, ExultiaLogo } from "@/components/BrandIcons";
import { SITE_CONFIG } from "@/config/site-config";

export const metadata: Metadata = {
  title: "Exultia Technologies | Practical. Transparent. Secure.",
  description: "Software engineering environments, real-time threat intelligence feeds, and security automation built for verifiable integrity and transparency.",
};

export default function HomePage() {
  if (SITE_CONFIG.isolatedThreatFeed) {
    redirect("/app/uvi");
  }

  return (
    <div className="fade-in" style={{ paddingBottom: "5rem" }}>
      {/* RADICAL DOOM-ESQUE HERO */}
      <section className="hero-section" style={{ maxWidth: "1280px", margin: "0 auto", padding: "3.5rem 2rem 2.5rem 2rem", textAlign: "left", position: "relative" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "2.5rem",
          flexWrap: "wrap",
        }}>
          {/* SCALED UP CYBERNETIC DEMON HELM LOGO EMBLEM */}
          <div style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            padding: "0.5rem",
            background: "radial-gradient(circle, rgba(0, 229, 255, 0.08) 0%, rgba(0, 0, 0, 0) 70%)",
            filter: "drop-shadow(0 0 35px var(--accent-glow))",
          }}>
            <ExultiaLogo size={165} glow={true} />
          </div>

          {/* THREE STACKED WORDS LEFT-ALIGNED TO THE LOGO */}
          <h1 className="hero-title" style={{
            margin: 0,
            display: "flex",
            flexDirection: "column",
            fontSize: "3.2rem",
            lineHeight: 1.06,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            fontFamily: "var(--font-display, 'Orbitron', sans-serif)",
            fontWeight: 900,
            textAlign: "left",
          }}>
            <span style={{ color: "#FFFFFF" }}>PRACTICAL.</span>
            <span style={{ color: "#FFFFFF" }}>TRANSPARENT.</span>
            <span style={{ 
              color: "var(--accent-primary)", 
              textShadow: "0 0 25px var(--accent-glow)"
            }}>
              SECURE.
            </span>
          </h1>
        </div>
      </section>

      {/* CORE PRODUCT PLATFORMS */}
      <section id="core-platforms" style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Our Products
          </div>
          <h2 style={{ fontSize: "2.1rem", fontWeight: 900, color: "#FFFFFF", marginTop: "4px", letterSpacing: "0.05em" }}>
            Core Platforms
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", maxWidth: "800px", margin: "0.4rem 0 0 0", lineHeight: "1.6" }}>
            Software engineering environments, real-time threat intelligence feeds, and security automation built for verifiable integrity and transparency.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "2rem" }}>
          
          {/* PRODUCT 1: PUREIDE */}
          <div className="glass-card" style={{
            padding: "2.25rem 2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            borderRadius: "18px",
            background: "linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(10, 15, 26, 0.95) 100%)",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
            marginBottom: 0
          }}>
            <div>
              <div style={{ marginBottom: "1.5rem" }}>
                <PureIdeIcon size={52} glow={true} />
              </div>

              <h3 style={{ fontSize: "1.65rem", marginBottom: "0.35rem", color: "#FFFFFF", fontWeight: 700 }}>PureIDE</h3>
              <div style={{ color: "#60A5FA", fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.85rem" }}>
                Secure Workstation Builder
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.75rem" }}>
                Package and deploy clean, offline-ready IDEs. Block untrusted plugins, eliminate unwanted background telemetry, and automatically generate full software bill-of-materials (SBOMs).
              </p>
            </div>

            <div>
              <Link 
                href="/products/pure-ide" 
                className="btn-primary" 
                style={{ width: "100%", textAlign: "center", textDecoration: "none", padding: "0.85rem", fontSize: "0.92rem", fontWeight: 600 }}>
                Explore PureIDE →
              </Link>
              <div style={{ marginTop: "0.6rem", textAlign: "center" }}>
                <Link href="/account/subscription?product=pureide" style={{ color: "#94A3B8", fontSize: "0.8rem", textDecoration: "none" }}>
                  Plans & Pricing →
                </Link>
              </div>
            </div>
          </div>

          {/* PRODUCT 2: Vantage */}
          <div className="glass-card" style={{
            padding: "2.25rem 2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            borderRadius: "18px",
            background: "linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(10, 15, 26, 0.95) 100%)",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
            marginBottom: 0
          }}>
            <div>
              <div style={{ marginBottom: "1.5rem" }}>
                <VantageIcon size={52} glow={true} />
              </div>

              <h3 style={{ fontSize: "1.65rem", marginBottom: "0.35rem", color: "#FFFFFF", fontWeight: 700 }}>Vantage</h3>
              <div style={{ color: "#A78BFA", fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.85rem" }}>
                Universal Threat Feed
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.75rem" }}>
                Stay ahead of emerging vulnerabilities. We aggregate and verify 110+ global security feeds, active zero-days, and supply chain threats into one clear, real-time feed.
              </p>
            </div>

            <div>
              <Link 
                href="/app/uvi/stats" 
                className="btn-primary" 
                style={{ width: "100%", textAlign: "center", textDecoration: "none", padding: "0.85rem", fontSize: "0.92rem", fontWeight: 600, background: "linear-gradient(135deg, #8B5CF6, #6366F1)" }}>
                Explore Threat Intelligence →
              </Link>
              <div style={{ marginTop: "0.6rem", textAlign: "center" }}>
                <Link href="/account/subscription?product=uvi" style={{ color: "#94A3B8", fontSize: "0.8rem", textDecoration: "none" }}>
                  Plans & Pricing →
                </Link>
              </div>
            </div>
          </div>

          {/* PRODUCT 4: PUREOS */}
          <div className="glass-card" style={{
            padding: "2.25rem 2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "18px",
            background: "linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(10, 15, 26, 0.95) 100%)",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
            marginBottom: 0
          }}>
            <div>
              <div style={{ marginBottom: "1.5rem" }}>
                <PureOsIcon size={52} glow={true} />
              </div>

              <h3 style={{ fontSize: "1.65rem", marginBottom: "0.35rem", color: "#FFFFFF", fontWeight: 700 }}>PureOS</h3>
              <div style={{ color: "#10B981", fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.85rem" }}>
                Zero-Trust Container Images
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.75rem" }}>
                Build verified, CIS-hardened container images and virtual machines with an integrated SBOM pipeline. Zero hidden dependencies.
              </p>
            </div>

            <div>
              <Link 
                href="/app/pureos" 
                className="btn-primary" 
                style={{ width: "100%", textAlign: "center", textDecoration: "none", padding: "0.85rem", fontSize: "0.92rem", fontWeight: 600, background: "linear-gradient(135deg, #10B981, #059669)" }}>
                Launch Configurator →
              </Link>
              <div style={{ marginTop: "0.6rem", textAlign: "center" }}>
                <Link href="/account/subscription?product=pureos" style={{ color: "#94A3B8", fontSize: "0.8rem", textDecoration: "none" }}>
                  Plans & Pricing →
                </Link>
              </div>
            </div>
          </div>

          {/* PRODUCT 5: PRAXIS */}
          <div className="glass-card" style={{
            padding: "2.25rem 2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            borderRadius: "18px",
            background: "linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(10, 15, 26, 0.95) 100%)",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
            marginBottom: 0
          }}>
            <div>
              <div style={{ marginBottom: "1.5rem" }}>
                <PraxisIcon size={52} glow={true} />
              </div>

              <h3 style={{ fontSize: "1.65rem", marginBottom: "0.35rem", color: "#FFFFFF", fontWeight: 700 }}>Praxis</h3>
              <div style={{ color: "#F59E0B", fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.85rem" }}>
                Remediation Engine
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.75rem" }}>
                Compile and deploy one-time targeted remediation scripts for critical vulnerabilities, syncing directly with the Vantage global registry.
              </p>
            </div>

            <div>
              <Link 
                href="/app/praxis" 
                className="btn-primary" 
                style={{ width: "100%", textAlign: "center", textDecoration: "none", padding: "0.85rem", fontSize: "0.92rem", fontWeight: 600, background: "linear-gradient(135deg, #F59E0B, #D97706)" }}>
                Generate Scripts →
              </Link>
              <div style={{ marginTop: "0.6rem", textAlign: "center" }}>
                <Link href="/account/subscription?product=praxis" style={{ color: "#94A3B8", fontSize: "0.8rem", textDecoration: "none" }}>
                  Plans & Pricing →
                </Link>
              </div>
            </div>
          </div>

          {/* PRODUCT 6: AXIOM */}
          <div className="glass-card" style={{
            padding: "2.25rem 2rem", display: "flex", flexDirection: "column", justifyContent: "space-between",
            border: "1px solid rgba(244, 63, 94, 0.3)", borderRadius: "18px",
            background: "linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(10, 15, 26, 0.95) 100%)", boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7)", marginBottom: 0
          }}>
            <div>
              <div style={{ marginBottom: "1.5rem" }}><AxiomIcon size={52} glow={true} /></div>
              <h3 style={{ fontSize: "1.65rem", marginBottom: "0.35rem", color: "#FFFFFF", fontWeight: 700 }}>Axiom</h3>
              <div style={{ color: "#F43F5E", fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.85rem" }}>Security Education Framework</div>
              <p style={{ color: "#94A3B8", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.75rem" }}>
                Open-source study paths, an interactive global exam simulator, and mock terminal labs for industry-leading certifications like CISSP, OSCP, and Security+.
              </p>
            </div>
            <div>
              <Link href="/app/axiom" className="btn-primary" style={{ width: "100%", textAlign: "center", textDecoration: "none", padding: "0.85rem", fontSize: "0.92rem", fontWeight: 600, background: "linear-gradient(135deg, #F43F5E, #BE123C)" }}>
                Start Learning →
              </Link>
              <div style={{ marginTop: "0.6rem", textAlign: "center" }}>
                <Link href="/account/subscription?product=axiom" style={{ color: "#94A3B8", fontSize: "0.8rem", textDecoration: "none" }}>
                  Explore Plans & Tiers →
                </Link>
              </div>
            </div>
          </div>

          {/* PRODUCT 3: INQUEST */}
          <div className="glass-card" style={{
            padding: "2.25rem 2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "1px solid rgba(6, 182, 212, 0.3)",
            borderRadius: "18px",
            background: "linear-gradient(180deg, rgba(8, 20, 35, 0.8) 0%, rgba(5, 12, 22, 0.95) 100%)",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
            marginBottom: 0
          }}>
            <div>
              <div style={{ marginBottom: "1.5rem" }}>
                <InquestIcon size={52} glow={true} />
              </div>

              <h3 style={{ fontSize: "1.65rem", marginBottom: "0.35rem", color: "#FFFFFF", fontWeight: 700 }}>Inquest</h3>
              <div style={{ color: "#06B6D4", fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.85rem" }}>
                Public Records & FOIA Assistant
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.75rem" }}>
                Draft, file, and track public records requests across federal FOIA and all 50 states. Includes automatic statutory deadline tracking, fee-waiver tools, and formal appeal templates.
              </p>
            </div>

            <div>
              <Link 
                href="/products/inquest" 
                className="btn-primary" 
                style={{ width: "100%", textAlign: "center", textDecoration: "none", padding: "0.85rem", fontSize: "0.92rem", fontWeight: 600, background: "linear-gradient(135deg, #06B6D4, #0284C7)" }}>
                Explore Inquest →
              </Link>
              <div style={{ marginTop: "0.6rem", textAlign: "center" }}>
                <Link href="/account/subscription?product=inquest" style={{ color: "#94A3B8", fontSize: "0.8rem", textDecoration: "none" }}>
                  Plans & Pricing →
                </Link>
              </div>
            </div>
          </div>

        </div>

      </section>
    </div>
  );
}
