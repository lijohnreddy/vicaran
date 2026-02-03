import React from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { cn } from "@/lib/utils";

interface ResearchEvaluatorCardProps {
  content: string;
  className?: string;
}

interface FeedbackData {
  grade: "pass" | "fail";
  feedback: string;
}

/**
 * Custom card component for Research Evaluator results
 * Displays evaluation grade and feedback in a clean, professional format
 */
export function ResearchEvaluatorCard({
  content,
  className,
}: ResearchEvaluatorCardProps) {
  // Parse JSON content to extract grade and feedback
  let feedbackData: FeedbackData | null = null;

  try {
    const parsed = JSON.parse(content);

    // Validate required fields
    if (
      parsed &&
      typeof parsed === "object" &&
      "grade" in parsed &&
      "feedback" in parsed
    ) {
      feedbackData = {
        grade: parsed.grade,
        feedback: parsed.feedback,
      };
    }
  } catch (error) {
    console.warn("Failed to parse Research Evaluator JSON:", error);
    // Will fall back to error state below
  }

  // If parsing failed or data is invalid, show error state
  if (!feedbackData) {
    return (
      <Card className={cn("border border-border p-4", className)}>
        <div className="flex items-center gap-3 mb-3">
          <XCircle className="w-5 h-5 text-destructive" />
          <span className="font-semibold text-destructive">
            EVALUATION ERROR
          </span>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-muted-foreground">
            ⚠️ Content Error:
          </h4>
          <p className="text-sm text-muted-foreground">
            Unable to parse evaluation results. Raw content:
          </p>
          <div className="bg-muted p-3 rounded text-xs font-mono break-all">
            {content}
          </div>
        </div>
      </Card>
    );
  }

  // Determine visual state based on grade
  const isPass = feedbackData.grade === "pass";
  const statusIcon = isPass ? (
    <CheckCircle className="w-5 h-5 text-black dark:text-white" />
  ) : (
    <XCircle className="w-5 h-5 text-red-600" />
  );

  const statusText = isPass ? "APPROVED FOR NEXT PHASE" : "NEEDS IMPROVEMENT";
  const statusColor = isPass ? "text-black dark:text-white" : "text-red-600";

  return (
    <Card className={cn("border-none bg-primary ", className)}>
      <div className="p-4">
        {/* Status Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            {statusIcon}
            <span className={cn("font-semibold", statusColor)}>
              {statusText}
            </span>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="space-y-3">
          <h4 className="font-medium text-black flex items-center gap-2">
            📝 Evaluator Feedback:
          </h4>
          <div className="text-foreground border-l-2 dark:border-white border-black pl-4">
            <MarkdownRenderer content={feedbackData.feedback} isUser={false} />
          </div>
        </div>
      </div>
    </Card>
  );
}
