import { Skeleton } from "@/components/ui/skeleton";

export default function InvestigationLoading() {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Skeleton className="h-4 w-24 mb-6" />

            <div className="flex items-start justify-between gap-4 mb-8">
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-full max-w-md" />
                </div>
                <Skeleton className="h-5 w-20" />
            </div>

            <div className="flex items-center gap-4 mb-8">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
            </div>

            <div className="border rounded-lg p-8 flex flex-col items-center">
                <Skeleton className="h-8 w-8 rounded-full mb-4" />
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-72" />
            </div>
        </div>
    );
}
