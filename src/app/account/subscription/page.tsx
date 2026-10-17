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
  Download, 
  FileText, 
  Activity, 
  HelpCircle,
  CreditCard,
  Building2,
  Cpu,
  CheckCircle2
} from "lucide-react";
import { 
  PureIdeIcon, 
  VantageIcon, 
  KineticIcon, 
  InquestIcon, 
  PraxisIcon, 
  PureOsIcon, 
  AxiomIcon 
} from "@/components/BrandIcons";
import PaymentModal from "@/components/billing/PaymentModal";

type ProductKey = "pureide" | "uvi" | "kinetic" | "praxis" | "pureos" | "axiom" | "inquest" | "multipass";

interface PlanItem {
  tier: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  description: string;
  features: string[];
  cta: string;
  isPopular: boolean;
}

function SubscriptionContent() {
  const searchParams = useSearchParams();
  const initialProduct = (searchParams.get("product") as ProductKey) || "pureide";
  const validProducts: ProductKey[] = ["pureide", "uvi", "kinetic", "praxis", "pureos", "axiom", "inquest", "multipass"];
  
  const { user, openPaymentModal, getUserTier, refreshUser } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<ProductKey>(
    validProducts.includes(initialProduct) ? initialProduct : "pureide"
  );
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [isSwitchingFree, setIsSwitchingFree] = useState(false);
  
  // Dual-mode slider state: product-relative ($0-$250) vs aggregate multipass ($0-$800)
  const [individualSliderAmount, setIndividualSliderAmount] = useState<number>(49);
  const [multipassSliderAmount, setMultipassSliderAmount] = useState<number>(196);

  const isMultiPass = selectedProduct === "multipass";
  const sliderAmount = isMultiPass ? multipassSliderAmount : individualSliderAmount;
  const setSliderAmount = (val: number) => {
    if (isMultiPass) {
      setMultipassSliderAmount(val);
    } else {
      setIndividualSliderAmount(val);
    }
  };

  useEffect(() => {
    const prod = searchParams.get("product") as ProductKey;
    if (prod && validProducts.includes(prod)) {
      setSelectedProduct(prod);
    }
  }, [searchParams]);

  const plans: Record<ProductKey, PlanItem[]> = {
    pureide: [
      {
        tier: "free",
        name: "Community",
        priceMonthly: 0,
        priceAnnual: 0,
        description: "Zero-telemetry open-source workstation compiler for individual security researchers.",
        features: [
          "Single Local Developer Seat",
          "Standard sandbox compiler triggers",
          "Telemetry stripping engine",
          "Local extension verification"
        ],
        cta: "Current Free Tier",
        isPopular: false
      },
      {
        tier: "pro",
        name: "Pro",
        priceMonthly: 49,
        priceAnnual: 39,
        description: "Priority compiler engine, dedicated build runner, and real-time egress firewall for single developers.",
        features: [
          "Everything in Community",
          "Isolated cloud pipeline builds",
          "Network egress sandboxing",
          "Environment token isolation",
          "Automated CycloneDX SBOMs"
        ],
        cta: "Upgrade to Pro",
        isPopular: true
      },
      {
        tier: "enterprise",
        name: "Enterprise",
        priceMonthly: 149,
        priceAnnual: 119,
        description: "Strict airgap signing, offline cryptographic cosign, and organization-wide volume entitlements.",
        features: [
          "Everything in Pro",
          "Code-signing & EDR integrity",
          "Custom enterprise role blueprints",
          "Immutable binary encapsulation",
          "Priority enterprise cloud runners"
        ],
        cta: "Upgrade to Enterprise",
        isPopular: false
      }
    ],
    uvi: [
      {
        tier: "free",
        name: "Community",
        priceMonthly: 0,
        priceAnnual: 0,
        description: "Web catalog access to vulnerability feeds with basic search.",
        features: [
          "Single User Browser Access",
          "Web portal vulnerability search",
          "CISA KEV & NVD CVE browsing",
          "Standard CVSS score breakdowns"
        ],
        cta: "Current Free Tier",
        isPopular: false
      },
      {
        tier: "pro",
        name: "Pro",
        priceMonthly: 49,
        priceAnnual: 39,
        description: "Real-time threat feed streams, zero-day early warnings, and workstation risk vectors for individual analysts.",
        features: [
          "Everything in Community",
          "Workstation & IDE specific exploit warnings",
          "API rate limit: 300 requests/min"
        ],
        cta: "Upgrade to Pro",
        isPopular: true
      },
      {
        tier: "enterprise",
        name: "Enterprise",
        priceMonthly: 149,
        priceAnnual: 119,
        description: "Strict airgap signing, offline cryptographic cosign, and organization-wide volume entitlements.",
        features: [
          "Everything in Pro",
          "Organization Volume Entitlements",
          "Dedicated CISO advisory portal",
          "Unlimited unmetered API quotas"
        ],
        cta: "Upgrade to Enterprise",
        isPopular: false
      }
    ],
    kinetic: [
      {
        tier: "free",
        name: "Community",
        priceMonthly: 0,
        priceAnnual: 0,
        description: "Standard Vantage vulnerability sync, manual bash hotfix recipes, and local host validation.",
        features: [
          "Single Workstation / Host Node",
          "Standard Vantage CVE synchronization",
          "Manual hotfix inspection & verification",
          "Community rollback recipes",
          "Local-first execution model"
        ],
        cta: "Current Free Tier",
        isPopular: false
      },
      {
        tier: "pro",
        name: "Pro",
        priceMonthly: 49,
        priceAnnual: 39,
        description: "Real-time streaming JSON/bash feed, zero-agent systemd daemon, and automated verification sentinel.",
        features: [
          "Everything in Community",
          "Up to 25 Production Nodes / Servers",
          "Autonomous patch streaming daemon",
          "Deterministic sub-second rollback engine",
          "Automated pre & post-flight sentinels",
          "Live canary health monitoring"
        ],
        cta: "Upgrade to Pro",
        isPopular: true
      },
      {
        tier: "enterprise",
        name: "Enterprise",
        priceMonthly: 149,
        priceAnnual: 119,
        description: "Phased ring deployment (Ring 0 -> Ring 1 -> Ring 2), Ansible playbooks, and SLSA Level 3 signed manifests.",
        features: [
          "Everything in Pro",
          "Unlimited Node Fleet Licensing",
          "Phased multi-ring deployment orchestrator",
          "Cosign OIDC SLSA Level 3 signed manifests",
          "Emergency fleet-wide rollback orchestrator",
          "Dedicated 24/7 patch verification SLA"
        ],
        cta: "Upgrade to Enterprise",
        isPopular: false
      }
    ],
    praxis: [
      {
        tier: "free",
        name: "Community",
        priceMonthly: 0,
        priceAnnual: 0,
        description: "Manual threat remediation guidelines for individual operators.",
        features: [
          "Single User Browser Access",
          "Public CVE checklist",
          "Standard manual remediation guides"
        ],
        cta: "Current Free Tier",
        isPopular: false
      },
      {
        tier: "pro",
        name: "Pro",
        priceMonthly: 49,
        priceAnnual: 39,
        description: "Automated bash and playbook generation with SIEM export formatting.",
        features: [
          "Everything in Community",
          "Automated bash/ansible patching payloads",
          "SIEM webhook export formats (Splunk, QRadar)",
          "Priority 12-hour support SLA"
        ],
        cta: "Upgrade to Pro",
        isPopular: true
      },
      {
        tier: "enterprise",
        name: "Enterprise",
        priceMonthly: 149,
        priceAnnual: 119,
        description: "Fleet-wide operations scale and compliance tracking.",
        features: [
          "Everything in Pro",
          "Organization Volume Entitlements (Fleet licenses)",
          "Custom internal compliance benchmarking",
          "Dedicated priority incident engineer"
        ],
        cta: "Upgrade to Enterprise",
        isPopular: false
      }
    ],
    pureos: [
      {
        tier: "free",
        name: "Community",
        priceMonthly: 0,
        priceAnnual: 0,
        description: "Standard CIS baselines and vulnerability scanning.",
        features: [
          "Single Developer Config Generation",
          "Standard CIS baseline images",
          "Public CVE vulnerability scans"
        ],
        cta: "Current Free Tier",
        isPopular: false
      },
      {
        tier: "pro",
        name: "Pro",
        priceMonthly: 49,
        priceAnnual: 39,
        description: "Zero-trust environments and cryptographic SBOM generation.",
        features: [
          "Everything in Community",
          "Zero-trust hardened OS variants",
          "Automated SBOM recipes",
          "Advanced CI/CD integration templates"
        ],
        cta: "Upgrade to Pro",
        isPopular: true
      },
      {
        tier: "enterprise",
        name: "Enterprise",
        priceMonthly: 149,
        priceAnnual: 119,
        description: "Air-gapped compatibility and full compliance infrastructure.",
        features: [
          "Everything in Pro",
          "Organization Volume Entitlements",
          "Air-gapped deployment compatibility",
          "Signed cryptographic provenance"
        ],
        cta: "Upgrade to Enterprise",
        isPopular: false
      }
    ],
    axiom: [
      {
        tier: "free",
        name: "Community",
        priceMonthly: 0,
        priceAnnual: 0,
        description: "Cybersecurity certification prep testing (e.g. Security+, CEH).",
        features: [
          "Single Student License",
          "Standard exam question banks",
          "Basic scoring & progress tracking"
        ],
        cta: "Current Free Tier",
        isPopular: false
      },
      {
        tier: "enterprise",
        name: "Enterprise",
        priceMonthly: 149,
        priceAnnual: 119,
        description: "Institutional scale testing platforms with custom enterprise workflows.",
        features: [
          "Everything in Community",
          "Institutional Volume Entitlements (Multi-seat)",
          "Dedicated Enterprise REST API endpoints",
          "SSO SAML 2.0 integration & dedicated support"
        ],
        cta: "Upgrade to Enterprise",
        isPopular: true
      }
    ],
    inquest: [
      {
        tier: "free",
        name: "Community",
        priceMonthly: 0,
        priceAnnual: 0,
        description: "Standard FOIA exemption processing and indexing for individual researchers.",
        features: [
          "Single User Browser Access",
          "Public records act discovery workflow",
          "Standard FOIA exemption 1-9 templating"
        ],
        cta: "Current Free Tier",
        isPopular: false
      },
      {
        tier: "pro",
        name: "Pro",
        priceMonthly: 49,
        priceAnnual: 39,
        description: "Automated redaction pipelines and case chain of custody for individual legal analysts.",
        features: [
          "Everything in Community",
          "Denial letter & exemption analyzer",
          "Statutory deadlines & case dashboard",
          "Advanced appeal letter generator"
        ],
        cta: "Upgrade to Pro",
        isPopular: true
      },
      {
        tier: "enterprise",
        name: "Enterprise",
        priceMonthly: 149,
        priceAnnual: 119,
        description: "Organization-wide deployments and multi-agency collaboration support.",
        features: [
          "Everything in Pro",
          "Firm/Agency Volume Entitlements (Multi-seat)",
          "Multi-agency collaboration portal",
          "Local-first bring-your-own-key (BYOK)"
        ],
        cta: "Upgrade to Enterprise",
        isPopular: false
      }
    ],
    multipass: [
      {
        tier: "pro",
        name: "MultiPass Pro",
        priceMonthly: 196,
        priceAnnual: 156,
        description: "Bundled multi-product access! Get individual Pro-level access across all eligible Exultia products.",
        features: [
          "PureIDE Pro",
          "Vantage Pro",
          "Kinetic Pro (Autonomous 25-node stream)",
          "Inquest Pro",
          "Praxis Pro",
          "PureOS Pro",
          "100% bundled multi-product discount"
        ],
        cta: "Unlock MultiPass Pro",
        isPopular: true
      },
      {
        tier: "enterprise",
        name: "MultiPass Enterprise",
        priceMonthly: 745,
        priceAnnual: 595,
        description: "Organization-wide Enterprise-level access to the complete Exultia stack with dedicated priority support.",
        features: [
          "PureIDE Enterprise",
          "Vantage Enterprise",
          "Kinetic Enterprise (Unlimited fleet patch engine)",
          "Inquest Enterprise",
          "Praxis Enterprise",
          "PureOS Enterprise",
          "Axiom Enterprise LMS API",
          "Cosign SLSA Level 3 signed manifests",
          "Dedicated priority support engineer"
        ],
        cta: "Unlock MultiPass Enterprise",
        isPopular: false
      }
    ]
  };

  const productMeta: Record<ProductKey, { name: string; subtitle: string; icon: React.ReactNode; color: string; bgGradient: string }> = {
    pureide: {
      name: "PureIDE",
      subtitle: "Zero-telemetry developer environment compiler & egress firewall",
      icon: <PureIdeIcon size={18} glow={false} />,
      color: "#3B82F6",
      bgGradient: "linear-gradient(135deg, #3B82F6, #2563EB)"
    },
    uvi: {
      name: "Vantage",
      subtitle: "Universal vulnerability feed aggregating 110+ threat sources",
      icon: <VantageIcon size={18} glow={false} />,
      color: "#8B5CF6",
      bgGradient: "linear-gradient(135deg, #8B5CF6, #7C3AED)"
    },
    kinetic: {
      name: "Kinetic",
      subtitle: "Autonomous zero-downtime patch stream & deterministic rollback engine",
      icon: <KineticIcon size={18} glow={false} />,
      color: "#06B6D4",
      bgGradient: "linear-gradient(135deg, #06B6D4, #0891B2)"
    },
    praxis: {
      name: "Praxis",
      subtitle: "Surgical vulnerability remediation & automated patch payloads",
      icon: <PraxisIcon size={18} glow={false} />,
      color: "#F59E0B",
      bgGradient: "linear-gradient(135deg, #F59E0B, #D97706)"
    },
    pureos: {
      name: "PureOS",
      subtitle: "Pre-hardened CIS container images synchronized to Vantage",
      icon: <PureOsIcon size={18} glow={false} />,
      color: "#10B981",
      bgGradient: "linear-gradient(135deg, #10B981, #059669)"
    },
    axiom: {
      name: "Axiom",
      subtitle: "Cybersecurity certification prep & enterprise LMS API engine",
      icon: <AxiomIcon size={18} glow={false} />,
      color: "#F43F5E",
      bgGradient: "linear-gradient(135deg, #F43F5E, #E11D48)"
    },
    inquest: {
      name: "Inquest",
      subtitle: "Autonomous public records compliance & 9-exemption discovery vault",
      icon: <InquestIcon size={18} glow={false} />,
      color: "#EC4899",
      bgGradient: "linear-gradient(135deg, #EC4899, #DB2777)"
    },
    multipass: {
      name: "MultiPass",
      subtitle: "Leeloo Dallas MultiPass! The ultimate bundled suite.",
      icon: <Sparkles size={18} />,
      color: "#EC4899",
      bgGradient: "linear-gradient(135deg, #EC4899, #BE185D)"
    }
  };

  const currentTier = getUserTier(selectedProduct);

  const handlePlanSelect = async (tier: string, planName: string, price: number) => {
    if (tier === currentTier) return;
    
    if (price === 0) {
      setIsSwitchingFree(true);
      try {
        const res = await fetch("/api/user/subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product: selectedProduct, tier: "free", billingCycle }),
        });
        if (res.ok) {
          await refreshUser();
        }
      } catch (e) {
        console.error("Free plan activation error:", e);
      } finally {
        setIsSwitchingFree(false);
      }
      return;
    }

    openPaymentModal({
      product: selectedProduct,
      tier: tier as any,
      price,
      billingCycle,
      planName: `${selectedProduct.toUpperCase()} - ${planName}`,
    });
  };

  return (
    <div style={{ minHeight: "90vh", padding: "3rem 1.5rem", maxWidth: "1280px", margin: "0 auto" }}>
      
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div style={{ 
          display: "inline-flex", 
          alignItems: "center", 
          gap: "8px", 
          background: "rgba(59, 130, 246, 0.15)", 
          border: "1px solid rgba(59, 130, 246, 0.3)", 
          padding: "4px 14px", 
          borderRadius: "999px", 
          marginBottom: "1rem" 
        }}>
          <Sparkles size={14} color="#60A5FA" />
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#93C5FD", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Full Exultia Product Suite Subscriptions
          </span>
        </div>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>
          Manage Plans & Feature Entitlements
        </h1>
        <p style={{ color: "#94A3B8", fontSize: "1.05rem", maxWidth: "760px", margin: "0 auto" }}>
          Seamlessly scale your developer workstation security, global threat intelligence feeds, legal discovery vaults, automated patch remediation, hardened OS images, and certification simulators.
        </p>

        {/* Product Selector Tabs (All 6 products) */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          background: "rgba(15, 23, 42, 0.8)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "16px",
          padding: "6px",
          marginTop: "2rem",
          gap: "6px",
          maxWidth: "1050px",
          marginLeft: "auto",
          marginRight: "auto"
        }}>
          {(Object.keys(plans) as ProductKey[]).map((prodKey) => {
            const meta = productMeta[prodKey];
            const isSelected = selectedProduct === prodKey;
            const activeUserTier = getUserTier(prodKey);

            return (
              <button
                key={prodKey}
                onClick={() => setSelectedProduct(prodKey)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 16px",
                  background: isSelected ? meta.bgGradient : "transparent",
                  border: isSelected ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid transparent",
                  borderRadius: "12px",
                  color: isSelected ? "#FFFFFF" : "#94A3B8",
                  fontSize: "0.86rem",
                  fontWeight: isSelected ? 800 : 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  position: "relative"
                }}
              >
                {meta.icon}
                <span>{meta.name}</span>
                {activeUserTier !== "free" && (
                  <span style={{
                    fontSize: "0.65rem",
                    background: "rgba(255, 255, 255, 0.2)",
                    color: "#FFFFFF",
                    padding: "1px 5px",
                    borderRadius: "4px",
                    fontWeight: 800,
                    textTransform: "uppercase"
                  }}>
                    {activeUserTier}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* INTERACTIVE TIER THRESHOLD SLIDER */}
        <div style={{
          marginTop: "1.75rem",
          background: "linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(10, 15, 26, 0.95) 100%)",
          border: `1px solid ${isMultiPass ? "rgba(236, 72, 153, 0.4)" : "rgba(56, 189, 248, 0.3)"}`,
          borderRadius: "18px",
          padding: "1.5rem 2rem",
          maxWidth: "960px",
          margin: "1.75rem auto 0 auto",
          boxShadow: isMultiPass 
            ? "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(236, 72, 153, 0.15)"
            : "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(56, 189, 248, 0.1)"
        }}>
          {/* Header of Slider */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
            <div style={{ textAlign: "left", maxWidth: "680px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {isMultiPass ? (
                  <Sparkles size={20} color="#EC4899" />
                ) : (
                  <Zap size={20} color="#38BDF8" />
                )}
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
                  {isMultiPass 
                    ? "MultiPass Suite Aggregate Contribution Slider" 
                    : `${productMeta[selectedProduct].name} Pricing Threshold Slider`}
                </h3>
                <span style={{
                  fontSize: "0.68rem",
                  background: isMultiPass ? "rgba(236, 72, 153, 0.2)" : "rgba(56, 189, 248, 0.15)",
                  color: isMultiPass ? "#F472B6" : "#38BDF8",
                  border: isMultiPass ? "1px solid rgba(236, 72, 153, 0.4)" : "1px solid rgba(56, 189, 248, 0.3)",
                  padding: "2px 8px",
                  borderRadius: "999px",
                  fontWeight: 700,
                  textTransform: "uppercase"
                }}>
                  {isMultiPass ? "Aggregate Suite Mode" : "Product-Relative Mode"}
                </span>
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.84rem", margin: "6px 0 0 0", lineHeight: 1.45 }}>
                {isMultiPass
                  ? "Aggregate suite pricing: Slide to set your bundled suite budget. MultiPass Pro ($196/mo) unlocks all Pro products; MultiPass Enterprise ($595/mo) unlocks the complete organization fleet stack."
                  : `Product-relative pricing: Slide to set your budget specifically for ${productMeta[selectedProduct].name}. Tier thresholds unlock as the amount reaches the defined pricing for this product.`}
              </p>
            </div>

            {/* Current Amount Callout */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(0, 0, 0, 0.5)",
              border: `1px solid ${isMultiPass ? "rgba(236, 72, 153, 0.4)" : "rgba(56, 189, 248, 0.4)"}`,
              borderRadius: "10px",
              padding: "6px 14px"
            }}>
              <span style={{ fontSize: "0.82rem", color: "#94A3B8", fontWeight: 600 }}>
                {isMultiPass ? "Suite Threshold:" : `${productMeta[selectedProduct].name}:`}
              </span>
              <span style={{ fontSize: "1.5rem", fontWeight: 900, color: isMultiPass ? "#F472B6" : "#38BDF8" }}>
                ${sliderAmount}
              </span>
              <span style={{ fontSize: "0.8rem", color: "#64748B" }}>/mo</span>
            </div>
          </div>

          {/* Range Slider Track */}
          {(() => {
            const sliderMax = isMultiPass ? 800 : 250;
            const fillPercent = Math.min(100, Math.max(0, (sliderAmount / sliderMax) * 100));
            const ticks = isMultiPass
              ? [
                  { val: 0, label: "$0 Free Suite" },
                  { val: 196, label: "$196 MultiPass Pro (All Pro Tiers)" },
                  { val: 595, label: "$595 MultiPass Enterprise (Full Suite Stack)" }
                ]
              : selectedProduct === "axiom"
              ? [
                  { val: 0, label: "$0 Community" },
                  { val: 149, label: "$149 Enterprise LMS" }
                ]
              : [
                  { val: 0, label: "$0 Community" },
                  { val: 49, label: "$49 Pro" },
                  { val: 149, label: "$149 Enterprise" }
                ];

            return (
              <div style={{ position: "relative", marginBottom: "1.5rem", padding: "0.5rem 0" }}>
                <input
                  type="range"
                  min="0"
                  max={sliderMax}
                  step={isMultiPass ? 5 : 1}
                  value={sliderAmount}
                  onChange={(e) => setSliderAmount(parseInt(e.target.value, 10))}
                  style={{
                    width: "100%",
                    height: "8px",
                    borderRadius: "4px",
                    background: isMultiPass
                      ? `linear-gradient(to right, #EC4899 0%, #A855F7 ${fillPercent}%, rgba(255,255,255,0.1) ${fillPercent}%, rgba(255,255,255,0.1) 100%)`
                      : `linear-gradient(to right, #38BDF8 0%, #818CF8 ${fillPercent}%, rgba(255,255,255,0.1) ${fillPercent}%, rgba(255,255,255,0.1) 100%)`,
                    outline: "none",
                    cursor: "pointer",
                    accentColor: isMultiPass ? "#EC4899" : "#38BDF8"
                  }}
                />

                {/* Threshold Ticks */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "0.74rem", color: "#94A3B8", flexWrap: "wrap", gap: "6px" }}>
                  {ticks.map(t => (
                    <button
                      key={t.val}
                      type="button"
                      onClick={() => setSliderAmount(t.val)}
                      style={{
                        background: sliderAmount >= t.val 
                          ? (isMultiPass ? "rgba(236, 72, 153, 0.15)" : "rgba(56, 189, 248, 0.15)")
                          : "transparent",
                        border: sliderAmount >= t.val 
                          ? (isMultiPass ? "1px solid rgba(236, 72, 153, 0.4)" : "1px solid rgba(56, 189, 248, 0.4)")
                          : "1px solid transparent",
                        color: sliderAmount >= t.val 
                          ? (isMultiPass ? "#F472B6" : "#38BDF8") 
                          : "#64748B",
                        borderRadius: "6px",
                        padding: "3px 8px",
                        cursor: "pointer",
                        fontSize: "0.74rem",
                        fontWeight: sliderAmount >= t.val ? 700 : 500
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Entitlements Feedback: Aggregate Suite Matrix (MultiPass) vs Single Product Card (Individual) */}
          {isMultiPass ? (
            <div style={{
              background: "rgba(0, 0, 0, 0.35)",
              border: "1px solid rgba(236, 72, 153, 0.2)",
              borderRadius: "12px",
              padding: "1rem"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#F472B6", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Sparkles size={14} /> MultiPass Aggregate Entitlements Matrix
                </div>
                <div style={{ fontSize: "0.74rem", color: sliderAmount >= 595 ? "#C084FC" : sliderAmount >= 196 ? "#38BDF8" : "#94A3B8", fontWeight: 600 }}>
                  {sliderAmount >= 595 
                    ? "Full Organization Enterprise Fleet Stack Unlocked (All Products)" 
                    : sliderAmount >= 196 
                    ? "MultiPass Pro Active Across All 6 Developer & Security Products" 
                    : "Free Suite Tier Active (Slide to $196/mo to unlock MultiPass Pro)"}
                </div>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: "8px"
              }}>
                {[
                  { id: 'pureide', name: 'PureIDE', proMin: 196, entMin: 595 },
                  { id: 'uvi', name: 'Vantage', proMin: 196, entMin: 595 },
                  { id: 'kinetic', name: 'Kinetic', proMin: 196, entMin: 595 },
                  { id: 'inquest', name: 'Inquest', proMin: 196, entMin: 595 },
                  { id: 'praxis', name: 'Praxis', proMin: 196, entMin: 595 },
                  { id: 'pureos', name: 'PureOS', proMin: 196, entMin: 595 },
                  { id: 'axiom', name: 'Axiom', proMin: 595, entMin: 595 }
                ].map(p => {
                  const isEnt = sliderAmount >= p.entMin;
                  const isPro = sliderAmount >= p.proMin;
                  const status = isEnt ? "Enterprise" : isPro ? "Pro" : "Community";
                  const color = isEnt ? "#C084FC" : isPro ? "#38BDF8" : "#34D399";
                  return (
                    <div key={p.id} style={{ background: "rgba(255, 255, 255, 0.03)", borderRadius: "8px", padding: "8px", textAlign: "center" }}>
                      <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "4px" }}>{p.name}</div>
                      <span style={{ fontSize: "0.68rem", fontWeight: 800, color, background: `${color}20`, padding: "2px 6px", borderRadius: "4px", border: `1px solid ${color}40`, textTransform: "uppercase" }}>
                        {status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Dedicated Single Product Relative Entitlement Feedback */
            <div style={{
              background: "rgba(0, 0, 0, 0.35)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "1rem"
            }}>
              {(() => {
                const isAxiom = selectedProduct === "axiom";
                const isEnt = sliderAmount >= 149;
                const isPro = !isAxiom && sliderAmount >= 49;
                const tierName = isEnt ? "Enterprise" : isPro ? "Pro" : "Community";
                const tierColor = isEnt ? "#C084FC" : isPro ? "#38BDF8" : "#34D399";
                const activePlan = plans[selectedProduct].find(p => p.tier === (isEnt ? "enterprise" : isPro ? "pro" : "free")) || plans[selectedProduct][0];

                return (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {productMeta[selectedProduct].icon}
                        <span style={{ fontSize: "0.92rem", fontWeight: 800, color: "#FFFFFF" }}>
                          {productMeta[selectedProduct].name} Entitlement Status:
                        </span>
                        <span style={{
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          color: tierColor,
                          background: `${tierColor}20`,
                          padding: "2px 8px",
                          borderRadius: "4px",
                          border: `1px solid ${tierColor}40`,
                          textTransform: "uppercase"
                        }}>
                          {tierName} TIER ({sliderAmount >= (isEnt ? 149 : isPro ? 49 : 0) ? "UNLOCKED" : "PENDING"})
                        </span>
                      </div>

                      <div style={{ fontSize: "0.76rem", color: "#94A3B8" }}>
                        {isEnt ? (
                          <span style={{ color: "#C084FC", fontWeight: 700 }}>✓ Organization Fleet &amp; SLA Unlocked</span>
                        ) : isPro ? (
                          <span>Slide to <strong style={{ color: "#C084FC" }}>$149/mo</strong> to unlock Enterprise</span>
                        ) : isAxiom ? (
                          <span>Slide to <strong style={{ color: "#C084FC" }}>$149/mo</strong> to unlock Enterprise LMS API</span>
                        ) : (
                          <span>Slide to <strong style={{ color: "#38BDF8" }}>$49/mo</strong> to unlock Pro</span>
                        )}
                      </div>
                    </div>

                    <div style={{ fontSize: "0.8rem", color: "#CBD5E1", marginBottom: "10px" }}>
                      {activePlan.description}
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {activePlan.features.slice(0, 4).map((f, i) => (
                        <span key={i} style={{
                          fontSize: "0.72rem",
                          background: "rgba(255, 255, 255, 0.05)",
                          color: "#E2E8F0",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          padding: "2px 8px",
                          borderRadius: "6px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px"
                        }}>
                          <Check size={11} color={tierColor} />
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Action Trigger Button */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
            <button
              onClick={() => {
                if (isMultiPass) {
                  if (sliderAmount === 0) {
                    handlePlanSelect("free", "Free Suite", 0);
                  } else if (sliderAmount >= 595) {
                    handlePlanSelect("enterprise", "MultiPass Enterprise", sliderAmount);
                  } else if (sliderAmount >= 196) {
                    handlePlanSelect("pro", "MultiPass Pro", sliderAmount);
                  } else {
                    handlePlanSelect("pro", "MultiPass Supporter", sliderAmount);
                  }
                } else if (selectedProduct === "axiom") {
                  if (sliderAmount >= 149) {
                    handlePlanSelect("enterprise", "Axiom Enterprise LMS", sliderAmount);
                  } else {
                    handlePlanSelect("free", "Community", 0);
                  }
                } else {
                  if (sliderAmount === 0) {
                    handlePlanSelect("free", "Community", 0);
                  } else if (sliderAmount >= 149) {
                    handlePlanSelect("enterprise", `${productMeta[selectedProduct].name} Enterprise`, sliderAmount);
                  } else if (sliderAmount >= 49) {
                    handlePlanSelect("pro", `${productMeta[selectedProduct].name} Pro`, sliderAmount);
                  } else {
                    handlePlanSelect("free", "Community", 0);
                  }
                }
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "0.7rem 1.5rem",
                borderRadius: "8px",
                background: isMultiPass
                  ? "linear-gradient(135deg, #EC4899 0%, #A855F7 100%)"
                  : "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)",
                color: isMultiPass ? "#FFFFFF" : "#041019",
                fontWeight: 800,
                fontSize: "0.88rem",
                border: "none",
                cursor: "pointer",
                boxShadow: isMultiPass 
                  ? "0 2px 14px rgba(236, 72, 153, 0.4)" 
                  : "0 2px 12px rgba(6, 182, 212, 0.3)"
              }}
            >
              {isMultiPass ? (
                sliderAmount === 0 
                  ? "Activate Free Suite ($0/mo)" 
                  : sliderAmount >= 595
                  ? `Unlock MultiPass Enterprise at $${sliderAmount}/mo →`
                  : sliderAmount >= 196
                  ? `Unlock MultiPass Pro at $${sliderAmount}/mo →`
                  : `Activate MultiPass Supporter at $${sliderAmount}/mo →`
              ) : (
                sliderAmount === 0 
                  ? `Activate Free Community Tier ($0/mo)` 
                  : `Activate ${productMeta[selectedProduct].name} at $${sliderAmount}/mo →`
              )}
            </button>
          </div>
        </div>

        {/* Current Product Descriptor Banner */}
        <div style={{ marginTop: "1.25rem", color: "#64748B", fontSize: "0.9rem" }}>
          Selected Product: <strong style={{ color: productMeta[selectedProduct].color }}>{productMeta[selectedProduct].name}</strong> — {productMeta[selectedProduct].subtitle}
        </div>

        {/* Billing Cycle Toggle */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "1.5rem" }}>
          <span style={{ fontSize: "0.85rem", color: billingCycle === "monthly" ? "#FFFFFF" : "#64748B", fontWeight: 600 }}>
            Monthly Billed
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
            aria-label="Toggle billing cycle"
            style={{
              width: "48px",
              height: "26px",
              background: billingCycle === "annual" ? productMeta[selectedProduct].color : "rgba(255, 255, 255, 0.15)",
              borderRadius: "999px",
              border: "none",
              padding: "3px",
              cursor: "pointer",
              position: "relative",
              transition: "background 0.2s ease"
            }}
          >
            <div style={{
              width: "20px",
              height: "20px",
              background: "white",
              borderRadius: "50%",
              transform: billingCycle === "annual" ? "translateX(22px)" : "translateX(0)",
              transition: "transform 0.2s ease"
            }} />
          </button>
          <span style={{ fontSize: "0.85rem", color: billingCycle === "annual" ? "#FFFFFF" : "#64748B", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
            Annual Billed
            <span style={{ fontSize: "0.7rem", background: "rgba(34, 197, 94, 0.2)", color: "#86EFAC", border: "1px solid rgba(34, 197, 94, 0.4)", padding: "1px 6px", borderRadius: "999px", fontWeight: 800 }}>
              SAVE ~20%
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: plans[selectedProduct].length === 2 ? "repeat(auto-fit, minmax(320px, 420px))" : "repeat(auto-fit, minmax(310px, 1fr))", 
        justifyContent: "center",
        gap: "2rem", 
        marginBottom: "3rem",
        maxWidth: plans[selectedProduct].length === 2 ? "900px" : undefined,
        marginLeft: "auto",
        marginRight: "auto"
      }}>
        {plans[selectedProduct].map((plan) => {
          const isCurrent = currentTier === plan.tier;
          const price = billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly;
          const accentColor = productMeta[selectedProduct].color;

          return (
            <div
              key={plan.tier}
              style={{
                background: "linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(10, 15, 26, 0.98) 100%)",
                border: isCurrent 
                  ? `2px solid ${accentColor}` 
                  : plan.isPopular 
                    ? `1px solid ${accentColor}88` 
                    : "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                boxShadow: plan.isPopular ? `0 20px 40px -15px ${accentColor}33` : "none"
              }}
            >
              {plan.isPopular && (
                <div style={{
                  position: "absolute",
                  top: "-12px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: productMeta[selectedProduct].bgGradient,
                  color: "white",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  padding: "3px 12px",
                  borderRadius: "999px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  boxShadow: `0 0 15px ${accentColor}55`
                }}>
                  Most Popular
                </div>
              )}

              {isCurrent && (
                <div style={{
                  position: "absolute",
                  top: "1.25rem",
                  right: "1.25rem",
                  background: `${accentColor}25`,
                  color: accentColor,
                  border: `1px solid ${accentColor}55`,
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: "6px",
                  textTransform: "uppercase"
                }}>
                  Active Plan
                </div>
              )}

              <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.5rem 0" }}>
                {plan.name}
              </h3>
              <p style={{ color: "#94A3B8", fontSize: "0.85rem", lineHeight: 1.5, margin: "0 0 1.5rem 0", minHeight: "42px" }}>
                {plan.description}
              </p>

              {/* Price */}
              <div style={{ marginBottom: "1.75rem", display: "flex", flexDirection: "column", gap: "2px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                  <span style={{ fontSize: "2.5rem", fontWeight: 900, color: "#FFFFFF" }}>${price}</span>
                  <span style={{ color: "#94A3B8", fontSize: "0.9rem", fontWeight: 500 }}>
                    {price === 0 ? "forever" : "/mo"}
                  </span>
                  {price > 0 && billingCycle === "annual" && (
                    <span style={{ fontSize: "0.72rem", color: "#86EFAC", marginLeft: "6px", fontWeight: 600 }}>
                      billed annually
                    </span>
                  )}
                </div>
                <div style={{
                  fontSize: "0.72rem",
                  marginTop: "6px",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontWeight: 700,
                  background: sliderAmount >= price ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.05)",
                  color: sliderAmount >= price ? "#34D399" : "#94A3B8",
                  border: sliderAmount >= price ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)"
                }}>
                  {sliderAmount >= price ? "✓ ENABLED AT CURRENT THRESHOLD" : `REQUIRES THRESHOLD ≥ $${price}/MO`}
                </div>
              </div>

              {/* Features List */}
              <div style={{ marginBottom: "2rem", flex: 1 }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#CBD5E1", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
                  What's Included:
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {plan.features.map(feat => (
                    <li key={feat} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "0.84rem", color: "#E2E8F0", lineHeight: 1.4 }}>
                      <Check size={15} color="#34D399" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                disabled={isCurrent || isSwitchingFree}
                onClick={() => handlePlanSelect(plan.tier, plan.name, price)}
                className={isCurrent ? "" : "btn-primary"}
                style={{
                  width: "100%",
                  padding: "0.85rem",
                  fontSize: "0.92rem",
                  fontWeight: 700,
                  background: isCurrent 
                    ? "rgba(255, 255, 255, 0.05)" 
                    : plan.isPopular 
                      ? productMeta[selectedProduct].bgGradient
                      : undefined,
                  border: isCurrent ? "1px solid rgba(255, 255, 255, 0.1)" : undefined,
                  color: isCurrent ? "#64748B" : "#FFFFFF",
                  cursor: isCurrent ? "default" : "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                {isCurrent ? "Current Plan" : (price === 0 ? "Select Free Tier" : `${plan.cta} →`)}
              </button>
            </div>
          );
        })}
      </div>

      {/* Enterprise Custom Assistance Banner */}
      <div style={{
        background: "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)",
        border: "1px solid rgba(59, 130, 246, 0.3)",
        borderRadius: "20px",
        padding: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1.5rem",
        flexWrap: "wrap"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            background: "rgba(59, 130, 246, 0.15)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            display: "grid",
            placeItems: "center",
            color: "#60A5FA"
          }}>
            <Building2 size={28} />
          </div>
          <div>
            <h4 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.25rem 0" }}>
              Need Custom Airgap Deployments, Enclave Licensing, or Corporate Purchase Orders?
            </h4>
            <p style={{ color: "#94A3B8", fontSize: "0.88rem", margin: 0 }}>
              We support SAML 2.0 SSO, offline hardware enclave licensing, customized legal precedent suites, and Net-30 enterprise invoicing.
            </p>
          </div>
        </div>

        <Link
          href="/account?tab=overview"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "10px",
            padding: "10px 20px",
            color: "#FFFFFF",
            fontSize: "0.88rem",
            fontWeight: 700,
            textDecoration: "none"
          }}
        >
          Return to Customer Portal →
        </Link>
      </div>

      <PaymentModal />
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "80vh", display: "grid", placeItems: "center", color: "#94A3B8" }}>
        Loading subscription suites...
      </div>
    }>
      <SubscriptionContent />
    </Suspense>
  );
}
