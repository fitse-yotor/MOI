import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useApiGet, useApiAction } from "../../api/hooks.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSnackbar } from "../../context/SnackbarContext.jsx";
import EntityViewPage from "../../components/common/EntityViewPage.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import CertificatePreview from "../../components/common/CertificatePreview.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import { getProductImage } from "../../config/productImages.js";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const mapPin = L.divIcon({
  html: '<div style="width:16px;height:16px;border-radius:50%;background:#0284c7;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>',
  className: "",
  iconSize: [16, 16],
});

export default function EnterpriseViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { can } = useAuth();
  const { notify } = useSnackbar();
  const { data, loading, error, refetch } = useApiGet(`/enterprises/${id}`);
  const del = useApiAction("del");
  const [confirming, setConfirming] = useState(false);
  const [activeTab, setActiveTab] = useState("template"); // default to template view!
  const [previewTheme, setPreviewTheme] = useState(null);

  const e = data?.item;

  // Fetch certificates associated with this enterprise
  const { data: certData } = useApiGet(e?.slug ? `/public/industries/${e.slug}` : null);
  const certificates = certData?.certificates || [];

  // Fetch external integration enrichment (ERCA + Customs) — on-demand by TIN
  const { data: extData } = useApiGet(e?.tin ? `/integrations/enriched/enterprise/${e.tin}` : null);

  async function handleDelete() {
    await del.run(`/enterprises/${id}`);
    notify(`${e?.name || id} removed from the registry`, "success");
    navigate("/enterprises");
  }

  const fields = e
    ? [
        { label: "Trade name", value: e.tradeName },
        { label: "TIN", value: e.tin },
        { label: "Sector / Subsector", value: `${e.sector} / ${e.subsector}` },
        { label: "ISIC code", value: e.isic },
        { label: "Region / Zone", value: `${e.region} / ${e.zone}` },
        { label: "Size", value: e.size },
        { label: "Ownership", value: e.ownership },
        { label: "Industrial park", value: e.industrialPark },
        { label: "Employees", value: e.employees },
        { label: "Capacity utilization", value: `${e.capacityUtilization}%` },
        { label: "Manager", value: e.manager },
        { label: "Phone", value: e.phone },
        { label: "Email", value: e.email },
        { label: "Coordinates", value: `${e.lat}, ${e.lng}` },
        { label: "Established", value: e.establishedYear },
      ]
    : [];

  const themeClass = previewTheme || e?.theme || "marine";

  return (
    <>
      <div style={{ marginBottom: 16, display: "flex", gap: 8, borderBottom: "1px solid var(--border)", paddingBottom: 12 }}>
        <button
          type="button"
          className={`btn ${activeTab === "template" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setActiveTab("template")}
        >
          🌐 Industry Website Template
        </button>
        <button
          type="button"
          className={`btn ${activeTab === "details" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setActiveTab("details")}
        >
          📋 Registry Details
        </button>
      </div>

      {activeTab === "details" ? (
        <EntityViewPage
          title={e?.name}
          subtitle={e ? `TIN ${e.tin} · Registered ${e.establishedYear}` : ""}
          backTo="/enterprises"
          loading={loading}
          error={error}
          onRetry={refetch}
          fields={fields}
          badges={
            e && (
              <>
                <Badge>{e.status}</Badge>
                <Badge tone="info">{e.size} enterprise</Badge>
                <Badge tone="muted">{e.exportStatus}</Badge>
              </>
            )
          }
          actions={
            <>
              {e?.slug && (
                <Button variant="outline" size="sm" onClick={() => window.open(`/site/${e.slug}`, "_blank")}>Open website ↗</Button>
              )}
              {can("enterprises", "edit") && (
                <Button variant="outline" size="sm" onClick={() => navigate(`/enterprises/${id}/edit`)}>Edit</Button>
              )}
              {can("enterprises", "delete") && (
                <Button variant="error" size="sm" onClick={() => setConfirming(true)}>Delete</Button>
              )}
            </>
          }
        />
      ) : (
        <div className={`site-theme-${themeClass}`} style={{ background: "var(--site-bg, #f0f7fb)", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
          {/* Header Bar */}
          <div style={{ padding: "14px 20px", background: "var(--bg2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Industry Website Template Preview</div>
              <div style={{ fontSize: 12.5, color: "var(--text2)" }}>Auto-generated public website template for <strong>{e?.name || "Enterprise"}</strong></div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)" }}>Theme Preview:</span>
              {["marine", "forest", "amber", "slate", "gold", "emerald"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setPreviewTheme(t)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 6,
                    fontSize: 11.5,
                    fontWeight: 700,
                    textTransform: "capitalize",
                    border: themeClass === t ? "2px solid #0f172a" : "1px solid rgba(0,0,0,0.15)",
                    background: t === "marine" ? "#0284c7" : t === "forest" ? "#166534" : t === "amber" ? "#d97706" : t === "gold" ? "#a16207" : t === "emerald" ? "#059669" : "#475569",
                    color: "#fff",
                    cursor: "pointer",
                    transform: themeClass === t ? "scale(1.05)" : "scale(1)",
                    transition: "all 0.15s ease",
                  }}
                >
                  {t}
                </button>
              ))}
              {e?.slug && (
                <a href={`/site/${e.slug}`} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ textDecoration: "none", marginLeft: 8 }}>
                  View Live Site ↗
                </a>
              )}
            </div>
          </div>

          {/* Embedded Website Frame Container */}
          {e && (
            <div className={`site-page site-theme-${themeClass}`} style={{ padding: 24, minHeight: 600, background: "var(--site-bg, #f0f7fb)" }}>
              <div className="site-hero" style={{ borderRadius: 12, padding: "32px 24px", marginBottom: 24, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                <div className="site-hero-inner">
                  <div className="site-hero-badges" style={{ marginBottom: 12 }}>
                    <Badge>{e.status}</Badge>
                    <Badge tone="info">{e.size} enterprise</Badge>
                    <Badge tone="muted">{e.sector}</Badge>
                  </div>
                  <h1 style={{ fontSize: 28, margin: "8px 0" }}>{e.name}</h1>
                  <p className="site-tagline" style={{ fontSize: 16, opacity: 0.9 }}>{e.tagline || `${e.sector} manufacturer based in ${e.region}`}</p>
                  <div className="site-hero-stats" style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12 }}>
                    <div className="site-stat"><div className="site-stat-value">{e.establishedYear}</div><div className="site-stat-label">Established</div></div>
                    <div className="site-stat"><div className="site-stat-value">{e.employees}</div><div className="site-stat-label">Employees</div></div>
                    <div className="site-stat"><div className="site-stat-value">{e.capacityUtilization}%</div><div className="site-stat-label">Capacity</div></div>
                    <div className="site-stat"><div className="site-stat-value">{e.exportStatus}</div><div className="site-stat-label">Market</div></div>
                  </div>
                </div>
              </div>

              {/* Template Sections */}
              <div style={{ display: "grid", gap: 24 }}>
                {/* About Section */}
                <div style={{ background: "var(--site-card-bg, #fff)", padding: 22, borderRadius: 12, border: "1px solid var(--site-border, var(--border))", boxShadow: "0 2px 6px rgba(0,0,0,.03)" }}>
                  <h3 style={{ fontSize: 18, marginBottom: 8, color: "var(--site-ink, var(--primary))" }}>🏢 About Enterprise</h3>
                  <p style={{ lineHeight: 1.65, color: "var(--text)" }}>{e.about}</p>
                </div>

                {/* Product Catalogue Section with Photography */}
                <div style={{ background: "var(--site-card-bg, #fff)", padding: 22, borderRadius: 12, border: "1px solid var(--site-border, var(--border))", boxShadow: "0 2px 6px rgba(0,0,0,.03)" }}>
                  <h3 style={{ fontSize: 18, marginBottom: 16, color: "var(--site-ink, var(--primary))" }}>📦 Featured Product Line</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
                    {(e.products || []).map((p, idx) => (
                      <div key={idx} className="site-product" style={{ overflow: "hidden", borderRadius: 10, border: "1px solid var(--site-border, #e2e8f0)", background: "var(--site-card-bg, #fff)" }}>
                        <img
                          src={getProductImage(e.sector, idx)}
                          alt={p.name}
                          style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }}
                          loading="lazy"
                        />
                        <div style={{ padding: "14px 16px" }}>
                          <div style={{ fontWeight: 700, fontSize: 14.5, color: "var(--site-ink, #0f172a)", marginBottom: 6 }}>{p.name}</div>
                          <div style={{ fontSize: 12.8, color: "var(--text2, #475569)", lineHeight: 1.55 }}>{p.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location & Contact Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
                  {/* Location Map */}
                  <div style={{ background: "var(--site-card-bg, #fff)", padding: 20, borderRadius: 12, border: "1px solid var(--site-border, var(--border))", boxShadow: "0 2px 6px rgba(0,0,0,.03)" }}>
                    <h3 style={{ fontSize: 18, marginBottom: 14, color: "var(--site-ink, var(--primary))" }}>📍 Geolocation & Facility</h3>
                    <div style={{ height: 220, borderRadius: 8, overflow: "hidden", border: "1px solid var(--site-border, #cbd5e1)" }}>
                      <MapContainer center={[e.lat || 9.02, e.lng || 38.75]} zoom={10} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                        <TileLayer attribution="© OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[e.lat || 9.02, e.lng || 38.75]} icon={mapPin}>
                          <Popup><strong>{e.name}</strong><br />{e.region} · {e.zone}</Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div style={{ background: "var(--site-card-bg, #fff)", padding: 20, borderRadius: 12, border: "1px solid var(--site-border, var(--border))", boxShadow: "0 2px 6px rgba(0,0,0,.03)" }}>
                    <h3 style={{ fontSize: 18, marginBottom: 14, color: "var(--site-ink, var(--primary))" }}>📞 Contact Information</h3>
                    <div style={{ display: "grid", gap: 10, fontSize: 13.5 }}>
                      <div className="flexbtw" style={{ borderBottom: "1px solid var(--site-border, #f1f5f9)", paddingBottom: 6 }}><span style={{ color: "#64748b" }}>Manager / Officer:</span><strong>{e.manager || "—"}</strong></div>
                      <div className="flexbtw" style={{ borderBottom: "1px solid var(--site-border, #f1f5f9)", paddingBottom: 6 }}><span style={{ color: "#64748b" }}>Phone Contact:</span><strong>{e.phone || "—"}</strong></div>
                      <div className="flexbtw" style={{ borderBottom: "1px solid var(--site-border, #f1f5f9)", paddingBottom: 6 }}><span style={{ color: "#64748b" }}>Official Email:</span><strong>{e.email || "—"}</strong></div>
                      <div className="flexbtw" style={{ borderBottom: "1px solid var(--site-border, #f1f5f9)", paddingBottom: 6 }}><span style={{ color: "#64748b" }}>Region & Zone:</span><strong>{e.region} · {e.zone}</strong></div>
                      <div className="flexbtw"><span style={{ color: "#64748b" }}>Industrial Park:</span><strong>{e.industrialPark}</strong></div>
                    </div>
                  </div>
                </div>

                {/* Verified Certificates Section */}
                <div style={{ background: "var(--site-card-bg, #fff)", padding: 20, borderRadius: 12, border: "1px solid var(--site-border, var(--border))", boxShadow: "0 2px 6px rgba(0,0,0,.03)" }}>
                  <h3 style={{ fontSize: 18, marginBottom: 14, color: "var(--site-ink, var(--primary))" }}>📜 Verified Certificates &amp; Permits</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
                    {certificates.length > 0 ? (
                      certificates.map((c) => (
                        <CertificatePreview
                          key={c.licenseNumber}
                          templateName={c.templateName}
                          category={c.category || "Manufacturing License"}
                          licenseNumber={c.licenseNumber}
                          enterpriseName={e.name}
                          issueDate={c.issueDate}
                          expiryDate={c.expiryDate}
                          issuedBy={c.issuedBy}
                          status="Active"
                        />
                      ))
                    ) : (
                      <CertificatePreview
                        templateName="National Manufacturing Registration Certificate"
                        category="Official Operating Registry Record"
                        licenseNumber={`REG-MOI-${e.establishedYear}-${e.id}`}
                        enterpriseName={e.name}
                        issueDate={`${e.establishedYear}-01-10`}
                        expiryDate={`${e.establishedYear + 5}-01-10`}
                        issuedBy="Ministry of Industry, FDRE"
                        status="Active"
                      />
                    )}
                  </div>
                </div>

                {/* ── External Data Verification Panel ── */}
                {extData && (
                  <div style={{ background: "#f0f9ff", padding: 20, borderRadius: 10, border: "1px solid #bae6fd", boxShadow: "0 2px 4px rgba(0,0,0,.03)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
                      <h3 style={{ fontSize: 18, color: "#0369a1", margin: 0 }}>🔗 External Data Verification</h3>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {(extData.sources || []).map((s) => (
                          <span key={s} className="badge info" style={{ fontSize: 10.5 }}>{s}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>

                      {/* ERCA Tax Compliance */}
                      {extData.taxCompliance && (
                        <div style={{ background: "#fff", padding: 16, borderRadius: 8, border: "1px solid #bae6fd" }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: "#0369a1", marginBottom: 10 }}>🏛️ ERCA Tax Compliance</div>
                          <div style={{ display: "grid", gap: 7, fontSize: 12.5 }}>
                            <div className="flexbtw">
                              <span style={{ color: "#64748b" }}>Compliance Status</span>
                              <span className={`badge ${extData.taxCompliance.status === "COMPLIANT" ? "success" : "warn"}`}>
                                {extData.taxCompliance.status}
                              </span>
                            </div>
                            <div className="flexbtw">
                              <span style={{ color: "#64748b" }}>Last Filing Year</span>
                              <strong>{extData.taxCompliance.filingYear}</strong>
                            </div>
                            <div className="flexbtw">
                              <span style={{ color: "#64748b" }}>Revenue Range (ETB)</span>
                              <strong style={{ color: "#0369a1" }}>{extData.taxCompliance.revenueRange}</strong>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Customs Trade Record */}
                      {extData.tradeRecord && (
                        <div style={{ background: "#fff", padding: 16, borderRadius: 8, border: "1px solid #bae6fd" }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: "#0369a1", marginBottom: 10 }}>📦 Customs Export Record</div>
                          <div style={{ display: "grid", gap: 7, fontSize: 12.5 }}>
                            <div className="flexbtw">
                              <span style={{ color: "#64748b" }}>FOB Export Value</span>
                              <strong style={{ color: "#059669" }}>${extData.tradeRecord.fobValueUsd?.toLocaleString()}</strong>
                            </div>
                            <div className="flexbtw">
                              <span style={{ color: "#64748b" }}>Destination</span>
                              <strong>{extData.tradeRecord.destinationIso}</strong>
                            </div>
                            <div className="flexbtw">
                              <span style={{ color: "#64748b" }}>HS Tariff Code</span>
                              <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12 }}>{extData.tradeRecord.hsCode}</span>
                            </div>
                            <div className="flexbtw">
                              <span style={{ color: "#64748b" }}>Export Date</span>
                              <span>{extData.tradeRecord.exportDate}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 10 }}>
                      Last verified: {new Date(extData.lastVerifiedAt).toLocaleString()} · Data sourced from live integration feeds
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={confirming}
        title={e ? `Remove ${e.name}?` : ""}
        message="This permanently removes the enterprise from the registry. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}

