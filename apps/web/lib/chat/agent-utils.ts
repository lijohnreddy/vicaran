/**
 * Agent Utilities
 * Simple utilities for agent naming and display
 */

/**
 * Get a human-readable title for an agent
 * Simple replacement for the old getAgentTitle function
 */
export function getAgentTitle(agentName: string): string {
  // Simple agent name formatting
  return agentName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Get a short display name for an agent
 */
export function getAgentDisplayName(agentName: string): string {
  return getAgentTitle(agentName);
}
