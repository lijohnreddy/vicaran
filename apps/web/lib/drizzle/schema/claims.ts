import { pgTable, text, timestamp, uuid, index, pgEnum, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { InferSelectModel } from "drizzle-orm";
import { investigations } from "./investigations";

// Enum for claim verification status
export const claimStatusEnum = pgEnum("claim_status", [
    "verified",
    "unverified",
    "contradicted"
]);

// Claims table - stores extracted claims from investigation
export const claims = pgTable(
    "claims",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        investigation_id: uuid("investigation_id")
            .references(() => investigations.id, { onDelete: "cascade" })
            .notNull(),
        claim_text: text("claim_text").notNull(),
        status: claimStatusEnum("status").default("unverified").notNull(),
        evidence_count: integer("evidence_count").default(0).notNull(),
        created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
        updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    },
    (t) => [
        index("claims_investigation_id_idx").on(t.investigation_id),
    ]
);

// Zod schemas for validation
export const insertClaimSchema = createInsertSchema(claims);
export const selectClaimSchema = createSelectSchema(claims);

// TypeScript types
export type Claim = InferSelectModel<typeof claims>;
export type InsertClaim = typeof claims.$inferInsert;
