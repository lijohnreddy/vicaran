"use client";

import { cn } from "@/lib/utils";

interface BriefTabProps {
    summary: string | null;
    isLoading: boolean;
}

/**
 * Brief Tab - Displays auto-updating investigation summary
 * Shows placeholder when no summary available yet
 */
export function BriefTab({ summary, isLoading }: BriefTabProps): React.JSX.Element {
    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-sm">Loading summary...</p>
                </div>
            </div>
        );
    }

    if (!summary) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <div className="text-center text-muted-foreground max-w-md">
                    <div className="text-4xl mb-4">📝</div>
                    <h3 className="text-lg font-medium mb-2">Summary Coming Soon</h3>
                    <p className="text-sm">
                        The investigation summary will appear here as the agent
                        completes its analysis. This updates automatically.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-6">
            <div className="prose prose-sm dark:prose-invert max-w-none">
                {/* Render summary with line breaks preserved */}
                {summary.split("\n").map((paragraph, index) => (
                    <p key={index} className={cn(paragraph === "" && "h-4")}>
                        {paragraph}
                    </p>
                ))}
            </div>
        </div>
    );
}
