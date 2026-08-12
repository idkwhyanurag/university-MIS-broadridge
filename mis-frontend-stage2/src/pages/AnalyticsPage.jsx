import React, { useEffect, useState } from "react";
import { getAnalyticsSummary } from "../services/analyticsService";
import StatCard from "../components/ui/StatCard";
import Card from "../components/ui/Card";

export default function AnalyticsPage() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAnalyticsSummary()
      .then(setSummary)
      .catch(() => setError("Couldn't reach the analytics service."));
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: "1.5rem" }}>Analytics</h1>

      {error && <p className="dashboard-error">{error}</p>}

      <section className="stat-grid" style={{ marginBottom: "2rem" }}>
        <StatCard tab="comms" label="Notifications Sent" value={summary ? summary.totalNotificationsSent : "—"} />
        <StatCard tab="comms" label="Announcements Posted" value={summary ? summary.totalAnnouncements : "—"} />
        <StatCard tab="comms" label="Upcoming Events" value={summary ? summary.upcomingEventsCount : "—"} />
      </section>

      <Card tab="academics" title="At-risk student check">
        <p className="muted">
          The backend exposes a rule-based at-risk check (attendance below 75% with 2+ failed exams)
          at <code className="mono">POST /api/analytics/risk-check</code>. Wiring this into a form here
          is a good next addition once Epic 1's attendance/exam data is available to pull real inputs from.
        </p>
      </Card>
    </div>
  );
}
