import { NavLink } from "react-router-dom";
import { NAV_GROUPS } from "./navConfig.js";
import NavIcon from "./NavIcon.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Sidebar({ open }) {
  const { can, user } = useAuth();

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="sidebar-brand">
        <img src="/ministry-mark.svg" alt="Ministry of Industry" className="mark" style={{ background: "#fff", padding: 3 }} />
        <div className="name">
          Manufacturing BIS
          <span>Ministry of Industry, Ethiopia</span>
        </div>
      </div>
      <nav className="nav-scroll">
        {NAV_GROUPS.map((g) => {
          const items = g.items.filter((item) => can(item.module || item.id, "view"));
          if (!items.length) return null;
          return (
            <div className="nav-group" key={g.group}>
              <div className="nav-group-label">{g.group}</div>
              {items.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                >
                  <NavIcon name={item.icon} />
                  <span>{item.label}</span>
                  {item.badge ? <span className="badge">{item.badge}</span> : null}
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>
      <div className="sidebar-foot">v1.0.0 · Live data<br />Signed in as {user?.role?.label || "…"}</div>
    </aside>
  );
}
