"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { api } from "@/lib/api";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/motos", label: "Motos" },
  { href: "/services", label: "Nos Services" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => setOpen(false), [pathname]);

  // Check admin auth state
  useEffect(() => {
    const check = () => setIsAdmin(!!api.admin.getAccessToken());
    check();
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, []);

  return (
    <>
      <header
        className="nav-anim"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 50,
          height: 72,
          background: scrolled ? "rgba(10,10,10,0.92)" : "rgba(10,10,10,0.5)",
          backdropFilter: scrolled ? "blur(16px) saturate(160%)" : "blur(8px)",
          WebkitBackdropFilter: scrolled ? "blur(16px) saturate(160%)" : "blur(8px)",
          borderBottom: `1px solid ${scrolled ? "var(--color-border)" : "transparent"}`,
          boxShadow: scrolled ? "0 1px 0 rgba(255,255,255,0.03), 0 4px 24px rgba(0,0,0,0.5)" : "none",
          transition: "background 300ms ease, border-color 300ms ease, box-shadow 300ms ease",
        }}
      >
        <div
          className="wrap"
          style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 26,
              color: "var(--color-text)",
              letterSpacing: "0.06em",
              textDecoration: "none",
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            MOTOSUISSE
          </Link>

          {/* Desktop nav — absolutely centered */}
          <nav
            className="hidden md:flex"
            style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", gap: 48, alignItems: "center" }}
          >
            {links.map(({ href, label }) => (
              <NavLink key={href} href={href} label={label} isActive={pathname === href} />
            ))}
          </nav>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Desktop only — wrapped in a plain div so .btn / .nav-dash-btn don't override `hidden` */}
            <div className="hidden md:flex" style={{ alignItems: "center", gap: 16 }}>
              {isAdmin && (
                <Link href="/admin/dashboard" className="nav-dash-btn">
                  <LayoutDashboard size={12} strokeWidth={2} />
                  Dashboard
                </Link>
              )}
              <Link href="/contact" className="btn btn-primary">
                Nous contacter
              </Link>
            </div>

            {/* Mobile hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setOpen(!open)}
                aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 8,
                  color: "var(--color-text)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 44,
                  minWidth: 44,
                }}
              >
                {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu — pointer-events: none when closed prevents it from blocking hovers */}
      <div
        className="md:hidden"
        style={{
          position: "fixed",
          top: 72,
          left: 0,
          width: "100%",
          zIndex: 49,
          background: "rgba(10,10,10,0.96)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid var(--color-border)`,
          overflow: "hidden",
          maxHeight: open ? 400 : 0,
          pointerEvents: open ? "auto" : "none", // KEY: never blocks hover when closed
          transition: "max-height 300ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div
          style={{
            padding: "32px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 0,
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0)" : "translateY(-8px)",
            transition: "opacity 220ms ease 40ms, transform 220ms ease 40ms",
          }}
        >
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="footer-link"
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: pathname === href ? "var(--color-text)" : undefined,
                padding: "14px 0",
                borderBottom: "1px solid var(--color-border)",
                display: "block",
                minHeight: 44,
              }}
            >
              {label}
            </Link>
          ))}
          <div style={{ paddingTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            {isAdmin && (
              <Link href="/admin/dashboard" className="nav-dash-btn" style={{ justifyContent: "center" }}>
                <LayoutDashboard size={14} strokeWidth={2} />
                Dashboard
              </Link>
            )}
            <Link href="/contact" className="btn btn-primary" style={{ width: "100%" }}>
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function NavLink({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  return (
    <Link
      href={href}
      className={`nav-link${isActive ? " active" : ""}`}
      style={{ textDecoration: "none" }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
        <span className="nav-link-text">{label}</span>
        <span className="nav-link-bar" />
      </div>
    </Link>
  );
}
