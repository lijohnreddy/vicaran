"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AdkSession } from "@/lib/adk/session-service";

interface UseChatUrlHandlerConfig {
  session: AdkSession | null;
}

/**
 * Handle URL error parameters from failed AI requests or navigation errors
 * Shows user-friendly toast notifications and cleans up URL parameters for better UX
 */
export function useChatUrlHandler({ session }: UseChatUrlHandlerConfig): void {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle URL error parameters
  useEffect(() => {
    const error = searchParams.get("error");
    const userMessage = searchParams.get("userMessage");

    if (error) {
      console.log("🔄 [URL_HANDLER] Handling error from URL params:", {
        error,
        userMessage,
      });

      // Show error toast notification
      toast.error("AI Request Failed", {
        description: error,
        duration: 8000, // Longer duration for important errors
      });

      // Clean up URL parameters for better UX
      if (session?.id) {
        const newUrl = `/chat/${session.id}`;
        console.log(
          "🧹 [URL_HANDLER] Cleaning up URL params, redirecting to:",
          newUrl
        );
        router.replace(newUrl);
      }
    }
  }, [searchParams, router, session?.id]);
}
