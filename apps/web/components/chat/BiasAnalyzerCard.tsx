"use client";

import React from "react";
import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { hideBackendIds } from "@/lib/chat/content-filter";

interface BiasAnalyzerCardProps {
    content: string;
}

interface ParsedBias {
    sourceTitle: string;
    score: number;
    interpretation: string;
}

/**
 * Bias Analyzer Card
 * 
 * Renders bias analysis with:
 * - Header: "Bias Analysis"
 * - Per-source scores with visual bars
 * - Overall score at the END of the message
 */
export function BiasAnalyzerCard({ content }: BiasAnalyzerCardProps) {
    const { biasEntries, overallScore, overallInterpretation } = parseBiasContent(content);

    // If no bias entries parsed, show clean content
    if (biasEntries.length === 0 && overallScore === null) {
        const cleanText = hideBackendIds(content).trim();
        if (cleanText) {
            return (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Scale className="w-4 h-4 text-primary" strokeWidth={2.5} />
                        <span className="text-primary">Bias Analysis</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{cleanText}</p>
                </div>
            );
        }
        return null;
    }

    return (
        <div className="w-full space-y-3">
            {/* Header */}
            <div className="flex items-center gap-2 text-sm font-medium">
                <Scale className="w-4 h-4 text-primary" strokeWidth={2.5} />
                <span className="text-primary">Bias Analysis</span>
            </div>

            {/* Per-source breakdowns */}
            {biasEntries.length > 0 && (
                <div className="space-y-2">
                    {biasEntries.map((entry, index) => (
                        <BiasRow key={index} entry={entry} />
                    ))}
                </div>
            )}

            {/* Overall score - at the END */}
            {overallScore !== null && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/50">
                    <span className="text-sm font-medium">Overall Bias Score</span>
                    <div className="flex items-center gap-3">
                        <BiasBar score={overallScore} />
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {overallScore.toFixed(1)}/10 ({overallInterpretation || getInterpretation(overallScore)})
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

function BiasRow({ entry }: { entry: ParsedBias }) {
    return (
        <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-background/50 border border-border/30">
            {/* Source title */}
            <span className="text-sm flex-1 truncate" title={entry.sourceTitle}>
                {entry.sourceTitle}
            </span>

            {/* Bias bar + score */}
            <div className="flex items-center gap-3 flex-shrink-0">
                <BiasBar score={entry.score} />
                <span className="text-xs text-muted-foreground whitespace-nowrap min-w-[120px] text-right">
                    {entry.score}/10 {entry.interpretation && `(${entry.interpretation})`}
                </span>
            </div>
        </div>
    );
}

function BiasBar({ score }: { score: number }) {
    const filledBlocks = Math.round(score);
    const emptyBlocks = 10 - filledBlocks;

    // Color based on bias level using gradient
    const getColor = (s: number) => {
        if (s <= 2) return 'text-green-500';
        if (s <= 4) return 'text-green-400';
        if (s <= 5) return 'text-yellow-500';
        if (s <= 7) return 'text-orange-500';
        return 'text-red-500';
    };

    return (
        <span className={cn("font-mono text-xs leading-none", getColor(score))}>
            {'█'.repeat(filledBlocks)}
            <span className="text-muted-foreground/30">{'░'.repeat(emptyBlocks)}</span>
        </span>
    );
}

function getInterpretation(score: number): string {
    if (score <= 2) return 'Neutral / Balanced';
    if (score <= 4) return 'Slight Bias';
    if (score <= 6) return 'Moderate Bias';
    if (score <= 8) return 'Significant Bias';
    return 'Highly Biased';
}

/**
 * Parse bias analyzer content
 */
function parseBiasContent(content: string): {
    biasEntries: ParsedBias[];
    overallScore: number | null;
    overallInterpretation: string | null;
} {
    const biasEntries: ParsedBias[] = [];
    let overallScore: number | null = null;
    let overallInterpretation: string | null = null;

    const cleanedContent = hideBackendIds(content);
    const lines = cleanedContent.split('\n');

    let currentTitle: string | null = null;

    for (const line of lines) {
        // Overall pattern: Overall: X/10 or **Overall Bias Score:** X/10
        const overallPattern = /Overall(?:\s*Bias\s*Score)?:\s*([\d.]+)\/10\s*\(?([^)\n]*)\)?/i;
        const overallMatch = line.match(overallPattern);

        if (overallMatch) {
            overallScore = parseFloat(overallMatch[1]);
            overallInterpretation = overallMatch[2]?.trim() || null;
            continue;
        }

        // Entry title pattern: 1. **Source Title** or just Source Title:
        const titlePattern = /^\d+\.\s*\*?\*?([^*\n]+)\*?\*?\s*$/;
        const titleMatch = line.match(titlePattern);

        if (titleMatch && !line.includes('Score:') && !line.includes('Reason:') && !line.includes('/10')) {
            currentTitle = titleMatch[1].replace(/\*\*/g, '').replace(/:$/, '').trim();
            continue;
        }

        // Score pattern: - Score: 2/10 (Neutral) or Score: 2/10 (Neutral)
        const scorePattern = /Score:\s*(\d+)\/10\s*\(?([^)\n]*)\)?/i;
        const scoreMatch = line.match(scorePattern);

        if (scoreMatch) {
            const score = parseInt(scoreMatch[1], 10);
            const interpretation = scoreMatch[2]?.trim() || getInterpretation(score);

            // If we have a current title, create an entry
            if (currentTitle) {
                biasEntries.push({
                    sourceTitle: currentTitle,
                    score,
                    interpretation,
                });
                currentTitle = null;
            } else {
                // Try to find title in the same line
                const inlinePattern = /(.+?)\s*[-:]\s*Score:\s*(\d+)\/10\s*\(?([^)]*)\)?/i;
                const inlineMatch = line.match(inlinePattern);
                if (inlineMatch) {
                    biasEntries.push({
                        sourceTitle: inlineMatch[1].replace(/^\d+\.\s*/, '').replace(/\*\*/g, '').trim(),
                        score: parseInt(inlineMatch[2], 10),
                        interpretation: inlineMatch[3]?.trim() || getInterpretation(parseInt(inlineMatch[2], 10)),
                    });
                }
            }
        }

        // Alternative: "Source Title" with score on same or next line
        // Pattern: **Title** - 5/10 (Slight Bias)
        const combinedPattern = /\*?\*?([^*\n]+)\*?\*?\s*[-–:]\s*(\d+)\/10\s*\(?([^)\n]*)\)?/;
        const combinedMatch = line.match(combinedPattern);
        if (combinedMatch && !line.toLowerCase().includes('overall')) {
            const title = combinedMatch[1].replace(/^\d+\.\s*/, '').trim();
            if (title && title.length > 3) {
                biasEntries.push({
                    sourceTitle: title,
                    score: parseInt(combinedMatch[2], 10),
                    interpretation: combinedMatch[3]?.trim() || getInterpretation(parseInt(combinedMatch[2], 10)),
                });
            }
        }
    }

    // Deduplicate entries by title
    const seen = new Set<string>();
    const uniqueEntries = biasEntries.filter(entry => {
        if (seen.has(entry.sourceTitle)) return false;
        seen.add(entry.sourceTitle);
        return true;
    });

    return { biasEntries: uniqueEntries, overallScore, overallInterpretation };
}
