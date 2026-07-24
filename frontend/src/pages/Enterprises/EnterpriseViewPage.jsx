import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApiGet, useApiAction } from "../../api/hooks.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSnackbar } from "../../context/SnackbarContext.jsx";
import EntityViewPage from "../../components/common/EntityViewPage.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";

export default function EnterpriseViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { can } = useAuth();
  const { notify } = useSnackbar();
  const { data, loading, error, refetch } = useApiGet(`/enterprises/${id}`);
  const del = useApiAction("del");
  const [confirming, setConfirming] = useState(false);
  const e = data?.item;

  async function handleDelete() {
    await del.run(`/enterprises/${id}`);
    notify(`${e?.name || id} removed from the registry`, "success");
    navigate("/enterprises");
  }

  const fields = e
    ? [
        { label: "Trade name", value: e.tradeName },
        { label: "TIN", value: e.tin },
        { label: "Sector / Subsector", value: `${e.sector} / ${e.subsector}` },
        { label: "ISIC code", value: e.isic },
        { label: "Region / Zone", value: `${e.region} / ${e.zone}` },
        { label: "Size", value: e.size },
        { label: "Ownership", value: e.ownership },
        { label: "Industrial park", value: e.industrialPark },
        { label: "Employees", value: e.employees },
        { label: "Capacity utilization", value: `${e.capacityUtilization}%` },
        { label: "Manager", value: e.manager },
        { label: "Phone", value: e.phone },
        { label: "Coordinates", value: `${e.lat}, ${e.lng}` },
        { label: "Established", value: e.establishedYear },
      ]
    : [];

  return (
    <>
      <EntityViewPage
        title={e?.name}
        subtitle={e ? `TIN ${e.tin} · Registered ${e.establishedYear}` : ""}
        backTo="/enterprises"
        loading={loading}
        error={error}
        onRetry={refetch}
        fields={fields}
        badges={
          e && (
            <>
              <Badge>{e.status}</Badge>
              <Badge tone="info">{e.size} enterprise</Badge>
              <Badge tone="muted">{e.exportStatus}</Badge>
            </>
          )
        }
        actions={
          <>
            {can("enterprises", "edit") && (
              <Button variant="outline" size="sm" onClick={() => navigate(`/enterprises/${id}/edit`)}>Edit</Button>
            )}
            {can("enterprises", "delete") && (
              <Button variant="error" size="sm" onClick={() => setConfirming(true)}>Delete</Button>
            )}
          </>
        }
      />
      <ConfirmDialog
        open={confirming}
        title={e ? `Remove ${e.name}?` : ""}
        message="This permanently removes the enterprise from the registry. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}
