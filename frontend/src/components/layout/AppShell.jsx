import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import SnackbarHost from "../notifications/SnackbarHost.jsx";

export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // A new route means the user picked a destination — close the mobile
  // drawer automatically rather than leaving it open over the new page.
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <div className="app">
      <Sidebar open={menuOpen} />
      {menuOpen && <div className="sidebar-backdrop" onClick={() => setMenuOpen(false)} />}
      <div className="main">
        <Topbar onMenuClick={() => setMenuOpen((v) => !v)} />
        <div className="content">
          <Outlet />
        </div>
      </div>
      <SnackbarHost />
    </div>
  );
}
