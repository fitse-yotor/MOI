import { useState } from "react";
import { useApiGet, useApiAction } from "../../api/hooks.js";
import Tabs from "../../components/common/Tabs.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import { Card } from "../../components/common/Card.jsx";
import { DataState } from "../../components/common/StateViews.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSnackbar } from "../../context/SnackbarContext.jsx";

const TABS = [
  { key: "queue", label: "My queue" },
  { key: "returned", label: "Needs correction" },
  { key: "history", label: "Decision history" },
];

// Mirrors backend/src/workflow/reviewWorkflow.js — the API is the source of
// truth (it 403s otherwise); this only controls whether the row's action
// buttons are worth showing for the signed-in reviewer's level.
const ROLE_FOR_LEVEL = { Woreda: "woreda", Zonal: "regional", Regional: "regional", Federal: "federal" };
function canDecideAtLevel(roleId, level) {
  return roleId === "federal" || ROLE_FOR_LEVEL[level] === roleId;
}

export default function ReviewPage() {
  const { can, user } = useAuth();
  const [tab, setTab] = useState("queue");
  const { notify } = useSnackbar();
  const { run } = useApiAction("post");
  const queue = useApiGet("/review/queue", { enabled: tab === "queue" });
  const returned = useApiGet("/review/returned", { enabled: tab === "returned" });
  const history = useApiGet("/review/history", { enabled: tab === "history" });

  async function decide(id, decision) {
    try {
      await run(`/review/submissions/${id}/decision`, { decision });
      notify(`${id} ${decision.toLowerCase()}`, decision === "Rejected" ? "error" : "success");
      queue.refetch();
    } catch (err) {
      notify(err.message, "error");
    }
  }

  async function resubmit(id) {
    try {
      await run(`/review/submissions/${id}/resubmit`);
      notify(`${id} resubmitted for review`, "success");
      returned.refetch();
    } catch (err) {
      notify(err.message, "error");
    }
  }

  const queueColumns = [
    { key: "id", label: "Submission", render: (r) => <span className="mono">{r.id}</span> },
    { key: "enterprise", label: "Enterprise", render: (r) => <span className="tag-name">{r.enterprise}</span> },
    { key: "campaign", label: "Campaign" },
    { key: "submitted", label: "Submitted" },
    { key: "level", label: "Level", render: (r) => <Badge tone="info">{r.level}</Badge> },
    { key: "flags", label: "Quality flags", render: (r) => (r.flags > 0 ? <Badge tone="warn">{r.flags} flags</Badge> : <Badge tone="success">Clean</Badge>) },
    {
      key: "actions",
      label: "",
      render: (r) =>
        can("review", "approve") && canDecideAtLevel(user?.role?.id, r.level) ? (
          <div style={{ display: "flex", gap: 6 }}>
            <Button variant="success" size="sm" onClick={() => decide(r.id, "Approved")}>Approve</Button>
            <Button variant="outline" size="sm" onClick={() => decide(r.id, "Returned")}>Return</Button>
            <Button variant="error" size="sm" onClick={() => decide(r.id, "Rejected")}>Reject</Button>
          </div>
        ) : (
          <span className="muted" style={{ fontSize: 11.5 }}>Awaiting {r.level} review</span>
        ),
    },
  ];

  const returnedColumns = [
    { key: "id", label: "Submission", render: (r) => <span className="mono">{r.id}</span> },
    { key: "enterprise", label: "Enterprise", render: (r) => <span className="tag-name">{r.enterprise}</span> },
    { key: "campaign", label: "Campaign" },
    { key: "level", label: "Returned at", render: (r) => <Badge tone="warn">{r.level}</Badge> },
    { key: "reason", label: "Reason", render: (r) => <span className="muted">{r.history[r.history.length - 1]?.reason}</span> },
    { key: "actions", label: "", render: (r) => <Button size="sm" onClick={() => resubmit(r.id)}>Resubmit</Button> },
  ];

  const historyColumns = [
    { key: "id", label: "Submission", render: (r) => <span className="mono">{r.id}</span> },
    { key: "enterprise", label: "Enterprise", render: (r) => <span className="tag-name">{r.enterprise}</span> },
    { key: "decision", label: "Decision", render: (r) => <Badge>{r.decision}</Badge> },
    { key: "by", label: "By" },
    { key: "date", label: "Date" },
    { key: "reason", label: "Reason", render: (r) => <span className="muted">{r.reason || "—"}</span> },
  ];

  const active = tab === "queue" ? queue : tab === "returned" ? returned : history;
  const columns = tab === "queue" ? queueColumns : tab === "returned" ? returnedColumns : historyColumns;
  const labeled = TABS.map((t) => {
    const counts = { queue: queue.data?.items.length, returned: returned.data?.items.length };
    const count = counts[t.key];
    return { ...t, label: count !== undefined ? `${t.label} (${count})` : t.label };
  });

  return (
    <>
      <Tabs tabs={labeled} active={tab} onChange={setTab} />
      <Card noPadding>
        <DataState loading={active.loading} error={active.error} onRetry={active.refetch} isEmpty={active.data && active.data.items.length === 0}>
          {active.data && <DataTable columns={columns} rows={active.data.items} />}
        </DataState>
      </Card>
    </>
  );
}
