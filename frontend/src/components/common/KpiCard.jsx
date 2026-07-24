import { Card } from "./Card.jsx";

const COLOR_VARS = {
  primary: "var(--primary)",
  secondary: "var(--secondary)",
  accent: "var(--accent)",
  accentDark: "var(--accent-dark)",
  error: "var(--error)",
  info: "var(--info)",
};

export default function KpiCard({ label, value, delta, trend, color = "primary" }) {
  return (
    <Card className="kpi">
      <div className="accent-bar" style={{ background: COLOR_VARS[color] || COLOR_VARS.primary }} />
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {delta && (
        <span className={`delta ${trend === "down" ? "down" : "up"}`}>
          {trend === "down" ? "▼" : "▲"} {delta}
        </span>
      )}
    </Card>
  );
}
