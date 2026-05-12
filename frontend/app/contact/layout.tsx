import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez MotoSuisse à Lausanne — questions sur une moto, prise de rendez-vous ou demande de renseignements.",
  openGraph: {
    title: "Contactez MotoSuisse — Lausanne",
    description: "Questions, rendez-vous ou renseignements — écrivez-nous ou appelez-nous.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
