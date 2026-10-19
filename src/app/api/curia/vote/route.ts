import { NextResponse } from "next/server";
import { castDelegateVote } from "@/lib/curia/sessions-store";
import { CuriaVoteChoice } from "@/lib/curia/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId = "sf-board-of-supervisors", motionId, delegateId, choice } = body;

    if (!motionId || !delegateId || !choice) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: motionId, delegateId, choice" },
        { status: 400 }
      );
    }

    const validChoices: CuriaVoteChoice[] = ["AYE", "NAY", "ABSTAIN", "RECUSE"];
    if (!validChoices.includes(choice)) {
      return NextResponse.json(
        { success: false, error: `Invalid choice: ${choice}. Must be AYE, NAY, ABSTAIN, or RECUSE.` },
        { status: 400 }
      );
    }

    const result = castDelegateVote(sessionId, motionId, delegateId, choice);

    return NextResponse.json({
      success: true,
      vote: result.vote,
      tally: result.tally,
      merkleProof: result.merkleProof
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to cast vote" },
      { status: 400 }
    );
  }
}
