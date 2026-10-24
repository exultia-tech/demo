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
  Users,
  RotateCcw
} from "lucide-react";
import { 
  PureIdeIcon, 
  VantageIcon, 
  PraxisIcon, 
  PureOsIcon, 
  AxiomIcon,
  ErisIcon,
  ValkyrieIcon
} from "@/components/BrandIcons";
import PaymentModal from "@/components/billing/PaymentModal";
import { calculateErisDiscount, getErisPrice } from "@/lib/eris-pricing";
import { calculateBundleDiscount, getDiscountedProductPrice } from "@/lib/bundle-pricing";

type ProductKey = "pureide" | "uvi" | "praxis" | "pureos" | "axiom" | "eris" | "valkyrie" | "multipass";

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
  const validProducts: ProductKey[] = ["pureide", "uvi", "praxis", "pureos", "axiom", "eris", "valkyrie", "multipass"];
  
  const { user, openPaymentModal, getUserTier, refreshUser } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<ProductKey>(
    validProducts.includes(initialProduct) ? initialProduct : "pureide"
  );
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [isSwitchingFree, setIsSwitchingFree] = useState(false);
  
  const isMultiPass = selectedProduct === "multipass";
  const isPraxis = selectedProduct === "praxis";
  const isEris = selectedProduct === "eris";
  const isValkyrie = selectedProduct === "valkyrie";

  // Ownership detection for bundle discounts (Vantage = 'uvi', Praxis = 'praxis', Eris = 'eris', Valkyrie = 'valkyrie', MultiPass = all)
  const hasVantageActual = getUserTier("uvi") !== "free" || getUserTier("multipass") !== "free";
  const hasPraxisActual = getUserTier("praxis") !== "free" || getUserTier("multipass") !== "free";
  const hasErisActual = getUserTier("eris") !== "free" || getUserTier("multipass") !== "free";
  const hasValkyrieActual = getUserTier("valkyrie") !== "free" || getUserTier("multipass") !== "free";

  const [previewVantage, setPreviewVantage] = useState<boolean | null>(null);
  const [previewPraxis, setPreviewPraxis] = useState<boolean | null>(null);
  const [previewEris, setPreviewEris] = useState<boolean | null>(null);
  const [previewValkyrie, setPreviewValkyrie] = useState<boolean | null>(null);

  const hasVantage = previewVantage !== null ? previewVantage : hasVantageActual;
  const hasPraxis = previewPraxis !== null ? previewPraxis : hasPraxisActual;
  const hasEris = previewEris !== null ? previewEris : hasErisActual;
  const hasValkyrie = previewValkyrie !== null ? previewValkyrie : hasValkyrieActual;

  const bundleTargetProduct = isValkyrie ? "valkyrie" : "eris";
  const bundleDiscountInfo = calculateBundleDiscount(bundleTargetProduct, {
    hasVantage,
    hasPraxis,
    hasEris,
    hasValkyrie
  });

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
    praxis: [
      {
        tier: "free",
        name: "Community",
        priceMonthly: 0,
        priceAnnual: 0,
        description: "Up to 2 active nodes free forever, standard Vantage CVE sync, manual hotfix recipes, and firewall exports.",
        features: [
          "Up to 2 Active Nodes Free Forever",
          "Standard Vantage CVE synchronization",
          "Manual hotfix inspection & verification",
          "Deterministic rollback recipes",
          "Firewall & domain blocking generator (plain, JSON)"
        ],
        cta: "Current Free Tier",
        isPopular: false
      },
      {
        tier: "pro",
        name: "Pro",
        priceMonthly: 49,
        priceAnnual: 39,
        description: "Autonomous patch streaming daemon, sub-second deterministic rollback engine, pre-flight sentinels, and SIEM exports.",
        features: [
          "Everything in Community",
          "Autonomous patch streaming daemon",
          "Deterministic sub-second rollback engine",
          "Automated pre & post-flight sentinels",
          "Live canary health monitoring",
          "Hardware firewall filters (Cisco, Palo Alto, Fortinet)",
          "Automated bash/ansible patching payloads"
        ],
        cta: "Upgrade to Pro",
        isPopular: true
      },
      {
        tier: "enterprise",
        name: "Enterprise Fleet",
        priceMonthly: 499,
        priceAnnual: 399,
        description: "Phased multi-ring deployment (Ring 0 -> Ring 1 -> Fleet), Ansible playbooks, SLSA Level 3 signed manifests, and fleet volume licenses.",
        features: [
          "Everything in Pro",
          "Phased multi-ring deployment orchestrator",
          "Cosign OIDC SLSA Level 3 signed manifests",
          "Emergency fleet-wide rollback orchestrator",
          "Organization Volume Entitlements (Fleet licenses)",
          "Automated fleet audit runner & compliance matrix"
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
    eris: [
      {
        tier: "free",
        name: "Community Inoculation",
        priceMonthly: 0,
        priceAnnual: 0,
        description: "Zero-cost baseline vulnerability inoculation for local testing and initial validation.",
        features: [
          "5 Default Chaos Inoculation Modules",
          "SSH RegreSSHion & Ingress Socket Scenarios",
          "Self-contained bash script generation",
          "Manual endpoint rollback scripts",
          "Single ephemeral test container recipe"
        ],
        cta: "Current Free Tier",
        isPopular: false
      },
      {
        tier: "pro",
        name: "Pro Chaos Lab",
        priceMonthly: 49,
        priceAnnual: 39,
        description: "Complete vulnerability catalog, timed automated rollbacks, and full 5-container Docker Compose range.",
        features: [
          "Everything in Community",
          "Full Eris Chaos Catalog (All 7+ CVE Scenarios)",
          "Automated Script Compilation API (/api/eris/generate & raw)",
          "Custom Timed Failsafe Rollbacks (10m, 30m, 60m)",
          "Full 5-Container Docker Compose Attack Range",
          "Log4Shell, XZ Backdoor & CUPS Browsed Sandbox Environments",
          "Direct Bridge to Praxis Autonomous Remediation",
          "Eligible for 30%, 40%, or 50% Sovereignty Bundle Discounts"
        ],
        cta: "Upgrade to Pro",
        isPopular: true
      },
      {
        tier: "enterprise",
        name: "Enterprise Chaos Range",
        priceMonthly: 499,
        priceAnnual: 399,
        description: "Multi-node fleet adversary orchestration, custom zero-day builder, and continuous red/blue verification.",
        features: [
          "Everything in Pro",
          "Multi-Node Fleet Chaos Orchestrator (Ansible & Terraform)",
          "Custom CVE & Zero-Day Adversary Inoculator Studio",
          "Dedicated Cloud Sandbox Attack Range Runner",
          "Automated After-Action CBOM Attestation Probes",
          "Continuous Red-Team / Blue-Team Canary Verification Pipelines",
          "Eligible for 30%, 40%, or 50% Sovereignty Bundle Discounts",
          "Organization Volume Entitlements & Custom SLA"
        ],
        cta: "Upgrade to Enterprise",
        isPopular: false
      }
    ],
    valkyrie: [
      {
        tier: "free",
        name: "Community BAS",
        priceMonthly: 0,
        priceAnnual: 0,
        description: "Safe non-destructive vulnerability canaries for local developer workstations and single hosts.",
        features: [
          "5 Standard BAS Pentest Vectors",
          "Safe banner & protocol handshake probes",
          "Standalone bash/cURL script generation",
          "Local workstation probe execution",
          "Instant in-browser simulation sandbox"
        ],
        cta: "Current Free Tier",
        isPopular: false
      },
      {
        tier: "pro",
        name: "Pro Pentest Suite",
        priceMonthly: 49,
        priceAnnual: 39,
        description: "Complete Vantage CVE catalog, Docker cluster range probing, and automated attestation reports.",
        features: [
          "Everything in Community",
          "Full 10+ Vantage CVE Probe Catalog",
          "Remote Endpoint & Docker Container Network Probing",
          "1-Click Bridge to Praxis Hotpatch Generation",
          "1-Click Bridge to Eris Chaos Lab Reproduction",
          "Cryptographic SHA-256 Pentest Attestation Signatures",
          "Eligible for 30%, 40%, or 50% Sovereignty Bundle Discounts"
        ],
        cta: "Upgrade to Pro",
        isPopular: true
      },
      {
        tier: "enterprise",
        name: "Enterprise Fleet BAS",
        priceMonthly: 499,
        priceAnnual: 399,
        description: "Continuous automated perimeter scanning, custom CVE exploit builder, and organization volume licensing.",
        features: [
          "Everything in Pro",
          "Continuous CI/CD & Cloud Attack Surface Probing",
          "Custom Exploit Vector & Zero-Day Canary Builder",
          "Programmatic REST API Execution (/api/valkyrie/probe)",
          "Executive PDF/Markdown Compliance Attestation Reports",
          "Eligible for 30%, 40%, or 50% Sovereignty Bundle Discounts",
          "Dedicated Enterprise SLA & Audit Logging"
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
          "Vantage Pro (127 feeds & vendor errata)",
          "Praxis Pro (Autonomous hotpatching & firewall engine)",
          "PureOS Pro",
          "Axiom Pro (Verifiable certs & export API)",
          "Eris Pro (Adversary simulation & chaos proving ground)",
          "Valkyrie Pro (On-demand pentesting & exploit verification)",
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
          "Vantage Enterprise (Redistributable commercial feed)",
          "Praxis Enterprise (Fleet-wide hotpatch orchestrator & hardware ACLs)",
          "PureOS Enterprise",
          "Axiom Enterprise LMS API",
          "Eris Enterprise (Multi-node adversary orchestration & custom zero-days)",
          "Valkyrie Enterprise (Fleet pentest orchestrator & zero-day payload studio)",
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
    praxis: {
      name: "Praxis",
      subtitle: "Autonomous zero-downtime hotpatching, canary rollouts & hardware firewall ACLs",
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
    eris: {
      name: "Eris",
      subtitle: "Adversary simulation & intentional vulnerability proving ground",
      icon: <ErisIcon size={18} glow={false} />,
      color: "#F59E0B",
      bgGradient: "linear-gradient(135deg, #F59E0B, #DC2626)"
    },
    valkyrie: {
      name: "Valkyrie",
      subtitle: "On-demand penetration testing & exploitability verification bridge",
      icon: <ValkyrieIcon size={18} glow={false} />,
      color: "#06B6D4",
      bgGradient: "linear-gradient(135deg, #06B6D4, #0284C7)"
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

      {/* Sovereignty Dynamic Bundle Discount Calculator & Entitlement Banner (Eris & Valkyrie) */}
      {(isEris || isValkyrie) && (
        <div style={{
          background: "linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)",
          border: bundleDiscountInfo.discountPercent > 0 
            ? (bundleDiscountInfo.discountPercent === 50 ? "1px solid rgba(34, 197, 94, 0.6)" : "1px solid rgba(6, 182, 212, 0.5)") 
            : "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: bundleDiscountInfo.discountPercent > 0
            ? (bundleDiscountInfo.discountPercent === 50 ? "0 0 25px rgba(34, 197, 94, 0.2)" : "0 0 25px rgba(6, 182, 212, 0.15)")
            : "none",
          borderRadius: "16px",
          padding: "1.5rem",
          marginBottom: "2.5rem",
          maxWidth: "1050px",
          marginLeft: "auto",
          marginRight: "auto"
        }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: isValkyrie
                  ? "linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(2, 132, 199, 0.2))"
                  : "linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(220, 38, 38, 0.2))",
                border: isValkyrie ? "1px solid rgba(6, 182, 212, 0.4)" : "1px solid rgba(245, 158, 11, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {isValkyrie ? <ValkyrieIcon size={24} glow={false} /> : <ErisIcon size={24} glow={false} />}
              </div>
              <div>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#FFFFFF", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                  {isValkyrie ? "Valkyrie" : "Eris"} Bundle Pricing &amp; Sovereignty Discounts
                </h2>
                <p style={{ color: "#94A3B8", fontSize: "0.82rem", margin: "2px 0 0 0" }}>
                  Automatic discounts unlock based on companion products in your stack: 30% for 1 companion, 40% for 2 companions, and 50% if you buy all three!
                </p>
              </div>
            </div>

            {/* Active Discount Badge */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "999px",
              background: bundleDiscountInfo.discountPercent === 50
                ? "rgba(34, 197, 94, 0.25)"
                : bundleDiscountInfo.discountPercent === 40
                  ? "rgba(245, 158, 11, 0.2)"
                  : bundleDiscountInfo.discountPercent === 30
                    ? "rgba(139, 92, 246, 0.2)"
                    : "rgba(255, 255, 255, 0.08)",
              border: bundleDiscountInfo.discountPercent === 50
                ? "1px solid rgba(34, 197, 94, 0.6)"
                : bundleDiscountInfo.discountPercent === 40
                  ? "1px solid rgba(245, 158, 11, 0.5)"
                  : bundleDiscountInfo.discountPercent === 30
                    ? "1px solid rgba(139, 92, 246, 0.5)"
                    : "1px solid rgba(255, 255, 255, 0.15)",
            }}>
              <Sparkles size={14} color={
                bundleDiscountInfo.discountPercent === 50 ? "#86EFAC" :
                bundleDiscountInfo.discountPercent === 40 ? "#FDE047" :
                bundleDiscountInfo.discountPercent === 30 ? "#C4B5FD" : "#94A3B8"
              } />
              <span style={{
                fontSize: "0.8rem",
                fontWeight: 800,
                color: bundleDiscountInfo.discountPercent === 50 ? "#86EFAC" :
                  bundleDiscountInfo.discountPercent === 40 ? "#FDE047" :
                  bundleDiscountInfo.discountPercent === 30 ? "#C4B5FD" : "#CBD5E1",
                textTransform: "uppercase",
                letterSpacing: "0.04em"
              }}>
                {bundleDiscountInfo.discountPercent === 50 
                  ? "50% OFF (ALL THREE COMPANIONS ACTIVE!)"
                  : bundleDiscountInfo.discountPercent > 0 
                    ? `${bundleDiscountInfo.discountPercent}% OFF APPLIED`
                    : "Standard Rate (0% Off)"}
              </span>
            </div>
          </div>

          {/* Interactive Bundle Matrix Cards (3 Companions) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            
            {/* Companion 1: Vantage */}
            <div style={{
              background: hasVantage ? "rgba(139, 92, 246, 0.14)" : "rgba(15, 23, 42, 0.6)",
              border: hasVantage ? "1px solid rgba(139, 92, 246, 0.5)" : "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "1rem",
              position: "relative"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <VantageIcon size={20} glow={false} />
                  <span style={{ fontWeight: 700, color: "#FFFFFF", fontSize: "0.92rem" }}>Vantage Feed</span>
                </div>
                <span style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: "#C4B5FD",
                  background: "rgba(139, 92, 246, 0.2)",
                  padding: "2px 8px",
                  borderRadius: "6px"
                }}>
                  30% TIER
                </span>
              </div>
              <p style={{ fontSize: "0.78rem", color: "#94A3B8", lineHeight: 1.4, margin: "0 0 0.75rem 0" }}>
                Active Vantage feed integration provides live CVE intelligence to power automated testing vectors.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.5rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <span style={{ fontSize: "0.72rem", color: hasVantageActual ? "#86EFAC" : "#94A3B8", fontWeight: 600 }}>
                  {hasVantageActual ? "✓ Account Entitled" : "Not Active on Account"}
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewVantage(hasVantage ? false : true)}
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    background: hasVantage ? "rgba(139, 92, 246, 0.25)" : "rgba(255, 255, 255, 0.08)",
                    border: hasVantage ? "1px solid rgba(139, 92, 246, 0.5)" : "1px solid rgba(255, 255, 255, 0.15)",
                    color: hasVantage ? "#C4B5FD" : "#94A3B8",
                    transition: "all 0.15s ease"
                  }}
                >
                  {hasVantage ? "✓ Vantage Included" : "+ Test Vantage"}
                </button>
              </div>
            </div>

            {/* Companion 2: Praxis */}
            <div style={{
              background: hasPraxis ? "rgba(245, 158, 11, 0.14)" : "rgba(15, 23, 42, 0.6)",
              border: hasPraxis ? "1px solid rgba(245, 158, 11, 0.5)" : "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "1rem",
              position: "relative"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <PraxisIcon size={20} glow={false} />
                  <span style={{ fontWeight: 700, color: "#FFFFFF", fontSize: "0.92rem" }}>Praxis Hotpatch</span>
                </div>
                <span style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: "#FDE047",
                  background: "rgba(245, 158, 11, 0.2)",
                  padding: "2px 8px",
                  borderRadius: "6px"
                }}>
                  40% TIER
                </span>
              </div>
              <p style={{ fontSize: "0.78rem", color: "#94A3B8", lineHeight: 1.4, margin: "0 0 0.75rem 0" }}>
                Autonomous remediation &amp; hotpatching daemon. Pairs directly for instant closed-loop verification.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.5rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <span style={{ fontSize: "0.72rem", color: hasPraxisActual ? "#86EFAC" : "#94A3B8", fontWeight: 600 }}>
                  {hasPraxisActual ? "✓ Account Entitled" : "Not Active on Account"}
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewPraxis(hasPraxis ? false : true)}
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    background: hasPraxis ? "rgba(245, 158, 11, 0.25)" : "rgba(255, 255, 255, 0.08)",
                    border: hasPraxis ? "1px solid rgba(245, 158, 11, 0.5)" : "1px solid rgba(255, 255, 255, 0.15)",
                    color: hasPraxis ? "#FDE047" : "#94A3B8",
                    transition: "all 0.15s ease"
                  }}
                >
                  {hasPraxis ? "✓ Praxis Included" : "+ Test Praxis"}
                </button>
              </div>
            </div>

            {/* Companion 3: Valkyrie (for Eris) OR Eris (for Valkyrie) */}
            <div style={{
              background: (isEris ? hasValkyrie : hasEris) ? "rgba(34, 197, 94, 0.14)" : "rgba(15, 23, 42, 0.6)",
              border: (isEris ? hasValkyrie : hasEris) ? "1px solid rgba(34, 197, 94, 0.5)" : "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "1rem",
              position: "relative"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {isEris ? <ValkyrieIcon size={20} glow={false} /> : <ErisIcon size={20} glow={false} />}
                  <span style={{ fontWeight: 700, color: "#FFFFFF", fontSize: "0.92rem" }}>
                    {isEris ? "Valkyrie Pentest" : "Eris Chaos Range"}
                  </span>
                </div>
                <span style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: "#86EFAC",
                  background: "rgba(34, 197, 94, 0.2)",
                  padding: "2px 8px",
                  borderRadius: "6px"
                }}>
                  50% ALL THREE
                </span>
              </div>
              <p style={{ fontSize: "0.78rem", color: "#94A3B8", lineHeight: 1.4, margin: "0 0 0.75rem 0" }}>
                {isEris 
                  ? "Add Valkyrie on-demand pentesting for the complete 50% discount when you buy all three companions!"
                  : "Add Eris chaos emulation lab for the complete 50% discount when you buy all three companions!"}
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.5rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <span style={{ fontSize: "0.72rem", color: (isEris ? hasValkyrieActual : hasErisActual) ? "#86EFAC" : "#94A3B8", fontWeight: 600 }}>
                  {(isEris ? hasValkyrieActual : hasErisActual) ? "✓ Account Entitled" : "Not Active on Account"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (isEris) {
                      setPreviewValkyrie(hasValkyrie ? false : true);
                    } else {
                      setPreviewEris(hasEris ? false : true);
                    }
                  }}
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    background: (isEris ? hasValkyrie : hasEris) ? "rgba(34, 197, 94, 0.25)" : "rgba(255, 255, 255, 0.08)",
                    border: (isEris ? hasValkyrie : hasEris) ? "1px solid rgba(34, 197, 94, 0.5)" : "1px solid rgba(255, 255, 255, 0.15)",
                    color: (isEris ? hasValkyrie : hasEris) ? "#86EFAC" : "#94A3B8",
                    transition: "all 0.15s ease"
                  }}
                >
                  {(isEris ? hasValkyrie : hasEris) 
                    ? `✓ ${isEris ? "Valkyrie" : "Eris"} Included` 
                    : `+ Test ${isEris ? "Valkyrie" : "Eris"} (50% Off)`}
                </button>
              </div>
            </div>

          </div>

          {/* Reset simulation if active */}
          {(previewVantage !== null || previewPraxis !== null || previewEris !== null || previewValkyrie !== null) && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginTop: "0.75rem" }}>
              <button
                type="button"
                onClick={() => {
                  setPreviewVantage(null);
                  setPreviewPraxis(null);
                  setPreviewEris(null);
                  setPreviewValkyrie(null);
                }}
                style={{
                  fontSize: "0.72rem",
                  color: "#94A3B8",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <RotateCcw size={12} />
                <span>Reset simulation to actual account entitlements</span>
              </button>
            </div>
          )}
        </div>
      )}

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
                const basePrice = isFree ? 0 : (billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly);

                // MultiPass Bundle Savings:
                const isMultiPassPlan = isMultiPass && !isFree;
                const singleProductRate = plan.tier === "pro" 
                  ? (billingCycle === "annual" ? 39 : 49) 
                  : (billingCycle === "annual" ? 399 : 499);
                const bundleSavings = isMultiPassPlan ? singleProductRate : 0;
                const unbundledPrice = basePrice + bundleSavings;

                // Sovereignty Dynamic Bundle Discount (Eris & Valkyrie):
                const isBundleTarget = (isEris || isValkyrie) && !isFree;
                const bundleCalc = isBundleTarget
                  ? getDiscountedProductPrice(plan.tier as any, billingCycle, isValkyrie ? "valkyrie" : "eris", {
                      hasVantage,
                      hasPraxis,
                      hasEris,
                      hasValkyrie
                    })
                  : null;
                const isBundleDiscounted = bundleCalc?.isDiscounted ?? false;
                const effectivePrice = bundleCalc ? bundleCalc.finalPrice : basePrice;

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
                      {isBundleDiscounted && (
                        <span style={{
                          fontSize: "1.4rem",
                          fontWeight: 700,
                          color: "#64748B",
                          textDecoration: "line-through",
                          marginRight: "2px"
                        }}>
                          ${basePrice}
                        </span>
                      )}
                      <span style={{ 
                        fontSize: "2.5rem", 
                        fontWeight: 900, 
                        color: isBundleDiscounted 
                          ? (bundleCalc?.discountPercent === 50 ? "#86EFAC" : (isValkyrie ? "#38BDF8" : "#FBBF24")) 
                          : "#FFFFFF" 
                      }}>
                        ${effectivePrice}
                      </span>
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

                    {/* Sovereignty Dynamic Bundle Savings Badge */}
                    {isBundleDiscounted && bundleCalc && (
                      <div style={{
                        marginTop: "6px",
                        background: bundleCalc.discountPercent === 50
                          ? "linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)"
                          : bundleCalc.discountPercent === 40
                            ? "linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)"
                            : "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)",
                        border: bundleCalc.discountPercent === 50
                          ? "1px solid rgba(34, 197, 94, 0.5)"
                          : bundleCalc.discountPercent === 40
                            ? "1px solid rgba(245, 158, 11, 0.4)"
                            : "1px solid rgba(139, 92, 246, 0.4)",
                        borderRadius: "8px",
                        padding: "6px 10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}>
                        <Sparkles size={14} color={bundleCalc.discountPercent === 50 ? "#86EFAC" : bundleCalc.discountPercent === 40 ? "#FDE047" : "#C4B5FD"} style={{ flexShrink: 0 }} />
                        <span style={{ 
                          fontSize: "0.78rem", 
                          fontWeight: 800, 
                          color: bundleCalc.discountPercent === 50 ? "#86EFAC" : bundleCalc.discountPercent === 40 ? "#FDE047" : "#C4B5FD" 
                        }}>
                          Save ${bundleCalc.discountSavings}/mo ({bundleCalc.discountPercent}% Sovereignty Bundle Discount applied!)
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
                          : isBundleDiscounted
                            ? (bundleCalc?.discountPercent === 50 ? "rgba(34, 197, 94, 0.2)" : "rgba(6, 182, 212, 0.15)")
                            : "rgba(56, 189, 248, 0.15)",
                      color: isFree 
                        ? "#34D399" 
                        : isMultiPassPlan 
                          ? "#F472B6" 
                          : isBundleDiscounted
                            ? (bundleCalc?.discountPercent === 50 ? "#86EFAC" : "#38BDF8")
                            : "#38BDF8",
                      border: isFree 
                        ? "1px solid rgba(16, 185, 129, 0.3)" 
                        : isMultiPassPlan 
                          ? "1px solid rgba(236, 72, 153, 0.35)" 
                          : isBundleDiscounted
                            ? (bundleCalc?.discountPercent === 50 ? "1px solid rgba(34, 197, 94, 0.5)" : "1px solid rgba(6, 182, 212, 0.35)")
                            : "1px solid rgba(56, 189, 248, 0.3)"
                    }}>
                      {isFree 
                        ? (isPraxis ? "✓ 1 HOST NODE INCLUDED FREE FOREVER" : "✓ 1 USER SEAT INCLUDED FREE FOREVER")
                        : isMultiPassPlan 
                          ? "✓ COMPLETE SUITE BUNDLE • 1 PRODUCT FREE" 
                          : isBundleDiscounted
                            ? `✓ BUNDLE DISCOUNT • ${bundleCalc?.discountPercent}% OFF APPLIED`
                            : (isPraxis ? "✓ FIXED FLEET PRESET TIER" : "✓ FIXED PRESET TIER")}
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
                const basePrice = isFree ? 0 : (billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly);
                const isBundleTarget = (isEris || isValkyrie) && !isFree;
                const bundleCalc = isBundleTarget
                  ? getDiscountedProductPrice(plan.tier as any, billingCycle, isValkyrie ? "valkyrie" : "eris", {
                      hasVantage,
                      hasPraxis,
                      hasEris,
                      hasValkyrie
                    })
                  : null;
                const effectivePrice = bundleCalc ? bundleCalc.finalPrice : basePrice;
                const planLabel = plan.name;

                return (
                  <button
                    disabled={isCurrent || isSwitchingFree}
                    onClick={() => handlePlanSelect(plan.tier, planLabel, effectivePrice)}
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

      {/* Support model & SLA language lives on the Terms of Service page */}
      <p style={{ margin: "2.5rem 0", textAlign: "center", color: "#94A3B8", fontSize: "0.85rem", lineHeight: 1.6 }}>
        Our support model, service levels, and other terms are described in our{" "}
        <Link href="/terms#support" style={{ color: "#93C5FD", textDecoration: "none", fontWeight: 600 }}>
          Terms of Service
        </Link>
        .
      </p>

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
