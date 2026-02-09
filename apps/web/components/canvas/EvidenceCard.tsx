"use client";

import type { FactCheckWithSource } from "@/app/actions/canvas";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface EvidenceCardProps {
    evidence: FactCheckWithSource;
}

/**
 * Evidence type configuration
 */
const evidenceConfig = {
    supporting: {
        icon: "✅",
        label: "SUPPORTING",
        bgColor: "bg-green-500/10",
        textColor: "text-green-600 dark:text-green-400",
        borderColor: "border-green-500/30",
    },
    contradicting: {
        icon: "❌",
        label: "CONTRADICTING",
        bgColor: "bg-red-500/10",
        textColor: "text-red-600 dark:text-red-400",
        borderColor: "border-red-500/30",
    },
};

/**
 * Evidence Card - Individual fact check evidence display
 */
export function EvidenceCard({ evidence }: EvidenceCardProps): React.JSX.Element {
    const config = evidenceConfig[evidence.evidence_type];
    const sourceTitle = evidence.source?.title || evidence.source?.url || "Unknown source";

    // Truncate evidence text
    const truncatedText = evidence.evidence_text.length > 150
        ? evidence.evidence_text.substring(0, 150) + "..."
        : evidence.evidence_text;

    return (
        <div
            className={cn(
                "rounded-md border p-3 text-sm",
                config.bgColor,
                config.borderColor
            )}
        >
            {/* Evidence Type Badge */}
            <div className={cn("flex items-center gap-1.5 mb-2", config.textColor)}>
                <span>{config.icon}</span>
                <span className="text-xs font-medium">{config.label}</span>
            </div>

            {/* Evidence Text */}
            <p className="text-foreground mb-2">{truncatedText}</p>

            {/* Source Attribution */}
            {evidence.source && (
                <a
                    href={evidence.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary hover:underline"
                >
                    <span className="truncate max-w-[200px]">{sourceTitle}</span>
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                </a>
            )}
        </div>
    );
}
