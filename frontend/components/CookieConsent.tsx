"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";
import { getConsent, setConsent } from "@/lib/consent";

/**
 * Bottom-of-page cookie consent banner.
 *
 * Shown only on first visit (when `cookie_consent` cookie is absent).
 * Renders nothing server-side to avoid hydration mismatch with cookies.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getConsent() === null) setVisible(true);
  }, []);

  function handleChoice(choice: "accepted" | "rejected") {
    setConsent(choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Préférences cookies"
      aria-live="polite"
      style={{
        position: "fixed",
        left: 16,
        right: 16,
        bottom: 16,
        zIndex: 9999,
        maxWidth: 980,
        margin: "0 auto",
        background: "rgba(15,15,15,0.96)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 8,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        gap: 24,
        flexWrap: "wrap",
        boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flex: 1, minWidth: 260 }}>
        <div
          style={{
            flexShrink: 0,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(230,0,36,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(230,0,36,0.25)",
          }}
        >
          <Cookie size={16} color="var(--color-accent)" strokeWidth={1.6} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 13,
              letterSpacing: "0.08em",
              color: "var(--color-text)",
            }}
          >
            COOKIES
          </span>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12.5,
              fontWeight: 300,
              color: "var(--color-muted)",
              lineHeight: 1.55,
              margin: 0,
              maxWidth: 560,
            }}
          >
            Nous utilisons des cookies pour mesurer l&apos;audience du site et améliorer votre
            expérience. Vous pouvez accepter, refuser, ou en savoir plus dans notre{" "}
            <Link
              href="/cookies"
              style={{ color: "var(--color-text)", textDecoration: "underline", textUnderlineOffset: 2 }}
            >
              politique cookies
            </Link>
            .
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexShrink: 0, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => handleChoice("rejected")}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 4,
            padding: "11px 20px",
            cursor: "pointer",
            transition: "all 160ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
            e.currentTarget.style.color = "var(--color-text)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
            e.currentTarget.style.color = "var(--color-muted)";
          }}
        >
          Refuser
        </button>
        <button
          type="button"
          onClick={() => handleChoice("accepted")}
          className="btn btn-primary"
          style={{ fontSize: 11, padding: "11px 22px" }}
        >
          Accepter
        </button>
        <button
          type="button"
          onClick={() => handleChoice("rejected")}
          aria-label="Fermer (refuser)"
          style={{
            background: "transparent",
            border: "none",
            color: "var(--color-muted)",
            cursor: "pointer",
            padding: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
