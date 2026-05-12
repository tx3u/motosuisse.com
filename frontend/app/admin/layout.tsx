"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";

/**
 * Client-side auth guard for all admin routes.
 *
 * Auth flow on every protected page load:
 * 1. Check if an access token is already in memory (same-session navigation).
 * 2. If not (page refresh, new tab), silently call POST /api/auth/refresh.
 *    The browser sends the HttpOnly refresh cookie automatically, so no token
 *    ever touches JavaScript for this step.
 * 3. If refresh succeeds, store the new access token in memory and proceed.
 * 4. If refresh fails (no valid cookie), redirect to /admin/login.
 *
 * The Edge proxy (proxy.ts) provides a fast first-line check via the
 * admin_session cookie, but this layout is the authoritative auth gate.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setReady(true);
      return;
    }

    const token = api.admin.getAccessToken();
    if (token) {
      setReady(true);
      return;
    }

    // Token not in memory — attempt silent refresh via HttpOnly cookie.
    api.auth.refresh()
      .then(({ accessToken }) => {
        api.admin.saveTokens(accessToken);
        setReady(true);
      })
      .catch(() => {
        router.replace("/admin/login");
      });
  }, [pathname, router]);

  if (!ready) return null;

  return <>{children}</>;
}
