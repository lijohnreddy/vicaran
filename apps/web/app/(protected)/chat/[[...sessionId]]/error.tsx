"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function ChatError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Chat page error:", error);
  }, [error]);

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md space-y-4">
        <div className="flex justify-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>

        <h2 className="text-xl font-semibold">Something went wrong</h2>

        <p className="text-muted-foreground">
          We encountered an error while loading your conversation. This might be
          due to a network issue or a temporary problem with our servers.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>

          <Button
            variant="outline"
            onClick={() => (window.location.href = "/chat")}
          >
            Start new chat
          </Button>
        </div>

        {error.digest && (
          <p className="text-xs text-muted-foreground mt-4">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
