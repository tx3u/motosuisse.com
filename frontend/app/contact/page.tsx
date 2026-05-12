"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, CheckCircle, Send } from "lucide-react";
import { api } from "@/lib/api";

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--color-bg)",
  border: "1px solid var(--color-border)",
  borderRadius: 4,
  padding: "13px 15px",
  fontFamily: "var(--font-body)",
  fontWeight: 300,
  fontSize: 14,
  color: "var(--color-text)",
  outline: "none",
  transition: "border-color 160ms ease",
};

const fieldLabel: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-body)",
  fontWeight: 500,
  fontSize: 10,
  letterSpacing: "0.2em",
  color: "var(--color-muted)",
  textTransform: "uppercase",
  marginBottom: 8,
};

export default function ContactPage() {
  const [form, setForm] = useState({ nom: "", email: "", telephone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.contact.send({
        nom: form.nom,
        email: form.email,
        telephone: form.telephone || undefined,
        message: form.message,
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh", paddingTop: 72 }}>
      <div style={{ borderBottom: "1px solid var(--color-border)" }}>
        <div className="wrap" style={{ paddingTop: 56, paddingBottom: 40 }}>
          <span className="label" style={{ marginBottom: 12 }}>Contact</span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(52px, 9vw, 100px)",
              color: "var(--color-text)",
              letterSpacing: "0.03em",
              lineHeight: 0.9,
            }}
          >
            PARLONS-EN
          </h1>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 64, paddingBottom: 96 }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr]" style={{ gap: 72, alignItems: "start" }}>
          {/* Info */}
          <div>
            {[
              { Icon: MapPin, label: "Localisation", value: "Lausanne, Suisse", href: undefined },
              { Icon: Phone, label: "Téléphone", value: "+41 79 799 21 18", href: "tel:+41797992118" },
              { Icon: Mail, label: "Email", value: "contactmotosuisse@gmail.com", href: "mailto:contactmotosuisse@gmail.com" },
            ].map(({ Icon, label, value, href }) => (
              <div key={label} style={{ display: "flex", gap: 14, marginBottom: 28, alignItems: "flex-start" }}>
                <Icon size={14} color="var(--color-accent)" strokeWidth={1.5} style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={fieldLabel}>{label}</div>
                  {href ? (
                    <a href={href} style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 14, color: "var(--color-muted)", textDecoration: "none", transition: "color 160ms ease" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-muted)")}
                    >{value}</a>
                  ) : (
                    <span style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 14, color: "var(--color-muted)" }}>{value}</span>
                  )}
                </div>
              </div>
            ))}

            <div style={{ height: 1, background: "var(--color-border)", margin: "36px 0" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <Clock size={13} color="var(--color-accent)" strokeWidth={1.5} />
              <span style={fieldLabel}>Heures de contact</span>
            </div>
            <div className="card" style={{ overflow: "hidden" }}>
              {[
                { day: "Lundi – Vendredi", time: "08:00 – 18:00" },
                { day: "Samedi", time: "08:00 – 16:00" },
                { day: "Dimanche", time: "Fermé" },
              ].map(({ day, time }, i) => (
                <div key={day} style={{ display: "flex", justifyContent: "space-between", padding: "14px 18px", borderBottom: i < 2 ? "1px solid var(--color-border)" : "none" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 13, color: "var(--color-muted)" }}>{day}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: time === "Fermé" ? "var(--color-muted)" : "var(--color-text)", letterSpacing: "0.04em" }}>{time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="card" style={{ padding: "48px" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(192,57,43,0.08)", border: "1px solid var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                  <CheckCircle size={22} color="var(--color-accent)" strokeWidth={1.5} />
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--color-text)", letterSpacing: "0.05em", marginBottom: 10 }}>
                  MESSAGE ENVOYÉ
                </h3>
                <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 14, color: "var(--color-muted)" }}>
                  Nous vous répondrons dans les plus brefs délais.
                </p>
              </div>
            ) : (
              <>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "var(--color-text)", letterSpacing: "0.04em", marginBottom: 32 }}>
                  ENVOYER UN MESSAGE
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16, marginBottom: 16 }}>
                    <div>
                      <label htmlFor="contact-nom" style={fieldLabel}>Nom et prénom</label>
                      <input id="contact-nom" type="text" required placeholder="Jean Dupont" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} style={inputStyle}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")} />
                    </div>
                    <div>
                      <label htmlFor="contact-tel" style={fieldLabel}>Téléphone</label>
                      <input id="contact-tel" type="tel" placeholder="+41 79 000 00 00" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} style={inputStyle}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")} />
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label htmlFor="contact-email" style={fieldLabel}>Email</label>
                    <input id="contact-email" type="email" required placeholder="jean@exemple.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")} />
                  </div>
                  <div style={{ marginBottom: 32 }}>
                    <label htmlFor="contact-message" style={fieldLabel}>Message</label>
                    <textarea id="contact-message" required rows={5} placeholder="Bonjour, je suis intéressé par..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} style={{ ...inputStyle, resize: "none" }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")} />
                  </div>
                  {error && (
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-accent)", marginBottom: 16 }}>
                      {error}
                    </p>
                  )}
                  <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", opacity: loading ? 0.72 : 1 }}>
                    {loading ? (
                      <><span style={{ width: 13, height: 13, border: "1.5px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin 0.65s linear infinite" }} />Envoi…</>
                    ) : (
                      <><Send size={13} strokeWidth={1.5} />Envoyer</>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
