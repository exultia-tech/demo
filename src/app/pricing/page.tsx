"use client";

import { useState } from "react";
import Link from "next/link";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  
  // Pay What You Want (Interactive Main Price Label State)
  const [communityPrice, setCommunityPrice] = useState<string>("0");
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<number | "custom">(0);
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
    <div className="fade-in" style={{ padding: '3rem 1.5rem', maxWidth: '1360px', margin: '0 auto' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span className="hero-badge">Transparent Enterprise Pricing</span>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>
          Predictable Plans for Engineering Teams of Any Size
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '680px', margin: '0 auto 2rem auto' }}>
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

      {/* PRICING CARDS (4 TIERS: COMMUNITY, TEAM, ENTERPRISE, FLEET 100+) */}
      <div className="pricing-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', alignItems: 'stretch', gap: '1.25rem' }}>
        
        {/* TIER 1: COMMUNITY EDITION */}
        <div className="pricing-card" style={{ display: 'flex', flexDirection: 'column', padding: '1.75rem 1.5rem', border: parsedPrice > 0 ? '1px solid rgba(52, 211, 153, 0.4)' : undefined }}>
          {/* HEADER BLOCK (UNIFIED HEIGHT: 80px) */}
          <div style={{ minHeight: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Community</h3>
              <span style={{ fontSize: '0.68rem', color: '#34D399', background: 'rgba(52,211,153,0.12)', padding: '0.15rem 0.45rem', borderRadius: '9999px', fontWeight: 700 }}>
                {parsedPrice === 0 ? "Free & Open" : "Supporter"}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: 0, lineHeight: '1.5' }}>
              Free forever. Open-source zero-trust developer workstation for every engineer.
            </p>
          </div>
          
          {/* PRICE BLOCK (UNIFIED HEIGHT: 75px - VERTICALLY ALIGNED) */}
          <div style={{ height: '75px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>$</span>
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
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  width: '85px',
                  height: '36px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  borderRadius: '8px',
                  color: '#34D399',
                  padding: '0.1rem 0.4rem',
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
              <span style={{ fontSize: '0.68rem', color: '#34D399', fontWeight: 600, background: 'rgba(52, 211, 153, 0.1)', padding: '0.2rem 0.4rem', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                Pay What You Want
              </span>
            </div>

            {/* Quick Price Preset Chips */}
            <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
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
                      padding: '0.15rem 0.4rem',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      borderRadius: '5px',
                      border: isSelected ? '1px solid #34D399' : '1px solid var(--border-color)',
                      background: isSelected ? 'rgba(52, 211, 153, 0.15)' : 'rgba(255,255,255,0.03)',
                      color: isSelected ? '#34D399' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {amt === "0" ? "$0" : `$${amt}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SUBTITLE BLOCK (UNIFIED HEIGHT: 36px) */}
          <div style={{ minHeight: '36px', display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.72rem', color: parsedPrice > 0 ? '#93C5FD' : '#34D399', margin: 0, lineHeight: 1.35 }}>
              {parsedPrice > 0 
                ? `Voluntary contribution ($${parsedPrice}) • No paid entitlements`
                : "100% Free Forever • Zero payment required to build"
              }
            </p>
          </div>

          <ul className="pricing-features-list" style={{ fontSize: '0.8rem', marginBottom: '1.5rem', gap: '0.6rem' }}>
            <li className="included">✓ Multi-IDE Builds (6 Engines)</li>
            <li className="included">✓ 0-CVE Verified Whitelist</li>
            <li className="included">✓ Unified Vulnerability Intelligence (UVI) Sync</li>
            <li className="included">✓ CycloneDX 1.5 JSON SBOMs</li>
            <li className="included">✓ Zero Outbound Telemetry</li>
            <li className="included">✓ Marketplace Catalog Carting</li>
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
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <span>🎁</span> Contribute ${parsedPrice} & Build →
              </button>
            ) : (
              <Link 
                href="/console" 
                className="btn-primary" 
                style={{ textAlign: 'center', textDecoration: 'none', background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid var(--border-color)', fontSize: '0.82rem', padding: '0.75rem', display: 'block', width: '100%', boxSizing: 'border-box' }}
              >
                Start Building Free ($0) →
              </Link>
            )}
          </div>
        </div>

        {/* TIER 2: TEAM EDITION */}
        <div className="pricing-card" style={{ display: 'flex', flexDirection: 'column', padding: '1.75rem 1.5rem' }}>
          {/* HEADER BLOCK (UNIFIED HEIGHT: 80px) */}
          <div style={{ minHeight: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Team</h3>
              <span style={{ fontSize: '0.68rem', color: '#60A5FA', background: 'rgba(96,165,250,0.12)', padding: '0.15rem 0.45rem', borderRadius: '9999px', fontWeight: 700 }}>
                Pro Teams
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: 0, lineHeight: '1.5' }}>
              For engineering teams wanting shared blueprints & automated CI/CD.
            </p>
          </div>

          {/* PRICE BLOCK (UNIFIED HEIGHT: 75px - VERTICALLY ALIGNED) */}
          <div style={{ height: '75px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="pricing-price" style={{ fontSize: '2.2rem', margin: 0, lineHeight: 1, display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
              ${billingCycle === "annual" ? "19" : "24"} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ seat / mo</span>
            </div>
          </div>

          {/* SUBTITLE BLOCK (UNIFIED HEIGHT: 36px) */}
          <div style={{ minHeight: '36px', display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.35 }}>
              {billingCycle === "annual" ? "Billed annually ($19/mo) • Save 20%" : "Billed monthly ($24/mo) • Cancel anytime"}
            </p>
          </div>

          <ul className="pricing-features-list" style={{ fontSize: '0.8rem', marginBottom: '1.5rem', gap: '0.6rem' }}>
            <li className="included" style={{ fontWeight: 700, color: '#93C5FD' }}>✓ Everything in Community, plus:</li>
            <li className="included">✓ Curated Blueprints (20+ Stacks)</li>
            <li className="included">✓ Publish Org Blueprints</li>
            <li className="included">✓ Remote-SSH Bridges</li>
            <li className="included">✓ Hardening Policy as Code</li>
            <li className="included">✓ CI/CD Pipeline Exporters</li>
          </ul>

          <div style={{ marginTop: 'auto' }}>
            <Link href="/console" className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid var(--accent-primary)', color: '#93C5FD', fontSize: '0.82rem', padding: '0.75rem', display: 'block', width: '100%', boxSizing: 'border-box' }}>
              Start Team Trial →
            </Link>
          </div>
        </div>

        {/* TIER 3: ENTERPRISE (1-100 SEATS) */}
        <div className="pricing-card popular" style={{ display: 'flex', flexDirection: 'column', padding: '1.75rem 1.5rem' }}>
          <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-primary)', color: 'white', padding: '0.2rem 0.75rem', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em' }}>
            MOST POPULAR
          </div>

          {/* HEADER BLOCK (UNIFIED HEIGHT: 80px) */}
          <div style={{ minHeight: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Enterprise</h3>
              <span style={{ fontSize: '0.68rem', color: '#A78BFA', background: 'rgba(167,139,250,0.12)', padding: '0.15rem 0.45rem', borderRadius: '9999px', fontWeight: 700 }}>
                1–100 Seats
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: 0, lineHeight: '1.5' }}>
              Full White-Labeling, Headless build APIs, private Artifactory proxying, and policy overrides.
            </p>
          </div>

          {/* PRICE BLOCK (UNIFIED HEIGHT: 75px - VERTICALLY ALIGNED) */}
          <div style={{ height: '75px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="pricing-price" style={{ fontSize: '2.2rem', margin: 0, lineHeight: 1, display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
              ${billingCycle === "annual" ? "39" : "49"} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ seat / mo</span>
            </div>
          </div>

          {/* SUBTITLE BLOCK (UNIFIED HEIGHT: 36px) */}
          <div style={{ minHeight: '36px', display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.72rem', color: '#93C5FD', margin: 0, lineHeight: 1.35 }}>
              Self-serve for engineering teams with 1 to 100 developer seats.
            </p>
          </div>

          <ul className="pricing-features-list" style={{ fontSize: '0.8rem', marginBottom: '1.5rem', gap: '0.6rem' }}>
            <li className="included" style={{ fontWeight: 700, color: '#93C5FD' }}>✓ Everything in Team, plus:</li>
            <li className="included">✓ White-Label Brand Studio</li>
            <li className="included">✓ Headless REST Build API</li>
            <li className="included">✓ Private Artifactory Proxy</li>
            <li className="included">✓ Policy Extension Overrides</li>
            <li className="included">✓ Multi-OS Release Matrix</li>
          </ul>

          <div style={{ marginTop: 'auto' }}>
            <Link href="/console" className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none', fontSize: '0.82rem', padding: '0.75rem', display: 'block', width: '100%', boxSizing: 'border-box' }}>
              Launch Enterprise (1–100) →
            </Link>
          </div>
        </div>

        {/* TIER 4: ENTERPRISE (100+ LICENSES / CONTACT US) */}
        <div className="pricing-card" style={{ display: 'flex', flexDirection: 'column', padding: '1.75rem 1.5rem', border: '1px solid rgba(167, 139, 250, 0.4)', background: 'linear-gradient(180deg, rgba(30, 27, 75, 0.4), rgba(15, 23, 42, 0.6))' }}>
          {/* HEADER BLOCK (UNIFIED HEIGHT: 80px) */}
          <div style={{ minHeight: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <h3 style={{ fontSize: '1.25rem', margin: 0, color: '#C084FC' }}>Enterprise (100+)</h3>
              <span style={{ fontSize: '0.68rem', color: '#C084FC', background: 'rgba(192,132,252,0.15)', padding: '0.15rem 0.45rem', borderRadius: '9999px', fontWeight: 700 }}>
                100+ Licenses
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: 0, lineHeight: '1.5' }}>
              For enterprise orders of more than 100 licenses. Contact our team to discuss your organization&apos;s requirements.
            </p>
          </div>

          {/* PRICE BLOCK (UNIFIED HEIGHT: 75px - VERTICALLY ALIGNED) */}
          <div style={{ height: '75px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="pricing-price" style={{ fontSize: '1.85rem', margin: 0, lineHeight: 1, color: '#C084FC', display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
              Contact Us
            </div>
          </div>

          {/* SUBTITLE BLOCK (UNIFIED HEIGHT: 36px) */}
          <div style={{ minHeight: '36px', display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.72rem', color: '#C084FC', margin: 0, lineHeight: 1.35 }}>
              Contact our team to discuss tailored enterprise arrangements.
            </p>
          </div>

          <ul className="pricing-features-list" style={{ fontSize: '0.8rem', marginBottom: '1.5rem', gap: '0.6rem' }}>
            <li className="included" style={{ fontWeight: 700, color: '#C084FC' }}>✓ Everything in Enterprise, plus:</li>
            <li className="included">✓ Tailored Enterprise Discussion</li>
            <li className="included">✓ Dedicated Cloud Sandbox Clusters</li>
            <li className="included">✓ Custom Security & Architecture Reviews</li>
            <li className="included">✓ Hardware HSM Key Signing & Attestation</li>
            <li className="included">✓ Priority Engineering Support & SLA</li>
          </ul>

          <div style={{ marginTop: 'auto' }}>
            <a 
              href="mailto:enterprise@secureide.dev?subject=Enterprise%20Order%20(100%2B%20Licenses)%20Inquiry&body=Hello%20SecureIDE%20Team,%0D%0A%0D%0AWe%20are%20planning%20an%20enterprise%20IDE%20deployment%20for%20more%20than%20100%20licenses%20and%20would%20like%20to%20get%20in%20touch%20to%20discuss%20our%20organization%27s%20requirements.%0D%0A%0D%0AOrganization:%20%0D%0AEstimated%20Seats:%20%0D%0APrimary%20IDE%20Engines:%20"
              className="btn-primary" 
              style={{ textAlign: 'center', textDecoration: 'none', background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', color: 'white', fontSize: '0.82rem', padding: '0.75rem', display: 'block', width: '100%', boxSizing: 'border-box', border: 'none', fontWeight: 600 }}
            >
              Contact Us (100+ Orders) →
            </a>
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
                  <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Community Tier Contribution</h2>
                </div>
                
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                  Thank you for supporting open-source IDE security awareness and continuous Unified Vulnerability Intelligence (UVI) operations.
                </p>

                {/* SELECTED DONATION SUMMARY (DIRECTLY FROM MAIN CARD) */}
                <div style={{ padding: '1rem', background: 'rgba(52, 211, 153, 0.08)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>
                      One-Time Contribution
                    </span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                      <strong style={{ fontSize: '2rem', color: '#34D399', fontWeight: 800 }}>${parsedPrice}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>USD (Voluntary)</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDonationModal(false)}
                    style={{ fontSize: '0.75rem', color: '#60A5FA', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Edit on card ✎
                  </button>
                </div>

                {/* IMPORTANT DISCLOSURE BOX */}
                <div style={{ padding: '0.75rem 1rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.78rem', color: '#93C5FD', lineHeight: '1.5' }}>
                  <strong>ℹ️ Contribution Disclosure:</strong> This is a <strong>100% voluntary, one-time donation</strong> with zero recurring charges. Your Community Tier account remains free forever and this contribution does not confer Team or Enterprise paid plan entitlements.
                </div>

                <form onSubmit={handleProcessDonation}>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ flex: 1, padding: '0.85rem', fontSize: '0.92rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                    >
                      <span>❤️</span> Confirm & Complete Donation (${parsedPrice})
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDonationModal(false)}
                      style={{ padding: '0.85rem 1.25rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
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
                  Your one-time donation of <strong style={{ color: '#34D399' }}>${parsedPrice}</strong> directly funds our independent supply-chain vulnerability research and public Unified Vulnerability Intelligence (UVI) ingestion.
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
              Can we customize branding, extensions, and policies across our organization?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>
              Yes. Team and Enterprise tiers allow you to publish organization-wide blueprints, custom themes, strict extension whitelists, and deterministic governance policies across all developer workstations.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.05rem', color: '#93C5FD', marginBottom: '0.4rem' }}>
              Can we run SecureIDE completely air-gapped on-premises?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>
              Yes. Enterprise deployments support headless CLI orchestrators, private Artifactory/OpenVSX proxy mirrors, and dedicated key attestation with zero external internet dependencies.
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
            Ready to configure and harden your team&apos;s development environment?
          </p>
          <Link 
            href="/console"
            className="btn-primary" 
            style={{ padding: '0.75rem 1.75rem', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-block' }}
          >
            Launch Builder Console →
          </Link>
        </div>
      </div>

    </div>
  );
}
