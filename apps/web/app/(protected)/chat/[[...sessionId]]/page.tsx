import { Suspense } from "react";
import {
  AdkSession,
  AdkEvent,
  AdkSessionService,
} from "@/lib/adk/session-service";
import SessionNotFound from "@/components/chat/SessionNotFound";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { requireUserId } from "@/lib/auth";

interface ChatPageProps {
  params: Promise<{
    sessionId?: string[];
  }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  // Get authenticated user ID
  const userId = await requireUserId();

  const resolvedParams = await params;
  console.log("🔍 [CHAT_PAGE] Debug params:", {
    resolvedParams,
    sessionIdArray: resolvedParams.sessionId,
  });
  const sessionId = resolvedParams.sessionId?.[0];
  console.log("🔍 [CHAT_PAGE] Extracted sessionId:", sessionId);

  let session: (AdkSession & { events: AdkEvent[] }) | null = null;

  if (sessionId) {
    // Load existing session with events
    try {
      console.log(
        "🔍 [CHAT_PAGE] Loading existing session with events:",
        sessionId,
        "for user:",
        userId
      );
      const sessionWithEvents = await AdkSessionService.getSessionWithEvents(
        userId,
        sessionId
      );

      if (!sessionWithEvents) {
        console.log("❌ [CHAT_PAGE] Session not found:", sessionId);
        return <SessionNotFound />;
      }

      console.log("✅ [CHAT_PAGE] Session loaded successfully:", {
        sessionId: sessionWithEvents.id,
        eventsCount: sessionWithEvents.events?.length || 0,
        events: sessionWithEvents.events,
      });

      session = {
        ...sessionWithEvents,
        events: sessionWithEvents.events || [], // Ensure events is always defined
      };
    } catch (error) {
      // Error fetching session (e.g., network error), show session not found UI
      console.error("❌ [CHAT_PAGE] Error fetching session:", error);
      return <SessionNotFound />;
    }
  } else {
    // No sessionId provided - show blank chat interface for new conversations
    console.log(
      "🆕 [CHAT_PAGE] No sessionId provided, showing blank chat interface"
    );
  }

  // Render ChatInterface with Suspense
  // session=null for new chat (/chat), session=existing for existing sessions (/chat/[sessionId])
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          Loading chat...
        </div>
      }
    >
      <ChatInterface session={session} />
    </Suspense>
  );
}
