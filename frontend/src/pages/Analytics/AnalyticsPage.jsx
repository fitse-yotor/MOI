import { useApiGet } from "../../api/hooks.js";
import KpiCard from "../../components/common/KpiCard.jsx";
import ChartCard from "../../components/common/ChartCard.jsx";
import Button from "../../components/common/Button.jsx";
import { DataState } from "../../components/common/StateViews.jsx";

export default function AnalyticsPage() {
  const { data, loading, error, refetch } = useApiGet("/analytics");

  return (
    <>
      <div className="toolbar">
        <select className="filter-select"><option>2026 · Q2</option><option>2026 · Q1</option></select>
        <select className="filter-select"><option>All regions</option></select>
        <select className="filter-select"><option>All sectors</option></select>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <Button variant="outline" size="sm">Save view</Button>
          <Button variant="outline" size="sm">Presentation mode</Button>
          <Button size="sm">Export PDF</Button>
        </div>
      </div>
      <DataState loading={loading} error={error} onRetry={refetch} isEmpty={!data}>
        {data && (
          <>
            <div className="grid g4">
              {data.kpis.map((k) => <KpiCard key={k.label} {...k} />)}
            </div>
            <div className="grid g2" style={{ marginTop: 18 }}>
              <ChartCard
                title="Production & sales trend" subtitle="ETB billions" type="line"
                data={{ labels: data.productionSalesTrend.labels, datasets: [
                  { label: "Production", data: data.productionSalesTrend.production, borderColor: "#075985", backgroundColor: "rgba(7,89,133,.1)", fill: true, tension: 0.3 },
                  { label: "Sales", data: data.productionSalesTrend.sales, borderColor: "#F4B41A", backgroundColor: "rgba(244,180,26,.12)", fill: true, tension: 0.3 },
                ]}}
              />
              <ChartCard
                title="Employment by gender & region" type="bar"
                options={{ indexAxis: "y", scales: { x: { stacked: true, grid: { color: "#EEF2F5" } }, y: { stacked: true, grid: { display: false } } } }}
                data={{ labels: data.genderByRegion.labels, datasets: [
                  { label: "Female", data: data.genderByRegion.female, backgroundColor: "#087F8C", stack: "s" },
                  { label: "Male", data: data.genderByRegion.male, backgroundColor: "#DDF3F4", stack: "s" },
                ]}}
              />
            </div>
            <div className="grid g2" style={{ marginTop: 18 }}>
              <ChartCard
                title="Top constraints reported by enterprises" type="bar"
                options={{ indexAxis: "y", plugins: { legend: { display: false } } }}
                data={{ labels: data.constraints.labels, datasets: [{ data: data.constraints.values, backgroundColor: "#C93C37", borderRadius: 4 }] }}
              />
              <ChartCard
                title="ICT adoption" type="bar"
                options={{ plugins: { legend: { display: false } }, scales: { y: { max: 100, grid: { color: "#EEF2F5" } } } }}
                data={{ labels: data.ictAdoption.labels, datasets: [{ data: data.ictAdoption.values, backgroundColor: "#1976B9", borderRadius: 4 }] }}
              />
            </div>

            {/* ── External Integration Telemetry & Analytics ── */}
            <div style={{ marginTop: 24, padding: "18px 20px", background: "#f0f9ff", borderRadius: 12, border: "1px solid #bae6fd" }}>
              <div className="flexbtw" style={{ marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0369a1", margin: 0 }}>
                    ⚡ Cross-System Live Telemetry & Integration Analytics
                  </h3>
                  <small style={{ color: "#64748b" }}>
                    Real-time aggregated analytics from EIC FDI Gateway, Customs CSV Feeds, and Ethio Telecom Fiber Ring
                  </small>
                </div>
                <span className="badge success">Live Sync Active</span>
              </div>

              <div className="grid g2">
                {data.fdiBySectorChart && (
                  <ChartCard
                    title="Approved FDI capital by sector ($M USD)"
                    subtitle="Source: EIC Foreign Direct Investment Gateway"
                    type="bar"
                    options={{ plugins: { legend: { display: false } }, scales: { y: { grid: { color: "#e2e8f0" } } } }}
                    data={{
                      labels: data.fdiBySectorChart.labels,
                      datasets: [{ data: data.fdiBySectorChart.values, backgroundColor: "#059669", borderRadius: 6 }],
                    }}
                  />
                )}

                {data.fiberCoverageChart && (
                  <ChartCard
                    title="Telecom fiber bandwidth by industrial park (Gbps)"
                    subtitle="Source: Ethio Telecom GIS Infrastructure Feed"
                    type="bar"
                    options={{ plugins: { legend: { display: false } }, scales: { y: { grid: { color: "#e2e8f0" } } } }}
                    data={{
                      labels: data.fiberCoverageChart.labels,
                      datasets: [{ data: data.fiberCoverageChart.values, backgroundColor: "#7c3aed", borderRadius: 6 }],
                    }}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </DataState>
    </>
  );
}

