import { NextRequest, NextResponse } from "next/server";
import { getEndpointForPath } from "@/lib/config/backend-config";
import { getAuthHeaders } from "@/lib/config/server-auth";

/**
 * Health check endpoint that forwards to the ADK server's /health endpoint
 * Used to verify if the agent backend is running and responsive
 */
export async function GET(request: NextRequest): Promise<Response> {
  try {
    // Get the backend /health endpoint using the proper configuration
    const backendHealthUrl = getEndpointForPath("/docs");
    console.log("backendHealthUrl", backendHealthUrl);

    // Get appropriate auth headers for the deployment type
    const authHeaders = await getAuthHeaders();

    // Forward the request to the backend
    const response = await fetch(backendHealthUrl, {
      method: "GET",
      headers: {
        ...authHeaders,
        // Forward relevant headers from the original request
        "User-Agent": request.headers.get("User-Agent") || "ADK-Health-Check",
        Accept: request.headers.get("Accept") || "application/json",
      },
      // Add a timeout to prevent hanging
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    // Return the response from the backend
    // This will be ok: true/false based on backend availability
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/json",
        "Cache-Control": "no-cache", // Don't cache health checks
      },
    });
  } catch (error) {
    console.error("Backend health check failed:", error);

    // Return 503 Service Unavailable if backend is not reachable
    return NextResponse.json(
      {
        error: "Backend service unavailable",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-cache",
        },
      }
    );
  }
}

/**
 * Handle preflight requests for CORS if needed
 */
export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
