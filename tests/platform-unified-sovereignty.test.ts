import { describe, it, expect } from 'vitest';
import { 
  EXULTIA_PLATFORM_TIERS, 
  getPlatformTier, 
  VALKYRIE_BASE_TIERS, 
  calculateBundleDiscount,
  getDiscountedProductPrice 
} from '../src/lib/bundle-pricing';
import { AiSupportEngine } from '../src/lib/ai-support-engine';

describe('Exultia Cyber Sovereignty Platform - Unified Architecture & 3-Tier Model', () => {
  it('should define the exact 3 unified platform tiers', () => {
    expect(EXULTIA_PLATFORM_TIERS.length).toBe(3);

    const [community, pro, enterprise] = EXULTIA_PLATFORM_TIERS;

    // Community
    expect(community.id).toBe('community');
    expect(community.priceMonthly).toBe(0);
    expect(community.priceAnnual).toBe(0);
    expect(community.annualBilledTotal).toBe(0);
    expect(community.highlights.length).toBeGreaterThanOrEqual(5);

    // Pro ($120/mo or $100/mo annual)
    expect(pro.id).toBe('pro');
    expect(pro.priceMonthly).toBe(120);
    expect(pro.priceAnnual).toBe(100);
    expect(pro.annualBilledTotal).toBe(1200);
    expect(pro.isPopular).toBe(true);

    // Enterprise ($600/mo or $500/mo annual)
    expect(enterprise.id).toBe('enterprise');
    expect(enterprise.priceMonthly).toBe(600);
    expect(enterprise.priceAnnual).toBe(500);
    expect(enterprise.annualBilledTotal).toBe(6000);
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
    const pro = getPlatformTier('pro');
    expect(pro.name).toBe('Professional Operator');
    expect(pro.priceAnnual).toBe(100);

    const enterprise = getPlatformTier('enterprise');
    expect(enterprise.name).toBe('Enterprise Fleet');
    expect(enterprise.priceAnnual).toBe(500);

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
