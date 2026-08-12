import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApiGet, useApiAction } from "../../api/hooks.js";
import EntityFormPage from "../../components/common/EntityFormPage.jsx";
import { useSnackbar } from "../../context/SnackbarContext.jsx";

const CATEGORIES = ["Employment", "Production", "Trade", "Investment", "Registry", "Benchmark", "Data quality", "Compliance", "Policy Brief", "Administrative"];

const TYPES = [
  { value: "statistical", label: "Statistical Report" },
  { value: "non_statistical", label: "Non-Statistical Report" },
];

const FIELDS = [
  { key: "name", label: "Report Title", required: true },
  { key: "type", label: "Reporting Type", type: "select", options: TYPES },
  { key: "category", label: "Category", type: "select", options: CATEGORIES },
  { key: "period", label: "Period (e.g. Q2 2026)" },
  { key: "author", label: "Authoring Unit / Department" },
  { key: "status", label: "Status", type: "select", options: ["Draft", "In review", "Published"] },
];

export default function ReportFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { notify } = useSnackbar();
  const existing = useApiGet(isEdit ? `/reports/${id}` : null, { enabled: isEdit });
  const create = useApiAction("post");
  const update = useApiAction("put");
  const item = existing.data?.item;

  const initialValues = useMemo(() => {
    if (isEdit) return item || {};
    return { type: "statistical", category: CATEGORIES[0], status: "Draft" };
  }, [isEdit, item]);

  async function handleSubmit(values) {
    if (isEdit) {
      await update.run(`/reports/${id}`, values);
      notify(`${values.name} updated`, "success");
      navigate(`/reports/${id}`);
    } else {
      const res = await create.run("/reports", values);
      notify(`${values.name} created`, "success");
      navigate(`/reports/${res.item.id}`);
    }
  }

  return (
    <EntityFormPage
      title={isEdit ? `Edit ${item?.name || ""}` : "New Report"}
      subtitle={isEdit ? "Update report metadata and classification" : "Define a new report catalogue entry"}
      backTo="/reports"
      fields={FIELDS}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      submitLabel={isEdit ? "Save changes" : "Create report"}
      loading={isEdit && existing.loading}
      loadError={isEdit ? existing.error : null}
    />
  );
}
