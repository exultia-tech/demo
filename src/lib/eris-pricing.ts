/**
 * Eris Pricing & Dynamic Bundle Discount Engine
 * 
 * Rules:
 * - Base Pro: $49/mo ($39/mo billed annually)
 * - Base Enterprise: $499/mo ($399/mo billed annually)
 * - If the user has Vantage: 20% discount
 * - If the user has Vantage AND Praxis: 40% discount
 */

export interface ErisPricingTier {
  tier: "community" | "pro" | "enterprise";
  name: string;
  baseMonthly: number;
  baseAnnual: number;
  description: string;
  features: string[];
  isPopular: boolean;
}

export const ERIS_BASE_TIERS: ErisPricingTier[] = [
  {
    tier: "community",
    name: "Community",
    baseMonthly: 0,
    baseAnnual: 0,
    description: "Zero-cost baseline vulnerability inoculation for local testing and initial validation.",
    features: [
      "5 Default Chaos Inoculation Modules",
      "SSH RegreSSHion & Ingress Socket Scenarios",
      "Self-contained bash script generation",
      "Manual endpoint rollback scripts",
      "Single ephemeral test container recipe"
    ],
    isPopular: false
  },
  {
    tier: "pro",
    name: "Pro Chaos Lab",
    baseMonthly: 49,
    baseAnnual: 39,
    description: "Complete vulnerability catalog, timed automated rollbacks, and full 5-container Docker Compose range.",
    features: [
      "Everything in Community",
      "Full Eris Chaos Catalog (All 7+ CVE Scenarios)",
      "Automated Script Compilation API (/api/eris/generate & raw)",
      "Custom Timed Failsafe Rollbacks (10m, 30m, 60m)",
      "Full 5-Container Docker Compose Attack Range",
      "Log4Shell, XZ Backdoor & CUPS Browsed Sandbox Environments",
      "Direct Bridge to Praxis Autonomous Remediation"
    ],
    isPopular: true
  },
  {
    tier: "enterprise",
    name: "Enterprise Range",
    baseMonthly: 499,
    baseAnnual: 399,
    description: "Multi-node fleet adversary orchestration, custom zero-day builder, and continuous red/blue verification.",
    features: [
      "Everything in Pro",
      "Multi-Node Fleet Chaos Orchestrator (Ansible & Terraform)",
      "Custom CVE & Zero-Day Adversary Inoculator Studio",
      "Dedicated Cloud Sandbox Attack Range Runner",
      "Automated After-Action CBOM Attestation Probes",
      "Continuous Red-Team / Blue-Team Canary Verification Pipelines",
      "Organization Volume Entitlements & Custom SLA"
    ],
    isPopular: false
  }
];

export interface ErisDiscountResolution {
  discountPercent: number;
  discountMultiplier: number;
  discountLabel: string;
  qualifyingProducts: string[];
  hasVantage: boolean;
  hasPraxis: boolean;
  hasValkyrie?: boolean;
}

/**
 * Calculates the exact discount percentage for Eris/Valkyrie based on existing companion ownership:
 * - 30% discount if customer has 1 companion product (e.g. Vantage)
 * - 40% discount if customer has 2 companion products (e.g. Vantage + Praxis)
 * - 50% discount if customer has all 3 companion products (Vantage + Praxis + Valkyrie)
 */
export function calculateErisDiscount(
  hasVantage: boolean, 
  hasPraxis: boolean, 
  hasValkyrie: boolean = false
): ErisDiscountResolution {
  const qualifying: string[] = [];
  if (hasVantage) qualifying.push("Vantage");
  if (hasPraxis) qualifying.push("Praxis");
  if (hasValkyrie) qualifying.push("Valkyrie");

  const count = qualifying.length;

  if (count >= 3) {
    return {
      discountPercent: 50,
      discountMultiplier: 0.5,
      discountLabel: "50% Complete Sovereignty Quad Bundle Discount (All 3 Companions Active)",
      qualifyingProducts: qualifying,
      hasVantage,
      hasPraxis,
      hasValkyrie
    };
  }

  if (count === 2) {
    return {
      discountPercent: 40,
      discountMultiplier: 0.6,
      discountLabel: `40% Sovereignty Trinity Bundle Discount (${qualifying.join(" + ")})`,
      qualifyingProducts: qualifying,
      hasVantage,
      hasPraxis,
      hasValkyrie
    };
  }

  if (count === 1) {
    return {
      discountPercent: 30,
      discountMultiplier: 0.7,
      discountLabel: `30% Threat Defense Bundle Discount (${qualifying[0]} + Eris)`,
      qualifyingProducts: qualifying,
      hasVantage,
      hasPraxis,
      hasValkyrie
    };
  }

  return {
    discountPercent: 0,
    discountMultiplier: 1.0,
    discountLabel: "Standard Rate",
    qualifyingProducts: [],
    hasVantage: false,
    hasPraxis: false,
    hasValkyrie: false
  };
}

export interface CalculatedPrice {
  basePrice: number;
  finalPrice: number;
  discountPercent: number;
  discountSavings: number;
  isDiscounted: boolean;
}

/**
 * Computes the final price for an Eris tier after applying bundle discounts.
 */
export function getErisPrice(
  tier: "community" | "pro" | "enterprise",
  cycle: "monthly" | "annual",
  hasVantage: boolean,
  hasPraxis: boolean,
  hasValkyrie: boolean = false
): CalculatedPrice {
  const tierConfig = ERIS_BASE_TIERS.find(t => t.tier === tier);
  if (!tierConfig || tier === "community") {
    return {
      basePrice: 0,
      finalPrice: 0,
      discountPercent: 0,
      discountSavings: 0,
      isDiscounted: false
    };
  }

  const basePrice = cycle === "annual" ? tierConfig.baseAnnual : tierConfig.baseMonthly;
  const { discountPercent, discountMultiplier } = calculateErisDiscount(hasVantage, hasPraxis, hasValkyrie);

  if (discountPercent === 0) {
    return {
      basePrice,
      finalPrice: basePrice,
      discountPercent: 0,
      discountSavings: 0,
      isDiscounted: false
    };
  }

  // Calculate discounted rate, rounded cleanly to nearest dollar
  const rawDiscounted = basePrice * discountMultiplier;
  const finalPrice = Math.round(rawDiscounted);
  const discountSavings = basePrice - finalPrice;

  return {
    basePrice,
    finalPrice,
    discountPercent,
    discountSavings,
    isDiscounted: true
  };
}

