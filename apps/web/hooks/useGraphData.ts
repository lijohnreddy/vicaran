"use client";

import { useMemo, useState } from "react";
import {
    useNodesState,
    useEdgesState,
    type Node,
    type Edge,
    type OnNodesChange,
    type OnEdgesChange,
} from "reactflow";
import dagre from "dagre";
import type { Source, Claim } from "@/lib/drizzle/schema";
import type { FactCheckWithSource } from "@/app/actions/canvas";

// ============================================================================
// Types
// ============================================================================

interface UseGraphDataProps {
    sources: Source[];
    claims: Claim[];
    factChecks: FactCheckWithSource[];
}

interface UseGraphDataReturn {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    selectedNodeId: string | null;
    setSelectedNodeId: (id: string | null) => void;
}

// Node dimensions for layout calculation
const SOURCE_NODE_WIDTH = 200;
const SOURCE_NODE_HEIGHT = 80;
const CLAIM_NODE_WIDTH = 220;
const CLAIM_NODE_HEIGHT = 100;

// ============================================================================
// Dagre Layout Helper
// ============================================================================

function getLayoutedElements(
    nodes: Node[],
    edges: Edge[],
    direction: "LR" | "TB" = "LR"
): { nodes: Node[]; edges: Edge[] } {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    // Configure layout direction (LR = sources left, claims right)
    dagreGraph.setGraph({ rankdir: direction, nodesep: 50, ranksep: 150 });

    // Add nodes to dagre
    nodes.forEach((node) => {
        const width = node.type === "source" ? SOURCE_NODE_WIDTH : CLAIM_NODE_WIDTH;
        const height = node.type === "source" ? SOURCE_NODE_HEIGHT : CLAIM_NODE_HEIGHT;
        dagreGraph.setNode(node.id, { width, height });
    });

    // Add edges to dagre
    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    // Run layout
    dagre.layout(dagreGraph);

    // Apply positions from dagre to nodes
    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        const width = node.type === "source" ? SOURCE_NODE_WIDTH : CLAIM_NODE_WIDTH;
        const height = node.type === "source" ? SOURCE_NODE_HEIGHT : CLAIM_NODE_HEIGHT;

        return {
            ...node,
            position: {
                x: nodeWithPosition.x - width / 2,
                y: nodeWithPosition.y - height / 2,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
}

// ============================================================================
// Data Transformation Helpers
// ============================================================================

/**
 * Extract domain from URL for display
 */
function getDomain(url: string): string {
    try {
        const hostname = new URL(url).hostname;
        return hostname.replace("www.", "");
    } catch {
        return url;
    }
}

/**
 * Transform sources to React Flow nodes
 */
function sourcesToNodes(sources: Source[]): Node[] {
    return sources.map((source) => ({
        id: `source-${source.id}`,
        type: "source",
        position: { x: 0, y: 0 }, // Will be set by Dagre
        data: {
            sourceId: source.id,
            title: source.title || getDomain(source.url),
            url: source.url,
            domain: getDomain(source.url),
            credibilityScore: source.credibility_score ?? 3,
            contentSnippet: source.content_snippet,
        },
    }));
}

/**
 * Transform claims to React Flow nodes
 */
function claimsToNodes(claims: Claim[]): Node[] {
    return claims.map((claim) => ({
        id: `claim-${claim.id}`,
        type: "claim",
        position: { x: 0, y: 0 }, // Will be set by Dagre
        data: {
            claimId: claim.id,
            text: claim.claim_text,
            status: claim.status,
            evidenceCount: claim.evidence_count,
        },
    }));
}

/**
 * Transform fact checks to React Flow edges
 */
function factChecksToEdges(factChecks: FactCheckWithSource[]): Edge[] {
    return factChecks.map((fc) => ({
        id: `edge-${fc.id}`,
        source: `source-${fc.source_id}`,
        target: `claim-${fc.claim_id}`,
        type: "custom",
        data: {
            evidenceType: fc.evidence_type,
            evidenceText: fc.evidence_text,
        },
    }));
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Transform canvas data into React Flow nodes and edges with Dagre layout
 */
export function useGraphData({
    sources,
    claims,
    factChecks,
}: UseGraphDataProps): UseGraphDataReturn {
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    // Transform data to nodes and edges with layout
    const layoutedData = useMemo(() => {
        const sourceNodes = sourcesToNodes(sources);
        const claimNodes = claimsToNodes(claims);
        const allNodes = [...sourceNodes, ...claimNodes];
        const allEdges = factChecksToEdges(factChecks);

        // Apply Dagre layout if we have nodes
        if (allNodes.length > 0) {
            return getLayoutedElements(allNodes, allEdges, "LR");
        }

        return { nodes: allNodes, edges: allEdges };
    }, [sources, claims, factChecks]);

    // Use React Flow's state management for interactive positioning
    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedData.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedData.edges);

    // Update nodes when data changes (re-layout)
    useMemo(() => {
        if (layoutedData.nodes.length > 0 || layoutedData.edges.length > 0) {
            setNodes(layoutedData.nodes);
            setEdges(layoutedData.edges);
        }
    }, [layoutedData, setNodes, setEdges]);

    return {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        selectedNodeId,
        setSelectedNodeId,
    };
}
