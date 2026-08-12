import React from "react";
import RoleSwitcher from "./RoleSwitcher";
import { useRole } from "../../context/RoleContext";
import "./Topbar.css";

const NAMES = {
  admin: "Anurag Majumdar",
  teacher: "Faculty Member",
  student: "Student User",
};

export default function Topbar() {
  const { role } = useRole();
  const name = NAMES[role];
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <header className="topbar">
      <div className="topbar-search">
        <input type="search" placeholder="Search students, courses, records..." aria-label="Search" />
      </div>
      <div className="topbar-actions">
        <RoleSwitcher />
        <button className="icon-btn" aria-label="Notifications">
          <span className="dot" />
          &#128276;
        </button>
        <div className="user-chip">
          <div className="user-avatar">{initials}</div>
          <div className="user-meta">
            <div className="user-name">{name}</div>
            <div className="user-role">{role[0].toUpperCase() + role.slice(1)}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
