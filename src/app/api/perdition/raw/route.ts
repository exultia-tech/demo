import { NextRequest, NextResponse } from "next/server";
import { compilePerditionChaosScript } from "@/lib/perdition-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const os = (searchParams.get("os") || "ubuntu") as "ubuntu" | "debian" | "rhel" | "rocky" | "alpine";
  const modulesParam = searchParams.get("modules");
  const selectedModuleIds = modulesParam ? modulesParam.split(",").map(s => s.trim()).filter(Boolean) : undefined;
  const rollbackMins = parseInt(searchParams.get("rollback") || "30", 10);

  const result = compilePerditionChaosScript(os, selectedModuleIds, isNaN(rollbackMins) ? 30 : rollbackMins);

  return new NextResponse(result.script, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      "Content-Disposition": "inline; filename=\"perdition-inoculate.sh\""
    }
  });
}
