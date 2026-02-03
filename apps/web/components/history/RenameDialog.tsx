"use client";

import { useState, useEffect } from "react";
import { updateSessionTitle } from "@/app/actions/session-names";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface RenameDialogProps {
  sessionId: string;
  currentTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (sessionId: string, newTitle: string) => void;
}

export function RenameDialog({
  sessionId,
  currentTitle,
  open,
  onOpenChange,
  onSuccess,
}: RenameDialogProps) {
  const [title, setTitle] = useState(currentTitle);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(currentTitle);
  }, [currentTitle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Title cannot be empty");
      return;
    }

    if (trimmedTitle === currentTitle) {
      onOpenChange(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await updateSessionTitle(sessionId, trimmedTitle);

      if (!result.success) {
        setError(result.error || "Failed to rename session");
      } else {
        onSuccess?.(sessionId, trimmedTitle);
        toast.success("Session renamed successfully");
        onOpenChange(false);
        setError(null);
      }
    } catch (error) {
      console.error("Error renaming session:", error);
      setError("Failed to rename session");
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
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Rename Session</DialogTitle>
            <DialogDescription>
              Give your session a memorable name to make it easier to find
              later.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a new title for your session"
                maxLength={100}
                disabled={isLoading}
                autoFocus
                onFocus={(e) => e.target.select()}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </div>

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
              type="submit"
              disabled={
                isLoading || !title.trim() || title.trim() === currentTitle
              }
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
