import { useState } from "react";
import NmisQuestionnaireWizard from "./NmisQuestionnaireWizard.jsx";

const DEVICES = {
  iphone: { name: "iPhone 15 Pro", width: 393, height: 780, radius: 46, notch: "dynamic-island" },
  galaxy: { name: "Samsung Galaxy S24", width: 360, height: 750, radius: 36, notch: "hole-punch" },
  tablet: { name: "Field Enumerator Tablet", width: 768, height: 850, radius: 24, notch: "none" },
};

export default function MobileSimulatorFrame() {
  const [deviceKey, setDeviceKey] = useState("iphone");
  const [isOffline, setIsOffline] = useState(false);
  const [scale, setScale] = useState(1);

  const device = DEVICES[deviceKey];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Simulator Control Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          background: "var(--bg2)",
          padding: "10px 18px",
          borderRadius: 12,
          border: "1px solid var(--border)",
          width: "100%",
          maxWidth: 900,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text2)" }}>📱 Device Simulator:</span>
          {Object.entries(DEVICES).map(([key, d]) => (
            <button
              key={key}
              type="button"
              onClick={() => setDeviceKey(key)}
              style={{
                padding: "5px 12px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                border: deviceKey === key ? "2px solid var(--primary)" : "1px solid var(--border)",
                background: deviceKey === key ? "var(--primary)" : "var(--card)",
                color: deviceKey === key ? "#fff" : "var(--text)",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {d.name}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Offline Mode Toggle Simulation */}
          <button
            type="button"
            onClick={() => setIsOffline(!isOffline)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: 20,
              fontSize: 11.5,
              fontWeight: 700,
              cursor: "pointer",
              border: "1px solid var(--border)",
              background: isOffline ? "#fee2e2" : "#dcfce7",
              color: isOffline ? "#991b1b" : "#166534",
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: isOffline ? "#dc2626" : "#16a34a" }} />
            {isOffline ? "Field Mode: Offline" : "Field Mode: Online"}
          </button>

          {/* Scale selector */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text2)" }}>
            <span>Zoom:</span>
            {[0.9, 1].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setScale(s)}
                style={{
                  padding: "2px 6px",
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: scale === s ? 700 : 500,
                  border: scale === s ? "1px solid var(--primary)" : "1px solid var(--border)",
                  background: scale === s ? "var(--primary)" : "var(--card)",
                  color: scale === s ? "#fff" : "var(--text)",
                  cursor: "pointer",
                }}
              >
                {Math.round(s * 100)}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Realistic Mobile Device Mockup Container */}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          transition: "transform 0.2s ease",
          padding: "10px 0 30px",
        }}
      >
        <div
          style={{
            width: device.width,
            height: device.height,
            background: "#090d16",
            borderRadius: device.radius,
            padding: 10,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 4px #2b3545, 0 0 0 8px #131b26",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Hardware Top Bezel & Dynamic Island / Camera */}
          <div
            style={{
              position: "absolute",
              top: 14,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {device.notch === "dynamic-island" && (
              <div
                style={{
                  width: 96,
                  height: 24,
                  background: "#000",
                  borderRadius: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingRight: 8,
                }}
              >
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#1a1a2e" }} />
              </div>
            )}
            {device.notch === "hole-punch" && (
              <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#000", border: "2px solid #1e293b" }} />
            )}
          </div>

          {/* Screen Glass Area */}
          <div
            style={{
              flex: 1,
              background: "var(--bg)",
              borderRadius: device.radius - 8,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {/* Mobile OS Status Bar */}
            <div
              style={{
                height: 38,
                background: "var(--primary-dark)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 18px",
                fontSize: 11.5,
                fontWeight: 700,
                flexShrink: 0,
                zIndex: 20,
              }}
            >
              <span>09:41</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {isOffline ? (
                  <span style={{ fontSize: 10, color: "#fca5a5", background: "rgba(239,68,68,0.2)", padding: "1px 5px", borderRadius: 4 }}>
                    OFFLINE
                  </span>
                ) : (
                  <span>5G</span>
                )}
                <span>100% 🔋</span>
              </div>
            </div>

            {/* Mobile App Header */}
            <div
              style={{
                padding: "10px 14px",
                background: "linear-gradient(135deg, var(--primary-dark), var(--primary))",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img src="/ministry-mark.svg" alt="MOI" style={{ width: 22, height: 22, background: "#fff", borderRadius: 4, padding: 1 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, lineHeight: 1.2 }}>NMIS Mobile Collector</div>
                  <div style={{ fontSize: 9.5, opacity: 0.85 }}>Ministry of Industry FDRE</div>
                </div>
              </div>
              <span style={{ fontSize: 10, background: "rgba(255,255,255,0.18)", padding: "2px 7px", borderRadius: 12, fontWeight: 700 }}>
                {isOffline ? "💾 Local Store" : "☁️ Cloud Synced"}
              </span>
            </div>

            {/* Scrollable Survey Body */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: 10,
                scrollbarWidth: "none",
              }}
            >
              <NmisQuestionnaireWizard isMobile={true} />
            </div>

            {/* Mobile Home Gesture Indicator Bar */}
            <div
              style={{
                height: 16,
                background: "var(--bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <div style={{ width: 110, height: 4, borderRadius: 2, background: "#94a3b8" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
