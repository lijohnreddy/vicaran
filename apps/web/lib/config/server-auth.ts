/**
 * Server-Only Authentication Utilities
 * This file should only be imported by server-side code (API routes)
 * to avoid client-side bundling issues with Node.js-specific dependencies
 */

import { backendConfig } from "./backend-config";

/**
 * Utility function to get authentication headers for Google Cloud API calls
 * This function uses Node.js-specific dependencies and should only be called on the server
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // For localhost development, no authentication is needed
  if (backendConfig.deploymentType === "localhost") {
    return headers;
  }

  // For Agent Engine deployment, we need proper Google Cloud authentication
  if (backendConfig.deploymentType === "agent_engine") {
    try {
      // Use base64-encoded service account key from environment variables (for Vercel deployment)
      const serviceAccountKeyBase64 =
        process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64;

      if (!serviceAccountKeyBase64) {
        throw new Error(
          "GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 environment variable is required for Agent Engine deployment"
        );
      }

      // Decode the base64-encoded service account key
      const serviceAccountKeyJson = Buffer.from(
        serviceAccountKeyBase64,
        "base64"
      ).toString("utf-8");
      const credentials = JSON.parse(serviceAccountKeyJson);

      // Use the service account to get an access token
      const { GoogleAuth } = await import("google-auth-library");
      const auth = new GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/cloud-platform"],
      });

      const authClient = await auth.getClient();
      const accessToken = await authClient.getAccessToken();

      if (accessToken.token) {
        headers["Authorization"] = `Bearer ${accessToken.token}`;
      }
    } catch (error) {
      console.error("Failed to get Google Cloud access token:", error);
      throw new Error("Authentication failed");
    }
  }

  return headers;
}
