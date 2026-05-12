/**
 * @file proxy.ts
 * Edge middleware — guards all `/admin/*` routes via cookie check.
 *
 * This runs on the Next.js Edge runtime before any page is served.  It
 * checks for the `admin_session` cookie that is written by
 * {@link api.admin.saveTokens} on successful login.
 *
 * This is a fast first-line defence: if the cookie is absent the request
 * is redirected to `/admin/login` without executing any page code.  A
 * second, client-side guard in `app/admin/layout.tsx` handles the case
 * where the cookie exists but the underlying JWT has expired.
 *
 * NOTE — The exported function MUST be named `proxy` (not `middleware`).
 * Next.js 16 changed the convention; the old `middleware.ts` / `middleware`
 * export name is no longer recognised.
 */

import { NextRequest, NextResponse } from "next/server";

/**
 * Edge proxy function evaluated before every request matching {@link config}.
 *
 * @param request - The incoming HTTP request from the Next.js runtime.
 * @returns A redirect to `/admin/login` when the session cookie is absent,
 *   or `NextResponse.next()` to continue to the requested page.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Already going to login — let through
  if (pathname === "/admin/login") return NextResponse.next();

  const hasSession = request.cookies.has("admin_session");
  if (!hasSession) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
