"use client";

import Link from "next/link";
import { Mail, Clock, Inbox, Phone, Trash2, ChevronDown } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api";


function formatDate(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffH = Math.floor(diffMin / 60);
  const diffD = Math.floor(diffH / 24);

  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  if (diffH < 24) return `Il y a ${diffH}h`;
  if (diffD === 1) return "Hier";
  if (diffD < 7) return `Il y a ${diffD} jours`;
  return date.toLocaleDateString("fr-CH", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminMessagesPage() {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: () => api.messages.list(),
  });

  const unreadCount = messages.filter((m) => !m.lu).length;

  async function handleExpand(id: number, alreadyRead: boolean) {
    const isOpening = expandedId !== id;
    setExpandedId(isOpening ? id : null);
    if (isOpening && !alreadyRead) {
      // Optimistically mark as read so the indicator disappears immediately
      queryClient.setQueryData<typeof messages>(["admin-messages"], (prev) =>
        prev?.map((m) => (m.id === id ? { ...m, lu: true } : m))
      );
      await api.messages.markAsRead(id);
    }
  }

  async function handleDelete(e: React.MouseEvent, id: number) {
    e.stopPropagation();
    if (!confirm("Supprimer ce message définitivement ?")) return;
    setDeletingId(id);
    try {
      await api.messages.delete(id);
      if (expandedId === id) setExpandedId(null);
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex" }}>
      <AdminSidebar />

      <main style={{ flex: 1, marginLeft: 240, padding: "40px 40px 80px" }} className="admin-main">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3vw, 44px)", color: "#F5F5F0", letterSpacing: "0.04em", lineHeight: 1 }}>MESSAGES</h1>
          {unreadCount > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-accent)" }} />
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-accent)", fontWeight: 500 }}>
                {`${unreadCount} non lu${unreadCount > 1 ? "s" : ""}`}
              </span>
            </div>
          )}
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="card" style={{ padding: 24, height: 90, opacity: 0.4, animation: "pulse 1.5s ease-in-out infinite" }} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && messages.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.03)", border: "1px solid #1F1F1F", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Inbox size={22} color="#444" strokeWidth={1.5} />
            </div>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#444", fontWeight: 300 }}>Aucun message pour le moment</span>
          </div>
        )}

        {/* Message list */}
        {!isLoading && messages.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {messages.map((msg) => {
              const isExpanded = expandedId === msg.id;
              const isDeleting = deletingId === msg.id;

              return (
                <div
                  key={msg.id}
                  className="card"
                  style={{
                    borderLeft: msg.lu ? "2px solid transparent" : "2px solid var(--color-accent)",
                    overflow: "hidden",
                    opacity: isDeleting ? 0.4 : 1,
                    transition: "opacity 200ms ease",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleExpand(msg.id, msg.lu)}
                    style={{ width: "100%", background: "none", border: "none", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", gap: 12, textAlign: "left" }}
                    className="adm-row"
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: msg.lu ? "rgba(255,255,255,0.04)" : "rgba(230,0,36,0.1)", border: `1px solid ${msg.lu ? "#2A2A2A" : "rgba(230,0,36,0.25)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Mail size={13} color={msg.lu ? "#444" : "var(--color-accent)"} strokeWidth={1.5} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#F5F5F0", fontWeight: 500 }}>{msg.nom}</span>
                          {!msg.lu && (
                            <span style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-accent)", border: "1px solid rgba(230,0,36,0.3)", borderRadius: 3, padding: "2px 6px", flexShrink: 0 }}>
                              Nouveau
                            </span>
                          )}
                        </div>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#555", fontWeight: 300, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {msg.sujet ?? msg.message.slice(0, 60) + (msg.message.length > 60 ? "…" : "")}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Clock size={10} color="#333" strokeWidth={1.5} />
                        <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#444" }}>{formatDate(msg.createdAt)}</span>
                      </div>
                      <ChevronDown
                        size={15}
                        color="#444"
                        strokeWidth={1.5}
                        style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 220ms ease", flexShrink: 0 }}
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div style={{ borderTop: "1px solid #1A1A1A", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
                      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Mail size={12} color="#555" strokeWidth={1.5} style={{ marginTop: 1, flexShrink: 0 }} />
                          <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#6B6B6B" }}>{msg.email}</span>
                        </div>
                        {msg.telephone && (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Phone size={12} color="#555" strokeWidth={1.5} />
                            <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#6B6B6B" }}>{msg.telephone}</span>
                          </div>
                        )}
                      </div>

                      <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#9A9A9A", fontWeight: 300, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>
                        {msg.message}
                      </p>

                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", paddingTop: 4, borderTop: "1px solid #1A1A1A" }}>
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.sujet ?? 'Votre message')}`}
                          className="btn"
                          style={{ background: "rgba(230,0,36,0.08)", border: "1px solid rgba(230,0,36,0.25)", color: "var(--color-accent)", fontSize: 11, minHeight: 36, padding: "0 16px", gap: 6 }}
                        >
                          <Mail size={12} strokeWidth={1.5} />
                          Répondre par email
                        </a>
                        {msg.telephone && (
                          <a
                            href={`tel:${msg.telephone.replaceAll(/\s/g, "")}`}
                            className="btn adm-btn-ghost"
                            style={{ border: "1px solid #2A2A2A", color: "#6B6B6B", fontSize: 11, minHeight: 36, padding: "0 16px", gap: 6, textDecoration: "none" }}
                          >
                            <Phone size={12} strokeWidth={1.5} />
                            Appeler
                          </a>
                        )}
                        <button
                          onClick={(e) => handleDelete(e, msg.id)}
                          disabled={isDeleting}
                          className="btn adm-btn-danger"
                          style={{ border: "1px solid #2A2A2A", color: "#555", fontSize: 11, minHeight: 36, padding: "0 16px", gap: 6, marginLeft: "auto", cursor: isDeleting ? "not-allowed" : "pointer", background: "none" }}
                        >
                          <Trash2 size={12} strokeWidth={1.5} />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
