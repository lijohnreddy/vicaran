/**
 * Backend Configuration for ADK Agent Communication
 * Simplified configuration using ADK_URL for both localhost and production
 */

import { env } from "@/lib/env";

export interface BackendConfig {
  backendUrl: string;
  deploymentType: "localhost" | "agent_engine";
}

/**
 * ADK Application Configuration
 *
 * For Agent Engine deployments, the app name is the Agent Engine resource ID.
 * For localhost, use the configured agent name.
 */
function getAdkAppName(): string {
  const adkUrl = env.ADK_URL;

  // Check if this is an Agent Engine deployment
  if (adkUrl.includes("aiplatform.googleapis.com")) {
    // Extract Agent Engine ID from the URL
    // Format: https://us-central1-aiplatform.googleapis.com/v1/projects/PROJECT/locations/LOCATION/reasoningEngines/ID:query
    const match = adkUrl.match(/reasoningEngines\/(\d+):/);
    if (match && match[1]) {
      return match[1]; // Return the Agent Engine resource ID
    }
    // Fallback to default if extraction fails
    console.warn(
      "Could not extract Agent Engine ID from URL, using default app name"
    );
    return "competitor_analysis_agent";
  }

  // For localhost, use the configured agent name
  return "competitor_analysis_agent";
}

export const ADK_APP_NAME = getAdkAppName();

/**
 * Detects deployment type from ADK_URL
 */
function detectDeploymentType(): BackendConfig["deploymentType"] {
  const adkUrl = env.ADK_URL;

  // Check if ADK_URL points to localhost
  if (adkUrl.includes("localhost") || adkUrl.includes("127.0.0.1")) {
    return "localhost";
  }

  // If it points to Agent Engine (aiplatform.googleapis.com)
  if (adkUrl.includes("aiplatform.googleapis.com")) {
    return "agent_engine";
  }

  // Default based on manual override if set
  const backendType = process.env.NEXT_BACKEND_TYPE;
  if (backendType === "agent_engine" || backendType === "localhost") {
    return backendType;
  }

  // Default to localhost for safety
  return "localhost";
}

/**
 * Creates the simplified backend configuration
 */
export function createBackendConfig(): BackendConfig {
  const deploymentType = detectDeploymentType();

  const config: BackendConfig = {
    backendUrl: env.ADK_URL, // Use ADK_URL directly
    deploymentType,
  };

  return config;
}

/**
 * Get the current backend configuration
 */
export const backendConfig = createBackendConfig();

/**
 * Determines if we should use Agent Engine API directly
 */
export function shouldUseAgentEngine(): boolean {
  return backendConfig.deploymentType === "agent_engine";
}

/**
 * Determines if we should use localhost backend
 */
export function shouldUseLocalhost(): boolean {
  return backendConfig.deploymentType === "localhost";
}

/**
 * Gets the appropriate endpoint for a given API path
 * Always uses non-streaming query endpoint for Agent Engine
 */
export function getEndpointForPath(path: string): string {
  if (shouldUseAgentEngine()) {
    // For Agent Engine, always use the non-streaming query endpoint
    return `${backendConfig.backendUrl}`;
  }

  // For localhost, append the path to the backend URL
  return `${backendConfig.backendUrl}${path}`;
}
