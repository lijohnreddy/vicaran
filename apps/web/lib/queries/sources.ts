import { db } from "@/lib/drizzle/db";
import { sources, type Source, type InsertSource } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Create a new source
 */
export async function createSource(data: InsertSource): Promise<Source> {
    const [source] = await db.insert(sources).values(data).returning();
    return source;
}

/**
 * Get all sources for an investigation, ordered by creation time
 */
export async function getSourcesByInvestigation(investigationId: string): Promise<Source[]> {
    return await db
        .select()
        .from(sources)
        .where(eq(sources.investigation_id, investigationId))
        .orderBy(sources.created_at);
}

/**
 * Save initial user-provided source URLs for an investigation
 * Bulk inserts multiple sources, skipping any duplicates
 */
export async function saveInitialSources(
    investigationId: string,
    urls: string[]
): Promise<Source[]> {
    if (urls.length === 0) return [];

    const sourcesToInsert = urls.map((url) => ({
        investigation_id: investigationId,
        url: url.trim(),
        is_user_provided: true,
    }));

    // Using onConflictDoNothing to handle duplicates gracefully
    const inserted = await db
        .insert(sources)
        .values(sourcesToInsert)
        .onConflictDoNothing()
        .returning();

    return inserted;
}

