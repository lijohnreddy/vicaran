import Link from "next/link";
import { StatusBadge, type InvestigationStatus } from "@/components/ui/StatusBadge";
import type { Investigation } from "@/lib/drizzle/schema";
import { formatDistanceToNow } from "date-fns";

interface RecentInvestigationsProps {
    investigations: Investigation[];
}

export function RecentInvestigations({ investigations }: RecentInvestigationsProps): React.JSX.Element {
    if (investigations.length === 0) {
        return (
            <div className="mt-8 text-center py-12 border border-dashed rounded-lg">
                <p className="text-muted-foreground">No investigations yet.</p>
                <p className="text-sm text-muted-foreground mt-1">
                    Start your first investigation to see it here.
                </p>
            </div>
        );
    }

    return (
        <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent Investigations</h2>
                <Link
                    href="/investigations"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    View all →
                </Link>
            </div>

            <div className="grid gap-3">
                {investigations.map((investigation) => (
                    <Link
                        key={investigation.id}
                        href={`/investigations/${investigation.id}`}
                        className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                                <h3 className="font-medium truncate">{investigation.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                    {investigation.brief}
                                </p>
                                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                    <span className="capitalize">{investigation.mode}</span>
                                    <span>•</span>
                                    <span>
                                        {formatDistanceToNow(new Date(investigation.created_at), { addSuffix: true })}
                                    </span>
                                </div>
                            </div>
                            <StatusBadge status={investigation.status as InvestigationStatus} />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
