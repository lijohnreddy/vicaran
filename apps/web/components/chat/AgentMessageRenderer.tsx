import React from "react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { ResearchEvaluatorCard } from "./ResearchEvaluatorCard";
import { ReportWithDownload } from "./ReportWithDownload";

interface AgentMessageRendererProps {
  content: string;
  agent?: string;
  isUser: boolean;
  className?: string;
}

/**
 * Router component for agent-specific message rendering
 * Detects specific agent types and renders custom components, falls back to MarkdownRenderer
 */
export function AgentMessageRenderer({
  content,
  agent,
  isUser,
  className,
}: AgentMessageRendererProps) {
  // If this is a user message, always use standard markdown rendering
  if (isUser) {
    return (
      <MarkdownRenderer
        content={content}
        isUser={isUser}
        className={className}
      />
    );
  }

  // Detect Research Evaluator messages by agent name and JSON content structure
  if (agent === "research_evaluator") {
    return (
      <div className={className}>
        <ResearchEvaluatorCard content={content} />
      </div>
    );
  }

  // Report Composer gets full markdown with download button
  if (agent === "report_composer") {
    return (
      <div className={className}>
        <ReportWithDownload content={content} />
      </div>
    );
  }

  // All other agents get standard markdown rendering
  return (
    <MarkdownRenderer content={content} isUser={isUser} className={className} />
  );
}
