"use client";

import { useState } from "react";
import Link from "next/link";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  
  // Pay What You Want (Interactive Main Price Label State)
  const [communityPrice, setCommunityPrice] = useState<string>("0");
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<number | "custom">(0);
  const [customDonation, setCustomDonation] = useState<string>("15");
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [donationReceiptId, setDonationReceiptId] = useState<string>("");

  const parsedPrice = parseFloat(communityPrice) || 0;

  const handleOpenDonation = (amount?: number | "custom") => {
    if (amount !== undefined) {
      setSelectedDonation(amount);
      if (typeof amount === "number") {
        setCommunityPrice(amount.toString());
      }
    }
    setDonationSuccess(false);
    setShowDonationModal(true);
  };

  const handleProcessDonation = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `DON-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    setDonationReceiptId(id);
    setDonationSuccess(true);
  };

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
        
        {/* COMMUNITY EDITION TIER (DYNAMIC PAY-WHAT-YOU-WANT PRICE LABEL) */}
        <div className="pricing-card" style={{ display: 'flex', flexDirection: 'column', border: parsedPrice > 0 ? '1px solid rgba(52, 211, 153, 0.4)' : undefined }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.3rem', margin: 0 }}>Community</h3>
            <span style={{ fontSize: '0.7rem', color: '#34D399', background: 'rgba(52,211,153,0.12)', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontWeight: 700 }}>
              {parsedPrice === 0 ? "Free & Open" : "Supporter"}
            </span>
          </div>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem', minHeight: '38px', lineHeight: '1.5' }}>
            Free forever. We believe raising awareness for secure IDE environments is most effective when zero-trust tools are freely accessible to every engineer.
          </p>
          
          {/* MAIN DYNAMIC PRICE INPUT & LABEL */}
          <div style={{ margin: '0.75rem 0 0.4rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)' }}>$</span>
              <input
                type="number"
                min="0"
                max="9999"
                value={communityPrice}
                onChange={(e) => {
                  const val = e.target.value;
                  setCommunityPrice(val);
                  const num = parseFloat(val);
                  setSelectedDonation(isNaN(num) || num <= 0 ? 0 : num);
                }}
                title="Enter your voluntary price or donation amount"
                style={{
                  fontSize: '2.2rem',
                  fontWeight: 800,
                  width: '110px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  borderRadius: '8px',
                  color: '#34D399',
                  padding: '0.1rem 0.5rem',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
              <span style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 600, background: 'rgba(52, 211, 153, 0.1)', padding: '0.2rem 0.45rem', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                Pay What You Want
              </span>
            </div>

            {/* Quick Price Preset Chips */}
            <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              {["0", "5", "15", "30", "50"].map((amt) => {
                const isSelected = communityPrice === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setCommunityPrice(amt);
                      const num = parseFloat(amt);
                      setSelectedDonation(num);
                    }}
                    style={{
                      padding: '0.2rem 0.55rem',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      borderRadius: '6px',
                      border: isSelected ? '1px solid #34D399' : '1px solid var(--border-color)',
                      background: isSelected ? 'rgba(52, 211, 153, 0.15)' : 'rgba(255,255,255,0.03)',
                      color: isSelected ? '#34D399' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {amt === "0" ? "$0 (Free)" : `$${amt}`}
                  </button>
                );
              })}
            </div>
          </div>

          <p style={{ fontSize: '0.75rem', color: parsedPrice > 0 ? '#93C5FD' : '#34D399', margin: '0 0 1.25rem 0', lineHeight: 1.4 }}>
            {parsedPrice > 0 
              ? `Voluntary one-time contribution ($${parsedPrice}) • Does not grant paid entitlements`
              : "100% Free Forever • Zero payment required to build"
            }
          </p>

          <ul className="pricing-features-list" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            <li className="included">✓ Multi-IDE Air-Gapped Builds (6 Engines)</li>
            <li className="included">✓ 0-CVE Verified Whitelist & Deprecation Gating</li>
            <li className="included">✓ 8-Source Threat Intelligence Sync</li>
            <li className="included">✓ CycloneDX 1.5 JSON SBOMs & SHA-256 Manifests</li>
            <li className="included">✓ Zero Outbound Telemetry Binary Policy</li>
            <li className="included">✓ Manual Marketplace Catalog Carting</li>
          </ul>

          <div style={{ marginTop: 'auto' }}>
            {parsedPrice > 0 ? (
              <button
                type="button"
                onClick={() => handleOpenDonation(parsedPrice)}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <span>🎁</span> Contribute ${parsedPrice} & Build Free →
              </button>
            ) : (
              <Link 
                href="/console" 
                className="btn-primary" 
                style={{ textAlign: 'center', textDecoration: 'none', background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid var(--border-color)', fontSize: '0.85rem', padding: '0.75rem', display: 'block', width: '100%', boxSizing: 'border-box' }}
              >
                Start Building Free ($0) →
              </Link>
            )}
          </div>
        </div>

        {/* TEAM EDITION TIER */}
        <div className="pricing-card" style={{ display: 'flex', flexDirection: 'column' }}>
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
        <div className="pricing-card popular" style={{ display: 'flex', flexDirection: 'column' }}>
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

      {/* PAY WHAT YOU WANT (ONE-TIME DONATION MODAL) */}
      {showDonationModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '520px', width: '100%', padding: '2rem', position: 'relative', border: '1px solid rgba(52, 211, 153, 0.4)' }}>
            
            <button 
              onClick={() => setShowDonationModal(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.25rem', cursor: 'pointer' }}>
              ✕
            </button>

            {!donationSuccess ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🎁</span>
                  <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Community Tier: Pay What You Want</h2>
                </div>
                
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                  Thank you for supporting open-source IDE security awareness and continuous threat feed operations. 
                </p>

                {/* IMPORTANT DISCLOSURE BOX */}
                <div style={{ padding: '0.75rem 1rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.78rem', color: '#93C5FD', lineHeight: '1.5' }}>
                  <strong>ℹ️ Contribution Disclosure:</strong> This is a <strong>100% voluntary, one-time donation</strong> with zero recurring charges. Your Community Tier account remains free forever and this contribution does not confer Team or Enterprise paid plan entitlements.
                </div>

                <form onSubmit={handleProcessDonation}>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                      Confirm One-Time Donation Amount (USD)
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      {[5, 15, 30, 50].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setSelectedDonation(amt);
                            setCommunityPrice(amt.toString());
                          }}
                          style={{
                            padding: '0.6rem 0',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            border: parsedPrice === amt ? '2px solid #34D399' : '1px solid var(--border-color)',
                            background: parsedPrice === amt ? 'rgba(52, 211, 153, 0.15)' : 'rgba(255,255,255,0.03)',
                            color: parsedPrice === amt ? '#34D399' : 'white',
                            cursor: 'pointer'
                          }}
                        >
                          ${amt}
                        </button>
                      ))}
                    </div>

                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>$</span>
                      <input
                        type="number"
                        min="1"
                        max="10000"
                        value={communityPrice}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCommunityPrice(val);
                          setSelectedDonation(parseFloat(val) || 0);
                        }}
                        placeholder="Enter custom amount"
                        style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 1.6rem', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-color)', color: 'white', fontSize: '0.85rem', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ flex: 1, padding: '0.8rem', fontSize: '0.9rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <span>❤️</span> Complete One-Time Donation (${parsedPrice})
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDonationModal(false)}
                      style={{ padding: '0.8rem 1.25rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(52, 211, 153, 0.2)', border: '1px solid #34D399', display: 'grid', placeItems: 'center', margin: '0 auto 1.25rem auto', color: '#34D399', fontSize: '1.75rem' }}>
                  ✓
                </div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Thank You for Your Support!</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                  Your one-time donation of <strong style={{ color: '#34D399' }}>${parsedPrice}</strong> directly funds our independent supply-chain vulnerability research and public threat feed ingestion.
                </p>
                <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-color)', fontFamily: 'monospace', fontSize: '0.8rem', color: '#93C5FD', marginBottom: '1.5rem' }}>
                  Receipt Reference: {donationReceiptId} • (Non-recurring)
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Link
                    href="/console"
                    onClick={() => setShowDonationModal(false)}
                    className="btn-primary"
                    style={{ flex: 1, padding: '0.75rem', textAlign: 'center', textDecoration: 'none', fontSize: '0.9rem' }}
                  >
                    Open Builder Console →
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowDonationModal(false)}
                    style={{ padding: '0.75rem 1.25rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* FREQUENTLY ASKED QUESTIONS & PROCUREMENT SUPPORT */}
      <div className="glass-card" style={{ padding: '2.5rem', marginTop: '4rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'center' }}>Frequently Asked Questions</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', color: '#93C5FD', marginBottom: '0.4rem' }}>
              What is the &quot;Pay What You Want&quot; option on the Community tier?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>
              The Community tier is 100% free forever ($0). If you or your organization wish to support our continuous open threat research and infrastructure maintenance, you can choose to make a one-time voluntary donation of any amount directly in the price field. This is strictly a non-recurring donation and does not unlock or alter plan entitlements.
            </p>
          </div>

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
