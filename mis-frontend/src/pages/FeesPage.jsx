import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import ErrorState from "../components/ui/ErrorState";
import Loading from "../components/ui/Loading";
import { createFee, deleteFee, getFees, updateFee } from "../services/feeService";
import "../styles/crud.css";

const empty = {
  studentId: "",
  semester: "",
  amount: "",
  dueDate: "",
  paidDate: "",
  status: "UNPAID",
};

export default function FeesPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

  const load = () => {
    setLoading(true);
    getFees()
      .then(setRows)
      .catch(() => setError("Couldn't load fees."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const reset = () => { setForm(empty); setEditId(null); setFormError(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    const payload = {
      studentId: Number(form.studentId),
      semester: Number(form.semester),
      amount: Number(form.amount),
      dueDate: form.dueDate || null,
      paidDate: form.paidDate || null,
      status: form.status,
    };
    try {
      if (editId) await updateFee(editId, payload);
      else await createFee(payload);
      reset();
      load();
    } catch {
      setFormError("Save failed.");
    }
  };

  const startEdit = (row) => {
    setEditId(row.id);
    setForm({
      studentId: row.studentId ?? "",
      semester: row.semester ?? "",
      amount: row.amount ?? "",
      dueDate: row.dueDate || "",
      paidDate: row.paidDate || "",
      status: row.paymentStatus || row.status || "UNPAID",
    });
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "studentId", label: "Student" },
    { key: "semester", label: "Sem" },
    { key: "amount", label: "Amount" },
    { key: "dueDate", label: "Due" },
    { key: "paidDate", label: "Paid" },
    {
      key: "paymentStatus",
      label: "Status",
      render: (row) => row.paymentStatus || row.status || "—",
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="row-actions">
          <button type="button" className="edit-btn" onClick={() => startEdit(row)}>Edit</button>
          <button type="button" className="delete-btn" onClick={() => deleteFee(row.id).then(load)}>Delete</button>
        </div>
      ),
    },
  ];

  if (loading && rows.length === 0) return <Loading />;
  if (error && rows.length === 0) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <div className="page-header">
        <h1>Fee Management</h1>
        <p>Track fee records and payment status.</p>
      </div>
      <Card tab="hostel" title={editId ? "Edit fee" : "Add fee"} className="page-form-card">
        {formError && <p className="form-error">{formError}</p>}
        <form className="page-form" onSubmit={handleSubmit}>
          <label>Student ID<input type="number" name="studentId" value={form.studentId} onChange={onChange} required /></label>
          <label>Semester<input type="number" name="semester" value={form.semester} onChange={onChange} required /></label>
          <label>Amount<input type="number" step="0.01" name="amount" value={form.amount} onChange={onChange} required /></label>
          <label>Due date<input type="date" name="dueDate" value={form.dueDate} onChange={onChange} /></label>
          <label>Paid date<input type="date" name="paidDate" value={form.paidDate} onChange={onChange} /></label>
          <label>Status
            <select name="status" value={form.status} onChange={onChange}>
              <option value="UNPAID">UNPAID</option>
              <option value="PAID">PAID</option>
              <option value="PARTIAL">PARTIAL</option>
            </select>
          </label>
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
