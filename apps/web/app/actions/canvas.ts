"use server";

import { db } from "@/lib/drizzle/db";
import {
    investigations,
    sources,
    claims,
    factChecks,
    timelineEvents,
    type Source,
    type Claim,
    type FactCheck,
    type TimelineEvent,
} from "@/lib/drizzle/schema";
import { eq, and, desc, asc } from "drizzle-orm";

// ============================================================================
// Types for canvas data responses
// ============================================================================

export interface CanvasSummaryResponse {
    success: boolean;
    data?: {
        summary: string | null;
        overallBiasScore: string | null;
    };
    error?: string;
}

export interface CanvasSourcesResponse {
    success: boolean;
    data?: Source[];
    error?: string;
}

export interface CanvasClaimsResponse {
    success: boolean;
    data?: Claim[];
    error?: string;
}

export interface FactCheckWithSource extends FactCheck {
    source: {
        id: string;
        url: string;
        title: string | null;
    } | null;
}

export interface CanvasFactChecksResponse {
    success: boolean;
    data?: FactCheckWithSource[];
    error?: string;
}

export interface TimelineEventWithSource extends TimelineEvent {
    source: {
        id: string;
        url: string;
        title: string | null;
    } | null;
}

export interface CanvasTimelineResponse {
    success: boolean;
    data?: TimelineEventWithSource[];
    error?: string;
}

// ============================================================================
// Server Actions - Called from client with polling
// ============================================================================

/**
 * Get investigation summary for Brief tab
 */
export async function getInvestigationSummary(
    investigationId: string,
    userId: string
): Promise<CanvasSummaryResponse> {
    try {
        const [investigation] = await db
            .select({
                summary: investigations.summary,
                overallBiasScore: investigations.overall_bias_score,
            })
            .from(investigations)
            .where(
                and(
                    eq(investigations.id, investigationId),
                    eq(investigations.user_id, userId)
                )
            )
            .limit(1);

        if (!investigation) {
            return { success: false, error: "Investigation not found" };
        }

        return {
            success: true,
            data: {
                summary: investigation.summary,
                overallBiasScore: investigation.overallBiasScore,
            },
        };
    } catch (error) {
        console.error("[getInvestigationSummary] Error:", error);
        return { success: false, error: "Failed to fetch summary" };
    }
}

/**
 * Get sources for Sources sub-tab, ordered by credibility score (highest first)
 */
export async function getInvestigationSources(
    investigationId: string,
    userId: string
): Promise<CanvasSourcesResponse> {
    try {
        // First verify the investigation belongs to the user
        const [investigation] = await db
            .select({ id: investigations.id })
            .from(investigations)
            .where(
                and(
                    eq(investigations.id, investigationId),
                    eq(investigations.user_id, userId)
                )
            )
            .limit(1);

        if (!investigation) {
            return { success: false, error: "Investigation not found" };
        }

        const sourceList = await db
            .select()
            .from(sources)
            .where(eq(sources.investigation_id, investigationId))
            .orderBy(desc(sources.credibility_score));

        return { success: true, data: sourceList };
    } catch (error) {
        console.error("[getInvestigationSources] Error:", error);
        return { success: false, error: "Failed to fetch sources" };
    }
}

/**
 * Get claims for Claims sub-tab
 */
export async function getInvestigationClaims(
    investigationId: string,
    userId: string
): Promise<CanvasClaimsResponse> {
    try {
        // Verify access
        const [investigation] = await db
            .select({ id: investigations.id })
            .from(investigations)
            .where(
                and(
                    eq(investigations.id, investigationId),
                    eq(investigations.user_id, userId)
                )
            )
            .limit(1);

        if (!investigation) {
            return { success: false, error: "Investigation not found" };
        }

        const claimList = await db
            .select()
            .from(claims)
            .where(eq(claims.investigation_id, investigationId))
            .orderBy(claims.created_at);

        return { success: true, data: claimList };
    } catch (error) {
        console.error("[getInvestigationClaims] Error:", error);
        return { success: false, error: "Failed to fetch claims" };
    }
}

/**
 * Get fact checks for Fact Checks sub-tab, with source info for display
 */
export async function getInvestigationFactChecks(
    investigationId: string,
    userId: string
): Promise<CanvasFactChecksResponse> {
    try {
        // Verify access
        const [investigation] = await db
            .select({ id: investigations.id })
            .from(investigations)
            .where(
                and(
                    eq(investigations.id, investigationId),
                    eq(investigations.user_id, userId)
                )
            )
            .limit(1);

        if (!investigation) {
            return { success: false, error: "Investigation not found" };
        }

        // Get fact checks with source info via join
        // First get all claims for investigation
        const investigationClaims = await db
            .select({ id: claims.id })
            .from(claims)
            .where(eq(claims.investigation_id, investigationId));

        const claimIds = investigationClaims.map((c) => c.id);

        if (claimIds.length === 0) {
            return { success: true, data: [] };
        }

        // For multiple claims, we need to combine results
        const allFactChecks: FactCheckWithSource[] = [];

        for (const claimId of claimIds) {
            const results = await db
                .select({
                    factCheck: factChecks,
                    source: {
                        id: sources.id,
                        url: sources.url,
                        title: sources.title,
                    },
                })
                .from(factChecks)
                .leftJoin(sources, eq(factChecks.source_id, sources.id))
                .where(eq(factChecks.claim_id, claimId));

            for (const row of results) {
                allFactChecks.push({
                    ...row.factCheck,
                    source: row.source,
                });
            }
        }

        return { success: true, data: allFactChecks };
    } catch (error) {
        console.error("[getInvestigationFactChecks] Error:", error);
        return { success: false, error: "Failed to fetch fact checks" };
    }
}

/**
 * Get timeline events for Timeline sub-tab, ordered chronologically
 */
export async function getInvestigationTimeline(
    investigationId: string,
    userId: string
): Promise<CanvasTimelineResponse> {
    try {
        // Verify access
        const [investigation] = await db
            .select({ id: investigations.id })
            .from(investigations)
            .where(
                and(
                    eq(investigations.id, investigationId),
                    eq(investigations.user_id, userId)
                )
            )
            .limit(1);

        if (!investigation) {
            return { success: false, error: "Investigation not found" };
        }

        // Get timeline events with source info
        const events = await db
            .select({
                event: timelineEvents,
                source: {
                    id: sources.id,
                    url: sources.url,
                    title: sources.title,
                },
            })
            .from(timelineEvents)
            .leftJoin(sources, eq(timelineEvents.source_id, sources.id))
            .where(eq(timelineEvents.investigation_id, investigationId))
            .orderBy(asc(timelineEvents.event_date));

        const formattedEvents: TimelineEventWithSource[] = events.map((row) => ({
            ...row.event,
            source: row.source,
        }));

        return { success: true, data: formattedEvents };
    } catch (error) {
        console.error("[getInvestigationTimeline] Error:", error);
        return { success: false, error: "Failed to fetch timeline" };
    }
}
