"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, PanelRightOpen } from "lucide-react";
import type { Investigation } from "@/lib/drizzle/schema/investigations";

type InvestigationStatus = Investigation["status"];

interface WorkspaceHeaderProps {
    title: string;
    status: InvestigationStatus;
    isCanvasCollapsed: boolean;
    onToggleCanvas: () => void;
}

/**
 * Header bar for the investigation workspace
 * Shows title, status badge, export button, and canvas toggle
 */
export function WorkspaceHeader({
    title,
    status,
    isCanvasCollapsed,
    onToggleCanvas,
}: WorkspaceHeaderProps): React.JSX.Element {
    const getStatusColor = (status: InvestigationStatus): string => {
        switch (status) {
            case "active":
                return "bg-blue-500/20 text-blue-600 dark:text-blue-400";
            case "completed":
                return "bg-green-500/20 text-green-600 dark:text-green-400";
            case "failed":
                return "bg-red-500/20 text-red-600 dark:text-red-400";
            case "partial":
                return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400";
            case "pending":
            default:
                return "bg-gray-500/20 text-gray-600 dark:text-gray-400";
        }
    };

    const getStatusLabel = (status: InvestigationStatus): string => {
        switch (status) {
            case "active":
                return "In Progress";
            case "completed":
                return "Completed";
            case "failed":
                return "Failed";
            case "partial":
                return "Partial";
            case "pending":
            default:
                return "Pending";
        }
    };

    return (
        <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4">
            {/* Left: Title and Status */}
            <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold truncate max-w-md">{title}</h1>
                <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}
                >
                    {getStatusLabel(status)}
                </span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                {/* Export PDF - Placeholder */}
                <Button variant="outline" size="sm" disabled>
                    <FileText className="mr-2 h-4 w-4" />
                    Export PDF
                </Button>

                {/* Canvas Toggle (only show when collapsed) */}
                {isCanvasCollapsed && (
                    <Button variant="outline" size="sm" onClick={onToggleCanvas}>
                        <PanelRightOpen className="mr-2 h-4 w-4" />
                        Open Canvas
                    </Button>
                )}
            </div>
        </header>
    );
}
