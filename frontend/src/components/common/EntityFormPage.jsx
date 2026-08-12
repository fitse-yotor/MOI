import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "./Card.jsx";
import Button from "./Button.jsx";
import { DataState } from "./StateViews.jsx";

/** Full-page create/edit form, used by every CRUD entity's own thin wrapper page. */
export default function EntityFormPage({ title, subtitle, backTo, fields, initialValues, onSubmit, submitLabel = "Save", loading, loadError }) {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues || {});
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setValues(initialValues || {});
  }, [initialValues]);

  function update(key, val) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setPending(true);
    setError("");
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err.message || "Something went wrong");
      setPending(false);
    }
  }

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto" }}>
      <button className="link-btn" onClick={() => navigate(backTo)} style={{ marginBottom: 14 }}>← Back</button>
      <Card>
        <div className="card-title" style={{ fontSize: 17 }}>{title}</div>
        {subtitle && <div className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>{subtitle}</div>}
        <div className="entity-divider" />
        <DataState loading={loading} error={loadError}>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {fields.map((f) => (
                <div className="form-field" key={f.key}>
                  <label>
                    {f.label}
                    {f.required && <span style={{ color: "var(--error)" }}> *</span>}
                  </label>
                  {f.type === "select" ? (
                    <select value={values[f.key] ?? ""} onChange={(e) => update(f.key, e.target.value)}>
                      {(f.options || []).map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={f.type || "text"}
                      value={values[f.key] ?? ""}
                      onChange={(e) => update(f.key, e.target.value)}
                      required={f.required}
                    />
                  )}
                </div>
              ))}
            </div>
            {error && <div className="badge error" style={{ marginTop: 14 }}>{error}</div>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 26, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
              <Button variant="outline" type="button" onClick={() => navigate(backTo)}>
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? "Saving…" : submitLabel}
              </Button>
            </div>
          </form>
        </DataState>
      </Card>
    </div>
  );
}
