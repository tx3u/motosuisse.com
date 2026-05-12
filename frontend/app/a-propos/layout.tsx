import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Concessionnaire indépendant de motos d'occasion à Lausanne depuis 2022. Découvrez l'histoire et les valeurs de MotoSuisse.",
  openGraph: {
    title: "À propos de MotoSuisse — Lausanne",
    description: "Concessionnaire indépendant de motos d'occasion à Lausanne depuis 2022.",
  },
};

export default function AProposLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
