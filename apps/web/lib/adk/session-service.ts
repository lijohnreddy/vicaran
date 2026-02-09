import {
  getEndpointForPath,
  ADK_APP_NAME,
  backendConfig,
  shouldUseAgentEngine,
} from "@/lib/config/backend-config";
import { getAuthHeaders } from "@/lib/config/server-auth";
import type { SourceMetadata } from "@/lib/chat/types";
import { devLog } from "@/lib/utils/logger";

/**
 * ADK Session API Types based on ADK documentation
 */

export interface AdkEvent {
  id: string;
  author: string;
  content?: AdkContent;
  actions?: AdkEventActions;
  invocationId: string;
  timestamp: number;
  partial?: boolean;
  turnComplete?: boolean;
  errorCode?: string;
  errorMessage?: string;
  interrupted?: boolean;
  branch?: string;
  groundingMetadata?: Record<string, unknown>;
}

export interface AdkContent {
  parts: AdkPart[];
  role: "user" | "model"; // ADK uses "user" for human messages, "model" for AI messages
}

export interface AdkPart {
  text?: string;
  thought?: boolean;
  function_call?: {
    name: string;
    args: Record<string, unknown>;
    id: string;
  };
  function_response?: {
    name: string;
    response: Record<string, unknown>;
    id: string;
  };
  // Other ADK part types
  video_metadata?: unknown;
  inline_data?: unknown;
  file_data?: unknown;
  thought_signature?: unknown;
  code_execution_result?: unknown;
  executable_code?: unknown;
}

export interface AdkEventActions {
  stateDelta?: Record<string, unknown>;
}

export interface AdkSession {
  id: string;
  app_name: string;
  user_id: string;
  state: Record<string, unknown> | null;
  last_update_time: string | number | null; // Unix timestamp number or ISO string from datetime
  events?: AdkEvent[]; // Events are included in session response
  // Extracted source data from session state
  sources?: Record<string, SourceMetadata>;
  urlToShortId?: Record<string, string>;
}

export interface ListSessionsResponse {
  sessions: AdkSession[];
  sessionIds: string[];
}

export interface CreateSessionRequest {
  state?: Record<string, unknown>;
}

/**
 * Raw ADK Session response (camelCase from API)
 */
interface AdkSessionApiResponse {
  id: string;
  appName?: string;
  userId?: string;
  state?: Record<string, unknown>;
  lastUpdateTime?: string | number;
  events?: AdkEvent[];
}

/**
 * ADK Session Service - Handles all session-related API calls
 */
export class AdkSessionService {
  /**
   * Raw source data structure from backend callback
   * Matches the structure created by collect_research_sources_callback
   */
  private static readonly SOURCE_SCHEMA = {
    id: "string",
    url: "string",
    title: "string",
    domain: "string",
    supportedClaims: "array",
  } as const;

  /**
   * Type guard to validate source data structure
   */
  private static isValidSourceData(data: unknown): data is {
    id: string;
    url: string;
    title: string;
    domain: string;
    supportedClaims: string[];
  } {
    if (!data || typeof data !== "object") return false;

    const source = data as Record<string, unknown>;
    return (
      typeof source.id === "string" &&
      typeof source.url === "string" &&
      typeof source.title === "string" &&
      typeof source.domain === "string" &&
      Array.isArray(source.supportedClaims) &&
      source.supportedClaims.every((claim) => typeof claim === "string")
    );
  }

