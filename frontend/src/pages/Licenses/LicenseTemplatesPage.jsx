import { useNavigate } from "react-router-dom";
import { useApiGet } from "../../api/hooks.js";
import DataTable from "../../components/common/DataTable.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import { Card, CardHead } from "../../components/common/Card.jsx";
import { DataState } from "../../components/common/StateViews.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function LicenseTemplatesPage() {
  const { can } = useAuth();
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useApiGet("/licenses/templates");

  const columns = [
    {
      key: "name",
      label: "Template",
      render: (r) => (
        <div>
          <div className="tag-name">{r.name}</div>
          <div className="tag-sub mono">{r.code}</div>
        </div>
      ),
    },
    { key: "category", label: "Category" },
    { key: "feeETB", label: "Fee", render: (r) => <span className="mono">{r.feeETB > 0 ? `ETB ${r.feeETB.toLocaleString()}` : "Free"}</span> },
    { key: "validityMonths", label: "Validity", render: (r) => `${r.validityMonths} mo` },
    { key: "status", label: "Status", render: (r) => <Badge>{r.status}</Badge> },
    {
      key: "actions",
      label: "",
      render: (r) => (
        can("licenses", "edit") && (
          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/licenses/templates/${r.id}/edit`); }}>Edit</Button>
        )
      ),
    },
  ];

  return (
    <Card noPadding>
      <div style={{ padding: "16px 18px 0" }}>
        <CardHead
          title="License Templates"
          subtitle="Certificate templates used when issuing licenses"
          action={can("licenses", "create") && <Button size="sm" onClick={() => navigate("/licenses/templates/new")}>New template</Button>}
        />
      </div>
      <DataState loading={loading} error={error} onRetry={refetch} isEmpty={data && data.items.length === 0}>
        {data && <DataTable columns={columns} rows={data.items} onRowClick={(r) => can("licenses", "edit") && navigate(`/licenses/templates/${r.id}/edit`)} />}
      </DataState>
    </Card>
  );
}
