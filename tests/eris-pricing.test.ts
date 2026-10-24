import { describe, it, expect } from "vitest";
import {
  calculateErisDiscount,
  getErisPrice,
  ERIS_BASE_TIERS
} from "@/lib/eris-pricing";

describe("Eris Dynamic Bundle Pricing Engine", () => {

  describe("Discount Qualification Logic", () => {
    it("should provide 0% discount if the user owns neither Vantage nor Praxis", () => {
      const res = calculateErisDiscount(false, false);
      expect(res.discountPercent).toBe(0);
      expect(res.discountMultiplier).toBe(1.0);
      expect(res.qualifyingProducts).toEqual([]);
    });

    it("should provide 0% discount if the user owns Praxis only (Vantage required)", () => {
      const res = calculateErisDiscount(false, true);
      expect(res.discountPercent).toBe(0);
      expect(res.discountMultiplier).toBe(1.0);
      expect(res.qualifyingProducts).toEqual([]);
    });

    it("should provide 20% discount if the user owns Vantage", () => {
      const res = calculateErisDiscount(true, false);
      expect(res.discountPercent).toBe(20);
      expect(res.discountMultiplier).toBe(0.8);
      expect(res.qualifyingProducts).toContain("Vantage");
      expect(res.discountLabel).toContain("20%");
    });

    it("should provide 40% discount if the user owns BOTH Vantage AND Praxis", () => {
      const res = calculateErisDiscount(true, true);
      expect(res.discountPercent).toBe(40);
      expect(res.discountMultiplier).toBe(0.6);
      expect(res.qualifyingProducts).toContain("Vantage");
      expect(res.qualifyingProducts).toContain("Praxis");
      expect(res.discountLabel).toContain("40%");
    });
  });

  describe("Price Computation - Pro Tier ($49/mo, $39/mo annual)", () => {
    it("should calculate standard Pro price without discounts", () => {
      const monthly = getErisPrice("pro", "monthly", false, false);
      expect(monthly.basePrice).toBe(49);
      expect(monthly.finalPrice).toBe(49);
      expect(monthly.isDiscounted).toBe(false);

      const annual = getErisPrice("pro", "annual", false, false);
      expect(annual.basePrice).toBe(39);
      expect(annual.finalPrice).toBe(39);
      expect(annual.isDiscounted).toBe(false);
    });

    it("should apply 20% discount on Pro for Vantage owners ($39/mo, $31/mo annual)", () => {
      const monthly = getErisPrice("pro", "monthly", true, false);
      expect(monthly.basePrice).toBe(49);
      expect(monthly.finalPrice).toBe(39); // 49 * 0.8 = 39.2 -> 39
      expect(monthly.discountPercent).toBe(20);
      expect(monthly.isDiscounted).toBe(true);

      const annual = getErisPrice("pro", "annual", true, false);
      expect(annual.basePrice).toBe(39);
      expect(annual.finalPrice).toBe(31); // 39 * 0.8 = 31.2 -> 31
      expect(annual.discountPercent).toBe(20);
      expect(annual.isDiscounted).toBe(true);
    });

    it("should apply 40% discount on Pro for Vantage + Praxis owners ($29/mo, $23/mo annual)", () => {
      const monthly = getErisPrice("pro", "monthly", true, true);
      expect(monthly.basePrice).toBe(49);
      expect(monthly.finalPrice).toBe(29); // 49 * 0.6 = 29.4 -> 29
      expect(monthly.discountPercent).toBe(40);
      expect(monthly.isDiscounted).toBe(true);

      const annual = getErisPrice("pro", "annual", true, true);
      expect(annual.basePrice).toBe(39);
      expect(annual.finalPrice).toBe(23); // 39 * 0.6 = 23.4 -> 23
      expect(annual.discountPercent).toBe(40);
      expect(annual.isDiscounted).toBe(true);
    });
  });

  describe("Price Computation - Enterprise Range Tier ($499/mo, $399/mo annual)", () => {
    it("should apply 20% discount on Enterprise for Vantage owners", () => {
      const monthly = getErisPrice("enterprise", "monthly", true, false);
      expect(monthly.basePrice).toBe(499);
      expect(monthly.finalPrice).toBe(399); // 499 * 0.8 = 399.2 -> 399
      expect(monthly.discountPercent).toBe(20);

      const annual = getErisPrice("enterprise", "annual", true, false);
      expect(annual.basePrice).toBe(399);
      expect(annual.finalPrice).toBe(319); // 399 * 0.8 = 319.2 -> 319
      expect(annual.discountPercent).toBe(20);
    });

    it("should apply 40% discount on Enterprise for Vantage + Praxis owners", () => {
      const monthly = getErisPrice("enterprise", "monthly", true, true);
      expect(monthly.basePrice).toBe(499);
      expect(monthly.finalPrice).toBe(299); // 499 * 0.6 = 299.4 -> 299
      expect(monthly.discountPercent).toBe(40);

      const annual = getErisPrice("enterprise", "annual", true, true);
      expect(annual.basePrice).toBe(399);
      expect(annual.finalPrice).toBe(239); // 399 * 0.6 = 239.4 -> 239
      expect(annual.discountPercent).toBe(40);
    });
  });

  describe("Community Tier", () => {
    it("should always remain $0 regardless of discount state", () => {
      const freeMonthly = getErisPrice("community", "monthly", true, true);
      expect(freeMonthly.finalPrice).toBe(0);
      const freeAnnual = getErisPrice("community", "annual", false, false);
      expect(freeAnnual.finalPrice).toBe(0);
    });
  });

});
