import { NextRequest, NextResponse } from "next/server";
import {
  VALKYRIE_PROBE_CATALOG,
  executeValkyrieProbe,
  compileValkyrieProbeScript,
  generateExecutivePentestReport,
  type PentestExecutionRequest
} from "@/lib/valkyrie-data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetHost = String(body.targetHost || "127.0.0.1").trim();
    const probeId = String(body.probeId || "probe-regresshion").trim();
    const targetType = (body.targetType || "simulated_sandbox") as "remote_host" | "docker_container" | "simulated_sandbox";
    
    // Find probe in catalog
    const probe = VALKYRIE_PROBE_CATALOG.find(p => p.id === probeId) || VALKYRIE_PROBE_CATALOG[0];
    const targetPort = typeof body.targetPort === "number" && body.targetPort > 0 
      ? body.targetPort 
      : probe.defaultPort;

    const executionReq: PentestExecutionRequest = {
      targetHost,
      targetPort,
      targetType,
      probeId: probe.id,
      cveRef: probe.cveRef,
      protocol: probe.probeProtocol,
      timeoutMs: typeof body.timeoutMs === "number" ? body.timeoutMs : 5000
    };

    // Execute probe
    const result = executeValkyrieProbe(executionReq, probe);
    const cliScript = compileValkyrieProbeScript(probe, targetHost, targetPort);
    const markdownReport = generateExecutivePentestReport(result);

    return NextResponse.json({
      success: true,
      result,
      cliScript,
      markdownReport,
      praxisRemediationUrl: result.praxisRemediationLink,
      erisChaosUrl: result.erisChaosLink,
      vantageAdvisoryUrl: result.vantageAdvisoryLink
    });
  } catch (err: any) {
    console.error("[Valkyrie API] Probe error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to execute Valkyrie pentest probe" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    engine: "Valkyrie On-Demand Pentest & BAS Engine",
    version: "1.0",
    catalogCount: VALKYRIE_PROBE_CATALOG.length,
    probes: VALKYRIE_PROBE_CATALOG
  });
}
