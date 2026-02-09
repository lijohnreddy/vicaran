import { notFound } from "next/navigation";
import { getInvestigation } from "@/lib/queries/investigations";
import { requireUserId } from "@/lib/auth";
import { AdkSessionService } from "@/lib/adk/session-service";
import { WorkspaceLayout } from "@/components/investigations/WorkspaceLayout";
import { Loader2 } from "lucide-react";

interface InvestigationPageProps {
    params: Promise<{ investigationId: string }>;
}

export default async function InvestigationPage({ params }: InvestigationPageProps) {
    const { investigationId } = await params;
    const userId = await requireUserId();

    // Fetch investigation from database
    const investigation = await getInvestigation(investigationId, userId);

    if (!investigation) {
        notFound();
    }

    // Fetch ADK session with events
    let session = null;
    if (investigation.session_id) {
        try {
            session = await AdkSessionService.getSessionWithEvents(
                userId,
                investigation.session_id
            );
        } catch (error) {
            console.error("Failed to fetch session:", error);
            // Continue without session - the chat will show loading state
        }
    }

    // If no session exists yet, show loading state
    if (!session) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <h2 className="text-lg font-medium mb-2">
                        Setting up investigation...
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        The AI agent is being initialized. This page will refresh automatically.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <WorkspaceLayout
            investigation={investigation}
            session={session}
        />
    );
}
