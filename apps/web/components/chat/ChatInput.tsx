"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { useChatState } from "@/contexts/ChatStateContext";

export function ChatInput() {
  // Get all state from main context hook
  const {
    isLoading,
    isWaitingForAgent,
    input,
    setInput,
    handleSubmit,
    handleKeyDown,
  } = useChatState();

  // Generate dynamic placeholder text based on state
  const getPlaceholder = (): string => {
    if (isLoading) return "Loading...";
    return "Type your message here...";
  };

  // Generate helper text
  const getHelperText = (): string => {
    return "Press Enter to send, Shift+Enter for new line";
  };

  const isSubmitDisabled = !input.trim() || isLoading || isWaitingForAgent;

  return (
    <Card className="p-3 sm:p-4 mb-3 sm:mb-2">
      <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
        {/* Input Row */}
        <div className="flex space-x-2 items-end">
          {/* Text Input */}
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholder()}
            className="flex-1 min-h-[50px] sm:min-h-[60px] resize-none text-sm sm:text-base"
            disabled={isLoading || isWaitingForAgent}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            size="icon"
            className="h-[50px] w-[50px] sm:h-[60px] sm:w-[60px]"
            disabled={isSubmitDisabled}
            title="Send message"
          >
            {isLoading || isWaitingForAgent ? (
              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
            ) : (
              <Send className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </Button>
        </div>

        {/* Helper Text */}
        <div className="text-xs text-muted-foreground leading-snug">
          {getHelperText()}
        </div>
      </form>
    </Card>
  );
}
