"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChatState } from "@/contexts/ChatStateContext";
import { useSidebar } from "@/components/ui/sidebar";

export function ChatContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session } = useChatState();
  const { isMobile, state: sidebarState } = useSidebar();

  // Handle URL error parameters
  useEffect(() => {
    const error = searchParams.get("error");

    if (error) {
      toast.error("AI Request Failed", {
        description: error,
        duration: 8000,
      });

      // Clean up URL parameters
      if (session?.id) {
        router.replace(`/chat/${session.id}`);
      }
    }
  }, [searchParams, router, session?.id]);

  return (
    <>
      {/* Messages Area - Scrollable with fixed bottom padding for input */}
      <div className="h-full w-full overflow-y-auto pb-40 sm:pb-48">
        <div className="w-full max-w-4xl mx-auto">
          <MessageList />
        </div>
      </div>

      {/* Fixed Input Area */}
      <div
        className={cn(
          "fixed bottom-0 right-0 z-40 transition-[left] duration-200 ease-linear",
          isMobile
            ? "left-0"
            : sidebarState === "collapsed"
              ? "left-16"
              : "left-64"
        )}
      >
        <div className={cn("w-full px-4 bg-white dark:bg-neutral-950", isMobile ? "pb-2" : "pb-4")}>
          <div className="max-w-4xl mx-auto">
            <ChatInput />
          </div>
        </div>
      </div>
    </>
  );
}
