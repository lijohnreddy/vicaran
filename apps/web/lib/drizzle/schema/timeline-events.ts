import { pgTable, text, timestamp, uuid, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { InferSelectModel } from "drizzle-orm";
import { investigations } from "./investigations";
import { sources } from "./sources";

// Timeline Events table - stores chronological events in investigation
export const timelineEvents = pgTable(
    "timeline_events",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        investigation_id: uuid("investigation_id")
            .references(() => investigations.id, { onDelete: "cascade" })
            .notNull(),
        event_date: timestamp("event_date", { withTimezone: true }).notNull(),
        event_text: text("event_text").notNull(),
        source_id: uuid("source_id")
            .references(() => sources.id, { onDelete: "set null" }), // Nullable if source deleted
        created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    },
    (t) => [
        index("timeline_events_investigation_id_idx").on(t.investigation_id),
        index("timeline_events_event_date_idx").on(t.event_date), // For chronological queries
    ]
);

// Zod schemas for validation
export const insertTimelineEventSchema = createInsertSchema(timelineEvents);
export const selectTimelineEventSchema = createSelectSchema(timelineEvents);

// TypeScript types
export type TimelineEvent = InferSelectModel<typeof timelineEvents>;
export type InsertTimelineEvent = typeof timelineEvents.$inferInsert;
