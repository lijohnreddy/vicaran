import { Suspense } from "react";
import ChatErrorPageClient from "./ChatErrorPageClient";

export default function ChatErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          Loading...
        </div>
      }
    >
      <ChatErrorPageClient />
    </Suspense>
  );
}
