import React, { useEffect, useState } from "react";
import { getAnalyticsSummary } from "../services/analyticsService";

// Usage: <AnalyticsDashboard />
// Once teammates expose their own summary endpoints (student count, fee %,
// exam pass rate), extend getAnalyticsSummary() on the backend to merge them
// in, and this component will pick them up automatically - no changes needed here
// beyond adding more <StatCard /> entries below.
export default function AnalyticsDashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    getAnalyticsSummary().then(setSummary);
  }, []);

  if (!summary) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h2>Analytics Overview</h2>
      <div style={{ display: "flex", gap: "1rem" }}>
        <StatCard label="Notifications Sent" value={summary.totalNotificationsSent} />
        <StatCard label="Announcements Posted" value={summary.totalAnnouncements} />
        <StatCard label="Upcoming Events" value={summary.upcomingEventsCount} />
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{ border: "1px solid #ddd", padding: "1rem", flex: 1, textAlign: "center" }}>
      <h3 style={{ margin: 0, fontSize: "2rem" }}>{value}</h3>
      <p style={{ margin: 0, color: "#666" }}>{label}</p>
    </div>
  );
}
