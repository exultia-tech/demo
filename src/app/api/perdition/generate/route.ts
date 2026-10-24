import { NextRequest, NextResponse } from "next/server";
import {
  compilePerditionChaosScript,
  PERDITION_MODULES,
  PERDITION_MANDATORY_DISCLAIMER
} from "@/lib/perdition-data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const os = (body.os || "ubuntu") as "ubuntu" | "debian" | "rhel" | "rocky" | "alpine";
    const selectedModuleIds: string[] | undefined = Array.isArray(body.selectedModuleIds)
      ? body.selectedModuleIds
      : undefined;
    const autoRollbackMinutes = typeof body.autoRollbackMinutes === "number"
      ? Math.max(0, body.autoRollbackMinutes)
      : 30;

    const result = compilePerditionChaosScript(os, selectedModuleIds, autoRollbackMinutes);

    return NextResponse.json({
      success: true,
      id: `perdition-${Date.now()}`,
      timestamp: new Date().toISOString(),
      targetOs: os,
      autoRollbackMinutes,
      activeModules: result.activeModules,
      script: result.script,
      rollbackCommand: result.rollbackCommand,
      disclaimer: PERDITION_MANDATORY_DISCLAIMER,
      praxisRemediationUrl: "/app/praxis?perditionRemediate=true"
    });
  } catch (error: any) {
    console.error("[Perdition API] Script compilation error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to compile Perdition inoculation script" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    name: "Perdition Chaos API",
    version: "1.0",
    modules: PERDITION_MODULES,
    disclaimer: PERDITION_MANDATORY_DISCLAIMER
  });
}
