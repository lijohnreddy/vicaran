import { db } from "@/lib/drizzle/db";
import { investigations, type Investigation, type InsertInvestigation } from "@/lib/drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

/**
 * Create a new investigation
 */
export async function createInvestigation(data: InsertInvestigation): Promise<Investigation> {
    const [investigation] = await db.insert(investigations).values(data).returning();
    return investigation;
}

/**
 * Get a single investigation by ID with user validation
 * Returns null if investigation doesn't exist or doesn't belong to user
 */
export async function getInvestigation(
    investigationId: string,
    userId: string
): Promise<Investigation | null> {
    const [investigation] = await db
        .select()
        .from(investigations)
        .where(
            and(
                eq(investigations.id, investigationId),
                eq(investigations.user_id, userId) // Security: user can only access their own
            )
        )
        .limit(1);

    return investigation || null;
}

/**
 * Update an investigation
 * Returns null if investigation doesn't exist or doesn't belong to user
 */
export async function updateInvestigation(
    investigationId: string,
    userId: string,
    data: Partial<Investigation>
): Promise<Investigation | null> {
    const [updated] = await db
        .update(investigations)
        .set({ ...data, updated_at: new Date() })
        .where(
            and(
                eq(investigations.id, investigationId),
                eq(investigations.user_id, userId)
            )
        )
        .returning();

    return updated || null;
}

/**
 * Get all investigations for a user, ordered by most recent first
 */
export async function getUserInvestigations(userId: string): Promise<Investigation[]> {
    return await db
        .select()
        .from(investigations)
        .where(eq(investigations.user_id, userId))
        .orderBy(desc(investigations.created_at));
}

/**
 * Delete an investigation (cascade deletes all related data)
 * Returns true if deleted, false if not found or doesn't belong to user
 */
export async function deleteInvestigation(
    investigationId: string,
    userId: string
): Promise<boolean> {
    const result = await db
        .delete(investigations)
        .where(
            and(
                eq(investigations.id, investigationId),
                eq(investigations.user_id, userId)
            )
        )
        .returning();

    return result.length > 0;
}
