"use server";

import {
  createSessionName as dbCreateSessionName,
  updateSessionTitle as dbUpdateSessionTitle,
  getSessionName,
  checkSessionNameExists,
} from "@/lib/session-names";
import {
  generateSessionTitle,
  generateFallbackTitle,
} from "@/lib/ai/title-generation";
import type { SessionNameResult } from "@/lib/session-names";
import type { CreateSessionNameData } from "@/lib/drizzle/schema/session-names";
import { requireUserId } from "@/lib/auth";

/**
 * Create a session name with fallback title, then attempt AI generation
 *
 * @param sessionId - ADK session ID
 * @param userMessage - First user message for title generation
 * @returns Promise resolving to success/error result
 */
export async function createSessionNameWithAI(
  sessionId: string,
  userMessage: string
): Promise<SessionNameResult> {
  try {
    // Authenticate user
    const userId = await requireUserId();

    // Check if session name already exists
    const existingName = await checkSessionNameExists(sessionId, userId);
    if (existingName) {
      return {
        success: false,
        error: "Session name already exists",
      };
    }

    // Create fallback title immediately
    const fallbackTitle = generateFallbackTitle(userMessage);
    const sessionNameData: CreateSessionNameData = {
      session_id: sessionId,
      title: fallbackTitle,
      is_ai_generated: false,
    };

    const createResult = await dbCreateSessionName(userId, sessionNameData);
    if (!createResult.success) {
      return createResult;
    }

    // Trigger background AI title generation (fire-and-forget)
    generateAndUpdateTitle(sessionId, userId, userMessage).catch((error) => {
      console.error("Background AI title generation failed:", error);
    });

    return createResult;
  } catch (error) {
    console.error("Failed to create session name:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return {
      success: false,
      error: `Failed to create session name: ${errorMessage}`,
    };
  }
}

/**
 * Generate AI title and update session name (async background process)
 *
 * @param sessionId - ADK session ID
 * @param userId - User ID
 * @param userMessage - User message for title generation
 */
async function generateAndUpdateTitle(
  sessionId: string,
  userId: string,
  userMessage: string
): Promise<void> {
  try {
    // Generate AI title
    const aiResult = await generateSessionTitle(userMessage);

    if (aiResult.success) {
      // Update the session name with AI-generated title and set the flag
      await dbUpdateSessionTitle(
        sessionId,
        userId,
        aiResult.title,
        true // Set is_ai_generated to true
      );
    }
  } catch (error) {
    console.error("Background AI title generation error:", error);
  }
}

/**
 * Update session title (user-initiated edit)
 *
 * @param sessionId - ADK session ID
 * @param newTitle - New title for the session
 * @returns Promise resolving to success/error result
 */
export async function updateSessionTitle(
  sessionId: string,
  newTitle: string
): Promise<SessionNameResult> {
  try {
    // Authenticate user
    const userId = await requireUserId();

    // Validate title
    if (!newTitle?.trim()) {
      return {
        success: false,
        error: "Title cannot be empty",
      };
    }

    // Update session title (don't override is_ai_generated flag for manual edits)
    const result = await dbUpdateSessionTitle(sessionId, userId, newTitle);

    return result;
  } catch (error) {
    console.error("Failed to update session title:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return {
      success: false,
      error: `Failed to update session title: ${errorMessage}`,
    };
  }
}

/**
 * Get session name for display
 *
 * @param sessionId - ADK session ID
 * @returns Promise resolving to session name or null
 */
export async function getSessionNameForUser(
  sessionId: string
): Promise<string | null> {
  try {
    // Authenticate user
    const userId = await requireUserId();

    // Get session name
    const sessionName = await getSessionName(sessionId, userId);

    return sessionName?.title || null;
  } catch (error) {
    console.error("Failed to get session name:", error);
    return null;
  }
}

/**
 * Check if user should create a session name for this session
 * Used by chat components to trigger session name creation for first message
 *
 * @param sessionId - ADK session ID
 * @returns Promise resolving to boolean (true if should create)
 */
export async function shouldCreateSessionName(
  sessionId: string
): Promise<boolean> {
  try {
    // Authenticate user
    const userId = await requireUserId();

    // Check if session name already exists
    const exists = await checkSessionNameExists(sessionId, userId);

    // Should create if it doesn't exist
    return !exists;
  } catch (error) {
    console.error("Failed to check if should create session name:", error);
    return false;
  }
}