  /**
   * Extracts and transforms source data from ADK session state
   * Backend callback stores sources in session.state.sources and session.state.url_to_short_id
   */
  private static extractSourcesFromSessionState(
    sessionState: Record<string, unknown> | null
  ): {
    sources: Record<string, SourceMetadata>;
    urlToShortId: Record<string, string>;
  } {
    const defaultResult = { sources: {}, urlToShortId: {} };

    if (!sessionState) {
      return defaultResult;
    }

    try {
      // Extract sources with proper type validation
      const rawSources = sessionState.sources;
      if (!rawSources || typeof rawSources !== "object") {
        console.warn("No valid sources found in session state");
        return defaultResult;
      }
      const sources: Record<string, SourceMetadata> = {};

      // Process each source with type validation
      for (const [key, sourceData] of Object.entries(rawSources)) {
        if (this.isValidSourceData(sourceData)) {
          // sourceData is now properly typed thanks to type guard
          sources[key] = {
            id: sourceData.id || key,
            url: sourceData.url,
            title: sourceData.title,
            domain: sourceData.domain,
            supportedClaims: sourceData.supportedClaims,
          };
        } else {
          console.warn(`Invalid source data for key ${key}:`, sourceData);
        }
      }

      // Extract URL to short ID mapping with type validation
      const rawUrlToShortId = sessionState.url_to_short_id;
      const urlToShortId: Record<string, string> = {};

      if (rawUrlToShortId && typeof rawUrlToShortId === "object") {
        for (const [url, shortId] of Object.entries(rawUrlToShortId)) {
          if (typeof shortId === "string") {
            urlToShortId[url] = shortId;
          } else {
            console.warn(`Invalid URL mapping for ${url}:`, shortId);
          }
        }
      }

      return { sources, urlToShortId };
    } catch (error) {
      console.warn("Failed to extract sources from session state:", error);
      return defaultResult;
    }
  }
  /**
   * Creates a new ADK session with server-generated ID
   */
  static async createSession(
    userId: string,
    initialState?: Record<string, unknown>
  ): Promise<AdkSession> {
    devLog("🔍 [ADK_SESSION_SERVICE] Creating session:", {
      userId,
      deploymentType: backendConfig.deploymentType,
      initialState,
    });

    // Agent Engine uses v1 API with class_method calls
    if (shouldUseAgentEngine()) {
      devLog(
        "🤖 [ADK_SESSION_SERVICE] Agent Engine detected - calling create_session method"
      );

      const endpoint = getEndpointForPath(""); // Use the :query endpoint

      const createSessionPayload = {
        class_method: "create_session",
        input: {
          user_id: userId,
          ...(initialState && { state: initialState }),
        },
      };

      const headers = {
        "Content-Type": "application/json",
        ...(await getAuthHeaders()),
      };

      devLog("📤 [ADK_SESSION_SERVICE] Agent Engine request:", {
        endpoint,
        payload: createSessionPayload,
      });

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(createSessionPayload),
      });

      devLog("📥 [ADK_SESSION_SERVICE] Agent Engine response:", {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
      });

      if (!response.ok) {
        let errorBody = "No response body";
        try {
          errorBody = await response.text();
        } catch (e) {
          console.error(
            "❌ [ADK_SESSION_SERVICE] Failed to read error response body:",
            e
          );
        }

        console.error(
          "❌ [ADK_SESSION_SERVICE] Agent Engine session creation failed:",
          {
            status: response.status,
            statusText: response.statusText,
            errorBody,
          }
        );

        throw new Error(
          `Agent Engine session creation failed: ${response.status} ${response.statusText} - ${errorBody}`
        );
      }

      const sessionData = await response.json();
      devLog(
        "📦 [ADK_SESSION_SERVICE] Agent Engine session data:",
        sessionData
      );

      // Get session ID from output.id
      const sessionId = sessionData.output?.id;
      if (!sessionId) {
        throw new Error(
          "Agent Engine did not return a session ID in output.id"
        );
      }

      const agentEngineSession: AdkSession = {
        id: sessionId,
        app_name: ADK_APP_NAME,
        user_id: userId,
        state: sessionData.output?.state || initialState || {},
        last_update_time: sessionData.output?.lastUpdateTime || Date.now(),
        events: sessionData.output?.events || [],
      };

      devLog(
        "✅ [ADK_SESSION_SERVICE] Real Agent Engine session created:",
        {
          sessionId: agentEngineSession.id,
          userId: agentEngineSession.user_id,
        }
      );

