import { useApiGet } from "../../api/hooks.js";
import KpiCard from "../../components/common/KpiCard.jsx";
import ChartCard from "../../components/common/ChartCard.jsx";
import { DataState } from "../../components/common/StateViews.jsx";
import ReviewQueueWidget from "./ReviewQueueWidget.jsx";
import ActivityFeed from "./ActivityFeed.jsx";

const SECTOR_COLORS = ["#075985", "#087F8C", "#F4B41A", "#1976B9", "#27864B", "#D7E0E7"];

export default function Dashboard() {
  const { data, loading, error, refetch } = useApiGet("/dashboard/summary");
  const sectors = useApiGet("/enterprises/sectors");

  return (
    <DataState loading={loading} error={error} onRetry={refetch} isEmpty={!data}>
      {data && (
        <>
          <div className="hint-banner">
            <span>ℹ️</span>
            <div>
              This dashboard aggregates <strong>12,480</strong> registered manufacturing
              enterprises across 11 regions and 2 city administrations. Data is fetched live
              from the API for the selected role.
            </div>
          </div>

          <div className="grid g4">
            {data.kpis.map((k) => (
              <KpiCard key={k.label} {...k} />
            ))}
          </div>

          <div className="grid g2" style={{ marginTop: 18 }}>
            <ChartCard
              title="Enterprise growth & verification"
              subtitle="Registered vs. verified, last 12 months"
              type="line"
              data={{
                labels: data.growthSeries.labels,
                datasets: [
                  { label: "Registered", data: data.growthSeries.registered, borderColor: "#075985", backgroundColor: "rgba(7,89,133,.08)", tension: 0.35, fill: true },
                  { label: "Verified", data: data.growthSeries.verified, borderColor: "#087F8C", backgroundColor: "rgba(8,127,140,.08)", tension: 0.35, fill: true },
                ],
              }}
            />
            <ChartCard
              title="Enterprises by sector"
              subtitle="Share of registered enterprises"
              type="doughnut"
              options={{ cutout: "62%", plugins: { legend: { position: "right" } }, scales: {} }}
              data={{
                labels: (sectors.data?.items || []).map((s) => s.name),
                datasets: [{ data: (sectors.data?.items || []).map((s) => s.share), backgroundColor: SECTOR_COLORS, borderWidth: 2, borderColor: "#fff" }],
              }}
            />
          </div>

          <div className="grid g3" style={{ marginTop: 18 }}>
            <div style={{ gridColumn: "span 2" }}>
              <ChartCard
                title="Regional performance"
                subtitle="Employment & production index by region"
                type="bar"
                data={{
                  labels: data.regionPerformance.labels,
                  datasets: [
                    { label: "Employment index", data: data.regionPerformance.employmentIndex, backgroundColor: "#075985", borderRadius: 4 },
                    { label: "Production index", data: data.regionPerformance.productionIndex, backgroundColor: "#F4B41A", borderRadius: 4 },
                  ],
                }}
              />
            </div>
            <ReviewQueueWidget items={data.reviewQueueSummary} />
          </div>

          <div className="grid g2" style={{ marginTop: 18 }}>
            <ActivityFeed items={data.activityFeed} />
            <ChartCard
              title="Data quality overview"
              subtitle="Composite score by domain"
              type="radar"
              options={{ scales: { r: { min: 0, max: 100, ticks: { display: false }, grid: { color: "#EEF2F5" } } }, plugins: { legend: { display: false } } }}
              data={{
                labels: data.dataQualityRadar.labels,
                datasets: [{ label: "Score", data: data.dataQualityRadar.values, backgroundColor: "rgba(8,127,140,.18)", borderColor: "#087F8C", pointBackgroundColor: "#087F8C" }],
              }}
            />
          </div>
        </>
      )}
    </DataState>
  );
}
