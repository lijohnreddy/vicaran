"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createInvestigation, deleteInvestigation } from "@/lib/queries/investigations";
import { createClient } from "@/lib/supabase/server";

/**
 * Create a new investigation and trigger the ADK agent
 */
export async function createInvestigationAction(formData: FormData) {
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
    const sessionId = formData.get("session_id") as string; // From ADK

    // Validate required fields
    if (!title || !brief || !mode || !sessionId) {
        throw new Error("Missing required fields: title, brief, mode, or session_id");
    }

    try {
        // 1. Create investigation in database
        const investigation = await createInvestigation({
            user_id: user.id,
            session_id: sessionId,
            title,
            brief,
            mode,
            status: "pending",
        });

        // 2. Trigger ADK agent (user clarification: trigger after DB insert)
        if (process.env.ADK_URL) {
            try {
                await fetch(`${process.env.ADK_URL}/run`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        investigation_id: investigation.id,
                        brief: brief,
                        mode: mode,
                        session_id: sessionId,
                    }),
                });
            } catch (error) {
                console.error("Failed to trigger ADK agent:", error);
                // Don't throw - investigation is created, agent trigger is best-effort
            }
        }

        // 3. Revalidate and redirect
        revalidatePath("/investigations");
        redirect(`/investigations/${investigation.id}`);
    } catch (error) {
        console.error("Error creating investigation:", error);
        throw new Error(
            error instanceof Error ? error.message : "Failed to create investigation"
        );
    }
}

/**
 * Delete an investigation (cascade deletes all related data)
 */
export async function deleteInvestigationAction(investigationId: string) {
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
        return { success: true };
    } catch (error) {
        console.error("Error deleting investigation:", error);
        throw new Error(
            error instanceof Error ? error.message : "Failed to delete investigation"
        );
    }
}
