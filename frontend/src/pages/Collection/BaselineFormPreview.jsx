import { useApiGet } from "../../api/hooks.js";
import { Card, CardHead } from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import { DataState } from "../../components/common/StateViews.jsx";

export default function BaselineFormPreview() {
  const { data, loading, error, refetch } = useApiGet("/collection/baseline-form");

  return (
    <DataState loading={loading} error={error} onRetry={refetch} isEmpty={!data}>
      {data && (
        <Card>
          <CardHead title={data.title} subtitle={data.sectionLabel} action={<Badge tone="info">{data.savedAt}</Badge>} />
          <div className="step-tracker">
            {data.steps.map((s) => (
              <div className={`step ${s.state}`} key={s.label}>
                <div className="circ">{s.state === "done" ? "✓" : data.steps.indexOf(s) + 1}</div>
                <div className="lbl">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="form-grid">
            {data.fields.map((f) => (
              <div className="form-field" key={f.label}>
                <label>{f.label}</label>
                <input defaultValue={f.value} />
              </div>
            ))}
          </div>
          <div className="flexbtw" style={{ marginTop: 20 }}>
            <span className="muted" style={{ fontSize: 12 }}>
              Auto-calculated: Total headcount = <strong className="mono">{data.totalHeadcount}</strong>
            </span>
            <div style={{ display: "flex", gap: 10 }}>
              <Button variant="outline" size="sm">Save draft</Button>
              <Button variant="outline" size="sm">← Previous</Button>
              <Button size="sm">Next: Products & Sales →</Button>
            </div>
          </div>
        </Card>
      )}
    </DataState>
  );
}
