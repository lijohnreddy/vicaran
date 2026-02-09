"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    getInvestigationSummary,
    getInvestigationSources,
    getInvestigationClaims,
    getInvestigationFactChecks,
    getInvestigationTimeline,
    type FactCheckWithSource,
    type TimelineEventWithSource,
} from "@/app/actions/canvas";
import type { Source, Claim } from "@/lib/drizzle/schema";

// ============================================================================
// Types
// ============================================================================

export interface CanvasData {
    summary: string | null;
    overallBiasScore: string | null;
    sources: Source[];
    claims: Claim[];
    factChecks: FactCheckWithSource[];
    timeline: TimelineEventWithSource[];
}

interface UseCanvasPollingConfig {
    investigationId: string;
    userId: string;
    enabled?: boolean;
    pollingInterval?: number;
}

interface UseCanvasPollingReturn {
    data: CanvasData;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

// ============================================================================
// Hook
// ============================================================================

const POLLING_INTERVAL = 3000; // 3 seconds

const initialData: CanvasData = {
    summary: null,
    overallBiasScore: null,
    sources: [],
    claims: [],
    factChecks: [],
    timeline: [],
};

/**
 * Polling hook for canvas data with 3-second refresh interval
 * Fetches summary, sources, claims, fact checks, and timeline
 */
export function useCanvasPolling({
    investigationId,
    userId,
    enabled = true,
    pollingInterval = POLLING_INTERVAL,
}: UseCanvasPollingConfig): UseCanvasPollingReturn {
    const [data, setData] = useState<CanvasData>(initialData);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const pollingRef = useRef<NodeJS.Timeout | null>(null);
    const isMounted = useRef(true);

    // Fetch all canvas data
    const fetchData = useCallback(async () => {
        if (!investigationId || !userId) return;

        try {
            // Fetch all data in parallel
            const [summaryRes, sourcesRes, claimsRes, factChecksRes, timelineRes] =
                await Promise.all([
                    getInvestigationSummary(investigationId, userId),
                    getInvestigationSources(investigationId, userId),
                    getInvestigationClaims(investigationId, userId),
                    getInvestigationFactChecks(investigationId, userId),
                    getInvestigationTimeline(investigationId, userId),
                ]);

            // Only update state if component is still mounted
            if (!isMounted.current) return;

            // Update data even if some calls fail
            setData({
                summary: summaryRes.success ? summaryRes.data?.summary ?? null : null,
                overallBiasScore: summaryRes.success
                    ? summaryRes.data?.overallBiasScore ?? null
                    : null,
                sources: sourcesRes.success ? sourcesRes.data ?? [] : [],
                claims: claimsRes.success ? claimsRes.data ?? [] : [],
                factChecks: factChecksRes.success ? factChecksRes.data ?? [] : [],
                timeline: timelineRes.success ? timelineRes.data ?? [] : [],
            });

            setError(null);
            setIsLoading(false);
        } catch (err) {
            if (!isMounted.current) return;
            console.error("[useCanvasPolling] Error fetching data:", err);
            setError("Failed to fetch canvas data");
            setIsLoading(false);
        }
    }, [investigationId, userId]);

    // Start/stop polling based on enabled flag
    useEffect(() => {
        isMounted.current = true;

        if (!enabled) {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
            return;
        }

        // Initial fetch
        fetchData();

        // Start polling
        pollingRef.current = setInterval(fetchData, pollingInterval);

        return () => {
            isMounted.current = false;
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
        };
    }, [enabled, fetchData, pollingInterval]);

    return {
        data,
        isLoading,
        error,
        refetch: fetchData,
    };
}
