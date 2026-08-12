import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import ErrorState from "../components/ui/ErrorState";
import Loading from "../components/ui/Loading";
import { createHostelAllocation, deleteHostelAllocation, getHostelAllocations } from "../services/hostelService";
import "../styles/crud.css";

const empty = { studentId: "", roomId: "", allocationDate: "" };

export default function HostelPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

  const load = () => {
    setLoading(true);
    getHostelAllocations()
      .then(setRows)
      .catch(() => setError("Couldn't load hostel allocations."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await createHostelAllocation({
        studentId: Number(form.studentId),
        roomId: Number(form.roomId),
        allocationDate: form.allocationDate || null,
      });
      setForm(empty);
      load();
    } catch {
      setFormError("Could not create allocation.");
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "studentId", label: "Student" },
    { key: "roomNumber", label: "Room" },
    { key: "blockName", label: "Block" },
    { key: "allocationDate", label: "Allocated" },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <button type="button" className="delete-btn" onClick={() => deleteHostelAllocation(row.id).then(load)}>Delete</button>
      ),
    },
  ];

  if (loading && rows.length === 0) return <Loading />;
  if (error && rows.length === 0) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <div className="page-header">
        <h1>Hostel</h1>
        <p>Student room allocations.</p>
      </div>
      <Card tab="hostel" title="Allocate room" className="page-form-card">
        {formError && <p className="form-error">{formError}</p>}
        <form className="page-form" onSubmit={handleSubmit}>
          <label>Student ID<input type="number" name="studentId" value={form.studentId} onChange={onChange} required /></label>
          <label>Room ID<input type="number" name="roomId" value={form.roomId} onChange={onChange} required /></label>
          <label>Allocation date<input type="date" name="allocationDate" value={form.allocationDate} onChange={onChange} /></label>
          <div className="page-form-actions">
            <button type="submit" className="btn-primary">Create</button>
          </div>
        </form>
      </Card>
      <DataTable columns={columns} data={rows} loading={loading} />
    </div>
  );
}
