import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApiGet, useApiAction } from "../../api/hooks.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSnackbar } from "../../context/SnackbarContext.jsx";
import EntityViewPage from "../../components/common/EntityViewPage.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";

export default function UserViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { can } = useAuth();
  const { notify } = useSnackbar();
  const { data, loading, error, refetch } = useApiGet(`/users/${id}`);
  const del = useApiAction("del");
  const [confirming, setConfirming] = useState(false);
  const u = data?.item;

  async function handleDelete() {
    await del.run(`/users/${id}`);
    notify(`${u?.name || id} removed`, "success");
    navigate("/users");
  }

  const fields = u
    ? [
        { label: "Role", value: u.role },
        { label: "Jurisdiction", value: u.jurisdiction },
        { label: "Last login", value: u.lastLogin },
        { label: "Status", value: u.status },
      ]
    : [];

  return (
    <>
      <EntityViewPage
        title={u?.name}
        subtitle="Platform user account"
        backTo="/users"
        loading={loading}
        error={error}
        onRetry={refetch}
        fields={fields}
        badges={u && <Badge>{u.status}</Badge>}
        actions={
          <>
            {can("users", "edit") && (
              <Button variant="outline" size="sm" onClick={() => navigate(`/users/${id}/edit`)}>Manage</Button>
            )}
            {can("users", "delete") && (
              <Button variant="error" size="sm" onClick={() => setConfirming(true)}>Delete</Button>
            )}
          </>
        }
      />
      <ConfirmDialog
        open={confirming}
        title={u ? `Remove ${u.name}?` : ""}
        message="This user will lose access immediately. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}
