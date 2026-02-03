import { db } from "@/lib/drizzle/db";
import { claims, type Claim, type InsertClaim } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Create a new claim
 */
export async function createClaim(data: InsertClaim): Promise<Claim> {
    const [claim] = await db.insert(claims).values(data).returning();
    return claim;
}

/**
 * Get all claims for an investigation, ordered by creation time
 */
export async function getClaimsByInvestigation(investigationId: string): Promise<Claim[]> {
    return await db
        .select()
        .from(claims)
        .where(eq(claims.investigation_id, investigationId))
        .orderBy(claims.created_at);
}

/**
 * Update claim verification status
 * Returns null if claim doesn't exist
 */
export async function updateClaimStatus(
    claimId: string,
    status: "verified" | "unverified" | "contradicted"
): Promise<Claim | null> {
    const [updated] = await db
        .update(claims)
        .set({ status, updated_at: new Date() })
        .where(eq(claims.id, claimId))
        .returning();

    return updated || null;
}
