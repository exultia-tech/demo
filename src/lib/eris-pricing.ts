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
}

/**
 * Calculates the exact discount percentage for Eris based on existing ownership.
 * - 20% discount if the user already has Vantage.
 * - 40% discount if the user has Vantage AND Praxis.
 */
export function calculateErisDiscount(hasVantage: boolean, hasPraxis: boolean): ErisDiscountResolution {
  if (hasVantage && hasPraxis) {
    return {
      discountPercent: 40,
      discountMultiplier: 0.6,
      discountLabel: "40% Sovereignty Trinity Bundle Discount (Vantage + Praxis + Eris)",
      qualifyingProducts: ["Vantage", "Praxis"],
      hasVantage: true,
      hasPraxis: true
    };
  }

  if (hasVantage) {
    return {
      discountPercent: 20,
      discountMultiplier: 0.8,
      discountLabel: "20% Threat Intelligence Bundle Discount (Vantage + Eris)",
      qualifyingProducts: ["Vantage"],
      hasVantage: true,
      hasPraxis: false
    };
  }

  return {
    discountPercent: 0,
    discountMultiplier: 1.0,
    discountLabel: "Standard Rate",
    qualifyingProducts: [],
    hasVantage: false,
    hasPraxis: hasPraxis
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
 * Computes the final price for an Eris tier after applying Vantage/Praxis bundle discounts.
 */
export function getErisPrice(
  tier: "community" | "pro" | "enterprise",
  cycle: "monthly" | "annual",
  hasVantage: boolean,
  hasPraxis: boolean
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
  const { discountPercent, discountMultiplier } = calculateErisDiscount(hasVantage, hasPraxis);

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
