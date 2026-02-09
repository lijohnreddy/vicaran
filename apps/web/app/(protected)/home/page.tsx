import { getCurrentUserWithRole } from "@/lib/auth";
import { getRecentInvestigations } from "@/lib/queries/investigations";
import { RecentInvestigations } from "@/components/home/RecentInvestigations";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function HomePage() {
    const userData = await getCurrentUserWithRole();

    if (!userData) {
        throw new Error("User not authenticated");
    }

    const { user } = userData;
    const recentInvestigations = await getRecentInvestigations(user.id, 5);

    // Extract first name from email (before @) or full_name if available
    const displayName = user.full_name?.split(" ")[0] || user.email?.split("@")[0] || "there";

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">
                    Welcome back, {displayName}!
                </h1>
                <p className="text-muted-foreground">
                    Start a new investigation or continue where you left off.
                </p>
            </div>

            <div className="mt-8">
                <Link href="/investigations/new">
                    <Button size="lg" className="gap-2">
                        <Plus className="h-5 w-5" />
                        Start New Investigation
                    </Button>
                </Link>
            </div>

            <RecentInvestigations investigations={recentInvestigations} />
        </div>
    );
}
