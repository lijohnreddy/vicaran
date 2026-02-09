"use client";

import React from "react";
import { FileText, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { hideBackendIds } from "@/lib/chat/content-filter";

interface ClaimExtractorCardProps {
    content: string;
}

interface ParsedClaim {
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
    text: string;
}

/**
 * Claim Extractor Card
 * 
 * Renders extracted claims with:
 * - Header: "Extracted X claims from Y sources" (highlighted)
 * - Impact tags: 🔴 HIGH, 🟡 MEDIUM, 🟢 LOW
 * - Clean claim text
 */
export function ClaimExtractorCard({ content }: ClaimExtractorCardProps) {
    const { claims, summary } = parseClaimContent(content);

    // If no claims parsed, show clean content
    if (claims.length === 0) {
        const cleanText = hideBackendIds(content).trim();
        if (cleanText) {
            return (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <FileText className="w-4 h-4 text-primary" strokeWidth={2.5} />
                        <span className="text-primary">Claims Extracted</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{cleanText}</p>
                </div>
            );
        }
        return null;
    }

    return (
        <div className="w-full space-y-3">
            {/* Header with summary - this is the highlighted part */}
            <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" strokeWidth={2.5} />
                <span className="text-sm font-medium text-primary">
                    {summary || `Extracted ${claims.length} claims`}
                </span>
            </div>

            {/* Claims list */}
            <div className="space-y-2">
                {claims.map((claim, index) => (
                    <ClaimRow key={index} claim={claim} />
                ))}
            </div>
        </div>
    );
}

function ClaimRow({ claim }: { claim: ParsedClaim }) {
    const impactConfig = {
        HIGH: {
            label: 'HIGH',
            bgColor: 'bg-red-500/10 dark:bg-red-500/20',
            textColor: 'text-red-600 dark:text-red-400',
            borderColor: 'border-red-500/30',
            icon: AlertCircle,
        },
        MEDIUM: {
            label: 'MED',
            bgColor: 'bg-yellow-500/10 dark:bg-yellow-500/20',
            textColor: 'text-yellow-600 dark:text-yellow-400',
            borderColor: 'border-yellow-500/30',
            icon: AlertTriangle,
        },
        LOW: {
            label: 'LOW',
            bgColor: 'bg-green-500/10 dark:bg-green-500/20',
            textColor: 'text-green-600 dark:text-green-400',
            borderColor: 'border-green-500/30',
            icon: Info,
        },
    };

    const config = impactConfig[claim.impact];
    const Icon = config.icon;

    return (
        <div className={cn(
            "flex items-start gap-3 p-3 rounded-lg border bg-background/50",
            config.borderColor
        )}>
            {/* Impact badge */}
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
                &quot;{claim.text}&quot;
            </span>
        </div>
    );
}

/**
 * Parse claim extractor content
 */
function parseClaimContent(content: string): { claims: ParsedClaim[]; summary: string | null } {
    const claims: ParsedClaim[] = [];
    let summary: string | null = null;

    const cleanedContent = hideBackendIds(content);
    const lines = cleanedContent.split('\n');

    for (const line of lines) {
        // Summary: "Extracted X verifiable claims from Y sources"
        const summaryPattern = /Extracted\s*(\d+)\s*(?:verifiable\s*)?claims?\s*(?:from\s*(\d+)\s*sources?)?/i;
        const summaryMatch = line.match(summaryPattern);

        if (summaryMatch) {
            if (summaryMatch[2]) {
                summary = `Extracted ${summaryMatch[1]} verifiable claims from ${summaryMatch[2]} sources`;
            } else {
                summary = `Extracted ${summaryMatch[1]} verifiable claims`;
            }
            continue;
        }

        // Claim pattern: 1. [HIGH IMPACT] "claim text"
        // Also: 1. **[HIGH IMPACT]** "claim text"
        // Also: [HIGH] "claim"
        const claimPattern = /^\d*\.?\s*\*?\*?\[?(HIGH|MEDIUM|LOW)(?:\s*IMPACT)?\]?\*?\*?\s*[""]?(.+?)[""]?\s*$/i;
        const match = line.match(claimPattern);

        if (match) {
            claims.push({
                impact: match[1].toUpperCase() as 'HIGH' | 'MEDIUM' | 'LOW',
                text: match[2].replace(/[""]$/g, '').replace(/^[""]/, '').trim(),
            });
        }
    }

    return { claims, summary };
}
