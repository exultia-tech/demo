import { describe, it, expect } from "vitest";
import {
  UVI_PUBLIC_FEED_SOURCES,
  CONSOLIDATED_UVI_ADVISORIES,
  getActionDirectiveBadge,
  getWeaponizationStageLabel,
  getExposureHorizonLabel,
} from "@/lib/threat-feed-data";

describe("UVI / Vantage Module: Universal Vulnerability Index", () => {
  describe("Public Threat Feed Directory", () => {
    it("should include 30+ comprehensive public threat feed sources", () => {
      expect(UVI_PUBLIC_FEED_SOURCES.length).toBeGreaterThanOrEqual(30);

      const feedIds = UVI_PUBLIC_FEED_SOURCES.map((f) => f.id);
      expect(feedIds).toContain("urlhaus");
      expect(feedIds).toContain("threatfox");

      for (const feed of UVI_PUBLIC_FEED_SOURCES) {
        expect(feed.id).toBeDefined();
        expect(feed.name.length).toBeGreaterThan(0);
        expect(feed.category.length).toBeGreaterThan(0);
        expect(feed.scope.length).toBeGreaterThan(0);
        expect(feed.homepageUrl).toMatch(/^https?:\/\//);
        expect(feed.recordsIngested).toBeGreaterThan(0);
      }
    });

    it("should categorize feeds across distinct intelligence categories", () => {
      const categories = new Set(UVI_PUBLIC_FEED_SOURCES.map((f) => f.category));
      expect(categories.has("Malware, C2 & Botnets")).toBe(true);
      expect(categories.has("Phishing & Fraud")).toBe(true);
      expect(categories.has("IP Reputation, Scanners & Network Telemetry")).toBe(true);
      expect(categories.has("Vulnerabilities & Exploitation")).toBe(true);
    });
  });

  describe("Observational Behavioral Rating Helpers", () => {
    it("should format action directive badges with corresponding colors", () => {
      const patchBadge = getActionDirectiveBadge("PATCH");
      expect(patchBadge.label).toContain("PATCH");
      expect(patchBadge.text).toBeDefined();
      expect(patchBadge.bg).toBeDefined();

      const isolateBadge = getActionDirectiveBadge("ISOLATE_NETWORK_SEGMENT");
      expect(isolateBadge.label).toBeDefined();
    });

    it("should return human-readable weaponization stage labels", () => {
      expect(getWeaponizationStageLabel("ACTIVE_CAMPAIGNS")).toContain("Active Campaigns");
      expect(getWeaponizationStageLabel("THEORETICAL_VECTOR")).toContain("Theoretical");
    });

    it("should return human-readable exposure horizon labels", () => {
      expect(getExposureHorizonLabel("DEVELOPER_WORKSTATION")).toContain("Developer Workstation");
      expect(getExposureHorizonLabel("CI_CD_PIPELINE")).toContain("CI/CD");
    });
  });

  describe("Consolidated Threat Advisories", () => {
    it("should contain parsed advisories with required CVSS, severity, and build impact", () => {
      expect(CONSOLIDATED_UVI_ADVISORIES.length).toBeGreaterThan(0);
      for (const adv of CONSOLIDATED_UVI_ADVISORIES.slice(0, 50)) {
        expect(adv.uviId).toBeDefined();
        expect(adv.title.length).toBeGreaterThan(0);
        expect(["CRITICAL", "HIGH", "MEDIUM", "LOW"]).toContain(adv.severity);
        expect(adv.cvssScore).toBeGreaterThanOrEqual(0);
        expect(adv.cvssScore).toBeLessThanOrEqual(10);
        expect(adv.ideBuildImpact).toBeDefined();
      }
    });
  });
});
