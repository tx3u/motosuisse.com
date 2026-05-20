import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans, DM_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { Providers } from "@/lib/providers";
import { CookieConsent } from "@/components/CookieConsent";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://motosuisse.com";
const GA_ID = "G-EEQK5LP7HD";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MotoSuisse — Motos d'occasion à Lausanne",
    template: "%s — MotoSuisse",
  },
  description:
    "Concessionnaire indépendant de motos d'occasion à Lausanne. Achat, vente, pose de stickers et conseils depuis 2022.",
  openGraph: {
    siteName: "MotoSuisse",
    locale: "fr_CH",
    type: "website",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${bebasNeue.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <head>
        {/*
          Google Consent Mode v2 — MUST run before gtag.js loads.
          Default everything to "denied" so GA4 doesn't set cookies or send
          identifying data until the user explicitly accepts.
        */}
        <Script id="gtag-consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              wait_for_update: 500
            });
            // Read stored consent (if any) and apply immediately.
            try {
              var m = document.cookie.match(/(?:^|; )cookie_consent=([^;]+)/);
              if (m) {
                var v = decodeURIComponent(m[1]) === 'accepted' ? 'granted' : 'denied';
                gtag('consent', 'update', {
                  ad_storage: v,
                  ad_user_data: v,
                  ad_personalization: v,
                  analytics_storage: v
                });
              }
            } catch (e) {}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { anonymize_ip: true });
          `}
        </Script>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
      </head>
      <body
        className="min-h-screen flex flex-col antialiased"
        style={{
          background: "var(--color-bg)",
          color: "var(--color-text)",
          fontFamily: "var(--font-body)",
        }}
      >
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
        <CookieConsent />
      </body>
    </html>
  );
}
