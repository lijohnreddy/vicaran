/**
 * Shared types for chat functionality
 * Core message types and interfaces used throughout the chat system
 */

/**
 * Source metadata for research citations
 */
export interface SourceMetadata {
  id: string; // Short ID like "src-1", "src-2"
  url: string; // Full source URL
  title: string; // Source page title
  domain: string; // Domain name like "example.com"
  supportedClaims: string[]; // Claims this source supports
}

/**
 * Core message types for ADK chat - aligned with ADK native format
 */
export interface Message {
  type: "user" | "model"; // Use ADK's native role values
  content: string;
  id: string;
  timestamp: Date;
  agent?: string;
  // Source support for research citations
  sources?: SourceMetadata[]; // Sources referenced in this message
  // Optimistic updates support
  pending?: boolean; // Track locally-added messages awaiting server confirmation
}

/**
 * API payload structure for chat requests
 */
export interface ChatAPIPayload {
  message: string;
  userId: string;
  sessionId: string;
}
