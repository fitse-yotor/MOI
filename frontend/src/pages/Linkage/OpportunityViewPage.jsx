import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApiGet, useApiAction } from "../../api/hooks.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSnackbar } from "../../context/SnackbarContext.jsx";
import EntityViewPage from "../../components/common/EntityViewPage.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";

export default function OpportunityViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { can } = useAuth();
  const { notify } = useSnackbar();
  const { data, loading, error, refetch } = useApiGet(`/linkage/opportunities/${id}`);
  const del = useApiAction("del");
  const [confirming, setConfirming] = useState(false);
  const o = data?.item;

  async function handleDelete() {
    await del.run(`/linkage/opportunities/${id}`);
    notify(`${o?.title || id} removed`, "success");
    navigate("/linkage");
  }

  const fields = o
    ? [
        { label: "Description", value: o.body },
        { label: "Region", value: o.region },
        { label: "Views", value: o.views },
        { label: "Expires", value: o.expires },
      ]
    : [];

  return (
    <>
      <EntityViewPage
        title={o?.title}
        subtitle="Market opportunity"
        backTo="/linkage"
        loading={loading}
        error={error}
        onRetry={refetch}
        fields={fields}
        badges={o && <Badge tone="info">{o.category}</Badge>}
        actions={
          <>
            {can("linkage", "edit") && (
              <Button variant="outline" size="sm" onClick={() => navigate(`/linkage/opportunities/${id}/edit`)}>Edit</Button>
            )}
            {can("linkage", "delete") && (
              <Button variant="error" size="sm" onClick={() => setConfirming(true)}>Delete</Button>
            )}
          </>
        }
      />
      <ConfirmDialog
        open={confirming}
        title={o ? `Remove ${o.title}?` : ""}
        message="This opportunity will no longer be visible to enterprises."
        onConfirm={handleDelete}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}
