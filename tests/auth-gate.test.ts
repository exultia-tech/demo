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

  describe("Free Tier vs Enterprise Capabilities", () => {
    interface UserSubscription {
      product: string;
      tier: string;
      status: string;
    }

    interface MockUser {
      id: string;
      email: string;
      role: string;
      subscriptions: UserSubscription[];
    }

    function isEnterpriseSubscriber(user: MockUser): boolean {
      if (user.role === "admin") return true;
      return user.subscriptions.some(
        s => s.status === "active" && (s.tier.toLowerCase() === "enterprise" || s.tier.toLowerCase() === "developer")
      );
    }

    function canManageBasicAccount(user: MockUser): boolean {
      // Basic account management (profile, password, view plans) is available to all authenticated users
      return Boolean(user && user.id);
    }

    function canLinkGitHubWorkflows(user: MockUser): boolean {
      return isEnterpriseSubscriber(user);
    }

    function canGenerateApiTokens(user: MockUser): boolean {
      return isEnterpriseSubscriber(user);
    }

    const freeOAuthUser: MockUser = {
      id: "usr_oauth_google_123",
      email: "engineer@company.com",
      role: "user",
      subscriptions: [
        { product: "pureide", tier: "free", status: "active" },
        { product: "uvi", tier: "free", status: "active" },
        { product: "inquest", tier: "free", status: "active" },
      ],
    };

    const enterpriseUser: MockUser = {
      id: "usr_paid_456",
      email: "lead@enterprise.com",
      role: "user",
      subscriptions: [
        { product: "pureide", tier: "enterprise", status: "active" },
        { product: "uvi", tier: "enterprise", status: "active" },
      ],
    };

    it("should allow free tier OAuth users to perform basic account management", () => {
      expect(canManageBasicAccount(freeOAuthUser)).toBe(true);
    });

    it("should deny free tier users access to enhanced workflows & custom GitHub Actions linking", () => {
      expect(canLinkGitHubWorkflows(freeOAuthUser)).toBe(false);
      expect(isEnterpriseSubscriber(freeOAuthUser)).toBe(false);
    });

    it("should deny free tier users access to programmatic API tokens", () => {
      expect(canGenerateApiTokens(freeOAuthUser)).toBe(false);
    });

    it("should grant enterprise subscribers access to enhanced workflows and API tokens", () => {
      expect(canLinkGitHubWorkflows(enterpriseUser)).toBe(true);
      expect(canGenerateApiTokens(enterpriseUser)).toBe(true);
    });
  });
});

