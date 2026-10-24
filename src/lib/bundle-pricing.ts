/**
 * Exultia Multi-Product Sovereignty Bundle Pricing Engine
 * 
 * Interlocked Threat Intelligence & Proactive Defense Ecosystem:
 * - Vantage (Threat Intelligence Feed)
 * - Praxis (Autonomous Remediation & Hotpatching)
 * - Eris (Adversary Emulation & Chaos Range)
 * - Valkyrie (On-Demand Pentest & Exploitability Verification)
 * 
 * Discount Rules:
 * - 1 companion product owned: 30% OFF
 * - 2 companion products owned: 40% OFF
 * - 3 companion products owned (buys all three): 50% OFF
 */

export interface BundlePricingTier {
  tier: "community" | "pro" | "enterprise";
  name: string;
  baseMonthly: number;
  baseAnnual: number;
  description: string;
  features: string[];
  isPopular: boolean;
}

export type PlatformTierId = "community" | "pro" | "enterprise";

export interface PlatformPricingTier {
  id: PlatformTierId;
  name: string;
  tagline: string;
  badge?: string;
  priceMonthly: number;
  priceAnnual: number; // Effective monthly rate when billed annually
  annualBilledTotal: number;
  description: string;
  highlights: string[];
  engineCapabilities: {
    vantage: string;
    praxis: string;
    eris: string;
    valkyrie: string;
    pureide: string;
    pureos: string;
    axiom: string;
  };
  ctaLabel: string;
  isPopular: boolean;
}

