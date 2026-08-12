import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import ErrorState from "../components/ui/ErrorState";
import Loading from "../components/ui/Loading";
import { createSubject, deleteSubject, getSubjects } from "../services/subjectService";
import "../styles/crud.css";

const empty = {
  courseId: "",
  facultyId: "",
  subjectCode: "",
  subjectName: "",
  semester: "",
  credits: "",
};

export default function SubjectsPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

  const load = () => {
    setLoading(true);
    getSubjects()
      .then(setRows)
      .catch(() => setError("Couldn't load subjects."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await createSubject({
        courseId: form.courseId === "" ? null : Number(form.courseId),
        facultyId: form.facultyId === "" ? null : Number(form.facultyId),
        subjectCode: form.subjectCode,
        subjectName: form.subjectName,
        semester: form.semester === "" ? null : Number(form.semester),
        credits: form.credits === "" ? null : Number(form.credits),
      });
      setForm(empty);
      load();
    } catch {
      setFormError("Could not create subject.");
    }
  };

  const columns = [
    { key: "subjectId", label: "ID" },
    { key: "subjectCode", label: "Code" },
    { key: "subjectName", label: "Name" },
    { key: "courseId", label: "Course" },
    { key: "facultyId", label: "Faculty" },
    { key: "semester", label: "Sem" },
    { key: "credits", label: "Credits" },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <button type="button" className="delete-btn" onClick={() => deleteSubject(row.subjectId).then(load)}>Delete</button>
      ),
    },
  ];

  if (loading && rows.length === 0) return <Loading />;
  if (error && rows.length === 0) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <div className="page-header">
        <h1>Subjects</h1>
        <p>Subjects linked to courses and faculty.</p>
      </div>
      <Card tab="academics" title="Add subject" className="page-form-card">
        {formError && <p className="form-error">{formError}</p>}
        <form className="page-form" onSubmit={handleSubmit}>
          <label>Code<input name="subjectCode" value={form.subjectCode} onChange={onChange} required /></label>
          <label>Name<input name="subjectName" value={form.subjectName} onChange={onChange} required /></label>
          <label>Course ID<input type="number" name="courseId" value={form.courseId} onChange={onChange} /></label>
          <label>Faculty ID<input type="number" name="facultyId" value={form.facultyId} onChange={onChange} /></label>
          <label>Semester<input type="number" name="semester" value={form.semester} onChange={onChange} /></label>
          <label>Credits<input type="number" name="credits" value={form.credits} onChange={onChange} /></label>
          <div className="page-form-actions">
            <button type="submit" className="btn-primary">Create</button>
          </div>
        </form>
      </Card>
      <DataTable columns={columns} data={rows.map((r) => ({ ...r, id: r.subjectId }))} loading={loading} />
    </div>
  );
}
