"use server";

import { revalidatePath } from "next/cache";
import { AdkSessionService } from "@/lib/adk/session-service";
import { requireUserId } from "@/lib/auth";

export async function deleteSession(
  sessionId: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const userId = await requireUserId();

    // Delete session using ADK service
    await AdkSessionService.deleteSession(userId, sessionId);

    revalidatePath("/history");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete session:", error);
    return { error: "Failed to delete conversation" };
  }
}
