import { describe, it, expect } from 'vitest';
import {
  calculateBundleDiscount,
  getDiscountedProductPrice,
  VALKYRIE_BASE_TIERS
} from '../src/lib/bundle-pricing';
import { calculateErisDiscount, getErisPrice } from '../src/lib/eris-pricing';

describe('Sovereignty Bundle Pricing Engine (30%, 40%, 50% Discounts)', () => {
  it('should grant 30% discount when customer has 1 companion product', () => {
    // Customer has Vantage only
    const erisDiscount = calculateErisDiscount(true, false, false);
    expect(erisDiscount.discountPercent).toBe(30);
    expect(erisDiscount.discountMultiplier).toBe(0.7);

    const valkDiscount = calculateBundleDiscount('valkyrie', { hasVantage: true });
    expect(valkDiscount.discountPercent).toBe(30);
    expect(valkDiscount.discountMultiplier).toBe(0.7);

    // Pro Monthly: $49 * 0.7 = 34.3 -> $34 ($15 savings)
    const valkProPrice = getDiscountedProductPrice('pro', 'monthly', 'valkyrie', { hasVantage: true });
    expect(valkProPrice.finalPrice).toBe(34);
    expect(valkProPrice.discountSavings).toBe(15);
  });

  it('should grant 40% discount when customer has 2 companion products', () => {
    // Customer has Vantage and Praxis
    const erisDiscount = calculateErisDiscount(true, true, false);
    expect(erisDiscount.discountPercent).toBe(40);
    expect(erisDiscount.discountMultiplier).toBe(0.6);

    const valkDiscount = calculateBundleDiscount('valkyrie', { hasVantage: true, hasPraxis: true });
    expect(valkDiscount.discountPercent).toBe(40);
    expect(valkDiscount.discountMultiplier).toBe(0.6);

    // Pro Monthly: $49 * 0.6 = 29.4 -> $29 ($20 savings)
    const valkProPrice = getDiscountedProductPrice('pro', 'monthly', 'valkyrie', { hasVantage: true, hasPraxis: true });
    expect(valkProPrice.finalPrice).toBe(29);
    expect(valkProPrice.discountSavings).toBe(20);

    // Enterprise Monthly: $499 * 0.6 = 299.4 -> $299 ($200 savings)
    const valkEntPrice = getDiscountedProductPrice('enterprise', 'monthly', 'valkyrie', { hasVantage: true, hasPraxis: true });
    expect(valkEntPrice.finalPrice).toBe(299);
    expect(valkEntPrice.discountSavings).toBe(200);
  });

  it('should grant 50% discount when customer buys/has all three companion products', () => {
    // Customer has Vantage, Praxis, and Valkyrie when buying Eris
    const erisDiscount = calculateErisDiscount(true, true, true);
    expect(erisDiscount.discountPercent).toBe(50);
    expect(erisDiscount.discountMultiplier).toBe(0.5);

    // Customer has Vantage, Praxis, and Eris when buying Valkyrie
    const valkDiscount = calculateBundleDiscount('valkyrie', { hasVantage: true, hasPraxis: true, hasEris: true });
    expect(valkDiscount.discountPercent).toBe(50);
    expect(valkDiscount.discountMultiplier).toBe(0.5);

    // Pro Monthly: $49 * 0.5 = 24.5 -> $25 ($24 savings)
    const valkProMonthly = getDiscountedProductPrice('pro', 'monthly', 'valkyrie', { hasVantage: true, hasPraxis: true, hasEris: true });
    expect(valkProMonthly.finalPrice).toBe(25);
    expect(valkProMonthly.discountSavings).toBe(24);

    // Pro Annual: $39 * 0.5 = 19.5 -> $20 ($19 savings)
    const valkProAnnual = getDiscountedProductPrice('pro', 'annual', 'valkyrie', { hasVantage: true, hasPraxis: true, hasEris: true });
    expect(valkProAnnual.finalPrice).toBe(20);
    expect(valkProAnnual.discountSavings).toBe(19);

    // Enterprise Monthly: $499 * 0.5 = 249.5 -> $250 ($249 savings)
    const valkEntMonthly = getDiscountedProductPrice('enterprise', 'monthly', 'valkyrie', { hasVantage: true, hasPraxis: true, hasEris: true });
    expect(valkEntMonthly.finalPrice).toBe(250);
    expect(valkEntMonthly.discountSavings).toBe(249);

    // Enterprise Annual: $399 * 0.5 = 199.5 -> $200 ($199 savings)
    const valkEntAnnual = getDiscountedProductPrice('enterprise', 'annual', 'valkyrie', { hasVantage: true, hasPraxis: true, hasEris: true });
    expect(valkEntAnnual.finalPrice).toBe(200);
    expect(valkEntAnnual.discountSavings).toBe(199);
  });

  it('should return 0% discount when no companion products are owned', () => {
    const valkDiscount = calculateBundleDiscount('valkyrie', {});
    expect(valkDiscount.discountPercent).toBe(0);
    expect(valkDiscount.discountMultiplier).toBe(1.0);

    const valkProPrice = getDiscountedProductPrice('pro', 'monthly', 'valkyrie', {});
    expect(valkProPrice.finalPrice).toBe(49);
    expect(valkProPrice.isDiscounted).toBe(false);
  });
});
