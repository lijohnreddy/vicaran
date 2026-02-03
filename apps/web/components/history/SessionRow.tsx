"use client";

import { useState } from "react";
import { type SessionWithDetails } from "@/lib/history";
import { Button } from "@/components/ui/button";
import { RenameDialog } from "@/components/history/RenameDialog";
import { DeleteConfirmDialog } from "@/components/history/DeleteConfirmDialog";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SessionRowProps {
  session: SessionWithDetails;
  onRenamed?: (sessionId: string, newTitle: string) => void;
  onDeleted?: (sessionId: string) => void;
}

export function SessionRow({ session, onRenamed, onDeleted }: SessionRowProps) {
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const displayTitle = session.title || "New Session";
  const formattedDate = new Date(session.updated_at).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <>
      <div
        className="relative group p-4 hover:bg-muted/50 transition-colors cursor-pointer"
        onClick={() => {
          window.location.href = `/chat/${session.id}`;
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-4">
          {/* Name Column */}
          <div className="min-w-0 md:flex md:items-center pr-10 md:pr-0">
            <h4 className="text-sm font-medium text-foreground truncate">
              {displayTitle}
            </h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground md:hidden mt-1">
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Date Column with Actions (desktop only) */}
          <div className="hidden md:flex md:items-center md:justify-between">
            <div className="text-sm text-muted-foreground">{formattedDate}</div>

            {/* Desktop Action Buttons */}
            <div
              className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowRenameDialog(true)}
                title="Rename session"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                onClick={() => setShowDeleteDialog(true)}
                title="Delete session"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Action Menu */}
        <div
          className="md:hidden absolute top-3 right-3"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 transition-all bg-white/5"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 dark:bg-muted">
              <DropdownMenuItem
                onClick={() => setShowRenameDialog(true)}
                className="text-foreground"
              >
                <Edit className="h-4 w-4 mr-2 text-foreground" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-500"
              >
                <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Dialogs */}
      <RenameDialog
        sessionId={session.id}
        currentTitle={displayTitle}
        open={showRenameDialog}
        onOpenChange={setShowRenameDialog}
        onSuccess={onRenamed}
      />

      <DeleteConfirmDialog
        sessionId={session.id}
        sessionTitle={displayTitle}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onSuccess={onDeleted}
      />
    </>
  );
}
