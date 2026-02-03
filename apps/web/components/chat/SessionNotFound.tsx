"use client";

import Link from "next/link";

export default function SessionNotFound() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-2xl font-semibold">Session not found</h2>
      <p className="text-muted-foreground max-w-md">
        The chat session you&rsquo;re trying to open could not be found or may
        have expired. You can start a brand&nbsp;new conversation instead.
      </p>
      <Link
        href="/chat"
        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Start new session
      </Link>
    </div>
  );
}
