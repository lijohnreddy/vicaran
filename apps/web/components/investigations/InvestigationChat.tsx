"use client";

import React, { Suspense } from "react";
import type { Investigation } from "@/lib/drizzle/schema/investigations";
import type { AdkSession, AdkEvent } from "@/lib/adk/session-service";
import { ChatStateProviderWithBoundary } from "@/contexts/ChatStateContext";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInputWithSources } from "@/components/chat/ChatInputWithSources";

interface InvestigationChatProps {
    investigation: Investigation;
    session: (AdkSession & { events: AdkEvent[] }) | null;
}

/**
 * Investigation-specific chat wrapper
 * Displays title at top, messages in the middle, and input at bottom
 */
export function InvestigationChat({
    investigation,
    session,
}: InvestigationChatProps): React.JSX.Element {
    return (
        <ChatStateProviderWithBoundary session={session} investigationId={investigation.id}>
            <Suspense fallback={<ChatLoadingFallback />}>
                <div className="flex h-full flex-col">
                    {/* Chat Header - Investigation Title */}
                    <div className="border-b border-border px-4 py-3">
                        <h2 className="text-sm font-medium text-muted-foreground">Investigation</h2>
                        <p className="font-semibold truncate">{investigation.title}</p>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto px-4 py-4">
                        <MessageList />
                    </div>

                    {/* Input Area - contained within chat column */}
                    <div className="border-t border-border p-4">
                        <ChatInputWithSources />
                    </div>
                </div>
            </Suspense>
        </ChatStateProviderWithBoundary>
    );
}

/**
 * Loading fallback for chat
 */
function ChatLoadingFallback(): React.JSX.Element {
    return (
        <div className="flex h-full flex-col p-4">
            <div className="animate-pulse space-y-4">
                <div className="h-12 bg-muted rounded-lg" />
                <div className="h-8 bg-secondary rounded-lg w-3/4" />
                <div className="h-16 bg-muted rounded-lg" />
            </div>
        </div>
    );
}
