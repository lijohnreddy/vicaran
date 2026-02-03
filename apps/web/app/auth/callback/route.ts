import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { createSupabaseServerAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/home";

    if (code) {
        const cookieStore = await cookies();
        const supabase = createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing sessions.
                    }
                },
            },
        });

        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && data.user) {
            // Create user record in database if it doesn't exist
            // Use admin client to bypass RLS policies
            const adminClient = createSupabaseServerAdminClient();

            const { error: insertError } = await adminClient
                .from("users")
                .insert({
                    id: data.user.id,
                    email: data.user.email || "",
                    full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || null,
                    role: "member",
                })
                .select()
                .single();

            // Ignore error if user already exists (constraint violation)
            if (insertError && !insertError.message.includes("duplicate key")) {
                console.error("Failed to create user record:", insertError);
                return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_error`);
            }

            const forwardedHost = request.headers.get("x-forwarded-host");
            const isLocalEnv = process.env.NODE_ENV === "development";

            if (isLocalEnv) {
                // In development, redirect to origin
                return NextResponse.redirect(`${origin}${next}`);
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`);
            } else {
                return NextResponse.redirect(`${origin}${next}`);
            }
        }
    }

    // Auth error - redirect to error page or login with error
    return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_error`);
}

