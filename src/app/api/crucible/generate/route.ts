import { NextRequest, NextResponse } from "next/server";
import {
  compileCrucibleChaosScript,
  CRUCIBLE_MODULES,
  CRUCIBLE_MANDATORY_DISCLAIMER
} from "@/lib/crucible-data";

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

    const result = compileCrucibleChaosScript(os, selectedModuleIds, autoRollbackMinutes);

    return NextResponse.json({
      success: true,
      id: `crucible-${Date.now()}`,
      timestamp: new Date().toISOString(),
      targetOs: os,
      autoRollbackMinutes,
      activeModules: result.activeModules,
      script: result.script,
      rollbackCommand: result.rollbackCommand,
      disclaimer: CRUCIBLE_MANDATORY_DISCLAIMER,
      praxisRemediationUrl: "/app/praxis?crucibleRemediate=true"
    });
  } catch (error: any) {
    console.error("[Crucible API] Script compilation error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to compile Crucible inoculation script" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    name: "Crucible Chaos API",
    version: "1.0",
    modules: CRUCIBLE_MODULES,
    disclaimer: CRUCIBLE_MANDATORY_DISCLAIMER
  });
}
