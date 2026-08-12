import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import ErrorState from "../components/ui/ErrorState";
import Loading from "../components/ui/Loading";
import { createGrade, deleteGrade, getGrades } from "../services/gradeService";
import "../styles/crud.css";

const empty = { examId: "", studentId: "", marksObtained: "", grade: "" };

export default function GradesPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

  const load = () => {
    setLoading(true);
    getGrades()
      .then(setRows)
      .catch(() => setError("Couldn't load grades."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await createGrade({
        examId: Number(form.examId),
        studentId: Number(form.studentId),
        marksObtained: form.marksObtained === "" ? null : Number(form.marksObtained),
        grade: form.grade,
      });
      setForm(empty);
      load();
    } catch {
      setFormError("Could not create grade.");
    }
  };

  const columns = [
    { key: "gradeId", label: "ID" },
    { key: "examId", label: "Exam" },
    { key: "studentId", label: "Student" },
    { key: "marksObtained", label: "Marks" },
    { key: "grade", label: "Grade" },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <button type="button" className="delete-btn" onClick={() => deleteGrade(row.gradeId).then(load)}>Delete</button>
      ),
    },
  ];

  if (loading && rows.length === 0) return <Loading />;
  if (error && rows.length === 0) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <div className="page-header">
        <h1>Grades</h1>
        <p>Record exam marks and letter grades.</p>
      </div>
      <Card tab="academics" title="Add grade" className="page-form-card">
        {formError && <p className="form-error">{formError}</p>}
        <form className="page-form" onSubmit={handleSubmit}>
          <label>Exam ID<input type="number" name="examId" value={form.examId} onChange={onChange} required /></label>
          <label>Student ID<input type="number" name="studentId" value={form.studentId} onChange={onChange} required /></label>
          <label>Marks<input type="number" name="marksObtained" value={form.marksObtained} onChange={onChange} /></label>
          <label>Grade<input name="grade" value={form.grade} onChange={onChange} /></label>
          <div className="page-form-actions">
            <button type="submit" className="btn-primary">Create</button>
          </div>
        </form>
      </Card>
      <DataTable columns={columns} data={rows.map((r) => ({ ...r, id: r.gradeId }))} loading={loading} />
    </div>
  );
}
