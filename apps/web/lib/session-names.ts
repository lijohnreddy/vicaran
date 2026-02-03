import { db } from "@/lib/drizzle/db";
import { sessionNames, users } from "@/lib/drizzle/schema";
import { eq, and } from "drizzle-orm";
import type {
  SessionName,
  CreateSessionNameData,
} from "@/lib/drizzle/schema/session-names";

/**
 * Result type for session name operations
 */
export type SessionNameResult<T = SessionName> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Get session name for a specific session and user
 *
 * @param sessionId - ADK session ID
 * @param userId - User ID
 * @returns Promise resolving to session name or null if not found
 */
export async function getSessionName(
  sessionId: string,
  userId: string
): Promise<SessionName | null> {
  try {
    const result = await db
      .select()
      .from(sessionNames)
      .where(
        and(
          eq(sessionNames.session_id, sessionId),
          eq(sessionNames.user_id, userId)
        )
      )
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error("Failed to get session name:", error);
    return null;
  }
}

/**
 * Check if a session name exists for a session and user
 *
 * @param sessionId - ADK session ID
 * @param userId - User ID
 * @returns Promise resolving to boolean
 */
export async function checkSessionNameExists(
  sessionId: string,
  userId: string
): Promise<boolean> {
  try {
    const result = await db
      .select({ id: sessionNames.id })
      .from(sessionNames)
      .where(
        and(
          eq(sessionNames.session_id, sessionId),
          eq(sessionNames.user_id, userId)
        )
      )
      .limit(1);

    return result.length > 0;
  } catch (error) {
    console.error("Failed to check session name existence:", error);
    return false;
  }
}

/**
 * Create a new session name
 *
 * @param userId - User ID
 * @param sessionData - Session name data
 * @returns Promise resolving to success/error result with created session name
 */
export async function createSessionName(
  userId: string,
  sessionData: CreateSessionNameData
): Promise<SessionNameResult> {
  try {
    // Validate user exists
    const userExists = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userExists.length === 0) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Check if session name already exists
    const existingName = await checkSessionNameExists(
      sessionData.session_id,
      userId
    );
    if (existingName) {
      return {
        success: false,
        error: "Session name already exists",
      };
    }

    // Create the session name
    const result = await db
      .insert(sessionNames)
      .values({
        user_id: userId,
        session_id: sessionData.session_id,
        title: sessionData.title,
        is_ai_generated: sessionData.is_ai_generated || false,
      })
      .returning();

    if (result.length === 0) {
      return {
        success: false,
        error: "Failed to create session name",
      };
    }

    return {
      success: true,
      data: result[0],
    };
  } catch (error) {
    console.error("Failed to create session name:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // Handle unique constraint violations
    if (errorMessage.includes("unique") || errorMessage.includes("duplicate")) {
      return {
        success: false,
        error: "Session name already exists",
      };
    }

    return {
      success: false,
      error: `Database error: ${errorMessage}`,
    };
  }
}

/**
 * Update session name title
 *
 * @param sessionId - ADK session ID
 * @param userId - User ID
 * @param newTitle - New title for the session
 * @param isAiGenerated - Optional flag to indicate if title was AI-generated
 * @returns Promise resolving to success/error result with updated session name
 */
export async function updateSessionTitle(
  sessionId: string,
  userId: string,
  newTitle: string,
  isAiGenerated?: boolean
): Promise<SessionNameResult> {
  try {
    if (!newTitle?.trim()) {
      return {
        success: false,
        error: "Title cannot be empty",
      };
    }

    // Truncate title if too long
    const trimmedTitle = newTitle.trim().slice(0, 100);

    // Prepare update data
    const updateData: {
      title: string;
      updated_at: Date;
      is_ai_generated?: boolean;
    } = {
      title: trimmedTitle,
      updated_at: new Date(),
    };

    // Only update is_ai_generated flag if explicitly provided
    if (isAiGenerated !== undefined) {
      updateData.is_ai_generated = isAiGenerated;
    }

    const result = await db
      .update(sessionNames)
      .set(updateData)
      .where(
        and(
          eq(sessionNames.session_id, sessionId),
          eq(sessionNames.user_id, userId)
        )
      )
      .returning();

    if (result.length === 0) {
      return {
        success: false,
        error: "Session name not found",
      };
    }

    return {
      success: true,
      data: result[0],
    };
  } catch (error) {
    console.error("Failed to update session title:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return {
      success: false,
      error: `Database error: ${errorMessage}`,
    };
  }
}

/**
 * Get all session names for a user
 * Used for history display with session titles
 *
 * @param userId - User ID
 * @returns Promise resolving to array of session names
 */
export async function getUserSessionNames(
  userId: string
): Promise<SessionName[]> {
  try {
    const result = await db
      .select()
      .from(sessionNames)
      .where(eq(sessionNames.user_id, userId))
      .orderBy(sessionNames.updated_at);

    return result;
  } catch (error) {
    console.error("Failed to get user session names:", error);
    return [];
  }
}

/**
 * Delete a session name
 *
 * @param sessionId - ADK session ID
 * @param userId - User ID
 * @returns Promise resolving to success/error result
 */
export async function deleteSessionName(
  sessionId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await db
      .delete(sessionNames)
      .where(
        and(
          eq(sessionNames.session_id, sessionId),
          eq(sessionNames.user_id, userId)
        )
      )
      .returning({ id: sessionNames.id });

    if (result.length === 0) {
      return {
        success: false,
        error: "Session name not found",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to delete session name:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return {
      success: false,
      error: `Database error: ${errorMessage}`,
    };
  }
}
