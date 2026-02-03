import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { InferSelectModel } from "drizzle-orm";
import { users } from "./users";

// Session Names table - stores user-friendly titles for ADK sessions
export const sessionNames = pgTable(
  "session_names",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    session_id: text("session_id").notNull(), // ADK session ID
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    is_ai_generated: boolean("is_ai_generated").default(false).notNull(),

    // Metadata
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    // Index for efficient session lookups by user
    index("session_names_user_id_idx").on(t.user_id),
    // Index for session_id + user_id combination (most common query)
    index("session_names_session_user_idx").on(t.session_id, t.user_id),
    // Unique constraint to prevent duplicate session names per user
    unique("session_names_unique_session_user").on(t.session_id, t.user_id),
  ]
);

// Zod validation schemas
export const insertSessionNameSchema = createInsertSchema(sessionNames);
export const selectSessionNameSchema = createSelectSchema(sessionNames);

// Update schema - useful for PATCH requests
export const updateSessionNameSchema = insertSessionNameSchema.partial();

// TypeScript types
export type SessionName = InferSelectModel<typeof sessionNames>;
export type InsertSessionName = typeof sessionNames.$inferInsert;
export type UpdateSessionName = Partial<SessionName>;

// Session name creation type (for API requests)
export type CreateSessionNameData = {
  session_id: string;
  title: string;
  is_ai_generated?: boolean;
};
