import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import Loading from "../components/ui/Loading";
import ErrorState from "../components/ui/ErrorState";
import { useAuth } from "../context/AuthContext";
import "../styles/crud.css";

export default function ProfilePage() {
  const { displayName, email, role, userId, studentId, facultyId, navRole, refreshMe } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    refreshMe()
      .catch(() => {
        if (!cancelled) setError("Couldn't refresh profile from /auth/me.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshMe]);

  if (loading && !displayName) return <Loading />;
  if (error && !displayName) return <ErrorState message={error} onRetry={() => refreshMe()} />;

  return (
    <div>
      <div className="page-header">
        <h1>Profile</h1>
        <p>Your signed-in account details.</p>
      </div>
      {error && <p className="form-error">{error}</p>}
      <Card tab="admin" title={displayName || "User"}>
        <div className="page-form stacked">
          <p><strong>User ID:</strong> {userId}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Role:</strong> {role} ({navRole})</p>
          <p><strong>Student ID:</strong> {studentId ?? "—"}</p>
          <p><strong>Faculty ID:</strong> {facultyId ?? "—"}</p>
        </div>
      </Card>
    </div>
  );
}
