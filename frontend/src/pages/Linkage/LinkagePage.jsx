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
  { key: "opps", label: "Market Opportunities" },
  { key: "fdi", label: "🌐 FDI Investor Matches" },
  { key: "requests", label: "Linkage Requests" },
];

const STATUS_TONE = {
  APPROVED: "success",
  OPERATIONAL: "success",
  LICENSED: "info",
  UNDER_CONSTRUCTION: "warn",
};

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
  const fdi = useApiGet("/integrations/enriched/fdi-opportunities", { enabled: tab === "fdi" });
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

      {/* ── Market Opportunities Tab ── */}
      {tab === "opps" && (
        <>
          <div className="toolbar">
            <select className="filter-select"><option>All types</option></select>
            <select className="filter-select"><option>All sectors</option></select>
            {can("linkage", "create") && (
              <div style={{ marginLeft: "auto" }}>
                <Button size="sm" onClick={() => navigate("/linkage/opportunities/new")}>+ Post opportunity</Button>
              </div>
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

      {/* ── FDI Investor Matches Tab ── */}
      {tab === "fdi" && (
        <DataState loading={fdi.loading} error={fdi.error} onRetry={fdi.refetch} isEmpty={fdi.data && fdi.data.items?.length === 0}>
          <div style={{ marginBottom: 12, padding: "10px 14px", background: "#f0f9ff", borderRadius: 8, border: "1px solid #bae6fd", fontSize: 12.5, color: "#0369a1" }}>
            <strong>🌐 EIC FDI Portal Integration</strong> — Foreign direct investment approvals sourced live from the Ethiopian Investment Commission gateway. Match investors to your park or sector to explore partnership opportunities.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 18 }}>
            {(fdi.data?.items || []).map((inv) => (
              <div key={inv.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid var(--border)", padding: 20, display: "flex", flexDirection: "column", gap: 14, boxShadow: "var(--shadow-sm)" }}>
                {/* Header */}
                <div className="flexbtw">
                  <span className={`badge ${STATUS_TONE[inv.status] || "muted"}`}>{inv.status.replace(/_/g, " ")}</span>
                  <span className="badge info" style={{ fontSize: 10.5 }}>EIC FDI Portal</span>
                </div>

                {/* Company */}
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "var(--primary-dark)", marginBottom: 4 }}>{inv.companyName}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)", fontWeight: 600 }}>
                    🌍 {inv.homeCountry} · 🏭 {inv.sector}
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "12px 14px", background: "#f0f9ff", borderRadius: 8, fontSize: 12 }}>
                  <div>
                    <div style={{ color: "var(--text2)", marginBottom: 2 }}>Approved Capital</div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: "#059669" }}>
                      ${(inv.capitalUsd / 1_000_000).toFixed(1)}M USD
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "var(--text2)", marginBottom: 2 }}>Allocated Park</div>
                    <div style={{ fontWeight: 700, fontSize: 12.5, color: "var(--primary)" }}>{inv.parkName}</div>
                  </div>
                </div>

                {/* Reference ID */}
                <div style={{ fontSize: 11, fontFamily: "IBM Plex Mono, monospace", color: "var(--text2)", background: "#f8fafc", padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)" }}>
                  Ref: {inv.investmentId}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  style={{ width: "100%" }}
                  onClick={() => notify(`Linkage request sent to ${inv.companyName}`, "success")}
                >
                  Request Investment Linkage →
                </Button>
              </div>
            ))}
          </div>
        </DataState>
      )}

      {/* ── Linkage Requests Tab ── */}
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
