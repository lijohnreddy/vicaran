"use client";

import React, { useState } from "react";
import { Search, ChevronRight, ChevronDown, CheckCircle2, AlertTriangle, XCircle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { hideBackendIds, cleanContent } from "@/lib/chat/content-filter";

interface FactCheckerCardProps {
    content: string;
}

interface ParsedFactCheck {
    verdict: 'VERIFIED' | 'PARTIAL' | 'FALSE' | 'UNVERIFIED';
    claimText: string;
    evidence: string;
}

/**
 * Fact Checker Card
 * 
 * Renders fact check results with:
 * - Header: "Fact Checking Claims"
 * - Verdict pills: ✅ VERIFIED, ⚠️ PARTIAL, ❌ FALSE
 * - Collapsible evidence for each check
 */
export function FactCheckerCard({ content }: FactCheckerCardProps) {
    const { factChecks, summary, claimCount } = parseFactCheckContent(content);
    const [expandedChecks, setExpandedChecks] = useState<Set<number>>(new Set());

    const toggleCheck = (index: number) => {
        setExpandedChecks(prev => {
            const next = new Set(prev);
            if (next.has(index)) {
                next.delete(index);
            } else {
                next.add(index);
            }
            return next;
        });
    };

    // If no fact checks parsed, show simple clean content
    if (factChecks.length === 0) {
        const cleanText = cleanContent(content).trim();
        if (cleanText) {
            return (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Search className="w-4 h-4 text-primary" strokeWidth={2.5} />
                        <span className="text-primary">Fact Checking Claims</span>
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
                <Search className="w-4 h-4 text-primary" strokeWidth={2.5} />
                <span className="text-primary">
                    Fact Checking {claimCount ? `${claimCount} Claims` : "Claims"}
                </span>
            </div>

            {/* Summary */}
            {summary && (
                <p className="text-sm text-muted-foreground">{summary}</p>
            )}

            {/* Fact check rows */}
            <div className="space-y-2">
                {factChecks.map((check, index) => (
                    <FactCheckRow
                        key={index}
                        factCheck={check}
                        isExpanded={expandedChecks.has(index)}
                        onToggle={() => toggleCheck(index)}
                    />
                ))}
            </div>
        </div>
    );
}

interface FactCheckRowProps {
    factCheck: ParsedFactCheck;
    isExpanded: boolean;
    onToggle: () => void;
}

function FactCheckRow({ factCheck, isExpanded, onToggle }: FactCheckRowProps) {
    const verdictConfig = {
        VERIFIED: {
            label: 'VERIFIED',
            bgColor: 'bg-green-500/10 dark:bg-green-500/20',
            textColor: 'text-green-600 dark:text-green-400',
            icon: CheckCircle2,
        },
        PARTIAL: {
            label: 'PARTIAL',
            bgColor: 'bg-yellow-500/10 dark:bg-yellow-500/20',
            textColor: 'text-yellow-600 dark:text-yellow-400',
            icon: AlertTriangle,
        },
        FALSE: {
            label: 'FALSE',
            bgColor: 'bg-red-500/10 dark:bg-red-500/20',
            textColor: 'text-red-600 dark:text-red-400',
            icon: XCircle,
        },
        UNVERIFIED: {
            label: 'UNVERIFIED',
            bgColor: 'bg-gray-500/10 dark:bg-gray-500/20',
            textColor: 'text-gray-600 dark:text-gray-400',
            icon: HelpCircle,
        },
    };

    const config = verdictConfig[factCheck.verdict];
    const Icon = config.icon;

    return (
        <div
            className={cn(
                "rounded-lg border border-border/50 bg-background/50 transition-all",
                isExpanded && "bg-muted/30"
            )}
        >
            {/* Collapsed row - clickable */}
            <button
                onClick={onToggle}
                className="w-full flex items-start gap-3 px-3 py-3 text-left hover:bg-muted/30 rounded-lg transition-colors"
            >
                {/* Expand icon */}
                <span className="text-muted-foreground flex-shrink-0 mt-0.5">
                    {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                    ) : (
                        <ChevronRight className="w-4 h-4" />
                    )}
                </span>

                {/* Verdict badge */}
                <span className={cn(
                    "flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap flex-shrink-0",
                    config.bgColor,
                    config.textColor
                )}>
                    <Icon className="w-3 h-3" strokeWidth={2.5} />
                    {config.label}
                </span>

                {/* Claim text */}
                <span className="text-sm text-foreground/90 leading-relaxed flex-1">
                    &quot;{factCheck.claimText}&quot;
                </span>
            </button>

            {/* Expanded evidence */}
            {isExpanded && factCheck.evidence && (
                <div className="px-4 pb-3 pl-12 border-t border-border/30">
                    <div className="pt-3">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Evidence</span>
                        <p className="text-sm text-foreground/80 leading-relaxed mt-1">
                            {factCheck.evidence}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

/**
 * Parse fact checker content
 */
function parseFactCheckContent(content: string): {
    factChecks: ParsedFactCheck[];
    summary: string | null;
    claimCount: number | null;
} {
    const factChecks: ParsedFactCheck[] = [];
    let summary: string | null = null;
    let claimCount: number | null = null;

    const cleanedContent = hideBackendIds(content);
    const lines = cleanedContent.split('\n');

    let currentCheck: Partial<ParsedFactCheck> | null = null;

    for (const line of lines) {
        // Summary: Verified X claims
        const summaryPattern = /verified\s*(\d+)\s*claims?/i;
        const summaryMatch = line.match(summaryPattern);
        if (summaryMatch) {
            claimCount = parseInt(summaryMatch[1], 10);
            summary = `Verified ${claimCount} claims`;
            continue;
        }

        // Verdict pattern: 1. ✅ **VERIFIED** - "claim text"
        // Or: ✅ VERIFIED "claim text"
        const verdictPattern = /(?:^\d+\.\s*)?(✅|⚠️|❌|❓)\s*\*?\*?(VERIFIED|PARTIALLY TRUE|PARTIAL|FALSE|UNVERIFIED)\*?\*?\s*[-:]?\s*[""]?(.+?)[""]?\s*$/i;
        const verdictMatch = line.match(verdictPattern);

        if (verdictMatch) {
            // Save previous check
            if (currentCheck && currentCheck.claimText) {
                factChecks.push(currentCheck as ParsedFactCheck);
            }

            let verdict: ParsedFactCheck['verdict'] = 'UNVERIFIED';
            const rawVerdict = verdictMatch[2].toUpperCase();
            if (rawVerdict === 'VERIFIED') verdict = 'VERIFIED';
            else if (rawVerdict === 'PARTIALLY TRUE' || rawVerdict === 'PARTIAL') verdict = 'PARTIAL';
            else if (rawVerdict === 'FALSE') verdict = 'FALSE';

            currentCheck = {
                verdict,
                claimText: verdictMatch[3].replace(/[""]$/g, '').trim(),
                evidence: '',
            };
            continue;
        }

        // Evidence pattern: Evidence: text OR - Evidence: text
        const evidencePattern = /(?:^-?\s*)?Evidence:\s*(.+)/i;
        const evidenceMatch = line.match(evidencePattern);

        if (evidenceMatch && currentCheck) {
            // Clean up the evidence - remove source IDs
            const evidence = evidenceMatch[1]
                .replace(/Source\s*['"]?[a-f0-9-]{36}['"]?\s*/gi, '')
                .replace(/\([a-f0-9-]{36}\)/gi, '')
                .trim();
            currentCheck.evidence = evidence;
        }
    }

    // Don't forget last check
    if (currentCheck && currentCheck.claimText) {
        factChecks.push(currentCheck as ParsedFactCheck);
    }

    return { factChecks, summary, claimCount };
}
