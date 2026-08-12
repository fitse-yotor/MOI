import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApiGet, useApiAction } from "../../api/hooks.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSnackbar } from "../../context/SnackbarContext.jsx";
import EntityViewPage from "../../components/common/EntityViewPage.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";

export default function ReportViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { can } = useAuth();
  const { notify } = useSnackbar();
  const { data, loading, error, refetch } = useApiGet(`/reports/${id}`);
  const del = useApiAction("del");
  const [confirming, setConfirming] = useState(false);
  const r = data?.item;

  async function handleDelete() {
    await del.run(`/reports/${id}`);
    notify(`${r?.name || id} deleted`, "success");
    navigate("/reports");
  }

  const fields = r
    ? [
        { label: "Authoring Unit", value: r.author || "Ministry Directorate" },
        { label: "Period", value: r.period || "—" },
        { label: "Last published", value: r.published || "—" },
      ]
    : [];

  return (
    <>
      <EntityViewPage
        title={r?.name}
        subtitle="Report catalogue entry"
        backTo="/reports"
        loading={loading}
        error={error}
        onRetry={refetch}
        fields={fields}
        badges={
          r && (
            <>
              <Badge tone={r.type === "statistical" ? "info" : "warn"}>
                {r.type === "statistical" ? "📊 Statistical" : "📝 Non-Statistical"}
              </Badge>
              <Badge tone="muted">{r.category}</Badge>
              <Badge tone={r.status === "Published" ? "success" : "muted"}>{r.status}</Badge>
            </>
          )
        }
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => notify("Downloading official report PDF...", "info")}>Download PDF</Button>
            {can("reports", "edit") && (
              <Button variant="outline" size="sm" onClick={() => navigate(`/reports/${id}/edit`)}>Edit</Button>
            )}
            {can("reports", "delete") && (
              <Button variant="error" size="sm" onClick={() => setConfirming(true)}>Delete</Button>
            )}
          </>
        }
      />
      <ConfirmDialog
        open={confirming}
        title={r ? `Delete ${r.name}?` : ""}
        message="This report will be removed from the catalogue."
        onConfirm={handleDelete}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}
