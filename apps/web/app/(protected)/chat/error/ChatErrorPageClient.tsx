"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

export default function ChatErrorPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id: userId } = useUser();
  const message = searchParams.get("message");

  useEffect(() => {
    // Show appropriate error toast based on the error message
    if (message === "failed-to-create-session") {
      toast.error("Failed to create chat session. Please try again.");
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  }, [message]);

  const handleRetry = async (): Promise<void> => {
    if (!userId) {
      toast.error("Please sign in to continue");
      return;
    }

    try {
      toast.loading("Creating new chat session...");
      // Call server action to create session
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create session");
      }

      const { sessionId } = await response.json();
      toast.dismiss();
      toast.success("Chat session created successfully!");
      router.push(`/chat/${sessionId}`);
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to create session. Please try again later.");
      console.error("Retry session creation failed:", error);
    }
  };

  const handleGoHome = (): void => {
    router.push("/");
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
          <AlertCircle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            Unable to Start Chat
          </h1>
          <p className="text-gray-600">
            We encountered an error while setting up your chat session. This
            might be a temporary issue.
          </p>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleRetry} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button variant="outline" onClick={handleGoHome}>
            Go Home
          </Button>
        </div>

        <p className="text-sm text-gray-500">
          If this problem persists, please contact support.
        </p>
      </div>
    </div>
  );
}
