import Badge from "./Badge.jsx";

/**
 * Renders an official certificate document graphic with seal, watermark,
 * gold badge, and QR code stamp.
 */
export default function CertificatePreview({
  templateName = "National Manufacturing Registration Certificate",
  category = "Commercial Operating Permit",
  licenseNumber,
  enterpriseName,
  issueDate = "2024-01-15",
  expiryDate = "2027-01-15",
  feeETB,
  terms = [],
  status = "Active",
  issuedBy = "Ministry of Industry, FDRE",
}) {
  return (
    <div className="certificate" style={{ background: "#f8fafc", borderRadius: 16, padding: 10, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
      <div
        className="certificate-border"
        style={{
          border: "2px solid #b45309",
          outline: "2px solid #f59e0b",
          outlineOffset: "-10px",
          borderRadius: 12,
          padding: "32px 28px",
          background: "linear-gradient(180deg, #ffffff 0%, #fefce8 50%, #ffffff 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Watermark Seal */}
        <img
          src="/ministry-mark.svg"
          alt=""
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 220,
            opacity: 0.04,
            pointerEvents: "none",
          }}
        />

        {/* Top Header */}
        <div className="certificate-head" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <img src="/ministry-mark.svg" alt="Official Seal" className="certificate-seal" style={{ width: 48, height: 48 }} />
          <div>
            <div className="certificate-issuer" style={{ fontSize: 11, fontWeight: 800, color: "#92400e", letterSpacing: "0.06em" }}>
              FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA
            </div>
            <div className="certificate-issuer-sub" style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>
              MINISTRY OF INDUSTRY · MANUFACTURING BIS
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            {status && <Badge tone={status === "Active" || status === "Verified" ? "success" : "info"}>{status}</Badge>}
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #f59e0b, #b45309)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 900, boxShadow: "0 2px 6px rgba(180,83,9,0.4)" }}>
              ✓
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="certificate-title" style={{ fontSize: 22, fontWeight: 900, textAlign: "center", color: "#78350f", margin: "10px 0 2px", fontFamily: "serif" }}>
          {templateName}
        </div>
        {category && (
          <div className="certificate-category" style={{ textAlign: "center", fontSize: 11, color: "#b45309", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 800, marginBottom: 20 }}>
            {category}
          </div>
        )}

        {/* Body */}
        <div className="certificate-body" style={{ textAlign: "center", padding: "16px 0", borderTop: "1px dashed #d97706", borderBottom: "1px dashed #d97706", marginBottom: 20 }}>
          <div className="certificate-lede" style={{ fontSize: 12.5, color: "#64748b", fontStyle: "italic" }}>
            This is to officially certify and register that
          </div>
          <div className="certificate-name" style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", margin: "8px 0", letterSpacing: "-0.01em" }}>
            {enterpriseName || "— Enterprise Name —"}
          </div>
          <div className="certificate-lede" style={{ fontSize: 12.5, color: "#475569" }}>
            has met all regulatory criteria and is authorized to operate in accordance with national manufacturing standards.
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="certificate-meta" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 14, marginBottom: 20, background: "rgba(254, 243, 199, 0.4)", padding: 14, borderRadius: 8, border: "1px solid #fef08a" }}>
          <div>
            <label style={{ fontSize: 10, textTransform: "uppercase", color: "#92400e", fontWeight: 800, display: "block" }}>Certificate No.</label>
            <div className="mono" style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{licenseNumber || "REG-MOI-2026"}</div>
          </div>
          <div>
            <label style={{ fontSize: 10, textTransform: "uppercase", color: "#92400e", fontWeight: 800, display: "block" }}>Issue Date</label>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{issueDate}</div>
          </div>
          <div>
            <label style={{ fontSize: 10, textTransform: "uppercase", color: "#92400e", fontWeight: 800, display: "block" }}>Valid Until</label>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{expiryDate}</div>
          </div>
          <div>
            <label style={{ fontSize: 10, textTransform: "uppercase", color: "#92400e", fontWeight: 800, display: "block" }}>Authority</label>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#78350f" }}>{issuedBy}</div>
          </div>
        </div>

        {/* Footer: Stamp, Signature & Barcode */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: 10, borderTop: "1px solid #fde68a" }}>
          <div style={{ fontSize: 10, color: "#78350f", fontFamily: "monospace" }}>
            VERIFIED RECORD · ETHIOPIA MOI<br />
            SCAN QR FOR OFFICIAL VALIDATION
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "serif", fontStyle: "italic", fontSize: 16, fontWeight: 700, color: "#78350f" }}>Minister of Industry</div>
            <div style={{ fontSize: 10, color: "#92400e", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 800 }}>FDRE Official Seal &amp; Signature</div>
          </div>
        </div>
      </div>
    </div>
  );
}

