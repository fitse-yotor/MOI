import { useEffect, useState } from "react";
import { useApiGet, useApiAction } from "../../api/hooks.js";
import { Card } from "../../components/common/Card.jsx";
import Button from "../../components/common/Button.jsx";
import { DataState } from "../../components/common/StateViews.jsx";
import { useSnackbar } from "../../context/SnackbarContext.jsx";

export default function ConfigPage() {
  const masterData = useApiGet("/config/master-data");
  const params = useApiGet("/config/parameters");
  const { run, pending } = useApiAction("put");
  const { notify } = useSnackbar();
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (params.data) setForm(params.data);
  }, [params.data]);

  async function save() {
    await run("/config/parameters", form);
    notify("System parameters saved", "success");
  }

  return (
    <div className="grid g2">
      <Card>
        <div className="card-title" style={{ marginBottom: 12 }}>Master data</div>
        <DataState loading={masterData.loading} error={masterData.error} onRetry={masterData.refetch} isEmpty={masterData.data && masterData.data.items.length === 0}>
          <div className="stack-8">
            {(masterData.data?.items || []).map((m) => (
              <div key={m} className="flexbtw" style={{ fontSize: 13, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <span>{m}</span>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
            ))}
          </div>
        </DataState>
      </Card>
      <Card>
        <div className="card-title" style={{ marginBottom: 12 }}>System parameters</div>
        <DataState loading={params.loading} error={params.error} onRetry={params.refetch} isEmpty={!form}>
          {form && (
            <>
              <div className="form-grid">
                <div className="form-field"><label>Default language</label><input value={form.defaultLanguage} onChange={(e) => setForm({ ...form, defaultLanguage: e.target.value })} /></div>
                <div className="form-field"><label>Fiscal year start</label><input value={form.fiscalYearStart} onChange={(e) => setForm({ ...form, fiscalYearStart: e.target.value })} /></div>
                <div className="form-field"><label>Session timeout (minutes)</label><input value={form.sessionTimeoutMinutes} onChange={(e) => setForm({ ...form, sessionTimeoutMinutes: e.target.value })} /></div>
                <div className="form-field"><label>Password policy</label><input value={form.passwordPolicy} onChange={(e) => setForm({ ...form, passwordPolicy: e.target.value })} /></div>
                <div className="form-field"><label>Data-quality alert threshold</label><input value={form.dataQualityAlertThreshold} onChange={(e) => setForm({ ...form, dataQualityAlertThreshold: e.target.value })} /></div>
                <div className="form-field"><label>Mobile minimum version</label><input value={form.mobileMinimumVersion} onChange={(e) => setForm({ ...form, mobileMinimumVersion: e.target.value })} /></div>
              </div>
              <Button size="sm" style={{ marginTop: 16 }} disabled={pending} onClick={save}>Save parameters</Button>
            </>
          )}
        </DataState>
      </Card>
    </div>
  );
}
