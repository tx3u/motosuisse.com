"use client";

import { Star, Eye, EyeOff, Trash2, Plus, X, CheckCircle } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api, CreateReviewPayload } from "@/lib/api";


const emptyForm: CreateReviewPayload = { nom: "", ville: "", moto: "", note: 5, texte: "" };

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#0A0A0A", border: "1px solid #1F1F1F",
  borderRadius: 4, padding: "11px 14px", fontFamily: "var(--font-body)",
  fontWeight: 300, fontSize: 14, color: "#F5F5F0", outline: "none",
  transition: "border-color 160ms ease",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontFamily: "var(--font-body)", fontWeight: 500,
  fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
  color: "#6B6B6B", marginBottom: 8,
};

export default function AdminReviewsPage() {
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateReviewPayload>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: () => api.reviews.listAll(),
  });

  const visibleCount = reviews.filter((r) => r.visible).length;

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.reviews.create({ ...form, ville: form.ville || undefined, moto: form.moto || undefined });
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      setForm(emptyForm);
      setSaved(true);
      setTimeout(() => { setSaved(false); setShowForm(false); }, 1500);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(id: number) {
    setTogglingId(id);
    try {
      await api.reviews.toggleVisibility(id);
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Supprimer cet avis définitivement ?")) return;
    setDeletingId(id);
    try {
      await api.reviews.delete(id);
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex" }}>
      <AdminSidebar />

      {/* Main */}
      <main style={{ flex: 1, marginLeft: 240, padding: "40px 40px 80px" }} className="admin-main">

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3vw, 44px)", color: "#F5F5F0", letterSpacing: "0.04em", lineHeight: 1, marginBottom: 6 }}>AVIS CLIENTS</h1>
            {!isLoading && (
              <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#444", fontWeight: 300 }}>
                {visibleCount} affiché{visibleCount !== 1 ? "s" : ""} sur la page d&apos;accueil · {reviews.length} au total
              </span>
            )}
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
            style={{ gap: 8, fontSize: 11 }}
          >
            {showForm ? <X size={13} strokeWidth={2} /> : <Plus size={13} strokeWidth={2} />}
            {showForm ? "Annuler" : "Nouvel avis"}
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <div className="card" style={{ padding: "28px 32px", marginBottom: 28 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "#F5F5F0", letterSpacing: "0.06em", display: "block", marginBottom: 24 }}>AJOUTER UN AVIS</span>
            <form onSubmit={handleCreate}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }} className="dashboard-cols">
                <div>
                  <label htmlFor="review-nom" style={labelStyle}>Prénom *</label>
                  <input id="review-nom" required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    placeholder="Jean" style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#1F1F1F")} />
                </div>
                <div>
                  <label htmlFor="review-ville" style={labelStyle}>Ville</label>
                  <input id="review-ville" value={form.ville} onChange={(e) => setForm({ ...form, ville: e.target.value })}
                    placeholder="Lausanne" style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#1F1F1F")} />
                </div>
                <div>
                  <label htmlFor="review-moto" style={labelStyle}>Moto achetée</label>
                  <input id="review-moto" value={form.moto} onChange={(e) => setForm({ ...form, moto: e.target.value })}
                    placeholder="Yamaha MT-09" style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#1F1F1F")} />
                </div>
              </div>

              <fieldset style={{ border: "none", padding: 0, margin: "0 0 16px 0" }}>
                <legend style={labelStyle}>Note *</legend>
                <div style={{ display: "flex", gap: 6 }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => setForm({ ...form, note: s })}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                      <Star size={22} fill={s <= form.note ? "var(--color-accent)" : "none"} color={s <= form.note ? "var(--color-accent)" : "#333"} strokeWidth={1.5} />
                    </button>
                  ))}
                </div>
              </fieldset>

              <div style={{ marginBottom: 20 }}>
                <label htmlFor="review-texte" style={labelStyle}>Avis *</label>
                <textarea id="review-texte" required rows={4} value={form.texte} onChange={(e) => setForm({ ...form, texte: e.target.value })}
                  placeholder="Partagez l'expérience du client…"
                  style={{ ...inputStyle, resize: "none" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#1F1F1F")} />
              </div>

              {saved && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(0,200,80,0.08)", border: "1px solid rgba(0,200,80,0.25)", borderRadius: 4, padding: "10px 14px", marginBottom: 16 }}>
                  <CheckCircle size={14} color="#00C850" strokeWidth={1.5} />
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#F5F5F0" }}>Avis ajouté avec succès.</span>
                </div>
              )}

              <button type="submit" disabled={saving} className="btn btn-primary"
                style={{ fontSize: 11, opacity: saving ? 0.6 : 1, cursor: saving ? "not-allowed" : "pointer" }}>
                {saving ? "Enregistrement…" : "Ajouter l'avis"}
              </button>
            </form>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="card" style={{ height: 88, opacity: 0.4, animation: "pulse 1.5s ease-in-out infinite" }} />
            ))}
          </div>
        )}

        {/* Reviews list */}
        {!isLoading && reviews.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {reviews.map((review) => (
              <div key={review.id} className="card"
                style={{ padding: "18px 24px", display: "flex", alignItems: "flex-start", gap: 16, opacity: deletingId === review.id ? 0.4 : 1, transition: "opacity 200ms ease", borderLeft: review.visible ? "2px solid rgba(0,200,80,0.4)" : "2px solid transparent" }}>

                {/* Stars */}
                <div style={{ display: "flex", gap: 2, flexShrink: 0, paddingTop: 2 }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={11} fill={s <= review.note ? "var(--color-accent)" : "none"} color={s <= review.note ? "var(--color-accent)" : "#333"} strokeWidth={1.5} />
                  ))}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#F5F5F0", fontWeight: 500 }}>{review.nom}</span>
                    {review.ville && <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#444", fontWeight: 300 }}>· {review.ville}</span>}
                    {review.moto && (
                      <span style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-accent)", border: "1px solid rgba(230,0,36,0.25)", borderRadius: 3, padding: "2px 6px" }}>
                        {review.moto}
                      </span>
                    )}
                    {!review.visible && (
                      <span style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#444", border: "1px solid #2A2A2A", borderRadius: 3, padding: "2px 6px" }}>
                        Masqué
                      </span>
                    )}
                  </div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#6B6B6B", fontWeight: 300, lineHeight: 1.6, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {review.texte}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={() => handleToggle(review.id)}
                    disabled={togglingId === review.id}
                    className="adm-btn-ghost"
                    title={review.visible ? "Masquer de l'accueil" : "Afficher sur l'accueil"}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, background: "none", border: "1px solid #2A2A2A", borderRadius: 4, cursor: "pointer", color: review.visible ? "#00C850" : "#444", transition: "all 150ms ease" }}
                  >
                    {review.visible ? <Eye size={13} strokeWidth={1.5} /> : <EyeOff size={13} strokeWidth={1.5} />}
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    disabled={deletingId === review.id}
                    className="adm-btn-danger"
                    title="Supprimer"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, background: "none", border: "1px solid #2A2A2A", borderRadius: 4, cursor: "pointer", color: "#444", transition: "all 150ms ease" }}
                  >
                    <Trash2 size={13} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && reviews.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 0", gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.03)", border: "1px solid #1F1F1F", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Star size={22} color="#444" strokeWidth={1.5} />
            </div>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#444", fontWeight: 300 }}>Aucun avis pour le moment</span>
          </div>
        )}
      </main>
    </div>
  );
}
