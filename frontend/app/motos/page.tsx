"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { MotoCard } from "@/components/MotoCard";
import { api } from "@/lib/api";

const PAGE_SIZE = 9;

export default function MotosPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["motos", page],
    queryFn: () => api.motos.list({ page, limit: PAGE_SIZE }),
  });

  const motos = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh", paddingTop: 72 }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--color-border)" }}>
        <div className="wrap" style={{ paddingTop: 56, paddingBottom: 40 }}>
          <span className="label h-anim h-anim-1" style={{ marginBottom: 12 }}>
            Lausanne, Suisse
          </span>
          <div
            className="h-anim h-anim-2"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(52px, 9vw, 100px)",
                color: "var(--color-text)",
                letterSpacing: "0.03em",
                lineHeight: 0.9,
              }}
            >
              NOS MOTOS
            </h1>
            <span
              className="h-anim h-anim-3"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 300,
                fontSize: 13,
                color: "var(--color-muted)",
              }}
            >
              {isLoading ? "Chargement…" : `${total} moto${total !== 1 ? "s" : ""} disponible${total !== 1 ? "s" : ""}`}
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="wrap" style={{ paddingTop: 48, paddingBottom: 80 }}>
        {isError && (
          <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--color-muted)", textAlign: "center", padding: "80px 0" }}>
            Impossible de charger les motos. Veuillez réessayer.
          </p>
        )}

        {isLoading && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            style={{ gap: 20 }}
          >
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div
                key={i}
                className="card"
                style={{ aspectRatio: "4/3", background: "var(--color-surface)", animation: "pulse 1.5s ease-in-out infinite" }}
              />
            ))}
          </div>
        )}

        {!isLoading && !isError && motos.length === 0 && (
          <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--color-muted)", textAlign: "center", padding: "80px 0" }}>
            Aucune moto disponible pour le moment.
          </p>
        )}

        {!isLoading && motos.length > 0 && (
          <div
            className="h-anim h-anim-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            style={{ gap: 20 }}
          >
            {motos.map((moto) => (
              <MotoCard
                key={moto.slug}
                slug={moto.slug}
                marque={moto.marque}
                modele={moto.modele}
                annee={moto.annee}
                kilometrage={moto.kilometrage}
                prix={Number(moto.prix)}
                statut={moto.statut}
                image={moto.images[0]}
                cylindree={moto.cylindree}
                puissance={moto.puissance}
                type={moto.type}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="h-anim h-anim-5"
            style={{ marginTop: 56, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                width: 40, height: 40, borderRadius: 4,
                border: "1px solid var(--color-border)",
                background: "transparent",
                color: page === 1 ? "var(--color-border)" : "var(--color-muted)",
                cursor: page === 1 ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <ChevronLeft size={15} strokeWidth={1.5} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  width: 40, height: 40, borderRadius: 4,
                  border: `1px solid ${p === page ? "var(--color-accent)" : "var(--color-border)"}`,
                  background: p === page ? "var(--color-accent)" : "transparent",
                  color: p === page ? "#fff" : "var(--color-muted)",
                  fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500,
                  cursor: "pointer", transition: "all 150ms ease",
                }}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                width: 40, height: 40, borderRadius: 4,
                border: "1px solid var(--color-border)",
                background: "transparent",
                color: page === totalPages ? "var(--color-border)" : "var(--color-muted)",
                cursor: page === totalPages ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <ChevronRight size={15} strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
