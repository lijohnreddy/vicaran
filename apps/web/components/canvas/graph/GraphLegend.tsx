"use client";

import { memo } from "react";

// ============================================================================
// Component
// ============================================================================

/**
 * GraphLegend - Displays legend for node status and edge types
 * Positioned in bottom-left of the graph canvas
 */
function GraphLegendComponent(): React.JSX.Element {
    return (
        <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-700/60 rounded-lg p-4 shadow-lg text-xs">
            <div className="font-semibold mb-3 text-slate-400 uppercase tracking-wider text-[10px]">Status Legend</div>

            {/* Node status - filled dots */}
            <div className="space-y-2.5 mb-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    <span className="text-slate-300">Verified Claim</span>
                </div>
                <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <span className="text-slate-300">Under Investigation</span>
                </div>
                <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span className="text-slate-300">Disputed/False</span>
                </div>
            </div>

            {/* Source indicator */}
            <div className="border-t border-slate-700/50 pt-3 mb-3">
                <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-sm border border-slate-500 bg-slate-700" />
                    <span className="text-slate-300">Source Material</span>
                </div>
            </div>

            {/* Edge types */}
            <div className="border-t border-slate-700/50 pt-3 space-y-2">
                <div className="flex items-center gap-2.5">
                    <div className="w-5 h-0.5 bg-green-500 rounded-full" />
                    <span className="text-slate-300">Supports</span>
                </div>
                <div className="flex items-center gap-2.5">
                    <div className="w-5 h-0.5 bg-red-500 rounded-full" />
                    <span className="text-slate-300">Contradicts</span>
                </div>
            </div>
        </div>
    );
}

// Memoize for performance
export const GraphLegend = memo(GraphLegendComponent);
