"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { KeyRound, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
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

function PasswordInput({ value, onChange, placeholder, id }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  id?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ ...inputStyle, paddingRight: 44 }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "#1F1F1F")}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        style={{
          position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
          background: "none", border: "none", cursor: "pointer", padding: 4,
          color: "#444", display: "flex", alignItems: "center",
          transition: "color 160ms ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#F5F5F0")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#444")}
      >
        {show ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [adminEmail, setAdminEmail] = useState("");

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Decode JWT to get email
    const token = api.admin.getAccessToken();
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setAdminEmail(payload.email ?? "");
    } catch {
      // ignore
    }
  }, []);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (newPwd.length < 8) {
      setStatus("error");
      setMessage("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (newPwd !== confirmPwd) {
      setStatus("error");
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    setStatus("loading");
    try {
      const res = await api.auth.changePassword(currentPwd, newPwd);
      setStatus("success");
      setMessage(res.message);
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    } catch (err: unknown) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Une erreur est survenue.");
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex" }}>
      <AdminSidebar />

      {/* Main */}
      <main style={{ flex: 1, marginLeft: 240, padding: "40px 40px 80px" }} className="admin-main">
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3vw, 44px)", color: "#F5F5F0", letterSpacing: "0.04em", marginBottom: 40 }}>
          PARAMÈTRES
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }} className="dashboard-cols">

          {/* Account info */}
          <div className="card" style={{ padding: "28px 32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(230,0,36,0.12)", border: "1px solid rgba(230,0,36,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--color-accent)" }}>A</span>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "#F5F5F0", letterSpacing: "0.04em" }}>Admin</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#6B6B6B", marginTop: 2 }}>{adminEmail || "—"}</div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #1F1F1F", paddingTop: 20 }}>
              <div style={{ marginBottom: 12 }}>
                <span style={labelStyle}>Email</span>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#F5F5F0", background: "#0A0A0A", border: "1px solid #1F1F1F", borderRadius: 4, padding: "12px 14px" }}>
                  {adminEmail || "—"}
                </div>
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#444", lineHeight: 1.6 }}>
                Pour changer l&apos;adresse email, modifie directement la base de données via le seed ou un client SQL.
              </div>
            </div>
          </div>

          {/* Change password */}
          <div className="card" style={{ padding: "28px 32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <KeyRound size={16} color="var(--color-accent)" strokeWidth={1.5} />
              <span style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "#F5F5F0", letterSpacing: "0.04em" }}>
                MOT DE PASSE
              </span>
            </div>

            <form onSubmit={handleChangePassword}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
                <div>
                  <label htmlFor="pwd-current" style={labelStyle}>Mot de passe actuel</label>
                  <PasswordInput id="pwd-current" value={currentPwd} onChange={setCurrentPwd} placeholder="••••••••" />
                </div>
                <div>
                  <label htmlFor="pwd-new" style={labelStyle}>Nouveau mot de passe</label>
                  <PasswordInput id="pwd-new" value={newPwd} onChange={setNewPwd} placeholder="Min. 8 caractères" />
                </div>
                <div>
                  <label htmlFor="pwd-confirm" style={labelStyle}>Confirmer le nouveau mot de passe</label>
                  <PasswordInput id="pwd-confirm" value={confirmPwd} onChange={setConfirmPwd} placeholder="••••••••" />
                </div>
              </div>

              {/* Feedback */}
              {status !== "idle" && message && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: status === "success" ? "rgba(0,200,80,0.08)" : "rgba(232,25,44,0.1)",
                  border: `1px solid ${status === "success" ? "rgba(0,200,80,0.25)" : "rgba(232,25,44,0.3)"}`,
                  borderRadius: 4, padding: "10px 14px", marginBottom: 16,
                }}>
                  {status === "success"
                    ? <CheckCircle size={14} color="#00C850" strokeWidth={1.5} />
                    : <AlertCircle size={14} color="var(--color-accent)" strokeWidth={1.5} />
                  }
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#F5F5F0" }}>
                    {message}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="btn btn-primary"
                style={{ width: "100%", opacity: status === "loading" ? 0.6 : 1, cursor: status === "loading" ? "not-allowed" : "pointer" }}
              >
                {status === "loading" ? "Mise à jour…" : "Changer le mot de passe"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
