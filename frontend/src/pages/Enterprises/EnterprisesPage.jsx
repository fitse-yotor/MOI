import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApiGet, useApiAction, buildQuery } from "../../api/hooks.js";
import FilterBar from "../../components/common/FilterBar.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import { Card, CardHead } from "../../components/common/Card.jsx";
import { DataState } from "../../components/common/StateViews.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSnackbar } from "../../context/SnackbarContext.jsx";

export default function EnterprisesPage() {
  const { can } = useAuth();
  const navigate = useNavigate();
  const { notify } = useSnackbar();
  const [filters, setFilters] = useState({ q: "", region: "all", sector: "all", size: "all", status: "all" });
  const [deleting, setDeleting] = useState(null);
  const query = buildQuery(filters);
  const { data, loading, error, refetch } = useApiGet(`/enterprises${query}`, { deps: [query] });
  const del = useApiAction("del");

  const masterData = data?.filters || { regions: [], sectors: [], sizes: [], statuses: [] };

  async function handleDelete() {
    await del.run(`/enterprises/${deleting.id}`);
    notify(`${deleting.name} removed from the registry`, "success");
    setDeleting(null);
    refetch();
  }

  const columns = [
    {
      key: "name",
      label: "Enterprise",
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="avatar-sm">{row.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
          <div>
            <div className="tag-name">{row.name}</div>
            <div className="tag-sub">{row.region}</div>
          </div>
        </div>
      ),
    },
    { key: "tin", label: "TIN", render: (r) => <span className="mono">{r.tin}</span> },
    { key: "sector", label: "Sector" },
    { key: "region", label: "Region" },
    { key: "size", label: "Size" },
    { key: "employees", label: "Employees", render: (r) => <span className="mono">{r.employees}</span> },
    { key: "status", label: "Status", render: (r) => <Badge>{r.status}</Badge> },
    {
      key: "actions",
      label: "",
      render: (r) => (
        <div style={{ display: "flex", gap: 6 }}>
          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/enterprises/${r.id}`); }}>View</Button>
          {can("enterprises", "edit") && (
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/enterprises/${r.id}/edit`); }}>Edit</Button>
          )}
          {can("enterprises", "delete") && (
            <Button variant="error" size="sm" onClick={(e) => { e.stopPropagation(); setDeleting(r); }}>Delete</Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <FilterBar
        filters={[
          { type: "search", key: "q", placeholder: "Search name, TIN, license no." },
          { type: "select", key: "region", label: "regions", options: masterData.regions },
          { type: "select", key: "sector", label: "sectors", options: masterData.sectors },
          { type: "select", key: "size", label: "sizes", options: masterData.sizes },
          { type: "select", key: "status", label: "status", allLabel: "Any status", options: masterData.statuses },
        ]}
        values={filters}
        onChange={(key, value) => setFilters((f) => ({ ...f, [key]: value }))}
        actions={
          <>
            <Button variant="outline" size="sm">Export list</Button>
            {can("enterprises", "create") && <Button size="sm" onClick={() => navigate("/enterprises/new")}>Register enterprise</Button>}
          </>
        }
      />
      <Card noPadding>
        <div style={{ padding: "16px 18px 0" }}>
          <CardHead title="Enterprise Registry" subtitle={`${data?.total?.toLocaleString() || "…"} records · showing ${data?.count ?? 0}`} />
        </div>
        <DataState loading={loading} error={error} onRetry={refetch} isEmpty={data && data.items.length === 0}>
          {data && <DataTable columns={columns} rows={data.items} onRowClick={(r) => navigate(`/enterprises/${r.id}`)} />}
        </DataState>
      </Card>
      <ConfirmDialog
        open={!!deleting}
        title={deleting ? `Remove ${deleting.name}?` : ""}
        message="This permanently removes the enterprise from the registry. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
