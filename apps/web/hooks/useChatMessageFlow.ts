"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdkSession } from "@/lib/adk/session-service";
import { createSessionWithMessage } from "@/app/actions/adk";
import { Message } from "@/lib/chat/types";

interface UseChatMessageFlowConfig {
  session: AdkSession | null;
  addMessage: (message: Message) => void;
  startPolling: () => void;
  isWaitingForAgent: boolean;
}

interface UseChatMessageFlowReturn {
  // Loading state
  isLoading: boolean;

  // Input management
  input: string;
  setInput: (input: string) => void;

  // Message operations
  sendMessage: (messageText: string) => Promise<void>;

  // Form handling
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handlePromptSelect: (prompt: string) => void;
}

/**
 * Consolidated message flow management combining form handling and server submission
 * Manages input state, validation, server actions, and error handling in one place
 */
export function useChatMessageFlow({
  session,
  addMessage,
  startPolling,
  isWaitingForAgent,
}: UseChatMessageFlowConfig): UseChatMessageFlowReturn {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");

  // Send message function using Server Action
  const sendMessage = useCallback(
    async (messageText: string): Promise<void> => {
      const userMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        content: messageText,
        timestamp: new Date(),
        pending: true, // Mark as pending server confirmation
      };

      // Add user message immediately
      addMessage(userMessage);
      setIsLoading(true);

      try {
        console.log("🚀 [MESSAGE_FLOW] Calling Server Action:", {
          messageText: messageText.substring(0, 50) + "...",
          sessionId: session?.id || null,
          hasSession: !!session,
        });

        // Use Server Action for session creation and message processing
        const result = await createSessionWithMessage(
          session?.id || null,
          messageText
        );

        if (!result.success) {
          console.error(
            "❌ [MESSAGE_FLOW] Server Action failed:",
            result.error
          );

          toast.error("Message Failed", {
            description: result.error,
            duration: 5000,
          });

          // Add error message to chat interface
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: "model",
            content: `❌ **Unable to process your request**\n\n${result.error}\n\n💡 **What you can try:**\n• Wait a moment and try sending your message again\n• If the problem persists, try refreshing the page`,
            timestamp: new Date(),
            agent: "system",
          };

          addMessage(errorMessage);
          throw new Error(result.error);
        }

        console.log("✅ [MESSAGE_FLOW] Server Action succeeded:", {
          sessionId: result.sessionId,
          isNewSession: result.isNewSession,
        });

        // If a new session was created, redirect to the session URL
        if (result.isNewSession && result.sessionId) {
          console.log(
            "🔄 [MESSAGE_FLOW] New session created, redirecting to:",
            result.sessionId
          );
          router.push(`/chat/${result.sessionId}`);
          return;
        }

        // Start polling immediately to get updates
        console.log(
          "🚀 [MESSAGE_FLOW] About to start polling after message sent"
        );
        startPolling();
      } catch (error) {
        console.error("❌ [MESSAGE_FLOW] Failed to send message:", error);

        const errorText =
          error instanceof Error ? error.message : "Failed to send message";

        // Show toast notification for system-level errors
        toast.error("Message Failed", {
          description: errorText,
          duration: 5000,
        });

        throw error; // Re-throw for handleSubmit error handling
      } finally {
        setIsLoading(false);
      }
    },
    [session, router, startPolling, addMessage]
  );

  // Handle prompt selection from welcome card
  const handlePromptSelect = useCallback((prompt: string): void => {
    setInput(prompt);
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();

      if (!input.trim() || isLoading || isWaitingForAgent) {
        return;
      }

      const messageText = input.trim();
      setInput("");

      try {
        await sendMessage(messageText);
      } catch (error) {
        console.error("Failed to send message:", error);
        // Restore input on error (only for system-level failures, not redirects)
        setInput(messageText);
      }
    },
    [input, isLoading, isWaitingForAgent, sendMessage]
  );

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent): void => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit]
  );

  return {
    isLoading,
    input,
    setInput,
    sendMessage,
    handleSubmit,
    handleKeyDown,
    handlePromptSelect,
  };
}
