import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApiGet, useApiAction } from "../../api/hooks.js";
import Tabs from "../../components/common/Tabs.jsx";
import Button from "../../components/common/Button.jsx";
import Badge from "../../components/common/Badge.jsx";
import ProgressBar from "../../components/common/ProgressBar.jsx";
import { DataState } from "../../components/common/StateViews.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSnackbar } from "../../context/SnackbarContext.jsx";
import CampaignCard from "./CampaignCard.jsx";
import BaselineFormPreview from "./BaselineFormPreview.jsx";
import QuestionnaireBuilder from "./QuestionnaireBuilder.jsx";
import NewSurveyWizard from "./NewSurveyWizard.jsx";

const TABS = [
  { key: "campaigns", label: "Active campaigns" },
  { key: "form", label: "NMIS V16 Survey" },
  { key: "builder", label: "Questionnaire builder" },
];

export default function CollectionPage() {
  const { can } = useAuth();
  const navigate = useNavigate();
  const { notify } = useSnackbar();
  const [tab, setTab] = useState("campaigns");
  const [deleting, setDeleting] = useState(null);
  const [showNewWizard, setShowNewWizard] = useState(false);
  const { data, loading, error, refetch } = useApiGet("/collection/campaigns", { enabled: tab === "campaigns" });
  const del = useApiAction("del");

  async function handleDelete() {
    await del.run(`/collection/campaigns/${deleting.id}`);
    notify(`${deleting.name} deleted`, "success");
    setDeleting(null);
    refetch();
  }

  function handleSurveyCreated(newSurvey) {
    setShowNewWizard(false);
    refetch();
  }

  return (
    <>
      <Tabs tabs={TABS} active={tab} onChange={(t) => { setTab(t); setShowNewWizard(false); }} />

      {/* ── CAMPAIGNS TAB ── */}
      {tab === "campaigns" && !showNewWizard && (
        <>
          {/* Campaigns Toolbar */}
          {can("collection", "create") && (
            <div className="toolbar" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 13, color: "var(--text2)" }}>
                {data?.items?.length
                  ? <><strong>{data.items.length}</strong> active survey campaign{data.items.length !== 1 ? "s" : ""} · <strong style={{ color: "var(--primary)" }}>{data.items.filter((c) => c.status === "Open").length}</strong> currently open</>
                  : "No campaigns yet — create your first survey campaign below."
                }
              </div>
              <Button
                size="sm"
                onClick={() => setShowNewWizard(true)}
                style={{
                  background: "linear-gradient(135deg, #0369a1, #0ea5e9)",
                  color: "#fff",
                  border: "none",
                  boxShadow: "0 2px 10px rgba(3, 105, 161, 0.3)",
                }}
              >
                ✚ New Survey Campaign
              </Button>
            </div>
          )}

          {/* Campaign Stats Summary Bar */}
          {data?.items?.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 12,
                marginBottom: 4,
              }}
            >
              {[
                { label: "Total Campaigns", value: data.items.length, icon: "📋", tone: "info" },
                { label: "Open / Active", value: data.items.filter((c) => c.status === "Open").length, icon: "🟢", tone: "success" },
                { label: "Total Responses", value: data.items.reduce((s, c) => s + c.done, 0).toLocaleString(), icon: "📊", tone: "muted" },
                { label: "Target Coverage", value: `${Math.round((data.items.reduce((s, c) => s + c.done, 0) / data.items.reduce((s, c) => s + c.target, 0)) * 100)}%`, icon: "🎯", tone: "muted" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: "var(--card)",
                    padding: "12px 16px",
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-sm)",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: 22 }}>{stat.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text2)", fontWeight: 600 }}>{stat.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "var(--text)" }}>{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <DataState loading={loading} error={error} onRetry={refetch} isEmpty={data && data.items.length === 0}
            emptyMessage={
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: 52, marginBottom: 12 }}>📋</div>
                <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 6 }}>No survey campaigns yet</div>
                <div style={{ color: "var(--text2)", fontSize: 13.5, marginBottom: 20, maxWidth: 380, margin: "0 auto 20px" }}>
                  Create your first NMIS survey campaign to start collecting data from establishments across Ethiopia.
                </div>
                {can("collection", "create") && (
                  <Button
                    size="sm"
                    onClick={() => setShowNewWizard(true)}
                    style={{ background: "linear-gradient(135deg, #0369a1, #0ea5e9)", color: "#fff", border: "none" }}
                  >
                    ✚ Create First Survey Campaign
                  </Button>
                )}
              </div>
            }
          >
            <div className="grid g3">
              {(data?.items || []).map((c) => (
                <CampaignCard campaign={c} key={c.id} onDelete={setDeleting} />
              ))}
            </div>
          </DataState>
        </>
      )}

      {/* ── NEW SURVEY WIZARD (inline) ── */}
      {tab === "campaigns" && showNewWizard && (
        <div style={{ marginTop: 8 }}>
          <NewSurveyWizard
            onCancel={() => setShowNewWizard(false)}
            onCreated={handleSurveyCreated}
          />
        </div>
      )}

      {tab === "form" && <BaselineFormPreview />}
      {tab === "builder" && <QuestionnaireBuilder />}

      <ConfirmDialog
        open={!!deleting}
        title={deleting ? `Delete ${deleting.name}?` : ""}
        message="This campaign and its collection progress will be permanently deleted."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
