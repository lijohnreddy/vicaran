/**
 * Unified Request Handler Types
 *
 * Shared interfaces for clean separation between endpoint-specific handlers
 * and unified request processing architecture.
 */

/**
 * Result of agent processing request
 */
export interface ProcessingResult {
  success: boolean;
  sessionId: string;
  error?: string;
}

/**
 * Interface for request handlers - each backend type implements this
 */
export interface RequestHandler {
  handleRequest(
    sessionId: string,
    userMessage: string,
    userId: string,
    investigationId: string | null
  ): Promise<ProcessingResult>;
}

/**
 * Standardized request payload format for internal use
 */
export interface RequestPayload {
  endpoint: string;
  body: Record<string, unknown>;
  headers: Record<string, string>;
}

/**
 * Configuration for handler creation
 */
export interface HandlerConfig {
  backendType: "localhost" | "agent_engine";
  adkUrl: string;
  appName: string;
}
