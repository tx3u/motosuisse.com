"use client";

import Link from "next/link";
import { ChevronRight, Clock, CalendarDays } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api, ArticleSummary } from "@/lib/api";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-CH", { month: "long", year: "numeric" });
}

function readingTime(titre: string) {
  const words = titre.split(" ").length * 40;
  return `${Math.max(2, Math.round(words / 200))} min`;
}

export default function TipsPage() {
  const { data: articles = [], isLoading, isError } = useQuery<ArticleSummary[]>({
    queryKey: ["tips-articles"],
    queryFn: () => api.articles.listPublic(),
  });

  const [featured, ...rest] = articles;

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh", paddingTop: 72 }}>

      {/* ── Header ──────────────────────────────────────────── */}
      <div style={{ borderBottom: "1px solid var(--color-border)" }}>
        <div className="wrap" style={{ paddingTop: 56, paddingBottom: 48 }}>
          <span className="label h-anim h-anim-1" style={{ marginBottom: 16 }}>
            Conseils & guides
          </span>
          <h1
            className="h-anim h-anim-2"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(52px, 10vw, 110px)",
              color: "var(--color-text)",
              letterSpacing: "0.03em",
              lineHeight: 0.88,
            }}
          >
            TIPS &<br />TRICKS
          </h1>
        </div>
      </div>

      <div className="wrap h-anim h-anim-3" style={{ paddingTop: 64, paddingBottom: 96 }}>

        {/* ── Loading ───────────────────────────────────────── */}
        {isLoading && (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-muted)", letterSpacing: "0.12em" }}>
              CHARGEMENT…
            </span>
          </div>
        )}

        {/* ── Error / Empty state ───────────────────────────── */}
        {!isLoading && isError && (
          <div style={{ textAlign: "center", paddingTop: 80 }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--color-muted)" }}>
              Impossible de charger les articles. Vérifiez que le serveur est démarré.
            </p>
          </div>
        )}
        {!isLoading && !isError && articles.length === 0 && (
          <div style={{ textAlign: "center", paddingTop: 80 }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--color-muted)" }}>
              Aucun article publié pour le moment. Revenez bientôt !
            </p>
          </div>
        )}

        {/* ── Featured article ──────────────────────────────── */}
        {featured && (
          <Link
            href={`/tips/${featured.slug}`}
            style={{ textDecoration: "none", display: "block", marginBottom: 64 }}
          >
            <div
              className="card tips-featured"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                overflow: "hidden",
                transition: "transform 200ms ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              {/* Image */}
              <div
                style={{
                  aspectRatio: "4/3",
                  background: featured.image_couverture
                    ? `url(${featured.image_couverture}) center/cover no-repeat`
                    : "linear-gradient(135deg, #1a0a0a 0%, #0d0d0d 100%)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {!featured.image_couverture && (
                  <div className="img-placeholder" style={{ position: "absolute", inset: 0 }} />
                )}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to right, transparent 60%, var(--color-surface) 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute", top: 20, left: 20,
                    background: "var(--color-accent)", borderRadius: 3,
                    padding: "4px 10px",
                    fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 500,
                    letterSpacing: "0.18em", color: "#fff", textTransform: "uppercase",
                  }}
                >
                  À la une
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Clock size={11} color="var(--color-muted)" strokeWidth={1.5} />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--color-muted)" }}>
                      {readingTime(featured.titre)}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <CalendarDays size={11} color="var(--color-muted)" strokeWidth={1.5} />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--color-muted)" }}>
                      {formatDate(featured.createdAt)}
                    </span>
                  </div>
                </div>

                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(28px, 3vw, 42px)",
                    color: "var(--color-text)",
                    letterSpacing: "0.03em",
                    lineHeight: 1.0,
                    marginBottom: 20,
                  }}
                >
                  {featured.titre.toUpperCase()}
                </h2>

                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--color-accent)" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Lire l&apos;article
                  </span>
                  <ChevronRight size={13} strokeWidth={2} />
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* ── Grid articles ─────────────────────────────────── */}
        {rest.length > 0 && (
          <>
            <div style={{ height: 1, background: "var(--color-border)", marginBottom: 48 }} />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 20,
              }}
            >
              {rest.map((article) => (
                <Link
                  key={article.slug}
                  href={`/tips/${article.slug}`}
                  className="card"
                  style={{ display: "flex", flexDirection: "column", padding: "28px", textDecoration: "none" }}
                >
                  {article.image_couverture && (
                    <div
                      style={{
                        height: 160, borderRadius: 4, marginBottom: 20,
                        background: `url(${article.image_couverture}) center/cover no-repeat`,
                      }}
                    />
                  )}

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Clock size={10} color="var(--color-muted)" strokeWidth={1.5} />
                      <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--color-muted)" }}>
                        {readingTime(article.titre)}
                      </span>
                    </div>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-muted)", letterSpacing: "0.04em" }}>
                      {formatDate(article.createdAt)}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: "var(--font-display)", fontSize: 22,
                      color: "var(--color-text)", letterSpacing: "0.04em",
                      lineHeight: 1.05, marginBottom: 14, flex: 1,
                    }}
                  >
                    {article.titre.toUpperCase()}
                  </h3>

                  <div style={{ height: 1, background: "var(--color-border)", marginBottom: 14 }} />

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <ChevronRight size={13} color="var(--color-accent)" strokeWidth={2} />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
