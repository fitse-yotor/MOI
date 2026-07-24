import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApiGet, useApiAction } from "../../api/hooks.js";
import EntityFormPage from "../../components/common/EntityFormPage.jsx";
import { useSnackbar } from "../../context/SnackbarContext.jsx";

const FIELDS = [
  { key: "name", label: "Full name", required: true },
  { key: "role", label: "Role", type: "select", options: ["Federal Administrator", "Regional Approver", "Zone Officer", "Woreda Officer", "Enterprise Manager", "Policy Analyst"] },
  { key: "jurisdiction", label: "Jurisdiction" },
  { key: "status", label: "Status", type: "select", options: ["Active", "Suspended"] },
];

export default function UserFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { notify } = useSnackbar();
  const existing = useApiGet(isEdit ? `/users/${id}` : null, { enabled: isEdit });
  const create = useApiAction("post");
  const update = useApiAction("put");
  const item = existing.data?.item;

  const initialValues = useMemo(() => {
    if (isEdit) return item || {};
    return { role: "Woreda Officer", status: "Active" };
  }, [isEdit, item]);

  async function handleSubmit(values) {
    if (isEdit) {
      await update.run(`/users/${id}`, values);
      notify(`${values.name} updated`, "success");
      navigate(`/users/${id}`);
    } else {
      const res = await create.run("/users", values);
      notify(`${values.name} added as a user`, "success");
      navigate(`/users/${res.item.id}`);
    }
  }

  return (
    <EntityFormPage
      title={isEdit ? `Manage ${item?.name || ""}` : "Create user"}
      subtitle={isEdit ? "Update role, jurisdiction or status" : "Add a new platform user"}
      backTo="/users"
      fields={FIELDS}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      submitLabel={isEdit ? "Save changes" : "Create user"}
      loading={isEdit && existing.loading}
      loadError={isEdit ? existing.error : null}
    />
  );
}
