import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { claims } from "./claims";
import { sources } from "./sources";

// Claim-Sources junction table - many-to-many relationship
// Claims can cite multiple sources, sources can support multiple claims
export const claimSources = pgTable(
    "claim_sources",
    {
        claim_id: uuid("claim_id")
            .references(() => claims.id, { onDelete: "cascade" })
            .notNull(),
        source_id: uuid("source_id")
            .references(() => sources.id, { onDelete: "cascade" })
            .notNull(),
    },
    (t) => [
        // Composite primary key on both columns
        primaryKey({ columns: [t.claim_id, t.source_id] }),
    ]
);

// TypeScript type
export type ClaimSource = typeof claimSources.$inferSelect;
