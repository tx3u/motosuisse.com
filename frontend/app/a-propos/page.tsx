"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, MapPin, Calendar, Bike, Heart } from "lucide-react";

const VALEURS = [
  {
    numero: "01",
    titre: "Sélection exigeante",
    texte:
      "Chaque moto de notre catalogue est inspectée avec soin. On refuse ce qui ne nous convainc pas — parce que votre confiance vaut plus qu'une vente rapide.",
  },
  {
    numero: "02",
    titre: "Conseil honnête",
    texte:
      "Vous êtes débutant ou pilote confirmé ? On vous dit ce qui vous correspond vraiment, pas ce qui coûte le plus cher. Notre réputation repose sur votre satisfaction.",
  },
  {
    numero: "03",
    titre: "Passion avant tout",
    texte:
      "On ne fait pas ça pour les chiffres. On fait ça parce qu'on aime les motos, les routes de montagne, et les gens qui partagent cette passion.",
  },
  {
    numero: "04",
    titre: "Ancrage local",
    texte:
      "Lausanne, c'est chez nous. On connaît les routes, les saisons, et les besoins des motards romands. Pas un catalogue impersonnel — une vraie adresse de quartier.",
  },
];

const CHIFFRES = [
  { valeur: "2022", label: "Année de création", Icon: Calendar },
  { valeur: "27+", label: "Motos vendues", Icon: Bike },
  { valeur: "100%", label: "Indépendant", Icon: Heart },
  { valeur: "Lausanne", label: "Basé à", Icon: MapPin },
];

