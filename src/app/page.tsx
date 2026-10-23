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
import { 
  ShieldCheck, 
  Zap, 
  Radio, 
  Layers, 
  ArrowRight, 
  Lock, 
  Sparkles, 
  Terminal, 
  Activity 
} from "lucide-react";
import { SITE_CONFIG } from "@/config/site-config";

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
      <main className="exultia-home-container">
        
        {/* HERO SECTION */}
        <section className="exultia-hero-section">
          <div className="hero-emblem-wrap">
            <ExultiaLogo size={150} variant="circle" glow={true} />
          </div>

          <div className="hero-badge-pill">
            <span className="hero-pulse-dot" />
            <span>Autonomous Cyber Defense &amp; Hardened Infrastructure</span>
          </div>

          <h1 className="hero-headline">
            EXULTIA TECHNOLOGIES
          </h1>

          <p className="hero-tagline">
            Practical. Transparent. Secure.
          </p>

          <p className="hero-description">
            Continuous threat intelligence from 127+ public &amp; vendor feeds paired with 
            autonomous zero-downtime hotpatching, CIS-hardened OS images, and offline-ready developer workstations.
          </p>

          <div className="hero-cta-group">
            <Link href="/app/uvi" className="hero-btn-primary">
              <Radio size={16} />
              <span>Explore Vantage Feeds</span>
              <ArrowRight size={15} />
            </Link>
            <Link href="/app/praxis" className="hero-btn-secondary">
              <Zap size={16} />
              <span>Praxis Hotpatch Engine</span>
            </Link>
          </div>
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
              <div className="defense-pill pill-purple">
                <span>127 Feeds &bull; 16 Vendor Streams</span>
              </div>
            </div>

            <div className="defense-card-body">
              <div className="defense-card-title-row">
                <h2 className="defense-card-name">Vantage</h2>
                <span className="defense-card-arrow">→</span>
              </div>
              <div className="defense-card-sub">Universal Threat &amp; Errata Intelligence</div>
              <p className="defense-card-desc">
                Aggregate, de-duplicate, and cross-reference 127 authoritative feeds, 16 major OS/software vendor 
                security disclosures (PHP, Microsoft, Red Hat, Ubuntu, Debian, Apple, Cisco), and active zero-days with EPSS velocity metrics.
              </p>
            </div>

            <div className="defense-card-footer">
              <div className="defense-meta-item">
                <Activity size={14} color="#C084FC" />
                <span>Real-Time Ingestion</span>
              </div>
              <div className="defense-meta-item">
                <ShieldCheck size={14} color="#C084FC" />
                <span>CVE &bull; KEV &bull; EPSS</span>
              </div>
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
              <div className="defense-pill pill-amber">
                <span>Zero-Downtime Hotpatches &bull; ACLs</span>
              </div>
            </div>

            <div className="defense-card-body">
              <div className="defense-card-title-row">
                <h2 className="defense-card-name">Praxis</h2>
                <span className="defense-card-arrow">→</span>
              </div>
              <div className="defense-card-sub">Autonomous Remediation &amp; Hardening Engine</div>
              <p className="defense-card-desc">
                Synthesize instant Tier 1 live-memory hotpatches, canary rollouts (Ring 0 &rarr; Ring 1 &rarr; Fleet), 
                and multi-tier Systemd/GitOps playbooks, alongside hardware firewall ACLs (Cisco, Palo Alto EDL, Fortinet, iptables).
              </p>
            </div>

            <div className="defense-card-footer">
              <div className="defense-meta-item">
                <Zap size={14} color="#FBBF24" />
                <span>Sub-Second Rollbacks</span>
              </div>
              <div className="defense-meta-item">
                <Terminal size={14} color="#FBBF24" />
                <span>SLSA Level 3 Provenance</span>
              </div>
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
            <div className="platform-card-sub">Secure Workstation Builder</div>
            <p className="platform-card-desc">
              Package, verify, and deploy clean, offline-ready IDEs stripped of telemetry with automated CycloneDX SBOMs.
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
            <div className="platform-card-sub">Zero-Trust Container OS</div>
            <p className="platform-card-desc">
              Pre-hardened, CIS-benchmarked container images and minimal Linux baselines continuously synchronized to Vantage.
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
            <div className="platform-card-sub">Security Education Framework</div>
            <p className="platform-card-desc">
              Open-source certification curricula, real-time exam simulator, and enterprise LMS gradebook API integration.
            </p>
            <div className="platform-card-link">
              <span>Launch Simulator</span>
              <ArrowRight size={13} />
            </div>
          </Link>

        </div>

        {/* TRUST & TELEMETRY STRIP */}
        <section className="integrity-strip">
          <div className="integrity-col">
            <div className="integrity-num">127+</div>
            <div className="integrity-label">Authoritative Threat Feeds</div>
          </div>
          <div className="integrity-divider" />
          <div className="integrity-col">
            <div className="integrity-num">0 ms</div>
            <div className="integrity-label">Reboot Requirement (Hotpatch)</div>
          </div>
          <div className="integrity-divider" />
          <div className="integrity-col">
            <div className="integrity-num">SLSA L3</div>
            <div className="integrity-label">Cryptographic Cosign Verification</div>
          </div>
          <div className="integrity-divider" />
          <div className="integrity-col">
            <div className="integrity-num">100%</div>
            <div className="integrity-label">Zero-Telemetry Guarantee</div>
          </div>
        </section>

      </main>
    </div>
  );
}
