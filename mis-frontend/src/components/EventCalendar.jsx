import React, { useEffect, useState } from "react";
import { getEventsForMonth } from "../services/eventService";

// Usage: <EventCalendar />
// Simple month-view list. Swap in a library like react-calendar or FullCalendar
// later if you want an actual visual calendar grid - this keeps the dependency
// list small for now and still demos the feature end-to-end.
export default function EventCalendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // JS months are 0-indexed
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEventsForMonth(year, month).then(setEvents);
  }, [year, month]);

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

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => changeMonth(-1)}>&larr; Prev</button>
        <h2>
          {new Date(year, month - 1).toLocaleString("default", { month: "long" })} {year}
        </h2>
        <button onClick={() => changeMonth(1)}>Next &rarr;</button>
      </div>

      {events.length === 0 && <p>No events this month.</p>}

      <ul>
        {events.map((ev) => (
          <li key={ev.id}>
            <strong>{ev.eventDate}</strong> — {ev.title}
            {ev.description && <p>{ev.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
