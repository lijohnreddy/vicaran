"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface ClaimNodeData {
    claimId: string;
    text: string;
    status: "verified" | "unverified" | "contradicted";
    evidenceCount: number;
}

// Status configuration
const STATUS_CONFIG = {
    verified: {
        label: "Verified",
        icon: "✓",
        borderColor: "border-green-500",
        bgColor: "bg-green-500/20",
        textColor: "text-green-400",
        handleColor: "!bg-green-500",
    },
    unverified: {
        label: "Unverified",
        icon: "?",
        borderColor: "border-yellow-500",
        bgColor: "bg-yellow-500/20",
        textColor: "text-yellow-400",
        handleColor: "!bg-yellow-500",
    },
    contradicted: {
        label: "Disputed",
        icon: "✗",
        borderColor: "border-red-500",
        bgColor: "bg-red-500/20",
        textColor: "text-red-400",
        handleColor: "!bg-red-500",
    },
} as const;

// ============================================================================
// Component
// ============================================================================

/**
 * ClaimNode - Custom React Flow node for displaying claims
 * Shows status badge, claim text, and evidence count with colored border
 */
function ClaimNodeComponent({ data, selected }: NodeProps<ClaimNodeData>): React.JSX.Element {
    const config = STATUS_CONFIG[data.status];

    return (
        <div
            className={cn(
                "rounded-lg border-[3px] bg-slate-800/90 p-4 shadow-md transition-all duration-200 min-w-[220px] max-w-[280px]",
                "hover:shadow-lg",
                config.borderColor,
                selected && "ring-2 ring-cyan-400 shadow-cyan-500/20"
            )}
        >
            {/* Target handle (input) on the left side */}
            <Handle
                type="target"
                position={Position.Left}
                className={cn("!w-2.5 !h-2.5 !border-0", config.handleColor)}
            />

            {/* Header: Status badge and evidence count */}
            <div className="flex items-center justify-between gap-2 mb-2">
                <span
                    className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1",
                        config.bgColor,
                        config.textColor
                    )}
                >
                    <span>{config.icon}</span>
                    {config.label}
                </span>
                {data.evidenceCount > 0 && (
                    <span className="text-[10px] text-slate-400 font-medium">
                        {data.evidenceCount} evidence
                    </span>
                )}
            </div>

            {/* Claim text - Bolder */}
            <p className="text-sm font-bold text-white line-clamp-3 leading-snug">
                {data.text}
            </p>
        </div>
    );
}

// Memoize for performance
export const ClaimNode = memo(ClaimNodeComponent);
