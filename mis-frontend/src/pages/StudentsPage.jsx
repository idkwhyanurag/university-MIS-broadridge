import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import ErrorState from "../components/ui/ErrorState";
import Loading from "../components/ui/Loading";
import { createStudent, deleteStudent, getStudents, updateStudent } from "../services/studentService";
import "../styles/crud.css";

const empty = {
  enrollmentNumber: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  department: "",
  semester: "",
  cgpa: "",
};

export default function StudentsPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

  const load = () => {
    setLoading(true);
    getStudents()
      .then(setRows)
      .catch(() => setError("Couldn't load students."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const reset = () => {
    setForm(empty);
    setEditId(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    const payload = {
      ...form,
      semester: form.semester === "" ? null : Number(form.semester),
      cgpa: form.cgpa === "" ? null : Number(form.cgpa),
    };
    try {
      if (editId) await updateStudent(editId, payload);
      else await createStudent(payload);
      reset();
      load();
    } catch {
      setFormError("Save failed. Check required fields.");
    }
  };

  const startEdit = (row) => {
    setEditId(row.id);
    setForm({
      enrollmentNumber: row.enrollmentNumber || "",
      firstName: row.firstName || "",
      lastName: row.lastName || "",
      email: row.email || "",
      phone: row.phone || "",
      department: row.department || "",
      semester: row.semester ?? "",
      cgpa: row.cgpa ?? "",
    });
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "enrollmentNumber", label: "Enrollment" },
    { key: "firstName", label: "First" },
    { key: "lastName", label: "Last" },
    { key: "email", label: "Email" },
    { key: "department", label: "Dept" },
    { key: "semester", label: "Sem" },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="row-actions">
          <button type="button" className="edit-btn" onClick={() => startEdit(row)}>Edit</button>
          <button type="button" className="delete-btn" onClick={() => deleteStudent(row.id).then(load)}>Delete</button>
        </div>
      ),
    },
  ];

  if (loading && rows.length === 0) return <Loading />;
  if (error && rows.length === 0) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <div className="page-header">
        <h1>Students</h1>
        <p>Create and manage student records.</p>
      </div>

      <Card tab="academics" title={editId ? "Edit student" : "Add student"} className="page-form-card">
        {formError && <p className="form-error">{formError}</p>}
        <form className="page-form" onSubmit={handleSubmit}>
          <label>Enrollment<input name="enrollmentNumber" value={form.enrollmentNumber} onChange={onChange} required /></label>
          <label>First name<input name="firstName" value={form.firstName} onChange={onChange} required /></label>
          <label>Last name<input name="lastName" value={form.lastName} onChange={onChange} /></label>
          <label>Email<input type="email" name="email" value={form.email} onChange={onChange} required /></label>
          <label>Phone<input name="phone" value={form.phone} onChange={onChange} /></label>
          <label>Department<input name="department" value={form.department} onChange={onChange} /></label>
          <label>Semester<input type="number" name="semester" value={form.semester} onChange={onChange} /></label>
          <label>CGPA<input type="number" step="0.01" name="cgpa" value={form.cgpa} onChange={onChange} /></label>
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
