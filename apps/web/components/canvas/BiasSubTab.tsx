"use client";

import type { Source } from "@/lib/drizzle/schema";
import { cn } from "@/lib/utils";

interface BiasSubTabProps {
    sources: Source[];
    overallBiasScore: string | null;
    isLoading: boolean;
}

/**
 * Parse bias score string to number (0-10 scale for display)
 * Database stores 0-5 scale, so we multiply by 2 for display
 */
function parseBiasScore(score: string | null): number | null {
    if (!score) return null;
    const parsed = parseFloat(score);
    if (isNaN(parsed)) return null;
    // Convert from 0-5 (database) to 0-10 (display) scale
    return parsed * 2;
}

/**
 * Get bias level description
 */
function getBiasLevel(score: number): { label: string; color: string } {
    if (score <= 2) return { label: "Low Bias", color: "text-green-600 dark:text-green-400" };
    if (score <= 4) return { label: "Low-Moderate Bias", color: "text-lime-600 dark:text-lime-400" };
    if (score <= 6) return { label: "Moderate Bias", color: "text-yellow-600 dark:text-yellow-400" };
    if (score <= 8) return { label: "High Bias", color: "text-orange-600 dark:text-orange-400" };
    return { label: "Very High Bias", color: "text-red-600 dark:text-red-400" };
}

/**
 * Bias Sub-Tab - Displays overall bias score with progress bar
 */
export function BiasSubTab({
    sources,
    overallBiasScore,
    isLoading,
}: BiasSubTabProps): React.JSX.Element {
    const biasScore = parseBiasScore(overallBiasScore);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-sm">Loading bias analysis...</p>
                </div>
            </div>
        );
    }

    if (biasScore === null) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <div className="text-center text-muted-foreground max-w-sm">
                    <div className="text-3xl mb-3">⚖️</div>
                    <h3 className="text-base font-medium mb-1">No Bias Analysis Yet</h3>
                    <p className="text-sm">
                        Bias analysis will appear here once the agent has analyzed
                        source coverage and framing.
                    </p>
                </div>
            </div>
        );
    }

    const biasLevel = getBiasLevel(biasScore);
    const percentage = (biasScore / 10) * 100;

    // Count sources with bias scores
    const sourcesWithBias = sources.filter((s) => s.bias_score !== null);

    return (
        <div className="h-full overflow-y-auto p-6">
            {/* Overall Score Section */}
            <div className="mb-8">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                    Overall Investigation Bias
                </h3>

                {/* Score Display */}
                <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-4xl font-bold text-foreground">
                        {biasScore.toFixed(1)}
                    </span>
                    <span className="text-lg text-muted-foreground">/10</span>
                </div>

                {/* Progress Bar */}
                <div className="relative h-3 bg-muted rounded-full overflow-hidden mb-2">
                    <div
                        className={cn(
                            "absolute inset-y-0 left-0 rounded-full transition-all duration-500",
                            biasScore <= 3 ? "bg-green-500" :
                                biasScore <= 5 ? "bg-yellow-500" :
                                    biasScore <= 7 ? "bg-orange-500" : "bg-red-500"
                        )}
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                {/* Scale Labels */}
                <div className="flex justify-between text-xs text-muted-foreground mb-4">
                    <span>Low Bias</span>
                    <span>High Bias</span>
                </div>

                {/* Bias Level Label */}
                <p className={cn("text-sm font-medium", biasLevel.color)}>
                    {biasLevel.label}
                </p>
            </div>

            {/* Per-Source Bias Indicators */}
            {sourcesWithBias.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                        Source Bias Indicators ({sourcesWithBias.length})
                    </h3>
                    <div className="space-y-2">
                        {sourcesWithBias.slice(0, 10).map((source) => {
                            const sourceScore = parseBiasScore(source.bias_score);
                            if (sourceScore === null) return null;

                            const domain = (() => {
                                try {
                                    return new URL(source.url).hostname.replace("www.", "");
                                } catch {
                                    return source.url;
                                }
                            })();

                            return (
                                <div
                                    key={source.id}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <span className="truncate text-muted-foreground">
                                        {source.title || domain}
                                    </span>
                                    <span className="text-foreground font-medium">
                                        {sourceScore.toFixed(1)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
