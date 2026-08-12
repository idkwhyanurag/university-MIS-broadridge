import React, { useState } from "react";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import { getAttendanceByStudent, markAttendance } from "../services/attendanceService";
import "../styles/crud.css";

const empty = {
  studentId: "",
  courseId: "",
  attendanceDate: "",
  status: "PRESENT",
};

export default function AttendancePage() {
  const [form, setForm] = useState(empty);
  const [lookupId, setLookupId] = useState("");
  const [rows, setRows] = useState([]);
  const [formError, setFormError] = useState(null);
  const [lookupError, setLookupError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await markAttendance({
        studentId: Number(form.studentId),
        courseId: Number(form.courseId),
        attendanceDate: form.attendanceDate,
        status: form.status,
      });
      setForm(empty);
      if (lookupId) handleLookup();
    } catch {
      setFormError("Could not mark attendance.");
    }
  };

  const handleLookup = async (e) => {
    if (e) e.preventDefault();
    if (!lookupId) return;
    setLoading(true);
    setLookupError(null);
    try {
      const data = await getAttendanceByStudent(Number(lookupId));
      setRows(data);
    } catch {
      setLookupError("Couldn't load attendance for that student.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "studentId", label: "Student" },
    { key: "courseId", label: "Course" },
    { key: "attendanceDate", label: "Date" },
    { key: "status", label: "Status" },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Attendance</h1>
        <p>Mark attendance and look up records by student.</p>
      </div>

      <Card tab="academics" title="Mark attendance" className="page-form-card">
        {formError && <p className="form-error">{formError}</p>}
        <form className="page-form" onSubmit={handleSubmit}>
          <label>Student ID<input type="number" name="studentId" value={form.studentId} onChange={onChange} required /></label>
          <label>Course ID<input type="number" name="courseId" value={form.courseId} onChange={onChange} required /></label>
          <label>Date<input type="date" name="attendanceDate" value={form.attendanceDate} onChange={onChange} required /></label>
          <label>Status
            <select name="status" value={form.status} onChange={onChange}>
              <option value="PRESENT">PRESENT</option>
              <option value="ABSENT">ABSENT</option>
              <option value="LATE">LATE</option>
              <option value="EXCUSED">EXCUSED</option>
            </select>
          </label>
          <div className="page-form-actions">
            <button type="submit" className="btn-primary">Mark</button>
          </div>
        </form>
      </Card>

      <Card tab="academics" title="Lookup by student" className="page-form-card">
        <form className="page-form" onSubmit={handleLookup}>
          <label>Student ID<input type="number" value={lookupId} onChange={(e) => setLookupId(e.target.value)} required /></label>
          <div className="page-form-actions">
            <button type="submit" className="btn-primary">Load</button>
          </div>
        </form>
        {lookupError && <p className="form-error" style={{ marginTop: 12 }}>{lookupError}</p>}
      </Card>

      <DataTable columns={columns} data={rows} loading={loading} />
    </div>
  );
}
