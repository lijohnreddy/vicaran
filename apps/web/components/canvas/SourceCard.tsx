"use client";

import type { Source } from "@/lib/drizzle/schema";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface SourceCardProps {
    source: Source;
}

/**
 * Renders star rating from credibility score (1-5)
 */
function CredibilityStars({ score }: { score: number | null }): React.JSX.Element {
    const rating = score ?? 3; // Default to 3 if no score
    const stars = [];

    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span
                key={i}
                className={cn(
                    "text-sm",
                    i <= rating ? "text-yellow-500" : "text-muted-foreground/30"
                )}
            >
                ★
            </span>
        );
    }

    return <div className="flex gap-0.5">{stars}</div>;
}

/**
 * Extract domain from URL for display
 */
function getDomain(url: string): string {
    try {
        const hostname = new URL(url).hostname;
        return hostname.replace("www.", "");
    } catch {
        return url;
    }
}

/**
 * Source Card - Individual source display with credibility rating
 */
export function SourceCard({ source }: SourceCardProps): React.JSX.Element {
    const displayTitle = source.title || getDomain(source.url);
    const snippet = source.content_snippet
        ? source.content_snippet.substring(0, 120) + (source.content_snippet.length > 120 ? "..." : "")
        : null;

    return (
        <div className="rounded-lg border border-border bg-card p-4 hover:bg-accent/5 transition-colors">
            {/* Header: Title and Credibility */}
            <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate text-foreground">
                        {displayTitle}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                        {getDomain(source.url)}
                    </p>
                </div>
                <CredibilityStars score={source.credibility_score} />
            </div>

            {/* Snippet */}
            {snippet && (
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {snippet}
                </p>
            )}

            {/* Footer: View Source button */}
            <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
                View Source
                <ExternalLink className="h-3 w-3" />
            </a>
        </div>
    );
}
