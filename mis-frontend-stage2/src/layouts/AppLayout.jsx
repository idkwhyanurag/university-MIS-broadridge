import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/nav/Sidebar";
import Topbar from "../components/nav/Topbar";
import "./AppLayout.css";

export default function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Topbar />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
