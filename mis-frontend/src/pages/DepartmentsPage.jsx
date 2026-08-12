import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import ErrorState from "../components/ui/ErrorState";
import Loading from "../components/ui/Loading";
import { createDepartment, deleteDepartment, getDepartments } from "../services/departmentService";
import "../styles/crud.css";

const empty = { departmentName: "", departmentCode: "" };

export default function DepartmentsPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

  const load = () => {
    setLoading(true);
    getDepartments()
      .then(setRows)
      .catch(() => setError("Couldn't load departments."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await createDepartment(form);
      setForm(empty);
      load();
    } catch {
      setFormError("Could not create department.");
    }
  };

  const columns = [
    { key: "departmentId", label: "ID", render: (r) => r.departmentId },
    { key: "departmentCode", label: "Code" },
    { key: "departmentName", label: "Name" },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <button type="button" className="delete-btn" onClick={() => deleteDepartment(row.departmentId).then(load)}>Delete</button>
      ),
    },
  ];

  if (loading && rows.length === 0) return <Loading />;
  if (error && rows.length === 0) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <div className="page-header">
        <h1>Departments</h1>
        <p>Academic departments registry.</p>
      </div>
      <Card tab="academics" title="Add department" className="page-form-card">
        {formError && <p className="form-error">{formError}</p>}
        <form className="page-form" onSubmit={handleSubmit}>
          <label>Code<input name="departmentCode" value={form.departmentCode} onChange={onChange} required /></label>
          <label>Name<input name="departmentName" value={form.departmentName} onChange={onChange} required /></label>
          <div className="page-form-actions">
            <button type="submit" className="btn-primary">Create</button>
          </div>
        </form>
      </Card>
      <DataTable columns={columns} data={rows.map((r) => ({ ...r, id: r.departmentId }))} loading={loading} />
    </div>
  );
}
