import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApiGet, useApiAction } from "../../api/hooks.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSnackbar } from "../../context/SnackbarContext.jsx";
import EntityViewPage from "../../components/common/EntityViewPage.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import ProgressBar from "../../components/common/ProgressBar.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";

export default function CampaignViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { can } = useAuth();
  const { notify } = useSnackbar();
  const { data, loading, error, refetch } = useApiGet(`/collection/campaigns/${id}`);
  const del = useApiAction("del");
  const [confirming, setConfirming] = useState(false);
  const c = data?.item;
  const pct = c ? Math.round((c.done / c.target) * 100) : 0;

  async function handleDelete() {
    await del.run(`/collection/campaigns/${id}`);
    notify(`${c?.name || id} deleted`, "success");
    navigate("/collection");
  }

  const fields = c
    ? [
        { label: "Period", value: c.period },
        { label: "Target enterprises", value: c.target.toLocaleString() },
        { label: "Completed", value: c.done.toLocaleString() },
        { label: "Completion", value: `${pct}%` },
      ]
    : [];

  return (
    <>
      <EntityViewPage
        title={c?.name}
        subtitle="Data-collection campaign"
        backTo="/collection"
        loading={loading}
        error={error}
        onRetry={refetch}
        fields={fields}
        badges={c && <Badge>{c.status}</Badge>}
        actions={
          <>
            {can("collection", "edit") && (
              <Button variant="outline" size="sm" onClick={() => navigate(`/collection/campaigns/${id}/edit`)}>Manage</Button>
            )}
            {can("collection", "delete") && (
              <Button variant="error" size="sm" onClick={() => setConfirming(true)}>Delete</Button>
            )}
          </>
        }
      >
        {c && <div style={{ marginTop: 6 }}><ProgressBar pct={pct} /></div>}
      </EntityViewPage>
      <ConfirmDialog
        open={confirming}
        title={c ? `Delete ${c.name}?` : ""}
        message="This campaign and its collection progress will be permanently deleted."
        onConfirm={handleDelete}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}
