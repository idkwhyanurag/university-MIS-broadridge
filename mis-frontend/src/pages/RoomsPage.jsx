import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import ErrorState from "../components/ui/ErrorState";
import Loading from "../components/ui/Loading";
import { createRoom, deleteRoom, getRooms, updateRoom } from "../services/roomService";
import "../styles/crud.css";

const empty = { roomNumber: "", blockName: "", capacity: "", occupied: "0" };

export default function RoomsPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

  const load = () => {
    setLoading(true);
    getRooms()
      .then(setRows)
      .catch(() => setError("Couldn't load rooms."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const reset = () => { setForm(empty); setEditId(null); setFormError(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    const payload = {
      roomNumber: form.roomNumber,
      blockName: form.blockName,
      capacity: Number(form.capacity),
      occupied: Number(form.occupied || 0),
    };
    try {
      if (editId) await updateRoom(editId, payload);
      else await createRoom(payload);
      reset();
      load();
    } catch {
      setFormError("Save failed.");
    }
  };

  const startEdit = (row) => {
    setEditId(row.id);
    setForm({
      roomNumber: row.roomNumber || "",
      blockName: row.blockName || "",
      capacity: row.capacity ?? "",
      occupied: row.occupied ?? 0,
    });
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "roomNumber", label: "Room" },
    { key: "blockName", label: "Block" },
    { key: "capacity", label: "Capacity" },
    { key: "occupied", label: "Occupied" },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="row-actions">
          <button type="button" className="edit-btn" onClick={() => startEdit(row)}>Edit</button>
          <button type="button" className="delete-btn" onClick={() => deleteRoom(row.id).then(load)}>Delete</button>
        </div>
      ),
    },
  ];

  if (loading && rows.length === 0) return <Loading />;
  if (error && rows.length === 0) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <div className="page-header">
        <h1>Rooms</h1>
        <p>Hostel room inventory.</p>
      </div>
      <Card tab="hostel" title={editId ? "Edit room" : "Add room"} className="page-form-card">
        {formError && <p className="form-error">{formError}</p>}
        <form className="page-form" onSubmit={handleSubmit}>
          <label>Room number<input name="roomNumber" value={form.roomNumber} onChange={onChange} required /></label>
          <label>Block<input name="blockName" value={form.blockName} onChange={onChange} required /></label>
          <label>Capacity<input type="number" name="capacity" value={form.capacity} onChange={onChange} required /></label>
          <label>Occupied<input type="number" name="occupied" value={form.occupied} onChange={onChange} /></label>
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
