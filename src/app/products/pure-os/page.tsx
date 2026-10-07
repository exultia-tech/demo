import Link from "next/link";
import { Metadata } from "next";
import { PureOsIcon } from "@/components/BrandIcons";

export const metadata: Metadata = {
  title: "Exultia PureOS | Pre-Hardened OS Images",
  description: "PureOS provides pre-hardened OS container images secured against the Vantage Threat Feed and industry best practices.",
};

export default function PureOSMarketingPage() {
  return (
    <div className="fade-in" style={{ paddingBottom: "5rem" }}>
      {/* PRODUCT HERO */}
      <section className="hero-section" style={{ paddingTop: "3rem", paddingBottom: "3.5rem" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
          <PureOsIcon size={64} glow={true} />
        </div>
        <h1 className="hero-title" style={{ fontSize: "3.6rem", marginBottom: "1.25rem", letterSpacing: "-0.03em", lineHeight: 1.12 }}>
          <span className="gradient-text">PureOS Registry</span>
        </h1>
        <p className="hero-subtitle" style={{ maxWidth: "720px", margin: "0 auto 2.5rem auto", fontSize: "1.1rem", lineHeight: 1.5, color: "var(--text-muted)" }}>
          Stop deploying vulnerable infrastructure. PureOS provides a catalogue of pre-hardened, zero-trust OS container images continuously synchronized with the Vantage feed.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/app/pureos" className="btn-primary" style={{ padding: "0.95rem 2.25rem", fontSize: "1rem", textDecoration: "none", background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" }}>
            Browse Catalogue →
          </Link>
          <Link href="/products/pure-os/pricing" style={{ padding: "0.95rem 1.85rem", borderRadius: "10px", background: "rgba(255,255,255,0.08)", border: "1px solid var(--border-color)", color: "white", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem" }}>
            Plans & Pricing
          </Link>
          <Link href="/account/subscription?product=pureos" className="btn-primary" style={{ padding: "0.95rem 1.85rem", fontSize: "0.95rem", textDecoration: "none", background: "linear-gradient(135deg, #2563EB, #1D4ED8)" }}>
            Subscribe Now →
          </Link>
        </div>
      </section>

      {/* OVERVIEW CONTENT */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <div className="glass-card" style={{ padding: "3rem", borderRadius: "24px" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "2rem", textAlign: "center" }}>Hardened from the Ground Up</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            <div style={{ padding: "1.5rem", background: "rgba(0,0,0,0.2)", borderRadius: "16px", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
              <h3 style={{ color: "#FBBF24", marginBottom: "1rem" }}>Vantage Synchronized</h3>
              <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.6 }}>
                Every image in the PureOS registry is automatically rebuilt and verified against the latest Vantage Threat Feed advisories. Zero-day mitigations are injected directly into the baseline OS configurations.
              </p>
            </div>
            <div style={{ padding: "1.5rem", background: "rgba(0,0,0,0.2)", borderRadius: "16px", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
              <h3 style={{ color: "#FBBF24", marginBottom: "1rem" }}>CIS Benchmark Compliant</h3>
              <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.6 }}>
                Images are hardened out-of-the-box using CIS Level 1 and Level 2 benchmarks. Default accounts are locked, vulnerable services are disabled, and network boundaries are sealed.
              </p>
            </div>
            <div style={{ padding: "1.5rem", background: "rgba(0,0,0,0.2)", borderRadius: "16px", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
              <h3 style={{ color: "#FBBF24", marginBottom: "1rem" }}>Minimal Attack Surface</h3>
              <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.6 }}>
                We strip non-essential binaries and package managers from production-ready images, dramatically reducing the surface area available for remote code execution and lateral movement.
              </p>
            </div>
            <div style={{ padding: "1.5rem", background: "rgba(0,0,0,0.2)", borderRadius: "16px", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
              <h3 style={{ color: "#FBBF24", marginBottom: "1rem" }}>Infrastructure-as-Code Deliverables</h3>
              <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.6 }}>
                To maintain strict chain-of-custody and air-gap compliance, we don't host your containers. We generate the hardened <strong style={{color:"white"}}>Dockerfile</strong> and <strong style={{color:"white"}}>JSON SBOM</strong> recipes for you to seamlessly integrate into your own internal CI/CD pipelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section style={{ maxWidth: "1000px", margin: "4rem auto 0 auto", padding: "0 1.5rem" }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.15))",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          borderRadius: "20px",
          padding: "3rem 2rem",
          textAlign: "center",
          boxShadow: "0 20px 40px -15px rgba(0,0,0,0.8)"
        }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.75rem", color: "#FFFFFF" }}>
            Ready to Deploy Hardened OS Images?
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", maxWidth: "600px", margin: "0 auto 2rem auto" }}>
            Configure and download verified, CIS-hardened base images with automated SBOM validation.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/app/pureos" className="btn-primary" style={{ padding: "0.95rem 2.25rem", fontSize: "1rem", textDecoration: "none", background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" }}>
              Launch Configurator Free →
            </Link>
            <Link href="/account/subscription?product=pureos" style={{ padding: "0.95rem 1.85rem", borderRadius: "10px", background: "rgba(255,255,255,0.08)", border: "1px solid var(--border-color)", color: "white", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem" }}>
              Plans & Pricing →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
