import { NextRequest, NextResponse } from "next/server";
import {
  compileErisChaosScript,
  ERIS_MODULES,
  ERIS_MANDATORY_DISCLAIMER
} from "@/lib/eris-data";

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

    const result = compileErisChaosScript(os, selectedModuleIds, autoRollbackMinutes);

    return NextResponse.json({
      success: true,
      id: `eris-${Date.now()}`,
      timestamp: new Date().toISOString(),
      targetOs: os,
      autoRollbackMinutes,
      activeModules: result.activeModules,
      script: result.script,
      rollbackCommand: result.rollbackCommand,
      disclaimer: ERIS_MANDATORY_DISCLAIMER,
      praxisRemediationUrl: "/app/praxis?erisRemediate=true"
    });
  } catch (error: any) {
    console.error("[Eris API] Script compilation error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to compile Eris inoculation script" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    name: "Eris Chaos API",
    version: "1.0",
    modules: ERIS_MODULES,
    disclaimer: ERIS_MANDATORY_DISCLAIMER
  });
}
