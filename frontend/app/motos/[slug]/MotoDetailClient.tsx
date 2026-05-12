"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Gauge, Calendar, ArrowLeft } from "lucide-react";
import { MotoCard } from "@/components/MotoCard";
import { api, type Moto } from "@/lib/api";

export default function MotoDetailClient({ slug }: { slug: string }) {
  const [activeImg, setActiveImg] = useState(0);

  const { data: moto, isLoading, isError } = useQuery({
    queryKey: ["moto", slug],
    queryFn: () => api.motos.get(slug),
    enabled: !!slug,
  });

  const { data: relatedData } = useQuery({
    queryKey: ["motos-related"],
    queryFn: () => api.motos.list({ limit: 4 }),
    enabled: !!moto,
  });

  const related = (relatedData?.data ?? []).filter((m: Moto) => m.slug !== slug).slice(0, 3);

  if (isLoading) {
    return (
      <div style={{ background: "var(--color-bg)", minHeight: "100vh", paddingTop: 72, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--color-muted)" }}>Chargement…</span>
      </div>
    );
  }

  if (isError || !moto) {
    return (
      <div style={{ background: "var(--color-bg)", minHeight: "100vh", paddingTop: 72, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--color-muted)", marginBottom: 16 }}>
            Moto introuvable.
          </p>
          <Link href="/motos" className="btn btn-primary">Voir toutes les motos</Link>
        </div>
      </div>
    );
  }

  const specs = [
    { label: "Année", value: String(moto.annee) },
    { label: "Kilométrage", value: `${moto.kilometrage.toLocaleString("fr-CH")} km` },
    moto.type ? { label: "Type", value: moto.type } : null,
    moto.cylindree ? { label: "Cylindrée", value: moto.cylindree } : null,
    moto.puissance ? { label: "Puissance", value: moto.puissance } : null,
    { label: "Statut", value: moto.statut === "disponible" ? "Disponible" : "Vendu" },
  ].filter(Boolean) as { label: string; value: string }[];

  const images = moto.images.length > 0 ? moto.images : null;

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh", paddingTop: 72 }}>
      {/* Breadcrumb */}
      <div style={{ borderBottom: "1px solid var(--color-border)" }}>
        <div className="wrap" style={{ paddingTop: 20, paddingBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link
              href="/motos"
              style={{
                display: "flex", alignItems: "center", gap: 6,
                fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 500,
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--color-muted)", textDecoration: "none",
                transition: "color 150ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-muted)")}
            >
              <ArrowLeft size={12} strokeWidth={2} />
              Motos
            </Link>
            <ChevronRight size={12} color="var(--color-border)" strokeWidth={1.5} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--color-muted)", letterSpacing: "0.04em" }}>
              {moto.marque} {moto.modele}
            </span>
          </div>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 48, paddingBottom: 96 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 72, marginBottom: 96 }}>
          {/* Gallery */}
          <div>
            <div
              className="card"
              style={{ aspectRatio: "16/10", overflow: "hidden", position: "relative", marginBottom: 12 }}
            >
              {images ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={images[activeImg]}
                  alt={`${moto.marque} ${moto.modele}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div className="img-placeholder" style={{ width: "100%", height: "100%" }} />
              )}
              <div
                style={{
                  position: "absolute", top: 14, left: 14,
                  background: "rgba(10,10,10,0.85)", backdropFilter: "blur(8px)",
                  border: `1px solid ${moto.statut === "disponible" ? "var(--color-accent)" : "var(--color-border)"}`,
                  borderRadius: 3,
                  padding: "3px 9px",
                  fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 500,
                  letterSpacing: "0.18em",
                  color: moto.statut === "disponible" ? "var(--color-accent)" : "var(--color-muted)",
                  textTransform: "uppercase",
                }}
              >
                {moto.statut === "disponible" ? "Disponible" : "Vendu"}
              </div>
            </div>

            {images && images.length > 1 && (
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(images.length, 3)}, 1fr)`, gap: 10 }}>
                {images.slice(0, 3).map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      aspectRatio: "16/10", borderRadius: 8, overflow: "hidden",
                      border: `1px solid ${activeImg === i ? "var(--color-accent)" : "var(--color-border)"}`,
                      opacity: activeImg === i ? 1 : 0.4,
                      cursor: "pointer", background: "none", padding: 0,
                      transition: "all 150ms ease",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}

            {!images && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      aspectRatio: "16/10", borderRadius: 8, overflow: "hidden",
                      border: `1px solid ${activeImg === i ? "var(--color-accent)" : "var(--color-border)"}`,
                      opacity: activeImg === i ? 1 : 0.4,
                      cursor: "pointer", background: "none", padding: 0,
                      transition: "all 150ms ease",
                    }}
                  >
                    <div className="img-placeholder" style={{ width: "100%", height: "100%" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(44px, 5vw, 64px)",
                color: "var(--color-text)",
                letterSpacing: "0.03em",
                lineHeight: 0.92,
                marginBottom: 16,
              }}
            >
              {moto.marque}<br />{moto.modele}
            </h1>

            <div style={{ display: "flex", gap: 20, marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Calendar size={12} color="var(--color-muted)" strokeWidth={1.5} />
                <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-muted)" }}>{moto.annee}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Gauge size={12} color="var(--color-muted)" strokeWidth={1.5} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--color-muted)" }}>
                  {moto.kilometrage.toLocaleString("fr-CH")} km
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="card" style={{ padding: "24px 28px", marginBottom: 24 }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 500, letterSpacing: "0.2em", color: "var(--color-muted)", textTransform: "uppercase", marginBottom: 8 }}>
                Prix
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 48, fontWeight: 500, color: "var(--color-text)", letterSpacing: "0.01em", display: "flex", alignItems: "baseline", gap: 10 }}>
                {Number(moto.prix).toLocaleString("fr-CH")}
                <span style={{ fontSize: 18, color: "var(--color-muted)", fontWeight: 300 }}>CHF</span>
              </div>
            </div>

            {/* Specs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", border: "1px solid var(--color-border)", borderRadius: 8, overflow: "hidden", marginBottom: 24 }}>
              {specs.map(({ label, value }, i) => (
                <div
                  key={label}
                  style={{
                    padding: "14px 16px",
                    background: "var(--color-surface)",
                    borderRight: i < specs.length - 1 ? "1px solid var(--color-border)" : "none",
                  }}
                >
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 500, letterSpacing: "0.18em", color: "var(--color-muted)", textTransform: "uppercase", marginBottom: 5 }}>
                    {label}
                  </div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-text)", fontWeight: 500 }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>

            {moto.description && (
              <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 14, color: "var(--color-muted)", lineHeight: 1.72, marginBottom: 32, letterSpacing: "0.01em" }}>
                {moto.description}
              </p>
            )}

            <Link href="/contact" className="btn btn-primary" style={{ width: "100%" }}>
              Intéressé ? Contactez-nous
              <ChevronRight size={14} strokeWidth={2} />
            </Link>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <>
            <div style={{ height: 1, background: "var(--color-border)", marginBottom: 48 }} />
            <span className="label" style={{ marginBottom: 12 }}>Catalogue</span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 5vw, 56px)",
                color: "var(--color-text)",
                letterSpacing: "0.03em",
                lineHeight: 0.95,
                marginBottom: 32,
              }}
            >
              AUTRES MOTOS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 20 }}>
              {related.map((m) => (
                <MotoCard
                  key={m.slug}
                  slug={m.slug}
                  marque={m.marque}
                  modele={m.modele}
                  annee={m.annee}
                  kilometrage={m.kilometrage}
                  prix={Number(m.prix)}
                  statut={m.statut}
                  image={m.images[0]}
                  cylindree={m.cylindree}
                  puissance={m.puissance}
                  type={m.type}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
