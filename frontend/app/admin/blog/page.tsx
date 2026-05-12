"use client";

import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api";
import { AdminSidebar } from "@/components/AdminSidebar";

export default function AdminBlogPage() {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["admin-articles"],
    queryFn: () => api.articles.list(),
  });

  async function handleDelete(id: number, titre: string) {
    if (!window.confirm(`Supprimer "${titre}" ? Cette action est irréversible.`)) return;
    setDeletingId(id);
    try {
      await api.articles.delete(id);
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex" }}>
      <AdminSidebar />

      <main style={{ flex: 1, marginLeft: 240, padding: "40px 40px 80px" }} className="admin-main">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3vw, 44px)", color: "#F5F5F0", letterSpacing: "0.04em", lineHeight: 1 }}>
            BLOG
          </h1>
          <Link href="/admin/blog/nouveau" className="btn btn-primary">
            <Plus size={13} strokeWidth={2} />Nouvel article
          </Link>
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {/* Header row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 16, padding: "10px 24px", borderBottom: "1px solid #1A1A1A" }}>
            {["Titre", "Statut", "Date", "Actions"].map((h) => (
              <span key={h} style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#333" }}>{h}</span>
            ))}
          </div>

          {isLoading && (
            <div style={{ padding: "32px 24px", textAlign: "center" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#444" }}>Chargement…</span>
            </div>
          )}

          {!isLoading && articles.length === 0 && (
            <div style={{ padding: "32px 24px", textAlign: "center" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#444" }}>
                Aucun article.{" "}
                <Link href="/admin/blog/nouveau" style={{ color: "var(--color-accent)" }}>Créer le premier ?</Link>
              </span>
            </div>
          )}

          {articles.map(({ id, titre, statut, createdAt }, i) => {
            const isDeleting = deletingId === id;
            const published = statut === "publie";
            const date = new Date(createdAt).toLocaleDateString("fr-CH", { day: "numeric", month: "short", year: "numeric" });

            return (
              <div
                key={id}
                className="adm-row"
                style={{
                  display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 16,
                  padding: "14px 24px",
                  borderBottom: i < articles.length - 1 ? "1px solid #161616" : "none",
                  alignItems: "center",
                  opacity: isDeleting ? 0.4 : 1,
                }}
              >
                <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#F5F5F0", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {titre}
                </span>

                <span style={{
                  fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 500,
                  letterSpacing: "0.14em", textTransform: "uppercase",
                  color: published ? "var(--color-accent)" : "#444",
                  border: `1px solid ${published ? "rgba(230,0,36,0.3)" : "#2A2A2A"}`,
                  borderRadius: 3, padding: "3px 8px", whiteSpace: "nowrap",
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  {published ? <Eye size={9} strokeWidth={1.5} /> : <EyeOff size={9} strokeWidth={1.5} />}
                  {published ? "Publié" : "Brouillon"}
                </span>

                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#6B6B6B", whiteSpace: "nowrap" }}>
                  {date}
                </span>

                <div style={{ display: "flex", gap: 8 }}>
                  <Link
                    href={`/admin/blog/${id}/edit`}
                    className="adm-btn-ghost"
                    style={{ background: "none", border: "1px solid #2A2A2A", borderRadius: 4, padding: "6px 8px", cursor: "pointer", color: "#6B6B6B", display: "flex", textDecoration: "none" }}
                  >
                    <Pencil size={12} strokeWidth={1.5} />
                  </Link>
                  <button
                    onClick={() => handleDelete(id, titre)}
                    disabled={isDeleting}
                    className="adm-btn-danger"
                    style={{ background: "none", border: "1px solid #2A2A2A", borderRadius: 4, padding: "6px 8px", cursor: isDeleting ? "not-allowed" : "pointer", color: "#6B6B6B", display: "flex" }}
                  >
                    <Trash2 size={12} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
