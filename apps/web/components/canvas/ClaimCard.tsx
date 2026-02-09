"use client";

import type { Claim } from "@/lib/drizzle/schema";
import { cn } from "@/lib/utils";

interface ClaimCardProps {
    claim: Claim;
}

/**
 * Status configuration for claim display
 */
const statusConfig = {
    verified: {
        icon: "✅",
        label: "Verified",
        bgColor: "bg-green-500/10",
        textColor: "text-green-600 dark:text-green-400",
        borderColor: "border-green-500/30",
    },
    unverified: {
        icon: "❓",
        label: "Unverified",
        bgColor: "bg-yellow-500/10",
        textColor: "text-yellow-600 dark:text-yellow-400",
        borderColor: "border-yellow-500/30",
    },
    contradicted: {
        icon: "❌",
        label: "Contradicted",
        bgColor: "bg-red-500/10",
        textColor: "text-red-600 dark:text-red-400",
        borderColor: "border-red-500/30",
    },
};

/**
 * Claim Card - Individual claim display with status icon and color coding
 */
export function ClaimCard({ claim }: ClaimCardProps): React.JSX.Element {
    const config = statusConfig[claim.status];

    return (
        <div
            className={cn(
                "rounded-lg border p-4 transition-colors",
                config.bgColor,
                config.borderColor
            )}
        >
            {/* Status Badge */}
            <div className={cn("flex items-center gap-2 mb-2", config.textColor)}>
                <span className="text-base">{config.icon}</span>
                <span className="text-xs font-medium uppercase tracking-wide">
                    {config.label}
                </span>
            </div>

            {/* Claim Text */}
            <p className="text-sm text-foreground mb-3">{claim.claim_text}</p>

            {/* Evidence Count */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>Evidence: {claim.evidence_count}</span>
            </div>
        </div>
    );
}
