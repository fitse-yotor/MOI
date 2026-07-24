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

const CATEGORIES = ["Employment", "Production", "Trade", "Investment", "Registry", "Benchmark", "Data quality"];

export default function ReportsPage() {
  const { can } = useAuth();
  const navigate = useNavigate();
  const { notify } = useSnackbar();
  const [filters, setFilters] = useState({ q: "", category: "all" });
  const [deleting, setDeleting] = useState(null);
  const query = buildQuery(filters);
  const { data, loading, error, refetch } = useApiGet(`/reports${query}`, { deps: [query] });
  const del = useApiAction("del");

  async function handleDelete() {
    await del.run(`/reports/${deleting.id}`);
    notify(`${deleting.name} deleted`, "success");
    setDeleting(null);
    refetch();
  }

  const columns = [
    { key: "name", label: "Report", render: (r) => <span className="tag-name">{r.name}</span> },
    { key: "category", label: "Category", render: (r) => <Badge tone="info">{r.category}</Badge> },
    { key: "period", label: "Period" },
    { key: "published", label: "Last published" },
    { key: "status", label: "Status", render: (r) => <Badge>{r.status}</Badge> },
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
    <>
      <FilterBar
        filters={[
          { type: "search", key: "q", placeholder: "Search report catalogue" },
          { type: "select", key: "category", label: "categories", options: CATEGORIES },
        ]}
        values={filters}
        onChange={(key, value) => setFilters((f) => ({ ...f, [key]: value }))}
        actions={can("reports", "create") && <Button size="sm" onClick={() => navigate("/reports/new")}>+ New report</Button>}
      />
      <Card noPadding>
        <DataState loading={loading} error={error} onRetry={refetch} isEmpty={data && data.items.length === 0}>
          {data && <DataTable columns={columns} rows={data.items} onRowClick={(r) => navigate(`/reports/${r.id}`)} />}
        </DataState>
      </Card>
      <ConfirmDialog
        open={!!deleting}
        title={deleting ? `Delete ${deleting.name}?` : ""}
        message="This report will be removed from the catalogue."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
