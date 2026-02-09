import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Middleware runs on Edge Runtime — use process.env directly
// (t3-env may not initialize properly in Edge)
function getSupabaseEnv() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY for middleware");
  }
  return { url, anonKey };
}

export async function updateSession(request: NextRequest) {
  // Skip authentication for webhook endpoints
  if (request.nextUrl.pathname.startsWith("/api/webhooks/")) {
    return NextResponse.next({
      request,
    });
  }

  // Skip authentication for health check endpoint
  if (request.nextUrl.pathname === "/api/health") {
    return NextResponse.next({
      request,
    });
  }

  // Skip authentication for agent callback endpoint (uses X-Agent-Secret header instead)
  if (request.nextUrl.pathname.startsWith("/api/agent-callback")) {
    return NextResponse.next({
      request,
    });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const { url, anonKey } = getSupabaseEnv();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Define public routes that don't require authentication
  const publicRoutes = ["/", "/cookies", "/privacy", "/terms"];
  const publicPatterns = ["/auth"];

  const isPublicRoute =
    publicRoutes.includes(request.nextUrl.pathname) ||
    publicPatterns.some((pattern) =>
      request.nextUrl.pathname.startsWith(pattern)
    );

  if (!user && !isPublicRoute) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
