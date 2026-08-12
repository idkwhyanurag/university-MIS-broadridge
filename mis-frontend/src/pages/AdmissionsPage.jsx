import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import ErrorState from "../components/ui/ErrorState";
import Loading from "../components/ui/Loading";
import { createAdmission, deleteAdmission, getAdmissions, updateAdmissionStatus } from "../services/admissionService";
import "../styles/crud.css";

const empty = { applicantName: "", email: "", phone: "", program: "", department: "" };

export default function AdmissionsPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

  const load = () => {
    setLoading(true);
    getAdmissions()
      .then(setRows)
      .catch(() => setError("Couldn't load admissions."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await createAdmission(form);
      setForm(empty);
      load();
    } catch {
      setFormError("Could not create admission.");
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "applicantName", label: "Applicant" },
    { key: "email", label: "Email" },
    { key: "program", label: "Program" },
    { key: "department", label: "Department" },
    { key: "status", label: "Status" },
    { key: "applicationDate", label: "Applied" },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="row-actions">
          <button type="button" className="edit-btn" onClick={() => updateAdmissionStatus(row.id, "APPROVED").then(load)}>Approve</button>
          <button type="button" className="delete-btn" onClick={() => deleteAdmission(row.id).then(load)}>Delete</button>
        </div>
      ),
    },
  ];

  if (loading && rows.length === 0) return <Loading />;
  if (error && rows.length === 0) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <div className="page-header">
        <h1>Admissions</h1>
        <p>Track applications and update status.</p>
      </div>
      <Card tab="academics" title="New application" className="page-form-card">
        {formError && <p className="form-error">{formError}</p>}
        <form className="page-form" onSubmit={handleSubmit}>
          <label>Applicant<input name="applicantName" value={form.applicantName} onChange={onChange} required /></label>
          <label>Email<input type="email" name="email" value={form.email} onChange={onChange} required /></label>
          <label>Phone<input name="phone" value={form.phone} onChange={onChange} /></label>
          <label>Program<input name="program" value={form.program} onChange={onChange} required /></label>
          <label>Department<input name="department" value={form.department} onChange={onChange} /></label>
          <div className="page-form-actions">
            <button type="submit" className="btn-primary">Create</button>
          </div>
        </form>
      </Card>
      <DataTable columns={columns} data={rows} loading={loading} />
    </div>
  );
}
