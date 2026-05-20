import type { MetadataRoute } from "next";

// Always render on demand — never at build time, where the API isn't reachable.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://motosuisse.com";
const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/** Returns the parsed date if valid, otherwise returns `now` as a safe fallback. */
function safeDate(input: unknown): Date {
  if (typeof input === "string" || typeof input === "number" || input instanceof Date) {
    const d = new Date(input);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
}

async function fetchAllMotos(): Promise<{ slug: string; updatedAt: string }[]> {
  try {
    const res = await fetch(`${API_URL}/api/motos?limit=500`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = (await res.json()) as { data?: { slug: string; updatedAt: string }[] };
    return json.data ?? [];
  } catch {
    return [];
  }
}

async function fetchAllArticles(): Promise<{ slug: string; updatedAt: string }[]> {
  try {
    const res = await fetch(`${API_URL}/api/articles`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as { slug: string; updatedAt: string }[];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [motos, articles] = await Promise.all([fetchAllMotos(), fetchAllArticles()]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL,                        lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE_URL}/motos`,             lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${SITE_URL}/tips`,              lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_URL}/services`,          lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`,           lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/a-propos`,          lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/confidentialite`,   lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${SITE_URL}/cookies`,           lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
  ];

  const motoRoutes: MetadataRoute.Sitemap = motos
    .filter((m) => typeof m?.slug === "string")
    .map((m) => ({
      url: `${SITE_URL}/motos/${m.slug}`,
      lastModified: safeDate(m.updatedAt),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const articleRoutes: MetadataRoute.Sitemap = articles
    .filter((a) => typeof a?.slug === "string")
    .map((a) => ({
      url: `${SITE_URL}/tips/${a.slug}`,
      lastModified: safeDate(a.updatedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [...staticRoutes, ...motoRoutes, ...articleRoutes];
}
