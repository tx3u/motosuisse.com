"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Upload, X, CheckCircle, AlertCircle, ImageIcon } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { api } from "@/lib/api";


const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#0A0A0A",
  border: "1px solid #1F1F1F",
  borderRadius: 4,
  padding: "12px 14px",
  fontFamily: "var(--font-body)",
  fontWeight: 300,
  fontSize: 14,
  color: "#F5F5F0",
  outline: "none",
  transition: "border-color 160ms ease",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-body)",
  fontWeight: 500,
  fontSize: 10,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "#6B6B6B",
  marginBottom: 8,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label style={labelStyle}>{label}</label>{children}</div>;
}

function StyledInput({ type = "text", placeholder, value, onChange, required, min }: {
  type?: string; placeholder?: string; value: string;
  onChange: (v: string) => void; required?: boolean; min?: string;
}) {
  return (
    <input
      type={type} placeholder={placeholder} value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required} min={min} style={inputStyle}
      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#1F1F1F")}
    />
  );
}

interface NewImage { file: File; url: string; }

export default function EditMotoPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: moto, isLoading } = useQuery({
    queryKey: ["moto-edit", slug],
    queryFn: () => api.motos.getAdmin(slug),
    enabled: !!slug,
  });

  const [marque, setMarque] = useState("");
  const [modele, setModele] = useState("");
  const [annee, setAnnee] = useState("");
  const [kilometrage, setKilometrage] = useState("");
  const [prix, setPrix] = useState("");
  const [description, setDescription] = useState("");
  const [cylindree, setCylindree] = useState("");
  const [puissance, setPuissance] = useState("");
  const [type, setType] = useState("");
  const [statut, setStatut] = useState<"disponible" | "vendu">("disponible");
  const [featured, setFeatured] = useState(false);
  const [newImages, setNewImages] = useState<NewImage[]>([]);
  const [dragging, setDragging] = useState(false);

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [progress, setProgress] = useState({ step: 0, total: 0, label: "" });

  // Pre-fill form once moto is loaded
  useEffect(() => {
    if (!moto) return;
    setMarque(moto.marque);
    setModele(moto.modele);
    setAnnee(String(moto.annee));
    setKilometrage(String(moto.kilometrage));
    setPrix(String(Number(moto.prix)));
    setDescription(moto.description ?? "");
    setCylindree(moto.cylindree ?? "");
    setPuissance(moto.puissance ?? "");
    setType(moto.type ?? "");
    setStatut(moto.statut);
    setFeatured(moto.featured);
  }, [moto]);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const next: NewImage[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) continue;
      next.push({ file, url: URL.createObjectURL(file) });
    }
    setNewImages((prev) => [...prev, ...next]);
  };

  const removeNew = (idx: number) => {
    setNewImages((prev) => {
      URL.revokeObjectURL(prev[idx].url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moto || status === "submitting") return;
    setStatus("submitting");
    setErrorMsg("");

    try {
      setProgress({ step: 0, total: newImages.length + 1, label: "Mise à jour…" });
      await api.motos.update(moto.id, {
        marque: marque.trim(),
        modele: modele.trim(),
        annee: Number.parseInt(annee, 10),
        kilometrage: Number.parseInt(kilometrage, 10),
        prix: Number.parseFloat(prix),
        description: description.trim() || undefined,
        cylindree: cylindree.trim() || undefined,
        puissance: puissance.trim() || undefined,
        type: type.trim() || undefined,
        statut,
        featured,
      });

      for (let i = 0; i < newImages.length; i++) {
        setProgress({ step: i + 1, total: newImages.length + 1, label: `Upload photo ${i + 1} / ${newImages.length}…` });
        await api.motos.addImage(moto.id, newImages[i].file);
      }

      setStatus("success");
      setTimeout(() => router.push("/admin/motos"), 1400);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Une erreur est survenue.");
    }
  };

  const submitting = status === "submitting";
  const progressPct = progress.total > 0 ? Math.round((progress.step / progress.total) * 100) : 0;

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#444" }}>Chargement…</span>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex" }}>
      <AdminSidebar />

      {/* Success overlay */}
      {status === "success" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,10,10,0.9)", zIndex: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <CheckCircle size={48} color="var(--color-accent)" strokeWidth={1.5} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "#F5F5F0", letterSpacing: "0.06em" }}>MODIFICATIONS SAUVEGARDÉES</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#6B6B6B" }}>Redirection en cours…</span>
        </div>
      )}

      {/* Main */}
      <main style={{ flex: 1, marginLeft: 240, padding: "40px 40px 80px" }} className="admin-main">
        <Link href="/admin/motos" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-body)", fontSize: 12, color: "#444", textDecoration: "none", marginBottom: 32, transition: "color 160ms ease" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#F5F5F0")} onMouseLeave={(e) => (e.currentTarget.style.color = "#444")}>
          <ArrowLeft size={13} strokeWidth={1.5} />Retour aux motos
        </Link>

        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3vw, 44px)", color: "#F5F5F0", letterSpacing: "0.04em", marginBottom: 40 }}>
          MODIFIER LA MOTO
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 32, alignItems: "start" }} className="dashboard-cols">
            {/* Form card */}
            <div className="card" style={{ padding: "32px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }} className="dashboard-cols">
                <Field label="Marque"><StyledInput placeholder="Yamaha" value={marque} onChange={setMarque} required /></Field>
                <Field label="Modèle"><StyledInput placeholder="MT-09 SP" value={modele} onChange={setModele} required /></Field>
                <Field label="Année"><StyledInput type="number" placeholder="2022" value={annee} onChange={setAnnee} required min="1900" /></Field>
                <Field label="Kilométrage"><StyledInput type="number" placeholder="8400" value={kilometrage} onChange={setKilometrage} required min="0" /></Field>
                <Field label="Prix (CHF)"><StyledInput type="number" placeholder="12500" value={prix} onChange={setPrix} required min="0" /></Field>
                <Field label="Cylindrée"><StyledInput placeholder="889 cc" value={cylindree} onChange={setCylindree} /></Field>
                <Field label="Puissance"><StyledInput placeholder="119 ch" value={puissance} onChange={setPuissance} /></Field>
                <Field label="Type"><StyledInput placeholder="Roadster" value={type} onChange={setType} /></Field>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label htmlFor="edit-description" style={labelStyle}>Description</label>
                <textarea id="edit-description" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description de la moto…" style={{ ...inputStyle, resize: "none" }} onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")} onBlur={(e) => (e.currentTarget.style.borderColor = "#1F1F1F")} />
              </div>

              {status === "error" && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(232,25,44,0.1)", border: "1px solid rgba(232,25,44,0.3)", borderRadius: 4, padding: "12px 16px", marginBottom: 20 }}>
                  <AlertCircle size={15} color="var(--color-accent)" strokeWidth={1.5} />
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#F5F5F0" }}>{errorMsg}</span>
                </div>
              )}

              {submitting && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#6B6B6B" }}>{progress.label}</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#6B6B6B" }}>{progressPct}%</span>
                  </div>
                  <div style={{ height: 2, background: "#1F1F1F", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${progressPct}%`, background: "var(--color-accent)", transition: "width 300ms ease" }} />
                  </div>
                </div>
              )}

              <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: "100%", opacity: submitting ? 0.6 : 1, cursor: submitting ? "not-allowed" : "pointer" }}>
                {submitting ? "Sauvegarde…" : "Sauvegarder les modifications"}
              </button>
            </div>

            {/* Right column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Existing photos */}
              {moto && moto.images.length > 0 && (
                <div className="card" style={{ padding: "24px" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "#F5F5F0", letterSpacing: "0.04em", display: "block", marginBottom: 12 }}>PHOTOS ACTUELLES</span>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    {moto.images.map((src, i) => (
                      <div key={i} style={{ aspectRatio: "1", borderRadius: 4, overflow: "hidden", border: "1px solid #2A2A2A" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add photos */}
              <div className="card" style={{ padding: "24px" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "#F5F5F0", letterSpacing: "0.04em", display: "block", marginBottom: 16 }}>AJOUTER DES PHOTOS</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  style={{ width: "100%", background: "none", border: `2px dashed ${dragging ? "rgba(232,25,44,0.6)" : "#1F1F1F"}`, borderRadius: 8, padding: "28px 20px", textAlign: "center", cursor: "pointer", transition: "border-color 160ms ease" }}
                  onMouseEnter={(e) => { if (!dragging) (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(232,25,44,0.4)"; }}
                  onMouseLeave={(e) => { if (!dragging) (e.currentTarget as HTMLButtonElement).style.borderColor = "#1F1F1F"; }}
                >
                  <Upload size={18} color="#444" strokeWidth={1.5} style={{ margin: "0 auto 10px", display: "block" }} />
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#444", fontWeight: 300 }}>Cliquer ou glisser</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#333", display: "block", marginTop: 4 }}>JPG, PNG — max 5 MB</span>
                </button>
                <input ref={fileInputRef} type="file" multiple accept="image/*" style={{ display: "none" }} onChange={(e) => addFiles(e.target.files)} />

                {newImages.length > 0 && (
                  <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    {newImages.map((img, idx) => (
                      <div key={img.url} style={{ position: "relative", aspectRatio: "1", borderRadius: 4, overflow: "hidden" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button type="button" onClick={() => removeNew(idx)} style={{ position: "absolute", top: 4, right: 4, background: "rgba(10,10,10,0.8)", border: "none", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 }}>
                          <X size={11} color="#F5F5F0" strokeWidth={2} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {newImages.length === 0 && (
                  <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
                    <ImageIcon size={12} color="#333" strokeWidth={1.5} />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#333" }}>Aucune nouvelle photo</span>
                  </div>
                )}
              </div>

              {/* Statut */}
              <div className="card" style={{ padding: "20px" }}>
                <label htmlFor="edit-statut" style={labelStyle}>Statut</label>
                <select id="edit-statut" value={statut} onChange={(e) => setStatut(e.target.value as "disponible" | "vendu")} style={{ ...inputStyle, cursor: "pointer", marginBottom: 16 }} onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")} onBlur={(e) => (e.currentTarget.style.borderColor = "#1F1F1F")}>
                  <option value="disponible">Disponible</option>
                  <option value="vendu">Vendu</option>
                </select>

                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    style={{ accentColor: "#FFB800", width: 16, height: 16, cursor: "pointer" }}
                  />
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#888" }}>
                    Afficher sur la page d&apos;accueil
                  </span>
                </label>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
