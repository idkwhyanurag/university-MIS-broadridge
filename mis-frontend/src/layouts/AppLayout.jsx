import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/nav/Sidebar";
import Topbar from "../components/nav/Topbar";
import "./AppLayout.css";

// Mock current user until Epic 1's auth module exists.
const MOCK_USER = { id: 1, name: "Anurag Majumdar", role: "Administrator" };

export default function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Topbar currentUser={MOCK_USER} />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
