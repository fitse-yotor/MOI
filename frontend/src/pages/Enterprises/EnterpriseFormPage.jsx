import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApiGet, useApiAction } from "../../api/hooks.js";
import EntityFormPage from "../../components/common/EntityFormPage.jsx";
import { useSnackbar } from "../../context/SnackbarContext.jsx";

function fieldsFor(masterData) {
  return [
    { key: "name", label: "Legal name", required: true },
    { key: "tradeName", label: "Trade name" },
    { key: "tin", label: "TIN" },
    { key: "sector", label: "Sector", type: "select", options: masterData.sectors },
    { key: "region", label: "Region", type: "select", options: masterData.regions },
    { key: "size", label: "Size", type: "select", options: masterData.sizes },
    { key: "status", label: "Status", type: "select", options: masterData.statuses },
    { key: "employees", label: "Employees", type: "number" },
    { key: "manager", label: "Manager" },
    { key: "phone", label: "Phone" },
  ];
}

export default function EnterpriseFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { notify } = useSnackbar();
  const list = useApiGet("/enterprises");
  const existing = useApiGet(isEdit ? `/enterprises/${id}` : null, { enabled: isEdit });
  const create = useApiAction("post");
  const update = useApiAction("put");

  const masterData = list.data?.filters || { regions: [], sectors: [], sizes: [], statuses: [] };
  const item = existing.data?.item;

  const initialValues = useMemo(() => {
    if (isEdit) return item || {};
    return { size: masterData.sizes[0], sector: masterData.sectors[0], region: masterData.regions[0], status: "Pending verification" };
  }, [isEdit, item, masterData.sizes[0], masterData.sectors[0], masterData.regions[0]]);

  async function handleSubmit(values) {
    if (isEdit) {
      await update.run(`/enterprises/${id}`, values);
      notify(`${values.name} updated`, "success");
      navigate(`/enterprises/${id}`);
    } else {
      const res = await create.run("/enterprises", values);
      notify(`${values.name} registered`, "success");
      navigate(`/enterprises/${res.item.id}`);
    }
  }

  return (
    <EntityFormPage
      title={isEdit ? `Edit ${item?.name || ""}` : "Register enterprise"}
      subtitle={isEdit ? "Update enterprise profile" : "Create a new enterprise registry record"}
      backTo="/enterprises"
      fields={fieldsFor(masterData)}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      submitLabel={isEdit ? "Save changes" : "Register"}
      loading={isEdit && existing.loading}
      loadError={isEdit ? existing.error : null}
    />
  );
}
