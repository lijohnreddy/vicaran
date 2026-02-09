"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface SourceNodeData {
    sourceId: string;
    title: string;
    url: string;
    domain: string;
    credibilityScore: number;
    contentSnippet?: string | null;
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
            <span
                key={i}
                className={cn(
                    "text-xs",
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
 * SourceNode - Custom React Flow node for displaying sources
 * Shows domain, title, and credibility rating with hover glow effect
 */
function SourceNodeComponent({ data, selected }: NodeProps<SourceNodeData>): React.JSX.Element {
    return (
        <div
            className={cn(
                "rounded-lg border bg-slate-700/90 p-4 shadow-md transition-all duration-200 min-w-[200px] max-w-[260px]",
                "border-slate-600/60",
                "hover:shadow-lg hover:border-slate-500/60",
                selected && "ring-2 ring-cyan-400 shadow-cyan-500/20"
            )}
        >
            {/* Source handle (output) on the right side */}
            <Handle
                type="source"
                position={Position.Right}
                className="!bg-slate-400 !w-2.5 !h-2.5 !border-0"
            />

            {/* Header: Domain badge + Stars */}
            <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-600/80 text-slate-300 uppercase tracking-wider">
                    {data.domain}
                </span>
                <CredibilityStars score={data.credibilityScore} />
            </div>

            {/* Title - Bolder */}
            <p className="text-sm font-semibold text-white line-clamp-2 leading-snug">
                {data.title}
            </p>
        </div>
    );
}

// Memoize for performance
export const SourceNode = memo(SourceNodeComponent);
