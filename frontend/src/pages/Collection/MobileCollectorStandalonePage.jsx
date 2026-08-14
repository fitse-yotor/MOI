import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NmisQuestionnaireWizard from "./NmisQuestionnaireWizard.jsx";

const DEVICES = {
  iphone: { name: "iPhone 15 Pro", width: 393, height: 780, radius: 46, notch: "dynamic-island" },
  galaxy: { name: "Samsung Galaxy S24", width: 360, height: 750, radius: 36, notch: "hole-punch" },
  tablet: { name: "Field Enumerator Tablet", width: 768, height: 850, radius: 24, notch: "none" },
  native: { name: "Full Mobile View (100%)", width: "100%", height: "100vh", radius: 0, notch: "none" },
};

export default function MobileCollectorStandalonePage() {
  const [deviceKey, setDeviceKey] = useState("iphone");
  const [isOffline, setIsOffline] = useState(false);
  const [scale, setScale] = useState(1);

  const device = DEVICES[deviceKey];

  useEffect(() => {
    document.title = "NMIS V16 Field Mobile Collector · Ministry of Industry";
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0c131f",
        color: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: deviceKey === "native" ? 0 : "16px 20px 40px",
        boxSizing: "border-box",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Standalone Minimal Top Control Bar (Hidden if Native Fullscreen) */}
      {deviceKey !== "native" && (
        <header
          style={{
            width: "100%",
            maxWidth: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            background: "rgba(255, 255, 255, 0.06)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: 14,
            padding: "10px 18px",
            marginBottom: 20,
          }}
        >
          {/* Back link */}
          <Link
            to="/collection"
            style={{
              color: "#93c5fd",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            ← Back to Desktop Dashboard
          </Link>

          {/* Device Handset Switcher */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#94a3b8", marginRight: 4 }}>Device Model:</span>
            {Object.entries(DEVICES).map(([key, d]) => (
              <button
                key={key}
                type="button"
                onClick={() => setDeviceKey(key)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 8,
                  fontSize: 11.5,
                  fontWeight: 700,
                  border: deviceKey === key ? "2px solid #38bdf8" : "1px solid rgba(255,255,255,0.15)",
                  background: deviceKey === key ? "#0284c7" : "rgba(255,255,255,0.05)",
                  color: "#fff",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {d.name}
              </button>
            ))}
          </div>

          {/* Offline Toggle & Zoom */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              type="button"
              onClick={() => setIsOffline(!isOffline)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                border: "none",
                background: isOffline ? "#ef4444" : "#10b981",
                color: "#fff",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />
              {isOffline ? "Offline Field Mode" : "Online Mode"}
            </button>

            <div style={{ display: "flex", gap: 4 }}>
              {[0.9, 1].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setScale(s)}
                  style={{
                    padding: "3px 7px",
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: scale === s ? 700 : 500,
                    border: scale === s ? "1px solid #38bdf8" : "1px solid rgba(255,255,255,0.15)",
                    background: scale === s ? "#0284c7" : "transparent",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  {Math.round(s * 100)}%
                </button>
              ))}
            </div>
          </div>
        </header>
      )}

      {/* Simulator Device Frame */}
      {deviceKey === "native" ? (
        <div style={{ width: "100%", minHeight: "100vh", background: "var(--bg)" }}>
          <NmisQuestionnaireWizard isMobile={true} />
        </div>
      ) : (
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            transition: "transform 0.2s ease",
          }}
        >
          <div
            style={{
              width: device.width,
              height: device.height,
              background: "#000000",
              borderRadius: device.radius,
              padding: 10,
              boxShadow: "0 30px 70px rgba(0, 0, 0, 0.6), 0 0 0 4px #334155, 0 0 0 8px #0f172a",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Notch / Dynamic Island */}
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
                    boxShadow: "0 0 0 1px rgba(255,255,255,0.08)",
                  }}
                >
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#1a1a2e" }} />
                </div>
              )}
              {device.notch === "hole-punch" && (
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#000", border: "2px solid #334155" }} />
              )}
            </div>

            {/* Screen Glass */}
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
                  background: "#075985",
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
                    <span style={{ fontSize: 10, color: "#fca5a5", background: "rgba(239,68,68,0.25)", padding: "1px 5px", borderRadius: 4 }}>
                      OFFLINE
                    </span>
                  ) : (
                    <span>5G</span>
                  )}
                  <span>100% 🔋</span>
                </div>
              </div>

              {/* Mobile App Header Bar */}
              <div
                style={{
                  padding: "10px 14px",
                  background: "linear-gradient(135deg, #075985, #0369a1)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexShrink: 0,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <img src="/ministry-mark.svg" alt="MOI" style={{ width: 22, height: 22, background: "#fff", borderRadius: 4, padding: 1 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, lineHeight: 1.2 }}>NMIS Mobile Collector</div>
                    <div style={{ fontSize: 9.5, opacity: 0.85 }}>Ministry of Industry FDRE</div>
                  </div>
                </div>
                <span style={{ fontSize: 10, background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>
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

              {/* Mobile Bottom Gesture Home Bar */}
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
      )}
    </div>
  );
}
