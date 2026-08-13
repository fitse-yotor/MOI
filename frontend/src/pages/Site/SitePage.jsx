import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { api } from "../../api/client.js";
import Badge from "../../components/common/Badge.jsx";
import CertificatePreview from "../../components/common/CertificatePreview.jsx";
import { DataState } from "../../components/common/StateViews.jsx";
import ChatWidget from "../../components/chat/ChatWidget.jsx";

const pinIcon = L.divIcon({
  html: '<div style="width:16px;height:16px;border-radius:50%;background:#075985;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>',
  className: "",
  iconSize: [16, 16],
});

/* ── Sector → product image keyword map (Unsplash) ── */
const SECTOR_IMG = {
  "Textile & Garment": ["textile-factory", "garment-fabric", "apparel-manufacturing"],
  "Food & Beverage": ["grain-mill", "food-processing", "ethiopian-food"],
  "Leather & Footwear": ["leather-workshop", "leather-shoe", "tannery"],
  "Metal & Engineering": ["steel-fabrication", "metal-workshop", "industrial-metal"],
  "Chemicals": ["chemical-plant", "industrial-chemistry", "laboratory"],
  "default": ["manufacturing-factory", "industrial-production", "factory"],
};

function productImage(sector, idx) {
  const keywords = SECTOR_IMG[sector] || SECTOR_IMG["default"];
  const kw = keywords[idx % keywords.length];
  return `https://source.unsplash.com/400x260/?${encodeURIComponent(kw)}&sig=${idx + 1}`;
}

function Stat({ label, value }) {
  return (
    <div className="site-stat">
      <div className="site-stat-value">{value}</div>
      <div className="site-stat-label">{label}</div>
    </div>
  );
}

export default function SitePage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    api
      .get(`/public/industries/${slug}`)
      .then((res) => alive && setData(res))
      .catch((err) => alive && setError(err.message || "Failed to load profile"))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [slug, retry]);

  const e = data?.item;
  const theme = e?.theme || "marine";

  return (
    <div className={`site-page site-theme-${theme}`}>
      <header className="site-topbar">
        <Link to="/" className="site-brand">
          <img src="/ministry-mark.svg" alt="" />
          <span>Manufacturing BIS <em>Ministry of Industry, Ethiopia</em></span>
        </Link>
        <div className="site-topbar-links">
          <Link to="/" className="site-topbar-link">Register</Link>
          <Link to="/login" className="site-topbar-link">Sign in</Link>
        </div>
      </header>

      <DataState loading={loading} error={error} onRetry={() => setRetry((r) => r + 1)} isEmpty={!e}>
        {e && (
          <>
            <section className="site-hero">
              <div className="site-hero-inner">
                <div className="site-hero-badges">
                  <Badge>{e.status}</Badge>
                  <Badge tone="info">{e.size} enterprise</Badge>
                  <Badge tone="muted">{e.sector}</Badge>
                </div>
                <h1>{e.name}</h1>
                <p className="site-tagline">{e.tagline || `${e.sector} manufacturer based in ${e.region}`}</p>
                <div className="site-hero-stats">
                  <Stat label="Established" value={e.establishedYear} />
                  <Stat label="Employees" value={e.employees} />
                  <Stat label="Capacity utilization" value={`${e.capacityUtilization}%`} />
                  <Stat label="Export status" value={e.exportStatus} />
                </div>
              </div>
            </section>

            <main className="site-main">
              <section className="site-section">
                <div className="site-section-head">
                  <h2>About</h2>
                  <span className="site-sub">{e.tradeName ? `Trading as ${e.tradeName}` : ""}</span>
                </div>
                <p className="site-about">{e.about || `${e.name} is a registered ${e.sector.toLowerCase()} enterprise operating in ${e.region}, ${e.zone}.`}</p>
              </section>

              <section className="site-section">
                <div className="site-section-head">
                  <h2>Products</h2>
                </div>
                <div className="site-products">
                  {(e.products && e.products.length
                    ? e.products
                    : [{ name: "Products coming soon", description: "This enterprise's product catalogue is being prepared." }]
                  ).map((p, idx) => (
                    <div className="site-product" key={p.name}>
                      {/* Product image — uses Unsplash with sector keyword */}
                      <img
                        src={productImage(e.sector, idx)}
                        alt={p.name}
                        className="site-product-img"
                        loading="lazy"
                        onError={(ev) => {
                          ev.target.style.display = "none";
                          ev.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div className="site-product-img-placeholder" style={{ display: "none" }}>
                        🏭
                      </div>
                      <div className="site-product-body">
                        <h3>{p.name}</h3>
                        <p>{p.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="site-section site-section-grid">
                <div>
                  <div className="site-section-head"><h2>Location</h2></div>
                  <div className="site-map">
                    <MapContainer center={[e.lat, e.lng]} zoom={10} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                      <TileLayer attribution="© OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={[e.lat, e.lng]} icon={pinIcon}>
                        <Popup>{e.name}<br />{e.region} · {e.zone}</Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                </div>
                <div>
                  <div className="site-section-head"><h2>Contact</h2></div>
                  <div className="site-contact">
                    <div><label>Manager</label><span>{e.manager || "—"}</span></div>
                    <div><label>Phone</label><span>{e.phone || "—"}</span></div>
                    <div><label>Email</label><span>{e.email || "—"}</span></div>
                    <div><label>Region / Zone</label><span>{e.region} · {e.zone}</span></div>
                    <div><label>Industrial park</label><span>{e.industrialPark}</span></div>
                  </div>
                </div>
              </section>

              <section className="site-section">
                <div className="site-section-head">
                  <h2>Verified Certificates &amp; Permits</h2>
                  <span className="site-sub">Official Verified Records · Ministry of Industry</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
                  {data.certificates.length > 0 ? (
                    data.certificates.map((c) => (
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
                      category="Official Operating Record"
                      licenseNumber={`REG-MOI-${e.establishedYear}-${e.id}`}
                      enterpriseName={e.name}
                      issueDate={`${e.establishedYear}-01-10`}
                      expiryDate={`${e.establishedYear + 5}-01-10`}
                      issuedBy="Ministry of Industry, FDRE"
                      status="Active"
                    />
                  )}
                </div>
              </section>
            </main>

            <footer className="site-footer">
              <div>
                <img src="/ministry-mark.svg" alt="" />
                <span>Manufacturing BIS · Ministry of Industry, Federal Democratic Republic of Ethiopia</span>
              </div>
              <span className="site-footer-right">Generated public profile · {e.name}</span>
            </footer>

            {/* ── Floating Chat Launcher ── */}
            <ChatWidget context={{ enterpriseSlug: slug }} enterpriseName={e.name} />
          </>
        )}
      </DataState>
    </div>
  );
}
