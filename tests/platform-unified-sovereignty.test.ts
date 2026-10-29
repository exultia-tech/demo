import { describe, it, expect } from 'vitest';
import { 
  EXULTIA_PLATFORM_TIERS, 
  getPlatformTier, 
  calculateEnterpriseFleetPrice,
  VALKYRIE_BASE_TIERS, 
  calculateBundleDiscount,
  getDiscountedProductPrice 
} from '../src/lib/bundle-pricing';
import { AiSupportEngine } from '../src/lib/ai-support-engine';

describe('Exultia Cyber Sovereignty Platform - Unified Architecture & 2-Tier Fleet Model', () => {
  it('should define the exact 2 unified platform tiers (Community Sovereign and Enterprise Fleet)', () => {
    expect(EXULTIA_PLATFORM_TIERS.length).toBe(2);

    const [community, enterprise] = EXULTIA_PLATFORM_TIERS;

    // Community
    expect(community.id).toBe('community');
    expect(community.priceMonthly).toBe(0);
    expect(community.priceAnnual).toBe(0);
    expect(community.annualBilledTotal).toBe(0);
    expect(community.highlights.length).toBeGreaterThanOrEqual(5);

    // Enterprise Fleet ($500/mo flat for 25 hosts, or $25/node sub-25)
    expect(enterprise.id).toBe('enterprise');
    expect(enterprise.priceMonthly).toBe(600);
    expect(enterprise.priceAnnual).toBe(500);
    expect(enterprise.annualBilledTotal).toBe(6000);
    expect(enterprise.isPopular).toBe(true);
  });

  it('should calculate accurate Enterprise Fleet pricing across all node tiers', () => {
    // Sub-25 hosts ($25/node monthly, $20/node annual)
    const singleNodeAnnual = calculateEnterpriseFleetPrice(1, 'annual');
    expect(singleNodeAnnual.monthlyRate).toBe(20);
    expect(singleNodeAnnual.annualTotal).toBe(240);

    const tenNodesMonthly = calculateEnterpriseFleetPrice(10, 'monthly');
    expect(tenNodesMonthly.monthlyRate).toBe(250); // 10 * 25

    const tenNodesAnnual = calculateEnterpriseFleetPrice(10, 'annual');
    expect(tenNodesAnnual.monthlyRate).toBe(200); // 10 * 20

    // Exact 25 hosts flat fleet cap ($500/mo annual, $600/mo monthly)
    const twentyFiveAnnual = calculateEnterpriseFleetPrice(25, 'annual');
    expect(twentyFiveAnnual.monthlyRate).toBe(500);
    expect(twentyFiveAnnual.isCappedAtFlatRate).toBe(true);
    expect(twentyFiveAnnual.annualTotal).toBe(6000);

    const twentyFiveMonthly = calculateEnterpriseFleetPrice(25, 'monthly');
    expect(twentyFiveMonthly.monthlyRate).toBe(600);
    expect(twentyFiveMonthly.isCappedAtFlatRate).toBe(true);

    // 25+ scale fleet ($500 base + $12/node annual or $600 base + $15/node monthly)
    const thirtyNodesAnnual = calculateEnterpriseFleetPrice(30, 'annual');
    expect(thirtyNodesAnnual.monthlyRate).toBe(500 + (5 * 12)); // 560

    const fiftyNodesMonthly = calculateEnterpriseFleetPrice(50, 'monthly');
    expect(fiftyNodesMonthly.monthlyRate).toBe(600 + (25 * 15)); // 975
  });

  it('should cover all 7 sovereign defense engines across every tier', () => {
    const requiredEngines = ['vantage', 'praxis', 'eris', 'valkyrie', 'pureide', 'pureos', 'axiom'] as const;

    EXULTIA_PLATFORM_TIERS.forEach(tier => {
      requiredEngines.forEach(engine => {
        expect(tier.engineCapabilities[engine]).toBeDefined();
        expect(tier.engineCapabilities[engine].length).toBeGreaterThan(10);
      });
    });
  });

  it('should resolve tier objects via getPlatformTier safely', () => {
    const enterprise = getPlatformTier('enterprise');
    expect(enterprise.name).toBe('Enterprise Fleet');
    expect(enterprise.priceAnnual).toBe(500);

    // Pro gracefully resolves to enterprise fleet
    const pro = getPlatformTier('pro');
    expect(pro.name).toBe('Enterprise Fleet');
    expect(pro.priceAnnual).toBe(500);

    const community = getPlatformTier('community');
    expect(community.name).toBe('Community Sovereign');
    expect(community.priceMonthly).toBe(0);

    // Fallback for unknown
    const fallback = getPlatformTier('unknown' as any);
    expect(fallback.id).toBe('community');
  });

  it('should provide authoritative unified platform explanations via AiSupportEngine', () => {
    const response = AiSupportEngine.processQuery('tell me about the unified platform pricing and plans');
    expect(response.topic).toBe('multipass');
    expect(response.reply).toContain('Exultia Cyber Sovereignty Platform: Unified Pricing');
    expect(response.reply).toContain('Community Sovereign');
    expect(response.reply).toContain('Professional Operator');
    expect(response.reply).toContain('Enterprise Fleet');
    expect(response.reply).toContain('Vantage:');
    expect(response.reply).toContain('Praxis:');
    expect(response.reply).toContain('Eris:');
    expect(response.reply).toContain('Valkyrie:');
    expect(response.reply).toContain('PureIDE:');
    expect(response.reply).toContain('PureOS:');
    expect(response.reply).toContain('Axiom:');
  });

  it('should preserve backward compatibility for companion discount calculations', () => {
    const discount = calculateBundleDiscount('valkyrie', { hasVantage: true, hasPraxis: true });
    expect(discount.discountPercent).toBe(40);

    const proPrice = getDiscountedProductPrice('pro', 'monthly', 'valkyrie', { hasVantage: true, hasPraxis: true });
    expect(proPrice.finalPrice).toBe(29);
    expect(proPrice.isDiscounted).toBe(true);

    expect(VALKYRIE_BASE_TIERS.length).toBe(3);
  });
});
