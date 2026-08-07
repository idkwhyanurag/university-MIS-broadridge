import React, { useEffect, useState } from "react";
import StatCard from "../components/ui/StatCard";
import Card from "../components/ui/Card";
import { getAnalyticsSummary } from "../services/analyticsService";
import "./Dashboard.css";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAnalyticsSummary()
      .then(setSummary)
      .catch(() => setError("Couldn't reach the analytics service."));
  }, []);

  return (
    <div>
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">Records &amp; Administration overview</p>
      </div>

      <section className="stat-grid">
        <StatCard
          tab="comms"
          label="Notifications Sent"
          value={summary ? summary.totalNotificationsSent : "—"}
        />
        <StatCard
          tab="comms"
          label="Announcements Posted"
          value={summary ? summary.totalAnnouncements : "—"}
        />
        <StatCard
          tab="comms"
          label="Upcoming Events"
          value={summary ? summary.upcomingEventsCount : "—"}
        />
        <StatCard tab="academics" label="Students" value="—" hint="Awaiting Epic 1 data" />
        <StatCard tab="hostel" label="Fee Collection" value="—" hint="Awaiting Epic 3 data" />
        <StatCard tab="academics" label="Attendance" value="—" hint="Awaiting Epic 1 data" />
      </section>

      {error && (
        <p className="dashboard-error">{error}</p>
      )}

      <section className="dashboard-grid">
        <Card tab="comms" title="Recent Announcements">
          <p className="muted">Wire up the announcement feed here in the next stage.</p>
        </Card>
        <Card tab="academics" title="Attendance Summary">
          <p className="muted">Connects to Epic 1 once its endpoints are available.</p>
        </Card>
        <Card tab="hostel" title="Fee Summary">
          <p className="muted">Connects to Epic 3's fee module.</p>
        </Card>
      </section>
    </div>
  );
}
