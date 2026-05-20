"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { accessToken } = await api.auth.login(form.email, form.password);
      api.admin.saveTokens(accessToken);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(230,0,36,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="h-anim h-anim-1" style={{ width: "100%", maxWidth: 400, position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              color: "var(--color-text)",
              letterSpacing: "0.08em",
              display: "block",
              marginBottom: 8,
            }}
          >
            MOTOSUISSE
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--color-muted)",
            }}
          >
            Administration
          </span>
        </div>

        {/* Card */}
        <div
          className="card"
          style={{ padding: "40px 36px" }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              color: "var(--color-text)",
              letterSpacing: "0.05em",
              marginBottom: 8,
            }}
          >
            CONNEXION
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              fontSize: 13,
              color: "var(--color-muted)",
              marginBottom: 32,
            }}
          >
            Accès réservé aux administrateurs.
          </p>

          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(230,0,36,0.08)",
                border: "1px solid rgba(230,0,36,0.25)",
                borderRadius: 6,
                padding: "12px 14px",
                marginBottom: 24,
              }}
            >
              <AlertCircle size={14} color="var(--color-accent)" strokeWidth={1.5} />
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "var(--color-accent)",
                  fontWeight: 400,
                }}
              >
                {error}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label
                htmlFor="login-email"
                style={{
                  display: "block",
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--color-muted)",
                  marginBottom: 8,
                }}
              >
                Email
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={14}
                  color="var(--color-muted)"
                  strokeWidth={1.5}
                  style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                />
                <input
                  id="login-email"
                  type="email"
                  required
                  placeholder="Utilisateur"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={{
                    width: "100%",
                    background: "var(--color-bg)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 4,
                    padding: "13px 14px 13px 40px",
                    fontFamily: "var(--font-body)",
                    fontWeight: 300,
                    fontSize: 14,
                    color: "var(--color-text)",
                    outline: "none",
                    transition: "border-color 160ms ease",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 32 }}>
              <label
                htmlFor="login-password"
                style={{
                  display: "block",
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--color-muted)",
                  marginBottom: 8,
                }}
              >
                Mot de passe
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={14}
                  color="var(--color-muted)"
                  strokeWidth={1.5}
                  style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                />
                <input
                  id="login-password"
                  type={showPwd ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  style={{
                    width: "100%",
                    background: "var(--color-bg)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 4,
                    padding: "13px 44px 13px 40px",
                    fontFamily: "var(--font-body)",
                    fontWeight: 300,
                    fontSize: 14,
                    color: "var(--color-text)",
                    outline: "none",
                    transition: "border-color 160ms ease",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 4,
                    color: "var(--color-muted)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showPwd
                    ? <EyeOff size={14} strokeWidth={1.5} />
                    : <Eye size={14} strokeWidth={1.5} />
                  }
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: "100%", opacity: loading ? 0.72 : 1 }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: 13,
                      height: 13,
                      border: "1.5px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.65s linear infinite",
                    }}
                  />
                  Connexion…
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>
        </div>

        {/* Back to site */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <a
            href="/"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--color-muted)",
              textDecoration: "none",
              transition: "color 160ms ease",
              letterSpacing: "0.04em",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-muted)")}
          >
            ← Retour au site
          </a>
        </div>
      </div>
    </div>
  );
}
