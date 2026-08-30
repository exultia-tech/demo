"use client";

import { useState } from "react";
import Link from "next/link";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  return (
    <div className="fade-in" style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span className="hero-badge">Transparent Enterprise Pricing</span>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>
          Predictable Plans for Engineering Teams of Any Size
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto 2rem auto' }}>
          From free air-gapped open-source builds to fully dedicated multi-cluster enterprise deployments.
        </p>

        {/* Billing Toggle */}
        <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.35rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => setBillingCycle("monthly")}
            style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', background: billingCycle === "monthly" ? 'var(--accent-primary)' : 'transparent', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
            Monthly Billing
          </button>
          <button 
            onClick={() => setBillingCycle("annual")}
            style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', background: billingCycle === "annual" ? 'var(--accent-primary)' : 'transparent', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            Annual Billing <span style={{ background: '#34D399', color: '#000', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '9999px', fontWeight: 700 }}>20% OFF</span>
          </button>
        </div>
      </div>

      {/* PRICING CARDS (3 TIERS) */}
      <div className="pricing-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))' }}>
        {/* COMMUNITY EDITION TIER */}
        <div className="pricing-card">
          <h3 style={{ fontSize: '1.3rem', margin: 0 }}>Community</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem', minHeight: '38px', lineHeight: '1.5' }}>
            Free forever. We believe raising awareness for secure IDE environments is most effective when zero-trust tools are freely accessible to every engineer.
          </p>
          
          <div className="pricing-price" style={{ fontSize: '2.2rem', margin: '0.75rem 0 0.2rem 0' }}>
            $0 <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ seat</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#34D399', margin: '0 0 1.25rem 0', lineHeight: 1.4 }}>
            100% Free Forever • Advancing developer security awareness
          </p>

          <ul className="pricing-features-list" style={{ fontSize: '0.85rem' }}>
            <li className="included">✓ Multi-IDE Air-Gapped Builds (6 Engines)</li>
            <li className="included">✓ 0-CVE Verified Whitelist & Deprecation Gating</li>
            <li className="included">✓ 8-Source Threat Intelligence Sync</li>
            <li className="included">✓ CycloneDX 1.5 JSON SBOMs & SHA-256 Manifests</li>
            <li className="included">✓ Zero Outbound Telemetry Binary Policy</li>
            <li className="included">✓ Manual Marketplace Catalog Carting</li>
          </ul>

          <div style={{ marginTop: 'auto' }}>
            <Link href="/console" className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none', background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid var(--border-color)', fontSize: '0.85rem', padding: '0.75rem', display: 'block', width: '100%', boxSizing: 'border-box' }}>
              Start Building Free →
            </Link>
          </div>
        </div>

        {/* TEAM EDITION TIER */}
        <div className="pricing-card">
          <h3 style={{ fontSize: '1.3rem', margin: 0 }}>Team</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem', minHeight: '38px' }}>
            For engineering teams wanting shared blueprints & automated CI/CD.
          </p>

          <div className="pricing-price" style={{ fontSize: '2.2rem', margin: '0.75rem 0 0.2rem 0' }}>
            ${billingCycle === "annual" ? "19" : "24"} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ seat / mo</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 1.25rem 0' }}>
            {billingCycle === "annual" ? "Billed annually ($19/mo) • Save 20%" : "Billed monthly ($24/mo) • Cancel anytime"}
          </p>

          <ul className="pricing-features-list" style={{ fontSize: '0.85rem' }}>
            <li className="included" style={{ fontWeight: 700, color: '#93C5FD' }}>✓ Everything in Community, plus:</li>
            <li className="included">✓ Curated & Community-Contributed Blueprints (20+ Stacks)</li>
            <li className="included">✓ Publish & Share Custom Org Blueprints</li>
            <li className="included">✓ Auto-Bundled Remote-SSH Bridges</li>
            <li className="included">✓ IDE Hardening & Policy as Code</li>
            <li className="included">✓ Multi-OS CI/CD Pipeline Exporters</li>
            <li className="included">✓ Enforced Deterministic Governance Rules</li>
          </ul>

          <div style={{ marginTop: 'auto' }}>
            <Link href="/console" className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid var(--accent-primary)', color: '#93C5FD', fontSize: '0.85rem', padding: '0.75rem', display: 'block', width: '100%', boxSizing: 'border-box' }}>
              Start Team Trial →
            </Link>
          </div>
        </div>

        {/* ENTERPRISE TIER (MAX TIER) */}
        <div className="pricing-card popular">
          <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-primary)', color: 'white', padding: '0.2rem 0.75rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em' }}>
            MOST POPULAR
          </div>
          <h3 style={{ fontSize: '1.3rem', margin: 0 }}>Enterprise</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem', minHeight: '38px' }}>
            Full White-Labeling, Headless build APIs, private Artifactory proxying, and policy overrides.
          </p>

          <div className="pricing-price" style={{ fontSize: '2.2rem', margin: '0.75rem 0 0.2rem 0' }}>
            ${billingCycle === "annual" ? "39" : "49"} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ seat / mo</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#93C5FD', margin: '0 0 1.25rem 0', lineHeight: 1.4 }}>
            Self-serve for 1–100 seats • <Link href="/console" style={{ color: '#60A5FA', textDecoration: 'underline' }}>100+ dev fleet? Inquire for Site License / MSA →</Link>
          </p>

          <ul className="pricing-features-list" style={{ fontSize: '0.85rem' }}>
            <li className="included" style={{ fontWeight: 700, color: '#93C5FD' }}>✓ Everything in Team, plus:</li>
            <li className="included">✓ Full White-Label Brand Studio (Custom Binary Names & Themes)</li>
            <li className="included">✓ Headless REST Build API & Webhooks</li>
            <li className="included">✓ Private JFrog Artifactory / Registry Proxy</li>
            <li className="included">✓ Policy-Based Extension Override Engine</li>
            <li className="included">✓ Multi-OS Release Matrix (.exe, .dmg, .deb, .tar.gz)</li>
            <li className="included">✓ Workspace Trust Mandatory Security Locks</li>
            <li className="included">✓ Exportable Signed Build Manifest JSON</li>
            <li className="included">✓ Priority Builder & Pipeline Support</li>
          </ul>

          <div style={{ marginTop: 'auto' }}>
            <Link href="/console" className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none', fontSize: '0.85rem', padding: '0.75rem', display: 'block', width: '100%', boxSizing: 'border-box' }}>
              Launch Enterprise (1–100 Seats) →
            </Link>
          </div>
        </div>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS & PROCUREMENT SUPPORT */}
      <div className="glass-card" style={{ padding: '2.5rem', marginTop: '4rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'center' }}>Frequently Asked Questions</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', color: '#93C5FD', marginBottom: '0.4rem' }}>
              How does self-serve vs. site licensing (100+ seats) work?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>
              Teams with 1 to 100 seats can self-serve instantly online via credit card. For engineering fleets with 100+ developers (up to 50,000+ seats), we offer custom organization-wide site licensing, Master Service Agreements (MSAs), Net-30/60 purchase orders, volume tiers, and custom HSM infrastructure.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.05rem', color: '#93C5FD', marginBottom: '0.4rem' }}>
              Can we run SecureIDE completely air-gapped on-premises?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>
              Yes. Enterprise tier supports headless CLI orchestrators and private Artifactory/OpenVSX proxy mirrors with zero external internet dependencies.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.05rem', color: '#93C5FD', marginBottom: '0.4rem' }}>
              Are custom payment terms, purchase orders, and MSAs supported?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>
              Yes. Enterprise annual plans and 100+ site licenses support standard Net-30/60 purchase orders, wire transfers, custom MSA terms, and security questionnaire reviews.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.05rem', color: '#93C5FD', marginBottom: '0.4rem' }}>
              What happens to our compiled binaries if we cancel?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>
              All compiled binaries, CycloneDX 1.5 SBOMs, and cryptographic SHA-256 manifests remain permanently yours and run independently without recurring license check-ins.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Planning a 100+ developer rollout or need custom MSA terms?
          </p>
          <Link href="/console" className="btn-primary" style={{ padding: '0.75rem 1.75rem', textDecoration: 'none', fontSize: '0.9rem' }}>
            Explore Enterprise Builder Console →
          </Link>
        </div>
      </div>

    </div>
  );
}
