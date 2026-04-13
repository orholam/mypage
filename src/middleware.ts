import { parseTenantSubdomain } from "@/lib/host";
import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const tenantSub = parseTenantSubdomain(request);
  if (tenantSub && pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/s/${tenantSub}`;
    return NextResponse.rewrite(url);
  }

  const needsSupabase =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/auth/");

  if (!needsSupabase) {
    return NextResponse.next();
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
