import { NextResponse } from "next/server";
import { exportDossier, getSession } from "@/lib/curia/sessions-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId") || "sf-board-of-supervisors";
    const session = getSession(sessionId);
    const motionId = searchParams.get("motionId") || session.activeMotionId;

    const dossier = exportDossier(sessionId, motionId);

    return NextResponse.json({
      success: true,
      dossier
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to generate Canvass Dossier" },
      { status: 500 }
    );
  }
}
