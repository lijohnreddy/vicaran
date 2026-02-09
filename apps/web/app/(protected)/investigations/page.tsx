import { getUserInvestigations } from "@/lib/queries/investigations";
import { createClient } from "@/lib/supabase/server";
import { InvestigationsList } from "@/components/investigations/InvestigationsList";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function InvestigationsPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    try {
        const investigations = await getUserInvestigations(user.id);

        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Investigation History</h1>
                    <p className="text-muted-foreground">
                        View and manage all your past investigations.
                    </p>
                </div>

                <InvestigationsList investigations={investigations} />
            </div>
        );
    } catch (error) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Investigation History</h1>
                    <p className="text-muted-foreground">
                        View and manage all your past investigations.
                    </p>
                </div>
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Failed to load investigations:{" "}
                        {error instanceof Error ? error.message : "Unknown error"}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }
}
