"use client";

import Link from "next/link";
import { BarChart2, Bike, Eye, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AdminSidebar } from "@/components/AdminSidebar";


const DAYS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

function getLast7Days(): { label: string; dateStr: string }[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().slice(0, 10);
    return { label: DAYS[d.getDay()], dateStr };
  });
}

export default function AdminStatsPage() {

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => api.stats.get(),
  });

  const { data: viewsTimeline = [], isLoading: loadingViews } = useQuery({
    queryKey: ["admin-stats-views"],
    queryFn: () => api.stats.views(),
  });

  // Build last-7-days chart data by matching timeline entries to date strings
  const last7 = getLast7Days();
  const viewsByDate = Object.fromEntries(
    viewsTimeline.map((v) => [v.date.slice(0, 10), v._sum.count ?? 0])
  );
  const weeklyData = last7.map(({ label, dateStr }) => ({
    day: label,
    views: viewsByDate[dateStr] ?? 0,
  }));
  const maxViews = Math.max(...weeklyData.map((d) => d.views), 1);
  const weekTotal = weeklyData.reduce((s, d) => s + d.views, 0);

  // Top moto
  const topMoto = stats?.topViewed[0];
  const topMotoLabel = topMoto
    ? `${topMoto.marque} ${topMoto.modele}`
    : "—";

  // Total views across all motos
  const totalViews = stats?.topViewed.reduce((s, m) => s + m._count.vues, 0) ?? 0;

  // Per-moto views with percentage
  const topMax = stats?.topViewed[0]?._count.vues ?? 1;
  const motoRows = stats?.topViewed.map((m) => ({
    modele: `${m.marque} ${m.modele} ${m.annee}`,
    vues: m._count.vues,
    pct: Math.round((m._count.vues / topMax) * 100),
  })) ?? [];

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex" }}>
      <AdminSidebar />

      <main style={{ flex: 1, marginLeft: 240, padding: "40px 40px 80px" }} className="admin-main">
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3vw, 44px)", color: "#F5F5F0", letterSpacing: "0.04em", marginBottom: 40 }}>STATISTIQUES</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }} className="dashboard-cols">
          {/* Weekly bar chart */}
          <div className="card" style={{ padding: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
              <TrendingUp size={14} color="var(--color-accent)" strokeWidth={1.5} />
              <span style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "#F5F5F0", letterSpacing: "0.04em" }}>VUES CETTE SEMAINE</span>
            </div>
            {loadingViews ? (
              <div style={{ height: 120, background: "#1A1A1A", borderRadius: 4, animation: "pulse 1.5s ease-in-out infinite" }} />
            ) : (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120 }}>
                {weeklyData.map(({ day, views }) => (
                  <div key={day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div style={{ width: "100%", background: "rgba(230,0,36,0.15)", borderRadius: "3px 3px 0 0", height: `${Math.max((views / maxViews) * 100, views > 0 ? 4 : 2)}px`, border: "1px solid rgba(230,0,36,0.25)", borderBottom: "none", transition: "height 400ms ease", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: "rgba(230,0,36,0.1)" }} />
                    </div>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "#444", fontWeight: 500 }}>{day}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 24, color: "#F5F5F0", fontWeight: 500 }}>
                {loadingViews ? "—" : weekTotal.toLocaleString("fr-CH")}
              </span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#444", fontWeight: 300 }}>vues cette semaine</span>
            </div>
          </div>

          {/* Summary cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "Vues totales", value: loadingStats ? "—" : totalViews.toLocaleString("fr-CH"), icon: Eye },
              { label: "Motos en stock", value: loadingStats ? "—" : String(stats?.disponibles ?? "—"), icon: Bike },
              { label: "Moto la plus vue", value: loadingStats ? "—" : topMotoLabel, icon: BarChart2 },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="card" style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "#444", display: "block", marginBottom: 6 }}>{label}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, color: "#F5F5F0", fontWeight: 500, lineHeight: 1.3 }}>{value}</span>
                </div>
                <Icon size={16} color="#333" strokeWidth={1.5} />
              </div>
            ))}
          </div>
        </div>

        {/* Per-moto views */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #1F1F1F" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "#F5F5F0", letterSpacing: "0.04em" }}>VUES PAR MOTO</span>
          </div>

          {loadingStats && (
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} style={{ height: 58, background: "#111", opacity: 0.4, animation: "pulse 1.5s ease-in-out infinite" }} />
              ))}
            </div>
          )}

          {!loadingStats && motoRows.length === 0 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 0" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#444", fontWeight: 300 }}>Aucune donnée disponible</span>
            </div>
          )}

          {!loadingStats && motoRows.map(({ modele, vues, pct }, i) => (
            <div key={modele} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, padding: "14px 24px", borderBottom: i < motoRows.length - 1 ? "1px solid #161616" : "none", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#F5F5F0", fontWeight: 400 }}>{modele}</span>
                <div style={{ height: 3, background: "#1A1A1A", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: "var(--color-accent)", borderRadius: 2, opacity: 0.6 }} />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 60, justifyContent: "flex-end" }}>
                <Eye size={11} color="#444" strokeWidth={1.5} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#6B6B6B" }}>{vues}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
