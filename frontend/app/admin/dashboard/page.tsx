"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Bike, Eye, TrendingUp, Plus, ChevronRight, BarChart2, Clock } from "lucide-react";
import { api } from "@/lib/api";
import { AdminSidebar } from "@/components/AdminSidebar";

const QUICK_ACTIONS = [
  { label: "Ajouter une moto", href: "/admin/motos/nouvelle", Icon: Plus },
  { label: "Gérer les motos", href: "/admin/motos", Icon: Bike },
  { label: "Statistiques", href: "/admin/stats", Icon: BarChart2 },
];

export default function DashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => api.stats.get(),
  });

  const { data: motosData } = useQuery({
    queryKey: ["admin-motos-recent"],
    queryFn: () => api.motos.list({ limit: 5 }),
  });

  const recentMotos = motosData?.data ?? [];

  const statsCards = [

    { label: "Motos en stock", value: stats ? String(stats.disponibles) : "—", delta: `${stats?.total ?? "—"} au total`, Icon: Bike, accent: true },
    { label: "Motos vendues", value: stats ? String(stats.vendues) : "—", delta: "Depuis 2022", Icon: TrendingUp, accent: false },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex" }}>

      <AdminSidebar />

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: 240, padding: "40px 40px 80px" }} className="admin-main">

        {/* Page header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Clock size={12} color="var(--color-accent)" strokeWidth={1.5} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#444", letterSpacing: "0.08em" }}>
              {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 3vw, 48px)", color: "#F5F5F0", letterSpacing: "0.04em", lineHeight: 1 }}>
            TABLEAU DE BORD
          </h1>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 40 }}>
          {statsCards.map(({ label, value, delta, Icon, accent }) => (
            <div
              key={label}
              className="card"
              style={{
                padding: "24px",
                background: accent
                  ? "linear-gradient(135deg, rgba(230,0,36,0.12) 0%, rgba(163,0,26,0.06) 100%)"
                  : "linear-gradient(180deg, #141414 0%, #0e0e0e 100%)",
                borderColor: accent ? "rgba(230,0,36,0.3)" : "#1F1F1F",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "#6B6B6B" }}>
                  {label}
                </span>
                <Icon size={15} color={accent ? "var(--color-accent)" : "#444"} strokeWidth={1.5} />
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 36, fontWeight: 500, color: "#F5F5F0", letterSpacing: "0.01em", lineHeight: 1, marginBottom: 8 }}>
                {value}
              </div>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: accent ? "rgba(230,0,36,0.7)" : "#444", fontWeight: 300 }}>
                {delta}
              </span>
            </div>
          ))}
        </div>

        {/* Two columns: motos table + quick actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24, alignItems: "start" }} className="dashboard-cols">

          {/* Recent motos table */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #1F1F1F" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "#F5F5F0", letterSpacing: "0.04em" }}>
                MOTOS RÉCENTES
              </span>
              <Link
                href="/admin/motos"
                className="adm-link"
                style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#444", textDecoration: "none" }}
              >
                Tout voir <ChevronRight size={12} strokeWidth={2} />
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 16, padding: "10px 24px", borderBottom: "1px solid #1A1A1A" }}>
              {["Modèle", "Prix", "Statut"].map((h) => (
                <span key={h} style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#333" }}>
                  {h}
                </span>
              ))}
            </div>

            {recentMotos.length === 0 ? (
              <div style={{ padding: "32px 24px", textAlign: "center" }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#444" }}>Aucune moto pour l&apos;instant.</span>
              </div>
            ) : (
              recentMotos.map(({ slug, marque, modele, prix, statut }, i) => (
                <div
                  key={slug}
                  className="adm-row"
                  style={{
                    display: "grid", gridTemplateColumns: "1fr auto auto", gap: 16,
                    padding: "14px 24px",
                    borderBottom: i < recentMotos.length - 1 ? "1px solid #161616" : "none",
                    alignItems: "center", cursor: "pointer",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#F5F5F0", fontWeight: 500 }}>
                    {marque} {modele}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#F5F5F0", whiteSpace: "nowrap" }}>
                    {Number(prix).toLocaleString("fr-CH")} CHF
                  </span>
                  <span style={{
                    fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 500,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: statut === "vendu" ? "#444" : "var(--color-accent)",
                    border: `1px solid ${statut === "vendu" ? "#2A2A2A" : "rgba(230,0,36,0.3)"}`,
                    borderRadius: 3, padding: "3px 8px", whiteSpace: "nowrap",
                  }}>
                    {statut === "vendu" ? "Vendu" : "Dispo"}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Quick actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "#F5F5F0", letterSpacing: "0.04em", marginBottom: 4, display: "block" }}>
              ACTIONS
            </span>
            {QUICK_ACTIONS.map(({ label, href, Icon }) => (
              <Link
                key={label}
                href={href}
                className="card"
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", textDecoration: "none", cursor: "pointer" }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 6, background: "rgba(230,0,36,0.08)", border: "1px solid rgba(230,0,36,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={14} color="var(--color-accent)" strokeWidth={1.5} />
                </div>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#F5F5F0", fontWeight: 400, flex: 1 }}>
                  {label}
                </span>
                <ChevronRight size={13} color="#333" strokeWidth={1.5} />
              </Link>
            ))}

            {/* Top viewed */}
            {stats && stats.topViewed.length > 0 && (
              <div className="card" style={{ padding: "18px", marginTop: 8 }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "#444", display: "block", marginBottom: 14 }}>
                  Plus consultées
                </span>
                {stats.topViewed.slice(0, 3).map(({ slug, marque, modele, _count }) => (
                  <div key={slug} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #161616" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#6B6B6B", fontWeight: 300 }}>{marque} {modele}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Eye size={10} color="#444" strokeWidth={1.5} />
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#444" }}>{_count.vues}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
