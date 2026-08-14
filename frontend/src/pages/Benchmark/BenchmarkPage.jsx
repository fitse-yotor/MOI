import { useApiGet } from "../../api/hooks.js";
import ChartCard from "../../components/common/ChartCard.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import Badge from "../../components/common/Badge.jsx";
import { Card, CardHead } from "../../components/common/Card.jsx";
import { DataState } from "../../components/common/StateViews.jsx";

const GREY_SET = ["#075985", "#D7E0E7", "#D7E0E7", "#D7E0E7", "#D7E0E7"];
const TREND_ARROW = { up: "↗", down: "↘", flat: "→" };

const gapColumns = [
  { key: "indicator", label: "Indicator" },
  { key: "ethiopia", label: "Ethiopia", render: (r) => <span className="mono">{r.ethiopia}</span> },
  { key: "peer", label: "Peer average", render: (r) => <span className="mono">{r.peer}</span> },
  { key: "gap", label: "Gap", render: (r) => <Badge tone="error">{r.gap}</Badge> },
  { key: "trend", label: "Trend", render: (r) => <span className="mono">{TREND_ARROW[r.trend]}</span> },
];

export default function BenchmarkPage() {
  const { data, loading, error, refetch } = useApiGet("/benchmark");

  return (
    <>
      <div className="toolbar">
        <select className="filter-select"><option>Sector: Textile & Garment</option></select>
        <select className="filter-select"><option>Peers: Kenya, Vietnam, Bangladesh</option></select>
      </div>
      <DataState loading={loading} error={error} onRetry={refetch} isEmpty={!data}>
        {data && (
          <>
            <div className="grid g2">
              <ChartCard
                title="Labor productivity (USD output / worker)" type="bar"
                options={{ plugins: { legend: { display: false } } }}
                data={{ labels: data.laborProductivity.labels, datasets: [{ data: data.laborProductivity.values, backgroundColor: GREY_SET, borderRadius: 4 }] }}
              />
              <ChartCard
                title="Export share of manufacturing output" type="bar"
                options={{ plugins: { legend: { display: false } } }}
                data={{ labels: data.exportShare.labels, datasets: [{ data: data.exportShare.values, backgroundColor: ["#F4B41A", "#D7E0E7", "#D7E0E7", "#D7E0E7", "#D7E0E7"], borderRadius: 4 }] }}
              />
            </div>

            {data.fdiCountryBenchmark && (
              <div style={{ marginTop: 18 }}>
                <ChartCard
                  title="FDI capital commitment by country of origin ($M USD)"
                  subtitle="Source: Ethiopian Investment Commission FDI Gateway Integration"
                  type="bar"
                  options={{ plugins: { legend: { display: false } }, scales: { y: { grid: { color: "#EEF2F5" } } } }}
                  data={{
                    labels: data.fdiCountryBenchmark.labels,
                    datasets: [{ data: data.fdiCountryBenchmark.values, backgroundColor: ["#0284c7", "#059669", "#7c3aed", "#d97706"], borderRadius: 4 }],
                  }}
                />
              </div>
            )}

            <Card style={{ marginTop: 18 }}>
              <CardHead title="Gap analysis & integrated operational metrics vs. peer average" />
              <DataTable columns={gapColumns} rows={data.gapAnalysis} rowKey="indicator" />
            </Card>
          </>
        )}
      </DataState>
    </>
  );
}

