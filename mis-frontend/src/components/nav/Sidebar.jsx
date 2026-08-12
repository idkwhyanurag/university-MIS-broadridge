import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { NAV_GROUPS } from "../../config/navigation";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

const DEFAULT_OPEN = {
  academics: true,
  hostel: true,
  resources: true,
  comms: true,
  admin: false,
};

export default function Sidebar() {
  const [open, setOpen] = useState(DEFAULT_OPEN);
  const { navRole } = useAuth();
  const role = navRole || "student";

  const toggle = (id) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  const visibleFor = (item) => !item.roles || item.roles.includes(role);

  return (
    <aside className="sidebar">
      <div className="sidebar-crest">
        <div className="crest-mark" aria-hidden="true">🎓</div>
        <div className="crest-text">
          <div className="crest-title">University MIS</div>
          <div className="crest-subtitle">Records &amp; Administration</div>
        </div>
      </div>

      <NavLink to="/" end className={({ isActive }) => `overview-link ${isActive ? "active" : ""}`}>
        Dashboard
      </NavLink>

      <nav className="sidebar-groups">
        {NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter(visibleFor);
          if (visibleItems.length === 0) return null;

          return (
            <div className="nav-group" key={group.id} data-tab={group.tab}>
              <button
                className="nav-group-header"
                onClick={() => toggle(group.id)}
                aria-expanded={open[group.id]}
              >
                <span className="tab-mark" />
                <span className="nav-group-label">{group.label}</span>
                <span className={`chevron ${open[group.id] ? "expanded" : ""}`}>&#8250;</span>
              </button>

              {open[group.id] && (
                <ul className="nav-group-items">
                  {visibleItems.map((item) => (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
