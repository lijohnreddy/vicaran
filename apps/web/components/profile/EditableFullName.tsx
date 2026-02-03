"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, X, Check } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";

export function EditableFullName() {
  const { full_name } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(full_name || "");
  const [isSaving, setIsSaving] = useState(false);
  const [currentFullName, setCurrentFullName] = useState(full_name || "");

  const handleStartEdit = () => {
    setEditValue(currentFullName);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditValue(currentFullName);
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!editValue.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: editValue.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to update name");
      }

      setCurrentFullName(editValue.trim());
      setIsEditing(false);
      toast.success(
        "Name updated successfully. Please refresh to see changes."
      );
    } catch (error) {
      console.error("Error updating full name:", error);
      toast.error("Failed to update name");
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder="Enter your full name"
            maxLength={100}
            disabled={isSaving}
            className="flex-1"
            autoFocus
          />
          <Button
            size="sm"
            onClick={handleSaveEdit}
            disabled={isSaving}
            className="h-8 w-8 p-0"
          >
            <Check className="h-4 w-4" />
            <span className="sr-only">Save</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancelEdit}
            disabled={isSaving}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Cancel</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group">
      <p className="text-sm flex-1">
        {currentFullName || (
          <span className="text-muted-foreground italic">Not provided</span>
        )}
      </p>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleStartEdit}
        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Edit2 className="h-3 w-3" />
        <span className="sr-only">Edit full name</span>
      </Button>
    </div>
  );
}