export const EXULTIA_PLATFORM_TIERS: PlatformPricingTier[] = [
  {
    id: "community",
    name: "Community Sovereign",
    tagline: "Open-source foundational cyber defense for researchers & solo developers",
    priceMonthly: 0,
    priceAnnual: 0,
    annualBilledTotal: 0,
    description: "Zero-cost baseline security telemetry, safe vulnerability probes, and local hermetic compiler.",
    highlights: [
      "Open access to 110+ vulnerability registries in Vantage",
      "Safe non-destructive BAS banner probes in Valkyrie",
      "5 default chaos inoculation modules in Eris",
      "Manual hotpatch inspection & verified rollback scripts in Praxis",
      "Zero-telemetry hermetic workstation compiler in PureIDE",
      "CIS-hardened baseline OCI container recipes in PureOS",
      "Full CompTIA Security+, CySA+, CC exam prep banks in Axiom"
    ],
    engineCapabilities: {
      vantage: "Public CVE search, CISA KEV feeds, and CVSS score breakdowns",
      praxis: "Manual hotpatch verification and plain/JSON firewall block generators",
      eris: "5 single-container chaos scenarios (Log4Shell, RegreSSHion, query injection)",
      valkyrie: "5 safe non-destructive banner & protocol handshake canary probes",
      pureide: "Single local developer seat with hermetic compiler and telemetry stripping",
      pureos: "Standard CIS baseline container images and public vulnerability scanners",
      axiom: "Complete exam question banks with instant in-browser score feedback"
    },
    ctaLabel: "Get Started Free",
    isPopular: false
  },
  {
    id: "pro",
    name: "Professional Operator",
    tagline: "Full closed-loop cyber sovereignty for solo security engineers & operators",
    badge: "MOST POPULAR",
    priceMonthly: 79,
    priceAnnual: 59,
    annualBilledTotal: 708,
    description: "Unlock all 7 engines in unison: automated threat detection, adversary emulation, proof probing, hotpatch remediation, and cryptographic attestation.",
    highlights: [
      "Real-time Vantage threat streams, zero-day warnings & 300 req/min API",
      "Autonomous Praxis patch streaming daemon & sub-second rollbacks",
      "Full 7+ CVE Eris chaos catalog & 5-container Docker attack range",
      "Full 10+ Vantage CVE Valkyrie probes with SHA-256 attestation tokens",
      "Isolated PureIDE cloud build runners & automated CycloneDX SBOMs",
      "Zero-trust hardened PureOS variants with cryptographic provenance",
      "Axiom verifiable SHA-256 certificates & CSV/JSON student transcript exports",
      "Over $340/month in individual product value consolidated into one plan"
    ],
    engineCapabilities: {
      vantage: "Real-time threat feed streams, zero-day early warnings, and 300 req/min API quota",
      praxis: "Autonomous patch streaming daemon, sub-second rollback engine, sentinels, and hardware firewall filters",
      eris: "Full 7+ CVE chaos catalog, custom timed failsafe rollbacks (10m, 30m, 60m), and 5-container Docker Compose range",
      valkyrie: "Remote endpoint & Docker cluster network probing with cryptographic SHA-256 pentest attestation signatures",
      pureide: "Isolated cloud pipeline builds, network egress sandboxing, and automated CycloneDX SBOMs",
      pureos: "Zero-trust hardened OS variants, automated SBOM recipes, and advanced CI/CD templates",
      axiom: "Verifiable SHA-256 certificates, course history transcripts (CSV/JSON), and score sync API"
    },
    ctaLabel: "Unlock Professional",
    isPopular: true
  },
  {
    id: "enterprise",
    name: "Enterprise Fleet",
    tagline: "Fleet-wide multi-node orchestration, compliance attestation & institutional LMS",
    badge: "FLEET & COMPLIANCE",
    priceMonthly: 499,
    priceAnnual: 399,
    annualBilledTotal: 4788,
    description: "Multi-node fleet adversary orchestration, air-gapped CI/CD, SLSA Level 3 signed manifests, compliance reports, and deep LMS integrations.",
    highlights: [
      "Commercial redistributable Vantage feeds & real-time SIEM webhooks",
      "Phased multi-ring Praxis rollout (Ring 0 -> Ring 1 -> Fleet) & Cosign SLSA L3",
      "Multi-node fleet chaos orchestrator & custom zero-day adversary studio",
      "Continuous CI/CD Valkyrie perimeter scanning & executive PDF/Markdown reports",
      "Strict airgap signing, offline cryptographic cosign & enterprise build runners",
      "Institutional Axiom LMS embedding (Canvas, Blackboard, Moodle) with SCORM/LTI",
      "Organization volume entitlements, priority SLA, and audit logging exports"
    ],
    engineCapabilities: {
      vantage: "Commercial redistributable feed, real-time enterprise SIEM webhooks (Splunk/Sentinel/QRadar), and automated CISO briefing generator",
      praxis: "Phased multi-ring deployment orchestrator, Cosign OIDC SLSA Level 3 signed manifests, and fleet-wide emergency rollback",
      eris: "Multi-node fleet chaos orchestrator (Ansible/Terraform), custom zero-day studio, and continuous red/blue verification",
      valkyrie: "Continuous CI/CD perimeter probing, custom exploit canary builder, programmatic REST API, and executive compliance reports",
      pureide: "Strict airgap signing, offline cryptographic cosign, immutable binary encapsulation, and enterprise build runners",
      pureos: "Air-gapped deployment compatibility, signed cryptographic provenance, and organization fleet distribution",
      axiom: "Live LMS simulator embedding (Canvas, Blackboard, Moodle), SCORM 1.2/2004 & LTI 1.3, multi-seat licensing, and gradebook passback"
    },
    ctaLabel: "Deploy Enterprise Fleet",
    isPopular: false
  }
];

export function getPlatformTier(id: PlatformTierId): PlatformPricingTier {
  const match = EXULTIA_PLATFORM_TIERS.find(t => t.id === id);
  return match || EXULTIA_PLATFORM_TIERS[0];
}


export const VALKYRIE_BASE_TIERS: BundlePricingTier[] = [
  {
    tier: "community",
    name: "Community",
    baseMonthly: 0,
    baseAnnual: 0,
    description: "Safe non-destructive vulnerability canaries for local developer workstations and single hosts.",
    features: [
      "5 Standard BAS Pentest Vectors",
      "Safe banner & protocol handshake probes",
      "Standalone bash/cURL script generation",
      "Local workstation probe execution",
      "Instant in-browser simulation sandbox"
    ],
    isPopular: false
  },
  {
    tier: "pro",
    name: "Pro Pentest Suite",
    baseMonthly: 49,
    baseAnnual: 39,
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
    isPopular: true
  },
  {
    tier: "enterprise",
    name: "Enterprise Fleet BAS",
    baseMonthly: 499,
    baseAnnual: 399,
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
    isPopular: false
  }
];