export default function AProposPage() {
  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh", paddingTop: 72 }}>

      {/* ── Header ──────────────────────────────────────────── */}
      <div style={{ borderBottom: "1px solid var(--color-border)" }}>
        <div className="wrap" style={{ paddingTop: 56, paddingBottom: 48 }}>
          <span className="label h-anim h-anim-1" style={{ marginBottom: 16 }}>
            Notre histoire
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
            À PROPOS
            <br />
            <span style={{ color: "var(--color-accent)" }}>DE NOUS</span>
          </h1>
        </div>
      </div>

      {/* ── Story section ───────────────────────────────────── */}
      <section
        className="section-pad h-anim h-anim-3"
        style={{ background: "var(--color-bg)", borderBottom: "1px solid var(--color-border)" }}
      >
        <div className="wrap">
          <div
            className="grid grid-cols-1 lg:grid-cols-2"
            style={{ gap: 80, alignItems: "center" }}
          >
            {/* Photo */}
            <div
              className="card"
              style={{ aspectRatio: "4/3", overflow: "hidden", position: "relative" }}
            >
              <Image
                src="/images/hero/hero-bg.jpg"
                alt="Atelier MotoSuisse à Lausanne"
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {/* Red accent stripe */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 3,
                  height: "40%",
                  background: "var(--color-accent)",
                  borderRadius: "0 12px 0 0",
                }}
              />
              {/* Year badge */}
              <div
                style={{
                  position: "absolute",
                  bottom: 20,
                  left: 20,
                  background: "rgba(10,10,10,0.85)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 4,
                  padding: "8px 14px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 28,
                    color: "var(--color-accent)",
                    letterSpacing: "0.04em",
                    display: "block",
                    lineHeight: 1,
                  }}
                >
                  2022
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 9,
                    fontWeight: 500,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--color-muted)",
                    display: "block",
                    marginTop: 2,
                  }}
                >
                  Fondé à Lausanne
                </span>
              </div>
            </div>

            {/* Text */}
            <div>
              <span className="label" style={{ marginBottom: 20 }}>L&apos;histoire</span>

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
                UNE PASSION
                <br />
                DEVENUE MÉTIER
              </h2>

              <div
                style={{
                  width: 40,
                  height: 1,
                  background: "var(--color-accent)",
                  marginBottom: 28,
                  opacity: 0.7,
                }}
              />

              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 300,
                  fontSize: 14,
                  color: "var(--color-muted)",
                  lineHeight: 1.78,
                  marginBottom: 20,
                  letterSpacing: "0.01em",
                }}
              >
                Motosuisse est née en 2022 d'une conviction simple : il manquait à Lausanne
                un endroit où trouver des motos d'occasion bien sélectionnées, vendues par
                des passionnés qui vous parlent franchement.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 300,
                  fontSize: 14,
                  color: "var(--color-muted)",
                  lineHeight: 1.78,
                  marginBottom: 20,
                  letterSpacing: "0.01em",
                }}
              >
                Pas de discours commercial, pas de stock gonflé. Une dizaine de motos
                choisies avec soin, à des prix honnêtes, pour des gens qui savent ce qu'ils
                veulent — ou qui ont besoin qu'on les aide à le trouver.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 300,
                  fontSize: 14,
                  color: "var(--color-muted)",
                  lineHeight: 1.78,
                  marginBottom: 40,
                  letterSpacing: "0.01em",
                }}
              >
                Depuis nos débuts, nous avons accompagné des dizaines de motards romands
                dans leur achat. Chaque vente est une conversation. Chaque moto a une
                histoire.
              </p>

              <Link href="/contact" className="btn btn-primary">
                Venir nous rencontrer
                <ChevronRight size={14} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Chiffres — white section ─────────────────────────── */}
      <section
        className="section-pad"
        style={{ background: "#FFFFFF", borderBottom: "1px solid #E5E5E5" }}
      >
        <div className="wrap">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 1,
              background: "#E5E5E5",
              border: "1px solid #E5E5E5",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {CHIFFRES.map(({ valeur, label, Icon }) => (
              <div
                key={label}
                style={{
                  background: "#FFFFFF",
                  padding: "40px 32px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <Icon size={18} color="var(--color-accent)" strokeWidth={1.5} />
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 48,
                    color: "#0A0A0A",
                    letterSpacing: "0.02em",
                    lineHeight: 1,
                  }}
                >
                  {valeur}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#999",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Valeurs ─────────────────────────────────────────── */}
      <section
        className="section-pad"
        style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}
      >
        <div className="wrap">
          <div style={{ marginBottom: 56 }}>
            <span className="label" style={{ marginBottom: 14 }}>Ce qui nous guide</span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(40px, 6vw, 72px)",
                color: "var(--color-text)",
                letterSpacing: "0.03em",
                lineHeight: 0.95,
              }}
            >
              NOS VALEURS
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {VALEURS.map(({ numero, titre, texte }) => (
              <div
                key={numero}
                className="card"
                style={{ padding: "32px 28px" }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--color-accent)",
                    letterSpacing: "0.12em",
                    display: "block",
                    marginBottom: 16,
                  }}
                >
                  {numero}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    color: "var(--color-text)",
                    letterSpacing: "0.04em",
                    lineHeight: 1.05,
                    marginBottom: 14,
                  }}
                >
                  {titre.toUpperCase()}
                </h3>
                <div style={{ height: 1, background: "var(--color-border)", marginBottom: 16 }} />
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 300,
                    fontSize: 13,
                    color: "var(--color-muted)",
                    lineHeight: 1.68,
                    letterSpacing: "0.01em",
                  }}
                >
                  {texte}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--color-bg)",
          borderTop: "1px solid var(--color-border)",
          padding: "80px 0",
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
            <span className="label" style={{ marginBottom: 12 }}>On vous attend</span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 5vw, 60px)",
                color: "var(--color-text)",
                letterSpacing: "0.03em",
                lineHeight: 0.95,
              }}
            >
              VENEZ NOUS
              <br />
              RENCONTRER
            </h2>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/contact" className="btn btn-primary">
              Nous contacter
              <ChevronRight size={14} strokeWidth={2} />
            </Link>
            <Link href="/motos" className="btn btn-outline">
              Voir les motos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
