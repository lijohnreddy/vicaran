import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/drizzle/db";
import {
    sources,
    claims,
    claimSources,
    factChecks,
    timelineEvents,
    investigations,
    users,
} from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";

// Validate shared secret authentication
function validateAuth(request: NextRequest): boolean {
    const secret = request.headers.get("X-Agent-Secret");
    return secret === process.env.AGENT_SECRET;
}

// Callback type schemas with Zod validation
const sourceFoundSchema = z.object({
    type: z.literal("SOURCE_FOUND"),
    investigation_id: z.string().uuid(),
    data: z.object({
        url: z.string().url(),
        title: z.string().optional(),
        content_snippet: z.string().optional(),
        summary: z.string().optional(), // Agent sends "summary" as alias for content_snippet
        key_claims: z.array(z.string()).optional(), // Agent sends extracted claims
        credibility_score: z.number().int().min(1).max(5).optional(),
        is_user_provided: z.boolean().default(false),
    }),
});

const claimExtractedSchema = z.object({
    type: z.literal("CLAIM_EXTRACTED"),
    investigation_id: z.string().uuid(),
    data: z.object({
        claim_text: z.string(),
        source_ids: z.array(z.string().uuid()).optional(), // Sources that mention this claim
    }),
});

const factCheckedSchema = z.object({
    type: z.literal("FACT_CHECKED"),
    investigation_id: z.string().uuid(),
    data: z.object({
        claim_id: z.string().uuid(),
        source_id: z.string().uuid().optional(), // Optional: fact_checker may not have a DB source_id for evidence
        evidence_type: z.enum(["supporting", "contradicting"]),
        evidence_text: z.string(),
    }),
});

const biasAnalyzedSchema = z.object({
    type: z.literal("BIAS_ANALYZED"),
    investigation_id: z.string().uuid(),
    data: z.object({
        source_id: z.string().uuid(),
        bias_score: z.number().min(0).max(10), // 0.00-10.00
    }),
});

const timelineEventSchema = z.object({
    type: z.literal("TIMELINE_EVENT"),
    investigation_id: z.string().uuid(),
    data: z.object({
        // Accept date-only (2024-12-31) or full datetime (2024-12-31T00:00:00Z)
        event_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        }),
        event_text: z.string(),
        // Accept both singular source_id or source_ids array (agent sends array)
        source_id: z.string().uuid().optional(),
        source_ids: z.array(z.string().uuid()).optional(),
    }),
});

const summaryUpdatedSchema = z.object({
    type: z.literal("SUMMARY_UPDATED"),
    investigation_id: z.string().uuid(),
    data: z.object({
        summary: z.string(),
        overall_bias_score: z.number().min(0).max(5).nullable().optional(), // 0.00-5.00
    }),
});

const investigationCompleteSchema = z.object({
    type: z.literal("INVESTIGATION_COMPLETE"),
    investigation_id: z.string().uuid(),
    data: z.object({
        summary: z.string(),
        overall_bias_score: z.number().min(0).max(5).nullable().optional(),
    }),
});

// NEW: INVESTIGATION_STARTED callback schema
const investigationStartedSchema = z.object({
    type: z.literal("INVESTIGATION_STARTED"),
    investigation_id: z.string().uuid(),
    data: z.object({}).optional(), // No additional data required
});

// NEW: INVESTIGATION_PARTIAL callback schema (graceful degradation)
const investigationPartialSchema = z.object({
    type: z.literal("INVESTIGATION_PARTIAL"),
    investigation_id: z.string().uuid(),
    data: z.object({
        summary: z.string(), // Partial findings
        partial_reason: z.string(), // Why it couldn't complete (timeout, rate limit, etc.)
        overall_bias_score: z.number().min(0).max(5).nullable().optional(),
    }),
});

const investigationFailedSchema = z.object({
    type: z.literal("INVESTIGATION_FAILED"),
    investigation_id: z.string().uuid(),
    data: z.object({
        error_message: z.string(),
    }),
});

