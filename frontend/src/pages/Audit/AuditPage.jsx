import { useState } from "react";
import { useApiGet, buildQuery } from "../../api/hooks.js";
import DataTable from "../../components/common/DataTable.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import { Card } from "../../components/common/Card.jsx";
import { DataState } from "../../components/common/StateViews.jsx";

const ACTIONS = ["Login", "Create", "Update", "Approve", "Reject", "ETL Sync"];

export default function AuditPage() {
  const [filters, setFilters] = useState({ q: "", action: "all" });
  const query = buildQuery(filters);
  const { data, loading, error, refetch } = useApiGet(`/audit${query}`, { deps: [query] });

  const columns = [
    { key: "ts", label: "Timestamp", render: (r) => <span className="mono">{r.ts}</span> },
    { key: "user", label: "User" },
    { key: "action", label: "Action" },
    { key: "entity", label: "Entity" },
    { key: "ip", label: "IP address", render: (r) => <span className="mono">{r.ip}</span> },
    { key: "outcome", label: "Outcome", render: (r) => <Badge tone={r.outcome.includes("Success") ? "success" : "error"}>{r.outcome.includes("Success") ? "Success" : "Failed"}</Badge> },
  ];

  return (
    <>
      <div className="toolbar">
        <input
          className="filter-input"
          placeholder="Search by user, entity, action"
          value={filters.q}
          onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
        />
        <select className="filter-select" value={filters.action} onChange={(e) => setFilters((f) => ({ ...f, action: e.target.value }))}>
          <option value="all">All actions</option>
          {ACTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <input className="filter-input" type="date" />
        <div style={{ marginLeft: "auto" }}><Button variant="outline" size="sm">Export CSV</Button></div>
      </div>
      <Card noPadding>
        <DataState loading={loading} error={error} onRetry={refetch} isEmpty={data && data.items.length === 0}>
          {data && <DataTable columns={columns} rows={data.items} rowKey="ts" />}
        </DataState>
      </Card>
    </>
  );
}
