import { NextRequest } from "next/server";
import { getCurrentUserId } from "@/lib/auth";

interface ADKAgentRequest {
  app_name: string;
  user_id: string;
  session_id: string;
  new_message: {
    role: string;
    parts: Array<{ text: string }>;
  };
  streaming: boolean;
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    // Step 1: Get user ID
    const userId = await getCurrentUserId();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Step 2: Extract and validate request data
    const { userId: requestUserId, message, sessionId } = await request.json();

    console.log("[ADK CHAT] 📋 Processing request:", {
      requestUserId,
      message: message?.substring(0, 50),
      sessionId,
    });

    if (!requestUserId || !message || !sessionId) {
      return new Response("Missing required fields", { status: 400 });
    }

    // Step 3: Validate environment configuration
    const adkUrl = process.env.ADK_URL;
    if (!adkUrl) {
      return new Response("Service configuration error", { status: 500 });
    }

    // Step 4: Build agent request
    const agentRequest: ADKAgentRequest = {
      app_name: "competitor_analysis_agent",
      user_id: requestUserId,
      session_id: sessionId,
      new_message: {
        role: "user",
        parts: [{ text: message }],
      },
      streaming: false,
    };

    console.log("[ADK CHAT] 🚀 Triggering ADK agent for session:", sessionId);

    // Step 5: Fire-and-forget agent trigger
    fetch(`${adkUrl}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(agentRequest),
    })
      .then((response) => {
        if (!response.ok) {
          console.error("[ADK CHAT] Agent trigger failed:", response.status);
        } else {
          console.log("[ADK CHAT] Agent successfully triggered");
        }
      })
      .catch((error) => {
        console.error("[ADK CHAT] Agent trigger error:", error);
      });

    // Step 6: Return success response
    return Response.json({
      success: true,
      message: "Message sent successfully",
      session_id: sessionId,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("[ADK CHAT] Chat request error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return new Response(errorMessage, { status: 500 });
  }
}
