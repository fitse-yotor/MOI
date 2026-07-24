import { useApiGet } from "../../api/hooks.js";
import { Card } from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import { DataState } from "../../components/common/StateViews.jsx";

export default function QuestionnaireBuilder() {
  const { data, loading, error, refetch } = useApiGet("/collection/questionnaire-builder");

  return (
    <DataState loading={loading} error={error} onRetry={refetch} isEmpty={!data}>
      {data && (
        <div className="grid g2">
          <Card>
            <div className="card-title" style={{ marginBottom: 12 }}>Section: {data.section}</div>
            <div className="stack-8">
              {data.fields.map((f) => (
                <div
                  key={f.label}
                  style={{ border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <span>
                    {f.label} <Badge tone="muted">{f.type}</Badge>
                  </span>
                  <span className="muted" style={{ fontSize: 11 }}>{f.required ? "Required" : f.note}</span>
                </div>
              ))}
              <Button variant="outline" size="sm">+ Add field</Button>
            </div>
          </Card>
          <Card>
            <div className="card-title" style={{ marginBottom: 12 }}>Campaign settings</div>
            <div className="form-grid">
              <div className="form-field">
                <label>Assign by sector</label>
                <select>{data.campaignSettings.assignBySector.map((o) => <option key={o}>{o}</option>)}</select>
              </div>
              <div className="form-field">
                <label>Assign by enterprise size</label>
                <select>{data.campaignSettings.assignBySize.map((o) => <option key={o}>{o}</option>)}</select>
              </div>
              <div className="form-field"><label>Opening date</label><input defaultValue={data.campaignSettings.openingDate} /></div>
              <div className="form-field"><label>Closing date</label><input defaultValue={data.campaignSettings.closingDate} /></div>
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
              <Button variant="outline" size="sm">Preview form</Button>
              <Button variant="accent" size="sm">Publish campaign</Button>
            </div>
          </Card>
        </div>
      )}
    </DataState>
  );
}
