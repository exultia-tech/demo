"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { 
  ShieldCheck, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Zap, 
  Lock, 
  HelpCircle,
  CreditCard,
  Building2,
  Cpu,
  CheckCircle2,
  Users,
  RotateCcw,
  Terminal,
  Layers,
  Globe,
  Shield,
  Activity,
  FileCode2,
  Crosshair,
  Server
} from "lucide-react";
import { 
  PureIdeIcon, 
  VantageIcon, 
  PraxisIcon, 
  PureOsIcon, 
  AxiomIcon,
  ErisIcon,
  ValkyrieIcon,
  ExultiaLogo
} from "@/components/BrandIcons";
import PaymentModal from "@/components/billing/PaymentModal";
import { EXULTIA_PLATFORM_TIERS, PlatformPricingTier, PlatformTierId } from "@/lib/bundle-pricing";

function SubscriptionContent() {
  const searchParams = useSearchParams();
  const { user, openPaymentModal, getUserTier, refreshUser } = useAuth();
  
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [isSwitchingFree, setIsSwitchingFree] = useState(false);

  // Compute current overarching platform tier
  const currentPlatformTier: PlatformTierId = (() => {
    if (!user) return "community";
    const directPlatformTier = getUserTier("platform");
    if (directPlatformTier === "enterprise") return "enterprise";
    if (directPlatformTier === "pro") return "pro";
    
    const multiTier = getUserTier("multipass");
    if (multiTier === "enterprise") return "enterprise";
    if (multiTier === "pro") return "pro";

    const engines = ["pureide", "uvi", "praxis", "pureos", "axiom", "eris", "valkyrie"];
    const engineTiers = engines.map(e => getUserTier(e));
    if (engineTiers.includes("enterprise")) return "enterprise";
    if (engineTiers.includes("pro") || engineTiers.includes("legal")) return "pro";
    return "community";
  })();

  const handleSelectTier = async (tier: PlatformTierId, planName: string) => {
    if (tier === currentPlatformTier) return;

    if (tier === "community") {
      setIsSwitchingFree(true);
      try {
        const res = await fetch("/api/user/subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product: "platform", tier: "free", billingCycle }),
        });
        if (res.ok) {
          await refreshUser();
        }
      } catch (e) {
        console.error("Community plan activation error:", e);
      } finally {
        setIsSwitchingFree(false);
      }
      return;
    }

    const tierConfig = EXULTIA_PLATFORM_TIERS.find(t => t.id === tier);
    if (!tierConfig) return;

    const price = billingCycle === "annual" ? tierConfig.priceAnnual : tierConfig.priceMonthly;

    openPaymentModal({
      product: "platform",
      tier: tier,
      price,
      billingCycle,
      planName: `Exultia Platform - ${tierConfig.name}`,
    });
  };

  const enginesList = [
    { id: "vantage", name: "Vantage", category: "Threat Intelligence", desc: "110+ global registries & early zero-day feeds", icon: VantageIcon, color: "#8B5CF6" },
    { id: "praxis", name: "Praxis", category: "Autonomous Remediation", desc: "Sub-second hotpatching & hardware firewall ACLs", icon: PraxisIcon, color: "#F59E0B" },
    { id: "eris", name: "Eris", category: "Adversary Emulation", desc: "Intentional vulnerability labs & Docker attack ranges", icon: ErisIcon, color: "#EF4444" },
    { id: "valkyrie", name: "Valkyrie", category: "On-Demand Pentest", desc: "Non-destructive BAS probes & SHA-256 attestations", icon: ValkyrieIcon, color: "#06B6D4" },
    { id: "pureide", name: "PureIDE", category: "Hermetic Compiler", desc: "Zero-telemetry developer environment & egress gate", icon: PureIdeIcon, color: "#3B82F6" },
    { id: "pureos", name: "PureOS", category: "Hardened OCI", desc: "CIS-benchmarked base container images & SBOMs", icon: PureOsIcon, color: "#10B981" },
    { id: "axiom", name: "Axiom", category: "LMS Exam Simulator", desc: "Security certification simulator & SCORM/LTI API", icon: AxiomIcon, color: "#F43F5E" },
  ];

  return (
    <div style={{ minHeight: "90vh", padding: "3rem 1.5rem", maxWidth: "1280px", margin: "0 auto" }}>
      
      {/* HERO SECTION */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div style={{ 
          display: "inline-flex", 
          alignItems: "center", 
          gap: "8px", 
          background: "linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(139, 92, 246, 0.12))", 
          border: "1px solid rgba(6, 182, 212, 0.35)", 
          padding: "5px 14px", 
          borderRadius: "999px", 
          marginBottom: "1rem",
          boxShadow: "0 0 20px rgba(6, 182, 212, 0.15)"
        }}>
          <Sparkles size={14} color="#67E8F9" />
          <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#A5F3FC", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Unified Platform Pricing
          </span>
        </div>

        <h1 style={{ 
          fontSize: "clamp(2.2rem, 3.8vw, 3.2rem)", 
          fontWeight: 900, 
          color: "#FFFFFF", 
          letterSpacing: "-0.03em", 
          marginBottom: "0.75rem",
          lineHeight: 1.15
        }}>
          One Platform.
          <span style={{ 
            display: "block", 
            background: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 50%, #8B5CF6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            All Seven Engines.
          </span>
        </h1>

        <p style={{ color: "#94A3B8", fontSize: "1.05rem", maxWidth: "580px", margin: "0 auto", lineHeight: 1.5 }}>
          Full access to the sovereign defense ecosystem. Zero add-ons, no hidden fees.
        </p>

        {/* CURRENT TIER BADGE */}
        {user && (
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "1.75rem",
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "12px",
            padding: "8px 18px",
            fontSize: "0.88rem"
          }}>
            <span style={{ color: "#94A3B8" }}>Your Current Platform Status:</span>
            <span style={{ 
              fontWeight: 800, 
              color: currentPlatformTier === "enterprise" ? "#F59E0B" : currentPlatformTier === "pro" ? "#38BDF8" : "#10B981",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              <CheckCircle2 size={16} />
              {currentPlatformTier === "enterprise" ? "Enterprise Fleet" : currentPlatformTier === "pro" ? "Professional Operator" : "Community Sovereign (Free Forever)"}
            </span>
          </div>
        )}

        {/* BILLING TOGGLE */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginTop: "2.25rem" }}>
          <button
            onClick={() => setBillingCycle("monthly")}
            style={{
              background: billingCycle === "monthly" ? "rgba(255, 255, 255, 0.12)" : "transparent",
              color: billingCycle === "monthly" ? "#FFFFFF" : "#64748B",
              border: billingCycle === "monthly" ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid transparent",
              padding: "8px 20px",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            Monthly Billing
          </button>
          
          <button
            onClick={() => setBillingCycle("annual")}
            style={{
              background: billingCycle === "annual" ? "linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2))" : "transparent",
              color: billingCycle === "annual" ? "#FFFFFF" : "#64748B",
              border: billingCycle === "annual" ? "1px solid rgba(6, 182, 212, 0.5)" : "1px solid transparent",
              padding: "8px 20px",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <span>Annual Billing</span>
            <span style={{
              background: "linear-gradient(135deg, #10B981, #059669)",
              color: "#FFFFFF",
              fontSize: "0.72rem",
              padding: "2px 8px",
              borderRadius: "999px",
              fontWeight: 800,
              letterSpacing: "0.04em",
              textTransform: "uppercase"
            }}>
              Save up to 25% (2 Months Free)
            </span>
          </button>
        </div>
      </div>

      {/* 3-TIER PRICING GRID */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", 
        gap: "2rem",
        marginBottom: "4.5rem",
        alignItems: "stretch"
      }}>
        {EXULTIA_PLATFORM_TIERS.map((tier) => {
          const isCurrent = currentPlatformTier === tier.id;
          const displayPrice = billingCycle === "annual" ? tier.priceAnnual : tier.priceMonthly;
          const isPro = tier.id === "pro";
          const isEnterprise = tier.id === "enterprise";

          return (
            <div 
              key={tier.id}
              style={{
                position: "relative",
                background: isPro 
                  ? "linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 30, 0.98) 100%)" 
                  : "rgba(10, 15, 26, 0.85)",
                backdropFilter: "blur(16px)",
                border: isPro 
                  ? "2px solid #06B6D4" 
                  : isEnterprise
                  ? "1px solid rgba(139, 92, 246, 0.35)"
                  : "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "20px",
                padding: "2.25rem 2rem",
                display: "flex",
                flexDirection: "column",
                boxShadow: isPro 
                  ? "0 25px 50px -12px rgba(6, 182, 212, 0.25), 0 0 30px rgba(6, 182, 212, 0.15)" 
                  : "0 10px 30px rgba(0, 0, 0, 0.5)",
                transform: isPro ? "scale(1.02)" : "none",
                transition: "transform 0.2s ease, border-color 0.2s ease"
              }}
            >
              {/* BADGE */}
              {tier.badge && (
                <div style={{
                  position: "absolute",
                  top: "-13px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: isPro 
                    ? "linear-gradient(135deg, #06B6D4, #3B82F6)" 
                    : "linear-gradient(135deg, #8B5CF6, #6366F1)",
                  color: "#FFFFFF",
                  fontSize: "0.72rem",
                  fontWeight: 900,
                  letterSpacing: "0.1em",
                  padding: "4px 16px",
                  borderRadius: "999px",
                  textTransform: "uppercase",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
                  whiteSpace: "nowrap"
                }}>
                  {tier.badge}
                </div>
              )}

              {/* TIER TITLE & TAGLINE */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#FFFFFF", marginBottom: "0.35rem" }}>
                  {tier.name}
                </h3>
                <p style={{ color: "#94A3B8", fontSize: "0.88rem", minHeight: "40px", lineHeight: 1.45 }}>
                  {tier.tagline}
                </p>
              </div>

              {/* PRICE */}
              <div style={{ marginBottom: "1.75rem", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                  <span style={{ fontSize: "3rem", fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.03em" }}>
                    ${displayPrice}
                  </span>
                  <span style={{ color: "#64748B", fontSize: "1rem", fontWeight: 600 }}>
                    / month
                  </span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "#64748B", marginTop: "4px" }}>
                  {tier.priceMonthly === 0 ? (
                    <span style={{ color: "#10B981", fontWeight: 700 }}>Free forever • Zero credit card required</span>
                  ) : billingCycle === "annual" ? (
                    <span>Billed annually (${tier.annualBilledTotal}/yr)</span>
                  ) : (
                    <span>Billed monthly • Cancel anytime</span>
                  )}
                </div>
              </div>

              {/* CTA BUTTON */}
              <button
                disabled={isCurrent || isSwitchingFree}
                onClick={() => handleSelectTier(tier.id, tier.name)}
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  borderRadius: "12px",
                  fontWeight: 800,
                  fontSize: "1rem",
                  cursor: isCurrent ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginBottom: "2rem",
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  border: isCurrent 
                    ? "1px solid rgba(255, 255, 255, 0.15)" 
                    : isPro 
                    ? "none" 
                    : "1px solid rgba(255, 255, 255, 0.2)",
                  background: isCurrent 
                    ? "rgba(255, 255, 255, 0.06)" 
                    : isPro 
                    ? "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)" 
                    : "rgba(255, 255, 255, 0.1)",
                  color: isCurrent ? "#94A3B8" : "#FFFFFF",
                  boxShadow: !isCurrent && isPro ? "0 4px 20px rgba(6, 182, 212, 0.4)" : "none"
                }}
              >
                {isCurrent ? (
                  <>
                    <CheckCircle2 size={18} color="#10B981" />
                    <span>Current Active Plan</span>
                  </>
                ) : (
                  <>
                    <span>{tier.ctaLabel}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              {/* ALL 7 ENGINES UNLOCK SUMMARY */}
              <div style={{ marginBottom: "1.75rem" }}>
                <div style={{ 
                  fontSize: "0.74rem", 
                  fontWeight: 800, 
                  color: "#94A3B8", 
                  textTransform: "uppercase", 
                  letterSpacing: "0.08em",
                  marginBottom: "0.85rem" 
                }}>
                  Included Platform Engines
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {enginesList.map(eng => {
                    const Icon = eng.icon;
                    return (
                      <span 
                        key={eng.id}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          background: "rgba(255, 255, 255, 0.04)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          borderRadius: "6px",
                          padding: "3px 8px",
                          fontSize: "0.75rem",
                          color: "#E2E8F0"
                        }}
                      >
                        <Icon size={12} />
                        <span>{eng.name}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* CORE HIGHLIGHTS */}
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: "0.74rem", 
                  fontWeight: 800, 
                  color: "#94A3B8", 
                  textTransform: "uppercase", 
                  letterSpacing: "0.08em",
                  marginBottom: "0.85rem" 
                }}>
                  Key Capabilities
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {tier.highlights.map((h, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.88rem", color: "#CBD5E1", lineHeight: 1.45 }}>
                      <Check size={16} color={isPro ? "#06B6D4" : isEnterprise ? "#A78BFA" : "#10B981"} style={{ flexShrink: 0, marginTop: "3px" }} />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* CLOSED-LOOP SOVEREIGNTY ARCHITECTURE VISUALIZATION */}
      <div style={{
        background: "rgba(10, 15, 26, 0.9)",
        border: "1px solid rgba(6, 182, 212, 0.25)",
        borderRadius: "20px",
        padding: "3rem 2rem",
        marginBottom: "4.5rem",
        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.6)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "8px", 
            color: "#67E8F9", 
            fontSize: "0.8rem", 
            fontWeight: 800, 
            letterSpacing: "0.1em", 
            textTransform: "uppercase", 
            marginBottom: "0.5rem" 
          }}>
            <RotateCcw size={16} />
            The Closed-Loop Ecosystem
          </div>
          <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
            How the 7 Engines Work in Concert
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "1rem", maxWidth: "680px", margin: "0.5rem auto 0" }}>
            Unlike standalone point tools, Exultia links threat intelligence directly to adversary simulation, proof probes, autonomous hotpatching, and attestation.
          </p>
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
          gap: "1.25rem" 
        }}>
          {/* Step 1 */}
          <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(139, 92, 246, 0.25)", borderRadius: "14px", padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.75rem" }}>
              <VantageIcon size={24} />
              <div>
                <span style={{ fontSize: "0.7rem", color: "#C084FC", fontWeight: 800, textTransform: "uppercase" }}>Stage 1 • Ingestion</span>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>Vantage Intel</h4>
              </div>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#94A3B8", lineHeight: 1.5, margin: 0 }}>
              Ingests 110+ threat feeds, CISA KEV, and early-warning zero-days with CVSS scoring and affected package telemetry.
            </p>
          </div>

          {/* Step 2 */}
          <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(239, 68, 68, 0.25)", borderRadius: "14px", padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.75rem" }}>
              <ErisIcon size={24} glow={false} />
              <div>
                <span style={{ fontSize: "0.7rem", color: "#F87171", fontWeight: 800, textTransform: "uppercase" }}>Stage 2 • Emulation</span>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>Eris Chaos Lab</h4>
              </div>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#94A3B8", lineHeight: 1.5, margin: 0 }}>
              Replicates the exact CVE vulnerability in an isolated, timed test container sandbox with automatic watchdog rollback timers.
            </p>
          </div>

          {/* Step 3 */}
          <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(6, 182, 212, 0.25)", borderRadius: "14px", padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.75rem" }}>
              <ValkyrieIcon size={24} glow={false} />
              <div>
                <span style={{ fontSize: "0.7rem", color: "#67E8F9", fontWeight: 800, textTransform: "uppercase" }}>Stage 3 • Verification</span>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>Valkyrie BAS</h4>
              </div>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#94A3B8", lineHeight: 1.5, margin: 0 }}>
              Executes safe, non-destructive network probes against your cluster or target endpoint to prove actual exploitability.
            </p>
          </div>

          {/* Step 4 */}
          <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(245, 158, 11, 0.25)", borderRadius: "14px", padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.75rem" }}>
              <PraxisIcon size={24} />
              <div>
                <span style={{ fontSize: "0.7rem", color: "#FDE68A", fontWeight: 800, textTransform: "uppercase" }}>Stage 4 • Hotpatch</span>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>Praxis Remediation</h4>
              </div>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#94A3B8", lineHeight: 1.5, margin: 0 }}>
              Synthesizes zero-downtime hotfixes, Ansible plays, and hardware ACLs with mandatory sub-second deterministic rollbacks.
            </p>
          </div>

          {/* Step 5 */}
          <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(59, 130, 246, 0.25)", borderRadius: "14px", padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.75rem" }}>
              <PureIdeIcon size={24} glow={false} />
              <div>
                <span style={{ fontSize: "0.7rem", color: "#93C5FD", fontWeight: 800, textTransform: "uppercase" }}>Stage 5 • Hardened Build</span>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>PureIDE & PureOS</h4>
              </div>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#94A3B8", lineHeight: 1.5, margin: 0 }}>
              Hermetic compilation, airgapped binary cosigning, CIS-benchmarked containers, and automated CycloneDX SBOMs.
            </p>
          </div>

          {/* Step 6 */}
          <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(244, 63, 94, 0.25)", borderRadius: "14px", padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.75rem" }}>
              <AxiomIcon size={24} />
              <div>
                <span style={{ fontSize: "0.7rem", color: "#FDA4AF", fontWeight: 800, textTransform: "uppercase" }}>Stage 6 • Skill Attestation</span>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>Axiom Platform</h4>
              </div>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#94A3B8", lineHeight: 1.5, margin: 0 }}>
              Hands-on exam simulations and SCORM/LTI API integration for continuous operator certification and training.
            </p>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE ENGINE COMPARISON TABLE */}
      <div style={{ marginBottom: "4.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
            Platform Engine Capability Matrix
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "1rem" }}>
            Compare full capabilities across Community, Professional, and Enterprise tiers.
          </p>
        </div>

        <div style={{ 
          background: "rgba(10, 15, 26, 0.85)", 
          border: "1px solid rgba(255, 255, 255, 0.1)", 
          borderRadius: "16px", 
          overflow: "hidden" 
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ background: "rgba(255, 255, 255, 0.04)", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                <th style={{ padding: "1.25rem 1.5rem", color: "#E2E8F0", fontWeight: 800, width: "35%" }}>Engine & Feature</th>
                <th style={{ padding: "1.25rem 1.5rem", color: "#94A3B8", fontWeight: 800, width: "20%" }}>Community ($0)</th>
                <th style={{ padding: "1.25rem 1.5rem", color: "#38BDF8", fontWeight: 800, width: "22%" }}>Professional ($59/mo)</th>
                <th style={{ padding: "1.25rem 1.5rem", color: "#A78BFA", fontWeight: 800, width: "23%" }}>Enterprise ($399/mo)</th>
              </tr>
            </thead>
            <tbody>
              {/* Vantage */}
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <td style={{ padding: "1.1rem 1.5rem", color: "#FFFFFF", fontWeight: 700 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <VantageIcon size={16} />
                    <span>Vantage Threat Feed</span>
                  </div>
                </td>
                <td style={{ padding: "1.1rem 1.5rem", color: "#94A3B8" }}>Web portal & CISA KEV</td>
                <td style={{ padding: "1.1rem 1.5rem", color: "#E2E8F0" }}>Real-time stream & 300 req/m API</td>
                <td style={{ padding: "1.1rem 1.5rem", color: "#E2E8F0" }}>Commercial feed & SIEM webhooks</td>
              </tr>

              {/* Praxis */}
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <td style={{ padding: "1.1rem 1.5rem", color: "#FFFFFF", fontWeight: 700 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <PraxisIcon size={16} />
                    <span>Praxis Hotpatching & Rollbacks</span>
                  </div>
                </td>
                <td style={{ padding: "1.1rem 1.5rem", color: "#94A3B8" }}>Manual recipes & local inspection</td>
                <td style={{ padding: "1.1rem 1.5rem", color: "#E2E8F0" }}>Autonomous stream & sub-sec rollbacks</td>
                <td style={{ padding: "1.1rem 1.5rem", color: "#E2E8F0" }}>Multi-ring fleet & SLSA L3 cosign</td>
              </tr>

              {/* Eris */}
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <td style={{ padding: "1.1rem 1.5rem", color: "#FFFFFF", fontWeight: 700 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <ErisIcon size={16} glow={false} />
                    <span>Eris Adversary Emulation</span>
                  </div>
                </td>
                <td style={{ padding: "1.1rem 1.5rem", color: "#94A3B8" }}>5 core chaos modules</td>
                <td style={{ padding: "1.1rem 1.5rem", color: "#E2E8F0" }}>Full 7+ CVE catalog & 5-container range</td>
                <td style={{ padding: "1.1rem 1.5rem", color: "#E2E8F0" }}>Multi-node fleet chaos & 0-day studio</td>
              </tr>

              {/* Valkyrie */}
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <td style={{ padding: "1.1rem 1.5rem", color: "#FFFFFF", fontWeight: 700 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <ValkyrieIcon size={16} glow={false} />
                    <span>Valkyrie Pentest & Attestation</span>
                  </div>
                </td>
                <td style={{ padding: "1.1rem 1.5rem", color: "#94A3B8" }}>5 non-destructive canary probes</td>
                <td style={{ padding: "1.1rem 1.5rem", color: "#E2E8F0" }}>Full 10+ CVE probes & HMAC tokens</td>
                <td style={{ padding: "1.1rem 1.5rem", color: "#E2E8F0" }}>Continuous CI/CD & executive reports</td>
              </tr>

              {/* PureIDE */}
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <td style={{ padding: "1.1rem 1.5rem", color: "#FFFFFF", fontWeight: 700 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <PureIdeIcon size={16} glow={false} />
                    <span>PureIDE Workstation Compiler</span>
                  </div>
                </td>
                <td style={{ padding: "1.1rem 1.5rem", color: "#94A3B8" }}>Single developer local sandbox</td>
                <td style={{ padding: "1.1rem 1.5rem", color: "#E2E8F0" }}>Cloud build runners & egress firewall</td>
                <td style={{ padding: "1.1rem 1.5rem", color: "#E2E8F0" }}>Airgap cosign & enterprise blueprints</td>
              </tr>

              {/* PureOS */}
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <td style={{ padding: "1.1rem 1.5rem", color: "#FFFFFF", fontWeight: 700 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <PureOsIcon size={16} glow={false} />
                    <span>PureOS Hardened Containers</span>
                  </div>
                </td>
                <td style={{ padding: "1.1rem 1.5rem", color: "#94A3B8" }}>Standard CIS baseline images</td>
                <td style={{ padding: "1.1rem 1.5rem", color: "#E2E8F0" }}>Zero-trust images & CycloneDX SBOMs</td>
                <td style={{ padding: "1.1rem 1.5rem", color: "#E2E8F0" }}>Cryptographic airgap provenance</td>
              </tr>

              {/* Axiom */}
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <td style={{ padding: "1.1rem 1.5rem", color: "#FFFFFF", fontWeight: 700 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <AxiomIcon size={16} />
                    <span>Axiom LMS Exam Simulator</span>
                  </div>
                </td>
                <td style={{ padding: "1.1rem 1.5rem", color: "#94A3B8" }}>Full question practice banks</td>
                <td style={{ padding: "1.1rem 1.5rem", color: "#E2E8F0" }}>SHA-256 certs & transcript exports</td>
                <td style={{ padding: "1.1rem 1.5rem", color: "#E2E8F0" }}>SCORM/LTI API & institutional LMS sync</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      <PaymentModal />
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8" }}>Loading Platform Subscription Console...</div>}>
      <SubscriptionContent />
    </Suspense>
  );
}
