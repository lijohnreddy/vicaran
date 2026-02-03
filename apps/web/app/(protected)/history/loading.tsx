import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl overflow-hidden">
      {/* Page Header */}
      <div className="mb-8">
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-full max-w-md" />
      </div>

      {/* Main Content */}
      <div>
        <div className="rounded-md border overflow-hidden">
          {/* Table Header */}
          <div className="border-b bg-muted/50 p-4 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-4 w-full overflow-hidden">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-10 hidden md:block" />
            </div>
          </div>

          {/* Time Period Sections */}
          <div className="divide-y">
            {/* Today Section */}
            <div>
              <div className="bg-muted/25 px-4 py-2 border-b">
                <Skeleton className="h-5 w-12" />
              </div>
              <div className="divide-y">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-4 w-full overflow-hidden">
                      <div className="min-w-0 md:flex md:items-center pr-10 md:pr-0">
                        <div className="truncate w-full">
                          <Skeleton className="h-4 w-32 md:w-48 mb-1" />
                        </div>
                        <div className="flex items-center gap-2 md:hidden mt-1">
                          <Skeleton className="h-3 w-14" />
                        </div>
                      </div>
                      <div className="hidden md:flex md:items-center md:justify-between">
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Yesterday Section */}
            <div>
              <div className="bg-muted/25 px-4 py-2 border-b">
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="divide-y">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="p-4 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-4 w-full overflow-hidden">
                      <div className="min-w-0 md:flex md:items-center pr-10 md:pr-0">
                        <div className="truncate w-full">
                          <Skeleton className="h-4 w-32 md:w-48 mb-1" />
                        </div>
                        <div className="flex items-center gap-2 md:hidden mt-1">
                          <Skeleton className="h-3 w-14" />
                        </div>
                      </div>
                      <div className="hidden md:flex md:items-center md:justify-between">
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* This Week Section */}
            <div>
              <div className="bg-muted/25 px-4 py-2 border-b">
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="divide-y">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="p-4 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-4 w-full overflow-hidden">
                      <div className="min-w-0 md:flex md:items-center pr-10 md:pr-0">
                        <div className="truncate w-full">
                          <Skeleton className="h-4 w-32 md:w-48 mb-1" />
                        </div>
                        <div className="flex items-center gap-2 md:hidden mt-1">
                          <Skeleton className="h-3 w-14" />
                        </div>
                      </div>
                      <div className="hidden md:flex md:items-center md:justify-between">
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
