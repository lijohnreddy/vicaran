"use client";

import type { TimelineEventWithSource } from "@/app/actions/canvas";
import { ExternalLink } from "lucide-react";

interface TimelineSubTabProps {
    timeline: TimelineEventWithSource[];
    isLoading: boolean;
}

/**
 * Format date for display
 */
function formatDate(date: Date): { month: string; day: string; year: string } {
    const d = new Date(date);
    return {
        month: d.toLocaleDateString("en-US", { month: "short" }),
        day: d.getDate().toString(),
        year: d.getFullYear().toString(),
    };
}

/**
 * Timeline Sub-Tab - Displays chronological events (inline rendering)
 */
export function TimelineSubTab({
    timeline,
    isLoading,
}: TimelineSubTabProps): React.JSX.Element {
    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-sm">Loading timeline...</p>
                </div>
            </div>
        );
    }

    if (timeline.length === 0) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <div className="text-center text-muted-foreground max-w-sm">
                    <div className="text-3xl mb-3">📅</div>
                    <h3 className="text-base font-medium mb-1">No Timeline Yet</h3>
                    <p className="text-sm">
                        Timeline events will appear here as the agent extracts
                        chronological information from sources.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-4">
            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[52px] top-0 bottom-0 w-px bg-border" />

                {/* Timeline Events */}
                <div className="space-y-4">
                    {timeline.map((event) => {
                        const date = formatDate(event.event_date);
                        const sourceTitle = event.source?.title || event.source?.url;

                        return (
                            <div key={event.id} className="flex gap-4">
                                {/* Date Column */}
                                <div className="w-12 flex-shrink-0 text-right">
                                    <div className="text-xs font-medium text-foreground">
                                        {date.month} {date.day}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {date.year}
                                    </div>
                                </div>

                                {/* Timeline Dot */}
                                <div className="relative flex-shrink-0">
                                    <div className="h-3 w-3 rounded-full bg-primary mt-1" />
                                </div>

                                {/* Event Content */}
                                <div className="flex-1 pb-4">
                                    <p className="text-sm text-foreground mb-1">
                                        {event.event_text}
                                    </p>

                                    {/* Source Link */}
                                    {event.source && (
                                        <a
                                            href={event.source.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary hover:underline"
                                        >
                                            <span className="truncate max-w-[200px]">
                                                {sourceTitle}
                                            </span>
                                            <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
