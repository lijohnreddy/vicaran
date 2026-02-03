import { getSessionsGrouped } from "@/lib/history";
import { SessionTable } from "@/components/history/SessionTable";
import { AlertCircle, MessageSquare } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StartChattingButton } from "@/components/history/StartChattingButton";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  try {
    const result = await getSessionsGrouped();
    const { sessions } = result;
    const hasAnySessions =
      sessions.today.length > 0 ||
      sessions.yesterday.length > 0 ||
      sessions.thisWeek.length > 0 ||
      sessions.older.length > 0;

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Chat History</h1>
          <p className="text-muted-foreground">
            View and manage your previous sessions and chat sessions.
          </p>
        </div>
        {hasAnySessions ? (
          <SessionTable sessions={sessions} />
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div
              className="mb-4 rounded-full bg-primary/10 p-3"
              aria-hidden="true"
            >
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No sessions yet</h2>
            <p className="text-muted-foreground mb-4 max-w-sm">
              Start chatting to see your session history here. All your sessions
              will be saved and organized by date.
            </p>
            <StartChattingButton />
          </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Chat History</h1>
          <p className="text-muted-foreground">
            View and manage your previous sessions and chat sessions.
          </p>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load session history:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
}
