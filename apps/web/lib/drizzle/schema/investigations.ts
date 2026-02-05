import { pgTable, text, timestamp, uuid, index, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { InferSelectModel } from "drizzle-orm";
import { users } from "./users";

// Enums for investigation mode and status
export const investigationModeEnum = pgEnum("investigation_mode", ["quick", "detailed"]);
export const investigationStatusEnum = pgEnum("investigation_status", [
    "pending",
    "active",
    "completed",
    "partial",  // NEW: Agent completed with partial results (graceful degradation)
    "failed"
]);

// Investigations table - stores investigation sessions
export const investigations = pgTable(
    "investigations",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        user_id: uuid("user_id")
            .references(() => users.id, { onDelete: "cascade" })
            .notNull(),
        session_id: text("session_id").notNull(), // ADK session ID - required for agent tracking
        title: text("title").notNull(),
        brief: text("brief").notNull(),
        mode: investigationModeEnum("mode").notNull(),
        status: investigationStatusEnum("status").default("pending").notNull(),
        summary: text("summary"), // Nullable - agent fills later via summary_writer
        overall_bias_score: text("overall_bias_score"), // 0.00-5.00 scale (average across sources)
        partial_reason: text("partial_reason"), // NEW: Why investigation completed partially (timeout, rate limit, etc.)
        created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
        started_at: timestamp("started_at", { withTimezone: true }), // NEW: When agent started processing
        updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    },
    (t) => [
        index("investigations_user_id_idx").on(t.user_id),
        index("investigations_status_idx").on(t.status),
    ]
);

// Zod schemas for validation
export const insertInvestigationSchema = createInsertSchema(investigations);
export const selectInvestigationSchema = createSelectSchema(investigations);

// TypeScript types
export type Investigation = InferSelectModel<typeof investigations>;
export type InsertInvestigation = typeof investigations.$inferInsert;
