import React from "react";
import { useRole } from "../../context/RoleContext";
import "./RoleSwitcher.css";

const LABELS = { admin: "Admin", teacher: "Teacher", student: "Student" };

// Temporary dev tool standing in for a real login. Swap this
// component out (not the RoleContext API) once real auth exists.
export default function RoleSwitcher() {
  const { role, setRole, ROLES } = useRole();

  return (
    <div className="role-switcher" role="radiogroup" aria-label="View as role">
      {ROLES.map((r) => (
        <button
          key={r}
          role="radio"
          aria-checked={role === r}
          className={`role-pill ${role === r ? "active" : ""}`}
          onClick={() => setRole(r)}
        >
          {LABELS[r]}
        </button>
      ))}
    </div>
  );
}
