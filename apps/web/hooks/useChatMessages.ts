"use client";

import { useState, useMemo, useCallback } from "react";
import { AdkSession, AdkEvent } from "@/lib/adk/session-service";
import { convertAdkEventsToMessages } from "@/lib/utils/message-converter";
import { Message } from "@/lib/chat/types";

interface UseChatMessagesConfig {
  session: (AdkSession & { events: AdkEvent[] }) | null;
}

interface UseChatMessagesReturn {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isWaitingForAgent: boolean;
  addMessage: (message: Message) => void;
  updateMessage: (message: Message) => void;
  clearMessages: () => void;
}

/**
 * Enhanced message state management with ADK event conversion and smart agent waiting detection
 * Converts ADK session events to messages and provides clean functional updates
 */
export function useChatMessages({
  session,
}: UseChatMessagesConfig): UseChatMessagesReturn {
  // Convert ADK events to messages for initial state
  const initialMessages = useMemo(() => {
    if (!session) {
      console.log(
        "🔄 [CHAT_MESSAGES] No session provided, starting with empty messages"
      );
      return [];
    }

    console.log(
      "🔄 [CHAT_MESSAGES] Converting events to initial messages:",
      session.events
    );
    const { messages } = convertAdkEventsToMessages(
      session.events,
      session.sources
    );
    console.log("✅ [CHAT_MESSAGES] Initial conversion complete:", {
      messagesCount: messages.length,
      messages: messages.map((m) => ({
        id: m.id,
        type: m.type,
        contentLength: m.content.length,
      })),
    });
    return messages;
  }, [session]);

  // State for managing messages
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  // Smart UI state for long-term agent waiting
  const isWaitingForAgent = useMemo(() => {
    if (messages.length === 0) return false;
    return messages[messages.length - 1].type === "user";
  }, [messages]);

  // Add a new message (functional update pattern)
  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  // Update existing message by ID (functional update pattern)
  const updateMessage = useCallback((message: Message) => {
    setMessages((prev) => {
      const existingIndex = prev.findIndex((msg) => msg.id === message.id);
      if (existingIndex >= 0) {
        // Replace existing message
        return prev.map((msg) => (msg.id === message.id ? message : msg));
      } else {
        // Add new message if not found
        return [...prev, message];
      }
    });
  }, []);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    setMessages,
    isWaitingForAgent,
    addMessage,
    updateMessage,
    clearMessages,
  };
}
