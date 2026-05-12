import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos services",
  description:
    "Pose de stickers, vente en consignation, conseils moto — découvrez tous les services proposés par MotoSuisse à Lausanne.",
  openGraph: {
    title: "Nos services — MotoSuisse Lausanne",
    description: "Pose de stickers, vente en consignation, conseils moto à Lausanne.",
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
