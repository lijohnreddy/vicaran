"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateSessionTitle } from "@/app/actions/session-names";
import { Check, X, Edit3 } from "lucide-react";
import { toast } from "sonner";

interface EditableSessionTitleProps {
  sessionId: string;
  initialTitle: string;
  fallbackTitle?: string;
  className?: string;
}

export function EditableSessionTitle({
  sessionId,
  initialTitle,
  fallbackTitle = "New Session",
  className = "",
}: EditableSessionTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle || fallbackTitle);
  const [tempTitle, setTempTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update title when initialTitle changes (e.g., from AI generation)
  useEffect(() => {
    if (initialTitle && initialTitle !== title) {
      setTitle(initialTitle);
    }
  }, [initialTitle, title]);

  const startEditing = () => {
    setTempTitle(title);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setTempTitle("");
    setIsEditing(false);
  };

  const saveTitle = async () => {
    if (tempTitle.trim() === title.trim()) {
      // No change, just cancel
      cancelEditing();
      return;
    }

    if (!tempTitle.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    setIsSaving(true);

    try {
      const result = await updateSessionTitle(sessionId, tempTitle.trim());

      if (result.success) {
        setTitle(tempTitle.trim());
        setIsEditing(false);
        setTempTitle("");
        toast.success("Session title updated");
      } else {
        toast.error(result.error || "Failed to update title");
      }
    } catch (error) {
      console.error("Failed to update session title:", error);
      toast.error("Failed to update title");
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveTitle();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelEditing();
    }
  };

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Input
          ref={inputRef}
          value={tempTitle}
          onChange={(e) => setTempTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          className="text-sm font-medium h-8"
          placeholder="Enter session title..."
          disabled={isSaving}
        />
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
            onClick={(e) => {
              e.stopPropagation();
              saveTitle();
            }}
            disabled={isSaving}
            title="Save title"
          >
            <Check className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              cancelEditing();
            }}
            disabled={isSaving}
            title="Cancel"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`group flex items-center gap-2 ${className}`}>
      <span className="text-sm font-medium text-foreground truncate">
        {title}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
        onClick={(e) => {
          e.stopPropagation();
          startEditing();
        }}
        title="Edit title"
      >
        <Edit3 className="h-3 w-3" />
      </Button>
    </div>
  );
}
