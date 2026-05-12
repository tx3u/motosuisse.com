"use client";

import Link from "next/link";
import { ChevronRight, ArrowRight, Wrench } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function ServicesPage() {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services-public"],
    queryFn: () => api.services.list(),
  });

  const activeServices = services.filter((s) => s.actif);

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh", paddingTop: 72 }}>

      {/* Hero header */}
      <div style={{ borderBottom: "1px solid var(--color-border)" }}>
        <div className="wrap" style={{ paddingTop: 56, paddingBottom: 48 }}>
          <span className="label h-anim h-anim-1" style={{ marginBottom: 16 }}>
            Ce que nous faisons
          </span>
          <h1
            className="h-anim h-anim-2"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(52px, 10vw, 110px)",
              color: "var(--color-text)",
              letterSpacing: "0.03em",
              lineHeight: 0.88,
              marginBottom: 32,
            }}
          >
            NOS
            <br />
            SERVICES
          </h1>
          <p
            className="h-anim h-anim-3"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              fontSize: 14,
              color: "var(--color-muted)",
              lineHeight: 1.72,
              maxWidth: 480,
              letterSpacing: "0.01em",
            }}
          >
            De la personnalisation à l&apos;achat, en passant par la vente et le financement —
            nous accompagnons les passionnés à chaque étape.
          </p>
        </div>
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="h-anim h-anim-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                background: i % 2 !== 0 ? "#FFFFFF" : "var(--color-bg)",
                borderTop: `1px solid ${i % 2 !== 0 ? "#E5E5E5" : "var(--color-border)"}`,
                padding: "80px 0",
              }}
            >
              <div className="wrap">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72 }} className="services-grid">
                  <div style={{ aspectRatio: "4/3", background: i % 2 !== 0 ? "#e8e8e8" : "#1a1a1a", borderRadius: 4, animation: "pulse 1.5s ease-in-out infinite" }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ height: 12, width: 80, background: i % 2 !== 0 ? "#e0e0e0" : "#222", borderRadius: 2, animation: "pulse 1.5s ease-in-out infinite" }} />
                    <div style={{ height: 48, width: "70%", background: i % 2 !== 0 ? "#e0e0e0" : "#222", borderRadius: 2, animation: "pulse 1.5s ease-in-out infinite" }} />
                    <div style={{ height: 80, background: i % 2 !== 0 ? "#e8e8e8" : "#1a1a1a", borderRadius: 2, animation: "pulse 1.5s ease-in-out infinite" }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Services list */}
      {!isLoading && activeServices.length > 0 && (
        <div className="h-anim h-anim-4">
          {activeServices.map((service, index) => {
            const isEven = index % 2 === 0;
            const isWhite = index % 2 !== 0;
            const label = String(index + 1).padStart(2, "0");

            return (
              <section
                key={service.id}
                style={{
                  background: isWhite ? "#FFFFFF" : "var(--color-bg)",
                  borderTop: `1px solid ${isWhite ? "#E5E5E5" : "var(--color-border)"}`,
                  padding: "80px 0",
                }}
              >
                <div className="wrap">
                  <div
                    className="services-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 72,
                      alignItems: "center",
                    }}
                  >
                    {/* Image / placeholder */}
                    <div
                      className="card services-img"
                      style={{
                        aspectRatio: "4/3",
                        overflow: "hidden",
                        position: "relative",
                        order: isEven ? 1 : 2,
                      }}
                    >
                      {service.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={service.image}
                          alt={service.titre}
                          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          className="img-placeholder"
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: isWhite
                              ? "linear-gradient(160deg, #e8e8e8 0%, #d0d0d0 100%)"
                              : "linear-gradient(160deg, #1a1a1a 0%, #0d0d0d 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Wrench size={40} color={isWhite ? "#ccc" : "#2a2a2a"} strokeWidth={1} />
                        </div>
                      )}
                      {/* Accent stripe */}
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: 3,
                          height: "38%",
                          background: "var(--color-accent)",
                          borderRadius: "12px 0 0 0",
                        }}
                      />
                      {/* Number badge */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 20,
                          right: 20,
                          fontFamily: "var(--font-display)",
                          fontSize: 72,
                          letterSpacing: "0.02em",
                          color: "rgba(245,245,240,0.06)",
                          lineHeight: 1,
                          userSelect: "none",
                          pointerEvents: "none",
                        }}
                      >
                        {label}
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ order: isEven ? 2 : 1 }}>
                      {/* Number label */}
                      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-accent)", letterSpacing: "0.12em" }}>
                          {label}
                        </span>
                        <div style={{ flex: 1, height: 1, background: "var(--color-accent)", maxWidth: 32, opacity: 0.5 }} />
                        <span style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: isWhite ? "#999" : "var(--color-muted)" }}>
                          Service
                        </span>
                      </div>

                      {/* Title */}
                      <h2
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "clamp(36px, 4.5vw, 56px)",
                          color: isWhite ? "#0A0A0A" : "var(--color-text)",
                          letterSpacing: "0.03em",
                          lineHeight: 0.95,
                          marginBottom: 24,
                        }}
                      >
                        {service.titre.toUpperCase()}
                      </h2>

                      <Wrench
                        size={20}
                        color="var(--color-accent)"
                        strokeWidth={1.5}
                        style={{ marginBottom: 20, display: "block" }}
                      />

                      {/* Description */}
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontWeight: 300,
                          fontSize: 14,
                          color: isWhite ? "#555" : "var(--color-muted)",
                          lineHeight: 1.75,
                          marginBottom: 36,
                          letterSpacing: "0.01em",
                        }}
                      >
                        {service.description}
                      </p>

                      {/* Price + CTA */}
                      <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
                        {service.prix_indicatif && (
                          <div
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: 20,
                              fontWeight: 500,
                              color: isWhite ? "#0A0A0A" : "var(--color-text)",
                              letterSpacing: "0.02em",
                            }}
                          >
                            Dès {Number(service.prix_indicatif).toLocaleString("fr-CH")} CHF
                          </div>
                        )}
                        <Link href="/contact" className="btn btn-primary">
                          Nous contacter
                          <ChevronRight size={13} strokeWidth={2} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && activeServices.length === 0 && (
        <div className="wrap" style={{ paddingTop: 120, paddingBottom: 120, textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--color-muted)", fontWeight: 300 }}>
            Nos services arrivent bientôt.
          </p>
        </div>
      )}

      {/* CTA strip */}
      <section
        style={{
          background: "var(--color-surface)",
          borderTop: "1px solid var(--color-border)",
          padding: "80px 0",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.025)",
        }}
      >
        <div
          className="wrap"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}
        >
          <div>
            <span className="label" style={{ marginBottom: 12 }}>Une question ?</span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 5vw, 64px)",
                color: "var(--color-text)",
                letterSpacing: "0.03em",
                lineHeight: 0.95,
              }}
            >
              PARLONS
              <br />
              DE VOTRE PROJET
            </h2>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/contact" className="btn btn-primary">
              Nous contacter
              <ArrowRight size={14} strokeWidth={2} />
            </Link>
            <Link href="/motos" className="btn btn-outline">
              Voir nos motos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
