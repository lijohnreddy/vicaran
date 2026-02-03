/**
 * Message State Management Hook
 *
 * Clean separation of message state management from streaming coordination,
 * following ADK tutorial architecture patterns with optimized functional updates.
 */

"use client";

import { useCallback, useState } from "react";
import { Message } from "@/lib/chat/types";

interface UseMessagesConfig {
  initialMessages?: Message[];
}

interface UseMessagesReturn {
  messages: Message[];
  addMessage: (message: Message) => void;
  updateMessage: (message: Message) => void;
  setMessages: (
    messagesOrUpdater: Message[] | ((prev: Message[]) => Message[])
  ) => void;
  clearMessages: () => void;
}

/**
 * Dedicated hook for message state management with clean functional updates
 * Matches ADK tutorial patterns for optimal React batching performance
 */
export function useMessages(config: UseMessagesConfig = {}): UseMessagesReturn {
  const { initialMessages = [] } = config;

  const [messages, setMessagesState] = useState<Message[]>(initialMessages);

  // Clean functional state setter matching ADK tutorial pattern
  const setMessages = useCallback(
    (messagesOrUpdater: Message[] | ((prev: Message[]) => Message[])) => {
      setMessagesState(messagesOrUpdater);
    },
    []
  );

  // Add a new message (functional update pattern)
  const addMessage = useCallback(
    (message: Message) => {
      setMessages((prev) => [...prev, message]);
    },
    [setMessages]
  );

  // Update existing message by ID (functional update pattern)
  const updateMessage = useCallback(
    (message: Message) => {
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
    },
    [setMessages]
  );

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  return {
    messages,
    addMessage,
    updateMessage,
    setMessages,
    clearMessages,
  };
}
