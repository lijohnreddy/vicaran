/**
 * Content Filter Utilities
 * 
 * Functions to filter and transform agent message content for display.
 * Hides backend IDs, internal markers, and parses structured content.
 */

/**
 * Internal markers that should be hidden or processed
 */
const INTERNAL_MARKERS = [
    '[PLAN_APPROVAL_REQUIRED]',
    '[INVESTIGATION_STARTED]',
    '[INVESTIGATION_COMPLETE]',
    '[TIMELINE_SKIPPED]',
    '[NO_CLAIMS_EXTRACTED]',
    '[NO_CLAIMS_TO_VERIFY]',
    '[BIAS_SKIPPED]',
];

/**
 * Patterns for backend IDs to hide
 */
const ID_PATTERNS = [
    /🆔\s*Saved as \w+:\s*[a-f0-9-]{36}/gi,
    /🆔\s*Saved\s+\w+\s*(?:for|as)?[^\n]*/gi,  // "🆔 Saved bias for..." etc.
    /source_id:\s*[a-f0-9-]{36}/gi,
    /claim_id:\s*[a-f0-9-]{36}/gi,
    /fact_check_id:\s*[a-f0-9-]{36}/gi,
    /event_id:\s*[a-f0-9-]{36}/gi,
    /Investigation ID:\s*[a-f0-9-]{36}/gi,
    /Sources:\s*[a-f0-9-]{36}/gi,
    /\[['"]?[a-f0-9-]{36}['"]?\]/gi, // Array of UUIDs like ["uuid"]
];


export interface FilterResult {
    cleanContent: string;
    markers: string[];
    hasPlanApproval: boolean;
    hasInvestigationStarted: boolean;
    hasInvestigationComplete: boolean;
}

/**
 * Filter out internal markers from content
 */
export function filterMarkers(content: string): FilterResult {
    let cleanContent = content;
    const markers: string[] = [];

    let hasPlanApproval = false;
    let hasInvestigationStarted = false;
    let hasInvestigationComplete = false;

    for (const marker of INTERNAL_MARKERS) {
        if (cleanContent.includes(marker)) {
            markers.push(marker);
            cleanContent = cleanContent.replace(new RegExp(escapeRegex(marker), 'g'), '');

            if (marker === '[PLAN_APPROVAL_REQUIRED]') hasPlanApproval = true;
            if (marker === '[INVESTIGATION_STARTED]') hasInvestigationStarted = true;
            if (marker === '[INVESTIGATION_COMPLETE]') hasInvestigationComplete = true;
        }
    }

    return {
        cleanContent: cleanContent.trim(),
        markers,
        hasPlanApproval,
        hasInvestigationStarted,
        hasInvestigationComplete,
    };
}

/**
 * Hide backend IDs from display
 */
export function hideBackendIds(content: string): string {
    let result = content;

    for (const pattern of ID_PATTERNS) {
        result = result.replace(pattern, '');
    }

    // Clean up lines that are now empty or just have whitespace
    result = result
        .split('\n')
        .filter(line => line.trim() !== '' && line.trim() !== '-')
        .join('\n');

    return result.trim();
}

/**
 * Parse a source finder line into structured data
 * Handles formats like:
 * - ⭐⭐⭐⭐⭐ 5/5 | domain.com 💡 Key finding: "text"
 * - 📄 **Analyzing source [N]/[total]:** title
 */
export interface ParsedSource {
    domain: string;
    stars: number;
    finding: string;
    title?: string;
    isAnalyzing?: boolean;
    sourceNumber?: number;
    totalSources?: number;
}

export function parseSourceLine(line: string): ParsedSource | null {
    // Pattern: ⭐⭐⭐⭐⭐ 5/5 | domain.com 💡 Key finding: "text"
    const starPattern = /⭐+\s*(\d+)\/\d+\s*\|\s*([\w.-]+)\s*💡?\s*Key finding:\s*[""]?(.+?)[""]?$/i;
    const match = line.match(starPattern);

    if (match) {
        const stars = parseInt(match[1], 10);
        const domain = match[2];
        const finding = match[3].replace(/[""]$/g, '');

        return { domain, stars, finding };
    }

    // Pattern: 📄 **Analyzing source [N]/[total]:** title
    const analyzingPattern = /📄\s*\*?\*?Analyzing source\s*(\d+)\/(\d+):\*?\*?\s*(.+)/i;
    const analyzingMatch = line.match(analyzingPattern);

    if (analyzingMatch) {
        return {
            domain: '',
            stars: 0,
            finding: '',
            title: analyzingMatch[3],
            isAnalyzing: true,
            sourceNumber: parseInt(analyzingMatch[1], 10),
            totalSources: parseInt(analyzingMatch[2], 10),
        };
    }

    return null;
}

/**
 * Parse claim lines from claim extractor output
 */
export interface ParsedClaim {
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
    text: string;
    importance: number;
}

export function parseClaimLine(content: string): ParsedClaim[] {
    const claims: ParsedClaim[] = [];
    const lines = content.split('\n');

    let currentClaim: Partial<ParsedClaim> | null = null;

    for (const line of lines) {
        // Pattern: 1. [HIGH IMPACT] "claim text"
        const claimPattern = /^\d+\.\s*\[?(HIGH|MEDIUM|LOW)\s*IMPACT\]?\s*[""](.+?)[""]?$/i;
        const match = line.match(claimPattern);

        if (match) {
            if (currentClaim && currentClaim.text) {
                claims.push(currentClaim as ParsedClaim);
            }
            currentClaim = {
                impact: match[1].toUpperCase() as 'HIGH' | 'MEDIUM' | 'LOW',
                text: match[2],
                importance: 0,
            };
        }

        // Pattern: - Importance: 0.9
        const importancePattern = /Importance:\s*([\d.]+)/i;
        const importanceMatch = line.match(importancePattern);

        if (importanceMatch && currentClaim) {
            currentClaim.importance = parseFloat(importanceMatch[1]);
        }
    }

    if (currentClaim && currentClaim.text) {
        claims.push(currentClaim as ParsedClaim);
    }

    return claims;
}

/**
 * Parse fact checker output
 */
export interface ParsedFactCheck {
    verdict: 'VERIFIED' | 'PARTIAL' | 'FALSE' | 'UNVERIFIED';
    claimText: string;
    evidence: string;
    confidence: number;
}

export function parseFactChecks(content: string): ParsedFactCheck[] {
    const factChecks: ParsedFactCheck[] = [];
    const lines = content.split('\n');

    let currentCheck: Partial<ParsedFactCheck> | null = null;

    for (const line of lines) {
        // Pattern: 1. ✅ **VERIFIED** - "claim text"
        const verdictPattern = /^\d+\.\s*(✅|⚠️|❌|❓)\s*\*?\*?(VERIFIED|PARTIALLY TRUE|FALSE|UNVERIFIED)\*?\*?\s*-?\s*[""](.+?)[""]?$/i;
        const match = line.match(verdictPattern);

        if (match) {
            if (currentCheck && currentCheck.claimText) {
                factChecks.push(currentCheck as ParsedFactCheck);
            }

            let verdict: ParsedFactCheck['verdict'] = 'UNVERIFIED';
            const rawVerdict = match[2].toUpperCase();
            if (rawVerdict === 'VERIFIED') verdict = 'VERIFIED';
            else if (rawVerdict === 'PARTIALLY TRUE') verdict = 'PARTIAL';
            else if (rawVerdict === 'FALSE') verdict = 'FALSE';

            currentCheck = {
                verdict,
                claimText: match[3],
                evidence: '',
                confidence: 0,
            };
        }

        // Pattern: - Evidence: text
        const evidencePattern = /Evidence:\s*(.+)/i;
        const evidenceMatch = line.match(evidencePattern);

        if (evidenceMatch && currentCheck) {
            currentCheck.evidence = evidenceMatch[1];
        }

        // Pattern: - Confidence: 0.9
        const confidencePattern = /Confidence:\s*([\d.]+)/i;
        const confidenceMatch = line.match(confidencePattern);

        if (confidenceMatch && currentCheck) {
            currentCheck.confidence = parseFloat(confidenceMatch[1]);
        }
    }

    if (currentCheck && currentCheck.claimText) {
        factChecks.push(currentCheck as ParsedFactCheck);
    }

    return factChecks;
}

/**
 * Parse bias analyzer output
 */
export interface ParsedBias {
    sourceTitle: string;
    score: number;
    interpretation: string;
    reason: string;
}

export function parseBiasAnalysis(content: string): ParsedBias[] {
    const biasEntries: ParsedBias[] = [];
    const lines = content.split('\n');

    let currentBias: Partial<ParsedBias> | null = null;

    for (const line of lines) {
        // Pattern: 1. **Source Title**
        const titlePattern = /^\d+\.\s*\*?\*?(.+?)\*?\*?\s*$/;
        const titleMatch = line.match(titlePattern);

        if (titleMatch && !line.includes('Score:')) {
            if (currentBias && currentBias.sourceTitle) {
                biasEntries.push(currentBias as ParsedBias);
            }
            currentBias = {
                sourceTitle: titleMatch[1].replace(/\*\*/g, ''),
                score: 0,
                interpretation: '',
                reason: '',
            };
        }

        // Pattern: - Score: 2/10 (Neutral / Balanced)
        const scorePattern = /Score:\s*(\d+)\/10\s*\((.+?)\)/i;
        const scoreMatch = line.match(scorePattern);

        if (scoreMatch && currentBias) {
            currentBias.score = parseInt(scoreMatch[1], 10);
            currentBias.interpretation = scoreMatch[2];
        }

        // Pattern: - Reason: text
        const reasonPattern = /Reason:\s*(.+)/i;
        const reasonMatch = line.match(reasonPattern);

        if (reasonMatch && currentBias) {
            currentBias.reason = reasonMatch[1];
        }
    }

    if (currentBias && currentBias.sourceTitle) {
        biasEntries.push(currentBias as ParsedBias);
    }

    return biasEntries;
}

/**
 * Parse timeline events
 */
export interface ParsedTimelineEvent {
    date: string;
    event: string;
}

export function parseTimeline(content: string): ParsedTimelineEvent[] {
    const events: ParsedTimelineEvent[] = [];

    // Look for table rows: | date | event | sources | event_id |
    const tableRowPattern = /\|\s*(\d{4}-\d{2}-\d{2})\s*\|\s*(.+?)\s*\|/g;
    let match;

    while ((match = tableRowPattern.exec(content)) !== null) {
        const date = match[1];
        const event = match[2].trim();

        // Skip header rows
        if (date !== 'Date' && !event.includes('---')) {
            events.push({ date, event });
        }
    }

    return events;
}

/**
 * Detect the type of agent output for proper rendering
 */
export type OutputType = 'plan' | 'sources' | 'claims' | 'factcheck' | 'bias' | 'timeline' | 'summary' | 'default';

export function detectOutputType(content: string, agent?: string): OutputType {
    if (!agent) return 'default';

    const lowerAgent = agent.toLowerCase();

    if (lowerAgent.includes('orchestrator')) {
        if (content.includes('Investigation Plan') || content.includes('[PLAN_APPROVAL_REQUIRED]')) {
            return 'plan';
        }
    }

    if (lowerAgent.includes('source_finder') || lowerAgent.includes('source finder')) {
        return 'sources';
    }

    if (lowerAgent.includes('claim_extractor') || lowerAgent.includes('claim extractor')) {
        return 'claims';
    }

    if (lowerAgent.includes('fact_checker') || lowerAgent.includes('fact checker')) {
        return 'factcheck';
    }

    if (lowerAgent.includes('bias_analyzer') || lowerAgent.includes('bias analyzer')) {
        return 'bias';
    }

    if (lowerAgent.includes('timeline_builder') || lowerAgent.includes('timeline builder')) {
        return 'timeline';
    }

    if (lowerAgent.includes('summary_writer') || lowerAgent.includes('summary writer')) {
        return 'summary';
    }

    return 'default';
}

/**
 * Full content cleanup - run all filters
 */
export function cleanContent(content: string): string {
    const { cleanContent } = filterMarkers(content);
    return hideBackendIds(cleanContent);
}

/**
 * Escape special regex characters
 */
function escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Extract star count from star emojis
 */
export function countStars(text: string): number {
    const match = text.match(/⭐+/);
    if (match) {
        return match[0].length;
    }
    return 0;
}

/**
 * Generate star display string
 */
export function renderStars(count: number): string {
    return '⭐'.repeat(Math.min(Math.max(count, 0), 5));
}

/**
 * Format user message to display Title/Mode/Brief on separate lines
 * Input format: "Title: E- Sport Mode: quick Investigation Brief: Investigate..."
 * Output format with newlines and highlighted title
 */
export function formatUserMessage(content: string): string {
    // First hide backend IDs
    let result = hideBackendIds(content);

    // Check if this looks like a Title/Mode/Brief message
    if (result.match(/Title:/i) && result.match(/Mode:/i) && result.match(/Brief:/i)) {
        // Extract the parts using a more robust pattern
        // Pattern: Title: X Mode: Y Investigation Brief: Z (or Brief: Z)
        const fullPattern = /Title:\s*(.+?)\s+Mode:\s*(.+?)\s+(?:Investigation\s+)?Brief:\s*([\s\S]+)/i;
        const match = result.match(fullPattern);

        if (match) {
            const title = match[1].trim();
            const mode = match[2].trim();
            const brief = match[3].trim();

            // Format with newlines and markdown
            result = `**Title:** ${title}\n\n**Mode:** ${mode}\n\n**Investigation Brief:**\n${brief}`;
        }
    }

    return result;
}

