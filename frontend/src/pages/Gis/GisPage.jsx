import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useApiGet, buildQuery } from "../../api/hooks.js";
import { api } from "../../api/client.js";
import { Card } from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import { DataState } from "../../components/common/StateViews.jsx";

/* ── Map marker icons ── */
const industryIcon = L.divIcon({
  html: '<div style="width:13px;height:13px;border-radius:50%;background:#075985;border:2.5px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.35)"></div>',
  className: "",
  iconSize: [13, 13],
});

function infraIcon(color) {
  return L.divIcon({
    html: `<div style="width:15px;height:15px;border-radius:50%;background:${color};border:2.5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.4)"></div>`,
    className: "",
    iconSize: [15, 15],
  });
}

/* ── Tab switcher ── */
const TABS = [
  { value: "industry", label: "Industry Map" },
  { value: "infrastructure", label: "Infrastructure Map" },
  { value: "match", label: "Industry-Infra Suitability" },
];

function TabBar({ value, onChange }) {
  return (
    <div style={{ display: "flex", background: "#e2e8f0", borderRadius: 10, padding: 3, gap: 2 }}>
      {TABS.map((t) => (
        <button
          key={t.value}
          type="button"
          onClick={() => onChange(t.value)}
          style={{
            border: "none",
            background: value === t.value ? "#fff" : "transparent",
            borderRadius: 8,
            padding: "7px 16px",
            fontSize: 12.5,
            fontWeight: 700,
            color: value === t.value ? "var(--primary)" : "#475569",
            boxShadow: value === t.value ? "var(--shadow-xs)" : "none",
            cursor: "pointer",
            transition: "all 0.15s",
            whiteSpace: "nowrap",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ── Filter select helper ── */
function FilterSelect({ value, onChange, children, placeholder }) {
  return (
    <select
      className="filter-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="all">{placeholder}</option>
      {children}
    </select>
  );
}

/* ── Sidebar panel for selected marker ── */
function SelectedDetail({ selected, infra }) {
  if (!selected) return null;
  const item = selected.item;
  if (selected.type === "industry") {
    return (
      <div style={{ padding: 14, background: "#f0f9ff", borderRadius: 8, border: "1px solid #bae6fd" }}>
        <div style={{ fontWeight: 800, fontSize: 15, color: "var(--primary-dark)", marginBottom: 4 }}>{item.name}</div>
        <div className="muted" style={{ fontSize: 12, marginBottom: 10 }}>{item.sector} · {item.size} · {item.region}</div>
        <div className="stack-8" style={{ fontSize: 12.5 }}>
          <div className="flexbtw"><span className="muted">Employees</span><span className="mono">{item.employees}</span></div>
          <div className="flexbtw"><span className="muted">Capacity Utilization</span><span className="mono">{item.capacityUtilization}%</span></div>
          <div className="flexbtw"><span className="muted">Export Status</span><Badge>{item.exportStatus}</Badge></div>
        </div>
        <Link
          to={`/site/${item.slug}`}
          className="btn btn-primary btn-sm"
          style={{ width: "100%", justifyContent: "center", marginTop: 12, textDecoration: "none" }}
        >
          Open Enterprise Site ↗
        </Link>
      </div>
    );
  }
  return (
    <div style={{ padding: 14, background: "#f0fdf4", borderRadius: 8, border: "1px solid #bbf7d0" }}>
      <div style={{ fontWeight: 800, fontSize: 15, color: "#14532d", marginBottom: 4 }}>{item.name}</div>
      <div className="muted" style={{ fontSize: 12, marginBottom: 10 }}>{infra?.categories?.[item.category]?.label} · {item.region}</div>
      <div className="stack-8" style={{ fontSize: 12.5 }}>
        <div className="flexbtw"><span className="muted">Status</span><Badge tone="info">{item.status}</Badge></div>
        <div className="flexbtw"><span className="muted">Capacity</span><span className="mono">{item.capacity}</span></div>
        {item.description && <p className="muted" style={{ marginTop: 8, lineHeight: 1.5, fontSize: 12 }}>{item.description}</p>}
      </div>
    </div>
  );
}

export default function GisPage() {
  const [mode, setMode] = useState("industry");

  /* Industry map filters */
  const [indRegion, setIndRegion] = useState("all");
  const [indSector, setIndSector] = useState("all");
  const [indSize, setIndSize] = useState("all");

  /* Infrastructure map filters */
  const [infraCategory, setInfraCategory] = useState("all");
  const [infraRegion, setInfraRegion] = useState("all");

  /* Match tab filters */
  const [matchRegion, setMatchRegion] = useState("all");
  const [matchSector, setMatchSector] = useState("all");

  const [visibleLayers, setVisibleLayers] = useState({ park: true, power: true, transport: true, utility: true });
  const [selected, setSelected] = useState(null);

  /* ── Always-on base fetch for filter option lists (unfiltered) ── */
  const { data: baseData } = useApiGet("/gis/points", { deps: [] });
  const filterOptions = baseData?.filters || { regions: [], sectors: [], sizes: [] };

  /* ── Industry tab data ── */
  const indQuery = buildQuery({ region: indRegion, sector: indSector, size: indSize });
  const { data: indData, loading: indLoading, error: indError, refetch: indRefetch } = useApiGet(
    `/gis/points${indQuery}`,
    { deps: [indQuery], enabled: mode === "industry" }
  );

  /* ── Match tab: industry points filtered by matchRegion + matchSector ── */
  const matchIndQuery = buildQuery({ region: matchRegion, sector: matchSector });
  const { data: matchIndData, loading: matchIndLoading } = useApiGet(
    `/gis/points${matchIndQuery}`,
    { deps: [matchIndQuery], enabled: mode === "match" }
  );

  /* ── Match tab: suitability analysis (region + sector) ── */
  const [matchData, setMatchData] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);

  useEffect(() => {
    if (mode === "match") {
      let alive = true;
      setMatchLoading(true);
      const q = buildQuery({ region: matchRegion, sector: matchSector });
      api
        .get(`/gis/match-analysis${q}`)
        .then((res) => alive && setMatchData(res))
        .finally(() => alive && setMatchLoading(false));
      return () => { alive = false; };
    }
  }, [mode, matchRegion, matchSector]);

  /* ── Infrastructure data ── */
  const [infra, setInfra] = useState(null);
  const [infraLoading, setInfraLoading] = useState(false);
  const [infraError, setInfraError] = useState("");

  useEffect(() => {
    if (mode !== "industry") {
      let alive = true;
      setInfraLoading(true);
      setInfraError("");
      const q = mode === "infrastructure"
        ? buildQuery({ category: infraCategory, region: infraRegion })
        : buildQuery({ region: matchRegion });
      api
        .get(`/gis/infrastructure${q}`)
        .then((res) => alive && setInfra(res))
        .catch(() => alive && setInfraError("Failed to load infrastructure data"))
        .finally(() => alive && setInfraLoading(false));
      return () => { alive = false; };
    }
  }, [mode, infraCategory, infraRegion, matchRegion]);

  /* Derived */
  const infraRegions = [...new Set((infra?.items || []).map((i) => i.region))];
  const visibleInfra = (infra?.items || []).filter((i) => visibleLayers[i.category] !== false);
  const matchMarkers = matchIndData?.items || [];

  /* Clear selection when tab changes */
  function changeMode(v) { setMode(v); setSelected(null); }

  return (
    <>
      {/* ── Toolbar ── */}
      <div className="toolbar" style={{ marginBottom: 16 }}>
        <TabBar value={mode} onChange={changeMode} />

        {/* Industry Map filters */}
        {mode === "industry" && (
          <>
            <FilterSelect value={indRegion} onChange={setIndRegion} placeholder="All regions">
              {filterOptions.regions.map((r) => <option key={r} value={r}>{r}</option>)}
            </FilterSelect>
            <FilterSelect value={indSector} onChange={setIndSector} placeholder="All sectors">
              {filterOptions.sectors.map((s) => <option key={s} value={s}>{s}</option>)}
            </FilterSelect>
            <FilterSelect value={indSize} onChange={setIndSize} placeholder="All sizes">
              {filterOptions.sizes.map((s) => <option key={s} value={s}>{s}</option>)}
            </FilterSelect>
          </>
        )}

        {/* Infrastructure Map filters */}
        {mode === "infrastructure" && (
          <>
            <FilterSelect value={infraCategory} onChange={setInfraCategory} placeholder="All infrastructure types">
              {Object.entries(infra?.categories || {}).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </FilterSelect>
            <FilterSelect value={infraRegion} onChange={setInfraRegion} placeholder="All regions">
              {infraRegions.map((r) => <option key={r} value={r}>{r}</option>)}
            </FilterSelect>
          </>
        )}

        {/* Suitability Match filters */}
        {mode === "match" && (
          <>
            <FilterSelect value={matchRegion} onChange={setMatchRegion} placeholder="All regions">
              {filterOptions.regions.map((r) => <option key={r} value={r}>{r}</option>)}
            </FilterSelect>
            <FilterSelect value={matchSector} onChange={setMatchSector} placeholder="All sectors">
              {filterOptions.sectors.map((s) => <option key={s} value={s}>{s}</option>)}
            </FilterSelect>
          </>
        )}

        <div style={{ marginLeft: "auto" }}>
          <Button variant="outline" size="sm" onClick={() => window.print()}>Export GIS Summary</Button>
        </div>
      </div>

      {/* ── Industry & Infrastructure tabs ── */}
      {mode !== "match" && (
        <DataState
          loading={mode === "industry" ? indLoading : infraLoading}
          error={mode === "industry" ? indError : infraError}
          onRetry={() => {
            if (mode === "industry") indRefetch();
            else setInfraCategory((c) => c);
          }}
          isEmpty={mode === "industry" ? !indData : !infra}
        >
          {(mode === "industry" ? !!indData : !!infra) && (
            <div className="grid" style={{ gridTemplateColumns: "1fr 340px", gap: 18 }}>
              {/* Map */}
              <div style={{ height: 600, borderRadius: "var(--radius)", overflow: "hidden", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
                <MapContainer center={[9.02, 38.75]} zoom={6} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                  <TileLayer attribution="© OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {mode === "industry" && indData?.items?.map((p) => (
                    <Marker key={`ind-${p.id}`} position={[p.lat, p.lng]} icon={industryIcon} eventHandlers={{ click: () => setSelected({ type: "industry", item: p }) }}>
                      <Popup>
                        <strong>{p.name}</strong><br />{p.sector} · {p.size}<br />{p.region}<br />
                        <Link to={`/site/${p.slug}`} style={{ color: "#0284c7", fontWeight: 700, fontSize: 11, marginTop: 4, display: "inline-block" }}>
                          Open Site ↗
                        </Link>
                      </Popup>
                    </Marker>
                  ))}
                  {mode === "infrastructure" && visibleInfra.map((p) => (
                    <Marker key={`inf-${p.id}`} position={[p.lat, p.lng]} icon={infraIcon(infra?.categories?.[p.category]?.color || "#64748b")} eventHandlers={{ click: () => setSelected({ type: "infra", item: p }) }}>
                      <Popup><strong>{p.name}</strong><br />{p.status} · {p.capacity}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              {/* Sidebar */}
              <Card>
                <div className="card-title" style={{ marginBottom: 14, fontSize: 14.5, fontWeight: 800 }}>
                  {mode === "industry" ? "Industry GIS Explorer" : "Infrastructure Explorer"}
                </div>

                {mode === "infrastructure" && infra?.categories && (
                  <div style={{ marginBottom: 14, padding: "10px 12px", background: "var(--bg)", borderRadius: 8, border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Infrastructure Layers</div>
                    <div className="stack-8">
                      {Object.entries(infra.categories).map(([k, v]) => {
                        const total = infra?.grouped?.[k]?.length || 0;
                        return (
                          <label key={k} className="flexbtw" style={{ cursor: "pointer", fontSize: 12.5 }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                              <span style={{ width: 10, height: 10, borderRadius: "50%", background: v.color, flexShrink: 0 }} />
                              {v.label}
                              <span className="muted mono" style={{ fontSize: 11 }}>({total})</span>
                            </span>
                            <input type="checkbox" checked={visibleLayers[k] !== false} onChange={(e) => setVisibleLayers((l) => ({ ...l, [k]: e.target.checked }))} />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selected ? (
                  <SelectedDetail selected={selected} infra={infra} />
                ) : (
                  <div className="muted" style={{ fontSize: 12.5, fontStyle: "italic", marginBottom: 12 }}>
                    Click any marker on the map to inspect its details.
                  </div>
                )}

                {mode === "industry" && (
                  <>
                    <div className="section-title" style={{ fontSize: 12.5, margin: "18px 0 8px", fontWeight: 700 }}>Industrial Cluster Summary</div>
                    <div className="stack-8" style={{ fontSize: 12.5 }}>
                      <div className="flexbtw"><span className="muted">Enterprises in view</span><span className="mono">{indData?.clusterSummary?.enterprisesInView?.toLocaleString()}</span></div>
                      <div className="flexbtw"><span className="muted">Regions covered</span><span className="mono">{indData?.clusterSummary?.regionsCovered}</span></div>
                      <div className="flexbtw"><span className="muted">Sectors covered</span><span className="mono">{indData?.clusterSummary?.sectorsCovered}</span></div>
                    </div>
                  </>
                )}
              </Card>
            </div>
          )}
        </DataState>
      )}

      {/* ── Match tab: always-mounted map, inline loading in sidebar ── */}
      {mode === "match" && (
        <>
          {!matchIndData && !infra && matchIndLoading && (
            <div className="muted" style={{ padding: "24px 0", textAlign: "center" }}>Loading match analysis…</div>
          )}

          {(matchIndData || infra) && (
            <div className="grid" style={{ gridTemplateColumns: "1fr 340px", gap: 18 }}>
              {/* Map */}
              <div style={{ position: "relative", height: 600, borderRadius: "var(--radius)", overflow: "hidden", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
                {(matchIndLoading || matchLoading) && (
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--primary)", zIndex: 999, animation: "gisLoad 1.2s ease infinite" }} />
                )}
                <MapContainer center={[9.02, 38.75]} zoom={6} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                  <TileLayer attribution="© OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  {/* Industry enterprise markers (filtered by region + sector) */}
                  {matchMarkers.map((p) => (
                    <Marker key={`mind-${p.id}`} position={[p.lat, p.lng]} icon={industryIcon} eventHandlers={{ click: () => setSelected({ type: "industry", item: p }) }}>
                      <Popup>
                        <strong>{p.name}</strong><br />{p.sector} · {p.size}<br />{p.region}<br />
                        <Link to={`/site/${p.slug}`} style={{ color: "#0284c7", fontWeight: 700, fontSize: 11, marginTop: 4, display: "inline-block" }}>
                          Open Site ↗
                        </Link>
                      </Popup>
                    </Marker>
                  ))}

                  {/* Infrastructure markers (all, layer-toggled) */}
                  {visibleInfra.map((p) => (
                    <Marker key={`minf-${p.id}`} position={[p.lat, p.lng]} icon={infraIcon(infra?.categories?.[p.category]?.color || "#64748b")} eventHandlers={{ click: () => setSelected({ type: "infra", item: p }) }}>
                      <Popup><strong>{p.name}</strong><br />{p.status} · {p.capacity}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              {/* Sidebar */}
              <Card>
                <div className="card-title" style={{ marginBottom: 14, fontSize: 14.5, fontWeight: 800 }}>
                  Industry-Infra Suitability Match
                </div>

                {/* Marker count chips */}
                <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                  <span className="badge info">{matchMarkers.length} enterprises</span>
                  <span className="badge success">{visibleInfra.length} infra assets</span>
                </div>

                {/* Layer toggle legend */}
                {infra?.categories && (
                  <div style={{ marginBottom: 14, padding: "10px 12px", background: "var(--bg)", borderRadius: 8, border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Map Legend & Layers</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#075985" }} />
                      <span style={{ fontSize: 11.5 }}>Industry Enterprise</span>
                    </div>
                    <div className="stack-8">
                      {Object.entries(infra.categories).map(([k, v]) => {
                        const total = infra?.grouped?.[k]?.length || 0;
                        return (
                          <label key={k} className="flexbtw" style={{ cursor: "pointer", fontSize: 12.5 }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                              <span style={{ width: 10, height: 10, borderRadius: "50%", background: v.color, flexShrink: 0 }} />
                              {v.label}
                              <span className="muted mono" style={{ fontSize: 11 }}>({total})</span>
                            </span>
                            <input type="checkbox" checked={visibleLayers[k] !== false} onChange={(e) => setVisibleLayers((l) => ({ ...l, [k]: e.target.checked }))} />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Selected marker */}
                {selected ? (
                  <SelectedDetail selected={selected} infra={infra} />
                ) : (
                  <div className="muted" style={{ fontSize: 12.5, fontStyle: "italic", marginBottom: 12 }}>
                    Click any marker on the map to inspect its details.
                  </div>
                )}

                {/* Regional suitability analysis */}
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "var(--primary)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Regional Infrastructure Readiness</span>
                    {matchLoading && <span className="muted" style={{ fontSize: 11, fontWeight: 500 }}>Updating…</span>}
                  </div>
                  <div style={{ display: "grid", gap: 8 }}>
                    {(matchData?.items || []).slice(0, 5).map((m) => (
                      <div key={m.region} style={{ padding: "10px 12px", background: "#f0f9ff", borderRadius: 8, border: "1px solid #bae6fd", opacity: matchLoading ? 0.6 : 1, transition: "opacity 0.2s" }}>
                        <div className="flexbtw" style={{ marginBottom: 3 }}>
                          <span style={{ fontWeight: 800, fontSize: 13, color: "#0369a1" }}>{m.region}</span>
                          <span style={{ fontWeight: 800, fontSize: 12, color: "#0284c7" }}>{m.infraScore}% Ready</span>
                        </div>
                        <div style={{ fontSize: 11, color: "#0369a1" }}>{m.totalEnterprises} industries · {m.infraCount} infra assets</div>
                        {m.matches?.length > 0 && (
                          <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 3 }}>
                            {m.matches.map((match) => (
                              <div key={match.sector} style={{ fontSize: 11, color: "var(--text2)" }}>
                                • <strong>{match.sector}</strong> ({match.suitability}% suitability) — <span style={{ color: "#0369a1" }}>{match.keyAsset}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {!matchLoading && (!matchData?.items?.length) && (
                      <div className="muted" style={{ fontSize: 12.5, fontStyle: "italic" }}>No suitability data for the selected filters.</div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          )}
        </>
      )}

      <style>{`
        @keyframes gisLoad {
          0% { transform: scaleX(0); transform-origin: left; }
          50% { transform: scaleX(1); transform-origin: left; }
          51% { transform: scaleX(1); transform-origin: right; }
          100% { transform: scaleX(0); transform-origin: right; }
        }
      `}</style>
    </>
  );
}
