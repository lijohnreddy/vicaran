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
} from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { getInvestigation } from "@/lib/queries/investigations";

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
        source_id: z.string().uuid(),
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
        event_date: z.string().datetime(), // ISO 8601 format
        event_text: z.string(),
        source_id: z.string().uuid().optional(),
    }),
});

const summaryUpdatedSchema = z.object({
    type: z.literal("SUMMARY_UPDATED"),
    investigation_id: z.string().uuid(),
    data: z.object({
        summary: z.string(),
        overall_bias_score: z.number().min(0).max(5).optional(), // 0.00-5.00
    }),
});

const investigationCompleteSchema = z.object({
    type: z.literal("INVESTIGATION_COMPLETE"),
    investigation_id: z.string().uuid(),
    data: z.object({
        summary: z.string(),
        overall_bias_score: z.number().min(0).max(5).optional(),
    }),
});

const investigationFailedSchema = z.object({
    type: z.literal("INVESTIGATION_FAILED"),
    investigation_id: z.string().uuid(),
    data: z.object({
        error_message: z.string(),
    }),
});

export async function POST(request: NextRequest) {
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

        // Verify investigation exists (user clarification requirement)
        if (investigationId) {
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
                            content_snippet: payload.data.content_snippet,
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
                    const [factCheck] = await db
                        .insert(factChecks)
                        .values({
                            claim_id: payload.data.claim_id,
                            source_id: payload.data.source_id,
                            evidence_type: payload.data.evidence_type,
                            evidence_text: payload.data.evidence_text,
                        })
                        .returning();

                    // Update claim evidence count
                    const [existingClaim] = await db
                        .select()
                        .from(claims)
                        .where(eq(claims.id, payload.data.claim_id))
                        .limit(1);

                    if (existingClaim) {
                        await db
                            .update(claims)
                            .set({
                                evidence_count: existingClaim.evidence_count + 1,
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
                    const [event] = await db
                        .insert(timelineEvents)
                        .values({
                            investigation_id: payload.investigation_id,
                            event_date: new Date(payload.data.event_date),
                            event_text: payload.data.event_text,
                            source_id: payload.data.source_id,
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
                            overall_bias_score: payload.data.overall_bias_score?.toFixed(2),
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
                            overall_bias_score: payload.data.overall_bias_score?.toFixed(2),
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
