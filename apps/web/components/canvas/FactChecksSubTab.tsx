"use client";

import type { Claim } from "@/lib/drizzle/schema";
import type { FactCheckWithSource } from "@/app/actions/canvas";
import { EvidenceCard } from "./EvidenceCard";

interface FactChecksSubTabProps {
    factChecks: FactCheckWithSource[];
    claims: Claim[];
    isLoading: boolean;
}

/**
 * Group fact checks by claim ID
 */
function groupByClaimId(
    factChecks: FactCheckWithSource[]
): Map<string, FactCheckWithSource[]> {
    const groups = new Map<string, FactCheckWithSource[]>();

    for (const fc of factChecks) {
        const existing = groups.get(fc.claim_id) || [];
        existing.push(fc);
        groups.set(fc.claim_id, existing);
    }

    return groups;
}

/**
 * Fact Checks Sub-Tab - Displays evidence grouped by claim
 */
export function FactChecksSubTab({
    factChecks,
    claims,
    isLoading,
}: FactChecksSubTabProps): React.JSX.Element {
    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-sm">Loading fact checks...</p>
                </div>
            </div>
        );
    }

    if (factChecks.length === 0) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <div className="text-center text-muted-foreground max-w-sm">
                    <div className="text-3xl mb-3">✓</div>
                    <h3 className="text-base font-medium mb-1">No Fact Checks Yet</h3>
                    <p className="text-sm">
                        Evidence will appear here as the agent verifies claims
                        against sources.
                    </p>
                </div>
            </div>
        );
    }

    // Group fact checks by claim
    const groupedFactChecks = groupByClaimId(factChecks);

    // Create a map for claim text lookup
    const claimTextMap = new Map(claims.map((c) => [c.id, c.claim_text]));

    return (
        <div className="h-full overflow-y-auto p-4">
            <div className="space-y-6">
                {Array.from(groupedFactChecks.entries()).map(([claimId, evidence]) => (
                    <div key={claimId} className="space-y-3">
                        {/* Claim Header */}
                        <div className="border-l-2 border-primary pl-3">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                Claim
                            </p>
                            <p className="text-sm text-foreground">
                                {claimTextMap.get(claimId) || "Unknown claim"}
                            </p>
                        </div>

                        {/* Evidence Cards */}
                        <div className="pl-4 space-y-2">
                            {evidence.map((fc) => (
                                <EvidenceCard key={fc.id} evidence={fc} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
