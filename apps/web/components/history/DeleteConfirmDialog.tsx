"use client";

import { useState } from "react";
import { deleteSession } from "@/app/actions/history";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface DeleteConfirmDialogProps {
  sessionId: string;
  sessionTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (sessionId: string) => void;
}

export function DeleteConfirmDialog({
  sessionId,
  sessionTitle,
  open,
  onOpenChange,
  onSuccess,
}: DeleteConfirmDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await deleteSession(sessionId);

      if (result.error) {
        setError(result.error);
      } else {
        onSuccess?.(sessionId);
        toast.success("Session deleted successfully");
        onOpenChange(false);
        setError(null);
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      setError("Failed to delete session");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isLoading) {
      onOpenChange(newOpen);
      if (!newOpen) {
        setError(null);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Session</DialogTitle>
          <DialogDescription className="break-words">
            Are you sure you want to delete &ldquo;
            <span className="break-all sm:break-words">{sessionTitle}</span>
            &rdquo;? This action cannot be undone and all messages in this
            session will be permanently removed.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="py-2">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
