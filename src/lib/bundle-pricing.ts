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

export type PlatformTierId = "community" | "enterprise" | "pro";

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

export interface EnterpriseFleetCalculation {
  nodeCount: number;
  monthlyRate: number;
  annualTotal: number;
  effectivePerNodeRate: number;
  isCappedAtFlatRate: boolean;
  savingsVsPerNode: number;
  sub25Rate: number;
  flat25Base: number;
  additionalRate: number;
}

/**
 * Calculates Enterprise Fleet pricing based on the 2-tier model:
 * - Sub-25 hosts: $25 / node / mo ($20 / node / mo billed annually)
 * - Fleet Cap (up to 25 hosts): $500 / month flat rate ($6,000 billed annually, or $600/mo billed monthly)
 * - 25+ scale fleet: Base $500/mo + $15 / additional node / mo ($12 / node / mo annual)
 */
export function calculateEnterpriseFleetPrice(
  nodeCount: number,
  billingCycle: "monthly" | "annual" = "annual"
): EnterpriseFleetCalculation {
  const isAnnual = billingCycle === "annual";
  const sub25Rate = isAnnual ? 20 : 25;
  const flat25Base = isAnnual ? 500 : 600;
  const additionalRate = isAnnual ? 12 : 15;

  const validCount = Math.max(1, Math.floor(nodeCount));
  let monthlyRate = 0;
  let isCapped = false;
  let savings = 0;

  if (validCount < 25) {
    const linearCost = validCount * sub25Rate;
    if (linearCost >= flat25Base) {
      monthlyRate = flat25Base;
      isCapped = true;
      savings = linearCost - flat25Base;
    } else {
      monthlyRate = linearCost;
    }
  } else if (validCount === 25) {
    monthlyRate = flat25Base;
    isCapped = true;
    savings = (25 * sub25Rate) - flat25Base;
  } else {
    // 25+ hosts
    const extraNodes = validCount - 25;
    monthlyRate = flat25Base + (extraNodes * additionalRate);
    savings = (validCount * sub25Rate) - monthlyRate;
  }

  const annualTotal = monthlyRate * 12;
  const effectivePerNodeRate = Math.round((monthlyRate / validCount) * 100) / 100;

  return {
    nodeCount: validCount,
    monthlyRate,
    annualTotal,
    effectivePerNodeRate,
    isCappedAtFlatRate: isCapped,
    savingsVsPerNode: Math.max(0, savings),
    sub25Rate,
    flat25Base,
    additionalRate,
  };
}

export const EXULTIA_PLATFORM_TIERS: PlatformPricingTier[] = [
  {
    id: "community",
    name: "Community Sovereign",
    tagline: "Free self-healing daemon for individuals, researchers & homelabs",
    priceMonthly: 0,
    priceAnnual: 0,
    annualBilledTotal: 0,
    description: "100% Free Community Edition Exultia resident daemon with local in-memory hotpatching, pre-baked 24,388 UVI offline database, and zero telemetry.",
    highlights: [
      "100% Free Community Edition Exultia resident daemon (Any Linux distro, bare-metal & microVMs)",
      "Resident local in-memory hotpatching daemon with zero socket drops",
      "Non-invasive memory patch state machine with sub-15ms deterministic rollback",
      "Pre-baked offline air-gapped catalog with 24,388 UVI vulnerability advisories",
      "Open access to 110+ vulnerability registries in Vantage (Daily CVE sync)",
      "Integrated non-destructive exploit probing & resilience inoculation in resident daemon",
      "Zero-telemetry hermetic workstation builder in Daedelus",
      "CIS-hardened baseline OCI container & package generation in Daedelus",
      "Full CompTIA Security+, CySA+, CC exam prep banks in Axiom"
    ],
    engineCapabilities: {
      vantage: "Public CVE search, CISA KEV feeds, and CVSS score breakdowns",
      praxis: "Local hotpatch verification and plain/JSON firewall block generators",
      eris: "5 single-container chaos scenarios (Log4Shell, RegreSSHion, query injection)",
      valkyrie: "5 safe non-destructive banner & protocol handshake canary probes",
      pureide: "Single local developer seat with Daedelus secure workstation, container, and package builder",
      pureos: "Standard CIS baseline container & package generation in Daedelus",
      axiom: "Complete exam question banks with instant in-browser score feedback"
    },
    ctaLabel: "Download Free Daemon",
    isPopular: false
  },
  {
    id: "enterprise",
    name: "Enterprise Fleet",
    tagline: "Production fleet hotpatching: $25/node under 25, or $500/mo flat cap for 25 hosts",
    badge: "FLEET & COMPLIANCE",
    priceMonthly: 600,
    priceAnnual: 500,
    annualBilledTotal: 6000,
    description: "Full enterprise hotpatching engine: $25/node/mo for under 25 hosts, flat $500/mo for 25 hosts, or +$15/node beyond 25. Central progressive canary rollouts, air-gapped KMS, and SLSA Level 3 Cosign receipts.",
    highlights: [
      "Unlimited Access to Threat Feed API",
      "Unlimited Use of Daedelus - build secure IDEs, containers, and packages",
      "Unlimited Use of Praxis - generate POSIX-compliant scripts mapped to threat feed fixes",
      "Unlimited Use of Axiom - general cybersecurity exam questions and LMS API",
      "25-Host Flat Fleet Cap savings",
      "Optional MSA terms for large enterprises",
      "Offline cryptographic Ed25519 license key: zero phone-home DRM, zero production lockouts",
      "Cosign OIDC SLSA Level 3 signed manifests & automated compliance audit logs",
      "Real-time SIEM webhooks (Splunk, Sentinel, QRadar)",
      "Soft-limit autoscale grace period: never bricks nodes or halts defenses on quota spikes"
    ],
    engineCapabilities: {
      vantage: "Commercial redistributable feed, real-time enterprise SIEM webhooks (Splunk/Sentinel/QRadar), and automated CISO briefing generator",
      praxis: "Phased multi-ring deployment orchestrator, Cosign OIDC SLSA Level 3 signed manifests, and fleet-wide emergency rollback",
      eris: "Multi-node fleet chaos orchestrator (Ansible/Terraform), custom zero-day studio, and continuous red/blue verification",
      valkyrie: "Continuous CI/CD perimeter probing, custom exploit canary builder, programmatic REST API, and executive compliance reports",
      pureide: "Strict airgap signing, offline cryptographic cosign, immutable binary encapsulation, and enterprise build runners in Daedelus",
      pureos: "Air-gapped deployment compatibility, signed cryptographic provenance, and organization fleet distribution in Daedelus",
      axiom: "Live LMS simulator embedding (Canvas, Blackboard, Moodle), SCORM 1.2/2004 & LTI 1.3, multi-seat licensing, and gradebook passback"
    },
    ctaLabel: "Deploy Enterprise Fleet",
    isPopular: true
  }
];

export function getPlatformTier(id: PlatformTierId): PlatformPricingTier {
  if (id === "pro") {
    // Backwards-compatible alias resolving to Enterprise Fleet
    return EXULTIA_PLATFORM_TIERS.find(t => t.id === "enterprise") || EXULTIA_PLATFORM_TIERS[0];
  }
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
