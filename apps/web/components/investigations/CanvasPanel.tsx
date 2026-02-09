"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import { useCanvasPolling } from "@/hooks/useCanvasPolling";
import { BriefTab } from "@/components/canvas/BriefTab";
import { DashboardTab } from "@/components/canvas/DashboardTab";
import { GraphTab } from "@/components/canvas/GraphTab";

interface CanvasPanelProps {
    investigationId: string;
    onClose: () => void;
    isFullscreen?: boolean;
    onToggleFullscreen?: () => void;
}

type CanvasTab = "brief" | "dashboard" | "graph";

/**
 * Canvas panel with 3 tabs: BRIEF | DASHBOARD | GRAPH
 * Brief and Dashboard show real content with 3-second polling
 * Graph shows interactive claim-evidence network
 */
export function CanvasPanel({ investigationId, onClose, isFullscreen, onToggleFullscreen }: CanvasPanelProps): React.JSX.Element {
    const [activeTab, setActiveTab] = useState<CanvasTab>("brief");
    const user = useUser();

    // Fetch canvas data with polling
    const { data, isLoading } = useCanvasPolling({
        investigationId,
        userId: user?.id ?? "",
        enabled: !!user?.id && !!investigationId,
    });

    const tabs: { id: CanvasTab; label: string }[] = [
        { id: "brief", label: "BRIEF" },
        { id: "dashboard", label: "DASHBOARD" },
        { id: "graph", label: "GRAPH" },
    ];

    return (
        <div className="flex h-full flex-col bg-muted/30">
            {/* Canvas Header with Tabs */}
            <div className="flex items-center justify-between border-b border-border bg-background px-4 py-2">
                {/* Tabs */}
                <div className="flex gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
                                activeTab === tab.id
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Fullscreen & Close Buttons */}
                <div className="flex items-center gap-1">
                    {onToggleFullscreen && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onToggleFullscreen}
                            className="h-8 w-8"
                            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                        >
                            {isFullscreen ? (
                                <Minimize2 className="h-4 w-4" />
                            ) : (
                                <Maximize2 className="h-4 w-4" />
                            )}
                            <span className="sr-only">{isFullscreen ? "Exit fullscreen" : "Fullscreen"}</span>
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close canvas</span>
                    </Button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
                {activeTab === "brief" && (
                    <BriefTab summary={data.summary} isLoading={isLoading} />
                )}
                {activeTab === "dashboard" && (
                    <DashboardTab
                        sources={data.sources}
                        claims={data.claims}
                        factChecks={data.factChecks}
                        timeline={data.timeline}
                        overallBiasScore={data.overallBiasScore}
                        isLoading={isLoading}
                    />
                )}
                {activeTab === "graph" && (
                    <GraphTab
                        investigationId={investigationId}
                        sources={data.sources}
                        claims={data.claims}
                        factChecks={data.factChecks}
                    />
                )}
            </div>
        </div>
    );
}

