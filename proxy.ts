import { NextResponse, type NextRequest } from "next/server";

// Optimistic check only — no network calls.
// The real auth validation happens in app/admin/page.tsx via supabase.auth.getUser().
// Supabase SSR stores session cookies named sb-<ref>-auth-token.
function hasSessionCookie(request: NextRequest) {
  return request.cookies.getAll().some(
    ({ name }) => name.startsWith("sb-") && name.includes("auth-token")
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const loggedIn = hasSessionCookie(request);

  if (!loggedIn && pathname !== "/admin/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (loggedIn && pathname === "/admin/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: ["/admin/:path*"],
};
