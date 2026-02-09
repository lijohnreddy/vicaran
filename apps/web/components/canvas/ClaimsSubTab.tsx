"use client";

import type { Claim } from "@/lib/drizzle/schema";
import { ClaimCard } from "./ClaimCard";

interface ClaimsSubTabProps {
    claims: Claim[];
    isLoading: boolean;
}

/**
 * Claims Sub-Tab - Displays claim cards with verification status
 */
export function ClaimsSubTab({
    claims,
    isLoading,
}: ClaimsSubTabProps): React.JSX.Element {
    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-sm">Loading claims...</p>
                </div>
            </div>
        );
    }

    if (claims.length === 0) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <div className="text-center text-muted-foreground max-w-sm">
                    <div className="text-3xl mb-3">💬</div>
                    <h3 className="text-base font-medium mb-1">No Claims Yet</h3>
                    <p className="text-sm">
                        Claims will be extracted from sources as the agent
                        analyzes the investigation.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-4">
            <div className="space-y-3">
                {claims.map((claim) => (
                    <ClaimCard key={claim.id} claim={claim} />
                ))}
            </div>
        </div>
    );
}
