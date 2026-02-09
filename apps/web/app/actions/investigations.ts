"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createInvestigation, deleteInvestigation } from "@/lib/queries/investigations";
import { saveInitialSources } from "@/lib/queries/sources";
import { createClient } from "@/lib/supabase/server";
import { AdkSessionService } from "@/lib/adk/session-service";

/**
 * Create a new investigation and trigger the ADK agent
 * Flow: Create ADK session → Save to DB → Save sources → Redirect
 */
export async function createInvestigationAction(formData: FormData): Promise<never> {
    // Get current user
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized - user not authenticated");
    }

    // Extract form data
    const title = formData.get("title") as string;
    const brief = formData.get("brief") as string;
    const mode = formData.get("mode") as "quick" | "detailed";
    const sourcesJson = formData.get("sources") as string;

    // Parse sources array (optional field)
    let sources: string[] = [];
    if (sourcesJson) {
        try {
            sources = JSON.parse(sourcesJson);
        } catch {
            console.warn("Failed to parse sources JSON, using empty array");
        }
    }

    // Validate required fields
    if (!title || !brief || !mode) {
        throw new Error("Missing required fields: title, brief, or mode");
    }

    // Store investigation ID for redirect (redirect must be outside try-catch)
    let investigationId: string;

    try {
        // 1. Create ADK session (ADK generates the session ID)
        const adkSession = await AdkSessionService.createSession(user.id, {
            user_id: user.id,
            investigation_mode: mode,
            investigation_brief: brief,
            user_sources: sources,
        });

        // 2. Create investigation in database with ADK session ID
        const investigation = await createInvestigation({
            user_id: user.id,
            session_id: adkSession.id,
            title,
            brief,
            mode,
            status: "pending",
        });

        // 3. Save initial sources to database (if provided)
        if (sources.length > 0) {
            await saveInitialSources(investigation.id, sources);
        }

        // 4. Build and send first message to trigger agent
        const { buildInvestigationPrompt } = await import("@/lib/utils/investigation-prompt");
        const firstMessage = buildInvestigationPrompt({
            investigationId: investigation.id,
            title,
            mode,
            brief,
            sources,
        });

        // Fire-and-forget: trigger the agent
        // IMPORTANT: Forward cookies for auth - server actions don't auto-forward cookies
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const cookieStore = await cookies();
        fetch(`${appUrl}/api/run`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": cookieStore.toString(),
            },
            body: JSON.stringify({
                userId: user.id,
                sessionId: adkSession.id,
                message: firstMessage,
            }),
        }).catch((error) => {
            console.error("❌ [CREATE_INVESTIGATION] Agent trigger failed:", error);
        });

        // Store ID for redirect
        investigationId = investigation.id;
    } catch (error) {
        console.error("❌ [CREATE_INVESTIGATION] Error:", error);
        throw new Error(
            error instanceof Error ? error.message : "Failed to create investigation"
        );
    }

    // 4. Revalidate and redirect to workspace
    // IMPORTANT: redirect() throws NEXT_REDIRECT, must be outside try-catch
    revalidatePath("/investigations");
    revalidatePath("/home");
    redirect(`/investigations/${investigationId}`);
}

/**
 * Delete an investigation (cascade deletes all related data)
 */
export async function deleteInvestigationAction(investigationId: string): Promise<{ success: true }> {
    // Get current user
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized - user not authenticated");
    }

    try {
        const deleted = await deleteInvestigation(investigationId, user.id);

        if (!deleted) {
            throw new Error("Investigation not found or unauthorized");
        }

        revalidatePath("/investigations");
        revalidatePath("/home");
        return { success: true };
    } catch (error) {
        console.error("Error deleting investigation:", error);
        throw new Error(
            error instanceof Error ? error.message : "Failed to delete investigation"
        );
    }
}
