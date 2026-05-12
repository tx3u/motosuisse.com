import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tips & Tricks",
  description:
    "Conseils d'entretien, guides d'achat et astuces moto par MotoSuisse — le blog du concessionnaire indépendant de Lausanne.",
  openGraph: {
    title: "Tips & Tricks — Conseils moto par MotoSuisse",
    description:
      "Conseils d'entretien, guides d'achat et astuces moto par MotoSuisse à Lausanne.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tips & Tricks — Conseils moto par MotoSuisse",
    description: "Conseils d'entretien, guides d'achat et astuces moto par MotoSuisse à Lausanne.",
  },
};

export default function TipsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
