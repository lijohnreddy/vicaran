/**
 * Utility function to build the initial investigation prompt
 * sent to the agent when an investigation is created.
 */

export interface InvestigationPromptParams {
    investigationId: string;
    title: string;
    mode: "quick" | "detailed";
    brief: string;
    sources: string[];
}

/**
 * Builds a formatted message to send to the agent when starting an investigation.
 * This message is visible in the chat as the first user message.
 */
export function buildInvestigationPrompt(params: InvestigationPromptParams): string {
    const { investigationId, title, mode, brief, sources } = params;

    const sourcesSection =
        sources.length > 0
            ? `\n\n**User-Provided Sources:**\n${sources.map((s) => `- ${s}`).join("\n")}`
            : "";

    return `Investigation ID: ${investigationId}
Title: ${title}
Mode: ${mode}

**Investigation Brief:**
${brief}${sourcesSection}`;
}