      return agentEngineSession;
    }

    // Standard ADK session creation for localhost
    const sessionPath = `/apps/${ADK_APP_NAME}/users/${userId}/sessions`;
    const endpoint = getEndpointForPath(sessionPath);

    devLog("🔍 [ADK_SESSION_SERVICE] Creating real session:", {
      userId,
      sessionPath,
      endpoint,
      initialState,
    });

    const requestBody = {
      state: initialState || {},
    };

    const headers = {
      "Content-Type": "application/json",
      ...(await getAuthHeaders()),
    };

    devLog("📤 [ADK_SESSION_SERVICE] Request details:", {
      method: "POST",
      endpoint,
      headers,
      body: requestBody,
    });

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    devLog("📥 [ADK_SESSION_SERVICE] Response details:", {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    if (!response.ok) {
      let errorBody = "No response body";
      try {
        errorBody = await response.text();
      } catch (e) {
        console.error(
          "❌ [ADK_SESSION_SERVICE] Failed to read error response body:",
          e
        );
      }

      console.error("❌ [ADK_SESSION_SERVICE] Session creation failed:", {
        status: response.status,
        statusText: response.statusText,
        errorBody,
      });

      throw new Error(
        `Failed to create session: ${response.status} ${response.statusText} - ${errorBody}`
      );
    }

    const sessionData = await response.json();
    // Map camelCase API response to snake_case interface
    const session: AdkSession = {
      id: sessionData.id,
      app_name: sessionData.appName || ADK_APP_NAME,
      user_id: sessionData.userId || userId,
      state: sessionData.state || {},
      last_update_time: sessionData.lastUpdateTime || null,
      events: sessionData.events || [],
    };
    return session;
  }

  /**
   * Retrieves a specific session by ID
   */
  static async getSession(
    userId: string,
    sessionId: string
  ): Promise<AdkSession | null> {
    // Agent Engine uses class_method calls for session retrieval
    if (shouldUseAgentEngine()) {
      devLog(
        "🔍 [ADK_SESSION_SERVICE] Agent Engine - calling get_session method"
      );

      const endpoint = getEndpointForPath(""); // Use the :query endpoint

      const getSessionPayload = {
        class_method: "get_session",
        input: {
          user_id: userId,
          session_id: sessionId,
        },
      };

      const headers = {
        "Content-Type": "application/json",
        ...(await getAuthHeaders()),
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(getSessionPayload),
      });

      if (!response.ok) {
        devLog(
          "❌ [ADK_SESSION_SERVICE] Agent Engine get_session failed:",
          response.status
        );
        return null;
      }

      const sessionData = await response.json();
      devLog(
        "📦 [ADK_SESSION_SERVICE] Agent Engine session data:",
        sessionData
      );

      // Get session data from output
      const output = sessionData.output;
      if (!output) {
        return null;
      }

      const session: AdkSession = {
        id: output.id,
        app_name: ADK_APP_NAME,
        user_id: output.userId || userId,
        state: output.state || {},
        last_update_time: output.lastUpdateTime || null,
        events: output.events || [],
      };

      return session;
    }

    // Standard localhost ADK session retrieval
    const endpoint = getEndpointForPath(
      `/apps/${ADK_APP_NAME}/users/${userId}/sessions/${sessionId}`
    );

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        ...(await getAuthHeaders()),
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to get session: ${response.statusText}`);
    }

    const sessionData = await response.json();
    // Map camelCase API response to snake_case interface and extract events
    const session: AdkSession = {
      id: sessionData.id,
      app_name: sessionData.appName || ADK_APP_NAME,
      user_id: sessionData.userId || userId,
      state: sessionData.state || {},
      last_update_time: sessionData.lastUpdateTime || null,
      events: sessionData.events || [], // Events come directly from session
    };
    return session;
  }

  /**
   * Lists all sessions for a user
   */
  static async listSessions(userId: string): Promise<ListSessionsResponse> {
    // Agent Engine uses class_method calls for session listing
    if (shouldUseAgentEngine()) {
      devLog(
        "🔍 [ADK_SESSION_SERVICE] Agent Engine - calling list_sessions method"
      );

      const endpoint = getEndpointForPath(""); // Use the :query endpoint

      const listSessionsPayload = {
        class_method: "list_sessions",
        input: {
          user_id: userId,
        },
      };

      const headers = {
        "Content-Type": "application/json",
        ...(await getAuthHeaders()),
      };

      devLog(
        "📤 [ADK_SESSION_SERVICE] Agent Engine list_sessions request:",
        {
          endpoint,
          payload: listSessionsPayload,
        }
      );

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(listSessionsPayload),
      });

      devLog("📥 [ADK_SESSION_SERVICE] Agent Engine response:", {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
      });

      if (!response.ok) {
        let errorBody = "No response body";
        try {
          errorBody = await response.text();
        } catch (e) {
          console.error(
            "❌ [ADK_SESSION_SERVICE] Failed to read error response body:",
            e
          );
        }

        console.error(
          "❌ [ADK_SESSION_SERVICE] Agent Engine list_sessions failed:",
          {
            status: response.status,
            statusText: response.statusText,
            errorBody,
          }
        );

        throw new Error(
          `Agent Engine list_sessions failed: ${response.status} ${response.statusText} - ${errorBody}`
        );
      }

      const listSessionsData = await response.json();
      devLog(
        "📦 [ADK_SESSION_SERVICE] Agent Engine sessions data:",
        listSessionsData
      );

      // Get sessions array from output
      const output = listSessionsData.output;
      if (!output || !Array.isArray(output.sessions)) {
        devLog(
          "⚠️ [ADK_SESSION_SERVICE] No sessions found in Agent Engine response"
        );
        return { sessions: [], sessionIds: [] };
      }

      // Map Agent Engine response to AdkSession format
      const sessions: AdkSession[] = output.sessions.map(
        (sessionData: AdkSessionApiResponse) => ({
          id: sessionData.id,
          app_name: ADK_APP_NAME,
          user_id: sessionData.userId || userId,
          state: sessionData.state || {},
          last_update_time: sessionData.lastUpdateTime || null,
          events: sessionData.events || [],
        })
      );

      devLog(
        "✅ [ADK_SESSION_SERVICE] Agent Engine list_sessions completed:",
        {
          sessionsCount: sessions.length,
        }
      );

      return {
        sessions,
        sessionIds: sessions.map((session) => session.id),
      };
    }

    // Standard localhost ADK session listing
    const endpoint = getEndpointForPath(
      `/apps/${ADK_APP_NAME}/users/${userId}/sessions`
    );

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        ...(await getAuthHeaders()),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to list sessions: ${response.statusText}`);
    }

    const sessionsData = await response.json();

    // Map each session from camelCase API response to snake_case interface
    const sessions: AdkSession[] = sessionsData.map(
      (sessionData: AdkSessionApiResponse) => ({
        id: sessionData.id,
        app_name: sessionData.appName || ADK_APP_NAME,
        user_id: sessionData.userId || userId,
        state: sessionData.state || {},
        last_update_time: sessionData.lastUpdateTime || null,
        events: sessionData.events || [],
      })
    );

    return {
      sessions,
      sessionIds: sessions.map((session) => session.id),
    };
  }

  /**
   * Deletes a specific session
   */
  static async deleteSession(userId: string, sessionId: string): Promise<void> {
    // Agent Engine uses class_method calls for session deletion
    if (shouldUseAgentEngine()) {
      devLog(
        "🗑️ [ADK_SESSION_SERVICE] Agent Engine - calling delete_session method"
      );

      const endpoint = getEndpointForPath(""); // Use the :query endpoint

      const deleteSessionPayload = {
        class_method: "delete_session",
        input: {
          user_id: userId,
          session_id: sessionId,
        },
      };

      const headers = {
        "Content-Type": "application/json",
        ...(await getAuthHeaders()),
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(deleteSessionPayload),
      });

      if (!response.ok) {
        let errorBody = "No response body";
        try {
          errorBody = await response.text();
        } catch (e) {
          console.error(
            "❌ [ADK_SESSION_SERVICE] Failed to read error response body:",
            e
          );
        }

        console.error(
          "❌ [ADK_SESSION_SERVICE] Agent Engine delete_session failed:",
          {
            status: response.status,
            statusText: response.statusText,
            errorBody,
          }
        );

        throw new Error(
          `Agent Engine delete_session failed: ${response.status} ${response.statusText} - ${errorBody}`
        );
      }

      devLog(
        "✅ [ADK_SESSION_SERVICE] Agent Engine session deleted successfully"
      );
      return;
    }

    // Standard localhost ADK session deletion
    const endpoint = getEndpointForPath(
      `/apps/${ADK_APP_NAME}/users/${userId}/sessions/${sessionId}`
    );

    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: {
        ...(await getAuthHeaders()),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete session: ${response.statusText}`);
    }
  }

  /**
   * Retrieves a session with all its events (for historical context)
   */
  static async getSessionWithEvents(
    userId: string,
    sessionId: string
  ): Promise<(AdkSession & { events: AdkEvent[] }) | null> {
    devLog("🔍 [ADK_SESSION_SERVICE] Fetching session with events:", {
      userId,
      sessionId,
    });

    // Get session (which includes events in the response)
    const session = await this.getSession(userId, sessionId);

    if (!session) {
      devLog("❌ [ADK_SESSION_SERVICE] Session not found");
      return null;
    }

    // Events come directly from the session response
    const events = session.events || [];
    devLog("✅ [ADK_SESSION_SERVICE] Session loaded with events:", {
      sessionId: session.id,
      eventsCount: events.length,
    });

    // Sort events by timestamp to ensure proper chronological order
    const sortedEvents = events.sort((a, b) => a.timestamp - b.timestamp);

    // Extract sources from session state
    const { sources, urlToShortId } = this.extractSourcesFromSessionState(
      session.state
    );

    devLog(
      "🔗 [ADK_SESSION_SERVICE] Extracted sources from session state:",
      {
        sourcesCount: Object.keys(sources).length,
        urlMappingsCount: Object.keys(urlToShortId).length,
      }
    );

    return {
      ...session,
      events: sortedEvents,
      sources,
      urlToShortId,
    };
  }
}
