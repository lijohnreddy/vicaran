"use client";

import { memo } from "react";

// ============================================================================
// Types
// ============================================================================

interface GraphControlsProps {
    nodeCount: number;
    edgeCount: number;
}

// ============================================================================
// Component
// ============================================================================

/**
 * GraphControls - Displays node and edge count
 * Positioned in bottom-right of the graph canvas
 * Note: Zoom controls are handled by React Flow's built-in <Controls /> component
 */
function GraphControlsComponent({ nodeCount, edgeCount }: GraphControlsProps): React.JSX.Element {
    return (
        <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl px-4 py-2.5 shadow-xl text-xs">
            <div className="flex items-center gap-4 text-slate-400">
                <span>
                    <span className="font-semibold text-slate-100">{nodeCount}</span> nodes
                </span>
                <span className="text-slate-600">|</span>
                <span>
                    <span className="font-semibold text-slate-100">{edgeCount}</span> edges
                </span>
            </div>
        </div>
    );
}

// Memoize for performance
export const GraphControls = memo(GraphControlsComponent);
