import { useEffect, useRef } from "react";
import { useNotifications } from "../../context/NotificationContext.jsx";

export default function NotificationPanel({ onClose }) {
  const { notifications, loading, markAllRead } = useNotifications();
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div className="notif-panel" ref={ref}>
      <div className="flexbtw" style={{ padding: "4px 6px 10px" }}>
        <span className="card-title">Notifications</span>
        <button className="link-btn" onClick={markAllRead}>Mark all read</button>
      </div>
      {loading && <div className="muted" style={{ padding: 10 }}>Loading…</div>}
      {!loading && notifications.length === 0 && (
        <div className="muted" style={{ padding: 10 }}>You're all caught up.</div>
      )}
      <div className="stack-8">
        {notifications.map((n) => (
          <div className={`notif-row ${n.unread ? "unread" : ""}`} key={n.id}>
            <div className="icon">{n.icon}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 12.8 }}>{n.title}</div>
              <div className="muted" style={{ fontSize: 12, margin: "3px 0" }}>{n.body}</div>
              <div className="muted" style={{ fontSize: 11 }}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
