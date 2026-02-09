"use client";

import React, { useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Loader2, Bot, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { WelcomeCard } from "@/components/chat/WelcomeCard";
import { AgentMessageRenderer } from "@/components/chat/AgentMessageRenderer";
import { CopyButton } from "@/components/chat/CopyButton";
import { Badge } from "@/components/ui/badge";
import { Message } from "@/lib/chat/types";
import { getAgentTitle } from "@/lib/chat/agent-utils";
import { useChatState } from "@/contexts/ChatStateContext";

interface MessageListProps {
  className?: string;
}

export function MessageList({ className }: MessageListProps) {
  // Get all state from context
  const { messages, isLoading, isWaitingForAgent, handlePromptSelect } =
    useChatState();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previousMessageCountRef = useRef<number>(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Only scroll when:
    // 1. New messages have been added (count increased), OR
    // 2. Loading state changes to true (new message being sent)
    const currentMessageCount = messages.length;
    const shouldScroll =
      currentMessageCount > previousMessageCountRef.current || isLoading;

    if (shouldScroll) {
      scrollToBottom();
    }

    // Update the previous count for next comparison
    previousMessageCountRef.current = currentMessageCount;
  }, [messages, isLoading]);

  return (
    <div
      className={cn(
        "w-full min-h-full p-4 space-y-6 sm:space-y-4 flex flex-col justify-end",
        className
      )}
    >
      {messages.length === 0 && !isLoading ? (
        <div className="flex items-center justify-center flex-1">
          <WelcomeCard onPromptSelect={handlePromptSelect} />
        </div>
      ) : (
        <>
          {/* Spacer to push messages to bottom when there are few messages */}
          <div className="flex-1 min-h-0" />

          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {/* Loading Indicator */}
          {(isLoading || isWaitingForAgent) && <LoadingIndicator />}

          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}

/**
 * Individual message bubble component with all formatting and styling
 */
function MessageBubble({ message }: { message: Message }) {

  return (
    <Card
      suppressHydrationWarning
      className={cn(
        "p-3 sm:p-4 group",
        message.type === "user"
          ? "bg-secondary text-secondary-foreground mr-2 sm:mr-4 md:mr-6 lg:mr-8 ml-auto w-fit max-w-[80%]"
          : "bg-primary text-chat-assistant-fg mr-2 sm:mr-4 md:mr-6 lg:mr-8",
        message.pending && "opacity-70" // Visual indicator for pending messages
      )}
    >
      {/* Agent Header with Source Count */}
      {message.type === "model" && <AgentHeader message={message} />}

      {/* Message Content */}
      {message.content && (
        <div className="max-h-[600px] overflow-y-auto">
          <AgentMessageRenderer
            content={message.content}
            agent={message.agent}
            isUser={message.type === "user"}
          />
        </div>
      )}


      {/* Message Footer with Timestamp and Copy Button */}
      <MessageFooter message={message} />
    </Card>
  );
}

/**
 * Agent header with name and source count badge
 */
function AgentHeader({ message }: { message: Message }) {
  return (
    <div className="mb-3 sm:mb-4" suppressHydrationWarning>
      <div className="flex items-center gap-2 flex-wrap" suppressHydrationWarning>
        <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-chat-assistant-fg" />
        <h4 className="text-sm sm:text-base font-semibold text-chat-assistant-fg">
          {message.agent ? getAgentTitle(message.agent) : "Agent Activity"}
        </h4>

        {/* Source Count Badge */}
        {message.sources && message.sources.length > 0 && (
          <Badge variant="secondary">
            <LinkIcon className="w-3 h-3 mr-1" />
            {message.sources.length} source
            {message.sources.length !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>
    </div>
  );
}

/**
 * Message footer with timestamp and copy functionality
 */
function MessageFooter({ message }: { message: Message }) {
  // Use client-only timestamp to avoid hydration mismatch
  const [formattedTime, setFormattedTime] = React.useState<string>("");

  React.useEffect(() => {
    // Only format timestamp on client to avoid server/client mismatch
    setFormattedTime(
      message.timestamp.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, [message.timestamp]);

  return (
    <div
      className={cn(
        "text-xs mt-2 opacity-70 flex items-center justify-between",
        message.type === "model"
          ? "text-chat-assistant-fg"
          : "text-secondary-foreground"
      )}
    >
      <span>{formattedTime}</span>
      {message.type === "model" && (
        <CopyButton
          text={message.content}
          size="sm"
          variant="ghost"
          className="h-4 w-4 p-0.5 text-chat-assistant-fg/40 hover:text-chat-assistant-fg/80"
          showToast={true}
        />
      )}
    </div>
  );
}

/**
 * Loading indicator for pending operations
 */
function LoadingIndicator() {
  return (
    <Card className="p-3 sm:p-4 bg-primary text-chat-assistant-fg mr-2 sm:mr-4 md:mr-6 lg:mr-8">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Agent generating response...</span>
      </div>
    </Card>
  );
}
