import { pgTable, text, timestamp, uuid, index, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { InferSelectModel } from "drizzle-orm";
import { claims } from "./claims";
import { sources } from "./sources";

// Enum for evidence type
export const evidenceTypeEnum = pgEnum("evidence_type", ["supporting", "contradicting"]);

// Fact-Checks table - stores evidence linking claims to sources
export const factChecks = pgTable(
    "fact_checks",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        claim_id: uuid("claim_id")
            .references(() => claims.id, { onDelete: "cascade" })
            .notNull(),
        source_id: uuid("source_id")
            .references(() => sources.id, { onDelete: "cascade" })
            .notNull(),
        evidence_type: evidenceTypeEnum("evidence_type").notNull(),
        evidence_text: text("evidence_text").notNull(), // Excerpt from source
        created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    },
    (t) => [
        index("fact_checks_claim_id_idx").on(t.claim_id),
        index("fact_checks_source_id_idx").on(t.source_id),
    ]
);

// Zod schemas for validation
export const insertFactCheckSchema = createInsertSchema(factChecks);
export const selectFactCheckSchema = createSelectSchema(factChecks);

// TypeScript types
export type FactCheck = InferSelectModel<typeof factChecks>;
export type InsertFactCheck = typeof factChecks.$inferInsert;
