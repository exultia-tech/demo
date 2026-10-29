"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { 
  ShieldCheck, 
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
  Terminal,
  Layers,
  Shield,
  FileCode2,
  Sparkles,
  FileText
} from "lucide-react";
import PaymentModal from "@/components/billing/PaymentModal";
import MsaPreviewModal from "@/components/billing/MsaPreviewModal";
import { 
  EXULTIA_PLATFORM_TIERS, 
  PlatformPricingTier, 
  PlatformTierId,
  calculateEnterpriseFleetPrice 
} from "@/lib/bundle-pricing";

function SubscriptionContent() {
  const searchParams = useSearchParams();
  const { user, openPaymentModal, getUserTier, refreshUser } = useAuth();
  
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [isSwitchingFree, setIsSwitchingFree] = useState(false);
  const [nodeCount, setNodeCount] = useState<number>(25);
  const [isMsaModalOpen, setIsMsaModalOpen] = useState(false);

  // Compute current overarching platform tier
  const currentPlatformTier: PlatformTierId = (() => {
    if (!user) return "community";
    const directPlatformTier = getUserTier("platform");
    if (directPlatformTier === "enterprise") return "enterprise";
    if (directPlatformTier === "pro") return "enterprise";
    
    const multiTier = getUserTier("multipass");
    if (multiTier === "enterprise") return "enterprise";
    if (multiTier === "pro") return "enterprise";

    const engines = ["pureide", "uvi", "praxis", "pureos", "axiom", "eris", "valkyrie"];
    const engineTiers = engines.map(e => getUserTier(e));
    if (engineTiers.includes("enterprise")) return "enterprise";
    if (engineTiers.includes("pro") || engineTiers.includes("legal")) return "enterprise";
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

    const fleetCalc = calculateEnterpriseFleetPrice(nodeCount, billingCycle);
    const price = tier === "enterprise"
      ? fleetCalc.monthlyRate
      : (billingCycle === "annual" ? tierConfig.priceAnnual : tierConfig.priceMonthly);

    openPaymentModal({
      product: "platform",
      tier: tier,
      price,
      billingCycle,
      planName: tier === "enterprise"
        ? `Exultia Platform - Enterprise Fleet (${nodeCount} Hosts)`
        : `Exultia Platform - ${tierConfig.name}`,
    });
  };


  return (
    <div style={{ minHeight: "90vh", padding: "3rem 1.5rem", maxWidth: "1280px", margin: "0 auto" }}>
      
      {/* HERO SECTION */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <h1 style={{ 
          fontSize: "clamp(2.2rem, 3.8vw, 3.2rem)", 
          fontWeight: 900, 
          color: "#FFFFFF", 
          letterSpacing: "-0.03em", 
          marginBottom: "1.75rem",
          lineHeight: 1.15
        }}>
          Affordable, Accessible Autonomy
        </h1>

        {/* ZERO-BULLSHIT ENTERPRISE GUARANTEE BANNER */}
        <div style={{
          maxWidth: "1000px",
          margin: "0 auto 2.25rem auto",
          background: "linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(59, 130, 246, 0.04) 100%)",
          border: "1px solid rgba(139, 92, 246, 0.3)",
          borderRadius: "16px",
          padding: "1.5rem 1.75rem",
          textAlign: "left",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.85rem" }}>
            <span style={{ fontSize: "1.25rem" }}>🥩</span>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
              The Zero-Bullshit Enterprise Guarantee
            </h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
            <div>
              <h4 style={{ color: "#C4B5FD", fontSize: "0.88rem", fontWeight: 800, marginBottom: "0.25rem" }}>
                • No &quot;No-Obligation&quot; Steak Dinners
              </h4>
              <p style={{ color: "#94A3B8", fontSize: "0.82rem", lineHeight: 1.55, margin: 0 }}>
                You will never have to sit through a 90-minute slide deck with an enterprise account executive trying to qualify your Q4 security budget over a lukewarm filet mignon at Ruth&apos;s Chris. Just dial your nodes or contribution.
              </p>
            </div>
            <div>
              <h4 style={{ color: "#60A5FA", fontSize: "0.88rem", fontWeight: 800, marginBottom: "0.25rem" }}>
                • Zero Convention Booth Pitches
              </h4>
              <p style={{ color: "#94A3B8", fontSize: "0.82rem", lineHeight: 1.55, margin: 0 }}>
                Zero aggressive badge-scanning or elevator pitches from that InfoSec convention hottie hired to extract your corporate email so their SDR team can stalk your LinkedIn for six months.
              </p>
            </div>
            <div>
              <h4 style={{ color: "#34D399", fontSize: "0.88rem", fontWeight: 800, marginBottom: "0.25rem" }}>
                • Zero &quot;Discovery Call&quot; Traps
              </h4>
              <p style={{ color: "#94A3B8", fontSize: "0.82rem", lineHeight: 1.55, margin: 0 }}>
                You will never have to endure a 30-minute qualification interrogation with a junior BDR asking &quot;what keeps your CISO up at night&quot; before you are allowed to see software. If you want to evaluate us, send our docs to your most technical engineer and let them test it directly.
              </p>
            </div>
          </div>
        </div>

        {/* BILLING TOGGLE */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
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

      {/* UNIFIED THRESHOLD & FLEET ALLOCATION CONSOLE */}
      {(() => {
        const isFree = nodeCount === 0;
        const isPaid = nodeCount > 0;
        const isEnterprisePlus = nodeCount > 100;
        const isFleetCap = nodeCount >= 25 && !isEnterprisePlus;
        const fleetCalc = calculateEnterpriseFleetPrice(Math.max(1, nodeCount), billingCycle);
        const displayPrice = isFree ? 0 : fleetCalc.monthlyRate;
        const fleetProgress = Math.min(100, Math.round((nodeCount / 25) * 100));

        return (
          <div style={{
            position: "relative",
            background: isPaid 
              ? "linear-gradient(180deg, rgba(20, 15, 38, 0.95) 0%, rgba(10, 15, 30, 0.98) 100%)" 
              : "rgba(10, 15, 26, 0.85)",
            backdropFilter: "blur(16px)",
            border: isEnterprisePlus
              ? "2px solid #F472B6"
              : isFleetCap
              ? "2px solid #A78BFA"
              : isPaid 
              ? "2px solid #38BDF8" 
              : "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "24px",
            padding: "2.75rem 2.25rem",
            marginBottom: "4.5rem",
            boxShadow: isPaid 
              ? (isEnterprisePlus
                  ? "0 25px 50px -12px rgba(244, 114, 182, 0.25), 0 0 35px rgba(244, 114, 182, 0.15)"
                  : isFleetCap 
                  ? "0 25px 50px -12px rgba(139, 92, 246, 0.25), 0 0 35px rgba(139, 92, 246, 0.15)"
                  : "0 25px 50px -12px rgba(56, 189, 248, 0.25), 0 0 35px rgba(56, 189, 248, 0.15)")
              : "0 10px 30px rgba(0, 0, 0, 0.5)",
            transition: "all 0.3s ease"
          }}>
            {/* STATUS BADGE */}
            <div style={{
              position: "absolute",
              top: "-14px",
              left: "50%",
              transform: "translateX(-50%)",
              background: isEnterprisePlus
                ? "linear-gradient(135deg, #EC4899, #8B5CF6)"
                : isFleetCap 
                ? "linear-gradient(135deg, #8B5CF6, #6366F1)" 
                : isPaid
                ? "linear-gradient(135deg, #0284C7, #06B6D4)"
                : "linear-gradient(135deg, #10B981, #059669)",
              color: "#FFFFFF",
              fontSize: "0.76rem",
              fontWeight: 900,
              letterSpacing: "0.1em",
              padding: "5px 20px",
              borderRadius: "999px",
              textTransform: "uppercase",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.4)",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              {isEnterprisePlus ? (
                <>
                  <Sparkles size={14} />
                  <span>⚡ Enterprise+ Edition (&gt;100 Hosts • Standard Master Services Agreement)</span>
                </>
              ) : isFleetCap ? (
                <>
                  <Sparkles size={14} />
                  <span>⚡ Enterprise Edition (25+ Hosts • $500/mo Flat Fleet Cap)</span>
                </>
              ) : isPaid ? (
                <>
                  <Sparkles size={14} />
                  <span>⚡ Enterprise Edition ({nodeCount} {nodeCount === 1 ? "Host" : "Hosts"} • Full Entitlements)</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} />
                  <span>Community Edition ($0 Forever • 100% Free Community License)</span>
                </>
              )}
            </div>

            {/* TOP CONTROLS & PRICE HEADER */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "2.5rem",
              alignItems: "center",
              marginBottom: "2.5rem",
              paddingBottom: "2rem",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)"
            }}>
              {/* LEFT: SLIDER & PRESETS */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <label htmlFor="fleet-scale-slider" style={{ fontSize: "0.92rem", fontWeight: 800, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Select Your Fleet Allocation:
                  </label>
                  <span style={{ fontSize: "1.35rem", fontWeight: 900, color: isEnterprisePlus ? "#F472B6" : isFleetCap ? "#C4B5FD" : isPaid ? "#38BDF8" : "#10B981", fontFamily: "var(--font-mono, monospace)" }}>
                    {isFree ? "0 Hosts (Community)" : isEnterprisePlus ? ">100 Hosts (Enterprise+)" : `${nodeCount} ${nodeCount === 1 ? "Host (Enterprise)" : "Hosts (Enterprise)"}`}
                  </span>
                </div>

                <input 
                  id="fleet-scale-slider"
                  type="range"
                  min={0}
                  max={100}
                  value={Math.min(nodeCount, 100)}
                  onChange={(e) => setNodeCount(parseInt(e.target.value, 10))}
                  style={{ width: "100%", accentColor: isEnterprisePlus ? "#F472B6" : isFleetCap ? "#A78BFA" : isPaid ? "#38BDF8" : "#10B981", cursor: "pointer", marginBottom: "1rem" }}
                />

                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "1rem" }}>
                  {[
                    { count: 0, label: "0 (Community)" },
                    { count: 5, label: "5 Hosts ($100/mo)" },
                    { count: 10, label: "10 Hosts" },
                    { count: 25, label: "25 Hosts ($500 Flat Cap ★)" },
                    { count: 50, label: "50 Hosts" },
                    { count: 100, label: "100 Hosts" },
                    { count: 101, label: ">100 Hosts (Enterprise+)" }
                  ].map((preset) => {
                    const isSelected = preset.count === 101 ? nodeCount > 100 : nodeCount === preset.count;
                    const isSpecial = preset.count === 5 || preset.count === 25 || preset.count === 101;
                    return (
                      <button
                        key={preset.count}
                        type="button"
                        onClick={() => setNodeCount(preset.count)}
                        style={{
                          padding: "5px 12px",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          borderRadius: "8px",
                          border: isSelected 
                            ? (preset.count === 101 ? "1px solid #F472B6" : preset.count >= 25 ? "1px solid #A78BFA" : preset.count >= 5 ? "1px solid #38BDF8" : "1px solid #10B981") 
                            : isSpecial 
                            ? (preset.count === 101 ? "1px solid rgba(244, 114, 182, 0.4)" : "1px solid rgba(56, 189, 248, 0.3)") 
                            : "1px solid rgba(255, 255, 255, 0.12)",
                          background: isSelected 
                            ? (preset.count === 101 ? "rgba(236, 72, 153, 0.35)" : preset.count >= 25 ? "rgba(139, 92, 246, 0.35)" : preset.count >= 5 ? "rgba(56, 189, 248, 0.3)" : "rgba(16, 185, 129, 0.25)") 
                            : (preset.count === 101 ? "rgba(236, 72, 153, 0.08)" : "rgba(255, 255, 255, 0.04)"),
                          color: isSelected ? "#FFFFFF" : preset.count === 101 ? "#F472B6" : isSpecial ? "#E0F2FE" : "#94A3B8",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>

                {/* THRESHOLD PROGRESS BAR */}
                <div style={{
                  background: "rgba(0, 0, 0, 0.35)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  marginTop: "0.5rem"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "6px", color: "#94A3B8" }}>
                    <span>Threshold Milestone:</span>
                    <span>
                      {isEnterprisePlus ? (
                        <strong style={{ color: "#F472B6" }}>Enterprise+ Milestone (&gt;100 Hosts • Standard Master Services Agreement)</strong>
                      ) : isFleetCap ? (
                        <strong style={{ color: "#A78BFA" }}>Enterprise 25-Host Flat Cap Active ($500/mo • Save $125+/mo)</strong>
                      ) : isPaid ? (
                        <strong style={{ color: "#38BDF8" }}>Enterprise Active • {nodeCount}/25 Hosts to Flat Cap ({fleetProgress}%)</strong>
                      ) : (
                        <span>Community Edition ($0/mo)</span>
                      )}
                    </span>
                  </div>
                  <div style={{ width: "100%", height: "8px", background: "rgba(255, 255, 255, 0.08)", borderRadius: "999px", overflow: "hidden" }}>
                    <div style={{
                      width: `${isEnterprisePlus ? 100 : isPaid ? Math.max(8, fleetProgress) : 0}%`,
                      height: "100%",
                      background: isEnterprisePlus
                        ? "linear-gradient(90deg, #EC4899, #8B5CF6)"
                        : isFleetCap 
                        ? "linear-gradient(90deg, #8B5CF6, #38BDF8)" 
                        : "linear-gradient(90deg, #0284C7, #38BDF8)",
                      borderRadius: "999px",
                      transition: "width 0.3s ease"
                    }} />
                  </div>
                </div>

                {/* MSA ADVISORY CALLOUT FOR >100 HOSTS */}
                {isEnterprisePlus && (
                  <div style={{
                    marginTop: "1.25rem",
                    background: "linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(139, 92, 246, 0.12) 100%)",
                    border: "1px solid rgba(236, 72, 153, 0.35)",
                    borderRadius: "14px",
                    padding: "1.25rem 1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.85rem"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <FileText size={20} color="#F472B6" />
                        <span style={{ fontSize: "1rem", fontWeight: 800, color: "#FFFFFF" }}>
                          Deployments &gt;100 Hosts Require a Standard Master Services Agreement (MSA)
                        </span>
                      </div>
                      <span style={{
                        background: "rgba(236, 72, 153, 0.2)",
                        color: "#F472B6",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        padding: "3px 10px",
                        borderRadius: "999px",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em"
                      }}>
                        Zero &quot;Contact Sales&quot; Gating
                      </span>
                    </div>
                    
                    <p style={{ color: "#E2E8F0", fontSize: "0.88rem", lineHeight: 1.6, margin: 0 }}>
                      We believe forcing engineering leaders to jump on high-pressure discovery calls with sales reps just to see pricing or contract terms is an anti-pattern. 
                      Fleets exceeding 100 hosts operate under our transparent, standard <strong>Master Services Agreement (Form MSA-2026-EX)</strong>: 
                      <strong> $500/mo flat fleet base + $12/node/mo</strong> (annual billing), Net-30 payment terms, 99.9% Threat Feed SLA, 
                      exact remediation boundaries (customer environment adaptability), offline Ed25519 cryptographic licensing, and our strict <strong>Zero Telemetry Warranty</strong>.
                    </p>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        onClick={() => setIsMsaModalOpen(true)}
                        style={{
                          background: "linear-gradient(135deg, #EC4899, #8B5CF6)",
                          color: "#FFFFFF",
                          border: "none",
                          padding: "10px 20px",
                          borderRadius: "8px",
                          fontWeight: 800,
                          fontSize: "0.88rem",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          boxShadow: "0 4px 14px rgba(236, 72, 153, 0.35)",
                          transition: "all 0.15s ease"
                        }}
                      >
                        <FileText size={16} />
                        <span>Preview Standard MSA (Sample Agreement) &rarr;</span>
                      </button>

                      <span style={{ color: "#94A3B8", fontSize: "0.82rem" }}>
                        Instant preview • Download Markdown • Copy full text with zero email gating
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT: PRICE & ACTION BUTTON */}
              <div style={{
                background: "rgba(0, 0, 0, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "16px",
                padding: "1.75rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                    {isEnterprisePlus ? (
                      <>
                        <span style={{ fontSize: "3.2rem", fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.03em" }}>
                          ${billingCycle === "annual" ? 12 : 15}
                        </span>
                        <span style={{ color: "#64748B", fontSize: "1.1rem", fontWeight: 600 }}>
                          / node / month
                        </span>
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: "3.2rem", fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.03em" }}>
                          ${displayPrice}
                        </span>
                        <span style={{ color: "#64748B", fontSize: "1.1rem", fontWeight: 600 }}>
                          / month
                        </span>
                      </>
                    )}
                  </div>

                  <div style={{ fontSize: "0.85rem", color: "#94A3B8", marginTop: "6px", marginBottom: "1.5rem", lineHeight: 1.45 }}>
                    {isEnterprisePlus ? (
                      <span>
                        <strong style={{ color: "#F472B6" }}>★ Standard Master Services Agreement:</strong> $500/mo base cap + ${billingCycle === "annual" ? "12" : "15"}/node/mo {billingCycle === "annual" ? "(billed annually)" : "(billed monthly)"}. Includes Net-30 invoicing, 99.9% Threat Feed SLA, exact remediation boundaries, and dedicated offline Ed25519 cryptographic licensing.
                      </span>
                    ) : isFree ? (
                      <span style={{ color: "#10B981", fontWeight: 700 }}>100% Free forever • Zero credit card required • Zero phone-home</span>
                    ) : nodeCount < 5 ? (
                      <span>
                        1–4 hosts: <strong>${fleetCalc.sub25Rate}/host/mo</strong> {billingCycle === "annual" ? "(billed annually)" : "(billed monthly)"}. Scale to 5 hosts ($100/mo) for the standard baseline with unlimited Daedelus builds!
                      </span>
                    ) : nodeCount < 25 ? (
                      <span>
                        <strong style={{ color: "#38BDF8" }}>★ Enterprise Active:</strong> Covers all {nodeCount} hosts with live priority threat streaming and <strong>unlimited Daedelus builds</strong>! Scale to 25 to lock in the flat cap.
                      </span>
                    ) : nodeCount === 25 ? (
                      <span style={{ color: "#34D399", fontWeight: 800 }}>
                        ★ Enterprise 25-Host Flat Fleet Cap Active: Flat $500/mo ($6,000/yr) covers all 25 hosts! Save up to $125/mo ($1,500/yr).
                      </span>
                    ) : (
                      <span>
                        25-Host Base Cap ($500/mo) + <strong>{nodeCount - 25} extra hosts</strong> at ${fleetCalc.additionalRate}/host/mo.
                      </span>
                    )}
                  </div>
                </div>

                <button
                  disabled={isFree ? (currentPlatformTier === "community" || isSwitchingFree) : false}
                  onClick={() => {
                    if (isEnterprisePlus) {
                      setIsMsaModalOpen(true);
                    } else if (isFree) {
                      handleSelectTier("community", "Community Sovereign");
                    } else {
                      handleSelectTier("enterprise", `Exultia Platform (${nodeCount} Hosts)`);
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "16px 24px",
                    borderRadius: "12px",
                    fontWeight: 900,
                    fontSize: "1.05rem",
                    cursor: (isFree && currentPlatformTier === "community") ? "default" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    border: (isFree && currentPlatformTier === "community")
                      ? "1px solid rgba(255, 255, 255, 0.15)"
                      : "none",
                    background: (isFree && currentPlatformTier === "community")
                      ? "rgba(255, 255, 255, 0.06)"
                      : isEnterprisePlus
                      ? "linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)"
                      : isFleetCap
                      ? "linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)"
                      : isPaid
                      ? "linear-gradient(135deg, #0284C7 0%, #06B6D4 100%)"
                      : "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                    color: (isFree && currentPlatformTier === "community") ? "#94A3B8" : "#FFFFFF",
                    boxShadow: !(isFree && currentPlatformTier === "community") 
                      ? (isEnterprisePlus
                          ? "0 4px 20px rgba(236, 72, 153, 0.4)"
                          : isFleetCap 
                          ? "0 4px 20px rgba(139, 92, 246, 0.4)" 
                          : isPaid 
                          ? "0 4px 20px rgba(2, 132, 199, 0.4)" 
                          : "0 4px 20px rgba(16, 185, 129, 0.35)") 
                      : "none"
                  }}
                >
                  {isEnterprisePlus ? (
                    <>
                      <FileText size={18} />
                      <span>Review Standard MSA</span>
                      <ArrowRight size={18} />
                    </>
                  ) : isFree ? (
                    currentPlatformTier === "community" ? (
                      <>
                        <CheckCircle2 size={18} color="#10B981" />
                        <span>Current Active Plan (Community)</span>
                      </>
                    ) : (
                      <>
                        <span>Download Free Daemon (Community)</span>
                        <ArrowRight size={18} />
                      </>
                    )
                  ) : (
                    <>
                      <span>Purchase</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* DYNAMIC ENTITLEMENTS BREAKDOWN GRID */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "10px" }}>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
                  Active Entitlements at {isFree ? "0 Hosts (Community)" : isEnterprisePlus ? ">100 Hosts (Enterprise+)" : `${nodeCount} Hosts (Enterprise)`}:
                </h4>
                <span style={{ fontSize: "0.8rem", color: isEnterprisePlus ? "#F472B6" : isFleetCap ? "#A78BFA" : isPaid ? "#38BDF8" : "#94A3B8" }}>
                  {isEnterprisePlus
                    ? "✓ Enterprise+ Defense Stack Active (Standard MSA Terms • Offline Cryptographic Licensing)"
                    : isFleetCap 
                    ? "✓ Full Enterprise Fleet Defense Stack Active (Flat Cap)" 
                    : isPaid
                    ? "✓ Enterprise Entitlements Active (Unlimited Automated Threat Remediation)"
                    : "Community Defense Active (Upgrade anytime for Enterprise)"}
                </span>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1.5rem"
              }}>
                {/* COMMUNITY ENTITLEMENTS */}
                <div style={{ background: "rgba(0, 0, 0, 0.25)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "14px", padding: "1.25rem" }}>
                  <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "#10B981", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
                    Community Entitlements (Always Included)
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "#CBD5E1" }}>
                    <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <Check size={16} color="#10B981" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span>Autonomous resident Linux daemon ($0 forever)</span>
                    </li>
                    <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <Check size={16} color="#10B981" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span>Full Live Threat Feed w/local copy (daily sync)</span>
                    </li>
                    <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <Check size={16} color="#10B981" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span>Live Hotpatching</span>
                    </li>
                    <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <Check size={16} color="#10B981" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span>Strict zero outbound telemetry protocol (SCIF safe)</span>
                    </li>
                  </ul>
                </div>

                {/* ENTERPRISE ENTITLEMENTS */}
                <div style={{
                  background: isFleetCap ? "rgba(139, 92, 246, 0.08)" : isPaid ? "rgba(56, 189, 248, 0.08)" : "rgba(0, 0, 0, 0.15)",
                  border: isFleetCap ? "1px solid rgba(139, 92, 246, 0.35)" : isPaid ? "1px solid rgba(56, 189, 248, 0.35)" : "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "14px",
                  padding: "1.25rem",
                  opacity: isPaid ? 1 : 0.65
                }}>
                  <div style={{ fontSize: "0.76rem", fontWeight: 800, color: isFleetCap ? "#A78BFA" : isPaid ? "#38BDF8" : "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    {isPaid ? <Sparkles size={14} /> : <Lock size={14} />}
                    <span>Enterprise Entitlements ({isPaid ? "Active" : "Included on All Enterprise Allocations"})</span>
                  </div>

                  <p style={{ fontSize: "0.9rem", color: isPaid ? "#F1F5F9" : "#94A3B8", fontWeight: 700, margin: "0 0 0.85rem 0", lineHeight: 1.4 }}>
                    Unlimited Access to Automated Threat Remediation
                  </p>

                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: isPaid ? "#E2E8F0" : "#64748B" }}>
                    <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      {isPaid ? <Check size={16} color={isEnterprisePlus ? "#F472B6" : isFleetCap ? "#A78BFA" : "#38BDF8"} style={{ flexShrink: 0, marginTop: "2px" }} /> : <Lock size={14} style={{ flexShrink: 0, marginTop: "3px" }} />}
                      <span>Unlimited Access to Threat Feed API</span>
                    </li>
                    <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      {isPaid ? <Check size={16} color={isEnterprisePlus ? "#F472B6" : isFleetCap ? "#A78BFA" : "#38BDF8"} style={{ flexShrink: 0, marginTop: "2px" }} /> : <Lock size={14} style={{ flexShrink: 0, marginTop: "3px" }} />}
                      <span>Unlimited Use of Daedelus - build secure IDEs, containers, and packages</span>
                    </li>
                    <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      {isPaid ? <Check size={16} color={isEnterprisePlus ? "#F472B6" : isFleetCap ? "#A78BFA" : "#38BDF8"} style={{ flexShrink: 0, marginTop: "2px" }} /> : <Lock size={14} style={{ flexShrink: 0, marginTop: "3px" }} />}
                      <span>Unlimited Use of Praxis - generate POSIX-compliant scripts mapped to threat feed fixes</span>
                    </li>
                    <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      {isPaid ? <Check size={16} color={isEnterprisePlus ? "#F472B6" : isFleetCap ? "#A78BFA" : "#38BDF8"} style={{ flexShrink: 0, marginTop: "2px" }} /> : <Lock size={14} style={{ flexShrink: 0, marginTop: "3px" }} />}
                      <span>Unlimited Use of Axiom - general cybersecurity exam questions and LMS API</span>
                    </li>
                    <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      {(isFleetCap || isEnterprisePlus) ? <Check size={16} color={isEnterprisePlus ? "#F472B6" : "#A78BFA"} style={{ flexShrink: 0, marginTop: "2px" }} /> : <Lock size={14} style={{ flexShrink: 0, marginTop: "3px" }} />}
                      <span>25-Host Flat Fleet Cap savings</span>
                    </li>
                    <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      {isPaid ? <Check size={16} color={isEnterprisePlus ? "#F472B6" : isFleetCap ? "#A78BFA" : "#38BDF8"} style={{ flexShrink: 0, marginTop: "2px" }} /> : <Lock size={14} style={{ flexShrink: 0, marginTop: "3px" }} />}
                      <span>Optional MSA terms for large enterprises</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      })()}



      {/* LINK TO DEDICATED FAQ */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <Link
          href="/faq"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "#67E8F9",
            fontSize: "0.9rem",
            fontFamily: "var(--font-mono, monospace)",
            textDecoration: "none",
            background: "rgba(0, 229, 255, 0.06)",
            border: "1px solid rgba(0, 229, 255, 0.25)",
            padding: "10px 22px",
            borderRadius: "8px",
            transition: "all 0.15s ease"
          }}
        >
          <span>Have architectural questions or skepticism? Read our full FAQ &rarr;</span>
        </Link>
      </div>

      {/* MSA PREVIEW MODAL */}
      <MsaPreviewModal isOpen={isMsaModalOpen} onClose={() => setIsMsaModalOpen(false)} />

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
