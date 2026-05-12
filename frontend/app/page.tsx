"use client";

import Link from "next/link";
import { ChevronRight, ChevronLeft, Bike, Tag, Wrench, CreditCard, Sticker } from "lucide-react";
import { MotoCard } from "@/components/MotoCard";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

/* Heading size used for every section h2 */
const H2: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "clamp(52px, 7.5vw, 88px)",
  color: "var(--color-text)",
  letterSpacing: "0.03em",
  lineHeight: 0.95,
};

const VISIBLE = 3; // cards per page

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
          HERO — headline dominates the viewport
      ══════════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",   /* content anchored bottom-left */
          overflow: "hidden",
          background: "var(--color-bg)",
        }}
      >
        {/* Hero photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero/hero-bg.jpg"
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
        {/* Dark overlay to keep text legible */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 60% at 60% 40%, #1e1212 0%, #0a0a0a 70%)",
            opacity: 0.75,
            pointerEvents: "none",
          }}
        />
        {/* Subtle red ambient in the center */}
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
        {/* Bottom fade */}
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

        {/* Hero content — bottom-left anchored, editorial */}
        <div
          className="wrap"
          style={{
            position: "relative",
            zIndex: 1,
            paddingTop: 72,
            paddingBottom: 80,
          }}
        >
          {/* Eyebrow */}
          <span
            className="label h-anim h-anim-1"
            style={{ marginBottom: 32, display: "block" }}
          >
            Lausanne · Suisse · Depuis 2022
          </span>

          {/* DOMINANT headline — fills the screen */}
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

          {/* CTAs */}
          <div
            className="h-anim h-anim-4"
            style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
          >
            <Link href="/motos" className="btn btn-primary">
              Voir nos motos
              <ChevronRight size={14} strokeWidth={2} />
            </Link>
            <Link href="/contact" className="btn btn-outline">
              Nous contacter
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
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
          AVIS CLIENTS — carousel + leave a review
      ══════════════════════════════════════════════════════ */}
      <section
        className="section-pad"
        style={{ background: "var(--color-surface)", borderTop: "1px solid var(--color-border)" }}
      >
        <div className="wrap">

          {/* Header row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
            <div>
              <span className="label" style={{ marginBottom: 12 }}>Ce qu&apos;ils disent</span>
              <h2 style={H2}>AVIS<br />CLIENTS</h2>
            </div>
            {/* Score + arrows */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 16 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, justifyContent: "flex-end" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 48, color: "var(--color-text)", letterSpacing: "0.02em", lineHeight: 1 }}>
                    {reviews.length > 0 ? (reviews.reduce((s, r) => s + r.note, 0) / reviews.length).toFixed(1) : "–"}
                  </span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-muted)", fontWeight: 300 }}>/5</span>
                </div>
                <div style={{ display: "flex", gap: 3, justifyContent: "flex-end", margin: "6px 0 4px" }}>
                  {[1,2,3,4,5].map((s) => (
                    <svg key={s} width="11" height="11" viewBox="0 0 24 24" fill="var(--color-accent)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
                </div>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--color-muted)", fontWeight: 300 }}>{reviews.length} avis</span>
              </div>
              {/* Pagination arrows */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--color-muted)", letterSpacing: "0.06em" }}>
                  {String(reviewPage + 1).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
                </span>
                <button
                  onClick={() => setReviewPage((p) => Math.max(0, p - 1))}
                  disabled={reviewPage === 0}
                  style={{ width: 40, height: 40, borderRadius: 4, border: "1px solid var(--color-border)", background: "transparent", color: reviewPage === 0 ? "var(--color-border)" : "var(--color-muted)", cursor: reviewPage === 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 150ms ease" }}
                  onMouseEnter={(e) => { if (reviewPage > 0) { e.currentTarget.style.borderColor = "var(--color-accent)"; e.currentTarget.style.color = "var(--color-accent)"; }}}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.color = reviewPage === 0 ? "var(--color-border)" : "var(--color-muted)"; }}
                >
                  <ChevronLeft size={16} strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => setReviewPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={reviewPage === totalPages - 1}
                  style={{ width: 40, height: 40, borderRadius: 4, border: "1px solid var(--color-border)", background: "transparent", color: reviewPage === totalPages - 1 ? "var(--color-border)" : "var(--color-muted)", cursor: reviewPage === totalPages - 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 150ms ease" }}
                  onMouseEnter={(e) => { if (reviewPage < totalPages - 1) { e.currentTarget.style.borderColor = "var(--color-accent)"; e.currentTarget.style.color = "var(--color-accent)"; }}}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.color = reviewPage === totalPages - 1 ? "var(--color-border)" : "var(--color-muted)"; }}
                >
                  <ChevronRight size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 20, marginBottom: 64 }}>
            {visibleReviews.map((review, i) => (
              <div key={`${reviewPage}-${i}`} className="card" style={{ padding: "32px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "flex", gap: 3 }}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <svg key={s} width="11" height="11" viewBox="0 0 24 24" fill={s < review.note ? "var(--color-accent)" : "var(--color-border)"}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
                </div>
                <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 14, color: "var(--color-muted)", lineHeight: 1.72, letterSpacing: "0.01em", flex: 1 }}>
                  &ldquo;{review.texte}&rdquo;
                </p>
                <div style={{ height: 1, background: "var(--color-border)" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500, color: "var(--color-text)", display: "block" }}>{review.nom}</span>
                    {review.ville && <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--color-muted)", fontWeight: 300 }}>{review.ville}</span>}
                  </div>
                  {review.moto && <span style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-accent)", border: "1px solid rgba(230,0,36,0.25)", borderRadius: 3, padding: "3px 7px", whiteSpace: "nowrap" }}>{review.moto}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Dot indicators */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 64 }}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => setReviewPage(i)} style={{ width: i === reviewPage ? 24 : 8, height: 8, borderRadius: 4, border: "none", background: i === reviewPage ? "var(--color-accent)" : "var(--color-border)", cursor: "pointer", padding: 0, transition: "all 250ms ease" }} />
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURED MOTOS — white section
      ══════════════════════════════════════════════════════ */}
      <section
        className="section-pad"
        style={{
          background: "#FFFFFF",
          borderTop: "1px solid #E5E5E5",
        }}
      >
        <div className="wrap">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 48,
              flexWrap: "wrap",
              gap: 16,
            }}
          >
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
          /* Layered surface for depth */
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.025)",
        }}
      >
        <div className="wrap">
          <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 80, alignItems: "center" }}>
            {/* Photo */}
            <div
              className="card"
              style={{
                aspectRatio: "4/3",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero/image%20copy%204.png"
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
              {/* Accent stripe */}
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
              {/* Corner label */}
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

            {/* Text */}
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

              {/* Accent rule */}
              <div
                style={{
                  width: 48,
                  height: 1,
                  background: "var(--color-accent)",
                  marginBottom: 32,
                  opacity: 0.7,
                }}
              />

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
          SERVICES BENTO — white section
      ══════════════════════════════════════════════════════ */}
      <section
        className="section-pad"
        style={{
          background: "#FFFFFF",
          borderTop: "1px solid #E5E5E5",
        }}
      >
        <div className="wrap">
          <div style={{ marginBottom: 56 }}>
            <span className="label" style={{ marginBottom: 12 }}>Services</span>
            <h2 style={{ ...H2, color: "#0A0A0A" }}>NOS SERVICES</h2>
          </div>

          {/* Bento: big left + 2×2 right */}
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 16 }}>
            {/* Big tile */}
            <BentoTile
              label="Nos Motos"
              href="/motos"
              Icon={Bike}
              big
              image="/images/hero/image%20copy%203.png"
            />

            {/* 2×2 sub-grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <BentoTile label="Motos vendues" href="/motos" Icon={Tag} image="/images/hero/image%20copy%205.png" />
              <BentoTile label="Pose Stickers" href="/services" Icon={Sticker} image="/images/hero/image.png" />
              <BentoTile label="Achat de pièces" href="/services" Icon={Wrench} image="/images/hero/image%20copy%202.png" />
              <BentoTile label="Financement" href="/contact" Icon={CreditCard} image="/images/hero/image%20copy.png" />
            </div>
          </div>
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

/* ── Bento tile ────────────────────────────────────────────── */
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
