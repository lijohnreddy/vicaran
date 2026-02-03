"use client";

import React, { Suspense } from "react";
import { AdkSession, AdkEvent } from "@/lib/adk/session-service";
import { ChatStateProviderWithBoundary } from "@/contexts/ChatStateContext";
import { ChatContainer } from "@/components/chat/ChatContainer";

interface ChatInterfaceProps {
  session: (AdkSession & { events: AdkEvent[] }) | null;
}

/**
 * ChatInterface component using Context Provider + Component Decomposition architecture.
 */
export function ChatInterface({ session }: ChatInterfaceProps) {
  return (
    <ChatStateProviderWithBoundary session={session}>
      <ChatInterfaceInner />
    </ChatStateProviderWithBoundary>
  );
}

/**
 * Inner component that consumes the ChatStateContext.
 * Separated to ensure context is available before consuming it.
 * Wraps ChatContainer in Suspense since it uses useSearchParams().
 */
function ChatInterfaceInner() {
  return (
    <Suspense fallback={<ChatLoadingFallback />}>
      <ChatContainer />
    </Suspense>
  );
}

/**
 * Loading fallback for chat interface while search params are being resolved
 */
function ChatLoadingFallback() {
  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
      {/* Messages Area Skeleton */}
      <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 mb-3 sm:mb-4 py-2 sm:py-4">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-secondary rounded-lg"></div>
          <div className="h-8 bg-muted rounded-lg w-3/4"></div>
          <div className="h-16 bg-secondary rounded-lg"></div>
        </div>
      </div>

      {/* Input Area Skeleton */}
      <div className="p-3 sm:p-4 mb-3 sm:mb-4 lg:mb-6 border rounded-lg">
        <div className="flex space-x-2 items-end">
          <div className="flex-1 h-12 bg-muted rounded-md animate-pulse"></div>
          <div className="w-12 h-12 bg-muted rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
