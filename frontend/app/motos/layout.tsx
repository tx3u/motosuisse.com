import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalogue de motos d'occasion",
  description:
    "Parcourez notre sélection de motos d'occasion à Lausanne. Sportives, trails, roadsters — tous les modèles disponibles avec prix et kilométrage.",
  openGraph: {
    title: "Catalogue de motos d'occasion — MotoSuisse",
    description: "Sélection de motos d'occasion à Lausanne. Sportives, trails, roadsters.",
  },
};

export default function MotosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
