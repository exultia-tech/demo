import { NextResponse } from "next/server";
import { 
  toggleHardwareInterlockKeys, 
  triggerHardwareTamper, 
  resetHardwareTamper,
  getSession
} from "@/lib/curia/sessions-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, sessionId = "sf-board-of-supervisors" } = body;

    if (action === "set-keys") {
      const { keyA, keyB } = body;
      const status = toggleHardwareInterlockKeys(sessionId, Boolean(keyA), Boolean(keyB));
      return NextResponse.json({ success: true, hardwareContainer: status });
    }

    if (action === "trigger-tamper") {
      const sensor = body.sensor || "OPTICAL_INTRUSION";
      const status = triggerHardwareTamper(sessionId, sensor);
      return NextResponse.json({ success: true, hardwareContainer: status });
    }

    if (action === "reset-tamper") {
      const status = resetHardwareTamper(sessionId);
      return NextResponse.json({ success: true, hardwareContainer: status });
    }

    if (action === "status") {
      const session = getSession(sessionId);
      return NextResponse.json({ success: true, hardwareContainer: session.hardwareContainer });
    }

    return NextResponse.json(
      { success: false, error: `Invalid action: ${action}` },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Hardware container operation failed" },
      { status: 400 }
    );
  }
}
