/**
 * One-time script to fix claim statuses based on existing evidence.
 * Run with: npx tsx --env-file=.env.local scripts/fix-claim-statuses.ts
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import {
    claims,
    factChecks,
} from "../lib/drizzle/schema";

// Connect directly using DATABASE_URL
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    console.error("❌ DATABASE_URL not set");
    process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client);

async function fixClaimStatuses() {
    console.log("🔧 Fixing claim statuses based on existing evidence...\n");

    // Get all claims
    const allClaims = await db.select().from(claims);
    console.log(`Found ${allClaims.length} claims to check\n`);

    let updated = 0;

    for (const claim of allClaims) {
        // Get all fact checks for this claim
        const claimFactChecks = await db
            .select()
            .from(factChecks)
            .where(eq(factChecks.claim_id, claim.id));

        if (claimFactChecks.length === 0) {
            continue;
        }

        const hasContradicting = claimFactChecks.some(
            (fc) => fc.evidence_type === "contradicting"
        );
        const hasSupporting = claimFactChecks.some(
            (fc) => fc.evidence_type === "supporting"
        );

        let newStatus = claim.status;

        if (hasContradicting) {
            newStatus = "contradicted";
        } else if (hasSupporting && claim.status === "unverified") {
            newStatus = "verified";
        }

        if (newStatus !== claim.status) {
            await db
                .update(claims)
                .set({ status: newStatus, updated_at: new Date() })
                .where(eq(claims.id, claim.id));

            console.log(
                `✅ Claim "${claim.claim_text.substring(0, 50)}..." → ${newStatus}`
            );
            updated++;
        }
    }

    console.log(`\n🎉 Done! Updated ${updated} claims.`);
    await client.end();
    process.exit(0);
}

fixClaimStatuses().catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
});
