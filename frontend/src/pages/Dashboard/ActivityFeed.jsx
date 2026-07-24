import { Card, CardHead } from "../../components/common/Card.jsx";

export default function ActivityFeed({ items }) {
  return (
    <Card>
      <CardHead title="Recent activity" subtitle="System-wide events" />
      <div className="stack-14">
        {items.map((a, i) => (
          <div style={{ display: "flex", gap: 10 }} key={i}>
            <span
              className={`badge ${a.tone}`}
              style={{ width: 7, height: 7, padding: 0, borderRadius: "50%", marginTop: 6 }}
            />
            <div style={{ fontSize: 12.8, lineHeight: 1.5 }}>
              <strong>{a.who}</strong> {a.act} <span className="muted">— {a.entity}</span>
              <div className="muted" style={{ fontSize: 11, marginTop: 1 }}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
