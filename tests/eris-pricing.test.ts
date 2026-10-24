import { describe, it, expect } from "vitest";
import {
  calculateErisDiscount,
  getErisPrice,
  ERIS_BASE_TIERS
} from "@/lib/eris-pricing";

describe("Eris Dynamic Bundle Pricing Engine (30%, 40%, 50% Discounts)", () => {

  describe("Discount Qualification Logic", () => {
    it("should provide 0% discount if the user owns no companion products", () => {
      const res = calculateErisDiscount(false, false, false);
      expect(res.discountPercent).toBe(0);
      expect(res.discountMultiplier).toBe(1.0);
      expect(res.qualifyingProducts).toEqual([]);
    });

    it("should provide 30% discount if the user owns 1 companion product (e.g. Vantage)", () => {
      const res = calculateErisDiscount(true, false, false);
      expect(res.discountPercent).toBe(30);
      expect(res.discountMultiplier).toBe(0.7);
      expect(res.qualifyingProducts).toContain("Vantage");
      expect(res.discountLabel).toContain("30%");
    });

    it("should provide 40% discount if the user owns 2 companion products (e.g. Vantage + Praxis)", () => {
      const res = calculateErisDiscount(true, true, false);
      expect(res.discountPercent).toBe(40);
      expect(res.discountMultiplier).toBe(0.6);
      expect(res.qualifyingProducts).toContain("Vantage");
      expect(res.qualifyingProducts).toContain("Praxis");
      expect(res.discountLabel).toContain("40%");
    });

    it("should provide 50% discount if the user owns all three companion products (Vantage + Praxis + Valkyrie)", () => {
      const res = calculateErisDiscount(true, true, true);
      expect(res.discountPercent).toBe(50);
      expect(res.discountMultiplier).toBe(0.5);
      expect(res.qualifyingProducts).toContain("Vantage");
      expect(res.qualifyingProducts).toContain("Praxis");
      expect(res.qualifyingProducts).toContain("Valkyrie");
      expect(res.discountLabel).toContain("50%");
    });
  });

  describe("Price Computation - Pro Tier ($49/mo, $39/mo annual)", () => {
    it("should calculate standard Pro price without discounts", () => {
      const monthly = getErisPrice("pro", "monthly", false, false, false);
      expect(monthly.basePrice).toBe(49);
      expect(monthly.finalPrice).toBe(49);
      expect(monthly.isDiscounted).toBe(false);

      const annual = getErisPrice("pro", "annual", false, false, false);
      expect(annual.basePrice).toBe(39);
      expect(annual.finalPrice).toBe(39);
      expect(annual.isDiscounted).toBe(false);
    });

    it("should apply 30% discount on Pro for 1 companion product ($34/mo, $27/mo annual)", () => {
      const monthly = getErisPrice("pro", "monthly", true, false, false);
      expect(monthly.basePrice).toBe(49);
      expect(monthly.finalPrice).toBe(34); // 49 * 0.7 = 34.3 -> 34
      expect(monthly.discountPercent).toBe(30);
      expect(monthly.isDiscounted).toBe(true);

      const annual = getErisPrice("pro", "annual", true, false, false);
      expect(annual.basePrice).toBe(39);
      expect(annual.finalPrice).toBe(27); // 39 * 0.7 = 27.3 -> 27
      expect(annual.discountPercent).toBe(30);
      expect(annual.isDiscounted).toBe(true);
    });

    it("should apply 40% discount on Pro for 2 companion products ($29/mo, $23/mo annual)", () => {
      const monthly = getErisPrice("pro", "monthly", true, true, false);
      expect(monthly.basePrice).toBe(49);
      expect(monthly.finalPrice).toBe(29); // 49 * 0.6 = 29.4 -> 29
      expect(monthly.discountPercent).toBe(40);
      expect(monthly.isDiscounted).toBe(true);

      const annual = getErisPrice("pro", "annual", true, true, false);
      expect(annual.basePrice).toBe(39);
      expect(annual.finalPrice).toBe(23); // 39 * 0.6 = 23.4 -> 23
      expect(annual.discountPercent).toBe(40);
      expect(annual.isDiscounted).toBe(true);
    });

    it("should apply 50% discount on Pro for all three companion products ($25/mo, $20/mo annual)", () => {
      const monthly = getErisPrice("pro", "monthly", true, true, true);
      expect(monthly.basePrice).toBe(49);
      expect(monthly.finalPrice).toBe(25); // 49 * 0.5 = 24.5 -> 25
      expect(monthly.discountPercent).toBe(50);
      expect(monthly.isDiscounted).toBe(true);

      const annual = getErisPrice("pro", "annual", true, true, true);
      expect(annual.basePrice).toBe(39);
      expect(annual.finalPrice).toBe(20); // 39 * 0.5 = 19.5 -> 20
      expect(annual.discountPercent).toBe(50);
      expect(annual.isDiscounted).toBe(true);
    });
  });

  describe("Price Computation - Enterprise Range Tier ($499/mo, $399/mo annual)", () => {
    it("should apply 30% discount on Enterprise for 1 companion product", () => {
      const monthly = getErisPrice("enterprise", "monthly", true, false, false);
      expect(monthly.basePrice).toBe(499);
      expect(monthly.finalPrice).toBe(349); // 499 * 0.7 = 349.3 -> 349
      expect(monthly.discountPercent).toBe(30);

      const annual = getErisPrice("enterprise", "annual", true, false, false);
      expect(annual.basePrice).toBe(399);
      expect(annual.finalPrice).toBe(279); // 399 * 0.7 = 279.3 -> 279
      expect(annual.discountPercent).toBe(30);
    });

    it("should apply 40% discount on Enterprise for 2 companion products", () => {
      const monthly = getErisPrice("enterprise", "monthly", true, true, false);
      expect(monthly.basePrice).toBe(499);
      expect(monthly.finalPrice).toBe(299); // 499 * 0.6 = 299.4 -> 299
      expect(monthly.discountPercent).toBe(40);

      const annual = getErisPrice("enterprise", "annual", true, true, false);
      expect(annual.basePrice).toBe(399);
      expect(annual.finalPrice).toBe(239); // 399 * 0.6 = 239.4 -> 239
      expect(annual.discountPercent).toBe(40);
    });

    it("should apply 50% discount on Enterprise for all three companion products", () => {
      const monthly = getErisPrice("enterprise", "monthly", true, true, true);
      expect(monthly.basePrice).toBe(499);
      expect(monthly.finalPrice).toBe(250); // 499 * 0.5 = 249.5 -> 250
      expect(monthly.discountPercent).toBe(50);

      const annual = getErisPrice("enterprise", "annual", true, true, true);
      expect(annual.basePrice).toBe(399);
      expect(annual.finalPrice).toBe(200); // 399 * 0.5 = 199.5 -> 200
      expect(annual.discountPercent).toBe(50);
    });
  });

  describe("Community Tier", () => {
    it("should always remain $0 regardless of discount state", () => {
      const freeMonthly = getErisPrice("community", "monthly", true, true, true);
      expect(freeMonthly.finalPrice).toBe(0);
      const freeAnnual = getErisPrice("community", "annual", false, false, false);
      expect(freeAnnual.finalPrice).toBe(0);
    });
  });

});
