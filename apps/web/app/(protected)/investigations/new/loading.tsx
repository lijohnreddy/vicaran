import { Skeleton } from "@/components/ui/skeleton";

export default function NewInvestigationLoading() {
    return (
        <div className="p-6 max-w-2xl mx-auto">
            <Skeleton className="h-4 w-24 mb-6" />

            <div className="space-y-2 mb-8">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-72" />
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                </div>

                <div className="space-y-2">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-24 w-full" />
                </div>

                <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <div className="grid grid-cols-2 gap-3">
                        <Skeleton className="h-24" />
                        <Skeleton className="h-24" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-10 w-full" />
                </div>

                <Skeleton className="h-11 w-40 mt-4" />
            </div>
        </div>
    );
}
