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
        <StatCard
          tab="academics"
          label="Students"
          value={summary ? summary.totalStudents : "—"}
        />
        <StatCard
          tab="hostel"
          label="Unpaid Fees"
          value={summary ? summary.unpaidFees : "—"}
        />
        <StatCard
          tab="admin"
          label="Books"
          value={summary ? summary.totalBooks : "—"}
        />
      </section>

      {error && <p className="dashboard-error">{error}</p>}

      <section className="dashboard-grid">
        <Card tab="comms" title="Communication pulse">
          <p className="muted">
            {summary
              ? `${summary.totalAnnouncements} announcements and ${summary.upcomingEventsCount} upcoming events.`
              : "Loading communication summary…"}
          </p>
        </Card>
        <Card tab="academics" title="Enrollment">
          <p className="muted">
            {summary ? `${summary.totalStudents} students currently on record.` : "Loading enrollment…"}
          </p>
        </Card>
        <Card tab="hostel" title="Fee Summary">
          <p className="muted">
            {summary ? `${summary.unpaidFees} unpaid fee records.` : "Loading fee summary…"}
          </p>
        </Card>
      </section>
    </div>
  );
}
