import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { 
  PureIdeIcon, 
  VantageIcon, 
  PureOsIcon, 
  PraxisIcon, 
  AxiomIcon, 
  ExultiaLogo 
} from "@/components/BrandIcons";
import { ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/config/site-config";
import FeedPrefetch from "@/components/FeedPrefetch";

export const metadata: Metadata = {
  title: "Exultia Technologies | Practical. Transparent. Secure.",
  description: "Autonomous threat intelligence, zero-downtime hotpatching, and pre-hardened developer environments built with cryptographic provenance and zero telemetry.",
};

export default function HomePage() {
  if (SITE_CONFIG.isolatedThreatFeed) {
    redirect("/app/uvi");
  }

  return (
    <div className="fade-in">
      <FeedPrefetch />
      <main className="exultia-home-container">
        
        {/* HERO SECTION */}
        <section className="exultia-hero-section">
          <div className="hero-emblem-wrap">
            <ExultiaLogo size={360} variant="circle" glow={true} />
          </div>
          <h1 className="sr-only">Exultia Technologies | Practical. Transparent. Secure.</h1>
        </section>

        {/* TIER 1: CORE SECURITY OPERATIONS LOOP (2-Column Hero Grid) */}
        <div className="section-label-header">
          <span className="section-dot" style={{ background: "var(--accent-primary)" }} />
          <span>Real-Time Defense Loop &bull; Detect &amp; Remediate</span>
        </div>

        <div className="core-defense-grid">
          
          {/* 1. Vantage (Threat Intelligence & Errata) */}
          <Link 
            href="/app/uvi"
            className="defense-card defense-card-vantage"
            style={{
              // @ts-ignore
              "--card-accent": "#A855F7",
              "--card-glow": "rgba(168, 85, 247, 0.35)",
            }}
          >
            <div className="defense-card-header">
              <div className="defense-icon-box">
                <VantageIcon size={56} glow={true} />
              </div>
            </div>

            <div className="defense-card-body">
              <h2 className="defense-card-name">Vantage</h2>
              <div className="defense-card-sub">Threat Feed &amp; Patch Management</div>
              <p className="defense-card-desc">
                Aggregated threat intelligence across 127+ feeds unified with automated OS patch advisories.
              </p>
            </div>
          </Link>

          {/* 2. Praxis (Autonomous Hotpatching & Remediation) */}
          <Link 
            href="/app/praxis"
            className="defense-card defense-card-praxis"
            style={{
              // @ts-ignore
              "--card-accent": "#F59E0B",
              "--card-glow": "rgba(245, 158, 11, 0.35)",
            }}
          >
            <div className="defense-card-header">
              <div className="defense-icon-box">
                <PraxisIcon size={56} glow={true} />
              </div>
            </div>

            <div className="defense-card-body">
              <h2 className="defense-card-name">Praxis</h2>
              <div className="defense-card-sub">Autonomous Remediation Engine</div>
              <p className="defense-card-desc">
                Zero-downtime hotpatching, staged canary rollouts, and automated network mitigations.
              </p>
            </div>
          </Link>

        </div>

        {/* TIER 2: HARDENED PLATFORMS & VERIFICATION (3-Column Grid) */}
        <div className="section-label-header" style={{ marginTop: "3.5rem" }}>
          <span className="section-dot" style={{ background: "#38BDF8" }} />
          <span>Foundational Engineering &amp; Verification Ecosystem</span>
        </div>

        <div className="platform-grid">
          
          {/* 3. PureIDE */}
          <Link 
            href="/products/pure-ide"
            className="platform-card platform-card-pureide"
            style={{
              // @ts-ignore
              "--card-accent": "#3B82F6",
              "--card-glow": "rgba(59, 130, 246, 0.35)",
            }}
          >
            <div className="platform-icon-wrap">
              <PureIdeIcon size={48} glow={true} />
            </div>
            <h3 className="platform-card-title">PureIDE</h3>
            <div className="platform-card-sub">Zero-Telemetry Workstation</div>
            <p className="platform-card-desc">
              Hardened, air-gapped development environments with automated CycloneDX SBOM verification.
            </p>
            <div className="platform-card-link">
              <span>View Specifications</span>
              <ArrowRight size={13} />
            </div>
          </Link>

          {/* 4. PureOS */}
          <Link 
            href="/app/pureos"
            className="platform-card platform-card-pureos"
            style={{
              // @ts-ignore
              "--card-accent": "#10B981",
              "--card-glow": "rgba(16, 185, 129, 0.35)",
            }}
          >
            <div className="platform-icon-wrap">
              <PureOsIcon size={48} glow={true} />
            </div>
            <h3 className="platform-card-title">PureOS</h3>
            <div className="platform-card-sub">Hardened Container Platform</div>
            <p className="platform-card-desc">
              Minimal, CIS-benchmarked Linux containers synchronized against active vulnerability feeds.
            </p>
            <div className="platform-card-link">
              <span>Explore Images</span>
              <ArrowRight size={13} />
            </div>
          </Link>

          {/* 5. Axiom */}
          <Link 
            href="/app/axiom"
            className="platform-card platform-card-axiom"
            style={{
              // @ts-ignore
              "--card-accent": "#F43F5E",
              "--card-glow": "rgba(244, 63, 94, 0.35)",
            }}
          >
            <div className="platform-icon-wrap">
              <AxiomIcon size={48} glow={true} />
            </div>
            <h3 className="platform-card-title">Axiom</h3>
            <div className="platform-card-sub">Defense Training &amp; Certs</div>
            <p className="platform-card-desc">
              Hands-on security curricula, live exam simulators, and enterprise skill benchmarking.
            </p>
            <div className="platform-card-link">
              <span>Launch Simulator</span>
              <ArrowRight size={13} />
            </div>
          </Link>

        </div>



      </main>
    </div>
  );
}
