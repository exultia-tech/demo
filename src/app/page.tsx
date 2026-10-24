import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { 
  PureIdeIcon, 
  VantageIcon, 
  PureOsIcon, 
  PraxisIcon, 
  AxiomIcon, 
  ErisIcon, 
  ValkyrieIcon,
  ExultiaLogo 
} from "@/components/BrandIcons";
import { ArrowRight, ShieldCheck, RotateCcw, Sparkles } from "lucide-react";
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
        
        {/* ── ENHANCED HORIZONTAL HERO BANNER ─────────────────────────────────── */}
        <section className="exultia-hero-horizontal">
          <div className="hero-horizontal-container">
            {/* Cybernetic Helm Emblem */}
            <div className="hero-horizontal-emblem">
              <ExultiaLogo size={104} variant="helm" glow={true} />
            </div>

            {/* Brand Typography & Mission Lockup */}
            <div className="hero-horizontal-content">
              <div className="hero-brand-row">
                <div className="hero-brand-titles">
                  <h1 className="hero-brand-name">EXULTIA</h1>
                  <span className="hero-brand-sub">TECHNOLOGIES</span>
                </div>
                <div className="hero-status-pill">
                  <span className="hero-status-beacon" />
                  <span>AUTONOMOUS CYBER SOVEREIGNTY PLATFORM</span>
                </div>
              </div>

              <p className="hero-brand-tagline">
                Practical. Transparent. Secure. One closed-loop platform uniting universal threat detection, adversary emulation, live exploit verification, and sub-second deterministic hotpatching.
              </p>

              {/* Trust Metrics / Attributes Bar */}
              <div className="hero-trust-bar">
                <span className="trust-item"><span className="trust-dot" />100% Hermetic Workstations</span>
                <span className="trust-sep">&bull;</span>
                <span className="trust-item"><span className="trust-dot" />Zero Telemetry</span>
                <span className="trust-sep">&bull;</span>
                <span className="trust-item"><span className="trust-dot" />Sub-Second Rollbacks</span>
                <span className="trust-sep">&bull;</span>
                <span className="trust-item"><span className="trust-dot" />SLSA Level 3 Provenance</span>
                <span className="trust-sep">&bull;</span>
                <span className="trust-item"><span className="trust-dot" />7 Interconnected Engines</span>
              </div>

              {/* Quick Actions */}
              <div className="hero-action-buttons">
                <Link href="/app/uvi" className="btn-hero-primary">
                  <VantageIcon size={18} glow={false} />
                  <span>Launch Vantage Threat Feed</span>
                  <ArrowRight size={15} />
                </Link>

                <Link href="/account/subscription" className="btn-hero-secondary">
                  <ShieldCheck size={18} color="#38BDF8" />
                  <span>Platform Plans &amp; Pricing ($59/mo)</span>
                </Link>

                <a href="#defense-loop" className="btn-hero-ghost">
                  <RotateCcw size={16} color="#C084FC" />
                  <span>Closed-Loop Architecture</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── TIER 1: ACTIVE CLOSED-LOOP DEFENSE PIPELINE (4-Column Balanced Grid) ── */}
        <div id="defense-loop" className="section-label-header">
          <span className="section-dot" style={{ background: "var(--accent-primary)" }} />
          <span>Active Closed-Loop Defense Pipeline &bull; Detect, Emulate, Verify, Remediate</span>
        </div>

        <div className="closed-loop-grid">
          
          {/* 1. Vantage (Detection & Ingestion) */}
          <Link 
            href="/app/uvi"
            className="engine-tile"
            style={{
              // @ts-ignore
              "--card-accent": "#A855F7",
              "--card-glow": "rgba(168, 85, 247, 0.35)",
            }}
          >
            <div className="engine-tile-header">
              <div className="engine-tile-icon-wrap">
                <VantageIcon size={46} glow={true} />
              </div>
              <span className="engine-tile-badge">Stage 01 &bull; Detect</span>
            </div>

            <h2 className="engine-tile-title">Vantage</h2>
            <div className="engine-tile-sub">Universal Threat Intelligence</div>
            <p className="engine-tile-desc">
              Continuous ingestion across 110+ authoritative registries, vendor errata, CISA KEV feeds, and early zero-day warnings.
            </p>

            <div className="engine-tile-features">
              <span className="engine-feature-tag">110+ Feeds</span>
              <span className="engine-feature-tag">CVSS Vectors</span>
              <span className="engine-feature-tag">SIEM Webhooks</span>
            </div>

            <div className="engine-tile-link">
              <span>Explore Threat Feed</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* 2. Eris (Adversary Emulation & Chaos Sandbox) */}
          <Link 
            href="/app/eris"
            className="engine-tile"
            style={{
              // @ts-ignore
              "--card-accent": "#EF4444",
              "--card-glow": "rgba(239, 68, 68, 0.35)",
            }}
          >
            <div className="engine-tile-header">
              <div className="engine-tile-icon-wrap">
                <ErisIcon size={46} glow={false} />
              </div>
              <span className="engine-tile-badge">Stage 02 &bull; Emulate</span>
            </div>

            <h2 className="engine-tile-title">Eris</h2>
            <div className="engine-tile-sub">Chaos Proving Ground &amp; Range</div>
            <p className="engine-tile-desc">
              Intentional vulnerability inoculation. Seed controlled CVE scenarios &amp; rogue sockets in isolated Docker ranges with watchdog timers.
            </p>

            <div className="engine-tile-features">
              <span className="engine-feature-tag">7+ CVE Range</span>
              <span className="engine-feature-tag">Watchdog Timers</span>
              <span className="engine-feature-tag">Ephemeral OCI</span>
            </div>

            <div className="engine-tile-link">
              <span>Enter Chaos Range</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* 3. Valkyrie (On-Demand Pentesting & Exploit Verification) */}
          <Link 
            href="/app/valkyrie"
            className="engine-tile"
            style={{
              // @ts-ignore
              "--card-accent": "#06B6D4",
              "--card-glow": "rgba(6, 182, 212, 0.35)",
            }}
          >
            <div className="engine-tile-header">
              <div className="engine-tile-icon-wrap">
                <ValkyrieIcon size={46} glow={false} />
              </div>
              <span className="engine-tile-badge">Stage 03 &bull; Verify</span>
            </div>

            <h2 className="engine-tile-title">Valkyrie</h2>
            <div className="engine-tile-sub">On-Demand Pentest &amp; BAS</div>
            <p className="engine-tile-desc">
              Precision breach &amp; attack simulation. Probe endpoints with safe non-destructive canaries to prove exploitability with signed HMAC tokens.
            </p>

            <div className="engine-tile-features">
              <span className="engine-feature-tag">10+ BAS Probes</span>
              <span className="engine-feature-tag">Safe Handshakes</span>
              <span className="engine-feature-tag">HMAC-SHA256</span>
            </div>

            <div className="engine-tile-link">
              <span>Launch Exploit Prober</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* 4. Praxis (Autonomous Hotpatching & Remediation) */}
          <Link 
            href="/app/praxis"
            className="engine-tile"
            style={{
              // @ts-ignore
              "--card-accent": "#F59E0B",
              "--card-glow": "rgba(245, 158, 11, 0.35)",
            }}
          >
            <div className="engine-tile-header">
              <div className="engine-tile-icon-wrap">
                <PraxisIcon size={46} glow={true} />
              </div>
              <span className="engine-tile-badge">Stage 04 &bull; Remediate</span>
            </div>

            <h2 className="engine-tile-title">Praxis</h2>
            <div className="engine-tile-sub">Autonomous Remediation Engine</div>
            <p className="engine-tile-desc">
              Zero-downtime hotpatch synthesis, staged Ansible canary rollouts, firewall ACL generators, and sub-second deterministic rollbacks.
            </p>

            <div className="engine-tile-features">
              <span className="engine-feature-tag">&lt;500ms Rollback</span>
              <span className="engine-feature-tag">Ansible Plays</span>
              <span className="engine-feature-tag">Hardware ACLs</span>
            </div>

            <div className="engine-tile-link">
              <span>Open Praxis Engine</span>
              <ArrowRight size={14} />
            </div>
          </Link>

        </div>

        {/* ── TIER 2: SOVEREIGN WORKSPACE, RUNTIME & READINESS (3-Column Balanced Grid) ── */}
        <div className="section-label-header" style={{ marginTop: "3.5rem" }}>
          <span className="section-dot" style={{ background: "#38BDF8" }} />
          <span>Foundational Engineering, Runtime &amp; Workforce Readiness</span>
        </div>

        <div className="foundations-grid">
          
          {/* 5. PureIDE */}
          <Link 
            href="/products/pure-ide"
            className="engine-tile"
            style={{
              // @ts-ignore
              "--card-accent": "#3B82F6",
              "--card-glow": "rgba(59, 130, 246, 0.35)",
            }}
          >
            <div className="engine-tile-header">
              <div className="engine-tile-icon-wrap">
                <PureIdeIcon size={44} glow={true} />
              </div>
              <span className="engine-tile-badge">Developer Security</span>
            </div>

            <h3 className="engine-tile-title">PureIDE</h3>
            <div className="engine-tile-sub">Zero-Telemetry Workstation</div>
            <p className="engine-tile-desc">
              Hardened, air-gapped developer compiler environments with network egress sandboxing and automated CycloneDX SBOM verification.
            </p>

            <div className="engine-tile-features">
              <span className="engine-feature-tag">Hermetic Sandbox</span>
              <span className="engine-feature-tag">Airgap Cosign</span>
              <span className="engine-feature-tag">Egress Gate</span>
            </div>

            <div className="engine-tile-link">
              <span>View Specifications</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* 6. PureOS */}
          <Link 
            href="/app/pureos"
            className="engine-tile"
            style={{
              // @ts-ignore
              "--card-accent": "#10B981",
              "--card-glow": "rgba(16, 185, 129, 0.35)",
            }}
          >
            <div className="engine-tile-header">
              <div className="engine-tile-icon-wrap">
                <PureOsIcon size={44} glow={true} />
              </div>
              <span className="engine-tile-badge">Hardened Containers</span>
            </div>

            <h3 className="engine-tile-title">PureOS</h3>
            <div className="engine-tile-sub">Hardened Container Runtime</div>
            <p className="engine-tile-desc">
              Minimal distroless and CIS Level 1 &amp; 2 pre-hardened container images continuously synchronized against active Vantage CVE feeds.
            </p>

            <div className="engine-tile-features">
              <span className="engine-feature-tag">CIS Level 1 &amp; 2</span>
              <span className="engine-feature-tag">Distroless Base</span>
              <span className="engine-feature-tag">Daily CVE Sync</span>
            </div>

            <div className="engine-tile-link">
              <span>Explore Image Catalog</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* 7. Axiom */}
          <Link 
            href="/app/axiom"
            className="engine-tile"
            style={{
              // @ts-ignore
              "--card-accent": "#F43F5E",
              "--card-glow": "rgba(244, 63, 94, 0.35)",
            }}
          >
            <div className="engine-tile-header">
              <div className="engine-tile-icon-wrap">
                <AxiomIcon size={44} glow={true} />
              </div>
              <span className="engine-tile-badge">Workforce Readiness</span>
            </div>

            <h3 className="engine-tile-title">Axiom</h3>
            <div className="engine-tile-sub">Defense Training &amp; LMS API</div>
            <p className="engine-tile-desc">
              Hands-on exam simulations (Security+, CySA+, CC) with verifiable SHA-256 certs and institutional LMS deep linking (SCORM/LTI 1.3).
            </p>

            <div className="engine-tile-features">
              <span className="engine-feature-tag">Full Question Banks</span>
              <span className="engine-feature-tag">Verifiable Certs</span>
              <span className="engine-feature-tag">SCORM/LTI API</span>
            </div>

            <div className="engine-tile-link">
              <span>Launch Exam Simulator</span>
              <ArrowRight size={14} />
            </div>
          </Link>

        </div>

        {/* ── UNIFIED PLATFORM CALLOUT BANNER ─────────────────────────────────── */}
        <div className="platform-callout-banner">
          <div className="callout-banner-left">
            <ExultiaLogo size={42} variant="helm" glow={false} />
            <div>
              <h3 className="callout-banner-title">The Sovereign Closed-Loop Ecosystem</h3>
              <p className="callout-banner-desc">
                One unified subscription unlocks all 7 defense engines with zero fragmented add-ons. Available in Community ($0), Professional ($59/mo), and Enterprise Fleet.
              </p>
            </div>
          </div>

          <Link href="/account/subscription" className="callout-banner-btn">
            <Sparkles size={16} />
            <span>Explore Platform Plans</span>
            <ArrowRight size={15} />
          </Link>
        </div>

      </main>
    </div>
  );
}
