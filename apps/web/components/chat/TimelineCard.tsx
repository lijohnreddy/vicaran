"use client";

import React from "react";
import { Calendar } from "lucide-react";
import { hideBackendIds } from "@/lib/chat/content-filter";

interface TimelineCardProps {
    content: string;
}

interface ParsedEvent {
    date: string;
    event: string;
}

/**
 * Timeline Card
 * 
 * Renders timeline as a vertical flow with dots and connecting lines.
 * Hides event IDs and source reference columns.
 */
export function TimelineCard({ content }: TimelineCardProps) {
    const { events, title } = parseTimelineContent(content);

    if (events.length === 0) {
        return null;
    }

    return (
        <div className="w-full space-y-3">
            {/* Header */}
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Calendar className="w-4 h-4" strokeWidth={2.5} />
                <span>Investigation Timeline</span>
                {title && (
                    <span className="text-muted-foreground font-normal">• {title}</span>
                )}
            </div>

            {/* Vertical timeline */}
            <div className="relative pl-6">
                {/* Vertical line */}
                <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-border" />

                {/* Events */}
                <div className="space-y-4">
                    {events.map((event, index) => (
                        <TimelineEvent
                            key={index}
                            event={event}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function TimelineEvent({ event }: { event: ParsedEvent }) {
    return (
        <div className="relative flex items-start gap-4">
            {/* Dot */}
            <div className="absolute -left-4 top-1.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background" />

            {/* Date */}
            <span className="text-xs font-mono text-muted-foreground whitespace-nowrap min-w-[80px]">
                {formatDate(event.date)}
            </span>

            {/* Event text */}
            <span className="text-sm text-foreground/90 leading-relaxed flex-1">
                {event.event}
            </span>
        </div>
    );
}

/**
 * Format date for display
 */
function formatDate(dateStr: string): string {
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    } catch {
        return dateStr;
    }
}

/**
 * Parse timeline content
 */
function parseTimelineContent(content: string): { events: ParsedEvent[]; title: string | null } {
    const events: ParsedEvent[] = [];
    let title: string | null = null;

    const cleanedContent = hideBackendIds(content);
    const lines = cleanedContent.split('\n');

    for (const line of lines) {
        // Title pattern: ## Investigation Timeline: topic
        const titlePattern = /##\s*Investigation Timeline:\s*(.+)/i;
        const titleMatch = line.match(titlePattern);

        if (titleMatch) {
            title = titleMatch[1].trim();
            continue;
        }

        // Table row pattern: | date | event | sources | event_id |
        // We want to extract date and event, ignoring sources and event_id columns
        const tablePattern = /\|\s*(\d{4}-\d{2}-\d{2})\s*\|\s*(.+?)\s*\|/;
        const tableMatch = line.match(tablePattern);

        if (tableMatch) {
            const date = tableMatch[1];
            let eventText = tableMatch[2].trim();

            // Skip header rows
            if (date === 'Date' || eventText.includes('---') || eventText === 'Event') {
                continue;
            }

            // Clean up event text - remove any trailing columns that might have been captured
            eventText = eventText.split('|')[0].trim();

            events.push({ date, event: eventText });
        }
    }

    // Sort events by date
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return { events, title };
}
