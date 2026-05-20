"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const navLinks = [
  { label: "Pose stickers",           href: "/services#pose-stickers" },
  { label: "Achat de pièces",         href: "/services#achat-pieces" },
  { label: "Vente en consignation",   href: "/services#vente-consignation" },
  { label: "Aide au financement",     href: "/services#financement" },
];

const secondaryLinks = [
  { label: "Motos",           href: "/motos" },
  { label: "Tips and tricks", href: "/tips" },
  { label: "À propos de nous",href: "/a-propos" },
  { label: "Contact",         href: "/contact" },
];

const hours = [
  { day: "Semaine", time: "8:00 – 18:00" },
  { day: "Samedi",  time: "8:00 – 16:00" },
];

const socials = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/moto.suisse/",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
];

export function Footer() {
  return (
    <footer style={{ background: "var(--color-surface)", borderTop: "1px solid var(--color-border)" }}>
      <div className="wrap footer-main">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: 48 }}>

          {/* Col 1 — Brand + contact */}
          <div>
            <Link
              href="/"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                color: "var(--color-text)",
                letterSpacing: "0.06em",
                textDecoration: "none",
                display: "block",
                marginBottom: 24,
              }}
            >
              MOTOSUISSE
            </Link>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <MapPin size={13} color="var(--color-accent)" strokeWidth={1.5} style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 14, color: "var(--color-muted)" }}>
                  Lausanne, Suisse
                </span>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <Mail size={13} color="var(--color-accent)" strokeWidth={1.5} style={{ marginTop: 2, flexShrink: 0 }} />
                <a href="mailto:contactmotosuisse@gmail.com" className="footer-link" style={{ fontSize: 13, wordBreak: "break-all" }}>
                  contactmotosuisse@gmail.com
                </a>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <Phone size={13} color="var(--color-accent)" strokeWidth={1.5} style={{ marginTop: 2, flexShrink: 0 }} />
                <a href="tel:+41797992118" className="footer-link">+41 79 799 21 18</a>
              </div>
            </div>
          </div>

          {/* Col 2 — Services */}
          <div>
            <span style={{ display: "block", fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-muted)", marginBottom: 20 }}>
              Nos Services
            </span>
            {navLinks.map(({ label, href }) => (
              <Link key={label} href={href} className="footer-link" style={{ display: "block", padding: "4px 0", minHeight: 28 }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Col 3 — Liens */}
          <div>
            <span style={{ display: "block", fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-muted)", marginBottom: 20 }}>
              Liens
            </span>
            {secondaryLinks.map(({ label, href }) => (
              <Link key={label} href={href} className="footer-link" style={{ display: "block", padding: "4px 0", minHeight: 28 }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Col 4 — Hours */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <Clock size={12} color="var(--color-accent)" strokeWidth={1.5} />
              <span style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-muted)" }}>
                Heures de contact
              </span>
            </div>
            {hours.map(({ day, time }) => (
              <div key={day} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "8px 0", borderBottom: "1px solid var(--color-border)" }}>
                <span style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 14, color: "var(--color-muted)" }}>{day}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--color-text)", letterSpacing: "0.04em" }}>{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="wrap footer-bottom"
        style={{ paddingTop: 20, paddingBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 12, color: "var(--color-muted)" }}>
            © 2026 Motosuisse.com. All rights reserved
          </span>
          {[{ label: "Confidentialité", href: "/confidentialite" }, { label: "Cookies", href: "/cookies" }].map(({ label, href }) => (
            <Link key={label} href={href} className="footer-link" style={{ fontSize: 12 }}>
              {label}
            </Link>
          ))}
        </div>

        {/* Social icons */}
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {socials.map(({ name, href, path }) => (
            <a
              key={name}
              href={href}
              aria-label={name}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 44, minWidth: 44 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={17} height={17}>
                <path d={path} />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
