import { NextResponse } from "next/server";
import { AdkSessionService } from "@/lib/adk/session-service";
import { getCurrentUserId } from "@/lib/auth";

export async function POST(): Promise<NextResponse> {
  try {
    // Get authenticated user ID
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create new ADK session
    const newSession = await AdkSessionService.createSession(userId);

    return NextResponse.json({
      sessionId: newSession.id,
      success: true,
    });
  } catch (error) {
    console.error("Failed to create session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
