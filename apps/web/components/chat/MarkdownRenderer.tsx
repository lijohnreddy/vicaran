"use client";

import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  isUser?: boolean;
  className?: string;
  forceColors?: boolean; // Force explicit colors for PDF generation
}

/**
 * Markdown renderer component for chat messages
 * Handles proper styling for both user and AI messages
 */
export function MarkdownRenderer({
  content,
  isUser = false,
  className = "",
  forceColors = false,
}: MarkdownRendererProps) {
  // Base text colors based on message type
  // When forceColors is true, use explicit black for PDF generation
  const baseTextColor = forceColors
    ? "text-black"
    : isUser
    ? "text-chat-user-fg"
    : "text-chat-assistant-fg";
  const mutedTextColor = forceColors
    ? "text-gray-600"
    : isUser
    ? "text-chat-user-fg/80"
    : "text-chat-assistant-fg/80";

  // Custom components for consistent styling
  const components: Partial<Components> = {
    h1: ({ children, ...props }) => (
      <h1
        className={`text-2xl sm:text-3xl font-bold mb-4 ${baseTextColor} leading-tight`}
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        className={`text-xl sm:text-2xl font-semibold mb-3 ${baseTextColor} leading-tight`}
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        className={`text-lg sm:text-xl font-semibold mb-3 ${baseTextColor} leading-tight`}
        {...props}
      >
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4
        className={`text-base sm:text-lg font-semibold mb-2 ${baseTextColor} leading-tight`}
        {...props}
      >
        {children}
      </h4>
    ),
    h5: ({ children, ...props }) => (
      <h5
        className={`text-sm sm:text-base font-semibold mb-2 ${baseTextColor} leading-tight`}
        {...props}
      >
        {children}
      </h5>
    ),
    h6: ({ children, ...props }) => (
      <h6
        className={`text-sm font-semibold mb-2 ${baseTextColor} leading-tight`}
        {...props}
      >
        {children}
      </h6>
    ),
    p: ({ children, ...props }) => (
      <p
        className={`mb-3 leading-relaxed text-sm sm:text-base ${baseTextColor} last:mb-0`}
        {...props}
      >
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul
        className={`list-disc list-inside mb-3 space-y-1 text-sm sm:text-base ${baseTextColor}`}
        {...props}
      >
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol
        className={`list-decimal list-inside mb-3 space-y-1 text-sm sm:text-base ${baseTextColor}`}
        {...props}
      >
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className={`leading-relaxed ${baseTextColor}`} {...props}>
        {children}
      </li>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote
        className={`border-l-4 border-blue-400 pl-4 py-2 mb-3 text-sm sm:text-base ${
          forceColors
            ? "bg-gray-50"
            : isUser
            ? "bg-chat-user-fg/10"
            : "bg-chat-assistant-fg/10"
        } rounded-r italic ${mutedTextColor}`}
        {...props}
      >
        {children}
      </blockquote>
    ),
    code: ({ children, ...props }) => (
      <code
        className={`${
          forceColors
            ? "bg-gray-100 text-black border border-gray-300"
            : isUser
            ? "bg-chat-user-fg/20 text-chat-user-fg border border-chat-user-fg/30"
            : "bg-chat-assistant-fg/20 text-chat-assistant-fg border border-chat-assistant-fg/30"
        } px-2 py-1 rounded-md text-xs sm:text-sm font-mono font-medium`}
        {...props}
      >
        {children}
      </code>
    ),
    pre: ({ children, ...props }) => (
      <pre
        className={`${
          forceColors
            ? "bg-gray-50 text-black border-gray-300"
            : isUser
            ? "bg-chat-user-fg/15 text-chat-user-fg border-chat-user-fg/30"
            : "bg-chat-assistant-fg/15 text-chat-assistant-fg border-chat-assistant-fg/30"
        } p-3 rounded-lg mb-3 overflow-x-auto border text-xs sm:text-sm`}
        {...props}
      >
        {children}
      </pre>
    ),
    table: ({ children, ...props }) => (
      <div className="mb-3 overflow-x-auto">
        <table
          className={`min-w-full border-collapse border text-sm ${
            forceColors
              ? "border-gray-300"
              : isUser
              ? "border-chat-user-fg/30"
              : "border-chat-assistant-fg/30"
          } ${baseTextColor}`}
          {...props}
        >
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th
        className={`border ${
          forceColors
            ? "border-gray-300 bg-gray-100"
            : isUser
            ? "border-chat-user-fg/30 bg-chat-user-fg/10"
            : "border-chat-assistant-fg/30 bg-chat-assistant-fg/10"
        } px-3 py-2 text-left font-semibold text-xs sm:text-sm ${baseTextColor}`}
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td
        className={`border ${
          forceColors
            ? "border-gray-300"
            : isUser
            ? "border-chat-user-fg/30"
            : "border-chat-assistant-fg/30"
        } px-3 py-2 text-xs sm:text-sm ${baseTextColor}`}
        {...props}
      >
        {children}
      </td>
    ),
    a: ({ children, href, ...props }) => (
      <a
        className={`${
          forceColors
            ? "text-blue-700 hover:text-blue-800"
            : "text-blue-700 dark:text-white hover:text-blue-800 dark:hover:text-white"
        } underline underline-offset-2 transition-colors duration-200 font-medium`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    ),
    strong: ({ children, ...props }) => (
      <strong className={`font-bold ${baseTextColor}`} {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }) => (
      <em className={`italic ${baseTextColor}`} {...props}>
        {children}
      </em>
    ),
    hr: ({ ...props }) => (
      <hr
        className={`my-6 border-0 h-0.5 ${
          forceColors
            ? "bg-gray-300"
            : isUser
            ? "bg-secondary-foreground/30"
            : "bg-black/30"
        } rounded-full`}
        {...props}
      />
    ),
  };

  return (
    <div
      className={`markdown-content ${className} ${
        forceColors ? "pdf-safe-text" : ""
      }`}
    >
      <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
