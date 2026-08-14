import { useState } from "react";
import { NavLink } from "react-router-dom";
import { NAV_GROUPS } from "./navConfig.js";
import NavIcon from "./NavIcon.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Sidebar({ open, collapsed, onToggleCollapse }) {
  const { can, user } = useAuth();

  // Track collapsed state per group label (for accordion in expanded mode)
  const [collapsedGroups, setCollapsedGroups] = useState({});

  function toggleGroup(groupName) {
    if (collapsed) return; // In mini mode, ignore accordion toggles
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  }

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      {/* Brand Header */}
      <div className="sidebar-brand">
        <img
          src="/ministry-mark.svg"
          alt="Ministry of Industry"
          className="mark"
          style={{ background: "#fff", padding: 3, flexShrink: 0 }}
        />
        {!collapsed && (
          <div className="name">
            Manufacturing BIS
            <span>Ministry of Industry, Ethiopia</span>
          </div>
        )}
      </div>

      {/* Navigation Scroll */}
      <nav className="nav-scroll">
        {NAV_GROUPS.map((g) => {
          const items = g.items.filter((item) => can(item.module || item.id, "view"));
          if (!items.length) return null;
          const isGroupCollapsed = !collapsed && !!collapsedGroups[g.group];

          return (
            <div className={`nav-group ${isGroupCollapsed ? "collapsed" : ""}`} key={g.group}>
              {!collapsed ? (
                <button
                  type="button"
                  onClick={() => toggleGroup(g.group)}
                  className="nav-group-label"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    padding: "14px 12px 6px",
                    color: "#7c97aa",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.09em",
                    textTransform: "uppercase",
                    transition: "color 0.15s ease",
                  }}
                >
                  <span>{g.group}</span>
                  <span
                    style={{
                      fontSize: 9,
                      transition: "transform 0.2s ease",
                      transform: isGroupCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
                      display: "inline-block",
                    }}
                  >
                    ▼
                  </span>
                </button>
              ) : (
                <div style={{ height: 1, background: "rgba(255, 255, 255, 0.08)", margin: "10px 8px 6px" }} />
              )}

              {(!isGroupCollapsed || collapsed) && (
                <div className="nav-group-items" style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {items.map((item) => (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      end={item.path === "/"}
                      title={collapsed ? `${item.label}${item.badge ? ` (${item.badge} pending)` : ""}` : undefined}
                      className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                    >
                      <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                        <NavIcon name={item.icon} />
                        {collapsed && item.badge ? (
                          <span
                            style={{
                              position: "absolute",
                              top: -2,
                              right: -4,
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              background: "var(--accent)",
                              boxShadow: "0 0 4px rgba(244, 180, 26, 0.6)",
                              border: "1.5px solid #0d2b3f",
                            }}
                          />
                        ) : null}
                      </span>
                      {!collapsed && <span>{item.label}</span>}
                      {!collapsed && item.badge ? <span className="badge">{item.badge}</span> : null}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer & Horizontal Collapse Button */}
      <div
        className="sidebar-foot"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: 8,
        }}
      >
        {!collapsed && (
          <div style={{ fontSize: 11, color: "#7c97aa", lineHeight: 1.5 }}>
            v1.0.0 · Live data
            <br />
            <span style={{ color: "#cbdce6", fontWeight: 600 }}>{user?.role?.label || "User"}</span>
          </div>
        )}
        <button
          type="button"
          onClick={onToggleCollapse}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            color: "#cbdce6",
            borderRadius: 8,
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            transition: "all 0.15s ease",
            flexShrink: 0,
          }}
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>
    </aside>
  );
}
