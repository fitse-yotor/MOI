import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApiGet, useApiAction } from "../../api/hooks.js";
import EntityFormPage from "../../components/common/EntityFormPage.jsx";
import { useSnackbar } from "../../context/SnackbarContext.jsx";

const FIELDS = [
  { key: "name", label: "Campaign name", required: true },
  { key: "period", label: "Period", required: true },
  { key: "target", label: "Target enterprises", type: "number" },
  { key: "status", label: "Status", type: "select", options: ["Scheduled", "Open", "Closed"] },
];

export default function CampaignFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { notify } = useSnackbar();
  const existing = useApiGet(isEdit ? `/collection/campaigns/${id}` : null, { enabled: isEdit });
  const create = useApiAction("post");
  const update = useApiAction("put");
  const item = existing.data?.item;

  const initialValues = useMemo(() => {
    if (isEdit) return item || {};
    return { status: "Scheduled" };
  }, [isEdit, item]);

  async function handleSubmit(values) {
    if (isEdit) {
      await update.run(`/collection/campaigns/${id}`, values);
      notify(`${values.name} updated`, "success");
      navigate(`/collection/campaigns/${id}`);
    } else {
      const res = await create.run("/collection/campaigns", values);
      notify(`${values.name} created`, "success");
      navigate(`/collection/campaigns/${res.item.id}`);
    }
  }

  return (
    <EntityFormPage
      title={isEdit ? `Manage ${item?.name || ""}` : "New campaign"}
      subtitle={isEdit ? "Update campaign settings" : "Launch a new data-collection campaign"}
      backTo="/collection"
      fields={FIELDS}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      submitLabel={isEdit ? "Save changes" : "Create campaign"}
      loading={isEdit && existing.loading}
      loadError={isEdit ? existing.error : null}
    />
  );
}
