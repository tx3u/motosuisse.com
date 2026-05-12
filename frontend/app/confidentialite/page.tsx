import Link from "next/link";

const SECTIONS = [
  {
    titre: "1. Responsable du traitement",
    contenu: `Motosuisse, concessionnaire indépendant de motos d'occasion, est responsable du traitement de vos données personnelles collectées via le site motosuisse.com.

Contact : contactmotosuisse@gmail.com — +41 79 799 21 18 — Lausanne, Suisse.`,
  },
  {
    titre: "2. Données collectées",
    contenu: `Nous collectons uniquement les données nécessaires au bon fonctionnement de nos services :

— Données de contact (nom, email, téléphone) : uniquement lorsque vous remplissez notre formulaire de contact.
— Données de navigation : adresse IP, pages visitées, durée des visites, via des cookies analytiques (voir notre Politique des cookies).

Nous ne collectons aucune donnée de paiement directement. Aucun compte utilisateur n'est créé sur ce site.`,
  },
  {
    titre: "3. Finalités du traitement",
    contenu: `Vos données sont utilisées pour :

— Répondre à vos demandes de contact et de renseignements.
— Améliorer l'expérience utilisateur du site via des statistiques anonymisées.
— Respecter nos obligations légales le cas échéant.

Nous n'utilisons pas vos données à des fins de marketing direct sans votre consentement explicite.`,
  },
  {
    titre: "4. Base légale",
    contenu: `Le traitement de vos données repose sur :

— Votre consentement, pour les cookies non essentiels.
— L'exécution d'un contrat ou de mesures précontractuelles, pour les échanges commerciaux.
— Notre intérêt légitime, pour les statistiques anonymisées du site.`,
  },
  {
    titre: "5. Conservation des données",
    contenu: `Les données de contact (formulaire) sont conservées 3 ans à compter du dernier contact.
Les données de navigation anonymisées sont conservées 13 mois.
À l'issue de ces délais, vos données sont supprimées ou anonymisées.`,
  },
  {
    titre: "6. Partage des données",
    contenu: `Nous ne vendons ni ne louons vos données personnelles à des tiers.

Vos données peuvent être partagées uniquement avec :
— Nos prestataires techniques (hébergeur, service d'emailing) soumis à des obligations contractuelles de confidentialité.
— Les autorités compétentes, si la loi l'exige.`,
  },
  {
    titre: "7. Vos droits",
    contenu: `Conformément à la Loi fédérale suisse sur la protection des données (LPD) et au RGPD, vous disposez des droits suivants :

— Droit d'accès à vos données.
— Droit de rectification.
— Droit à l'effacement ("droit à l'oubli").
— Droit à la limitation du traitement.
— Droit à la portabilité.
— Droit d'opposition.

Pour exercer ces droits, contactez-nous à contactmotosuisse@gmail.com. Nous vous répondrons dans un délai de 30 jours.`,
  },
  {
    titre: "8. Sécurité",
    contenu: `Nous mettons en œuvre les mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou divulgation. Le site est servi en HTTPS. L'accès aux données est restreint aux seules personnes habilitées.`,
  },
  {
    titre: "9. Modifications",
    contenu: `Cette politique peut être mise à jour à tout moment. La date de dernière mise à jour est indiquée en bas de page. Nous vous encourageons à la consulter régulièrement.`,
  },
];

export default function ConfidentialitePage() {
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
            POLITIQUE DE
            <br />
            CONFIDENTIALITÉ
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 13, color: "var(--color-muted)" }}>
            Dernière mise à jour : avril 2025
          </p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 64, paddingBottom: 96 }}>
        <div style={{ maxWidth: 760 }}>
          {SECTIONS.map(({ titre, contenu }) => (
            <div
              key={titre}
              style={{
                marginBottom: 48,
                paddingBottom: 48,
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  color: "var(--color-text)",
                  letterSpacing: "0.04em",
                  marginBottom: 20,
                }}
              >
                {titre.toUpperCase()}
              </h2>
              {contenu.split("\n\n").map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 300,
                    fontSize: 14,
                    color: "var(--color-muted)",
                    lineHeight: 1.78,
                    marginBottom: 14,
                    letterSpacing: "0.01em",
                    whiteSpace: "pre-line",
                  }}
                >
                  {para}
                </p>
              ))}
            </div>
          ))}

          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <Link href="/cookies" style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-accent)", textDecoration: "none", transition: "opacity 160ms ease" }}>
              Politique des cookies →
            </Link>
            <Link href="/contact" style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-muted)", textDecoration: "none", transition: "color 160ms ease" }}>
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
