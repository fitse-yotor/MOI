import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useApiGet } from "../../api/hooks.js";
import { Card } from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import { DataState } from "../../components/common/StateViews.jsx";

const markerIcon = L.divIcon({
  html: '<div style="width:14px;height:14px;border-radius:50%;background:#075985;border:2.5px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.3)"></div>',
  className: "",
  iconSize: [14, 14],
});

export default function GisPage() {
  const { data, loading, error, refetch } = useApiGet("/gis/points");
  const [selected, setSelected] = useState(null);

  return (
    <>
      <div className="toolbar">
        <select className="filter-select"><option>Point map</option><option>Marker clusters</option><option>Heat map — density</option></select>
        <select className="filter-select"><option>All sectors</option></select>
        <select className="filter-select"><option>All sizes</option></select>
        <div style={{ marginLeft: "auto" }}><Button variant="outline" size="sm">Export map</Button></div>
      </div>
      <DataState loading={loading} error={error} onRetry={refetch} isEmpty={!data}>
        {data && (
          <div className="grid" style={{ gridTemplateColumns: "1fr 300px", gap: 18 }}>
            <div style={{ height: 520, borderRadius: "var(--radius)", overflow: "hidden", border: "1px solid var(--border)" }}>
              <MapContainer center={[9.02, 38.75]} zoom={6} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                <TileLayer attribution="© OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {data.items.map((p) => (
                  <Marker key={p.id} position={[p.lat, p.lng]} icon={markerIcon} eventHandlers={{ click: () => setSelected(p) }}>
                    <Popup><strong>{p.name}</strong><br />{p.sector} · {p.size}</Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
            <Card>
              <div className="card-title" style={{ marginBottom: 10 }}>Selected enterprise</div>
              {selected ? (
                <>
                  <div className="tag-name">{selected.name}</div>
                  <div className="tag-sub">{selected.sector} · {selected.size} · {selected.region}</div>
                  <div className="stack-8" style={{ marginTop: 14, fontSize: 12.5 }}>
                    <div className="flexbtw"><span className="muted">Employees</span><span className="mono">{selected.employees}</span></div>
                    <div className="flexbtw"><span className="muted">Capacity utilization</span><span className="mono">{selected.capacityUtilization}%</span></div>
                    <div className="flexbtw"><span className="muted">Export status</span><Badge>{selected.exportStatus}</Badge></div>
                  </div>
                </>
              ) : (
                <div className="muted" style={{ fontSize: 12.5 }}>Click a marker to view enterprise details.</div>
              )}
              <div className="section-title" style={{ fontSize: 12.5, margin: "18px 0 8px" }}>Cluster summary</div>
              <div className="stack-8" style={{ fontSize: 12.5 }}>
                <div className="flexbtw"><span className="muted">Enterprises in view</span><span className="mono">{data.clusterSummary.enterprisesInView.toLocaleString()}</span></div>
                <div className="flexbtw"><span className="muted">Industrial parks</span><span className="mono">{data.clusterSummary.industrialParks}</span></div>
                <div className="flexbtw"><span className="muted">Avg. distance to port road</span><span className="mono">{data.clusterSummary.avgDistanceToPortRoadKm} km</span></div>
              </div>
            </Card>
          </div>
        )}
      </DataState>
    </>
  );
}
