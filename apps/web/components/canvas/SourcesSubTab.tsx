"use client";

import type { Source } from "@/lib/drizzle/schema";
import { SourceCard } from "./SourceCard";

interface SourcesSubTabProps {
    sources: Source[];
    isLoading: boolean;
}

/**
 * Sources Sub-Tab - Displays source cards ordered by credibility
 */
export function SourcesSubTab({
    sources,
    isLoading,
}: SourcesSubTabProps): React.JSX.Element {
    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-sm">Loading sources...</p>
                </div>
            </div>
        );
    }

    if (sources.length === 0) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <div className="text-center text-muted-foreground max-w-sm">
                    <div className="text-3xl mb-3">📰</div>
                    <h3 className="text-base font-medium mb-1">No Sources Yet</h3>
                    <p className="text-sm">
                        Sources will appear here as the agent discovers them during
                        the investigation.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-4">
            <div className="space-y-3">
                {sources.map((source) => (
                    <SourceCard key={source.id} source={source} />
                ))}
            </div>
        </div>
    );
}
