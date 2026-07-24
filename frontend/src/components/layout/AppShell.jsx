import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import SnackbarHost from "../notifications/SnackbarHost.jsx";

export default function AppShell() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="content">
          <Outlet />
        </div>
      </div>
      <SnackbarHost />
    </div>
  );
}
