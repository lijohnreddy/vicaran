"use client";

import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { AdkSession, AdkEvent } from "@/lib/adk/session-service";
import { Message } from "@/lib/chat/types";
import { useUser } from "@/contexts/UserContext";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useChatUrlHandler } from "@/hooks/useChatUrlHandler";
import { useChatPolling } from "@/hooks/useChatPolling";
import { useChatMessageFlow } from "@/hooks/useChatMessageFlow";
import { ChatErrorBoundary } from "@/components/chat/ChatErrorBoundary";

export interface ChatStateContextType {
  // Message management
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;

  // Session management
  session: (AdkSession & { events: AdkEvent[] }) | null;

  // Loading and UI state
  isLoading: boolean;
  isWaitingForAgent: boolean;

  // Message operations
  sendMessage: (message: string) => Promise<void>;
  handlePromptSelect: (prompt: string) => void;

  // Input state
  input: string;
  setInput: (input: string) => void;

  // Form handling
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleKeyDown: (e: React.KeyboardEvent) => void;

  // Polling state
  isPolling: boolean;
}

const ChatStateContext = createContext<ChatStateContextType | undefined>(
  undefined
);

interface ChatStateProviderProps {
  session: (AdkSession & { events: AdkEvent[] }) | null;
  investigationId?: string | null;
  children: ReactNode;
}

export function ChatStateProvider({
  session,
  investigationId,
  children,
}: ChatStateProviderProps) {
  const user = useUser();

  // Orchestrate focused hooks for clean separation of concerns
  const messages = useChatMessages({ session });
  const polling = useChatPolling({
    session,
    userId: user.id,
    setMessages: messages.setMessages,
  });
  // Single consolidated hook for message flow (replaces submission + form)
  const messageFlow = useChatMessageFlow({
    session,
    investigationId,
    addMessage: messages.addMessage,
    startPolling: polling.startPolling,
    isWaitingForAgent: messages.isWaitingForAgent,
  });

  // Handle URL error parameters
  useChatUrlHandler({ session });

  // Start polling when session exists
  useEffect(() => {
    if (session?.id) {
      console.log("🔄 [CHAT_STATE] Starting polling for session:", session.id);

      // Add small delay for Agent Engine to allow session to be fully processed
      // Agent Engine has eventual consistency, so session might not be immediately available
      const timeoutId = setTimeout(() => {
        console.log("⏰ [CHAT_STATE] Starting polling after delay");
        polling.startPolling();
      }, 1000);

      // Cleanup timeout if session changes
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [session?.id, polling]);

  // Cleanup: stop polling when component unmounts
  useEffect(() => {
    return () => {
      polling.stopPolling();
    };
  }, [polling]);

  // Compose context value from orchestrated hooks
  const contextValue: ChatStateContextType = {
    // Message management
    messages: messages.messages,
    setMessages: messages.setMessages,

    // Session management
    session,

    // Loading and UI state
    isLoading: messageFlow.isLoading,
    isWaitingForAgent: messages.isWaitingForAgent,

    // Message operations
    sendMessage: messageFlow.sendMessage,
    handlePromptSelect: messageFlow.handlePromptSelect,

    // Input state
    input: messageFlow.input,
    setInput: messageFlow.setInput,

    // Form handling
    handleSubmit: messageFlow.handleSubmit,
    handleKeyDown: messageFlow.handleKeyDown,

    // Polling state
    isPolling: polling.isPolling,
  };

  return (
    <ChatStateContext.Provider value={contextValue}>
      {children}
    </ChatStateContext.Provider>
  );
}

export function useChatState(): ChatStateContextType {
  const context = useContext(ChatStateContext);
  if (context === undefined) {
    throw new Error(
      "useChatState must be used within a ChatStateProvider. " +
      "Wrap your component tree with <ChatStateProvider> to provide chat state context."
    );
  }
  return context;
}

export function ChatStateProviderWithBoundary({
  session,
  investigationId,
  children,
}: ChatStateProviderProps) {
  return (
    <ChatErrorBoundary>
      <ChatStateProvider session={session} investigationId={investigationId}>
        {children}
      </ChatStateProvider>
    </ChatErrorBoundary>
  );
}
