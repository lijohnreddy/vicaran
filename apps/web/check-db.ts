import { db } from './lib/drizzle/db';
import { investigations, sources, claims, factChecks, timelineEvents } from './lib/drizzle/schema';
import { eq, desc } from 'drizzle-orm';

async function checkDatabase() {
    console.log('\n========================================');
    console.log('DATABASE CHECK - Investigation Data');
    console.log('========================================\n');

    // Get latest investigations
    const invs = await db.select().from(investigations).orderBy(desc(investigations.created_at)).limit(3);

    console.log('=== INVESTIGATIONS (latest 3) ===');
    for (const inv of invs) {
        console.log(`\nID: ${inv.id}`);
        console.log(`Title: ${inv.title}`);
        console.log(`Status: ${inv.status}`);
        console.log(`Summary: ${inv.summary ? inv.summary.substring(0, 200) + '...' : 'NULL'}`);
        console.log(`Overall Bias: ${inv.overall_bias_score || 'NULL'}`);
        console.log(`Started At: ${inv.started_at}`);
        console.log('---');
    }

    // For the most recent investigation, get related data
    if (invs.length > 0) {
        const latestId = invs[0].id;
        console.log(`\n\n=== DATA FOR: ${invs[0].title} (${latestId}) ===`);

        const srcs = await db.select().from(sources).where(eq(sources.investigation_id, latestId));
        console.log(`\n📰 SOURCES: ${srcs.length} records`);
        srcs.forEach((s, i) => console.log(`  ${i + 1}. ${s.title?.substring(0, 50)} | Credibility: ${s.credibility_score} | Bias: ${s.bias_score}`));

        const clms = await db.select().from(claims).where(eq(claims.investigation_id, latestId));
        console.log(`\n💬 CLAIMS: ${clms.length} records`);
        clms.forEach((c, i) => console.log(`  ${i + 1}. ${c.claim_text?.substring(0, 60)}... | Evidence: ${c.evidence_count}`));

        // Get fact checks for claims
        let factCheckCount = 0;
        for (const claim of clms) {
            const fcs = await db.select().from(factChecks).where(eq(factChecks.claim_id, claim.id));
            factCheckCount += fcs.length;
        }
        console.log(`\n✓ FACT CHECKS: ${factCheckCount} records`);

        const timeline = await db.select().from(timelineEvents).where(eq(timelineEvents.investigation_id, latestId));
        console.log(`\n📅 TIMELINE EVENTS: ${timeline.length} records`);
        timeline.forEach((t, i) => console.log(`  ${i + 1}. ${t.event_date?.toISOString().split('T')[0]} - ${t.event_text?.substring(0, 50)}`));
    }

    console.log('\n========================================\n');
    process.exit(0);
}

checkDatabase().catch(console.error);
