import { describe, it, expect } from "vitest";

describe("Platform Gatekeeping & Tier Entitlements", () => {
  const TIER_WEIGHTS: Record<string, number> = {
    free: 0,
    pro: 10,
    legal: 10,
    enterprise: 20,
    developer: 20,
  };

  function checkAccess(userTier: string, requiredTier: string): boolean {
    const userWeight = TIER_WEIGHTS[userTier] ?? 0;
    const requiredWeight = TIER_WEIGHTS[requiredTier] ?? 0;
    return userWeight >= requiredWeight;
  }

  it("should enforce tier weight hierarchy correctly", () => {
    expect(TIER_WEIGHTS.free).toBe(0);
    expect(TIER_WEIGHTS.pro).toBe(10);
    expect(TIER_WEIGHTS.legal).toBe(10);
    expect(TIER_WEIGHTS.enterprise).toBe(20);
    expect(TIER_WEIGHTS.developer).toBe(20);
  });

  it("should grant access when user tier meets or exceeds required tier", () => {
    expect(checkAccess("free", "free")).toBe(true);
    expect(checkAccess("pro", "free")).toBe(true);
    expect(checkAccess("enterprise", "pro")).toBe(true);
    expect(checkAccess("developer", "pro")).toBe(true);
    expect(checkAccess("developer", "enterprise")).toBe(true);
  });

  it("should deny access when user tier is below required tier", () => {
    expect(checkAccess("free", "pro")).toBe(false);
    expect(checkAccess("free", "enterprise")).toBe(false);
    expect(checkAccess("pro", "enterprise")).toBe(false);
  });

  it("should handle unrecognized or missing tiers defensively as weight 0", () => {
    expect(checkAccess("unknown_tier", "pro")).toBe(false);
    expect(checkAccess("", "free")).toBe(true);
  });
});
