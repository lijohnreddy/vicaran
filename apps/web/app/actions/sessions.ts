"use server";

import { AdkSessionService } from "@/lib/adk/session-service";
import type { AdkSession, AdkEvent } from "@/lib/adk/session-service";

/**
 * Server action to get session with events for polling
 */
export async function getSessionEvents(
  userId: string,
  sessionId: string
): Promise<{
  success: boolean;
  data?: AdkSession & { events: AdkEvent[] };
  error?: string;
}> {
  try {
    const session = await AdkSessionService.getSessionWithEvents(
      userId,
      sessionId
    );

    if (!session) {
      return {
        success: false,
        error: "Session not found",
      };
    }

    return {
      success: true,
      data: session,
    };
  } catch (error) {
    console.error("❌ [SESSION_ACTION] Failed to get session events:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get session events",
    };
  }
}
