import React from "react";
import "./Topbar.css";

// currentUser is mocked for now — swap for real auth context
// once Epic 1's auth module is available.
export default function Topbar({ currentUser }) {
  const initials = currentUser?.name
    ? currentUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <header className="topbar">
      <div className="topbar-search">
        <input type="search" placeholder="Search students, courses, records..." aria-label="Search" />
      </div>
      <div className="topbar-actions">
        <button className="icon-btn" aria-label="Notifications">
          <span className="dot" />
          &#128276;
        </button>
        <div className="user-chip">
          <div className="user-avatar">{initials}</div>
          <div className="user-meta">
            <div className="user-name">{currentUser?.name || "Guest"}</div>
            <div className="user-role">{currentUser?.role || "—"}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
