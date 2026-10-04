"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PureOsIcon, ExultiaLogo } from "@/components/BrandIcons";
import { CheckCircle, Info } from "lucide-react";

export default function PureOSPricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="fade-in" style={{ paddingBottom: "5rem" }}>
      <section style={{ textAlign: "center", padding: "4rem 1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <PureOsIcon size={48} glow={true} />
        </div>
        <h1 style={{ fontSize: "2.8rem", marginBottom: "1rem" }}>PureOS Container Licensing</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto 2rem auto" }}>
          Secure your infrastructure with pre-hardened, zero-trust container images.
        </p>
        
        <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.05)", padding: "4px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
          <button 
            className={`tab-btn ${!isAnnual ? "active" : ""}`} 
            onClick={() => setIsAnnual(false)}
            style={{ padding: "8px 24px", borderRadius: "8px", border: "none", background: !isAnnual ? "rgba(245, 158, 11, 0.2)" : "transparent", color: !isAnnual ? "#FBBF24" : "var(--text-muted)", cursor: "pointer", fontWeight: 600 }}
          >
            Monthly
          </button>
          <button 
            className={`tab-btn ${isAnnual ? "active" : ""}`} 
            onClick={() => setIsAnnual(true)}
            style={{ padding: "8px 24px", borderRadius: "8px", border: "none", background: isAnnual ? "rgba(245, 158, 11, 0.2)" : "transparent", color: isAnnual ? "#FBBF24" : "var(--text-muted)", cursor: "pointer", fontWeight: 600 }}
          >
            Annually <span style={{ fontSize: "0.75rem", color: "#FCD34D", marginLeft: "4px" }}>Save 20%</span>
          </button>
        </div>
      </section>

      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
        
        {/* OPEN SOURCE TIER */}
        <div className="glass-card" style={{ padding: "2.5rem", borderRadius: "24px", display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Community Base</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "1.5rem", minHeight: "45px" }}>
            Essential CIS Level 1 hardening for independent developers.
          </p>
          <div style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "2rem" }}>
            Free
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2.5rem 0", flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
            <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", color: "#E2E8F0" }}>
              <CheckCircle size={18} color="#F59E0B" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>Access to Alpine & Debian base images</span>
            </li>
            <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", color: "#E2E8F0" }}>
              <CheckCircle size={18} color="#F59E0B" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>CIS Level 1 Baseline Configuration</span>
            </li>
            <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", color: "#E2E8F0" }}>
              <CheckCircle size={18} color="#F59E0B" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>Monthly Vantage Sync Updates</span>
            </li>
          </ul>
          <Link href="/app/pureos" className="btn-secondary" style={{ width: "100%", padding: "1rem", textAlign: "center", textDecoration: "none", borderRadius: "12px", fontWeight: 600 }}>
            Browse Free Catalogue
          </Link>
        </div>

        {/* PRO TIER */}
        <div className="glass-card" style={{ padding: "2.5rem", borderRadius: "24px", display: "flex", flexDirection: "column", border: "1px solid rgba(245, 158, 11, 0.4)", background: "rgba(245, 158, 11, 0.05)", position: "relative" }}>
          <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)", color: "white", padding: "4px 16px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.05em" }}>
            MOST POPULAR
          </div>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "#FBBF24" }}>PureOS Pro</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "1.5rem", minHeight: "45px" }}>
            Advanced hardening and real-time threat sync for production.
          </p>
          <div style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "2rem" }}>
            ${isAnnual ? "39" : "49"}
            <span style={{ fontSize: "1rem", color: "var(--text-muted)", fontWeight: 400 }}>/mo</span>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2.5rem 0", flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
            <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", color: "#E2E8F0" }}>
              <CheckCircle size={18} color="#F59E0B" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span><strong>Single Developer License (1 User Seat)</strong></span>
            </li>
            <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", color: "#E2E8F0" }}>
              <CheckCircle size={18} color="#F59E0B" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span><strong>All Base OS & Language Runtimes</strong></span>
            </li>
            <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", color: "#E2E8F0" }}>
              <CheckCircle size={18} color="#F59E0B" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>CIS Level 2 Strict Configuration</span>
            </li>
            <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", color: "#E2E8F0" }}>
              <CheckCircle size={18} color="#F59E0B" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>Daily Vantage Sync Updates (Zero-Day Patching)</span>
            </li>
            <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", color: "#E2E8F0" }}>
              <CheckCircle size={18} color="#F59E0B" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>Distroless Builds (No Package Managers)</span>
            </li>
          </ul>
          <Link href="/account/subscription?product=pureos" className="btn-primary" style={{ width: "100%", padding: "1rem", borderRadius: "12px", fontSize: "1rem", fontWeight: 700, background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)", textDecoration: "none", textAlign: "center", display: "block", color: "white", boxSizing: "border-box" }}>
            Subscribe to Pro ($49/mo) →
          </Link>
        </div>

        {/* ENTERPRISE TIER */}
        <div className="glass-card" style={{ padding: "2.5rem", borderRadius: "24px", display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Enterprise Hub</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "1.5rem", minHeight: "45px" }}>
            Custom golden images, private registry integration, and volume organization entitlements.
          </p>
          <div style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "2rem" }}>
            ${isAnnual ? "119" : "149"}
            <span style={{ fontSize: "1rem", color: "var(--text-muted)", fontWeight: 400 }}>/mo</span>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2.5rem 0", flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
            <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", color: "#E2E8F0" }}>
              <CheckCircle size={18} color="#F59E0B" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span><strong>Volume Organization Entitlements (Multi-Seat Builders)</strong></span>
            </li>
            <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", color: "#E2E8F0" }}>
              <CheckCircle size={18} color="#F59E0B" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>Private Registry Proxy (ACR/ECR/GCR)</span>
            </li>
            <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", color: "#E2E8F0" }}>
              <CheckCircle size={18} color="#F59E0B" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>Custom Golden Image Builder</span>
            </li>
            <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", color: "#E2E8F0" }}>
              <CheckCircle size={18} color="#F59E0B" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>SLA for Zero-Day Mitigations</span>
            </li>
            <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", color: "#E2E8F0" }}>
              <CheckCircle size={18} color="#F59E0B" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>Dedicated Support Channel</span>
            </li>
          </ul>
          <Link href="/account/subscription?product=pureos" className="btn-secondary" style={{ width: "100%", padding: "1rem", borderRadius: "12px", fontSize: "1rem", fontWeight: 700, textDecoration: "none", textAlign: "center", display: "block", color: "white", boxSizing: "border-box" }}>
            Subscribe to Enterprise ($149/mo) →
          </Link>
        </div>
      </section>
    </div>
  );
}
