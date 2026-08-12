import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import ErrorState from "../components/ui/ErrorState";
import Loading from "../components/ui/Loading";
import { createCourse, deleteCourse, getCourses, updateCourse } from "../services/courseService";
import "../styles/crud.css";

const empty = { courseCode: "", courseName: "", credits: "", department: "", semester: "" };

export default function CoursesPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

  const load = () => {
    setLoading(true);
    getCourses()
      .then(setRows)
      .catch(() => setError("Couldn't load courses."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const reset = () => { setForm(empty); setEditId(null); setFormError(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    const payload = {
      ...form,
      credits: form.credits === "" ? null : Number(form.credits),
      semester: form.semester === "" ? null : Number(form.semester),
    };
    try {
      if (editId) await updateCourse(editId, payload);
      else await createCourse(payload);
      reset();
      load();
    } catch {
      setFormError("Save failed.");
    }
  };

  const startEdit = (row) => {
    setEditId(row.id);
    setForm({
      courseCode: row.courseCode || "",
      courseName: row.courseName || "",
      credits: row.credits ?? "",
      department: row.department || "",
      semester: row.semester ?? "",
    });
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "courseCode", label: "Code" },
    { key: "courseName", label: "Name" },
    { key: "credits", label: "Credits" },
    { key: "department", label: "Department" },
    { key: "semester", label: "Semester" },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="row-actions">
          <button type="button" className="edit-btn" onClick={() => startEdit(row)}>Edit</button>
          <button type="button" className="delete-btn" onClick={() => deleteCourse(row.id).then(load)}>Delete</button>
        </div>
      ),
    },
  ];

  if (loading && rows.length === 0) return <Loading />;
  if (error && rows.length === 0) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <div className="page-header">
        <h1>Courses</h1>
        <p>Manage course catalog entries.</p>
      </div>
      <Card tab="academics" title={editId ? "Edit course" : "Add course"} className="page-form-card">
        {formError && <p className="form-error">{formError}</p>}
        <form className="page-form" onSubmit={handleSubmit}>
          <label>Code<input name="courseCode" value={form.courseCode} onChange={onChange} required /></label>
          <label>Name<input name="courseName" value={form.courseName} onChange={onChange} required /></label>
          <label>Credits<input type="number" name="credits" value={form.credits} onChange={onChange} /></label>
          <label>Department<input name="department" value={form.department} onChange={onChange} /></label>
          <label>Semester<input type="number" name="semester" value={form.semester} onChange={onChange} /></label>
          <div className="page-form-actions">
            <button type="submit" className="btn-primary">{editId ? "Update" : "Create"}</button>
            {editId && <button type="button" className="btn-secondary" onClick={reset}>Cancel</button>}
          </div>
        </form>
      </Card>
      <DataTable columns={columns} data={rows} loading={loading} />
    </div>
  );
}
