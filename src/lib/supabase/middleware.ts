import { authLog, authWarn } from "@/lib/auth-log";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    authWarn("middleware", "missing NEXT_PUBLIC_SUPABASE_URL or ANON_KEY — skipping session refresh");
    return supabaseResponse;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isDashboard = pathname.startsWith("/dashboard");
  const supabaseCookieNames = request.cookies
    .getAll()
    .map((c) => c.name)
    .filter((n) => n.includes("supabase") || n.includes("sb-"));

  authLog("middleware", "getUser", {
    pathname,
    hasUser: Boolean(user),
    userId: user?.id ?? null,
    getUserError: userError?.message ?? null,
    supabaseCookieCount: supabaseCookieNames.length,
    supabaseCookieNames,
  });

  if (isDashboard && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", request.nextUrl.pathname);
    authLog("middleware", "redirect unauthenticated dashboard → /login", {
      from: pathname,
      nextParam: request.nextUrl.pathname,
    });
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
