"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Source, Claim } from "@/lib/drizzle/schema";
import type { FactCheckWithSource, TimelineEventWithSource } from "@/app/actions/canvas";
import { SourcesSubTab } from "./SourcesSubTab";
import { ClaimsSubTab } from "./ClaimsSubTab";
import { FactChecksSubTab } from "./FactChecksSubTab";
import { BiasSubTab } from "./BiasSubTab";
import { TimelineSubTab } from "./TimelineSubTab";

// ============================================================================
// Types
// ============================================================================

type DashboardSubTab = "sources" | "claims" | "factchecks" | "bias" | "timeline";

interface DashboardTabProps {
    sources: Source[];
    claims: Claim[];
    factChecks: FactCheckWithSource[];
    timeline: TimelineEventWithSource[];
    overallBiasScore: string | null;
    isLoading: boolean;
}

// ============================================================================
// Sub-tab configuration
// ============================================================================

const subTabs: { id: DashboardSubTab; label: string; icon: string }[] = [
    { id: "sources", label: "Sources", icon: "📰" },
    { id: "claims", label: "Claims", icon: "💬" },
    { id: "factchecks", label: "Fact Checks", icon: "✓" },
    { id: "bias", label: "Bias", icon: "⚖️" },
    { id: "timeline", label: "Timeline", icon: "📅" },
];

// ============================================================================
// Component
// ============================================================================

/**
 * Dashboard Tab - Container for 5 sub-tabs with icon navigation
 * Sub-tabs: Sources | Claims | Fact Checks | Bias | Timeline
 */
export function DashboardTab({
    sources,
    claims,
    factChecks,
    timeline,
    overallBiasScore,
    isLoading,
}: DashboardTabProps): React.JSX.Element {
    const [activeSubTab, setActiveSubTab] = useState<DashboardSubTab>("sources");

    const renderContent = () => {
        switch (activeSubTab) {
            case "sources":
                return <SourcesSubTab sources={sources} isLoading={isLoading} />;
            case "claims":
                return <ClaimsSubTab claims={claims} isLoading={isLoading} />;
            case "factchecks":
                return (
                    <FactChecksSubTab
                        factChecks={factChecks}
                        claims={claims}
                        isLoading={isLoading}
                    />
                );
            case "bias":
                return (
                    <BiasSubTab
                        sources={sources}
                        overallBiasScore={overallBiasScore}
                        isLoading={isLoading}
                    />
                );
            case "timeline":
                return <TimelineSubTab timeline={timeline} isLoading={isLoading} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex h-full flex-col">
            {/* Sub-tab navigation */}
            <div className="flex items-center gap-1 border-b border-border bg-muted/30 px-2 py-1.5">
                {subTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id)}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                            activeSubTab === tab.id
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                        )}
                        title={tab.label}
                    >
                        <span>{tab.icon}</span>
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Sub-tab content */}
            <div className="flex-1 overflow-hidden">{renderContent()}</div>
        </div>
    );
}
