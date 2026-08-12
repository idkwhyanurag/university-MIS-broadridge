import React, { createContext, useContext, useState } from "react";

// Lightweight role switcher for demo purposes — no real auth yet.
// Once Epic 1's auth module exists, replace this with a real
// AuthContext that derives `role` from a logged-in user/JWT
// instead of local component state. Every place that reads
// `role` from useRole() will keep working unchanged.
const RoleContext = createContext(null);

const ROLES = ["admin", "teacher", "student"];

export function RoleProvider({ children }) {
  const [role, setRole] = useState("admin");
  return (
    <RoleContext.Provider value={{ role, setRole, ROLES }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used inside a RoleProvider");
  return ctx;
}
