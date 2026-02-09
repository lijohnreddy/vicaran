/**
 * Backend Configuration for ADK Agent Communication
 * Simplified configuration using ADK_URL for both localhost and production
 * 
 * All config values are lazy — computed on first access to avoid
 * crashing during Vercel's build when env vars aren't available.
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
  const adkUrl = env.ADK_URL ?? "";

  // Check if this is an Agent Engine deployment
  if (adkUrl.includes("aiplatform.googleapis.com")) {
    const match = adkUrl.match(/reasoningEngines\/(\d+):/);
    if (match && match[1]) {
      return match[1];
    }
    console.warn(
      "Could not extract Agent Engine ID from URL, using default app name"
    );
    return "vicaran_agent";
  }

  return "vicaran_agent";
}

// Lazy — only computed when accessed at runtime
let _adkAppName: string | null = null;
export function getADKAppName(): string {
  if (!_adkAppName) _adkAppName = getAdkAppName();
  return _adkAppName;
}


/**
 * Detects deployment type from ADK_URL
 */
function detectDeploymentType(): BackendConfig["deploymentType"] {
  const adkUrl = env.ADK_URL ?? "";

  if (adkUrl.includes("localhost") || adkUrl.includes("127.0.0.1")) {
    return "localhost";
  }

  if (adkUrl.includes("aiplatform.googleapis.com")) {
    return "agent_engine";
  }

  const backendType = process.env.NEXT_BACKEND_TYPE;
  if (backendType === "agent_engine" || backendType === "localhost") {
    return backendType;
  }

  return "localhost";
}

/**
 * Creates the simplified backend configuration
 */
export function createBackendConfig(): BackendConfig {
  const deploymentType = detectDeploymentType();
  return {
    backendUrl: env.ADK_URL ?? "http://localhost:8080",
    deploymentType,
  };
}

// Lazy — only computed when accessed at runtime
let _backendConfig: BackendConfig | null = null;
function getBackendConfig(): BackendConfig {
  if (!_backendConfig) _backendConfig = createBackendConfig();
  return _backendConfig;
}

// Export as a Proxy so existing code that reads backendConfig.xxx still works
export const backendConfig = new Proxy({} as BackendConfig, {
  get(_target, prop) {
    return getBackendConfig()[prop as keyof BackendConfig];
  },
});

/**
 * Determines if we should use Agent Engine API directly
 */
export function shouldUseAgentEngine(): boolean {
  return getBackendConfig().deploymentType === "agent_engine";
}

/**
 * Determines if we should use localhost backend
 */
export function shouldUseLocalhost(): boolean {
  return getBackendConfig().deploymentType === "localhost";
}

/**
 * Gets the appropriate endpoint for a given API path
 * Always uses non-streaming query endpoint for Agent Engine
 */
export function getEndpointForPath(path: string): string {
  if (shouldUseAgentEngine()) {
    return `${getBackendConfig().backendUrl}`;
  }
  return `${getBackendConfig().backendUrl}${path}`;
}

