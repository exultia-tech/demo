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
  CheckCircle2,
  Users
} from "lucide-react";
import { 
  PureIdeIcon, 
  VantageIcon, 
  KineticIcon, 
  PraxisIcon, 
  PureOsIcon, 
  AxiomIcon 
} from "@/components/BrandIcons";
import PaymentModal from "@/components/billing/PaymentModal";

type ProductKey = "pureide" | "uvi" | "kinetic" | "praxis" | "pureos" | "axiom" | "multipass";

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
  const validProducts: ProductKey[] = ["pureide", "uvi", "kinetic", "praxis", "pureos", "axiom", "multipass"];
  
  const { user, openPaymentModal, getUserTier, refreshUser } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<ProductKey>(
    validProducts.includes(initialProduct) ? initialProduct : "pureide"
  );
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [isSwitchingFree, setIsSwitchingFree] = useState(false);
  
  const isMultiPass = selectedProduct === "multipass";
  const isKinetic = selectedProduct === "kinetic";

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
        priceMonthly: 499,
        priceAnnual: 399,
        description: "Strict airgap signing, offline cryptographic cosign, and organization-wide volume entitlements.",
        features: [
          "Everything in Pro",
          "Code-signing & EDR integrity",
          "Custom enterprise role blueprints",
          "Immutable binary encapsulation",
          "Automated enterprise cloud build runners"
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
        name: "Enterprise Commercial Feed",
        priceMonthly: 499,
        priceAnnual: 399,
        description: "Commercial redistributable feed, high-frequency webhook ingest, and raw STIX/TAXII/JSON feeds.",
        features: [
          "Everything in Pro",
          "Commercial Redistributable Threat & Patch Feeds",
          "Real-time Enterprise SIEM Webhooks (Splunk, Sentinel, QRadar)",
          "Automated CISO Briefing Generator & Report Portal",
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
          "Up to 2 Active Nodes Free Forever",
          "Standard Vantage CVE synchronization",
          "Manual hotfix inspection & verification",
          "Deterministic rollback recipes",
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
        description: "Autonomous patch streaming daemon, zero-agent systemd runner, and sub-second deterministic rollback engine. Billed per active host ($49/host/mo).",
        features: [
          "Everything in Community",
          "$49/host/mo ($39/host/mo billed annually)",
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
        name: "Enterprise Fleet",
        priceMonthly: 499,
        priceAnnual: 399,
        description: "Phased multi-ring deployment (Ring 0 -> Ring 1 -> Ring 2), Ansible playbooks, and SLSA Level 3 signed manifests. Billed per fleet host ($499/host/mo).",
        features: [
          "Everything in Pro",
          "$499/host/mo ($399/host/mo billed annually)",
          "Phased multi-ring deployment orchestrator",
          "Cosign OIDC SLSA Level 3 signed manifests",
          "Emergency fleet-wide rollback orchestrator",
          "Self-hosted automated test harness"
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
          "Automated compliance verification payload"
        ],
        cta: "Upgrade to Pro",
        isPopular: true
      },
      {
        tier: "enterprise",
        name: "Enterprise",
        priceMonthly: 499,
        priceAnnual: 399,
        description: "Fleet-wide operations scale and compliance tracking.",
        features: [
          "Everything in Pro",
          "Organization Volume Entitlements (Fleet licenses)",
          "Custom internal compliance benchmarking",
          "Automated fleet audit runner"
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
        priceMonthly: 499,
        priceAnnual: 399,
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
        description: "Zero-cost cybersecurity certification exam simulator for individual self-study.",
        features: [
          "Single Student License",
          "Standard exam question banks (Security+, CySA+, CC)",
          "In-browser instant score feedback",
          "Basic practice mode & domain review"
        ],
        cta: "Current Free Tier",
        isPopular: false
      },
      {
        tier: "pro",
        name: "Pro",
        priceMonthly: 49,
        priceAnnual: 39,
        description: "Student transcript export engine, verifiable certificates, and automated score sync API.",
        features: [
          "Everything in Community",
          "Export Course History & Transcripts (CSV & JSON)",
          "Printable Verifiable SHA-256 Certificates",
          "Complete Score Transcripts & Objective Analytics",
          "Programmatic Export REST API Query Access",
          "No question bank limits or cooldown timers"
        ],
        cta: "Upgrade to Pro",
        isPopular: true
      },
      {
        tier: "enterprise",
        name: "Institutional LMS",
        priceMonthly: 499,
        priceAnnual: 399,
        description: "Live LMS simulator embedding feed for colleges, universities, bootcamps, and defense academies.",
        features: [
          "Everything in Pro",
          "Live LMS Simulator Embedding Feed (Canvas, Blackboard, Moodle)",
          "SCORM 1.2 / 2004 & LTI 1.3 Deep Linking Feed API",
          "Institutional Multi-Seat Licensing (Up to 250 students)",
          "Automated Real-Time Gradebook Passback API",
          "SSO SAML 2.0 & Institutional Exam Proctoring Mode",
          "Curriculum Mapping Matrix & Accreditation Alignment Documentation"
        ],
        cta: "Upgrade to Institutional LMS",
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
          "Kinetic Pro (Autonomous per-host patch stream)",
          "Praxis Pro",
          "PureOS Pro",
          "Axiom Pro (Verifiable certs & export API)",
          "Huge Bundle Savings across the entire suite"
        ],
        cta: "Unlock MultiPass Pro",
        isPopular: true
      },
      {
        tier: "enterprise",
        name: "MultiPass Enterprise",
        priceMonthly: 745,
        priceAnnual: 595,
        description: "Organization-wide Enterprise-level access to the complete Exultia stack with self-hosted automation & 24/7 AI Support Agent.",
        features: [
          "PureIDE Enterprise",
          "Vantage Enterprise",
          "Kinetic Enterprise (Fleet-wide patch orchestrator)",
          "Praxis Enterprise",
          "PureOS Enterprise",
          "Axiom Enterprise LMS API",
          "Cosign SLSA Level 3 signed manifests",
          "24/7 AI Support Agent & automated self-hosted test suites",
          "Massive MultiPass Enterprise Bundle Savings"
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
          Seamlessly scale your developer workstation security, global threat intelligence feeds, automated patch remediation, hardened OS images, and certification simulators.
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
              {(() => {
                const isFree = plan.tier === "free" || plan.priceMonthly === 0;
                const price = isFree ? 0 : (billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly);

                // MultiPass Bundle Savings:
                // Standalone individual products cost $49/mo ($39 annual) for Pro, $499/mo ($399 annual) for Enterprise.
                // MultiPass bundles them with massive multi-product savings:
                const isMultiPassPlan = isMultiPass && !isFree;
                const singleProductRate = plan.tier === "pro" 
                  ? (billingCycle === "annual" ? 39 : 49) 
                  : (billingCycle === "annual" ? 399 : 499);
                const bundleSavings = isMultiPassPlan ? singleProductRate : 0;
                const unbundledPrice = price + bundleSavings;

                return (
                  <div style={{ marginBottom: "1.75rem", display: "flex", flexDirection: "column", gap: "2px" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "6px", flexWrap: "wrap" }}>
                      {isMultiPassPlan && (
                        <span style={{
                          fontSize: "1.4rem",
                          fontWeight: 700,
                          color: "#64748B",
                          textDecoration: "line-through",
                          marginRight: "2px"
                        }}>
                          ${unbundledPrice}
                        </span>
                      )}
                      <span style={{ fontSize: "2.5rem", fontWeight: 900, color: "#FFFFFF" }}>${price}</span>
                      <span style={{ color: "#94A3B8", fontSize: "0.9rem", fontWeight: 500 }}>
                        {isFree ? "forever" : "/mo"}
                      </span>
                      {!isFree && billingCycle === "annual" && (
                        <span style={{ fontSize: "0.72rem", color: "#86EFAC", marginLeft: "4px", fontWeight: 600 }}>
                          billed annually
                        </span>
                      )}
                    </div>

                    {/* MultiPass 1-Product-Free Savings Badge */}
                    {isMultiPassPlan && (
                      <div style={{
                        marginTop: "6px",
                        background: "linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(168, 85, 247, 0.2) 100%)",
                        border: "1px solid rgba(236, 72, 153, 0.4)",
                        borderRadius: "8px",
                        padding: "6px 10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}>
                        <Sparkles size={14} color="#F472B6" style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#F472B6" }}>
                          Save ${bundleSavings}/mo (1 Product Free!)
                        </span>
                      </div>
                    )}

                    <div style={{
                      fontSize: "0.72rem",
                      marginTop: "6px",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontWeight: 700,
                      background: isFree 
                        ? "rgba(16, 185, 129, 0.15)" 
                        : isMultiPassPlan 
                          ? "rgba(236, 72, 153, 0.15)" 
                          : "rgba(56, 189, 248, 0.15)",
                      color: isFree 
                        ? "#34D399" 
                        : isMultiPassPlan 
                          ? "#F472B6" 
                          : "#38BDF8",
                      border: isFree 
                        ? "1px solid rgba(16, 185, 129, 0.3)" 
                        : isMultiPassPlan 
                          ? "1px solid rgba(236, 72, 153, 0.35)" 
                          : "1px solid rgba(56, 189, 248, 0.3)"
                    }}>
                      {isFree 
                        ? (isKinetic ? "✓ 1 HOST NODE INCLUDED FREE FOREVER" : "✓ 1 USER SEAT INCLUDED FREE FOREVER")
                        : isMultiPassPlan 
                          ? "✓ COMPLETE SUITE BUNDLE • 1 PRODUCT FREE" 
                          : (isKinetic ? "✓ FIXED FLEET PRESET TIER" : "✓ FIXED PRESET TIER")}
                    </div>
                  </div>
                );
              })()}

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
              {(() => {
                const isFree = plan.tier === "free" || plan.priceMonthly === 0;
                const price = isFree ? 0 : (billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly);
                const planLabel = plan.name;

                return (
                  <button
                    disabled={isCurrent || isSwitchingFree}
                    onClick={() => handlePlanSelect(plan.tier, planLabel, price)}
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
                    {isCurrent 
                      ? "Current Plan" 
                      : isFree 
                        ? "Select Free Tier" 
                        : `${plan.cta} →`}
                  </button>
                );
              })()}
            </div>
          );
        })}
      </div>

      {/* Autonomous Operational Scope & No-Human-SLA Policy */}
      <div style={{
        marginTop: "3rem",
        marginBottom: "2rem",
        background: "linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 26, 0.98) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        borderRadius: "20px",
        padding: "2rem 2.5rem",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem", flexWrap: "wrap" }}>
          <ShieldCheck size={22} color="#38BDF8" />
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
            Exultia Operational Model &amp; Enterprise Support Policy
          </h3>
          <span style={{
            fontSize: "0.72rem",
            background: "rgba(56, 189, 248, 0.15)",
            color: "#38BDF8",
            border: "1px solid rgba(56, 189, 248, 0.3)",
            padding: "2px 8px",
            borderRadius: "6px",
            fontWeight: 700,
            textTransform: "uppercase"
          }}>
            Clear Boundaries • No Surprises
          </span>
        </div>

        <p style={{ color: "#94A3B8", fontSize: "0.88rem", lineHeight: 1.6, margin: "0 0 1.5rem 0", maxWidth: "900px" }}>
          Exultia is engineered as a lean, focused independent cybersecurity lab. We prioritize rock-solid deterministic code, self-hosted deployment, sub-second atomic rollbacks, and full transparency about our support model:
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
          <div style={{ background: "rgba(0, 0, 0, 0.35)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#F43F5E", fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.5rem" }}>
              <span>❌ No Human SLAs or 24/7 Pagers</span>
            </div>
            <p style={{ color: "#94A3B8", fontSize: "0.82rem", lineHeight: 1.5, margin: 0 }}>
              Standard SaaS and Enterprise subscriptions do <strong>not</strong> include contractual human uptime SLAs, 1-hour response guarantees, or 24/7 on-call phone paging. We will never overpromise human availability that we cannot sustain.
            </p>
          </div>

          <div style={{ background: "rgba(0, 0, 0, 0.35)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#34D399", fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.5rem" }}>
              <CheckCircle2 size={16} color="#34D399" />
              <span>Autonomous &amp; Self-Verifying Software</span>
            </div>
            <p style={{ color: "#94A3B8", fontSize: "0.82rem", lineHeight: 1.5, margin: 0 }}>
              All software (Kinetic, PureIDE, Vantage, Praxis, PureOS, Axiom) is engineered to be self-hosted and self-verifying. Built-in test harnesses and sub-second rollbacks eliminate fear of production downtime.
            </p>
          </div>

          <div style={{ background: "rgba(0, 0, 0, 0.35)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#60A5FA", fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.5rem" }}>
              <HelpCircle size={16} color="#60A5FA" />
              <span>24/7 AI Sentinel &amp; Technical Docs</span>
            </div>
            <p style={{ color: "#94A3B8", fontSize: "0.82rem", lineHeight: 1.5, margin: 0 }}>
              Routine technical assistance, install commands, license sizing, and error explanations are answered instantly 24/7 by our Autonomous AI Support Agent. Reproducible issues are tracked transparently via GitHub.
            </p>
          </div>

          <div style={{ background: "rgba(0, 0, 0, 0.35)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#F59E0B", fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.5rem" }}>
              <Building2 size={16} color="#F59E0B" />
              <span>Custom MSAs &amp; Retainers</span>
            </div>
            <p style={{ color: "#94A3B8", fontSize: "0.82rem", lineHeight: 1.5, margin: 0 }}>
              Organizations requiring legally binding uptime SLAs, on-site personnel, or custom software development require a separately negotiated Master Services Agreement (MSA) with bespoke retainer pricing.
            </p>
          </div>
        </div>
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
