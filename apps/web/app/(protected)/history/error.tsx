"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface HistoryErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function HistoryError({ error, reset }: HistoryErrorProps) {
  useEffect(() => {
    console.error("History page error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Chat History</h1>
        <p className="text-muted-foreground">
          View and manage your previous sessions and chat sessions.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center text-center py-12">
        <div className="mb-4 rounded-full bg-destructive/10 p-3">
          <svg
            className="h-6 w-6 text-destructive"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0l-5.898 6.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-4 max-w-sm">
          We encountered an error while loading your session history. This might
          be a temporary issue.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={reset} className="px-6">
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/chat")}
            className="px-6"
          >
            Go to Chat
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
