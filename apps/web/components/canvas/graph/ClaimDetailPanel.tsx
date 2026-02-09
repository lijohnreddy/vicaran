"use client";

import { memo } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Claim } from "@/lib/drizzle/schema";
import type { FactCheckWithSource } from "@/app/actions/canvas";

// ============================================================================
// Types
// ============================================================================

interface ClaimDetailPanelProps {
    claim: Claim;
    factChecks: FactCheckWithSource[];
    onClose: () => void;
}

// Status configuration
const STATUS_CONFIG = {
    verified: {
        label: "Verified",
        icon: "✓",
        bgColor: "bg-green-500/10",
        textColor: "text-green-600",
        description: "This claim has been verified by supporting evidence.",
    },
    unverified: {
        label: "Unverified",
        icon: "?",
        bgColor: "bg-yellow-500/10",
        textColor: "text-yellow-600",
        description: "This claim has not yet been verified by supporting evidence.",
    },
    contradicted: {
        label: "Disputed",
        icon: "✗",
        bgColor: "bg-red-500/10",
        textColor: "text-red-600",
        description: "This claim has been contradicted by evidence.",
    },
} as const;

// ============================================================================
// Component
// ============================================================================

/**
 * ClaimDetailPanel - Slide-out panel showing full claim details
 * Slides in from the right side when a claim node is clicked
 */
function ClaimDetailPanelComponent({ claim, factChecks, onClose }: ClaimDetailPanelProps): React.JSX.Element {
    const config = STATUS_CONFIG[claim.status];

    // Filter fact checks related to this claim
    const relatedFactChecks = factChecks.filter(fc => fc.claim_id === claim.id);
    const supportingEvidence = relatedFactChecks.filter(fc => fc.evidence_type === "supporting");
    const contradictingEvidence = relatedFactChecks.filter(fc => fc.evidence_type === "contradicting");

    return (
        <div className="absolute right-0 top-0 h-full w-80 bg-slate-900/95 backdrop-blur-md border-l border-slate-700/50 shadow-2xl animate-in slide-in-from-right duration-200 z-50 overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-slate-900/90 backdrop-blur-sm border-b border-slate-700/50 p-4 flex items-center justify-between">
                <h3 className="font-semibold text-slate-100">Claim Details</h3>
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
                {/* Status Badge */}
                <div>
                    <span
                        className={cn(
                            "text-xs font-medium px-2 py-1 rounded uppercase tracking-wide inline-flex items-center gap-1",
                            config.bgColor,
                            config.textColor
                        )}
                    >
                        <span>{config.icon}</span>
                        {config.label}
                    </span>
                    <p className="text-xs text-muted-foreground mt-2">{config.description}</p>
                </div>

                {/* Claim Text */}
                <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide">Claim</label>
                    <p className="text-sm font-medium text-foreground mt-1 leading-relaxed">
                        {claim.claim_text}
                    </p>
                </div>

                {/* Supporting Evidence */}
                {supportingEvidence.length > 0 && (
                    <div>
                        <label className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                            Supporting Evidence ({supportingEvidence.length})
                        </label>
                        <div className="mt-2 space-y-2">
                            {supportingEvidence.map((fc) => (
                                <div
                                    key={fc.id}
                                    className="p-2 rounded-md bg-green-500/5 border border-green-500/20"
                                >
                                    <p className="text-xs text-muted-foreground mb-1">
                                        From: {fc.source?.title || "Unknown Source"}
                                    </p>
                                    <p className="text-sm text-foreground leading-relaxed">
                                        {fc.evidence_text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Contradicting Evidence */}
                {contradictingEvidence.length > 0 && (
                    <div>
                        <label className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            Contradicting Evidence ({contradictingEvidence.length})
                        </label>
                        <div className="mt-2 space-y-2">
                            {contradictingEvidence.map((fc) => (
                                <div
                                    key={fc.id}
                                    className="p-2 rounded-md bg-red-500/5 border border-red-500/20"
                                >
                                    <p className="text-xs text-muted-foreground mb-1">
                                        From: {fc.source?.title || "Unknown Source"}
                                    </p>
                                    <p className="text-sm text-foreground leading-relaxed">
                                        {fc.evidence_text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* No evidence message */}
                {relatedFactChecks.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                        No evidence linked to this claim yet.
                    </div>
                )}
            </div>
        </div>
    );
}

// Memoize for performance
export const ClaimDetailPanel = memo(ClaimDetailPanelComponent);
