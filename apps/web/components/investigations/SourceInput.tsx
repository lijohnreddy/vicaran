"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SourceInputProps {
    sources: string[];
    onChange: (sources: string[]) => void;
    error?: string;
}

// URL validation regex - checks format only, not reachability
const URL_REGEX = /^https?:\/\/.+/i;

export function SourceInput({ sources, onChange, error }: SourceInputProps): React.JSX.Element {
    const [inputValue, setInputValue] = useState("");
    const [inputError, setInputError] = useState<string | null>(null);

    const handleAdd = (): void => {
        const trimmed = inputValue.trim();

        if (!trimmed) return;

        if (!URL_REGEX.test(trimmed)) {
            setInputError("Please enter a valid URL starting with http:// or https://");
            return;
        }

        if (sources.includes(trimmed)) {
            setInputError("This URL has already been added");
            return;
        }

        onChange([...sources, trimmed]);
        setInputValue("");
        setInputError(null);
    };

    const handleRemove = (url: string): void => {
        onChange(sources.filter((s) => s !== url));
    };

    const handleKeyDown = (e: React.KeyboardEvent): void => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div className="space-y-3">
            <label className="text-sm font-medium">
                Initial Sources <span className="text-muted-foreground font-normal">(optional)</span>
            </label>

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            setInputError(null);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="https://example.com/article"
                        className={cn("pl-9", inputError && "border-destructive")}
                    />
                </div>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAdd}
                    className="shrink-0"
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                </Button>
            </div>

            {inputError && (
                <p className="text-sm text-destructive">{inputError}</p>
            )}

            {error && !inputError && (
                <p className="text-sm text-destructive">{error}</p>
            )}

            {sources.length > 0 && (
                <div className="space-y-2">
                    {sources.map((url) => (
                        <div
                            key={url}
                            className="flex items-center gap-2 p-2 bg-muted/50 rounded-md group"
                        >
                            <LinkIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-sm truncate flex-1">{url}</span>
                            <button
                                type="button"
                                onClick={() => handleRemove(url)}
                                className="p-1 hover:bg-destructive/10 rounded opacity-60 group-hover:opacity-100 transition-opacity"
                                aria-label={`Remove ${url}`}
                            >
                                <X className="h-4 w-4 text-destructive" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <p className="text-xs text-muted-foreground">
                Add URLs to articles or sources you want analyzed. The AI will also find additional sources.
            </p>
        </div>
    );
}
