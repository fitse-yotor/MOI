import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import SnackbarHost from "../notifications/SnackbarHost.jsx";

const STORAGE_KEY = "moi_sidebar_collapsed";

export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  const { pathname } = useLocation();

  useEffect(() => setMenuOpen(false), [pathname]);

  function toggleCollapse() {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  return (
    <div className={`app ${collapsed ? "sidebar-mini" : ""}`}>
      <Sidebar
        open={menuOpen}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
      />
      {menuOpen && <div className="sidebar-backdrop" onClick={() => setMenuOpen(false)} />}
      <div className="main">
        <Topbar
          onMenuClick={() => setMenuOpen((v) => !v)}
          collapsed={collapsed}
          onToggleCollapse={toggleCollapse}
        />
        <div className="content">
          <Outlet />
        </div>
      </div>
      <SnackbarHost />
    </div>
  );
}
