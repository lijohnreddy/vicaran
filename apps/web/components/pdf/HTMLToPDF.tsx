"use client";

import React, { useRef } from "react";
import { MarkdownRenderer } from "../chat/MarkdownRenderer";

interface HTMLToPDFProps {
  content: string;
  title?: string;
  subtitle?: string;
}

export const HTMLToPDF: React.FC<HTMLToPDFProps> = ({
  content,
  title = "Competitor Analysis Report",
  subtitle = "Strategic Market Intelligence Report",
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div style={{ display: "none" }} ref={contentRef}>
      <div
        style={{
          padding: "40px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          backgroundColor: "white",
          color: "black",
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: "30px",
            borderBottom: "2px solid #e5e7eb",
            paddingBottom: "20px",
          }}
        >
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              margin: "0 0 10px 0",
              color: "#1f2937",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#6b7280",
              margin: "0",
            }}
          >
            {subtitle}
          </p>
          <p
            style={{
              fontSize: "12px",
              color: "#9ca3af",
              margin: "10px 0 0 0",
            }}
          >
            Generated on {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div style={{ lineHeight: "1.6" }}>
          <MarkdownRenderer content={content} />
        </div>
      </div>
    </div>
  );
};
