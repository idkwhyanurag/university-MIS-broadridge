import React, { useEffect, useState } from "react";
import { createEvent, getEventsForMonth } from "../services/eventService";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import { useAuth } from "../context/AuthContext";
import "./EventsPage.css";
import "../styles/crud.css";

const CAN_CREATE = { student: false, teacher: true, admin: true };

export default function EventsPage() {
  const { userId, navRole } = useAuth();
  const canCreate = CAN_CREATE[navRole] ?? false;

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    eventDate: "",
    targetAudience: "ALL",
  });

  const load = () => {
    getEventsForMonth(year, month)
      .then((data) => {
        setEvents(data);
        setError(null);
      })
      .catch(() => setError("Couldn't load events."));
  };

  useEffect(load, [year, month]);

  const changeMonth = (delta) => {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    setMonth(newMonth);
    setYear(newYear);
  };

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await createEvent({
        title: form.title,
        description: form.description,
        eventDate: form.eventDate,
        createdBy: userId,
        targetAudience: form.targetAudience,
      });
      setForm({ title: "", description: "", eventDate: "", targetAudience: "ALL" });
      load();
    } catch {
      setFormError("Could not create event.");
    }
  };

  const monthLabel = new Date(year, month - 1).toLocaleString("default", { month: "long" });

  return (
    <div>
      <h1 style={{ marginBottom: "1.5rem" }}>Events</h1>

      {canCreate && (
        <Card tab="comms" title="Create event" className="page-form-card">
          {formError && <p className="form-error">{formError}</p>}
          <form className="page-form" onSubmit={handleSubmit}>
            <label>
              Title
              <input name="title" value={form.title} onChange={onChange} required />
            </label>
            <label>
              Date
              <input type="date" name="eventDate" value={form.eventDate} onChange={onChange} required />
            </label>
            <label>
              Audience
              <select name="targetAudience" value={form.targetAudience} onChange={onChange}>
                <option value="ALL">Everyone</option>
                <option value="STUDENT">Students</option>
                <option value="FACULTY">Faculty</option>
              </select>
            </label>
            <label style={{ gridColumn: "1 / -1" }}>
              Description
              <textarea name="description" value={form.description} onChange={onChange} rows={2} />
            </label>
            <div className="page-form-actions">
              <button type="submit" className="btn-primary">Create event</button>
            </div>
          </form>
        </Card>
      )}

      <div className="events-month-nav">
        <button onClick={() => changeMonth(-1)} className="month-nav-btn">&larr; Prev</button>
        <h2>
          {monthLabel} {year}
        </h2>
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
