"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ArrowRight, Loader2 } from "lucide-react";
import { useChatState } from "@/contexts/ChatStateContext";
import { AddSourcePopup } from "./AddSourcePopup";

/**
 * Enhanced chat input with [+] add source button and arrow send button
 */
export function ChatInputWithSources(): React.JSX.Element {
    const { input, setInput, isLoading, handleSubmit } = useChatState();
    const [isSourcePopupOpen, setIsSourcePopupOpen] = useState(false);

    const handleAddSource = (url: string) => {
        // Append source URL to the current input
        const sourceText = `\n\n📎 Source: ${url}`;
        setInput(input + sourceText);
        setIsSourcePopupOpen(false);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (input.trim() && !isLoading) {
                handleSubmit(e as unknown as React.FormEvent);
            }
        }
    };

    const onSendClick = (e: React.MouseEvent) => {
        handleSubmit(e as unknown as React.FormEvent);
    };

    return (
        <div className="relative">
            <div className="flex items-end gap-2">
                {/* Add Source Button */}
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 shrink-0"
                    onClick={() => setIsSourcePopupOpen(true)}
                    disabled={isLoading}
                >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add source</span>
                </Button>

                {/* Text Input */}
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="Type your message..."
                    className="min-h-[40px] max-h-[120px] resize-none"
                    disabled={isLoading}
                    rows={1}
                />

                {/* Send Button */}
                <Button
                    type="button"
                    size="icon"
                    className="h-10 w-10 shrink-0"
                    onClick={onSendClick}
                    disabled={!input.trim() || isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <ArrowRight className="h-4 w-4" />
                    )}
                    <span className="sr-only">Send message</span>
                </Button>
            </div>

            {/* Add Source Popup */}
            <AddSourcePopup
                isOpen={isSourcePopupOpen}
                onClose={() => setIsSourcePopupOpen(false)}
                onAddSource={handleAddSource}
            />
        </div>
    );
}
