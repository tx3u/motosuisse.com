import type { Metadata } from "next";
import MotoDetailClient from "./MotoDetailClient";

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// Escapes </script> sequences to prevent injection in JSON-LD blocks
function safeJsonLd(obj: object): string {
  return JSON.stringify(obj).replaceAll(/<\/script>/gi, "<\\/script>");
}

async function fetchMoto(slug: string) {
  try {
    const res = await fetch(`${API_URL}/api/motos/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const moto = await fetchMoto(slug);
  if (!moto) return { title: "Moto introuvable" };

  const title = `${moto.marque} ${moto.modele} ${moto.annee} à vendre`;
  const description = moto.description
    ?? `${moto.marque} ${moto.modele} ${moto.annee}, ${Number(moto.kilometrage).toLocaleString("fr-CH")} km — ${Number(moto.prix).toLocaleString("fr-CH")} CHF. Disponible chez MotoSuisse à Lausanne.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: moto.images?.[0]
        ? [{ url: moto.images[0], width: 1200, height: 630, alt: `${moto.marque} ${moto.modele}` }]
        : [],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function MotoDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const moto = await fetchMoto(slug);

  const jsonLd = moto ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${moto.marque} ${moto.modele} ${moto.annee}`,
    description: moto.description ?? undefined,
    image: moto.images?.[0] ?? undefined,
    offers: {
      "@type": "Offer",
      price: Number(moto.prix),
      priceCurrency: "CHF",
      availability: moto.statut === "disponible"
        ? "https://schema.org/InStock"
        : "https://schema.org/SoldOut",
      seller: { "@type": "Organization", name: "MotoSuisse" },
    },
    vehicleModelDate: String(moto.annee),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: moto.kilometrage,
      unitCode: "KMT",
    },
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
        />
      )}
      <MotoDetailClient slug={slug} />
    </>
  );
}
