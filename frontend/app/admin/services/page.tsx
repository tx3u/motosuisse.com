"use client";

import { Eye, EyeOff, Trash2, Plus, Wrench, X, CheckCircle } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api, CreateServicePayload } from "@/lib/api";


const emptyForm: CreateServicePayload = { titre: "", description: "", prix_indicatif: undefined, ordre: 0 };

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

export default function AdminServicesPage() {
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateServicePayload>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: () => api.services.list(),
  });

  const activeCount = services.filter((s) => s.actif).length;

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.services.create(form);
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      setForm(emptyForm);
      setSaved(true);
      setTimeout(() => { setSaved(false); setShowForm(false); }, 1500);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(id: number, actif: boolean) {
    setTogglingId(id);
    try {
      await api.services.update(id, { actif: !actif });
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Supprimer ce service définitivement ?")) return;
    setDeletingId(id);
    try {
      await api.services.delete(id);
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex" }}>
      <AdminSidebar />

      <main style={{ flex: 1, marginLeft: 240, padding: "40px 40px 80px" }} className="admin-main">

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3vw, 44px)", color: "#F5F5F0", letterSpacing: "0.04em", lineHeight: 1, marginBottom: 6 }}>SERVICES</h1>
            {!isLoading && (
              <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#444", fontWeight: 300 }}>
                {activeCount} actif{activeCount !== 1 ? "s" : ""} · {services.length} au total
              </span>
            )}
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
            style={{ gap: 8, fontSize: 11 }}
          >
            {showForm ? <X size={13} strokeWidth={2} /> : <Plus size={13} strokeWidth={2} />}
            {showForm ? "Annuler" : "Nouveau service"}
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <div className="card" style={{ padding: "28px 32px", marginBottom: 28 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "#F5F5F0", letterSpacing: "0.06em", display: "block", marginBottom: 24 }}>AJOUTER UN SERVICE</span>
            <form onSubmit={handleCreate}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="dashboard-cols">
                <div>
                  <label htmlFor="svc-titre" style={labelStyle}>Titre *</label>
                  <input id="svc-titre" required value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })}
                    placeholder="Pose de stickers" style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#1F1F1F")} />
                </div>
                <div>
                  <label htmlFor="svc-prix" style={labelStyle}>Prix indicatif (CHF)</label>
                  <input
                    id="svc-prix"
                    type="number" min={0} step={1}
                    value={form.prix_indicatif ?? ""}
                    onChange={(e) => setForm({ ...form, prix_indicatif: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="50" style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#1F1F1F")} />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label htmlFor="svc-description" style={labelStyle}>Description *</label>
                <textarea id="svc-description" required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Décrivez le service proposé…"
                  style={{ ...inputStyle, resize: "none" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#1F1F1F")} />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label htmlFor="svc-ordre" style={labelStyle}>Ordre d&apos;affichage</label>
                <input
                  id="svc-ordre"
                  type="number" min={0} step={1}
                  value={form.ordre ?? 0}
                  onChange={(e) => setForm({ ...form, ordre: Number(e.target.value) })}
                  placeholder="0" style={{ ...inputStyle, width: 120 }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#1F1F1F")} />
              </div>

              {saved && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(0,200,80,0.08)", border: "1px solid rgba(0,200,80,0.25)", borderRadius: 4, padding: "10px 14px", marginBottom: 16 }}>
                  <CheckCircle size={14} color="#00C850" strokeWidth={1.5} />
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#F5F5F0" }}>Service ajouté avec succès.</span>
                </div>
              )}

              <button type="submit" disabled={saving} className="btn btn-primary"
                style={{ fontSize: 11, opacity: saving ? 0.6 : 1, cursor: saving ? "not-allowed" : "pointer" }}>
                {saving ? "Enregistrement…" : "Ajouter le service"}
              </button>
            </form>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="card" style={{ height: 80, opacity: 0.4, animation: "pulse 1.5s ease-in-out infinite" }} />
            ))}
          </div>
        )}

        {/* Services list */}
        {!isLoading && services.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {services.map((service) => (
              <div key={service.id} className="card"
                style={{ padding: "18px 24px", display: "flex", alignItems: "flex-start", gap: 16, opacity: deletingId === service.id ? 0.4 : 1, transition: "opacity 200ms ease", borderLeft: service.actif ? "2px solid rgba(0,200,80,0.4)" : "2px solid transparent" }}>

                {/* Order badge */}
                <div style={{ flexShrink: 0, paddingTop: 2 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#444", letterSpacing: "0.08em" }}>
                    {String(service.ordre).padStart(2, "0")}
                  </span>
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#F5F5F0", fontWeight: 500 }}>{service.titre}</span>
                    {service.prix_indicatif && (
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-accent)", letterSpacing: "0.06em" }}>
                        {Number(service.prix_indicatif).toLocaleString("fr-CH")} CHF
                      </span>
                    )}
                    {!service.actif && (
                      <span style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#444", border: "1px solid #2A2A2A", borderRadius: 3, padding: "2px 6px" }}>
                        Masqué
                      </span>
                    )}
                  </div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#6B6B6B", fontWeight: 300, lineHeight: 1.6, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {service.description}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={() => handleToggle(service.id, service.actif)}
                    disabled={togglingId === service.id}
                    className="adm-btn-ghost"
                    title={service.actif ? "Masquer de la page services" : "Afficher sur la page services"}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, background: "none", border: "1px solid #2A2A2A", borderRadius: 4, cursor: "pointer", color: service.actif ? "#00C850" : "#444", transition: "all 150ms ease" }}
                  >
                    {service.actif ? <Eye size={13} strokeWidth={1.5} /> : <EyeOff size={13} strokeWidth={1.5} />}
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    disabled={deletingId === service.id}
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

        {!isLoading && services.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 0", gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.03)", border: "1px solid #1F1F1F", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Wrench size={22} color="#444" strokeWidth={1.5} />
            </div>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#444", fontWeight: 300 }}>Aucun service pour le moment</span>
          </div>
        )}
      </main>
    </div>
  );
}
