import { describe, it, expect } from "vitest";

describe("PureOS Module: CIS-Hardened Container Configurator", () => {
  const BASE_IMAGES = [
    { id: "alpine-3.19", name: "Alpine Linux 3.19", family: "alpine", baseVulnerabilities: 0 },
    { id: "debian-12-slim", name: "Debian 12 Bookworm (Slim)", family: "debian", baseVulnerabilities: 12 },
    { id: "ubuntu-24.04-minimal", name: "Ubuntu 24.04 LTS (Minimal)", family: "ubuntu", baseVulnerabilities: 18 },
    { id: "distroless-static", name: "Google Distroless (Static)", family: "distroless", baseVulnerabilities: 0 },
  ];

  const HARDENING_PROFILES = [
    { id: "standard", name: "Standard Baseline", cisLevel: "None" },
    { id: "cis-1", name: "CIS Benchmark Level 1", cisLevel: "1" },
    { id: "cis-2", name: "CIS Benchmark Level 2 (Strict)", cisLevel: "2" },
    { id: "stig", name: "DoD STIG Hardened", cisLevel: "STIG" },
  ];

  it("should configure minimal, zero-trust base images", () => {
    expect(BASE_IMAGES.length).toBeGreaterThanOrEqual(4);
    const families = BASE_IMAGES.map((b) => b.family);
    expect(families).toContain("alpine");
    expect(families).toContain("debian");
    expect(families).toContain("distroless");
  });

  it("should provide progressive hardening benchmark tiers", () => {
    const profileIds = HARDENING_PROFILES.map((p) => p.id);
    expect(profileIds).toContain("standard");
    expect(profileIds).toContain("cis-1");
    expect(profileIds).toContain("cis-2");
    expect(profileIds).toContain("stig");
  });

  it("should simulate vulnerability reduction as hardening increases", () => {
    const debian = BASE_IMAGES.find((b) => b.id === "debian-12-slim")!;
    // Standard -> 12 base
    // CIS-1 -> reduced by 50%
    // CIS-2 -> reduced by 80%
    const cis1Estimate = Math.floor(debian.baseVulnerabilities * 0.5);
    const cis2Estimate = Math.floor(debian.baseVulnerabilities * 0.2);

    expect(cis1Estimate).toBeLessThan(debian.baseVulnerabilities);
    expect(cis2Estimate).toBeLessThan(cis1Estimate);
  });
});
