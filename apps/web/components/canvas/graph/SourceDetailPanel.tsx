"use client";

import { memo } from "react";
import { X, ExternalLink, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Source } from "@/lib/drizzle/schema";

// ============================================================================
// Types
// ============================================================================

interface SourceDetailPanelProps {
    source: Source;
    onClose: () => void;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Renders star rating from credibility score (1-5)
 */
function CredibilityStars({ score }: { score: number }): React.JSX.Element {
    const rating = Math.min(5, Math.max(1, score));
    const stars = [];

    for (let i = 1; i <= 5; i++) {
        stars.push(
            <Star
                key={i}
                className={cn(
                    "h-4 w-4",
                    i <= rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"
                )}
            />
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
 * SourceDetailPanel - Slide-out panel showing full source details
 * Slides in from the right side when a source node is clicked
 */
function SourceDetailPanelComponent({ source, onClose }: SourceDetailPanelProps): React.JSX.Element {
    const displayTitle = source.title || getDomain(source.url);

    return (
        <div className="absolute right-0 top-0 h-full w-80 bg-slate-900/95 backdrop-blur-md border-l border-slate-700/50 shadow-2xl animate-in slide-in-from-right duration-200 z-50 overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-slate-900/90 backdrop-blur-sm border-b border-slate-700/50 p-4 flex items-center justify-between">
                <h3 className="font-semibold text-slate-100">Source Details</h3>
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                    aria-label="Close panel"
                >
                    <X className="h-5 w-5 text-slate-400 hover:text-slate-200" />
                </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
                {/* Title */}
                <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide">Title</label>
                    <p className="text-sm font-medium text-foreground mt-1">{displayTitle}</p>
                </div>

                {/* Domain */}
                <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide">Domain</label>
                    <p className="text-sm text-foreground mt-1">{getDomain(source.url)}</p>
                </div>

                {/* Credibility */}
                <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide">Credibility Rating</label>
                    <div className="mt-1">
                        <CredibilityStars score={source.credibility_score ?? 3} />
                    </div>
                </div>

                {/* Bias Score (if available) */}
                {source.bias_score && (
                    <div>
                        <label className="text-xs text-muted-foreground uppercase tracking-wide">Bias Score</label>
                        <p className="text-sm text-foreground mt-1">{source.bias_score}/10</p>
                    </div>
                )}

                {/* Content Snippet */}
                {source.content_snippet && (
                    <div>
                        <label className="text-xs text-muted-foreground uppercase tracking-wide">Excerpt</label>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                            {source.content_snippet}
                        </p>
                    </div>
                )}

                {/* View Source Link */}
                <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline mt-4"
                >
                    <ExternalLink className="h-4 w-4" />
                    View Original Source
                </a>
            </div>
        </div>
    );
}

// Memoize for performance
export const SourceDetailPanel = memo(SourceDetailPanelComponent);
