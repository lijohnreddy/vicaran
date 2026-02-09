"use client";

import React, { useState } from "react";
import { Search, ChevronRight, ChevronDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { hideBackendIds, renderStars } from "@/lib/chat/content-filter";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface SourceFinderCardProps {
    content: string;
}

interface ParsedSource {
    domain: string;
    stars: number;
    credibility: number;
    keyFinding: string;
    fullContent: string;
}

/**
 * Source Finder Card
 * 
 * Renders sources with:
 * - Header: "🔍 Analyzing sources..."
 * - Collapsible source rows: ⭐⭐⭐⭐⭐ domain.com | Credibility: 5 💡 Key finding: "..."
 * - Show truncated when collapsed, full JSON/content when expanded
 */
export function SourceFinderCard({ content }: SourceFinderCardProps) {
    const { sources, headerText, cleanContent } = parseSourceContent(content);
    const [expandedSources, setExpandedSources] = useState<Set<number>>(new Set());

    const toggleSource = (index: number) => {
        setExpandedSources(prev => {
            const next = new Set(prev);
            if (next.has(index)) {
                next.delete(index);
            } else {
                next.add(index);
            }
            return next;
        });
    };

    // If we parsed sources, show the nice expandable UI
    if (sources.length > 0) {
        return (
            <div className="w-full space-y-3">
                {/* Header */}
                {headerText && (
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Search className="w-4 h-4 text-primary" strokeWidth={2.5} />
                        <span className="text-primary">{headerText}</span>
                    </div>
                )}

                {/* Source rows */}
                <div className="space-y-2">
                    {sources.map((source, index) => (
                        <SourceRow
                            key={index}
                            source={source}
                            isExpanded={expandedSources.has(index)}
                            onToggle={() => toggleSource(index)}
                        />
                    ))}
                </div>
            </div>
        );
    }

    // Check if content only has SKIPPED messages or is essentially empty
    const hasOnlySkipped = /^[\s\n]*(?:⚠️\s*SKIPPED:[^\n]*\n?)*[\s\n]*$/i.test(cleanContent);
    const hasSubstantiveContent = cleanContent.replace(/⚠️\s*SKIPPED:[^\n]*/gi, '').trim().length > 10;

    // Return null for empty/SKIPPED-only content to prevent whitespace
    if (!hasSubstantiveContent || hasOnlySkipped) {
        return null;
    }

    // Fallback: just clean and render the content as markdown
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
                <Search className="w-4 h-4 text-primary animate-pulse" strokeWidth={2.5} />
                <span className="text-primary">Analyzing sources...</span>
            </div>
            <MarkdownRenderer content={cleanContent} isUser={false} />
        </div>
    );
}

interface SourceRowProps {
    source: ParsedSource;
    isExpanded: boolean;
    onToggle: () => void;
}

