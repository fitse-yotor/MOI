import { useLocation, useNavigate } from "react-router-dom";
import { PAGE_META } from "./navConfig.js";
import NavIcon from "./NavIcon.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import NotificationBell from "../notifications/NotificationBell.jsx";

function resolveMeta(pathname) {
  if (PAGE_META[pathname]) return PAGE_META[pathname];
  const match = Object.keys(PAGE_META)
    .filter((key) => key !== "/" && pathname.startsWith(`${key}/`))
    .sort((a, b) => b.length - a.length)[0];
  return PAGE_META[match] || PAGE_META["/"];
}

export default function Topbar({ onMenuClick, collapsed, onToggleCollapse }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [title, subtitle] = resolveMeta(pathname);

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="topbar">
      <div className="topbar-left">
        {/* Mobile menu drawer button */}
        <button className="icon-btn menu-btn" onClick={onMenuClick} aria-label="Open menu">
          <NavIcon name="menu" size={18} />
        </button>

        {/* Desktop horizontal sidebar collapse toggle */}
        <button
          className="icon-btn collapse-btn"
          onClick={onToggleCollapse}
          title={collapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text2)", lineHeight: 1 }}>
            {collapsed ? "»" : "«"}
          </span>
        </button>

        <div>
          <div className="page-title">{title}</div>
          <div className="page-sub">{subtitle}</div>
        </div>
      </div>

      <div className="topbar-right">
        <div className="search-box">
          <NavIcon name="search" size={15} />
          <input placeholder="Search enterprises, TIN, reports…" />
        </div>
        <NotificationBell />
        <div className="user-chip">
          <div className="avatar">{user?.initials || "…"}</div>
          <div>
            <div className="u-name">{user?.name || "Loading…"}</div>
            <div className="u-role">{user?.role?.label || ""}</div>
          </div>
        </div>
        <button className="icon-btn" onClick={handleLogout} aria-label="Sign out" title="Sign out">
          <NavIcon name="logout" size={16} />
        </button>
      </div>
    </div>
  );
}
