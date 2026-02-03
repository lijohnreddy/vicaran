import { createClient } from "@/lib/supabase/server";
import { createSupabaseServerAdminClient } from "@/lib/supabase/admin";
import { db } from "@/lib/drizzle/db";
import { users, type User, type UserRole } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

/**
 * Check if a user ID has admin role
 * @param userId - The user ID to check
 * @returns Promise<boolean> - True if user is admin
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const result = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return result[0]?.role === "admin";
  } catch (error) {
    console.error("Error checking user admin status:", error);
    return false;
  }
}

/**
 * Get the current authenticated user and their role
 * Auto-creates user record if authenticated via OAuth but not in database
 * @returns Promise<{user: User, isAdmin: boolean} | null>
 */
export async function getCurrentUserWithRole(): Promise<{
  user: User;
  isAdmin: boolean;
} | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return null;
    }

    // Get user data with role from our database
    let userData = await db
      .select()
      .from(users)
      .where(eq(users.id, authUser.id))
      .limit(1);

    // If user doesn't exist in our database (first OAuth login), create them
    // Use admin client to bypass RLS policies
    if (userData.length === 0) {
      const adminClient = createSupabaseServerAdminClient();

      const { error: insertError } = await adminClient
        .from("users")
        .insert({
          id: authUser.id,
          email: authUser.email || "",
          full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || null,
          role: "member",
        });

      if (insertError) {
        console.error("Failed to create user record:", insertError);
        return null;
      }

      // Re-query to get the created user
      userData = await db
        .select()
        .from(users)
        .where(eq(users.id, authUser.id))
        .limit(1);
    }

    if (userData.length === 0) {
      return null;
    }

    const user = userData[0];
    return {
      user,
      isAdmin: user.role === "admin",
    };
  } catch (error) {
    console.error("Error getting current user with role:", error);
    return null;
  }
}

/**
 * Get current user ID - optimized for performance
 * Use when you only need user identification
 * @returns Promise<string | null> - Returns the user ID or null if not authenticated
 */
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user.id;
  } catch (error) {
    console.error("Error in getCurrentUserId:", error);
    return null;
  }
}

/**
 * Require user ID - optimized for most common use case
 * Use this for most common authentication use case - getting the user ID
 * @returns Promise<string> - Returns the user ID
 */
export async function requireUserId(): Promise<string> {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/auth/login");
  }

  return userId;
}

/**
 * Require admin access - optimized version of requireAdmin
 * Checks admin status efficiently without redundant database calls
 * @returns Promise<void> - Throws or redirects if not authorized
 */
export async function requireAdminAccess(): Promise<void> {
  const userWithRole = await getCurrentUserWithRole();

  if (!userWithRole) {
    console.warn("Admin access attempted without authentication");
    redirect("/auth/login");
  }

  if (!userWithRole.isAdmin) {
    console.warn(
      `Non-admin user ${userWithRole.user.id} attempted admin access`
    );
    redirect("/unauthorized");
  }
}

/**
 * Check if current authenticated user is admin (non-throwing version)
 * Use this for conditional UI rendering
 * @returns Promise<boolean> - True if current user is admin
 */
export async function checkCurrentUserIsAdmin(): Promise<boolean> {
  const userWithRole = await getCurrentUserWithRole();
  return userWithRole?.isAdmin ?? false;
}

/**
 * Validate that a user role is valid
 * @param role - The role to validate
 * @returns boolean - True if role is valid
 */
export function isValidUserRole(role: string): role is UserRole {
  return role === "member" || role === "admin";
}

/**
 * Get user role display name
 * @param role - The user role
 * @returns string - Human-readable role name
 */
export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case "admin":
      return "Administrator";
    case "member":
      return "Member";
    default:
      return "Unknown";
  }
}
