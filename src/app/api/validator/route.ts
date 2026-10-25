import { NextRequest, NextResponse } from "next/server";
import {
  generateFullValidatorReport,
  formatReportAsText,
  runIntegrityCheck,
  runLiveHotfixProbe,
  runRollbackBenchmark,
  getCveMitigationCatalog
} from "@/lib/validator-engine";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return handleValidatorRequest(request);
}

export async function POST(request: NextRequest) {
  return handleValidatorRequest(request);
}

async function handleValidatorRequest(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const testParam = searchParams.get("test") || "all";
  const cveParam = searchParams.get("cve") || undefined;
  const iterParam = searchParams.get("iterations");
  const iterations = iterParam ? parseInt(iterParam, 10) : 1000;

  const userAgent = request.headers.get("user-agent") || "";
  const acceptHeader = request.headers.get("accept") || "";
  const formatParam = searchParams.get("format");

  // Determine response format
  // Default to text if user-agent is curl/wget or format=text, unless format=json or accept=application/json
  const isCurlOrWget = /curl|wget/i.test(userAgent);
  const explicitlyJson = formatParam === "json" || (acceptHeader.includes("application/json") && formatParam !== "text");
  const wantsText = formatParam === "text" || (!explicitlyJson && isCurlOrWget);

  // If testing a single specific subsystem
  if (testParam === "hotfix") {
    const hotfix = runLiveHotfixProbe();
    if (wantsText) {
      const text = [
        `\x1b[0;36m\x1b[1m=== EXULTIA LIVE HOTFIX BEFORE-AND-AFTER CONDITION PROBE ===\x1b[0m`,
        `Target Service   : ${hotfix.targetService} (${hotfix.cve})`,
        `\x1b[1;33m[1. BEFORE CONDITION]\x1b[0m State: ${hotfix.before.state}`,
        `  Directive      : ${hotfix.before.configDirective}`,
        `  Socket / PID   : ${hotfix.before.openSocket} (PID: ${hotfix.before.pid})`,
        `  Baseline SHA   : ${hotfix.before.sha256Baseline}`,
        `  Window         : ${hotfix.before.vulnerabilityWindow}`,
        `\x1b[0;36m[2. HOTFIX MUTATION]\x1b[0m`,
        `  Target         : ${hotfix.hotfixMutation.targetPath}`,
        `  Applied        : ${hotfix.hotfixMutation.appliedDirective}`,
        `  Diff           :\n${hotfix.hotfixMutation.unifiedDiff}`,
        `\x1b[0;32m[3. AFTER CONDITION]\x1b[0m State: ${hotfix.after.state}`,
        `  Directive      : ${hotfix.after.configDirective}`,
        `  Socket / PID   : ${hotfix.after.openSocket} (PID: ${hotfix.after.pid})`,
        `  Downtime       : ${hotfix.after.downtimeSeconds}s (Zero Downtime)`,
        `  Post-SHA256    : ${hotfix.after.sha256PostHotfix}`,
        `\x1b[0;35m[4. DETERMINISTIC ROLLBACK]\x1b[0m`,
        `  Latency        : ${hotfix.rollback.durationMs.toFixed(4)} ms (${hotfix.rollback.durationUs} µs)`,
        `  Restored SHA   : ${hotfix.rollback.sha256AfterRollback}`,
        `  Bitwise Match  : ${hotfix.rollback.bitwiseBaselineMatch ? "\x1b[0;32m100% IDENTICAL\x1b[0m" : "MISMATCH"}`
      ].join("\n");
      return new NextResponse(text + "\n", {
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }
    return NextResponse.json({ test: "hotfix", result: hotfix });
  }

  if (testParam === "rollback") {
    const stats = runRollbackBenchmark(iterations);
    if (wantsText) {
      const text = [
        `\x1b[0;36m\x1b[1m=== EXULTIA DETERMINISTIC ROLLBACK STATISTICAL BENCHMARK ===\x1b[0m`,
        `Iterations      : ${stats.iterations}`,
        `Mean Latency    : ${stats.meanLatencyMs.toFixed(4)} ms`,
        `Median (p50)    : ${stats.medianLatencyMs.toFixed(4)} ms`,
        `99th Percentile : ${stats.p99LatencyMs.toFixed(4)} ms`,
        `Min / Max       : ${stats.minLatencyMs.toFixed(4)} ms / ${stats.maxLatencyMs.toFixed(4)} ms`,
        `SLA Compliance  : ${stats.slaCompliancePercent}% (<${stats.slaLimitMs}ms SLA target)`
      ].join("\n");
      return new NextResponse(text + "\n", {
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }
    return NextResponse.json({ test: "rollback", result: stats });
  }

  if (testParam === "cve") {
    const catalog = getCveMitigationCatalog(cveParam);
    if (wantsText) {
      const text = [
        `\x1b[0;36m\x1b[1m=== EXULTIA PRODUCTION CVE MITIGATION CATALOG ===\x1b[0m`,
        ...catalog.map(
          c =>
            `• ${c.cve} [${c.severity} | CVSS ${c.cvss}]: ${c.title}\n  BEFORE: ${c.beforeCondition}\n  AFTER : ${c.afterCondition}\n  Status: [${c.status}] (Zero Downtime: ${c.zeroDowntimeSupported})\n`
        )
      ].join("\n");
      return new NextResponse(text + "\n", {
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }
    return NextResponse.json({ test: "cve", count: catalog.length, result: catalog });
  }

  if (testParam === "integrity") {
    const integrity = runIntegrityCheck();
    if (wantsText) {
      const text = [
        `\x1b[0;36m\x1b[1m=== EXULTIA SLSA LEVEL 3 INTEGRITY VERIFICATION ===\x1b[0m`,
        `Status: ${integrity.passed ? "PASSED" : "FAILED"}`,
        ...integrity.artifacts.map(
          a =>
            `• [${a.matched ? "PASS" : "FAIL"}] ${a.file} (${a.sizeBytes} bytes)\n  Expected: ${a.expectedHash}\n  Computed: ${a.computedHash}`
        )
      ].join("\n");
      return new NextResponse(text + "\n", {
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }
    return NextResponse.json({ test: "integrity", result: integrity });
  }

  // Full verification suite report
  const fullReport = generateFullValidatorReport({
    iterations,
    filterCve: cveParam
  });

  if (wantsText) {
    const formatted = formatReportAsText(fullReport);
    return new NextResponse(formatted, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Exultia-Validator-Verdict": fullReport.summary.status,
        "X-Exultia-SLSA-Integrity": fullReport.gates.slsaLevel3Integrity.passed ? "VERIFIED" : "FAILED",
        "X-Exultia-Rollback-SLA": fullReport.gates.rollbackBenchmark.slaCompliancePercent >= 99 ? "COMPLIANT" : "VIOLATED",
        "Cache-Control": "no-store, max-age=0"
      }
    });
  }

  return NextResponse.json(fullReport, {
    headers: {
      "X-Exultia-Validator-Verdict": fullReport.summary.status,
      "X-Exultia-SLSA-Integrity": fullReport.gates.slsaLevel3Integrity.passed ? "VERIFIED" : "FAILED",
      "X-Exultia-Rollback-SLA": fullReport.gates.rollbackBenchmark.slaCompliancePercent >= 99 ? "COMPLIANT" : "VIOLATED",
      "Cache-Control": "no-store, max-age=0"
    }
  });
}
