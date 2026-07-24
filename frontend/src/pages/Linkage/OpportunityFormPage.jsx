import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApiGet, useApiAction } from "../../api/hooks.js";
import EntityFormPage from "../../components/common/EntityFormPage.jsx";
import { useSnackbar } from "../../context/SnackbarContext.jsx";

const CATEGORIES = ["Buying opportunity", "Supplying opportunity", "Investment opportunity", "Partnership opportunity", "Export opportunity"];
const FIELDS = [
  { key: "title", label: "Title", required: true },
  { key: "category", label: "Category", type: "select", options: CATEGORIES },
  { key: "body", label: "Description" },
  { key: "region", label: "Region" },
  { key: "expires", label: "Expires (e.g. 30 Sep 2026)" },
];

export default function OpportunityFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { notify } = useSnackbar();
  const existing = useApiGet(isEdit ? `/linkage/opportunities/${id}` : null, { enabled: isEdit });
  const create = useApiAction("post");
  const update = useApiAction("put");
  const item = existing.data?.item;

  const initialValues = useMemo(() => {
    if (isEdit) return item || {};
    return { category: CATEGORIES[0], region: "Any region" };
  }, [isEdit, item]);

  async function handleSubmit(values) {
    if (isEdit) {
      await update.run(`/linkage/opportunities/${id}`, values);
      notify(`${values.title} updated`, "success");
      navigate(`/linkage/opportunities/${id}`);
    } else {
      const res = await create.run("/linkage/opportunities", values);
      notify(`${values.title} posted`, "success");
      navigate(`/linkage/opportunities/${res.item.id}`);
    }
  }

  return (
    <EntityFormPage
      title={isEdit ? `Edit ${item?.title || ""}` : "Post opportunity"}
      subtitle={isEdit ? "Update opportunity details" : "Publish a new market opportunity"}
      backTo="/linkage"
      fields={FIELDS}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      submitLabel={isEdit ? "Save changes" : "Post opportunity"}
      loading={isEdit && existing.loading}
      loadError={isEdit ? existing.error : null}
    />
  );
}
