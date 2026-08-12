import React from "react";
import Card from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/crud.css";

export default function SettingsPage() {
  const { logout, displayName } = useAuth();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Application configuration for administrators.</p>
      </div>
      <Card tab="admin" title="API">
        <p className="muted">Backend base URL</p>
        <p className="mono">{apiUrl}</p>
      </Card>
      <div className="page-form-card">
        <Card tab="admin" title="Session">
          <p className="muted">Signed in as {displayName}</p>
          <button type="button" className="btn-primary" onClick={handleLogout}>Logout</button>
        </Card>
      </div>
    </div>
  );
}
