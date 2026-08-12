import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApiGet, buildQuery } from "../../api/hooks.js";
import FilterBar from "../../components/common/FilterBar.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import { Card, CardHead } from "../../components/common/Card.jsx";
import { DataState } from "../../components/common/StateViews.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const STATUSES = [
  "Submitted", "Rejected", "Payment due", "Payment confirmed", "Active",
  "Renewal submitted", "Renewal payment due", "Renewal payment confirmed",
  "Expired", "Closed", "Revoked",
];

export default function LicensesPage() {
  const { can, user } = useAuth();
  const isEnterprise = user?.role?.id === "enterprise";
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ q: "", status: "all", category: "all" });
  const query = buildQuery(filters);
  const { data, loading, error, refetch } = useApiGet(`/licenses${query}`, { deps: [query] });

  const templates = data?.templates || [];
  const categories = [...new Set(templates.map((t) => t.category))];

  const columns = [
    {
      key: "licenseNumber",
      label: "Certificate",
      render: (r) => (
        <div>
          <div className="tag-name mono">{r.licenseNumber}</div>
          <div className="tag-sub">{r.templateName}</div>
        </div>
      ),
    },
    { key: "enterpriseName", label: "Enterprise" },
    { key: "category", label: "Category" },
    { key: "issueDate", label: "Issued", render: (r) => r.issueDate || "—" },
    { key: "expiryDate", label: "Expires", render: (r) => r.expiryDate || "—" },
    { key: "feeETB", label: "Fee", render: (r) => <span className="mono">ETB {r.feeETB.toLocaleString()}</span> },
    { key: "status", label: "Status", render: (r) => <Badge>{r.status}</Badge> },
    {
      key: "actions",
      label: "",
      render: (r) => (
        <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/licenses/${r.id}`); }}>
          View
        </Button>
      ),
    },
  ];

  return (
    <>
      <FilterBar
        filters={[
          { type: "search", key: "q", placeholder: "Search enterprise, certificate no." },
          { type: "select", key: "status", label: "status", allLabel: "Any status", options: STATUSES },
          { type: "select", key: "category", label: "categories", allLabel: "Any category", options: categories },
        ]}
        values={filters}
        onChange={(key, value) => setFilters((f) => ({ ...f, [key]: value }))}
        actions={
          (isEnterprise || can("licenses", "create")) && (
            <Button size="sm" onClick={() => navigate("/licenses/issue")}>
              {isEnterprise ? "Apply for a license" : "New application"}
            </Button>
          )
        }
      />
      <Card noPadding>
        <div style={{ padding: "16px 18px 0" }}>
          <CardHead title="Licenses & Certificates" subtitle={`Showing ${data?.count ?? 0} records`} />
        </div>
        <DataState loading={loading} error={error} onRetry={refetch} isEmpty={data && data.items.length === 0} emptyMessage="No licenses issued yet.">
          {data && <DataTable columns={columns} rows={data.items} onRowClick={(r) => navigate(`/licenses/${r.id}`)} />}
        </DataState>
      </Card>
    </>
  );
}
