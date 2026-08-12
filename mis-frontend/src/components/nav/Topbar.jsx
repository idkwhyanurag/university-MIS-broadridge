import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Topbar.css";
import "../../styles/crud.css";

export default function Topbar() {
  const { displayName, navRole, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  const name = displayName || "User";
  const roleLabel = navRole ? navRole[0].toUpperCase() + navRole.slice(1) : "";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="topbar">
      <div className="topbar-search">
        <input type="search" placeholder="Search students, courses, records..." aria-label="Search" />
      </div>
      <div className="topbar-actions">
        <button className="icon-btn" aria-label="Notifications" onClick={() => navigate("/notifications")}>
          <span className="dot" />
          &#128276;
        </button>
        <div className="user-chip">
          <div className="user-avatar">{initials}</div>
          <div className="user-meta">
            <div className="user-name">{name}</div>
            <div className="user-role">{roleLabel}</div>
          </div>
        </div>
        <button type="button" className="topbar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
