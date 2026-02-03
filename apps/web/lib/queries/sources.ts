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
