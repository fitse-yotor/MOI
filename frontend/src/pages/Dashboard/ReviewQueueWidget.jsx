import { Card, CardHead } from "../../components/common/Card.jsx";
import ProgressBar from "../../components/common/ProgressBar.jsx";

const COLOR_VARS = {
  info: "var(--info)",
  secondary: "var(--secondary)",
  primary: "var(--primary)",
  accentDark: "var(--accent-dark)",
};

export default function ReviewQueueWidget({ items }) {
  return (
    <Card>
      <CardHead title="Review & approval queue" subtitle="Awaiting action" />
      <div className="stack-14" style={{ marginTop: 6 }}>
        {items.map((row) => (
          <div key={row.label}>
            <div className="flexbtw">
              <span className="muted">{row.label}</span>
              <span className="mono" style={{ fontWeight: 700 }}>{row.count}</span>
            </div>
            <ProgressBar pct={row.pct} color={COLOR_VARS[row.color]} />
          </div>
        ))}
      </div>
    </Card>
  );
}
