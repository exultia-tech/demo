import { describe, it, expect } from "vitest";
import {
  generateFullValidatorReport,
  runIntegrityCheck,
  runLiveHotfixProbe,
  runRollbackBenchmark,
  getVantageThreatSamples,
  formatReportAsText
} from "@/lib/validator-engine";

describe("Exultia Control Server Validator Engine with Vantage Feed", () => {
  it("satisfies SLSA Level 3 cryptographic integrity check", () => {
    const result = runIntegrityCheck();
    expect(result.artifacts.length).toBeGreaterThan(0);
    expect(result.passed).toBe(true);
    for (const art of result.artifacts) {
      expect(art.matched).toBe(true);
      expect(art.computedHash).toBe(art.expectedHash);
    }
  });

  it("verifies live hotfix before, mutation, after, and rollback conditions with command outputs", () => {
    const hotfix = runLiveHotfixProbe();
    expect(hotfix.cve).toBe("CVE-2024-6387");
    expect(hotfix.before.state).toContain("VULNERABLE");
    expect(hotfix.before.configDirective).toBe("LoginGraceTime 120");
    expect(hotfix.before.commandsExecuted.length).toBeGreaterThan(0);
    expect(hotfix.after.state).toContain("MITIGATED");
    expect(hotfix.after.configDirective).toBe("LoginGraceTime 0");
    expect(hotfix.after.commandsExecuted.length).toBeGreaterThan(0);
    expect(hotfix.after.downtimeSeconds).toBe(0);
    expect(hotfix.rollback.bitwiseBaselineMatch).toBe(true);
    expect(hotfix.rollback.durationMs).toBeLessThan(50);
  });

  it("executes deterministic rollback benchmark within sub-50ms SLA", () => {
    const benchmark = runRollbackBenchmark(200);
    expect(benchmark.iterations).toBe(200);
    expect(benchmark.meanLatencyMs).toBeLessThan(10);
    expect(benchmark.p99LatencyMs).toBeLessThan(50);
    expect(benchmark.slaCompliancePercent).toBeGreaterThanOrEqual(99);
  });

  it("connects to Vantage threat feed and evaluates 50 newest threat samples", async () => {
    const result = await getVantageThreatSamples({ samples: 50, order: "newest" });
    expect(result.telemetry.status).toBe("CONNECTED");
    expect(result.telemetry.totalAvailableAdvisories).toBeGreaterThanOrEqual(50);
    expect(result.samples.length).toBe(50);
    expect(result.summary.totalEvaluated).toBe(50);
    expect(result.summary.samplingOrder).toBe("newest");
    expect(result.summary.rollbackVerifiedCount).toBe(50);
    expect(result.summary.zeroDowntimeVerifiedCount).toBe(50);
    for (const s of result.samples) {
      expect(s.cve).toBeTruthy();
      expect(s.status).toBe("VERIFIED_MITIGATED");
      expect(s.zeroDowntimeSupported).toBe(true);
      expect(s.rollbackCommand).toBeTruthy();
    }
  });

  it("supports uniform random sampling of 50 threat items from Vantage feed", async () => {
    const result = await getVantageThreatSamples({ samples: 50, order: "random" });
    expect(result.samples.length).toBe(50);
    expect(result.summary.samplingOrder).toBe("random");
    expect(result.summary.rollbackVerifiedCount).toBe(50);
  });

  it("generates full report and formats clean terminal text output with Vantage telemetry", async () => {
    const report = await generateFullValidatorReport({ iterations: 100, samples: 50 });
    expect(report.summary.status).toBe("PASS");
    expect(report.summary.zeroVaporwareCertified).toBe(true);
    expect(report.gates.vantageFeedConnection.status).toBe("CONNECTED");
    expect(report.gates.cveMitigations.totalEvaluated).toBe(50);

    const text = formatReportAsText(report);
    expect(text).toContain("THE \"BULLSHIT VALIDATOR\"");
    expect(text).toContain("VANTAGE FEED CONNECTION VERIFICATION:");
    expect(text).toContain("VALIDATING 50 THREAT SAMPLES");
    expect(text).toContain("FLEET THREAT SAMPLE VALIDATION SUMMARY:");
    expect(text).toContain("ALL VERIFICATION GATES PASSED [ZERO VAPORWARE]");
  });
});
