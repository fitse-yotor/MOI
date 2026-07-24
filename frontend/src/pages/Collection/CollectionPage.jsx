import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApiGet, useApiAction } from "../../api/hooks.js";
import Tabs from "../../components/common/Tabs.jsx";
import Button from "../../components/common/Button.jsx";
import { DataState } from "../../components/common/StateViews.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSnackbar } from "../../context/SnackbarContext.jsx";
import CampaignCard from "./CampaignCard.jsx";
import BaselineFormPreview from "./BaselineFormPreview.jsx";
import QuestionnaireBuilder from "./QuestionnaireBuilder.jsx";

const TABS = [
  { key: "campaigns", label: "Active campaigns" },
  { key: "form", label: "Baseline form preview" },
  { key: "builder", label: "Questionnaire builder" },
];

export default function CollectionPage() {
  const { can } = useAuth();
  const navigate = useNavigate();
  const { notify } = useSnackbar();
  const [tab, setTab] = useState("campaigns");
  const [deleting, setDeleting] = useState(null);
  const { data, loading, error, refetch } = useApiGet("/collection/campaigns", { enabled: tab === "campaigns" });
  const del = useApiAction("del");

  async function handleDelete() {
    await del.run(`/collection/campaigns/${deleting.id}`);
    notify(`${deleting.name} deleted`, "success");
    setDeleting(null);
    refetch();
  }

  return (
    <>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {tab === "campaigns" && (
        <>
          {can("collection", "create") && (
            <div className="toolbar" style={{ justifyContent: "flex-end" }}>
              <Button size="sm" onClick={() => navigate("/collection/campaigns/new")}>+ New campaign</Button>
            </div>
          )}
          <DataState loading={loading} error={error} onRetry={refetch} isEmpty={data && data.items.length === 0}>
            <div className="grid g3">
              {(data?.items || []).map((c) => (
                <CampaignCard campaign={c} key={c.id} onDelete={setDeleting} />
              ))}
            </div>
          </DataState>
        </>
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
