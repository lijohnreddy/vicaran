"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Pencil } from "lucide-react";
import { filterMarkers, hideBackendIds } from "@/lib/chat/content-filter";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface InvestigationPlanCardProps {
    content: string;
    onApprove?: () => void;
    onEdit?: () => void;
}

/**
 * Investigation Plan Card
 * 
 * Renders the investigation plan as a centered, invitation-style card
 * with glassmorphism styling. Hides [PLAN_APPROVAL_REQUIRED] marker
 * and shows approval buttons instead.
 */
export function InvestigationPlanCard({
    content,
    onApprove,
    onEdit,
}: InvestigationPlanCardProps) {
    // Filter out markers and IDs
    const { cleanContent, hasPlanApproval } = filterMarkers(content);
    const displayContent = hideBackendIds(cleanContent);

    return (
        <div className="flex justify-center w-full my-4">
            <div className="w-full max-w-2xl">
                {/* Glassmorphism card */}
                <div className="relative overflow-hidden rounded-xl border border-border/50 bg-background/80 backdrop-blur-sm shadow-lg dark:bg-slate-900/80">
                    {/* Content */}
                    <div className="p-6">
                        <MarkdownRenderer
                            content={displayContent}
                            isUser={false}
                            className="prose-headings:text-center prose-h2:text-xl prose-h2:mt-0"
                        />
                    </div>

                    {/* Action buttons */}
                    {hasPlanApproval && (
                        <div className="flex justify-center gap-4 px-6 pb-6">
                            <Button
                                onClick={onApprove}
                                className="gap-2"
                                size="lg"
                            >
                                <CheckCircle2 className="!w-5 !h-5" strokeWidth={2.5} />
                                Approve Plan
                            </Button>
                            <Button
                                onClick={onEdit}
                                variant="outline"
                                className="gap-2"
                                size="lg"
                            >
                                <Pencil className="!w-5 !h-5" strokeWidth={2.5} />
                                Edit Plan
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
