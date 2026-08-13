import ChatPanel from "../../components/chat/ChatPanel.jsx";

const FEATURES = [
  { label: "Enterprise Registry" },
  { label: "GIS & Infrastructure" },
  { label: "Permits & Licenses" },
  { label: "Sector Benchmarks" },
  { label: "Investment Matching" },
];

export default function ChatPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── Executive Header Banner ── */}
      <div style={{
        background: "linear-gradient(135deg, var(--primary-dark) 0%, #0d2b3f 60%, var(--primary-dark) 100%)",
        borderRadius: "var(--radius-lg)",
        padding: "24px 28px",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 14,
        boxShadow: "var(--shadow-md)",
        border: "1px solid rgba(255,255,255,0.08)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.02)", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative" }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}>
            <img src="/ministry-mark.svg" alt="Seal" style={{ width: 30, height: 30, filter: "brightness(0) invert(1)" }} />
          </div>
          <div>
            <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8", fontWeight: 700, marginBottom: 3 }}>
              Federal Democratic Republic of Ethiopia · Ministry of Industry
            </div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff" }}>
              AI Industry Intelligence Assistant
            </h1>
            <div style={{ fontSize: 12.5, color: "#cbd5e1", marginTop: 3 }}>
              Automated queries on manufacturing enterprises, regional infrastructure, licenses &amp; market fit
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 20, padding: "5px 12px" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
            <span style={{ fontSize: 11.5, fontWeight: 700, color: "#4ade80" }}>System Active</span>
          </div>
          <div style={{ fontSize: 10.5, color: "#64748b" }}>National Industrial Registry Engine</div>
        </div>
      </div>

      {/* ── Feature Pills ── */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {FEATURES.map((f) => (
          <div key={f.label} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "5px 13px",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text2)",
            boxShadow: "var(--shadow-xs)",
          }}>
            <span>{f.label}</span>
          </div>
        ))}
      </div>

      {/* ── Chat surface card ── */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {/* Top bar */}
        <div style={{
          padding: "12px 18px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#fafcfd",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--success)", display: "inline-block" }} />
            <span className="card-title" style={{ margin: 0, fontSize: 13.5 }}>Intelligence Console</span>
            <span className="badge info">Automated AI</span>
          </div>
        </div>

        {/* ChatPanel — storageKey enables persistent history across sessions */}
        <ChatPanel endpoint="/chat" storageKey="ai_assistant" />
      </div>
    </div>
  );
}
