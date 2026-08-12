import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import ErrorState from "../components/ui/ErrorState";
import Loading from "../components/ui/Loading";
import { createInventoryItem, deleteInventoryItem, getInventory } from "../services/inventoryService";
import "../styles/crud.css";

const empty = { itemName: "", quantity: "", supplier: "", purchaseDate: "" };

export default function InventoryPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

  const load = () => {
    setLoading(true);
    getInventory()
      .then(setRows)
      .catch(() => setError("Couldn't load inventory."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await createInventoryItem({
        itemName: form.itemName,
        quantity: Number(form.quantity),
        supplier: form.supplier,
        purchaseDate: form.purchaseDate || null,
      });
      setForm(empty);
      load();
    } catch {
      setFormError("Could not create inventory item.");
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "itemName", label: "Item" },
    { key: "quantity", label: "Qty" },
    { key: "supplier", label: "Supplier" },
    { key: "purchaseDate", label: "Purchased" },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <button type="button" className="delete-btn" onClick={() => deleteInventoryItem(row.id).then(load)}>Delete</button>
      ),
    },
  ];

  if (loading && rows.length === 0) return <Loading />;
  if (error && rows.length === 0) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <div className="page-header">
        <h1>Inventory</h1>
        <p>Campus inventory items and suppliers.</p>
      </div>
      <Card tab="admin" title="Add item" className="page-form-card">
        {formError && <p className="form-error">{formError}</p>}
        <form className="page-form" onSubmit={handleSubmit}>
          <label>Item name<input name="itemName" value={form.itemName} onChange={onChange} required /></label>
          <label>Quantity<input type="number" name="quantity" value={form.quantity} onChange={onChange} required /></label>
          <label>Supplier<input name="supplier" value={form.supplier} onChange={onChange} /></label>
          <label>Purchase date<input type="date" name="purchaseDate" value={form.purchaseDate} onChange={onChange} /></label>
          <div className="page-form-actions">
            <button type="submit" className="btn-primary">Create</button>
          </div>
        </form>
      </Card>
      <DataTable columns={columns} data={rows} loading={loading} />
    </div>
  );
}