export interface BundleDiscountResolution {
  discountPercent: number;
  discountMultiplier: number;
  discountLabel: string;
  qualifyingCount: number;
  qualifyingProducts: string[];
  hasVantage: boolean;
  hasPraxis: boolean;
  hasEris: boolean;
  hasValkyrie: boolean;
}

/**
 * Calculates the exact bundle discount based on companion product ownership.
 * Rule:
 * - 1 companion: 30% OFF
 * - 2 companions: 40% OFF
 * - 3 companions (all three): 50% OFF
 */
export function calculateBundleDiscount(
  targetProduct: "eris" | "valkyrie" | "praxis" | "uvi",
  companions: {
    hasVantage?: boolean;
    hasPraxis?: boolean;
    hasEris?: boolean;
    hasValkyrie?: boolean;
  }
): BundleDiscountResolution {
  const { hasVantage = false, hasPraxis = false, hasEris = false, hasValkyrie = false } = companions;
  
  const qualifying: string[] = [];
  if (targetProduct !== "uvi" && hasVantage) qualifying.push("Vantage");
  if (targetProduct !== "praxis" && hasPraxis) qualifying.push("Praxis");
  if (targetProduct !== "eris" && hasEris) qualifying.push("Eris");
  if (targetProduct !== "valkyrie" && hasValkyrie) qualifying.push("Valkyrie");

  const count = qualifying.length;

  if (count >= 3) {
    return {
      discountPercent: 50,
      discountMultiplier: 0.5,
      discountLabel: "50% Complete Sovereignty Quad Bundle Discount (All 3 Companions Active)",
      qualifyingCount: count,
      qualifyingProducts: qualifying,
      hasVantage,
      hasPraxis,
      hasEris,
      hasValkyrie
    };
  }

  if (count === 2) {
    return {
      discountPercent: 40,
      discountMultiplier: 0.6,
      discountLabel: `40% Sovereignty Trinity Bundle Discount (${qualifying.join(" + ")})`,
      qualifyingCount: count,
      qualifyingProducts: qualifying,
      hasVantage,
      hasPraxis,
      hasEris,
      hasValkyrie
    };
  }

  if (count === 1) {
    return {
      discountPercent: 30,
      discountMultiplier: 0.7,
      discountLabel: `30% Threat Defense Bundle Discount (${qualifying[0]})`,
      qualifyingCount: count,
      qualifyingProducts: qualifying,
      hasVantage,
      hasPraxis,
      hasEris,
      hasValkyrie
    };
  }

  return {
    discountPercent: 0,
    discountMultiplier: 1.0,
    discountLabel: "Standard Rate",
    qualifyingCount: 0,
    qualifyingProducts: [],
    hasVantage,
    hasPraxis,
    hasEris,
    hasValkyrie
  };
}

export interface CalculatedBundlePrice {
  basePrice: number;
  finalPrice: number;
  discountPercent: number;
  discountSavings: number;
  isDiscounted: boolean;
}

/**
 * Computes the final price for an Eris or Valkyrie tier after applying 30%, 40%, or 50% bundle discounts.
 */
export function getDiscountedProductPrice(
  tier: "community" | "pro" | "enterprise",
  cycle: "monthly" | "annual",
  targetProduct: "eris" | "valkyrie",
  companions: {
    hasVantage?: boolean;
    hasPraxis?: boolean;
    hasEris?: boolean;
    hasValkyrie?: boolean;
  }
): CalculatedBundlePrice {
  if (tier === "community") {
    return {
      basePrice: 0,
      finalPrice: 0,
      discountPercent: 0,
      discountSavings: 0,
      isDiscounted: false
    };
  }

  const basePrice = tier === "pro" 
    ? (cycle === "annual" ? 39 : 49) 
    : (cycle === "annual" ? 399 : 499);

  const { discountPercent, discountMultiplier } = calculateBundleDiscount(targetProduct, companions);

  if (discountPercent === 0) {
    return {
      basePrice,
      finalPrice: basePrice,
      discountPercent: 0,
      discountSavings: 0,
      isDiscounted: false
    };
  }

  const raw = basePrice * discountMultiplier;
  const finalPrice = Math.round(raw);
  const discountSavings = basePrice - finalPrice;

  return {
    basePrice,
    finalPrice,
    discountPercent,
    discountSavings,
    isDiscounted: true
  };
}
