import React, { useEffect, useState } from "react";
import { checkRisk, getAnalyticsSummary } from "../services/analyticsService";
import StatCard from "../components/ui/StatCard";
import Card from "../components/ui/Card";
import "../styles/crud.css";

export default function AnalyticsPage() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    studentId: "",
    attendancePercentage: "",
    failedExamCount: "",
  });
  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    getAnalyticsSummary()
      .then(setSummary)
      .catch(() => setError("Couldn't reach the analytics service."));
  }, []);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleRiskCheck = async (e) => {
    e.preventDefault();
    setFormError(null);
    setResult(null);
    try {
      const data = await checkRisk(
        Number(form.studentId),
        Number(form.attendancePercentage),
        Number(form.failedExamCount)
      );
      setResult(data);
    } catch {
      setFormError("Risk check failed.");
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: "1.5rem" }}>Analytics</h1>

      {error && <p className="dashboard-error">{error}</p>}

      <section className="stat-grid" style={{ marginBottom: "2rem" }}>
        <StatCard tab="comms" label="Notifications Sent" value={summary ? summary.totalNotificationsSent : "—"} />
        <StatCard tab="comms" label="Announcements Posted" value={summary ? summary.totalAnnouncements : "—"} />
        <StatCard tab="comms" label="Upcoming Events" value={summary ? summary.upcomingEventsCount : "—"} />
        <StatCard tab="academics" label="Students" value={summary ? summary.totalStudents : "—"} />
        <StatCard tab="hostel" label="Unpaid Fees" value={summary ? summary.unpaidFees : "—"} />
        <StatCard tab="admin" label="Books" value={summary ? summary.totalBooks : "—"} />
      </section>

      <Card tab="academics" title="At-risk student check">
        <p className="muted" style={{ marginBottom: 12 }}>
          Flags students with attendance below 75% and 2+ failed exams.
        </p>
        {formError && <p className="form-error">{formError}</p>}
        <form className="page-form" onSubmit={handleRiskCheck}>
          <label>
            Student ID
            <input type="number" name="studentId" value={form.studentId} onChange={onChange} required />
          </label>
          <label>
            Attendance %
            <input
              type="number"
              step="0.1"
              name="attendancePercentage"
              value={form.attendancePercentage}
              onChange={onChange}
              required
            />
          </label>
          <label>
            Failed exams
            <input
              type="number"
              name="failedExamCount"
              value={form.failedExamCount}
              onChange={onChange}
              required
            />
          </label>
          <div className="page-form-actions">
            <button type="submit" className="btn-primary">Run check</button>
          </div>
        </form>
        {result && (
          <div style={{ marginTop: 16 }}>
            <p className={result.atRisk ? "form-error" : "form-success"}>
              {result.atRisk ? "At risk" : "Not at risk"} — {result.reason}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
