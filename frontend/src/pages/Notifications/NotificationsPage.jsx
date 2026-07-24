import { Card, CardHead } from "../../components/common/Card.jsx";
import { DataState } from "../../components/common/StateViews.jsx";
import { useNotifications } from "../../context/NotificationContext.jsx";

export default function NotificationsPage() {
  const { notifications, loading, markAllRead } = useNotifications();

  return (
    <Card style={{ maxWidth: 720 }}>
      <CardHead title="Notifications" action={<button className="link-btn" onClick={markAllRead}>Mark all read</button>} />
      <DataState loading={loading} isEmpty={notifications.length === 0} emptyMessage="You're all caught up.">
        <div className="stack-14">
          {notifications.map((n) => (
            <div
              key={n.id}
              style={{ display: "flex", gap: 12, padding: 12, borderRadius: 8, background: n.unread ? "var(--secondary-light)" : "transparent" }}
            >
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#fff", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {n.icon}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{n.title}</div>
                <div className="muted" style={{ fontSize: 12.5, margin: "3px 0" }}>{n.body}</div>
                <div className="muted" style={{ fontSize: 11 }}>{n.time}</div>
              </div>
            </div>
          ))}
        </div>
      </DataState>
    </Card>
  );
}
