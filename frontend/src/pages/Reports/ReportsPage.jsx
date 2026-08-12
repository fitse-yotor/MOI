import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApiGet, useApiAction, buildQuery } from "../../api/hooks.js";
import FilterBar from "../../components/common/FilterBar.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import { Card } from "../../components/common/Card.jsx";
import { DataState } from "../../components/common/StateViews.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSnackbar } from "../../context/SnackbarContext.jsx";

const CATEGORIES = ["Employment", "Production", "Trade", "Investment", "Registry", "Benchmark", "Data quality", "Compliance", "Policy Brief", "Administrative"];

export default function ReportsPage() {
  const { can } = useAuth();
  const navigate = useNavigate();
  const { notify } = useSnackbar();

  const [activeType, setActiveType] = useState("all");
  const [filters, setFilters] = useState({ q: "", category: "all" });
  const [deleting, setDeleting] = useState(null);

  const query = buildQuery({ ...filters, type: activeType });
  const { data, loading, error, refetch } = useApiGet(`/reports${query}`, { deps: [query] });
  const del = useApiAction("del");

  async function handleDelete() {
    await del.run(`/reports/${deleting.id}`);
    notify(`${deleting.name} deleted`, "success");
    setDeleting(null);
    refetch();
  }

  const items = data?.items || [];
  const statCount = items.filter((r) => r.type === "statistical").length;
  const nonStatCount = items.filter((r) => r.type === "non_statistical").length;

  const columns = [
    {
      key: "name",
      label: "Report Title",
      render: (r) => (
        <div>
          <div className="tag-name" style={{ fontWeight: 700, color: "var(--primary-dark)" }}>{r.name}</div>
          {r.author && <div style={{ fontSize: 11, color: "var(--text2)" }}>{r.author}</div>}
        </div>
      ),
    },
    {
      key: "type",
      label: "Reporting Classification",
      render: (r) =>
        r.type === "statistical" ? (
          <Badge tone="info">Statistical</Badge>
        ) : (
          <Badge tone="warn">Non-Statistical</Badge>
        ),
    },
    { key: "category", label: "Category", render: (r) => <Badge tone="muted">{r.category}</Badge> },
    { key: "period", label: "Period", render: (r) => <span className="mono" style={{ fontSize: 12 }}>{r.period || "—"}</span> },
    { key: "published", label: "Published", render: (r) => <span style={{ fontSize: 12 }}>{r.published}</span> },
    {
      key: "status",
      label: "Status",
      render: (r) => (
        <Badge tone={r.status === "Published" ? "success" : r.status === "In review" ? "warn" : "muted"}>
          {r.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (r) => (
        <div style={{ display: "flex", gap: 6 }}>
          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/reports/${r.id}`); }}>View</Button>
          {can("reports", "edit") && <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/reports/${r.id}/edit`); }}>Edit</Button>}
          {can("reports", "delete") && <Button variant="error" size="sm" onClick={(e) => { e.stopPropagation(); setDeleting(r); }}>Delete</Button>}
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── Type Selector Tabs ── */}
      <div style={{ display: "flex", gap: 8, borderBottom: "1px solid var(--border)", paddingBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
        {[
          { id: "all", label: "All Catalogue Reports", count: items.length },
          { id: "statistical", label: "Statistical Reports", count: statCount },
          { id: "non_statistical", label: "Non-Statistical Reports", count: nonStatCount },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveType(tab.id)}
            style={{
              background: activeType === tab.id ? "var(--primary-dark)" : "var(--card)",
              color: activeType === tab.id ? "#fff" : "var(--text)",
              border: `1px solid ${activeType === tab.id ? "var(--primary-dark)" : "var(--border)"}`,
              borderRadius: "var(--radius)",
              padding: "7px 14px",
              fontSize: 12.5,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: activeType === tab.id ? "var(--shadow-xs)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            <span>{tab.label}</span>
            <span style={{
              background: activeType === tab.id ? "rgba(255,255,255,0.2)" : "var(--bg)",
              color: activeType === tab.id ? "#fff" : "var(--text2)",
              padding: "1px 7px",
              borderRadius: 20,
              fontSize: 11,
              fontFamily: "IBM Plex Mono, monospace",
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── Search & Filter Controls ── */}
      <FilterBar
        filters={[
          { type: "search", key: "q", placeholder: "Search report catalogue by title or category..." },
          { type: "select", key: "category", label: "category", options: CATEGORIES },
        ]}
        values={filters}
        onChange={(key, value) => setFilters((f) => ({ ...f, [key]: value }))}
        actions={can("reports", "create") && <Button size="sm" onClick={() => navigate("/reports/new")}>+ New Report</Button>}
      />

      {/* ── Data Table ── */}
      <Card noPadding>
        <DataState loading={loading} error={error} onRetry={refetch} isEmpty={data && items.length === 0}>
          {data && <DataTable columns={columns} rows={items} onRowClick={(r) => navigate(`/reports/${r.id}`)} />}
        </DataState>
      </Card>

      <ConfirmDialog
        open={!!deleting}
        title={deleting ? `Delete ${deleting.name}?` : ""}
        message="This report will be removed from the catalogue."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
