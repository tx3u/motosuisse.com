"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Star, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { AdminSidebar } from "@/components/AdminSidebar";

export default function AdminMotosPage() {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-motos-list"],
    queryFn: () => api.motos.list({ limit: 100 }),
  });

  const motos = data?.data ?? [];

  async function handleDelete(id: number, name: string) {
    if (!window.confirm(`Supprimer "${name}" ? Cette action est irréversible.`)) return;
    setDeletingId(id);
    setError("");
    try {
      await api.motos.delete(id);
      await queryClient.invalidateQueries({ queryKey: ["admin-motos-list"] });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur lors de la suppression.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggleFeatured(id: number, current: boolean) {
    setTogglingId(id);
    setError("");
    try {
      await api.motos.update(id, { featured: !current });
      await queryClient.invalidateQueries({ queryKey: ["admin-motos-list"] });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur lors de la mise à jour.");
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex" }}>
      <AdminSidebar />

      {/* Main */}
      <main style={{ flex: 1, marginLeft: 240, padding: "40px 40px 80px" }} className="admin-main">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 16 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3vw, 44px)", color: "#F5F5F0", letterSpacing: "0.04em", lineHeight: 1 }}>
            GESTION MOTOS
          </h1>
          <Link href="/admin/motos/nouvelle" className="btn btn-primary">
            <Plus size={13} strokeWidth={2} />Ajouter une moto
          </Link>
        </div>

        {/* Featured hint */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, padding: "10px 14px", background: "rgba(255,200,0,0.06)", border: "1px solid rgba(255,200,0,0.15)", borderRadius: 6 }}>
          <Star size={13} color="#FFB800" strokeWidth={1.5} fill="#FFB800" />
          <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#888" }}>
            Les motos <span style={{ color: "#FFB800" }}>étoilées</span> apparaissent sur la page d&apos;accueil. Max 3 recommandé.
          </span>
        </div>

        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(232,25,44,0.1)", border: "1px solid rgba(232,25,44,0.3)", borderRadius: 4, padding: "10px 14px", marginBottom: 20 }}>
            <AlertCircle size={14} color="var(--color-accent)" strokeWidth={1.5} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#F5F5F0" }}>{error}</span>
          </div>
        )}

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {/* Header row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto auto", gap: 16, padding: "10px 24px", borderBottom: "1px solid #1A1A1A" }}>
            {["Moto", "Année", "Prix", "Accueil", "Actions"].map((h) => (
              <span key={h} style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#333" }}>{h}</span>
            ))}
          </div>

          {isLoading && (
            <div style={{ padding: "32px 24px", textAlign: "center" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#444" }}>Chargement…</span>
            </div>
          )}

          {!isLoading && motos.length === 0 && (
            <div style={{ padding: "32px 24px", textAlign: "center" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#444" }}>
                Aucune moto.{" "}
                <Link href="/admin/motos/nouvelle" style={{ color: "var(--color-accent)" }}>Ajouter la première ?</Link>
              </span>
            </div>
          )}

          {motos.map(({ id, slug, marque, modele, annee, prix, statut, featured }, i) => {
            const isDeleting = deletingId === id;
            const isToggling = togglingId === id;
            const name = `${marque} ${modele}`;

            return (
              <div
                key={slug}
                className="adm-row"
                style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto auto", gap: 16, padding: "14px 24px", borderBottom: i < motos.length - 1 ? "1px solid #161616" : "none", alignItems: "center", opacity: isDeleting ? 0.4 : 1 }}
              >
                {/* Name + status */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#F5F5F0", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</span>
                  <span style={{ flexShrink: 0, fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: statut === "vendu" ? "#444" : "var(--color-accent)", border: `1px solid ${statut === "vendu" ? "#2A2A2A" : "rgba(230,0,36,0.3)"}`, borderRadius: 3, padding: "2px 6px" }}>
                    {statut === "vendu" ? "Vendu" : "Dispo"}
                  </span>
                </div>

                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#6B6B6B" }}>{annee}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#F5F5F0", whiteSpace: "nowrap" }}>{Number(prix).toLocaleString("fr-CH")} CHF</span>

                {/* Featured toggle */}
                <button
                  onClick={() => handleToggleFeatured(id, featured)}
                  disabled={isToggling}
                  title={featured ? "Retirer de l'accueil" : "Mettre en avant sur l'accueil"}
                  className={`adm-btn-star${featured ? " active" : ""}`}
                  style={{ background: "none", border: `1px solid ${featured ? "rgba(255,184,0,0.5)" : "#2A2A2A"}`, borderRadius: 4, padding: "6px 8px", cursor: isToggling ? "not-allowed" : "pointer", color: featured ? "#FFB800" : "#444", display: "flex", opacity: isToggling ? 0.5 : 1 }}
                >
                  <Star size={12} strokeWidth={1.5} fill={featured ? "#FFB800" : "none"} />
                </button>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8 }}>
                  <Link
                    href={`/admin/motos/${slug}/edit`}
                    className="adm-btn-ghost"
                  style={{ background: "none", border: "1px solid #2A2A2A", borderRadius: 4, padding: "6px 8px", cursor: "pointer", color: "#6B6B6B", display: "flex", textDecoration: "none" }}
                  >
                    <Pencil size={12} strokeWidth={1.5} />
                  </Link>
                  <button
                    onClick={() => handleDelete(id, name)}
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
