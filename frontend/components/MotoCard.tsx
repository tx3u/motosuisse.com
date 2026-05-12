"use client";

import Link from "next/link";
import { Gauge, Calendar, Zap, Settings2, Tag } from "lucide-react";

type MotoCardProps = {
  slug: string;
  marque: string;
  modele: string;
  annee: number;
  kilometrage: number;
  prix: number;
  statut?: "disponible" | "vendu";
  image?: string;
  cylindree?: string | null;
  puissance?: string | null;
  type?: string | null;
};

export function MotoCard({
  slug,
  marque,
  modele,
  annee,
  kilometrage,
  prix,
  statut = "disponible",
  image,
  cylindree,
  puissance,
  type,
}: MotoCardProps) {
  const vendu = statut === "vendu";

  const specs = [
    type ? { icon: Tag, value: type } : null,
    cylindree ? { icon: Settings2, value: cylindree } : null,
    puissance ? { icon: Zap, value: puissance } : null,
  ].filter(Boolean) as { icon: typeof Tag; value: string }[];

  return (
    <Link
      href={`/motos/${slug}`}
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        overflow: "hidden",
        position: "relative",
        opacity: vendu ? 0.6 : 1,
        transition: "opacity 200ms ease",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden", borderRadius: "12px 12px 0 0" }}>
        <div className="img-placeholder" style={{ width: "100%", height: "100%" }} />
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={`${marque} ${modele}`}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: vendu ? "grayscale(40%)" : "none",
            }}
          />
        )}

        {/* Status badge */}
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(10,10,10,0.85)",
            border: `1px solid ${vendu ? "var(--color-border)" : "var(--color-accent)"}`,
            borderRadius: 3,
            padding: "3px 9px",
            fontFamily: "var(--font-body)",
            fontSize: 9,
            fontWeight: 500,
            letterSpacing: "0.18em",
            color: vendu ? "var(--color-muted)" : "var(--color-accent)",
            textTransform: "uppercase",
          }}
        >
          {vendu ? "Vendu" : "Disponible"}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "22px 24px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Make / model */}
        <div style={{ marginBottom: specs.length > 0 ? 10 : 14 }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 24,
              color: "var(--color-text)",
              letterSpacing: "0.04em",
              lineHeight: 1.05,
            }}
          >
            {marque} {modele}
          </div>
        </div>

        {/* Spec pills */}
        {specs.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {specs.map(({ icon: Icon, value }, i) => (
              <div
                key={i}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 3,
                  padding: "3px 8px",
                }}
              >
                <Icon size={10} color="var(--color-muted)" strokeWidth={1.5} />
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    fontWeight: 400,
                    color: "var(--color-muted)",
                    letterSpacing: "0.03em",
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Metadata */}
        <div style={{ display: "flex", gap: 20, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Calendar size={12} color="var(--color-muted)" strokeWidth={1.5} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--color-muted)" }}>
              {annee}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Gauge size={12} color="var(--color-muted)" strokeWidth={1.5} />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--color-muted)",
                letterSpacing: "0.02em",
              }}
            >
              {kilometrage.toLocaleString("fr-CH")} km
            </span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "var(--color-border)", marginBottom: 16 }} />

        {/* Price */}
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 24,
            fontWeight: 500,
            color: vendu ? "var(--color-muted)" : "var(--color-text)",
            letterSpacing: "0.01em",
          }}
        >
          {prix.toLocaleString("fr-CH")}
          <span style={{ fontSize: 13, color: "var(--color-muted)", fontWeight: 400, marginLeft: 5 }}>CHF</span>
        </div>
      </div>
    </Link>
  );
}
