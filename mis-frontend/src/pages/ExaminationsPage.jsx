import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import ErrorState from "../components/ui/ErrorState";
import Loading from "../components/ui/Loading";
import { createExamination, deleteExamination, getExaminations } from "../services/examinationService";
import "../styles/crud.css";

const empty = { subjectId: "", examType: "", examDate: "", totalMarks: "" };

export default function ExaminationsPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

  const load = () => {
    setLoading(true);
    getExaminations()
      .then(setRows)
      .catch(() => setError("Couldn't load examinations."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await createExamination({
        subjectId: Number(form.subjectId),
        examType: form.examType,
        examDate: form.examDate || null,
        totalMarks: form.totalMarks === "" ? null : Number(form.totalMarks),
      });
      setForm(empty);
      load();
    } catch {
      setFormError("Could not create examination.");
    }
  };

  const columns = [
    { key: "examinationId", label: "ID" },
    { key: "subjectId", label: "Subject" },
    { key: "examType", label: "Type" },
    { key: "examDate", label: "Date" },
    { key: "totalMarks", label: "Total" },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <button type="button" className="delete-btn" onClick={() => deleteExamination(row.examinationId).then(load)}>Delete</button>
      ),
    },
  ];

  if (loading && rows.length === 0) return <Loading />;
  if (error && rows.length === 0) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <div className="page-header">
        <h1>Examinations</h1>
        <p>Schedule and manage exams.</p>
      </div>
      <Card tab="academics" title="Add examination" className="page-form-card">
        {formError && <p className="form-error">{formError}</p>}
        <form className="page-form" onSubmit={handleSubmit}>
          <label>Subject ID<input type="number" name="subjectId" value={form.subjectId} onChange={onChange} required /></label>
          <label>Type<input name="examType" value={form.examType} onChange={onChange} required /></label>
          <label>Date<input type="date" name="examDate" value={form.examDate} onChange={onChange} /></label>
          <label>Total marks<input type="number" name="totalMarks" value={form.totalMarks} onChange={onChange} /></label>
          <div className="page-form-actions">
            <button type="submit" className="btn-primary">Create</button>
          </div>
        </form>
      </Card>
      <DataTable columns={columns} data={rows.map((r) => ({ ...r, id: r.examinationId }))} loading={loading} />
    </div>
  );
}
