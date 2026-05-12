"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { inputStyle, labelStyle } from "@/components/admin/FormStyles";
import { api } from "@/lib/api";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label style={labelStyle}>{label}</label>{children}</div>;
}

export default function NewArticlePage() {
  const router = useRouter();

  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [statut, setStatut] = useState<"brouillon" | "publie">("brouillon");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setErrorMsg("");
    try {
      await api.articles.create({
        titre: titre.trim(),
        contenu: contenu.trim(),
        statut,
        meta_title: metaTitle.trim() || undefined,
        meta_description: metaDesc.trim() || undefined,
      });
      setStatus("success");
      setTimeout(() => router.push("/admin/blog"), 1200);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Une erreur est survenue.");
    }
  };

  const submitting = status === "submitting";

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex" }}>
      <AdminSidebar />

      {status === "success" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,10,10,0.9)", zIndex: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <CheckCircle size={48} color="var(--color-accent)" strokeWidth={1.5} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "#F5F5F0", letterSpacing: "0.06em" }}>ARTICLE CRÉÉ</span>
        </div>
      )}

      <main style={{ flex: 1, marginLeft: 240, padding: "40px 40px 80px", maxWidth: 860 }} className="admin-main">
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <Link href="/admin/blog" style={{ color: "#444", display: "flex" }}>
            <ArrowLeft size={18} strokeWidth={1.5} />
          </Link>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3vw, 36px)", color: "#F5F5F0", letterSpacing: "0.04em" }}>
            NOUVEL ARTICLE
          </h1>
        </div>

        {status === "error" && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(230,0,36,0.08)", border: "1px solid rgba(230,0,36,0.25)", borderRadius: 6, padding: "12px 16px", marginBottom: 24 }}>
            <AlertCircle size={14} color="var(--color-accent)" strokeWidth={1.5} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-accent)" }}>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>
            <Field label="Titre *">
              <input
                required value={titre} onChange={(e) => setTitre(e.target.value)}
                placeholder="Titre de l'article"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#1F1F1F")}
              />
            </Field>

            <Field label="Contenu *">
              <textarea
                required value={contenu} onChange={(e) => setContenu(e.target.value)}
                placeholder="Contenu de l'article…"
                rows={16}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#1F1F1F")}
              />
            </Field>

            <Field label="Statut">
              <select
                value={statut}
                onChange={(e) => setStatut(e.target.value as "brouillon" | "publie")}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option value="brouillon">Brouillon</option>
                <option value="publie">Publié</option>
              </select>
            </Field>
          </div>

          <div className="card" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "#F5F5F0", letterSpacing: "0.06em" }}>SEO</span>
            <Field label="Meta title">
              <input
                value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Titre pour les moteurs de recherche (optionnel)"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#1F1F1F")}
              />
            </Field>
            <Field label="Meta description">
              <textarea
                value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)}
                placeholder="Description pour les moteurs de recherche (optionnel)"
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#1F1F1F")}
              />
            </Field>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? "Enregistrement…" : "Créer l'article"}
            </button>
            <Link href="/admin/blog" className="btn" style={{ background: "#1A1A1A", color: "#888", textDecoration: "none" }}>
              Annuler
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
