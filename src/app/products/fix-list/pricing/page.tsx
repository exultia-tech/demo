'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PraxisIcon } from '@/components/BrandIcons';

export default function PraxisPricingPage() {
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
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2.5rem 3rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '4rem' }}>
        <PraxisIcon size={64} className="mb-4" />
        <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
          Enterprise Licensing for Praxis
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '800px', lineHeight: 1.6 }}>
          Scale automated remediation across your entire global infrastructure with our dedicated fleet deployments, white-glove SIEM integrations, and SLA-backed support.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Community Tier */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '2.5rem', border: parsedPrice > 0 ? '1px solid rgba(52, 211, 153, 0.4)' : undefined }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#34D399', marginBottom: '0.5rem' }}>Community</h3>
          
          {/* PRICE BLOCK (Interactive PWYW) */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: '1.5rem' }}>
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
            <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
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
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', flex: 1 }}>
            Essential remediation for independent researchers and open-source maintainers on a Pay-What-You-Want basis.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#10B981' }}>✓</span> Standard manual script generations</li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#10B981' }}>✓</span> REST API Access (50 requests/mo)</li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#10B981' }}>✓</span> Basic localhost network mode</li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', opacity: 0.5 }}><span style={{ color: 'var(--border-color)' }}>—</span> No Custom Export Formats</li>
          </ul>
          
          <div style={{ marginTop: 'auto' }}>
            {parsedPrice > 0 ? (
              <button
                type="button"
                onClick={() => handleOpenDonation(parsedPrice)}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  background: 'rgba(16, 185, 129, 0.1)', 
                  color: '#34D399', 
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>🎁</span> Contribute ${parsedPrice} & Generate →
              </button>
            ) : (
              <Link 
                href="/account/subscription?product=fixlist" 
                style={{
                  display: 'block', textAlign: 'center', padding: '1rem', borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-main)', fontWeight: 600, border: '1px solid rgba(255, 255, 255, 0.1)',
                  textDecoration: 'none', transition: 'all 0.2s ease', boxSizing: 'border-box'
                }}
              >
                Get Started for Free ($0) →
              </Link>
            )}
          </div>
        </div>

        {/* Pro Tier */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '2.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#34D399', marginBottom: '0.5rem' }}>Pro</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>$49<span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}> / month</span></div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', flex: 1 }}>
            Ideal for mid-sized organizations needing API access to Vantage and automated script generation.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#10B981' }}>✓</span> Unlimited manual script generations</li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#10B981' }}>✓</span> REST API Access (10,000 requests/mo)</li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#10B981' }}>✓</span> 3 Custom Export Formats</li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#10B981' }}>✓</span> Email Support</li>
          </ul>
          <Link href="/account/subscription?product=fixlist" style={{
            display: 'block', textAlign: 'center', padding: '1rem', borderRadius: '8px',
            background: 'rgba(16, 185, 129, 0.1)', color: '#34D399', fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.3)',
            textDecoration: 'none', transition: 'all 0.2s ease'
          }}>Subscribe to Pro ($49/mo) →</Link>
        </div>

        {/* Enterprise Tier */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '2.5rem', borderColor: 'rgba(16, 185, 129, 0.5)', background: 'rgba(16, 185, 129, 0.03)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #10B981, #059669)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Most Popular</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#34D399', marginBottom: '0.5rem' }}>Enterprise</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>$149<span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}> / month</span></div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', flex: 1 }}>
            Full fleet deployment, custom SIEM integrations, and white-glove onboarding for large enterprises.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#10B981' }}>✓</span> Unlimited API Access</li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#10B981' }}>✓</span> All Firewall Export Formats</li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#10B981' }}>✓</span> Dedicated CSM & Onboarding</li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#10B981' }}>✓</span> 99.99% Uptime SLA</li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#10B981' }}>✓</span> Air-gapped deployment options</li>
          </ul>
          <Link href="/account/subscription?product=fixlist" style={{
            display: 'block', textAlign: 'center', padding: '1rem', borderRadius: '8px',
            background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white', fontWeight: 700,
            textDecoration: 'none', transition: 'all 0.2s ease', border: 'none', boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
          }}>Subscribe to Enterprise ($149/mo) →</Link>
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
                  Thank you for supporting Praxis and the maintenance of Vantage.
                </p>

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

                <div style={{ padding: '0.75rem 1rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.78rem', color: '#93C5FD', lineHeight: '1.5' }}>
                  <strong>ℹ️ Contribution Disclosure:</strong> This is a <strong>100% voluntary, one-time donation</strong> with zero recurring charges. Your Community Tier account remains free forever.
                </div>

                <form onSubmit={handleProcessDonation}>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ flex: 1, padding: '0.85rem', fontSize: '0.92rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: 'none', borderRadius: '8px', background: '#34D399', color: '#000', fontWeight: 600 }}
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
                  Your one-time donation of <strong style={{ color: '#34D399' }}>${parsedPrice}</strong> directly funds our independent supply-chain vulnerability research.
                </p>
                <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-color)', fontFamily: 'monospace', fontSize: '0.8rem', color: '#93C5FD', marginBottom: '1.5rem' }}>
                  Receipt Reference: {donationReceiptId} • (Non-recurring)
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Link
                    href="/app/fixlist"
                    onClick={() => setShowDonationModal(false)}
                    className="btn-primary"
                    style={{ flex: 1, padding: '0.75rem', textAlign: 'center', textDecoration: 'none', fontSize: '0.9rem', border: 'none', borderRadius: '8px', background: '#34D399', color: '#000', fontWeight: 600 }}
                  >
                    Open Client Generator →
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

    </div>
  );
}
