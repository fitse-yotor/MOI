import { useState } from "react";
import NavIcon from "../layout/NavIcon.jsx";
import { useNotifications } from "../../context/NotificationContext.jsx";
import NotificationPanel from "./NotificationPanel.jsx";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { unreadCount } = useNotifications();

  return (
    <div className="notif-panel-wrap">
      <button className="icon-btn" onClick={() => setOpen((v) => !v)} aria-label="Notifications">
        <NavIcon name="bell" />
        {unreadCount > 0 && <span className="dot" />}
      </button>
      {open && <NotificationPanel onClose={() => setOpen(false)} />}
    </div>
  );
}
