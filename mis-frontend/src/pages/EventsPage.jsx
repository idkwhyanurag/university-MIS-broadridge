import React, { useEffect, useState } from "react";
import { getEventsForMonth } from "../services/eventService";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import "./EventsPage.css";

export default function EventsPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEventsForMonth(year, month)
      .then((data) => {
        setEvents(data);
        setError(null);
      })
      .catch(() => setError("Couldn't load events."));
  }, [year, month]);

  const changeMonth = (delta) => {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth > 12) { newMonth = 1; newYear += 1; }
    else if (newMonth < 1) { newMonth = 12; newYear -= 1; }
    setMonth(newMonth);
    setYear(newYear);
  };

  const monthLabel = new Date(year, month - 1).toLocaleString("default", { month: "long" });

  return (
    <div>
      <h1 style={{ marginBottom: "1.5rem" }}>Events</h1>

      <div className="events-month-nav">
        <button onClick={() => changeMonth(-1)} className="month-nav-btn">&larr; Prev</button>
        <h2>{monthLabel} {year}</h2>
        <button onClick={() => changeMonth(1)} className="month-nav-btn">Next &rarr;</button>
      </div>

      {error && <p className="dashboard-error">{error}</p>}

      {events.length === 0 && !error && (
        <EmptyState title="No events this month" description="Events scheduled for this month will appear here." />
      )}

      <div className="events-list">
        {events.map((ev) => (
          <Card tab="comms" key={ev.id}>
            <div className="event-row">
              <div className="event-date mono">{ev.eventDate}</div>
              <div>
                <h3>{ev.title}</h3>
                {ev.description && <p className="muted">{ev.description}</p>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
