import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Hook to handle URL-based chat restoration
 * Manages sessionId query parameter for chat continuity
 */
export function useChatUrlHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const sessionId = searchParams.get("sessionId");

    /**
     * Updates the URL with the current session ID
     */
    const updateUrlWithSession = (newSessionId: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sessionId", newSessionId);
        router.push(`/?${params.toString()}`, { scroll: false });
    };

    /**
     * Clears the session ID from the URL
     */
    const clearSessionFromUrl = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("sessionId");
        const newUrl = params.toString() ? `/?${params.toString()}` : "/";
        router.push(newUrl, { scroll: false });
    };

    return {
        sessionId,
        updateUrlWithSession,
        clearSessionFromUrl,
    };
}
