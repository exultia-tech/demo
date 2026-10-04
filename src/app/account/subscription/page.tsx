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
  InquestIcon, 
  PraxisIcon, 
  PureOsIcon, 
  AxiomIcon 
} from "@/components/BrandIcons";
import PaymentModal from "@/components/billing/PaymentModal";

type ProductKey = "pureide" | "uvi" | "inquest" | "fixlist" | "pureos" | "axiom";

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
  const validProducts: ProductKey[] = ["pureide", "uvi", "inquest", "fixlist", "pureos", "axiom"];
  
  const { user, openPaymentModal, getUserTier, refreshUser } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<ProductKey>(
    validProducts.includes(initialProduct) ? initialProduct : "pureide"
  );
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [isSwitchingFree, setIsSwitchingFree] = useState(false);

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
        name: "Community Developer",
        priceMonthly: 0,
        priceAnnual: 0,
        description: "Zero-telemetry open-source workstation compiler for individual security researchers.",
        features: [
          "Standard sandbox compiler triggers",
          "Telemetry stripping engine",
          "Local extension verification",
          "Community build queue",
          "Public GitHub advisory checks"
        ],
        cta: "Current Free Tier",
        isPopular: false
      },
      {
        tier: "pro",
        name: "Pro Workstation",
        priceMonthly: 59,
        priceAnnual: 49,
        description: "Priority compiler engine, dedicated build runner, and real-time egress firewall.",
        features: [
          "Everything in Community",
          "Priority dedicated cloud builds",
          "Real-time egress socket firewall",
          "Secrets scanner & token redaction",
          "Automated SBOM generation",
          "5 active workstation deployments"
        ],
        cta: "Upgrade to Pro",
        isPopular: true
      },
      {
        tier: "enterprise",
        name: "Hermetic Enterprise",
        priceMonthly: 349,
        priceAnnual: 299,
        description: "Strict airgap signing, offline cryptographic cosign, and custom organizational policies.",
        features: [
          "Everything in Pro",
          "Hermetic offline binary cosign",
          "Custom organization extension policies",
          "Zero-egress hardware attestation",
          "Dedicated self-hosted compiler agent",
          "Unlimited workstation nodes",
          "24/7 Priority SLA & security architect support"
        ],
        cta: "Upgrade to Enterprise",
        isPopular: false
      }
    ],
    uvi: [
      {
        tier: "free",
        name: "Community Intel",
        priceMonthly: 0,
        priceAnnual: 0,
        description: "Web catalog access to 110+ aggregated vulnerability feeds with basic search.",
        features: [
          "Web portal vulnerability search",
          "CISA KEV & NVD CVE browsing",
          "Standard CVSS score breakdowns",
          "Public advisory catalog",
          "Rate-limited REST API queries (60/min)"
        ],
        cta: "Current Free Tier",
        isPopular: false
      },
      {
        tier: "pro",
        name: "Threat Intel Pro",
        priceMonthly: 119,
        priceAnnual: 99,
        description: "Real-time threat feed streams, zero-day early warnings, and workstation risk vectors.",
        features: [
          "Everything in Community",
          "Real-time CVSS v3.1 & v4.0 live streaming",
          "Workstation & IDE specific exploit warnings",
          "Automated patch timeline intelligence",
          "API rate limit: 10,000 requests/min",
          "Custom threat bookmarking & alerting"
        ],
        cta: "Upgrade to Pro",
        isPopular: true
      },
      {
        tier: "enterprise",
        name: "Global Feed Enterprise",
        priceMonthly: 599,
        priceAnnual: 499,
        description: "High-throughput webhook ingestion, raw bulk dataset dumps, and private threat submissions.",
        features: [
          "Everything in Pro",
          "Kafka & Webhook real-time advisory streaming",
          "Daily bulk JSON / Parquet dataset exports",
          "Private vulnerability intake & triage pipeline",
          "Direct CISO advisory hotline",
          "Custom threat classification taxonomy",
          "Unmetered dedicated API endpoints"
        ],
        cta: "Upgrade to Enterprise",
        isPopular: false
      }
    ],
    inquest: [
      {
        tier: "free",
        name: "Community Standard",
        priceMonthly: 0,
        priceAnnual: 0,
        description: "Basic FOIA drafting and statutory agency routing for journalists and researchers.",
        features: [
          "Draft up to 3 active FOIA requests",
          "Agency statutory directory search",
          "Standard Bates numbering generator",
          "Basic exemption code definitions",
          "Local browser case storage"
        ],
        cta: "Current Free Tier",
        isPopular: false
      },
      {
        tier: "legal",
        name: "Legal Discovery Pro",
        priceMonthly: 179,
        priceAnnual: 149,
        description: "Autonomous administrative appeal generator, 9-exemption de-redaction scanner, and docket sync.",
        features: [
          "Everything in Community",
          "Unlimited active discovery cases",
          "Statutory administrative appeal brief builder",
          "Exemption 4 / 7(A) burden-of-proof scanner",
          "OCR evidence indexing & redaction tagging",
          "Automated agency statutory response deadlines",
          "Glomar challenge defense assistant"
        ],
        cta: "Upgrade to Legal Pro",
        isPopular: true
      },
      {
        tier: "enterprise",
        name: "Firm & Agency Suite",
        priceMonthly: 599,
        priceAnnual: 499,
        description: "Multi-seat litigation workspace, court filing export, and dedicated legal tech support.",
        features: [
          "Everything in Legal Pro",
          "Multi-attorney docket sharing & collaboration",
          "Federal court complaint generation (APA / 552)",
          "Bates vault with cryptographically hashed chain of custody",
          "Agency compliance dashboard & FOIA officer tools",
          "Dedicated paralegal data onboarding",
          "Custom litigation templates & precedent library"
        ],
        cta: "Upgrade to Enterprise",
        isPopular: false
      }
    ],
    fixlist: [
      {
        tier: "free",
        name: "Community Remediation",
        priceMonthly: 0,
        priceAnnual: 0,
        description: "Essential vulnerability tracking and manual fix script generation for security researchers.",
        features: [
          "Standard manual script generations",
          "Basic localhost remediation mode",
          "Public CVE fix-list checklist",
          "REST API access (50 requests/mo)",
          "Community advisory tracking"
        ],
        cta: "Current Free Tier",
        isPopular: false
      },
      {
        tier: "pro",
        name: "Automated Remediation Pro",
        priceMonthly: 79,
        priceAnnual: 65,
        description: "Automated patch generation with surgical Bash, PowerShell, and Ansible fix payloads.",
        features: [
          "Everything in Community",
          "Unlimited automated script generation",
          "Surgical Bash, PowerShell & Ansible payloads",
          "3 Custom SIEM & Firewall export formats",
          "Direct Vantage CVE correlation",
          "REST API access (10,000 requests/mo)"
        ],
        cta: "Upgrade to Pro",
        isPopular: true
      },
      {
        tier: "enterprise",
        name: "Fleet Patch Automation",
        priceMonthly: 399,
        priceAnnual: 319,
        description: "Enterprise-wide fleet automated patch deployment, SIEM hooks, and air-gapped script signing.",
        features: [
          "Everything in Pro",
          "Full global fleet patch orchestration",
          "All Firewall/EDR export formats (CrowdStrike, Sentinel, Splunk)",
          "Custom SIEM real-time webhook listeners",
          "Air-gapped offline script cosigning & validation",
          "Dedicated CSM, white-glove onboarding & 99.99% SLA"
        ],
        cta: "Upgrade to Enterprise",
        isPopular: false
      }
    ],
    pureos: [
      {
        tier: "free",
        name: "Community Base Images",
        priceMonthly: 0,
        priceAnnual: 0,
        description: "Essential CIS Level 1 hardened container images for independent developers.",
        features: [
          "Access to Alpine & Debian hardened base images",
          "CIS Level 1 Baseline security configuration",
          "Monthly Vantage sync updates",
          "Standard Docker & OCI container format",
          "Public cryptographic signature verification"
        ],
        cta: "Current Free Tier",
        isPopular: false
      },
      {
        tier: "pro",
        name: "Verified Stacks Pro",
        priceMonthly: 59,
        priceAnnual: 49,
        description: "Production-ready hardened runtimes with daily zero-day patch rebuilds and minimal attack surfaces.",
        features: [
          "Everything in Community",
          "All base OS & language runtimes (Node, Python, Go, Rust)",
          "CIS Level 2 strict airgap hardening",
          "Daily zero-day patch rebuilds synchronized to Vantage",
          "Distroless minimal attack surface builds (no package managers)",
          "Automated SBOM & cosign cryptographic signatures"
        ],
        cta: "Upgrade to Pro",
        isPopular: true
      },
      {
        tier: "enterprise",
        name: "Sovereign Airgap Hub",
        priceMonthly: 449,
        priceAnnual: 359,
        description: "Private container registry proxy, custom golden images, and enclave-based hardware attestation.",
        features: [
          "Everything in Pro",
          "Private container registry proxy (ACR, ECR, GCR, Harbor)",
          "Custom organizational golden image builder",
          "Enclave-based offline attestation & hardware roots of trust",
          "Guaranteed 4-hour SLA for critical CVE zero-day mitigations",
          "Dedicated OS security architect & custom kernel compilation"
        ],
        cta: "Upgrade to Enterprise",
        isPopular: false
      }
    ],
    axiom: [
      {
        tier: "free",
        name: "Student / Foundation",
        priceMonthly: 0,
        priceAnnual: 0,
        description: "Comprehensive exam prep and simulator for individual cybersecurity researchers and students.",
        features: [
          "Full access to 15,000+ certification questions",
          "Interactive exam simulator with real-time timers",
          "Instant explanations, key concepts & immediate feedback",
          "Checkpoint scores & domain progress tracking",
          "CompTIA, CISSP, CEH, AWS Security syllabus coverage"
        ],
        cta: "Current Free Tier",
        isPopular: false
      },
      {
        tier: "pro",
        name: "Certified Professional",
        priceMonthly: 49,
        priceAnnual: 39,
        description: "Hands-on attack & defense lab simulations, domain weakness diagnosis, and printable study guides.",
        features: [
          "Everything in Free",
          "Interactive terminal hands-on attack & defense labs",
          "Detailed domain performance analytics & weak-spot diagnosis",
          "Printable PDF study guides & flashcard generation",
          "Unlimited practice exam attempts & history exports",
          "Priority simulation engine & offline study mode"
        ],
        cta: "Upgrade to Pro",
        isPopular: true
      },
      {
        tier: "enterprise",
        name: "LMS API Integration",
        priceMonthly: 299,
        priceAnnual: 249,
        description: "Enterprise REST API, SCORM/xAPI exports, and organizational team benchmarking.",
        features: [
          "Everything in Pro",
          "Dedicated Enterprise REST API endpoints for question banks",
          "SCORM & xAPI compatible exports for internal LMS",
          "Multi-student progress benchmarking & corporate scorecards",
          "Private custom question publishing & grading pipeline",
          "SSO SAML 2.0 integration & dedicated education advisor"
        ],
        cta: "Upgrade to Enterprise",
        isPopular: false
      }
    ]
  };

  const productMeta: Record<ProductKey, { name: string; subtitle: string; icon: React.ReactNode; color: string; bgGradient: string }> = {
    pureide: {
      name: "PureIDE Workstations",
      subtitle: "Zero-telemetry developer environment compiler & egress firewall",
      icon: <PureIdeIcon size={18} glow={false} />,
      color: "#3B82F6",
      bgGradient: "linear-gradient(135deg, #3B82F6, #2563EB)"
    },
    uvi: {
      name: "Vantage Threat Intel",
      subtitle: "Universal vulnerability feed aggregating 110+ threat sources",
      icon: <VantageIcon size={18} glow={false} />,
      color: "#8B5CF6",
      bgGradient: "linear-gradient(135deg, #8B5CF6, #7C3AED)"
    },
    inquest: {
      name: "Inquest FOIA Legal",
      subtitle: "Autonomous public records compliance & 9-exemption discovery vault",
      icon: <InquestIcon size={18} glow={false} />,
      color: "#06B6D4",
      bgGradient: "linear-gradient(135deg, #06B6D4, #0891B2)"
    },
    fixlist: {
      name: "Praxis Fix-List",
      subtitle: "Surgical vulnerability remediation & automated patch payloads",
      icon: <PraxisIcon size={18} glow={false} />,
      color: "#F59E0B",
      bgGradient: "linear-gradient(135deg, #F59E0B, #D97706)"
    },
    pureos: {
      name: "PureOS Containers",
      subtitle: "Pre-hardened CIS container images synchronized to Vantage",
      icon: <PureOsIcon size={18} glow={false} />,
      color: "#10B981",
      bgGradient: "linear-gradient(135deg, #10B981, #059669)"
    },
    axiom: {
      name: "Axiom Simulator",
      subtitle: "Cybersecurity certification prep & enterprise LMS API engine",
      icon: <AxiomIcon size={18} glow={false} />,
      color: "#F43F5E",
      bgGradient: "linear-gradient(135deg, #F43F5E, #E11D48)"
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>
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
              <div style={{ marginBottom: "1.75rem", display: "flex", alignItems: "baseline", gap: "4px" }}>
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
