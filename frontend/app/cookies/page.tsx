"use client";

import Link from "next/link";
import { clearConsent } from "@/lib/consent";

const TYPES = [
  {
    categorie: "Cookies essentiels",
    requis: true,
    description: "Indispensables au fonctionnement du site. Ils ne collectent aucune donnée personnelle identifiable.",
    cookies: [
      { nom: "session", duree: "Session", finalite: "Maintien de la session utilisateur" },
      { nom: "csrf_token", duree: "Session", finalite: "Protection contre les attaques CSRF" },
    ],
  },
  {
    categorie: "Cookies analytiques",
    requis: false,
    description: "Nous aident à comprendre comment les visiteurs utilisent le site. Toutes les données sont anonymisées.",
    cookies: [
      { nom: "_ga", duree: "13 mois", finalite: "Identifiant visiteur anonyme (Google Analytics)" },
      { nom: "_ga_*", duree: "13 mois", finalite: "Session Analytics" },
    ],
  },
  {
    categorie: "Cookies de préférences",
    requis: false,
    description: "Mémorisent vos préférences de navigation pour améliorer votre expérience.",
    cookies: [
      { nom: "cookie_consent", duree: "12 mois", finalite: "Mémorisation de votre choix de cookies" },
    ],
  },
];

export default function CookiesPage() {
  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh", paddingTop: 72 }}>
      <div style={{ borderBottom: "1px solid var(--color-border)" }}>
        <div className="wrap" style={{ paddingTop: 56, paddingBottom: 40 }}>
          <span
            style={{
              display: "block",
              fontFamily: "var(--font-body)",
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              marginBottom: 16,
            }}
          >
            Légal
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 7vw, 80px)",
              color: "var(--color-text)",
              letterSpacing: "0.03em",
              lineHeight: 0.9,
              marginBottom: 20,
            }}
          >
            POLITIQUE
            <br />
            DES COOKIES
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 13, color: "var(--color-muted)" }}>
            Dernière mise à jour : avril 2025
          </p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 64, paddingBottom: 96 }}>
        <div style={{ maxWidth: 760 }}>

          <div style={{ marginBottom: 48, paddingBottom: 48, borderBottom: "1px solid var(--color-border)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--color-text)", letterSpacing: "0.04em", marginBottom: 20 }}>
              QU&apos;EST-CE QU&apos;UN COOKIE ?
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 14, color: "var(--color-muted)", lineHeight: 1.78, marginBottom: 14, letterSpacing: "0.01em" }}>
              Un cookie est un petit fichier texte déposé sur votre appareil lors de la visite d&apos;un site web. Il permet au site de mémoriser des informations sur votre visite, comme votre langue préférée ou d&apos;autres paramètres.
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 14, color: "var(--color-muted)", lineHeight: 1.78, letterSpacing: "0.01em" }}>
              Sur motosuisse.com, nous utilisons des cookies nécessaires au bon fonctionnement du site ainsi que Google Analytics pour mesurer notre audience. Aucun cookie publicitaire ni de tracking commercial n&apos;est utilisé.
            </p>
          </div>

          {TYPES.map(({ categorie, requis, description, cookies }) => (
            <div key={categorie} style={{ marginBottom: 48, paddingBottom: 48, borderBottom: "1px solid var(--color-border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--color-text)", letterSpacing: "0.04em" }}>
                  {categorie.toUpperCase()}
                </h2>
                <span style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 9,
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: requis ? "var(--color-accent)" : "var(--color-muted)",
                  border: `1px solid ${requis ? "rgba(230,0,36,0.3)" : "var(--color-border)"}`,
                  borderRadius: 3,
                  padding: "3px 8px",
                  whiteSpace: "nowrap",
                }}>
                  {requis ? "Requis" : "Optionnel"}
                </span>
              </div>

              <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 14, color: "var(--color-muted)", lineHeight: 1.72, marginBottom: 24, letterSpacing: "0.01em" }}>
                {description}
              </p>

              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", padding: "10px 20px", borderBottom: "1px solid #1A1A1A" }}>
                  {["Nom", "Durée", "Finalité"].map((h) => (
                    <span key={h} style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#333" }}>{h}</span>
                  ))}
                </div>
                {cookies.map(({ nom, duree, finalite }, i) => (
                  <div key={nom} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", padding: "14px 20px", borderBottom: i < cookies.length - 1 ? "1px solid #161616" : "none", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--color-accent)", letterSpacing: "0.02em" }}>{nom}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--color-muted)" }}>{duree}</span>
                    <span style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 13, color: "var(--color-muted)" }}>{finalite}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ marginBottom: 48, paddingBottom: 48, borderBottom: "1px solid var(--color-border)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--color-text)", letterSpacing: "0.04em", marginBottom: 20 }}>
              GÉRER VOS PRÉFÉRENCES
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 14, color: "var(--color-muted)", lineHeight: 1.78, marginBottom: 14, letterSpacing: "0.01em" }}>
              Vous pouvez à tout moment modifier vos préférences de cookies via le bouton ci-dessous, ou en utilisant les paramètres de votre navigateur. Notez que la désactivation de certains cookies peut affecter le fonctionnement du site.
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 14, color: "var(--color-muted)", lineHeight: 1.78, letterSpacing: "0.01em" }}>
              La plupart des navigateurs proposent des options pour bloquer ou supprimer les cookies dans leurs paramètres de confidentialité (Chrome, Firefox, Safari, Edge).
            </p>
          </div>

          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => { clearConsent(); window.location.reload(); }}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--color-accent)",
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              Modifier mes préférences cookies →
            </button>
            <Link href="/confidentialite" style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-accent)", textDecoration: "none" }}>
              Politique de confidentialité →
            </Link>
            <Link href="/contact" style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-muted)", textDecoration: "none" }}>
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
