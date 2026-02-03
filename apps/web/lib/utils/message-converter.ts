import { AdkEvent } from "@/lib/adk/session-service";
import { Message } from "@/lib/chat/types";
import type { SourceMetadata } from "@/lib/chat/types";

/**
 * Interface for ADK event content parts structure
 */
interface AdkEventPart {
  video_metadata?: unknown;
  thought?: unknown;
  inline_data?: unknown;
  file_data?: unknown;
  thought_signature?: unknown;
  code_execution_result?: unknown;
  executable_code?: unknown;
  function_call?: unknown;
  function_response?: unknown;
  text?: string;
}

/**
 * Correlates sources with a specific message based on agent and content
 */
function correlateSourcesWithMessage(
  event: AdkEvent,
  sessionSources?: Record<string, SourceMetadata>
): SourceMetadata[] {
  if (!sessionSources || Object.keys(sessionSources).length === 0) {
    return [];
  }

  // report_composer messages get all sources
  if (event.author === "report_composer") {
    return Object.values(sessionSources);
  }

  // Research agents that collect sources should show them
  const isResearchAgent = [
    "section_researcher",
    "enhanced_search_executor",
  ].includes(event.author || "");

  if (isResearchAgent) {
    // For now, show all available sources since we don't track which agent collected which
    // TODO: Future enhancement could track source collection per agent
    return Object.values(sessionSources);
  }

  // Other agents don't show sources (research_evaluator, section_planner, etc.)
  return [];
}

/**
 * Extracts text content from an ADK event
 * Handles complex nested parts structure with multiple potential fields
 */
function extractTextFromAdkEvent(event: AdkEvent): string {
  // Handle case where content is a JSON string
  if (typeof event.content === "string") {
    try {
      const parsed = JSON.parse(event.content);
      if (parsed.parts && Array.isArray(parsed.parts)) {
        const texts = parsed.parts
          .map((part: AdkEventPart) => {
            // Handle complex part structure with many fields
            if (part && typeof part === "object") {
              return part.text || "";
            }
            return "";
          })
          .filter((text: string) => text && text.trim().length > 0);

        return texts.join(" ");
      }
    } catch (error) {
      console.warn(
        `⚠️ [EXTRACT_TEXT] JSON parsing failed for event ${event.id}:`,
        error
      );
      // If JSON parsing fails, return the string as-is
      return event.content;
    }
  }

  // Handle case where content is already an object with parts
  if (event.content?.parts && Array.isArray(event.content.parts)) {
    const texts = event.content.parts
      .map((part: AdkEventPart) => {
        // Handle complex part structure with many fields
        if (part && typeof part === "object") {
          return part.text || "";
        }
        return "";
      })
      .filter((text: string) => text && text.trim().length > 0);

    return texts.join(" ");
  }

  // Fallback to empty string if no text content
  return "";
}

/**
 * Converts ADK events to Message format for the chat interface
 * Filters out events without meaningful text content
 * Correlates sources from session state with relevant messages
 */
export function convertAdkEventsToMessages(
  events: AdkEvent[],
  sessionSources?: Record<string, SourceMetadata>
): { messages: Message[] } {
  const messages = events
    .map((event) => {
      const content = extractTextFromAdkEvent(event);

      // Skip events without meaningful text content
      if (!content.trim()) {
        return null;
      }

      // Parse content to check for role field, but don't filter based on it
      let parsedContent: { role?: string } | null = null;
      if (typeof event.content === "string") {
        try {
          parsedContent = JSON.parse(event.content);
        } catch (error) {
          // Don't return null - continue processing even if JSON parsing fails
          console.warn(
            `⚠️ [CONVERTER] Failed to parse JSON content for event ${event.id}, continuing:`,
            error
          );
        }
      } else if (event.content && typeof event.content === "object") {
        parsedContent = event.content;
      }

      // Determine message type based on content.role if available, otherwise use author
      let messageType: "user" | "model";
      if (parsedContent?.role) {
        messageType = parsedContent.role as "user" | "model";
      } else {
        // For sub-agent events without content.role, treat as model messages
        messageType = event.author === "user" ? "user" : "model";
      }

      // Extract agent name from author field for attribution
      const agent =
        event.author && typeof event.author === "string"
          ? event.author
          : "Agent";

      // Correlate sources with this message
      const messageSources = correlateSourcesWithMessage(event, sessionSources);

      const message: Message = {
        id: event.id,
        type: messageType,
        content: content.trim(),
        timestamp: new Date(event.timestamp),
        agent: agent, // Always include agent field for attribution
        // Add source information
        sources: messageSources.length > 0 ? messageSources : undefined,
      };

      return message;
    })
    .filter((message): message is Message => message !== null) // Remove null entries
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()); // Sort chronologically

  return { messages };
}
