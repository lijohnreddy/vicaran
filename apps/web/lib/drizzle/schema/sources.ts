import { pgTable, text, timestamp, uuid, index, integer, boolean, unique } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { InferSelectModel } from "drizzle-orm";
import { investigations } from "./investigations";

// Sources table - stores investigation sources (URLs, articles, documents)
export const sources = pgTable(
    "sources",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        investigation_id: uuid("investigation_id")
            .references(() => investigations.id, { onDelete: "cascade" })
            .notNull(),
        url: text("url").notNull(),
        title: text("title"), // Extracted from page
        content_snippet: text("content_snippet"), // Preview of content
        credibility_score: integer("credibility_score"), // 1-5 stars
        bias_score: text("bias_score"), // 0.00-10.00 scale (stored as text to support decimal precision)
        is_user_provided: boolean("is_user_provided").default(false).notNull(), // TRUE: user added, FALSE: agent discovered
        analyzed_at: timestamp("analyzed_at", { withTimezone: true }), // Set AFTER agent analysis complete, NULL during processing
        created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    },
    (t) => [
        index("sources_investigation_id_idx").on(t.investigation_id),
        // Unique constraint: one URL per investigation (prevents duplicate sources)
        unique("sources_investigation_url_unique").on(t.investigation_id, t.url),
    ]
);

// Zod schemas for validation
export const insertSourceSchema = createInsertSchema(sources);
export const selectSourceSchema = createSelectSchema(sources);

// TypeScript types
export type Source = InferSelectModel<typeof sources>;
export type InsertSource = typeof sources.$inferInsert;
