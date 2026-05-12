import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

interface Article {
  id: number;
  titre: string;
  slug: string;
  contenu: string;
  image_couverture: string | null;
  meta_title: string | null;
  meta_description: string | null;
  createdAt: string;
  updatedAt: string;
}

async function fetchArticle(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`${API_URL}/api/articles/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<Article>;
  } catch {
    return null;
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-CH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min de lecture`;
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticle(slug);
  if (!article) return {};

  const title = article.meta_title ?? article.titre;
  const description =
    article.meta_description ??
    `Conseils et guides moto par MotoSuisse — ${article.titre}.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} — MotoSuisse`,
      description,
      type: "article",
      publishedTime: article.createdAt,
      modifiedTime: article.updatedAt,
      authors: ["MotoSuisse"],
      ...(article.image_couverture && {
        images: [{ url: article.image_couverture, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(article.image_couverture && { images: [article.image_couverture] }),
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await fetchArticle(slug);

  if (!article) notFound();

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh", paddingTop: 72 }}>

      {/* ── Cover image ─────────────────────────────────── */}
      {article.image_couverture && (
        <div
          style={{
            width: "100%",
            height: 400,
            background: `url(${article.image_couverture}) center/cover no-repeat`,
          }}
        />
      )}

      <div
        className="wrap"
        style={{
          paddingTop: article.image_couverture ? 48 : 64,
          paddingBottom: 96,
          maxWidth: 760,
        }}
      >
        {/* Back link */}
        <Link
          href="/tips"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "var(--font-body)",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            textDecoration: "none",
            marginBottom: 40,
          }}
        >
          <ArrowLeft size={13} strokeWidth={1.5} />
          Tips &amp; Tricks
        </Link>

        {/* Meta */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <CalendarDays size={12} color="var(--color-muted)" strokeWidth={1.5} />
            <span
              style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--color-muted)" }}
            >
              {formatDate(article.createdAt)}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Clock size={12} color="var(--color-muted)" strokeWidth={1.5} />
            <span
              style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--color-muted)" }}
            >
              {readingTime(article.contenu)}
            </span>
          </div>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 6vw, 72px)",
            color: "var(--color-text)",
            letterSpacing: "0.03em",
            lineHeight: 0.92,
            marginBottom: 48,
          }}
        >
          {article.titre.toUpperCase()}
        </h1>

        <div style={{ height: 1, background: "var(--color-border)", marginBottom: 48 }} />

        {/* Content */}
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 15,
            fontWeight: 300,
            lineHeight: 1.8,
            color: "var(--color-muted)",
            letterSpacing: "0.01em",
            whiteSpace: "pre-wrap",
          }}
        >
          {article.contenu}
        </div>
      </div>
    </div>
  );
}
