"use client";

import React, { ReactNode } from "react";
import { toast } from "sonner";

interface ChatErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ChatErrorBoundaryProps {
  children: ReactNode;
}

/**
 * Error boundary for chat functionality with user-friendly fallback UI
 * Catches React errors in chat components and provides recovery options
 */
export class ChatErrorBoundary extends React.Component<
  ChatErrorBoundaryProps,
  ChatErrorBoundaryState
> {
  constructor(props: ChatErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ChatErrorBoundaryState {
    // Update state to show error UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error for debugging
    console.error("ChatErrorBoundary caught an error:", error, errorInfo);

    // Show user-friendly error toast
    toast.error("Chat Error", {
      description:
        "Something went wrong with the chat. Please refresh the page.",
      duration: 8000,
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Fallback UI when error occurs
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <div className="mb-4">
            <svg
              className="w-12 h-12 text-muted-foreground mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.232 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">
            Chat Temporarily Unavailable
          </h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            We&rsquo;re experiencing a technical issue with the chat system.
            Please refresh the page to try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
