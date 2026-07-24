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

const ROLES = ["Federal", "Regional", "Woreda", "Enterprise"];

export default function UsersPage() {
  const { can } = useAuth();
  const navigate = useNavigate();
  const { notify } = useSnackbar();
  const [filters, setFilters] = useState({ q: "", role: "all" });
  const [deleting, setDeleting] = useState(null);
  const query = buildQuery(filters);
  const { data, loading, error, refetch } = useApiGet(`/users${query}`, { deps: [query] });
  const del = useApiAction("del");

  async function handleDelete() {
    await del.run(`/users/${deleting.id}`);
    notify(`${deleting.name} removed`, "success");
    setDeleting(null);
    refetch();
  }

  const columns = [
    {
      key: "name",
      label: "User",
      render: (r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="avatar-sm">{r.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
          <span className="tag-name">{r.name}</span>
        </div>
      ),
    },
    { key: "role", label: "Role" },
    { key: "jurisdiction", label: "Jurisdiction" },
    { key: "lastLogin", label: "Last login" },
    { key: "status", label: "Status", render: (r) => <Badge>{r.status}</Badge> },
    {
      key: "actions",
      label: "",
      render: (r) => (
        <div style={{ display: "flex", gap: 6 }}>
          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/users/${r.id}`); }}>View</Button>
          {can("users", "edit") && <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/users/${r.id}/edit`); }}>Manage</Button>}
          {can("users", "delete") && <Button variant="error" size="sm" onClick={(e) => { e.stopPropagation(); setDeleting(r); }}>Delete</Button>}
        </div>
      ),
    },
  ];

  return (
    <>
      <FilterBar
        filters={[
          { type: "search", key: "q", placeholder: "Search users" },
          { type: "select", key: "role", label: "roles", options: ROLES },
        ]}
        values={filters}
        onChange={(key, value) => setFilters((f) => ({ ...f, [key]: value }))}
        actions={can("users", "create") && <Button size="sm" onClick={() => navigate("/users/new")}>+ Create user</Button>}
      />
      <Card noPadding>
        <DataState loading={loading} error={error} onRetry={refetch} isEmpty={data && data.items.length === 0}>
          {data && <DataTable columns={columns} rows={data.items} onRowClick={(r) => navigate(`/users/${r.id}`)} />}
        </DataState>
      </Card>
      <ConfirmDialog
        open={!!deleting}
        title={deleting ? `Remove ${deleting.name}?` : ""}
        message="This user will lose access immediately. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
