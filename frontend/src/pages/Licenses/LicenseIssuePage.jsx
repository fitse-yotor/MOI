import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApiGet, useApiAction } from "../../api/hooks.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { Card, CardHead } from "../../components/common/Card.jsx";
import { DataState } from "../../components/common/StateViews.jsx";
import Button from "../../components/common/Button.jsx";
import CertificatePreview from "../../components/common/CertificatePreview.jsx";

export default function LicenseIssuePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEnterprise = user?.role?.id === "enterprise";
  const { data: entData, loading: entLoading, error: entError } = useApiGet("/enterprises");
  const { data: tplData, loading: tplLoading, error: tplError } = useApiGet("/licenses/templates");
  const submit = useApiAction("post");
  const [enterpriseId, setEnterpriseId] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [error, setError] = useState("");

  const enterprises = entData?.items || [];
  const templates = (tplData?.items || []).filter((t) => t.status === "Active");

  useEffect(() => {
    if (!enterpriseId && enterprises.length) setEnterpriseId(enterprises[0].id);
  }, [enterprises, enterpriseId]);
  useEffect(() => {
    if (!templateId && templates.length) setTemplateId(templates[0].id);
  }, [templates, templateId]);

  const enterprise = enterprises.find((e) => e.id === enterpriseId);
  const template = templates.find((t) => t.id === templateId);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await submit.run("/licenses", { enterpriseId, templateId });
      navigate(`/licenses/${res.item.id}`);
    } catch (err) {
      setError(err.message || "Could not submit application");
    }
  }

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto" }}>
      <button className="link-btn" onClick={() => navigate("/licenses")} style={{ marginBottom: 14 }}>← Back</button>
      <div className="grid g2" style={{ alignItems: "start" }}>
        <Card>
          <CardHead
            title={isEnterprise ? "Apply for a License" : "New License Application"}
            subtitle={isEnterprise ? "Choose the license or certificate you want to apply for" : "Submit a license application on behalf of an enterprise"}
          />
          <DataState loading={entLoading || tplLoading} error={entError || tplError}>
            <form onSubmit={handleSubmit}>
              {!isEnterprise && (
                <div className="form-field" style={{ marginBottom: 16 }}>
                  <label>Enterprise</label>
                  <select value={enterpriseId} onChange={(e) => setEnterpriseId(e.target.value)}>
                    {enterprises.map((en) => (
                      <option key={en.id} value={en.id}>{en.name} · {en.tin}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="form-field" style={{ marginBottom: 16 }}>
                <label>License template</label>
                <select value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              {template && (
                <div className="field-row">
                  <div className="field">
                    <label>Fee</label>
                    <div className="fval">{template.feeETB > 0 ? `ETB ${template.feeETB.toLocaleString()}` : "Free"}</div>
                  </div>
                  <div className="field">
                    <label>Validity</label>
                    <div className="fval">{template.validityMonths} months</div>
                  </div>
                </div>
              )}
              <div className="hint-banner">
                Your application will be reviewed by the Ministry before {template?.feeETB > 0 ? "payment is requested" : "the license is issued"}. You'll be notified of the decision.
              </div>
              {error && <div className="badge error" style={{ marginBottom: 14 }}>{error}</div>}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
                <Button variant="outline" type="button" onClick={() => navigate("/licenses")}>Cancel</Button>
                <Button type="submit" disabled={submit.pending || !enterprise || !template}>
                  {submit.pending ? "Submitting…" : "Submit application"}
                </Button>
              </div>
            </form>
          </DataState>
        </Card>

        {template && (
          <CertificatePreview
            templateName={template.name}
            category={template.category}
            enterpriseName={enterprise?.name}
            feeETB={template.feeETB}
            terms={template.terms}
            status="Submitted"
          />
        )}
      </div>
    </div>
  );
}