export async function POST(request: NextRequest): Promise<Response> {
    try {
        // Authentication check
        if (!validateAuth(request)) {
            return NextResponse.json(
                { error: "Unauthorized - Invalid agent secret" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const callbackType = body.type;
        const investigationId = body.investigation_id;

        // Verify investigation exists (skip for INVESTIGATION_STARTED which can create new ones)
        if (investigationId && callbackType !== "INVESTIGATION_STARTED") {
            // We don't have user_id in callback, so just check if investigation exists
            const [investigation] = await db
                .select()
                .from(investigations)
                .where(eq(investigations.id, investigationId))
                .limit(1);

            if (!investigation) {
                return NextResponse.json(
                    { error: "Investigation not found" },
                    { status: 404 }
                );
            }
        }

        // Route to appropriate handler based on callback type
        switch (callbackType) {
            case "SOURCE_FOUND": {
                const payload = sourceFoundSchema.parse(body);

                try {
                    // UPSERT: Use onConflictDoUpdate to handle duplicate URLs (user clarification)
                    const [source] = await db
                        .insert(sources)
                        .values({
                            investigation_id: payload.investigation_id,
                            url: payload.data.url,
                            title: payload.data.title,
                            // Agent sends "summary" instead of "content_snippet" — use as fallback
                            content_snippet: payload.data.content_snippet || payload.data.summary,
                            credibility_score: payload.data.credibility_score,
                            is_user_provided: payload.data.is_user_provided,
                        })
                        .onConflictDoUpdate({
                            target: [sources.investigation_id, sources.url],
                            set: {
                                title: payload.data.title,
                                content_snippet: payload.data.content_snippet,
                                credibility_score: payload.data.credibility_score,
                            },
                        })
                        .returning();

                    return NextResponse.json({ success: true, source_id: source.id });
                } catch (error) {
                    // Log error but don't break agent pipeline (user clarification)
                    console.error("SOURCE_FOUND callback error:", error);
                    return NextResponse.json({
                        success: true,
                        warning: error instanceof Error ? error.message : "Unknown error",
                    });
                }
            }

            case "CLAIM_EXTRACTED": {
                const payload = claimExtractedSchema.parse(body);

                try {
                    const [claim] = await db
                        .insert(claims)
                        .values({
                            investigation_id: payload.investigation_id,
                            claim_text: payload.data.claim_text,
                        })
                        .returning();

                    // Link claim to sources if provided
                    if (payload.data.source_ids && payload.data.source_ids.length > 0) {
                        await db.insert(claimSources).values(
                            payload.data.source_ids.map((source_id) => ({
                                claim_id: claim.id,
                                source_id,
                            }))
                        );
                    }

                    return NextResponse.json({ success: true, claim_id: claim.id });
                } catch (error) {
                    console.error("CLAIM_EXTRACTED callback error:", error);
                    return NextResponse.json({
                        success: true,
                        warning: error instanceof Error ? error.message : "Unknown error",
                    });
                }
            }

            case "FACT_CHECKED": {
                const payload = factCheckedSchema.parse(body);

                try {
                    // Resolve source_id: use provided or fall back to claim's first linked source
                    let resolvedSourceId = payload.data.source_id;
                    if (!resolvedSourceId) {
                        const [linkedSource] = await db
                            .select({ source_id: claimSources.source_id })
                            .from(claimSources)
                            .where(eq(claimSources.claim_id, payload.data.claim_id))
                            .limit(1);
                        resolvedSourceId = linkedSource?.source_id;
                    }

                    if (!resolvedSourceId) {
                        return NextResponse.json({
                            success: true,
                            warning: "No source_id available for fact check — skipping DB insert",
                        });
                    }

                    const [factCheck] = await db
                        .insert(factChecks)
                        .values({
                            claim_id: payload.data.claim_id,
                            source_id: resolvedSourceId,
                            evidence_type: payload.data.evidence_type,
                            evidence_text: payload.data.evidence_text,
                        })
                        .returning();

                    // Get existing claim to update
                    const [existingClaim] = await db
                        .select()
                        .from(claims)
                        .where(eq(claims.id, payload.data.claim_id))
                        .limit(1);

                    if (existingClaim) {
                        // Determine new claim status based on evidence
                        // Rule: Any contradicting evidence → "contradicted"
                        //       Otherwise if we have supporting → "verified"
                        let newStatus = existingClaim.status;

                        if (payload.data.evidence_type === "contradicting") {
                            // Contradicting evidence always sets status to contradicted
                            newStatus = "contradicted";
                        } else if (
                            payload.data.evidence_type === "supporting" &&
                            existingClaim.status === "unverified"
                        ) {
                            // Supporting evidence promotes from unverified to verified
                            // (but doesn't override if already contradicted)
                            newStatus = "verified";
                        }

                        await db
                            .update(claims)
                            .set({
                                evidence_count: existingClaim.evidence_count + 1,
                                status: newStatus,
                                updated_at: new Date(),
                            })
                            .where(eq(claims.id, payload.data.claim_id));
                    }

                    return NextResponse.json({ success: true, fact_check_id: factCheck.id });
                } catch (error) {
                    console.error("FACT_CHECKED callback error:", error);
                    return NextResponse.json({
                        success: true,
                        warning: error instanceof Error ? error.message : "Unknown error",
                    });
                }
            }

            case "BIAS_ANALYZED": {
                const payload = biasAnalyzedSchema.parse(body);

                try {
                    await db
                        .update(sources)
                        .set({
                            bias_score: payload.data.bias_score.toFixed(2), // Store as text with 2 decimal places
                            analyzed_at: new Date(), // Set analyzed_at when analysis completes (user clarification)
                        })
                        .where(eq(sources.id, payload.data.source_id));

                    return NextResponse.json({ success: true });
                } catch (error) {
                    console.error("BIAS_ANALYZED callback error:", error);
                    return NextResponse.json({
                        success: true,
                        warning: error instanceof Error ? error.message : "Unknown error",
                    });
                }
            }

            case "TIMELINE_EVENT": {
                const payload = timelineEventSchema.parse(body);

                try {
                    // Use source_id or first element from source_ids array
                    const sourceId = payload.data.source_id || payload.data.source_ids?.[0];

                    const [event] = await db
                        .insert(timelineEvents)
                        .values({
                            investigation_id: payload.investigation_id,
                            event_date: new Date(payload.data.event_date),
                            event_text: payload.data.event_text,
                            source_id: sourceId,
                        })
                        .returning();

                    return NextResponse.json({ success: true, event_id: event.id });
                } catch (error) {
                    console.error("TIMELINE_EVENT callback error:", error);
                    return NextResponse.json({
                        success: true,
                        warning: error instanceof Error ? error.message : "Unknown error",
                    });
                }
            }

            case "SUMMARY_UPDATED": {
                const payload = summaryUpdatedSchema.parse(body);

                try {
                    await db
                        .update(investigations)
                        .set({
                            summary: payload.data.summary,
                            overall_bias_score: payload.data.overall_bias_score != null ? payload.data.overall_bias_score.toFixed(2) : undefined,
                            updated_at: new Date(),
                        })
                        .where(eq(investigations.id, payload.investigation_id));

                    return NextResponse.json({ success: true });
                } catch (error) {
                    console.error("SUMMARY_UPDATED callback error:", error);
                    return NextResponse.json({
                        success: true,
                        warning: error instanceof Error ? error.message : "Unknown error",
                    });
                }
            }

            case "INVESTIGATION_COMPLETE": {
                const payload = investigationCompleteSchema.parse(body);

                try {
                    await db
                        .update(investigations)
                        .set({
                            status: "completed",
                            summary: payload.data.summary,
                            overall_bias_score: payload.data.overall_bias_score != null ? payload.data.overall_bias_score.toFixed(2) : undefined,
                            updated_at: new Date(),
                        })
                        .where(eq(investigations.id, payload.investigation_id));

                    return NextResponse.json({ success: true });
                } catch (error) {
                    console.error("INVESTIGATION_COMPLETE callback error:", error);
                    return NextResponse.json({
                        success: true,
                        warning: error instanceof Error ? error.message : "Unknown error",
                    });
                }
            }

            // INVESTIGATION_STARTED - Agent started processing
            // Supports both: (1) Frontend-first flow (update existing) and (2) ADK-only mode (create new)
            case "INVESTIGATION_STARTED": {
                const payload = investigationStartedSchema.parse(body);

                try {
                    // Check if investigation already exists (Frontend-first flow)
                    const [existingInvestigation] = await db
                        .select()
                        .from(investigations)
                        .where(eq(investigations.id, payload.investigation_id))
                        .limit(1);

                    if (existingInvestigation) {
                        // Update existing investigation (normal frontend flow)
                        await db
                            .update(investigations)
                            .set({
                                status: "active",
                                started_at: new Date(),
                                updated_at: new Date(),
                            })
                            .where(eq(investigations.id, payload.investigation_id));
                    } else {
                        // Create new investigation (ADK-only mode - for testing)
                        // Get a default user for the FK constraint
                        const [defaultUser] = await db.select().from(users).limit(1);

                        if (!defaultUser) {
                            return NextResponse.json(
                                { error: "No users found in database. Please create a user first." },
                                { status: 400 }
                            );
                        }

                        await db.insert(investigations).values({
                            id: payload.investigation_id,
                            user_id: defaultUser.id,
                            session_id: payload.investigation_id, // Use investigation_id as session_id for ADK-only mode
                            title: "ADK Investigation",
                            brief: "Investigation started from ADK Web UI",
                            mode: "quick",
                            status: "active",
                            started_at: new Date(),
                        });
                    }

                    return NextResponse.json({ success: true });
                } catch (error) {
                    console.error("INVESTIGATION_STARTED callback error:", error);
                    return NextResponse.json({
                        success: true,
                        warning: error instanceof Error ? error.message : "Unknown error",
                    });
                }
            }

            // NEW: INVESTIGATION_PARTIAL - Graceful degradation (agent has partial results)
            case "INVESTIGATION_PARTIAL": {
                const payload = investigationPartialSchema.parse(body);

                try {
                    await db
                        .update(investigations)
                        .set({
                            status: "partial",
                            summary: payload.data.summary,
                            partial_reason: payload.data.partial_reason,
                            overall_bias_score: payload.data.overall_bias_score != null ? payload.data.overall_bias_score.toFixed(2) : undefined,
                            updated_at: new Date(),
                        })
                        .where(eq(investigations.id, payload.investigation_id));

                    return NextResponse.json({ success: true });
                } catch (error) {
                    console.error("INVESTIGATION_PARTIAL callback error:", error);
                    return NextResponse.json({
                        success: true,
                        warning: error instanceof Error ? error.message : "Unknown error",
                    });
                }
            }

            case "INVESTIGATION_FAILED": {
                const payload = investigationFailedSchema.parse(body);

                try {
                    await db
                        .update(investigations)
                        .set({
                            status: "failed",
                            updated_at: new Date(),
                        })
                        .where(eq(investigations.id, payload.investigation_id));

                    return NextResponse.json({ success: true });
                } catch (error) {
                    console.error("INVESTIGATION_FAILED callback error:", error);
                    return NextResponse.json({
                        success: true,
                        warning: error instanceof Error ? error.message : "Unknown error",
                    });
                }
            }

            default:
                return NextResponse.json(
                    { error: `Unknown callback type: ${callbackType}` },
                    { status: 400 }
                );
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation failed", details: error.errors },
                { status: 400 }
            );
        }

        console.error("Agent callback error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
