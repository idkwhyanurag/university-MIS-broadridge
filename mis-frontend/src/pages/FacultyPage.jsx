import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import ErrorState from "../components/ui/ErrorState";
import Loading from "../components/ui/Loading";
import { createFaculty, deleteFaculty, getFaculty } from "../services/facultyService";
import "../styles/crud.css";

const empty = {
  departmentId: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  designation: "",
  joiningDate: "",
};

export default function FacultyPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

  const load = () => {
    setLoading(true);
    getFaculty()
      .then(setRows)
      .catch(() => setError("Couldn't load faculty."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await createFaculty({
        ...form,
        departmentId: Number(form.departmentId),
        joiningDate: form.joiningDate || null,
      });
      setForm(empty);
      load();
    } catch {
      setFormError("Could not create faculty member.");
    }
  };

  const columns = [
    { key: "facultyId", label: "ID" },
    { key: "firstName", label: "First" },
    { key: "lastName", label: "Last" },
    { key: "email", label: "Email" },
    { key: "designation", label: "Designation" },
    { key: "departmentId", label: "Dept ID" },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <button type="button" className="delete-btn" onClick={() => deleteFaculty(row.facultyId).then(load)}>Delete</button>
      ),
    },
  ];

  if (loading && rows.length === 0) return <Loading />;
  if (error && rows.length === 0) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <div className="page-header">
        <h1>Faculty</h1>
        <p>Faculty directory and appointments.</p>
      </div>
      <Card tab="academics" title="Add faculty" className="page-form-card">
        {formError && <p className="form-error">{formError}</p>}
        <form className="page-form" onSubmit={handleSubmit}>
          <label>Dept ID<input type="number" name="departmentId" value={form.departmentId} onChange={onChange} required /></label>
          <label>First name<input name="firstName" value={form.firstName} onChange={onChange} required /></label>
          <label>Last name<input name="lastName" value={form.lastName} onChange={onChange} required /></label>
          <label>Email<input type="email" name="email" value={form.email} onChange={onChange} required /></label>
          <label>Phone<input name="phone" value={form.phone} onChange={onChange} /></label>
          <label>Designation<input name="designation" value={form.designation} onChange={onChange} required /></label>
          <label>Joining date<input type="date" name="joiningDate" value={form.joiningDate} onChange={onChange} /></label>
          <div className="page-form-actions">
            <button type="submit" className="btn-primary">Create</button>
          </div>
        </form>
      </Card>
      <DataTable columns={columns} data={rows.map((r) => ({ ...r, id: r.facultyId }))} loading={loading} />
    </div>
  );
}
