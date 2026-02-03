"use client";

import { useState } from "react";
import { type GroupedSessions } from "@/lib/history";
import { SessionRow } from "./SessionRow";

export function SessionTable({
  sessions: initialSessions,
}: {
  sessions: GroupedSessions;
}) {
  const [sessions, setSessions] = useState(initialSessions);

  const sections = [
    { key: "today", title: "Today", data: sessions.today },
    { key: "yesterday", title: "Yesterday", data: sessions.yesterday },
    { key: "thisWeek", title: "This Week", data: sessions.thisWeek },
    { key: "older", title: "Older", data: sessions.older },
  ].filter((section) => section.data.length > 0);

  const handleSessionRenamed = (sessionId: string, newTitle: string) => {
    setSessions((prev) => {
      // Find which category contains the session and update only that one
      const categories = ["today", "yesterday", "thisWeek", "older"] as const;

      for (const category of categories) {
        const categorySessions = prev[category];
        const sessionIndex = categorySessions.findIndex(
          (sess) => sess.id === sessionId
        );

        if (sessionIndex !== -1) {
          return {
            ...prev,
            [category]: categorySessions.map((sess, index) =>
              index === sessionIndex ? { ...sess, title: newTitle } : sess
            ),
          };
        }
      }

      // Session not found (shouldn't happen), return unchanged
      return prev;
    });
  };

  const handleSessionDeleted = (sessionId: string) => {
    setSessions((prev) => {
      // Find which category contains the session and remove from only that one
      const categories = ["today", "yesterday", "thisWeek", "older"] as const;

      for (const category of categories) {
        const categorySessions = prev[category];
        const sessionIndex = categorySessions.findIndex(
          (sess) => sess.id === sessionId
        );

        if (sessionIndex !== -1) {
          return {
            ...prev,
            [category]: categorySessions.filter(
              (sess) => sess.id !== sessionId
            ),
          };
        }
      }

      // Session not found (shouldn't happen), return unchanged
      return prev;
    });
  };

  return (
    <div>
      <div className="rounded-md border">
        {/* Table Header */}
        <div className="border-b bg-muted/50 p-4">
          <div className="grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-4 text-sm font-medium text-muted-foreground">
            <div>Name</div>
            <div className="hidden md:block">Date</div>
          </div>
        </div>

        {/* Session Sections */}
        <div className="divide-y">
          {sections.map((section) => (
            <div key={section.key}>
              {/* Section Header */}
              <div className="bg-muted/25 px-4 py-2 border-b">
                <h3 className="text-sm font-medium text-foreground">
                  {section.title}
                </h3>
              </div>

              {/* Section Sessions */}
              <div className="divide-y">
                {section.data.map((session) => (
                  <SessionRow
                    key={session.id}
                    session={session}
                    onRenamed={handleSessionRenamed}
                    onDeleted={handleSessionDeleted}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
