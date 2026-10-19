import { NextResponse } from "next/server";
import { getSession, computeTally } from "@/lib/curia/sessions-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId") || "sf-board-of-supervisors";

    const session = getSession(sessionId);
    const tally = computeTally(session, session.activeMotionId);

    return NextResponse.json({
      success: true,
      session,
      tally
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load Curia session" },
      { status: 500 }
    );
  }
}
