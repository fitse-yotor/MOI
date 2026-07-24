import { useNavigate } from "react-router-dom";
import { Card } from "./Card.jsx";
import { DataState } from "./StateViews.jsx";

/** Full-page read-only detail view, used by every CRUD entity's own thin wrapper page. */
export default function EntityViewPage({ title, subtitle, backTo, loading, error, onRetry, fields, actions, badges, children }) {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <button className="link-btn" onClick={() => navigate(backTo)} style={{ marginBottom: 14 }}>← Back</button>
      <Card>
        <DataState loading={loading} error={error} onRetry={onRetry}>
          <div className="flexbtw" style={{ alignItems: "flex-start" }}>
            <div>
              <div className="card-title" style={{ fontSize: 16 }}>{title}</div>
              {subtitle && <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{subtitle}</div>}
            </div>
            {actions && <div style={{ display: "flex", gap: 8 }}>{actions}</div>}
          </div>
          {badges && <div style={{ display: "flex", gap: 8, margin: "16px 0 0" }}>{badges}</div>}
          {children}
          <div className="field-row" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 20 }}>
            {(fields || []).map((f) => (
              <div className="field" key={f.label}>
                <label>{f.label}</label>
                <div className="fval">{f.value ?? "—"}</div>
              </div>
            ))}
          </div>
        </DataState>
      </Card>
    </div>
  );
}
