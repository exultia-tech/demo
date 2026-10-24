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
