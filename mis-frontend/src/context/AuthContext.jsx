import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import api from "../services/api";
import { persistAuth, readStoredAuth } from "../utils/authStorage";

const ROLE_MAP = {
  ADMIN: "admin",
  FACULTY: "teacher",
  STUDENT: "student",
};

export function mapBackendRole(backendRole) {
  if (!backendRole) return null;
  return ROLE_MAP[backendRole] || String(backendRole).toLowerCase();
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => readStoredAuth());

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    const next = {
      accessToken: data.accessToken,
      userId: data.userId,
      email: data.email,
      displayName: data.displayName,
      role: data.role,
      studentId: data.studentId ?? null,
      facultyId: data.facultyId ?? null,
    };
    persistAuth(next);
    setAuth(next);
    return next;
  }, []);

  const logout = useCallback(() => {
    persistAuth(null);
    setAuth(null);
  }, []);

  const refreshMe = useCallback(async () => {
    const { data } = await api.get("/auth/me");
    setAuth((prev) => {
      const next = {
        accessToken: prev?.accessToken || data.accessToken,
        userId: data.userId,
        email: data.email,
        displayName: data.displayName,
        role: data.role,
        studentId: data.studentId ?? null,
        facultyId: data.facultyId ?? null,
      };
      persistAuth(next);
      return next;
    });
    return data;
  }, []);

  const value = useMemo(
    () => ({
      ...auth,
      isAuthenticated: Boolean(auth?.accessToken),
      navRole: mapBackendRole(auth?.role),
      login,
      logout,
      refreshMe,
    }),
    [auth, login, logout, refreshMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}
