import { useNavigate } from "react-router-dom";
import { Card } from "./Card.jsx";
import { DataState } from "./StateViews.jsx";

/** Full-page read-only detail view, used by every CRUD entity's own thin wrapper page. */
export default function EntityViewPage({ title, subtitle, backTo, loading, error, onRetry, fields, actions, badges, children }) {
  const navigate = useNavigate();
  const initials = (title || "")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto" }}>
      <button className="link-btn" onClick={() => navigate(backTo)} style={{ marginBottom: 14 }}>← Back</button>
      <Card>
        <DataState loading={loading} error={error} onRetry={onRetry}>
          <div className="flexbtw" style={{ alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
              {title && <div className="avatar-sm entity-avatar">{initials}</div>}
              <div style={{ minWidth: 0 }}>
                <div className="card-title" style={{ fontSize: 17 }}>{title}</div>
                {subtitle && <div className="muted" style={{ fontSize: 12, marginTop: 3 }}>{subtitle}</div>}
              </div>
            </div>
            {actions && <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{actions}</div>}
          </div>
          {badges && <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "16px 0 0" }}>{badges}</div>}
          {children}
          {fields?.length > 0 && (
            <>
              <div className="entity-divider" />
              <div className="field-row">
                {fields.map((f) => (
                  <div className="field" key={f.label}>
                    <label>{f.label}</label>
                    <div className="fval">{f.value ?? "—"}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </DataState>
      </Card>
    </div>
  );
}
