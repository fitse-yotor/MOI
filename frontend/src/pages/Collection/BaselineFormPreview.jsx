import NmisQuestionnaireWizard from "./NmisQuestionnaireWizard.jsx";

export default function BaselineFormPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Header bar with mobile launch button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
          background: "var(--card)",
          padding: "12px 18px",
          borderRadius: 12,
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, color: "var(--primary-dark)" }}>
            NMIS V16 — Official 10-Module Manufacturing Survey
          </div>
          <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
            Desktop administration view. Launch the mobile simulator to preview exactly how field enumerators see this form on a smartphone.
          </div>
        </div>

        <a
          href="/collection/mobile-collector"
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            borderRadius: 8,
            background: "var(--primary)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 13,
            textDecoration: "none",
            boxShadow: "0 2px 8px rgba(7,89,133,0.25)",
            transition: "opacity 0.15s",
            whiteSpace: "nowrap",
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.88")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
        >
          📱 Open Mobile Simulator ↗
        </a>
      </div>

      {/* Desktop form — always shown here */}
      <NmisQuestionnaireWizard isMobile={false} />
    </div>
  );
}
