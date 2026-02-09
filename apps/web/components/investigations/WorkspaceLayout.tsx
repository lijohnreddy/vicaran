"use client";

import React, { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { Investigation } from "@/lib/drizzle/schema/investigations";
import type { AdkSession, AdkEvent } from "@/lib/adk/session-service";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { InvestigationChat } from "./InvestigationChat";
import { CanvasPanel } from "./CanvasPanel";

interface WorkspaceLayoutProps {
    investigation: Investigation;
    session: (AdkSession & { events: AdkEvent[] }) | null;
}

const MIN_CHAT_WIDTH = 300;
const MIN_CANVAS_WIDTH = 300;
const DEFAULT_CHAT_PERCENT = 40;

/**
 * Two-column workspace layout with resizable divider
 * 40% chat (left) / 60% canvas (right) by default
 */
export function WorkspaceLayout({
    investigation,
    session,
}: WorkspaceLayoutProps): React.JSX.Element {
    const [isCanvasCollapsed, setIsCanvasCollapsed] = useState(false);
    const [isCanvasFullscreen, setIsCanvasFullscreen] = useState(false);
    const [chatWidthPercent, setChatWidthPercent] = useState(DEFAULT_CHAT_PERCENT);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const handleToggleCanvas = useCallback(() => {
        setIsCanvasCollapsed((prev) => !prev);
        // Exit fullscreen when closing canvas
        if (!isCanvasCollapsed) {
            setIsCanvasFullscreen(false);
        }
    }, [isCanvasCollapsed]);

    const handleToggleFullscreen = useCallback(() => {
        setIsCanvasFullscreen((prev) => !prev);
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        isDragging.current = true;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";

        const handleMouseMove = (moveEvent: MouseEvent) => {
            if (!isDragging.current || !containerRef.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();
            const containerWidth = containerRect.width;
            const mouseX = moveEvent.clientX - containerRect.left;

            // Calculate percentage, clamping to minimum widths
            let newPercent = (mouseX / containerWidth) * 100;
            const minChatPercent = (MIN_CHAT_WIDTH / containerWidth) * 100;
            const maxChatPercent = 100 - (MIN_CANVAS_WIDTH / containerWidth) * 100;

            newPercent = Math.max(minChatPercent, Math.min(maxChatPercent, newPercent));
            setChatWidthPercent(newPercent);
        };

        const handleMouseUp = () => {
            isDragging.current = false;
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    }, []);

    return (
        <div className="flex h-screen flex-col">
            {/* Header */}
            <WorkspaceHeader
                title={investigation.title}
                status={investigation.status}
                isCanvasCollapsed={isCanvasCollapsed}
                onToggleCanvas={handleToggleCanvas}
            />

            {/* Main content area */}
            <div ref={containerRef} className="flex flex-1 overflow-hidden">
                {/* Chat Column - hidden when canvas is fullscreen */}
                {!isCanvasFullscreen && (
                    <div
                        className={cn(
                            "flex flex-col overflow-hidden border-r border-border",
                            isCanvasCollapsed ? "w-full" : ""
                        )}
                        style={isCanvasCollapsed ? undefined : { width: `${chatWidthPercent}%` }}
                    >
                        <InvestigationChat investigation={investigation} session={session} />
                    </div>
                )}

                {/* Canvas Column */}
                {!isCanvasCollapsed && (
                    <>
                        {/* Resize Handle - hidden when fullscreen */}
                        {!isCanvasFullscreen && (
                            <div
                                className="group relative w-1 cursor-col-resize bg-border hover:bg-primary/50 transition-colors"
                                onMouseDown={handleMouseDown}
                            >
                                <div className="absolute inset-y-0 -left-1 -right-1" />
                            </div>
                        )}

                        {/* Canvas Content */}
                        <div
                            className="flex flex-col overflow-hidden"
                            style={{ width: isCanvasFullscreen ? "100%" : `${100 - chatWidthPercent}%` }}
                        >
                            <CanvasPanel
                                investigationId={investigation.id}
                                onClose={handleToggleCanvas}
                                isFullscreen={isCanvasFullscreen}
                                onToggleFullscreen={handleToggleFullscreen}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