function SourceRow({ source, isExpanded, onToggle }: SourceRowProps) {
    // Truncate key finding for collapsed view
    const truncatedFinding = source.keyFinding.length > 80
        ? source.keyFinding.substring(0, 80) + "..."
        : source.keyFinding;

    return (
        <div
            className={cn(
                "rounded-lg border border-border/50 bg-background/50 transition-all",
                isExpanded && "bg-muted/30"
            )}
        >
            {/* Collapsed row - shows summary info */}
            <button
                onClick={onToggle}
                className="w-full flex items-start gap-2 px-3 py-2 text-left hover:bg-muted/30 rounded-lg transition-colors"
            >
                {/* Expand icon */}
                <span className="text-muted-foreground flex-shrink-0 mt-0.5">
                    {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                    ) : (
                        <ChevronRight className="w-4 h-4" />
                    )}
                </span>

                {/* Stars + Domain + Credibility + Key Finding */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap text-sm">
                        {/* Stars */}
                        <span className="flex-shrink-0">
                            {renderStars(source.stars)}
                        </span>

                        {/* Domain */}
                        <span className="flex items-center gap-1 font-medium text-foreground">
                            <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                            {source.domain}
                        </span>

                        {/* Credibility */}
                        <span className="text-muted-foreground">|</span>
                        <span className="text-muted-foreground">
                            Credibility: {source.credibility}
                        </span>

                        {/* Light bulb + Key finding */}
                        <span className="text-yellow-500">💡</span>
                        <span className="text-muted-foreground">
                            Key finding: &quot;{isExpanded ? "" : truncatedFinding}&quot;
                        </span>
                    </div>
                </div>
            </button>

            {/* Expanded content - full finding and JSON data */}
            {isExpanded && (
                <div className="px-4 pb-3 pl-10 border-t border-border/30">
                    <div className="pt-3 space-y-2">
                        {/* Full key finding */}
                        <div>
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Key Finding</span>
                            <p className="text-sm text-foreground/90 leading-relaxed mt-1">
                                &quot;{source.keyFinding}&quot;
                            </p>
                        </div>

                        {/* Full content (JSON etc) if different */}
                        {source.fullContent && source.fullContent !== source.keyFinding && (
                            <div>
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Full Data</span>
                                <div className="mt-1 p-2 rounded bg-muted/50 text-xs font-mono overflow-x-auto">
                                    <MarkdownRenderer content={source.fullContent} isUser={false} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

/**
 * Parse source finder content
 * Agent format: 📄 **Analyzing source [N]/[total]:** [title]
 *    ⭐⭐⭐⭐⭐ [credibility] | [domain]
 *    💡 Key finding: "[most important claim]"
 */
function parseSourceContent(content: string): {
    sources: ParsedSource[];
    headerText: string | null;
    cleanContent: string;
} {
    const sources: ParsedSource[] = [];
    let headerText: string | null = null;

    const cleanedContent = hideBackendIds(content);

    // Check for header text
    if (cleanedContent.toLowerCase().includes('analyzing source')) {
        headerText = "Analyzing sources...";
    }

    // Pattern to match agent format:
    // 📄 Analyzing source N/M: title ⭐⭐⭐⭐⭐ X/5 | domain 💡 Key finding: "..."

    // Inline pattern with 📄 header (actual format from agent):
    // 📄 Analyzing source 1/10: Title here ⭐⭐⭐⭐⭐ 5/5 | www.domain.com 💡 Key finding: "text"
    const inlineWithHeaderPattern = /📄\s*\*?\*?Analyzing source\s*(\d+)\/(\d+):?\*?\*?\s*(.+?)\s+(⭐+)\s*(\d+)\/\d+\s*\|\s*([\w.-]+)\s*💡\s*Key finding:\s*[""]?([^"""\n]+)[""]?/gi;

    // Simple inline pattern without 📄 header: ⭐⭐⭐ 5/5 | domain 💡 Key finding: "..."
    const simpleInlinePattern = /(⭐+)\s*(\d+)\/\d+\s*\|\s*([\w.-]+)\s*💡\s*Key finding:\s*[""]?([^""\n]+)[""]?/gi;

    let match;

    // Try inline format with 📄 header (primary format)
    while ((match = inlineWithHeaderPattern.exec(cleanedContent)) !== null) {
        const stars = match[4].length;
        const credibility = parseInt(match[5], 10);
        const domain = match[6];
        const keyFinding = match[7].trim();

        // Find the full content after this match (until next source or end)
        const startIdx = match.index;
        const nextSourceIdx = cleanedContent.indexOf('📄', match.index + match[0].length);
        const fullContent = nextSourceIdx > 0
            ? cleanedContent.substring(startIdx, nextSourceIdx).trim()
            : cleanedContent.substring(startIdx).trim();

        sources.push({
            domain,
            stars,
            credibility,
            keyFinding,
            fullContent: extractJsonContent(fullContent),
        });
    }

    // Fallback to simple inline format without 📄 header
    if (sources.length === 0) {
        while ((match = simpleInlinePattern.exec(cleanedContent)) !== null) {
            const stars = match[1].length;
            const credibility = parseInt(match[2], 10);
            const domain = match[3];
            const keyFinding = match[4].trim();

            // Find the full content after this match (until next source or end)
            const startIdx = match.index;
            const endIdx = cleanedContent.indexOf('⭐', match.index + match[0].length);
            const fullContent = endIdx > 0
                ? cleanedContent.substring(startIdx, endIdx).trim()
                : cleanedContent.substring(startIdx).trim();

            sources.push({
                domain,
                stars,
                credibility,
                keyFinding,
                fullContent: extractJsonContent(fullContent),
            });
        }
    }

    return {
        sources,
        headerText,
        cleanContent: cleanedContent.trim()
    };
}

/**
 * Extract JSON content from a string if present
 */
function extractJsonContent(content: string): string {
    // Look for ```json ... ``` blocks
    const jsonPattern = /```json\s*([\s\S]*?)```/i;
    const match = content.match(jsonPattern);
    if (match) {
        try {
            // Try to parse and pretty-print the JSON
            const parsed = JSON.parse(match[1].trim());
            return JSON.stringify(parsed, null, 2);
        } catch {
            return match[1].trim();
        }
    }
    return "";
}
