import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>

            <div className="mt-8">
                <Skeleton className="h-11 w-56" />
            </div>

            <div className="mt-8 space-y-4">
                <Skeleton className="h-6 w-48" />
                <div className="grid gap-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 border rounded-lg">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-full max-w-xs" />
                                    <Skeleton className="h-4 w-full max-w-md" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                                <Skeleton className="h-5 w-20" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
