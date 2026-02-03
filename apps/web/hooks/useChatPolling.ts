"use client";

import { useCallback, useRef } from "react";
import { getSessionEvents } from "@/app/actions/sessions";
import { convertAdkEventsToMessages } from "@/lib/utils/message-converter";
import { AdkSession, AdkEvent } from "@/lib/adk/session-service";
import { Message } from "@/lib/chat/types";

interface UseChatPollingConfig {
  session: (AdkSession & { events: AdkEvent[] }) | null;
  userId: string;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

interface UseChatPollingReturn {
  isPolling: boolean;
  startPolling: () => void;
  stopPolling: () => void;
  pollForUpdates: () => Promise<void>;
}

/**
 * Background polling system for session updates and real-time message synchronization
 * Coordinates between local pending messages and server-confirmed messages for smooth UX
 */
export function useChatPolling({
  session,
  userId,
  setMessages,
}: UseChatPollingConfig): UseChatPollingReturn {
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Stop polling and clear interval
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Polling function to fetch session updates
  const pollForUpdates = useCallback(async (): Promise<void> => {
    if (!session?.id) return; // Can't poll without a session

    try {
      const result = await getSessionEvents(userId, session.id);

      if (!result.success) {
        // Handle "Session not found" gracefully - this can happen with Agent Engine
        // due to eventual consistency (session created but not immediately available)
        if (result.error === "Session not found") {
          return; // Don't throw error, just skip this poll cycle
        }

        // For other errors, still throw
        throw new Error(result.error || "Failed to get session events");
      }

      const updatedSession = result.data;
      if (updatedSession && updatedSession.events) {
        // Convert updated events to messages
        const { messages: serverMessages } = convertAdkEventsToMessages(
          updatedSession.events,
          updatedSession.sources
        );

        // Smart merge: Keep pending local messages that haven't appeared on server yet
        setMessages((currentMessages) => {
          // Find locally-added messages that aren't confirmed by server yet
          const pendingMessages = currentMessages.filter(
            (msg) =>
              msg.pending &&
              !serverMessages.some(
                (serverMsg) =>
                  serverMsg.content === msg.content &&
                  serverMsg.type === msg.type
              )
          );

          // Merge: server messages + any still-pending local messages
          return [...serverMessages, ...pendingMessages];
        });
      }
    } catch (error) {
      console.error("❌ [POLLING] Polling error (silently retrying):", error);
      // Silent retry - continue polling
    }
  }, [userId, session?.id, setMessages]);

  // Start polling every 2 seconds
  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      return; // Already polling
    }

    console.log(
      "▶️ [POLLING] Starting background polling for session:",
      session?.id
    );
    pollingIntervalRef.current = setInterval(pollForUpdates, 3000);

    // Run first poll immediately
    pollForUpdates();
  }, [pollForUpdates, session?.id]);

  const isPolling = !!pollingIntervalRef.current;

  return {
    isPolling,
    startPolling,
    stopPolling,
    pollForUpdates,
  };
}
