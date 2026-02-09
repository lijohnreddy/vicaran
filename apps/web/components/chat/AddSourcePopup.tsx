"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddSourcePopupProps {
    isOpen: boolean;
    onClose: () => void;
    onAddSource: (url: string) => void;
}

/**
 * Popup for adding source URLs - using a simple positioned div instead of Popover
 */
export function AddSourcePopup({
    isOpen,
    onClose,
    onAddSource,
}: AddSourcePopupProps): React.JSX.Element | null {
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const validateUrl = (input: string): boolean => {
        try {
            new URL(input);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = () => {
        const trimmedUrl = url.trim();

        if (!trimmedUrl) {
            setError("Please enter a URL");
            return;
        }

        if (!validateUrl(trimmedUrl)) {
            setError("Please enter a valid URL");
            return;
        }

        onAddSource(trimmedUrl);
        setUrl("");
        setError("");
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
        }
        if (e.key === "Escape") {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="absolute bottom-full left-0 mb-2 z-50">
            <div className="bg-popover border border-border rounded-lg shadow-lg p-4 w-80">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Link2 className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-medium text-sm">Add Source URL</h4>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="space-y-2">
                    <Input
                        ref={inputRef}
                        value={url}
                        onChange={(e) => {
                            setUrl(e.target.value);
                            setError("");
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="https://example.com/article"
                        className={cn(error && "border-destructive")}
                    />
                    {error && (
                        <p className="text-xs text-destructive">{error}</p>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-3">
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button size="sm" onClick={handleSubmit}>
                        Add Source
                    </Button>
                </div>
            </div>
        </div>
    );
}
