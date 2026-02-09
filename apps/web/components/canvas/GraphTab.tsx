"use client";

import { useCallback, useState } from "react";
import ReactFlow, {
    Controls,
    Background,
    BackgroundVariant,
    MiniMap,
    type NodeMouseHandler,
} from "reactflow";
import "reactflow/dist/style.css";

import type { Source, Claim } from "@/lib/drizzle/schema";
import type { FactCheckWithSource } from "@/app/actions/canvas";
import { useGraphData } from "@/hooks/useGraphData";
import { SourceNode } from "./graph/SourceNode";
import { ClaimNode } from "./graph/ClaimNode";
import { CustomEdge } from "./graph/CustomEdge";
import { GraphLegend } from "./graph/GraphLegend";
import { GraphControls } from "./graph/GraphControls";
import { SourceDetailPanel } from "./graph/SourceDetailPanel";
import { ClaimDetailPanel } from "./graph/ClaimDetailPanel";

// ============================================================================
// Types
// ============================================================================

interface GraphTabProps {
    investigationId: string;
    sources: Source[];
    claims: Claim[];
    factChecks: FactCheckWithSource[];
}

// Register custom node types
const nodeTypes = {
    source: SourceNode,
    claim: ClaimNode,
};

// Register custom edge types
const edgeTypes = {
    custom: CustomEdge,
};

// ============================================================================
// Component
// ============================================================================

/**
 * GraphTab - Interactive React Flow canvas displaying claim-evidence network
 * Shows sources and claims as nodes, with edges representing evidence relationships
 */
export function GraphTab({
    investigationId: _investigationId,
    sources,
    claims,
    factChecks,
}: GraphTabProps): React.JSX.Element {
    // Note: _investigationId reserved for future features (e.g., node position persistence)
    void _investigationId;
    // State for selected node (for detail panels)
    const [selectedSource, setSelectedSource] = useState<Source | null>(null);
    const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

    // Transform data to React Flow format with layout
    const { nodes, edges, onNodesChange, onEdgesChange } = useGraphData({
        sources,
        claims,
        factChecks,
    });

    // Handle node click to open detail panels
    const onNodeClick: NodeMouseHandler = useCallback(
        (_event, node) => {
            if (node.type === "source") {
                const source = sources.find((s) => `source-${s.id}` === node.id);
                if (source) {
                    setSelectedSource(source);
                    setSelectedClaim(null);
                }
            } else if (node.type === "claim") {
                const claim = claims.find((c) => `claim-${c.id}` === node.id);
                if (claim) {
                    setSelectedClaim(claim);
                    setSelectedSource(null);
                }
            }
        },
        [sources, claims]
    );

    // Close detail panels
    const closeSourcePanel = useCallback(() => setSelectedSource(null), []);
    const closeClaimPanel = useCallback(() => setSelectedClaim(null), []);

    // Check if we have any data
    const hasData = sources.length > 0 || claims.length > 0;

    // Empty state
    if (!hasData) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <div className="text-center text-muted-foreground max-w-md">
                    <div className="text-5xl mb-4">🔗</div>
                    <h3 className="text-lg font-medium mb-2">No connections yet</h3>
                    <p className="text-sm">
                        Evidence links will appear as fact-checking completes.
                        Sources and claims will be displayed here as the investigation progresses.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                minZoom={0.3}
                maxZoom={1.5}
                proOptions={{ hideAttribution: true }}
            >
                <Controls showInteractive={false} className="!bg-slate-800/90 !border-slate-700 !rounded-lg" />
                <Background variant={BackgroundVariant.Dots} gap={20} size={1} className="!bg-slate-950" />
                <MiniMap
                    nodeColor={(node) => {
                        if (node.type === "source") return "#0891b2";
                        if (node.type === "claim") return "#22c55e";
                        return "#64748b";
                    }}
                    maskColor="rgba(15, 23, 42, 0.8)"
                    className="!bg-slate-900/90 !border-slate-700 !rounded-lg"
                />
            </ReactFlow>

            {/* Legend */}
            <GraphLegend />

            {/* Node/Edge count */}
            <GraphControls nodeCount={nodes.length} edgeCount={edges.length} />

            {/* Detail Panels */}
            {selectedSource && (
                <SourceDetailPanel source={selectedSource} onClose={closeSourcePanel} />
            )}
            {selectedClaim && (
                <ClaimDetailPanel
                    claim={selectedClaim}
                    factChecks={factChecks}
                    onClose={closeClaimPanel}
                />
            )}
        </div>
    );
}
