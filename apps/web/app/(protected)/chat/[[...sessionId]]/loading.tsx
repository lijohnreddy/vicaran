"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export default function ChatLoading() {
  const { state, isMobile } = useSidebar();

  return (
    <>
      {/* Messages Area Skeleton - Match ChatMessages structure */}
      <div
        className={cn(
          "h-full w-full overflow-y-auto pb-[calc(9rem+2vh)]", // Match ChatContainer padding
          isMobile && "pt-14" // Add top padding on mobile for fixed header
        )}
      >
        {/* Match ChatMessages layout exactly: p-4 space-y-4 flex flex-col justify-end */}
        <div className="w-full min-h-full p-4 space-y-4 flex flex-col justify-end">
          {/* Match WelcomeCard centered layout */}
          <div className="flex items-center justify-center flex-1">
            {/* WelcomeCard skeleton - matches the actual WelcomeCard dimensions */}
            <div className="w-full max-w-3xl mx-auto p-2 sm:p-4">
              <div className="relative overflow-hidden border-2 border-dashed border-muted-foreground/20 rounded-xl bg-gradient-to-br from-background via-background to-muted/30">
                {/* Header skeleton */}
                <div className="text-center pb-2 px-4 sm:px-6 pt-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Skeleton className="h-4 w-4 sm:h-5 sm:w-5 rounded-full" />
                    <Skeleton className="h-3 w-3 sm:h-4 sm:w-4 rounded-full" />
                  </div>
                  <Skeleton className="h-6 sm:h-7 md:h-8 w-48 mx-auto mb-1" />
                  <Skeleton className="h-4 sm:h-5 md:h-6 w-80 mx-auto" />
                </div>

                {/* Content skeleton */}
                <div className="space-y-4 px-4 sm:px-6 pb-4">
                  {/* Provider badges */}
                  <div className="text-center">
                    <Skeleton className="h-4 w-48 mx-auto mb-2" />
                    <div className="flex flex-wrap justify-center gap-1.5">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                  </div>

                  {/* Features skeleton */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center text-center p-2 sm:p-3 rounded-lg bg-muted/30"
                      >
                        <Skeleton className="h-6 w-6 rounded-full mb-1 sm:mb-2" />
                        <Skeleton className="h-4 w-full mb-0.5" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                      </div>
                    ))}
                  </div>

                  {/* Example prompts skeleton */}
                  <div className="bg-muted/20 rounded-lg p-3 sm:p-4 border border-muted-foreground/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-3 w-3 rounded-full" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-2 rounded-md bg-background/50"
                        >
                          <Skeleton className="w-1.5 h-1.5 rounded-full" />
                          <Skeleton className="h-4 flex-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Input Area Skeleton - Match ChatContainer positioning */}
      <div
        className={cn(
          "fixed bottom-0 right-0 z-40 transition-[left] duration-200 ease-linear", // Match ChatContainer positioning and transitions
          isMobile ? "left-0" : state === "collapsed" ? "left-16" : "left-64"
        )}
      >
        {/* Input area skeleton - match ChatContainer padding */}
        <div
          className={cn(
            "w-full px-4",
            isMobile ? "pb-2" : "pb-4" // Match ChatContainer mobile padding
          )}
        >
          <div className="max-w-4xl mx-auto">
            <div className="space-y-3 mb-2">
              {/* Textarea Skeleton - 3 rows */}
              <div className="w-full">
                <Skeleton className="w-full h-[88px]" />
              </div>

              {/* Controls Row: Attachment + Model Selector + Send */}
              <div className="flex items-center gap-3">
                {/* Attachment Button */}
                <Skeleton className="h-10 w-10 shrink-0" />

                {/* Model Selector */}
                <Skeleton className="h-10 w-[200px]" />

                {/* Spacer */}
                <div className="flex-1" />

                {/* Send Button */}
                <Skeleton className="h-10 w-10 shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
