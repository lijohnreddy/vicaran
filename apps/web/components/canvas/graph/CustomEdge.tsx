"use client";

import { memo } from "react";
import { getBezierPath, type EdgeProps } from "reactflow";

// ============================================================================
// Types
// ============================================================================

interface CustomEdgeData {
    evidenceType: "supporting" | "contradicting";
    evidenceText?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * CustomEdge - Custom React Flow edge with curved paths and glow effect
 * - Supporting: Solid green curved line with glow
 * - Contradicting: Dashed red curved line with glow
 */
function CustomEdgeComponent({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
}: EdgeProps<CustomEdgeData>): React.JSX.Element {
    // Use Bezier curve for smooth, curved lines
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        curvature: 0.25, // Gentle curve
    });

    const isSupporting = data?.evidenceType === "supporting";
    const strokeColor = isSupporting ? "#22c55e" : "#ef4444";
    const glowColor = isSupporting ? "#22c55e" : "#ef4444";

    return (
        <>
            {/* SVG filter for glow effect */}
            <defs>
                <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Glow layer (thicker, blurred) */}
            <path
                d={edgePath}
                fill="none"
                stroke={glowColor}
                strokeWidth={6}
                strokeOpacity={0.3}
                strokeDasharray={isSupporting ? "none" : "8,6"}
                filter={`url(#glow-${id})`}
            />

            {/* Main edge line */}
            <path
                id={id}
                d={edgePath}
                fill="none"
                stroke={strokeColor}
                strokeWidth={2}
                strokeDasharray={isSupporting ? "none" : "8,6"}
                strokeLinecap="round"
            />
        </>
    );
}

// Memoize for performance
export const CustomEdge = memo(CustomEdgeComponent);

