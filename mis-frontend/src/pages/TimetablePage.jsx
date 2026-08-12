import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import ErrorState from "../components/ui/ErrorState";
import Loading from "../components/ui/Loading";
import { createTimetableEntry, getTimetable } from "../services/timetableService";
import "../styles/crud.css";

const empty = {
  courseId: "",
  dayOfWeek: "MONDAY",
  startTime: "",
  endTime: "",
  room: "",
  faculty: "",
};

export default function TimetablePage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

  const load = () => {
    setLoading(true);
    getTimetable()
      .then(setRows)
      .catch(() => setError("Couldn't load timetable."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await createTimetableEntry({
        ...form,
        courseId: Number(form.courseId),
        startTime: form.startTime || null,
        endTime: form.endTime || null,
      });
      setForm(empty);
      load();
    } catch {
      setFormError("Could not create timetable entry.");
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "courseId", label: "Course" },
    { key: "dayOfWeek", label: "Day" },
    { key: "startTime", label: "Start" },
    { key: "endTime", label: "End" },
    { key: "room", label: "Room" },
    { key: "faculty", label: "Faculty" },
  ];

  if (loading && rows.length === 0) return <Loading />;
  if (error && rows.length === 0) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <div className="page-header">
        <h1>Timetable</h1>
        <p>Schedule course sessions by day and time.</p>
      </div>
      <Card tab="academics" title="Add slot" className="page-form-card">
        {formError && <p className="form-error">{formError}</p>}
        <form className="page-form" onSubmit={handleSubmit}>
          <label>Course ID<input type="number" name="courseId" value={form.courseId} onChange={onChange} required /></label>
          <label>Day
            <select name="dayOfWeek" value={form.dayOfWeek} onChange={onChange}>
              {["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>
          <label>Start<input type="time" name="startTime" value={form.startTime} onChange={onChange} /></label>
          <label>End<input type="time" name="endTime" value={form.endTime} onChange={onChange} /></label>
          <label>Room<input name="room" value={form.room} onChange={onChange} /></label>
          <label>Faculty<input name="faculty" value={form.faculty} onChange={onChange} /></label>
          <div className="page-form-actions">
            <button type="submit" className="btn-primary">Create</button>
          </div>
        </form>
      </Card>
      <DataTable columns={columns} data={rows} loading={loading} />
    </div>
  );
}
