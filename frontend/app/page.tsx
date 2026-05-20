"use client";

import Link from "next/link";
import { ChevronRight, ChevronLeft, Bike, Tag, Wrench, CreditCard, Sticker } from "lucide-react";
import { MotoCard } from "@/components/MotoCard";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const H2: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "clamp(52px, 7.5vw, 88px)",
  color: "var(--color-text)",
  letterSpacing: "0.03em",
  lineHeight: 0.95,
};

const VISIBLE = 3;

export default function HomePage() {
  const { data: motosData } = useQuery({
    queryKey: ["motos-featured"],
    queryFn: () => api.motos.list({ featured: true, limit: 6 }),
  });
  const featuredMotos = motosData?.data ?? [];

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews-visible"],
    queryFn: () => api.reviews.listVisible(),
  });

  const [reviewPage, setReviewPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(reviews.length / VISIBLE));
  const visibleReviews = reviews.slice(reviewPage * VISIBLE, reviewPage * VISIBLE + VISIBLE);

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          overflow: "hidden",
          background: "var(--color-bg)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero/hero-bg.webp"
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            opacity: 0.45,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 80% 60% at 60% 40%, #1e1212 0%, #0a0a0a 70%)",
            opacity: 0.75,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "55%",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(230,0,36,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 240,
            background: "linear-gradient(to bottom, transparent, var(--color-bg))",
            pointerEvents: "none",
          }}
        />

        <div className="wrap" style={{ position: "relative", zIndex: 1, paddingTop: 72, paddingBottom: 80 }}>
          <span className="label h-anim h-anim-1" style={{ marginBottom: 32, display: "block" }}>
            Lausanne · Suisse · Depuis 2022
          </span>

          <h1
            className="h-anim h-anim-2"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(72px, 14vw, 160px)",
              color: "var(--color-text)",
              letterSpacing: "0.02em",
              lineHeight: 0.88,
              marginBottom: 0,
            }}
          >
            VOTRE
            <br />
            PROCHAINE
          </h1>
          <h1
            className="text-ghost h-anim h-anim-3"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(72px, 14vw, 160px)",
              letterSpacing: "0.02em",
              lineHeight: 0.88,
              marginBottom: 48,
            }}
          >
            MOTO
          </h1>

          <div className="h-anim h-anim-4" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/motos" className="btn btn-primary">
              Voir nos motos
              <ChevronRight size={14} strokeWidth={2} />
            </Link>
            <Link href="/contact" className="btn btn-outline">
              Nous contacter
            </Link>
          </div>
        </div>

        <div
          className="h-anim h-anim-5"
          style={{
            position: "absolute",
            right: 32,
            bottom: 32,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            opacity: 0.3,
          }}
        >
          <div style={{ width: 1, height: 48, background: "var(--color-text)" }} />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 9,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--color-text)",
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            Défiler
          </span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SÉLECTION DU MOMENT — white
      ══════════════════════════════════════════════════════ */}
      <section className="section-pad" style={{ background: "#FFFFFF", borderTop: "1px solid #E5E5E5" }}>
        <div className="wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
            <div>
              <span className="label" style={{ marginBottom: 12 }}>Catalogue</span>
              <h2 style={{ ...H2, color: "#0A0A0A" }}>SÉLECTION<br />DU MOMENT</h2>
            </div>

            <Link
              href="/motos"
              className="hidden md:flex"
              style={{
                alignItems: "center",
                gap: 6,
                fontFamily: "var(--font-body)",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#888",
                textDecoration: "none",
                transition: "color 160ms ease",
                paddingBottom: 4,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0A0A0A")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
            >
              Tout le catalogue
              <ChevronRight size={13} strokeWidth={2} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 20 }}>
            {featuredMotos.map((moto) => (
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
              />
            ))}
          </div>

          <div className="md:hidden" style={{ marginTop: 32, textAlign: "center" }}>
            <Link href="/motos" className="btn btn-outline" style={{ color: "#0A0A0A", borderColor: "rgba(0,0,0,0.2)" }}>
              Voir tout le catalogue
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          POURQUOI NOUS
      ══════════════════════════════════════════════════════ */}
      <section
        className="section-pad"
        style={{
          background: "var(--color-surface)",
          borderTop: "1px solid var(--color-border)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.025)",
        }}
      >
        <div className="wrap">
          <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 80, alignItems: "center" }}>
            <div className="card" style={{ aspectRatio: "4/3", overflow: "hidden", position: "relative" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero/image%20copy%204.webp"
                alt="Motos à Lausanne"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: 3,
                  height: "42%",
                  background: "var(--color-accent)",
                  borderRadius: "0 0 0 12px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 20,
                  left: 20,
                  background: "rgba(10,10,10,0.8)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 4,
                  padding: "6px 12px",
                  fontFamily: "var(--font-body)",
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--color-muted)",
                }}
              >
                Lausanne, Suisse
              </div>
            </div>

            <div>
              <span className="label" style={{ marginBottom: 20 }}>Notre histoire</span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(52px, 6.5vw, 80px)",
                  color: "var(--color-accent)",
                  letterSpacing: "0.03em",
                  lineHeight: 0.92,
                  marginBottom: 32,
                }}
              >
                POURQUOI
                <br />
                NOUS ?
              </h2>

              <div style={{ width: 48, height: 1, background: "var(--color-accent)", marginBottom: 32, opacity: 0.7 }} />

              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 300,
                  fontSize: 14,
                  color: "var(--color-muted)",
                  lineHeight: 1.75,
                  marginBottom: 20,
                  letterSpacing: "0.01em",
                }}
              >
                Depuis 2022, nous proposons une dizaine de motos choisies avec soin pour leur qualité
                et leur prix. De la petite cylindrée au gros cube, pour la balade ou la piste,
                nous avons la machine qu&apos;il vous faut.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 300,
                  fontSize: 14,
                  color: "var(--color-muted)",
                  lineHeight: 1.75,
                  marginBottom: 48,
                  letterSpacing: "0.01em",
                }}
              >
                Passionnés et expérimentés, nous répondons à toutes vos questions.
                Pilote confirmé ou débutant, nous vous conseillons avec plaisir.
              </p>

              <Link href="/contact" className="btn btn-primary">
                Parler à un expert
                <ChevronRight size={14} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SERVICES BENTO — white
      ══════════════════════════════════════════════════════ */}
      <section className="section-pad" style={{ background: "#FFFFFF", borderTop: "1px solid #E5E5E5" }}>
        <div className="wrap">
          <div style={{ marginBottom: 56 }}>
            <span className="label" style={{ marginBottom: 12 }}>Services</span>
            <h2 style={{ ...H2, color: "#0A0A0A" }}>NOS SERVICES</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 16 }}>
            <BentoTile label="Nos Motos" href="/motos" Icon={Bike} big image="/images/hero/image%20copy%203.webp" />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <BentoTile label="Motos vendues" href="/motos" Icon={Tag} image="/images/hero/image%20copy%205.webp" />
              <BentoTile label="Pose Stickers" href="/services" Icon={Sticker} image="/images/hero/image.webp" />
              <BentoTile label="Achat de pièces" href="/services" Icon={Wrench} image="/images/hero/image%20copy%202.webp" />
              <BentoTile label="Financement" href="/contact" Icon={CreditCard} image="/images/hero/image%20copy.webp" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          AVIS CLIENTS — credible review grid
      ══════════════════════════════════════════════════════ */}
      <section
        className="section-pad"
        style={{
          background: "var(--color-surface)",
          borderTop: "1px solid var(--color-border)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.025)",
        }}
      >
        <div className="wrap">

          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="label" style={{ marginBottom: 16, display: "block" }}>
              Témoignages clients
            </span>
            <h2 style={{ ...H2, marginBottom: 32 }}>
              CE QU&apos;ILS<br />EN DISENT
            </h2>

            {reviews.length > 0 && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "14px 24px",
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 100,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <div style={{ display: "flex", gap: 3 }}>
                  {[1, 2, 3, 4, 5].map((s) => {
                    const avg = reviews.reduce((sum, r) => sum + r.note, 0) / reviews.length;
                    const filled = s <= Math.round(avg);
                    return (
                      <svg key={s} width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#FFB400" : "var(--color-border)"}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    );
                  })}
                </div>
                <div style={{ width: 1, height: 20, background: "var(--color-border)" }} />
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    color: "var(--color-text)",
                    fontWeight: 500,
                  }}
                >
                  {(reviews.reduce((s, r) => s + r.note, 0) / reviews.length).toFixed(1)}
                  <span style={{ color: "var(--color-muted)", fontWeight: 300 }}>/5</span>
                </span>
                <div style={{ width: 1, height: 20, background: "var(--color-border)" }} />
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--color-muted)",
                    fontWeight: 300,
                  }}
                >
                  basé sur <span style={{ color: "var(--color-text)", fontWeight: 500 }}>{reviews.length}</span>{" "}
                  avis client{reviews.length > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 20, marginBottom: 40 }}>
            {visibleReviews.map((review, i) => {
              const colors = [
                "linear-gradient(135deg, #E60024 0%, #B80020 100%)",
                "linear-gradient(135deg, #FF8800 0%, #CC6600 100%)",
                "linear-gradient(135deg, #2B6CB0 0%, #1A4480 100%)",
                "linear-gradient(135deg, #9F7AEA 0%, #6B46C1 100%)",
                "linear-gradient(135deg, #38A169 0%, #276749 100%)",
              ];
              const colorIdx = review.nom.charCodeAt(0) % colors.length;
              const dateStr = new Date(review.createdAt).toLocaleDateString("fr-CH", {
                day: "numeric",
                month: "long",
                year: "numeric",
              });

              return (
                <article
                  key={`${reviewPage}-${i}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    padding: "28px 26px",
                    position: "relative",
                    transition: "all 200ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.035)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "3px 8px",
                      background: "rgba(0,200,80,0.08)",
                      border: "1px solid rgba(0,200,80,0.2)",
                      borderRadius: 100,
                    }}
                  >
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#00C850" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 9,
                        fontWeight: 500,
                        color: "#00C850",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      Vérifié
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: colors[colorIdx],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-display)",
                        fontSize: 18,
                        color: "#fff",
                        letterSpacing: "0.02em",
                        flexShrink: 0,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                      }}
                    >
                      {review.nom.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 14,
                          fontWeight: 500,
                          color: "var(--color-text)",
                          display: "block",
                          letterSpacing: "0.01em",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {review.nom}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 11,
                          color: "var(--color-muted)",
                          fontWeight: 300,
                        }}
                      >
                        {review.ville ? `${review.ville} · ` : ""}{dateStr}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
                    {Array.from({ length: 5 }).map((_, s) => (
                      <svg
                        key={s}
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill={s < review.note ? "#FFB400" : "var(--color-border)"}
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>

                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 300,
                      fontSize: 14,
                      color: "var(--color-text)",
                      lineHeight: 1.7,
                      letterSpacing: "0.005em",
                      margin: 0,
                      flex: 1,
                      opacity: 0.9,
                    }}
                  >
                    {review.texte}
                  </p>

                  {review.moto && (
                    <div
                      style={{
                        marginTop: 20,
                        paddingTop: 16,
                        borderTop: "1px solid var(--color-border)",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Bike size={11} color="var(--color-accent)" strokeWidth={1.8} />
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 11,
                          color: "var(--color-muted)",
                          fontWeight: 300,
                        }}
                      >
                        A acheté la{" "}
                        <span
                          style={{
                            color: "var(--color-accent)",
                            fontWeight: 500,
                            letterSpacing: "0.02em",
                          }}
                        >
                          {review.moto}
                        </span>
                      </span>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 24,
                paddingTop: 16,
              }}
            >
              <button
                onClick={() => setReviewPage((p) => Math.max(0, p - 1))}
                disabled={reviewPage === 0}
                aria-label="Avis précédents"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: "1px solid var(--color-border)",
                  background: "transparent",
                  color: reviewPage === 0 ? "var(--color-border)" : "var(--color-muted)",
                  cursor: reviewPage === 0 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 160ms ease",
                }}
                onMouseEnter={(e) => {
                  if (reviewPage > 0) {
                    e.currentTarget.style.borderColor = "var(--color-accent)";
                    e.currentTarget.style.color = "var(--color-accent)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                  e.currentTarget.style.color = reviewPage === 0 ? "var(--color-border)" : "var(--color-muted)";
                }}
              >
                <ChevronLeft size={15} strokeWidth={1.5} />
              </button>

              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--color-muted)",
                  letterSpacing: "0.12em",
                  minWidth: 64,
                  textAlign: "center",
                }}
              >
                {String(reviewPage + 1).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
              </span>

              <button
                onClick={() => setReviewPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={reviewPage === totalPages - 1}
                aria-label="Avis suivants"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: "1px solid var(--color-border)",
                  background: "transparent",
                  color: reviewPage === totalPages - 1 ? "var(--color-border)" : "var(--color-muted)",
                  cursor: reviewPage === totalPages - 1 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 160ms ease",
                }}
                onMouseEnter={(e) => {
                  if (reviewPage < totalPages - 1) {
                    e.currentTarget.style.borderColor = "var(--color-accent)";
                    e.currentTarget.style.color = "var(--color-accent)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                  e.currentTarget.style.color = reviewPage === totalPages - 1 ? "var(--color-border)" : "var(--color-muted)";
                }}
              >
                <ChevronRight size={15} strokeWidth={1.5} />
              </button>
            </div>
          )}

          {reviews.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "40px 0",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--color-muted)",
                fontWeight: 300,
              }}
            >
              Soyez le premier à laisser un avis.
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA STRIP
      ══════════════════════════════════════════════════════ */}
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
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 40,
            flexWrap: "wrap",
          }}
        >
          <div>
            <span className="label" style={{ marginBottom: 12 }}>Prêt à démarrer ?</span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(40px, 5vw, 64px)",
                color: "var(--color-text)",
                letterSpacing: "0.03em",
                lineHeight: 0.95,
              }}
            >
              TROUVONS
              <br />
              VOTRE MOTO
            </h2>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/motos" className="btn btn-primary">
              Voir le catalogue
              <ChevronRight size={14} strokeWidth={2} />
            </Link>
            <Link href="/contact" className="btn btn-outline">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function BentoTile({
  label, href, Icon, big = false, image,
}: {
  label: string;
  href: string;
  Icon: React.ElementType;
  big?: boolean;
  image?: string;
}) {
  return (
    <Link
      href={href}
      className="card"
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        textDecoration: "none",
        minHeight: big ? 360 : 164,
        padding: 28,
      }}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={label}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            transition: "transform 400ms cubic-bezier(0.4,0,0.2,1)",
          }}
          className="bento-img"
        />
      ) : (
        <div className="img-placeholder" style={{ position: "absolute", inset: 0 }} />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(5,5,5,0.92) 0%, rgba(10,10,10,0.3) 55%, transparent 100%)",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <Icon
          size={big ? 22 : 16}
          color="var(--color-accent)"
          strokeWidth={1.5}
          style={{ marginBottom: 10, display: "block" }}
        />
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: big ? 28 : 20,
            color: "var(--color-text)",
            letterSpacing: "0.05em",
            display: "block",
            lineHeight: 1,
          }}
        >
          {label.toUpperCase()}
        </span>
      </div>
    </Link>
  );
}
