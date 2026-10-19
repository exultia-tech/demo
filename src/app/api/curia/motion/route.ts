import { NextResponse } from "next/server";
import { 
  freezeMotionText, 
  openVotingOnMotion, 
  closeVotingAndDropGavel,
  getSession 
} from "@/lib/curia/sessions-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, sessionId = "sf-board-of-supervisors", motionId, text } = body;

    if (!motionId || !action) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: action, motionId" },
        { status: 400 }
      );
    }

    if (action === "freeze") {
      const motion = freezeMotionText(sessionId, motionId, text);
      return NextResponse.json({ success: true, motion });
    }

    if (action === "open") {
      const motion = openVotingOnMotion(sessionId, motionId);
      return NextResponse.json({ success: true, motion });
    }

    if (action === "gavel") {
      const tally = closeVotingAndDropGavel(sessionId, motionId);
      const session = getSession(sessionId);
      const motion = session.motions.find(m => m.id === motionId);
      return NextResponse.json({ success: true, tally, motion });
    }

    return NextResponse.json(
      { success: false, error: `Unknown action: ${action}. Valid actions: freeze, open, gavel` },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to execute motion action" },
      { status: 400 }
    );
  }
}
