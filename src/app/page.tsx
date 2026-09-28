import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { PureIdeIcon, UviIcon, InquestIcon } from "@/components/BrandIcons";
import { SITE_CONFIG } from "@/config/site-config";

export const metadata: Metadata = {
  title: "Exultia | Workstation Security, Threat Intelligence & Open Records",
  description: "Exultia builds tools for engineering teams and researchers: secure IDE packaging (PureIDE), global vulnerability feeds (UVI), and open-records request management (Inquest).",
};

export default function HomePage() {
  if (SITE_CONFIG.isolatedThreatFeed) {
    redirect("/app/uvi");
  }

  return (
    <div className="fade-in" style={{ paddingBottom: "5rem" }}>
      {/* COMPACT SPLASH HERO */}
      <section className="hero-section" style={{ paddingTop: "3.5rem", paddingBottom: "3rem" }}>
        <h1 className="hero-title" style={{ fontSize: "3.6rem", marginBottom: "1.25rem", letterSpacing: "-0.035em", lineHeight: 1.12 }}>
          Security You Can Audit. <br/>
          <span className="gradient-text">Data You Can Trust.</span>
        </h1>

        <p className="hero-desc" style={{ maxWidth: "760px", marginBottom: "0", fontSize: "1.2rem", lineHeight: "1.65", color: "#94A3B8" }}>
          Exultia builds transparent tools for software teams, security engineers, and researchers—from locked-down developer environments to real-time threat intelligence and automated public records tracking.
        </p>
      </section>

      {/* CORE PRODUCT PLATFORMS */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#60A5FA", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Our Products
          </div>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#FFFFFF", marginTop: "4px" }}>
            Core Platforms
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "1rem", maxWidth: "760px", margin: "0.4rem 0 0 0" }}>
            Built for engineering security, threat research, and public transparency.
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
            </div>
          </div>

          {/* PRODUCT 2: UVI */}
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
                <UviIcon size={52} glow={true} />
              </div>

              <h3 style={{ fontSize: "1.65rem", marginBottom: "0.35rem", color: "#FFFFFF", fontWeight: 700 }}>Universal Vulnerability Intelligence (UVI)</h3>
              <div style={{ color: "#A78BFA", fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.85rem" }}>
                Universal Threat Feed
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.75rem" }}>
                Stay ahead of emerging vulnerabilities. We aggregate and verify 110+ global security feeds, active zero-days, and supply chain threats into one clear, real-time feed.
              </p>
            </div>

            <div>
              <Link 
                href="/app/uvi" 
                className="btn-primary" 
                style={{ width: "100%", textAlign: "center", textDecoration: "none", padding: "0.85rem", fontSize: "0.92rem", fontWeight: 600, background: "linear-gradient(135deg, #8B5CF6, #6366F1)" }}>
                Explore Threat Intelligence →
              </Link>
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
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
