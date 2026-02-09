"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Trash2, Zap, Search } from "lucide-react";
import { StatusBadge, type InvestigationStatus } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteInvestigationDialog } from "./DeleteInvestigationDialog";
import type { Investigation } from "@/lib/drizzle/schema";

interface InvestigationCardProps {
    investigation: Investigation;
    onDeleted?: () => void;
}

export function InvestigationCard({ investigation, onDeleted }: InvestigationCardProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    return (
        <>
            <div className="group relative border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <Link
                    href={`/investigations/${investigation.id}`}
                    className="absolute inset-0 z-0"
                    aria-label={`View ${investigation.title}`}
                />

                <div className="relative z-10 pointer-events-none">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                            <h3 className="font-medium truncate">{investigation.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {investigation.brief}
                            </p>

                            <div className="flex items-center flex-wrap gap-2 mt-3">
                                {/* Mode Badge */}
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    {investigation.mode === "quick" ? (
                                        <Zap className="h-3 w-3" />
                                    ) : (
                                        <Search className="h-3 w-3" />
                                    )}
                                    {investigation.mode === "quick" ? "Quick" : "Detailed"}
                                </Badge>

                                {/* Status Badge */}
                                <StatusBadge status={investigation.status as InvestigationStatus} />

                                {/* Timestamp */}
                                <span className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(investigation.created_at), {
                                        addSuffix: true,
                                    })}
                                </span>
                            </div>
                        </div>

                        {/* Delete Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowDeleteDialog(true);
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                        </Button>
                    </div>
                </div>
            </div>

            <DeleteInvestigationDialog
                investigationId={investigation.id}
                investigationTitle={investigation.title}
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                onDeleted={onDeleted}
            />
        </>
    );
}
