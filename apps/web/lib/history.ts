import {
  AdkSessionService,
  type AdkSession,
  type AdkEvent,
} from "@/lib/adk/session-service";
import { getUserSessionNames, createSessionName } from "@/lib/session-names";
import { generateSessionTitle as generateAITitle } from "@/lib/ai/title-generation";
import { requireUserId } from "@/lib/auth";

export type SessionWithDetails = {
  id: string;
  title: string | null;
  created_at: Date;
  updated_at: Date;
  message_count: number;
};

export type GroupedSessions = {
  today: SessionWithDetails[];
  yesterday: SessionWithDetails[];
  thisWeek: SessionWithDetails[];
  older: SessionWithDetails[];
};

/**
 * Generate a timestamp-based title for sessions without names
 */
function generateTimestampBasedTitle(session: AdkSession): string {
  const date = new Date(session.last_update_time || Date.now());
  const timeStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  return `Session from ${timeStr}`;
}

/**
 * Find the first user message from a list of ADK events
 */
function findFirstUserMessage(events: AdkEvent[]): string | null {
  if (!events || events.length === 0) return null;

  // Sort events by timestamp to ensure chronological order
  const sortedEvents = events.sort((a, b) => a.timestamp - b.timestamp);

  // Find the first event with user content
  for (const event of sortedEvents) {
    if (event.content && event.content.role === "user" && event.content.parts) {
      // Check all parts for text content
      for (const part of event.content.parts) {
        if (part.text && typeof part.text === "string" && part.text.trim()) {
          return part.text.trim();
        }
      }
    }
  }

  return null;
}

/**
 * Create a session name for an old session that doesn't have one
 */
async function createSessionNameForOldSession(
  session: AdkSession,
  userId: string
): Promise<string> {
  try {
    // Try to get first user message for AI naming
    const sessionWithEvents = await AdkSessionService.getSessionWithEvents(
      userId,
      session.id
    );
    const events = sessionWithEvents?.events || [];
    const firstUserMessage = findFirstUserMessage(events);

    if (firstUserMessage) {
      // Generate AI name
      const result = await generateAITitle(firstUserMessage);
      if (result.success && result.title) {
        // Save to database
        const createResult = await createSessionName(userId, {
          session_id: session.id,
          title: result.title,
          is_ai_generated: true,
        });

        if (createResult.success) {
          return result.title;
        }
      }
    }

    // Fallback to timestamp-based name
    const fallbackName = generateTimestampBasedTitle(session);

    // Try to save the fallback name too
    try {
      await createSessionName(userId, {
        session_id: session.id,
        title: fallbackName,
        is_ai_generated: false,
      });
    } catch (error) {
      // If saving fails, still return the name (better UX than UUID)
      console.warn("Failed to save fallback session name:", error);
    }

    return fallbackName;
  } catch (error) {
    console.warn("Failed to create session name for old session:", error);
    // Final fallback - at least better than UUID
    return generateTimestampBasedTitle(session);
  }
}

/**
 * Transform ADK session to SessionWithDetails with session name upsert
 */
async function transformSession(
  session: AdkSession,
  sessionNamesMap: Map<string, string>,
  userId: string
): Promise<SessionWithDetails> {
  // Handle both timestamp formats (Unix timestamp or ISO string)
  let updateTime: Date;
  if (session.last_update_time) {
    if (typeof session.last_update_time === "number") {
      // If it's a number, check if it's in seconds (Unix timestamp) or milliseconds
      // Unix timestamps are typically 10 digits, milliseconds are 13 digits
      const timestamp = session.last_update_time;
      updateTime = new Date(
        timestamp < 10000000000 ? timestamp * 1000 : timestamp
      );
    } else {
      // If it's a string (ISO format), parse it directly
      updateTime = new Date(session.last_update_time);
    }
  } else {
    updateTime = new Date();
  }

  // Get session name from map, fallback to upsert logic
  let sessionName = sessionNamesMap.get(session.id);

  // If no name exists, create one automatically (upsert approach)
  if (!sessionName) {
    sessionName = await createSessionNameForOldSession(session, userId);
    // Update the map so other sessions in this batch can use it
    sessionNamesMap.set(session.id, sessionName);
  }

  const title = sessionName;

  return {
    id: session.id,
    title,
    created_at: updateTime,
    updated_at: updateTime,
    message_count: 0, // Events are not included in list response, would need separate call
  };
}

export async function getSessionsGrouped(
  offset: number = 0,
  limit: number = 50
): Promise<{
  sessions: GroupedSessions;
  hasMore: boolean;
}> {
  try {
    // Get authenticated user ID
    const userId = await requireUserId();

    const sessionsResponse = await AdkSessionService.listSessions(userId);

    if (!sessionsResponse || !Array.isArray(sessionsResponse.sessions)) {
      console.warn("Invalid sessions response:", sessionsResponse);
      return {
        sessions: { today: [], yesterday: [], thisWeek: [], older: [] },
        hasMore: false,
      };
    }

    const sessionNames = await getUserSessionNames(userId);
    const sessionNamesMap = new Map<string, string>();
    sessionNames.forEach((sessionName) => {
      sessionNamesMap.set(sessionName.session_id, sessionName.title);
    });

    const transformedSessions = await Promise.all(
      sessionsResponse.sessions.map((session) =>
        transformSession(session, sessionNamesMap, userId)
      )
    );

    transformedSessions.sort(
      (a, b) => b.updated_at.getTime() - a.updated_at.getTime()
    );

    const hasMore = transformedSessions.length > limit;
    const paginatedSessions = transformedSessions.slice(offset, offset + limit);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const thisWeekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const grouped: GroupedSessions = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: [],
    };

    paginatedSessions.forEach((session) => {
      const updatedDate = new Date(session.updated_at);

      if (updatedDate >= today) {
        grouped.today.push(session);
      } else if (updatedDate >= yesterday) {
        grouped.yesterday.push(session);
      } else if (updatedDate >= thisWeekStart) {
        grouped.thisWeek.push(session);
      } else {
        grouped.older.push(session);
      }
    });

    return {
      sessions: grouped,
      hasMore,
    };
  } catch (error) {
    console.error("Error fetching sessions:", error);
    throw new Error("Failed to fetch sessions");
  }
}

export const getConversationsGrouped = getSessionsGrouped;
