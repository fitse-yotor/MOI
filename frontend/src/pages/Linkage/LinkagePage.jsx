import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApiGet, useApiAction } from "../../api/hooks.js";
import Tabs from "../../components/common/Tabs.jsx";
import Button from "../../components/common/Button.jsx";
import Badge from "../../components/common/Badge.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import { Card } from "../../components/common/Card.jsx";
import { DataState } from "../../components/common/StateViews.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSnackbar } from "../../context/SnackbarContext.jsx";
import OpportunityCard from "./OpportunityCard.jsx";

const TABS = [
  { key: "opps", label: "Market opportunities" },
  { key: "requests", label: "Linkage requests" },
];

const requestColumns = [
  { key: "from", label: "From", render: (r) => <span className="tag-name">{r.from}</span> },
  { key: "to", label: "To", render: (r) => <span className="tag-name">{r.to}</span> },
  { key: "type", label: "Type", render: (r) => <Badge tone="info">{r.type}</Badge> },
  { key: "status", label: "Status", render: (r) => <Badge>{r.status}</Badge> },
  { key: "sent", label: "Sent" },
  { key: "actions", label: "", render: () => <Button variant="outline" size="sm">View</Button> },
];

export default function LinkagePage() {
  const { can } = useAuth();
  const navigate = useNavigate();
  const { notify } = useSnackbar();
  const [tab, setTab] = useState("opps");
  const [deleting, setDeleting] = useState(null);
  const opps = useApiGet("/linkage/opportunities", { enabled: tab === "opps" });
  const requests = useApiGet("/linkage/requests", { enabled: tab === "requests" });
  const del = useApiAction("del");

  async function handleDelete() {
    await del.run(`/linkage/opportunities/${deleting.id}`);
    notify(`${deleting.title} removed`, "success");
    setDeleting(null);
    opps.refetch();
  }

  return (
    <>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {tab === "opps" && (
        <>
          <div className="toolbar">
            <select className="filter-select"><option>All types</option></select>
            <select className="filter-select"><option>All sectors</option></select>
            {can("linkage", "create") && (
              <div style={{ marginLeft: "auto" }}><Button size="sm" onClick={() => navigate("/linkage/opportunities/new")}>+ Post opportunity</Button></div>
            )}
          </div>
          <DataState loading={opps.loading} error={opps.error} onRetry={opps.refetch} isEmpty={opps.data && opps.data.items.length === 0}>
            <div className="grid g3">
              {(opps.data?.items || []).map((o) => (
                <OpportunityCard opp={o} key={o.id} onDelete={setDeleting} />
              ))}
            </div>
          </DataState>
        </>
      )}
      {tab === "requests" && (
        <Card noPadding>
          <DataState loading={requests.loading} error={requests.error} onRetry={requests.refetch} isEmpty={requests.data && requests.data.items.length === 0}>
            {requests.data && <DataTable columns={requestColumns} rows={requests.data.items} rowKey="from" />}
          </DataState>
        </Card>
      )}
      <ConfirmDialog
        open={!!deleting}
        title={deleting ? `Remove ${deleting.title}?` : ""}
        message="This opportunity will no longer be visible to enterprises."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
