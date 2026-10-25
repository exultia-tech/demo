import { describe, it, expect } from "vitest";
import {
  generateFullValidatorReport,
  runIntegrityCheck,
  runLiveHotfixProbe,
  runRollbackBenchmark,
  getCveMitigationCatalog,
  formatReportAsText
} from "@/lib/validator-engine";

describe("Exultia Control Server Validator Engine", () => {
  it("satisfies SLSA Level 3 cryptographic integrity check", () => {
    const result = runIntegrityCheck();
    expect(result.artifacts.length).toBeGreaterThan(0);
    expect(result.passed).toBe(true);
    for (const art of result.artifacts) {
      expect(art.matched).toBe(true);
      expect(art.computedHash).toBe(art.expectedHash);
    }
  });

  it("verifies live hotfix before, mutation, after, and rollback conditions", () => {
    const hotfix = runLiveHotfixProbe();
    expect(hotfix.cve).toBe("CVE-2024-6387");
    expect(hotfix.before.state).toContain("VULNERABLE");
    expect(hotfix.before.configDirective).toBe("LoginGraceTime 120");
    expect(hotfix.after.state).toContain("MITIGATED");
    expect(hotfix.after.configDirective).toBe("LoginGraceTime 0");
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

  it("exposes all enterprise CVE mitigations with zero-downtime support", () => {
    const cves = getCveMitigationCatalog();
    expect(cves.length).toBe(4);
    for (const item of cves) {
      expect(item.status).toBe("VERIFIED_MITIGATED");
      expect(item.zeroDowntimeSupported).toBe(true);
      expect(item.beforeCondition).toBeTruthy();
      expect(item.afterCondition).toBeTruthy();
    }
  });

  it("generates full report and formats clean terminal text output", () => {
    const report = generateFullValidatorReport({ iterations: 100 });
    expect(report.summary.status).toBe("PASS");
    expect(report.summary.zeroVaporwareCertified).toBe(true);

    const text = formatReportAsText(report);
    expect(text).toContain("THE \"BULLSHIT VALIDATOR\"");
    expect(text).toContain("ALL VERIFICATION GATES PASSED [ZERO VAPORWARE]");
  });
});
