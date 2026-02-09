"use server";

import { AdkSessionService } from "@/lib/adk/session-service";
import { requireUserId } from "@/lib/auth";
import { devLog } from "@/lib/utils/logger";

/**
 * Server Action Result types for session creation with message
 */
export type CreateSessionWithMessageResult =
  | {
    success: true;
    sessionId: string;
    isNewSession: boolean;
  }
  | {
    success: false;
    error: string;
  };

/**
 * Server Action to create a new ADK session and save the first user message
 * This replaces session creation in the API route for better Next.js architecture
 *
 * @param sessionId - Existing session ID (null for new session)
 * @param userMessage - The user's first message to send
 * @returns Promise<CreateSessionWithMessageResult> - Result with session ID or error
 */
export async function createSessionWithMessage(
  sessionId: string | null,
  userMessage: string,
  investigationId?: string | null
): Promise<CreateSessionWithMessageResult> {
  try {
    devLog("🚀 [ADK_ACTION] createSessionWithMessage called:", {
      hasSessionId: !!sessionId,
      messagePreview: userMessage.substring(0, 50),
    });

    // Get the current authenticated user
    const userId = await requireUserId();
    devLog("✅ [ADK_ACTION] User authenticated:", userId);

    // Validate input
    if (!userMessage.trim()) {
      return {
        success: false,
        error: "Message cannot be empty",
      };
    }

    let finalSessionId = sessionId;
    let isNewSession = false;

    // Create new session if none provided
    if (!finalSessionId) {
      devLog("🆕 [ADK_ACTION] Creating new ADK session...");

      try {
        const newSession = await AdkSessionService.createSession(userId);
        finalSessionId = newSession.id;
        isNewSession = true;

        devLog("✅ [ADK_ACTION] New session created:", finalSessionId);
      } catch (sessionError) {
        console.error("❌ [ADK_ACTION] Session creation failed:", sessionError);
        return {
          success: false,
          error: "Failed to create chat session",
        };
      }
    }

    // Trigger message processing in the background
    // Changed from fire-and-forget to blocking for debugging
    devLog(
      "🚀 [ADK_ACTION] About to call triggerMessageProcessing..."
    );
    try {
      await triggerMessageProcessing(finalSessionId, userMessage, userId, investigationId || null);
      devLog("✅ [ADK_ACTION] triggerMessageProcessing completed successfully");
    } catch (error) {
      console.error(
        "❌ [ADK_ACTION] triggerMessageProcessing FAILED:",
        error
      );
      // Propagate error instead of swallowing silently
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send message to agent",
      };
    }

    devLog("✅ [ADK_ACTION] Session with message created successfully:", {
      sessionId: finalSessionId,
      isNewSession,
    });

    return {
      success: true,
      sessionId: finalSessionId,
      isNewSession,
    };
  } catch (error) {
    console.error("❌ [ADK_ACTION] createSessionWithMessage failed:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create session with message",
    };
  }
}

/**
 * Clean unified message processing using abstracted handler
 *
 * This function now delegates to UnifiedRequestHandler which automatically
 * selects the appropriate backend handler (localhost or Agent Engine) based
 * on configuration and handles all endpoint-specific formatting.
 *
 * @param sessionId - The session ID to send message to
 * @param userMessage - The user message to process
 * @param userId - The authenticated user ID
 */
async function triggerMessageProcessing(
  sessionId: string,
  userMessage: string,
  userId: string,
  investigationId: string | null
): Promise<void> {
  devLog("📡 [ADK_ACTION] Triggering unified agent processing:", {
    sessionId,
    messagePreview: userMessage.substring(0, 50),
    userId,
  });

  const { UnifiedRequestHandler } = await import("@/lib/adk/request-handler");
  const requestHandler = new UnifiedRequestHandler();

  const result = await requestHandler.processAgentRequest(
    sessionId,
    userMessage,
    userId,
    investigationId
  );

  if (!result.success) {
    console.error("❌ [ADK_ACTION] Agent processing failed:", result.error);
    throw new Error(result.error || "Failed to trigger message processing");
  }

  devLog("✅ [ADK_ACTION] Agent processing initiated successfully");
}
