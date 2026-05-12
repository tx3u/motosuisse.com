"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart2, Bike, BookOpen, Globe, LogOut,
  MessageSquare, Settings, Star, TrendingUp, Wrench,
} from "lucide-react";
import { api } from "@/lib/api";

const NAV = [
  { label: "Dashboard",    href: "/admin/dashboard", Icon: BarChart2 },
  { label: "Motos",        href: "/admin/motos",      Icon: Bike },
  { label: "Services",     href: "/admin/services",   Icon: Wrench },
  { label: "Blog",         href: "/admin/blog",       Icon: BookOpen },
  { label: "Messages",     href: "/admin/messages",   Icon: MessageSquare },
  { label: "Avis",         href: "/admin/reviews",    Icon: Star },
  { label: "Statistiques", href: "/admin/stats",      Icon: TrendingUp },
  { label: "Paramètres",   href: "/admin/settings",   Icon: Settings },
];

/**
 * Shared sidebar rendered on every admin page.
 *
 * Active state is derived from the current pathname so each page does not
 * need to maintain its own NAV array.  Logout clears the stored JWT pair
 * and the session cookie before redirecting to the login page.
 */
export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await api.auth.logout().catch(() => null);
    api.admin.clearTokens();
    router.replace("/admin/login");
  }

  return (
    <aside
      className="admin-sidebar"
      style={{
        width: 240,
        background: "#111111",
        borderRight: "1px solid #1F1F1F",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0, left: 0,
        height: "100vh",
        zIndex: 40,
        flexShrink: 0,
      }}
    >
      {/* Logo / brand */}
      <div style={{ padding: "28px 24px 24px", borderBottom: "1px solid #1F1F1F" }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "#F5F5F0", letterSpacing: "0.07em", display: "block", marginBottom: 4 }}>
          MOTOSUISSE
        </span>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "#444" }}>
          Administration
        </span>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "16px 0", overflowY: "auto" }}>
        {NAV.map(({ label, href, Icon }) => {
          const active =
            href === "/admin/dashboard"
              ? pathname === href
              : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={label}
              href={href}
              className={active ? undefined : "adm-nav-link"}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 24px",
                fontFamily: "var(--font-body)", fontSize: 13,
                fontWeight: active ? 500 : 300,
                color: active ? "#F5F5F0" : "#6B6B6B",
                textDecoration: "none",
                background: active ? "rgba(230,0,36,0.08)" : "transparent",
                borderLeft: `2px solid ${active ? "var(--color-accent)" : "transparent"}`,
              }}
            >
              <Icon size={15} strokeWidth={1.5} />
              {label}
            </Link>
          );
        })}

        {/* External link — public website */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="adm-nav-link"
          style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "11px 24px",
            fontFamily: "var(--font-body)", fontSize: 13,
            fontWeight: 300,
            color: "#6B6B6B",
            textDecoration: "none",
            borderLeft: "2px solid transparent",
            borderTop: "1px solid #1A1A1A",
            marginTop: 8,
          }}
        >
          <Globe size={15} strokeWidth={1.5} />
          Voir le site
        </a>
      </nav>

      {/* Bottom — logout */}
      <div style={{ padding: "16px 24px", borderTop: "1px solid #1F1F1F" }}>
        <button
          onClick={handleLogout}
          className="adm-link"
          style={{
            display: "flex", alignItems: "center", gap: 8,
            fontFamily: "var(--font-body)", fontSize: 12,
            color: "#444", background: "none", border: "none",
            cursor: "pointer", padding: 0,
          }}
        >
          <LogOut size={13} strokeWidth={1.5} />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
