import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApiGet, useApiAction } from "../../api/hooks.js";
import { useSnackbar } from "../../context/SnackbarContext.jsx";
import { Card, CardHead } from "../../components/common/Card.jsx";
import { DataState } from "../../components/common/StateViews.jsx";
import Button from "../../components/common/Button.jsx";
import CertificatePreview from "../../components/common/CertificatePreview.jsx";

const EMPTY = { name: "", code: "", category: "", description: "", feeETB: 0, validityMonths: 12, terms: [], status: "Active" };

export default function LicenseTemplateBuilderPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { notify } = useSnackbar();
  const { data, loading, error } = useApiGet("/licenses/templates", { enabled: isEdit });
  const save = useApiAction(isEdit ? "put" : "post");
  const [values, setValues] = useState(EMPTY);
  const [clause, setClause] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (isEdit && data) {
      const existing = data.items.find((t) => t.id === id);
      if (existing) setValues(existing);
    }
  }, [isEdit, data, id]);

  function update(key, val) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  function addClause() {
    if (!clause.trim()) return;
    update("terms", [...values.terms, clause.trim()]);
    setClause("");
  }

  function removeClause(i) {
    update("terms", values.terms.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    try {
      const payload = { ...values, feeETB: Number(values.feeETB) || 0, validityMonths: Number(values.validityMonths) || 12 };
      await save.run(isEdit ? `/licenses/templates/${id}` : "/licenses/templates", payload);
      notify(isEdit ? "Template updated" : "Template created", "success");
      navigate("/licenses/templates");
    } catch (err) {
      setFormError(err.message || "Could not save template");
    }
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <button className="link-btn" onClick={() => navigate("/licenses/templates")} style={{ marginBottom: 14 }}>← Back</button>
      <div className="grid g2" style={{ alignItems: "start" }}>
        <Card>
          <CardHead title={isEdit ? "Edit License Template" : "New License Template"} subtitle="Define the certificate an enterprise receives when this license is issued" />
          <DataState loading={isEdit && loading} error={isEdit && error}>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-field">
                  <label>Template name<span style={{ color: "var(--error)" }}> *</span></label>
                  <input value={values.name} onChange={(e) => update("name", e.target.value)} required />
                </div>
                <div className="form-field">
                  <label>Code</label>
                  <input value={values.code} onChange={(e) => update("code", e.target.value)} placeholder="e.g. MOL" />
                </div>
                <div className="form-field">
                  <label>Category<span style={{ color: "var(--error)" }}> *</span></label>
                  <input value={values.category} onChange={(e) => update("category", e.target.value)} required placeholder="e.g. Operating license" />
                </div>
                <div className="form-field">
                  <label>Status</label>
                  <select value={values.status} onChange={(e) => update("status", e.target.value)}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Fee (ETB)</label>
                  <input type="number" min="0" value={values.feeETB} onChange={(e) => update("feeETB", e.target.value)} />
                </div>
                <div className="form-field">
                  <label>Validity (months)</label>
                  <input type="number" min="1" value={values.validityMonths} onChange={(e) => update("validityMonths", e.target.value)} />
                </div>
              </div>

              <div className="form-field" style={{ marginTop: 16 }}>
                <label>Description</label>
                <textarea
                  value={values.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={2}
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border)", borderRadius: 8, fontFamily: "inherit", fontSize: 13, outline: "none", resize: "vertical" }}
                />
              </div>

              <div className="form-field" style={{ marginTop: 16 }}>
                <label>Terms &amp; conditions</label>
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <input value={clause} onChange={(e) => setClause(e.target.value)} placeholder="Add a clause…" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addClause(); } }} />
                  <Button type="button" variant="outline" size="sm" onClick={addClause}>Add</Button>
                </div>
                <div className="stack-8">
                  {values.terms.map((t, i) => (
                    <div key={i} className="flexbtw" style={{ background: "var(--bg)", padding: "8px 12px", borderRadius: 8 }}>
                      <span style={{ fontSize: 12.5 }}>{t}</span>
                      <button type="button" className="link-btn" style={{ color: "var(--error)" }} onClick={() => removeClause(i)}>Remove</button>
                    </div>
                  ))}
                </div>
              </div>

              {formError && <div className="badge error" style={{ marginTop: 14 }}>{formError}</div>}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
                <Button variant="outline" type="button" onClick={() => navigate("/licenses/templates")}>Cancel</Button>
                <Button type="submit" disabled={save.pending}>{save.pending ? "Saving…" : "Save template"}</Button>
              </div>
            </form>
          </DataState>
        </Card>

        <CertificatePreview
          templateName={values.name || "License Certificate"}
          category={values.category}
          licenseNumber="LIC-2026-00000"
          enterpriseName="Sample Enterprise PLC"
          issueDate="—"
          expiryDate="—"
          feeETB={Number(values.feeETB) || 0}
          terms={values.terms}
          status="Preview"
        />
      </div>
    </div>
  );
}
