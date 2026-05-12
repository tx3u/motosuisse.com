import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div
      style={{
        background: "var(--color-bg)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(192,57,43,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <h1
        className="text-ghost"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(128px, 22vw, 240px)",
          lineHeight: 0.85,
          letterSpacing: "0.04em",
          userSelect: "none",
          position: "relative",
        }}
      >
        404
      </h1>

      <div style={{ width: 40, height: 1, background: "var(--color-accent)", margin: "36px auto 28px", opacity: 0.7 }} />

      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(22px, 3.5vw, 36px)",
          color: "var(--color-text)",
          letterSpacing: "0.06em",
          marginBottom: 14,
        }}
      >
        PAGE INTROUVABLE
      </h2>

      <p
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 300,
          fontSize: 13,
          color: "var(--color-muted)",
          maxWidth: 320,
          lineHeight: 1.65,
          marginBottom: 40,
        }}
      >
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>

      <Link href="/" className="btn btn-outline" style={{ display: "inline-flex", gap: 8 }}>
        <ArrowLeft size={13} strokeWidth={1.5} />
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
