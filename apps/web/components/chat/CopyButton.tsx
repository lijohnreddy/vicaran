/**
 * CopyButton Component
 *
 * Enhanced copy button with visual feedback, animations, and toast notifications
 * for copying function call data, JSON responses, and other text content.
 */

"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  label?: string;
  successMessage?: string;
  errorMessage?: string;
  variant?: "ghost" | "outline" | "secondary";
  size?: "sm" | "md" | "lg";
  showToast?: boolean;
  className?: string;
}

/**
 * Get size classes for button styling
 */
function getSizeClasses(size: CopyButtonProps["size"]): string {
  switch (size) {
    case "sm":
      return "h-6 w-6 p-0";
    case "lg":
      return "h-10 w-10 p-0";
    case "md":
    default:
      return "h-8 w-8 p-0";
  }
}

/**
 * Get icon size based on button size
 */
function getIconSize(size: CopyButtonProps["size"]): string {
  switch (size) {
    case "sm":
      return "h-3 w-3";
    case "lg":
      return "h-5 w-5";
    case "md":
    default:
      return "h-4 w-4";
  }
}

/**
 * Copy state type
 */
type CopyState = "idle" | "copying" | "success" | "error";

/**
 * Enhanced CopyButton component
 */
export function CopyButton({
  text,
  label,
  successMessage = "Copied to clipboard",
  errorMessage = "Failed to copy",
  variant = "ghost",
  size = "sm",
  showToast = true,
  className,
}: CopyButtonProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  // Reset state after success/error
  useEffect(() => {
    if (copyState === "success" || copyState === "error") {
      const timer = setTimeout(() => {
        setCopyState("idle");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copyState]);

  const handleCopy = async (): Promise<void> => {
    if (copyState === "copying") return;

    setCopyState("copying");

    try {
      // Use modern clipboard API if available
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (!successful) {
          throw new Error("Fallback copy failed");
        }
      }

      setCopyState("success");

      if (showToast) {
        toast.success(successMessage, {
          description: `${text.length} characters copied`,
          duration: 2000,
        });
      }
    } catch (error) {
      setCopyState("error");

      if (showToast) {
        toast.error(errorMessage, {
          description: "Please try selecting and copying manually",
          duration: 3000,
        });
      }

      console.error("Failed to copy text:", error);
    }
  };

  const sizeClasses = getSizeClasses(size);
  const iconSize = getIconSize(size);

  // Determine button appearance based on state
  const getButtonClasses = () => {
    const baseClasses = cn(sizeClasses, "transition-all duration-200");

    switch (copyState) {
      case "success":
        return cn(
          baseClasses,
          "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
        );
      case "error":
        return cn(
          baseClasses,
          "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
        );
      case "copying":
        return cn(
          baseClasses,
          "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 animate-pulse"
        );
      default:
        return baseClasses;
    }
  };

  // Get appropriate icon for current state
  const getIcon = () => {
    switch (copyState) {
      case "success":
        return (
          <Check
            className={cn(iconSize, "animate-in zoom-in-50 duration-200")}
          />
        );
      case "error":
        return (
          <AlertCircle
            className={cn(iconSize, "animate-in zoom-in-50 duration-200")}
          />
        );
      case "copying":
        return <Copy className={cn(iconSize, "animate-pulse")} />;
      default:
        return <Copy className={iconSize} />;
    }
  };

  // Get tooltip text based on state
  const getTooltipText = () => {
    switch (copyState) {
      case "success":
        return successMessage;
      case "error":
        return errorMessage;
      case "copying":
        return "Copying...";
      default:
        return label || "Copy to clipboard";
    }
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleCopy}
      disabled={copyState === "copying"}
      className={cn(getButtonClasses(), className)}
      title={getTooltipText()}
      aria-label={getTooltipText()}
    >
      {getIcon()}
    </Button>
  );
}

export default CopyButton;
