import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import ErrorState from "../components/ui/ErrorState";
import Loading from "../components/ui/Loading";
import { createBook, deleteBook, getBooks, issueBook, returnBook } from "../services/libraryService";
import "../styles/crud.css";

const bookEmpty = { title: "", author: "", isbn: "", quantity: "" };
const issueEmpty = { studentId: "", bookId: "", issueDate: "", returnDate: "", status: "ISSUED" };

export default function LibraryPage() {
  const [rows, setRows] = useState([]);
  const [bookForm, setBookForm] = useState(bookEmpty);
  const [issueForm, setIssueForm] = useState(issueEmpty);
  const [returnId, setReturnId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [message, setMessage] = useState(null);

  const load = () => {
    setLoading(true);
    getBooks()
      .then(setRows)
      .catch(() => setError("Couldn't load books."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onBookChange = (e) => setBookForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const onIssueChange = (e) => setIssueForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCreateBook = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await createBook({
        ...bookForm,
        quantity: Number(bookForm.quantity),
      });
      setBookForm(bookEmpty);
      load();
    } catch {
      setFormError("Could not create book.");
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await issueBook({
        studentId: Number(issueForm.studentId),
        bookId: Number(issueForm.bookId),
        issueDate: issueForm.issueDate || null,
        returnDate: issueForm.returnDate || null,
        status: issueForm.status,
      });
      setIssueForm(issueEmpty);
      setMessage("Book issued.");
      load();
    } catch {
      setMessage("Issue failed.");
    }
  };

  const handleReturn = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await returnBook(Number(returnId));
      setReturnId("");
      setMessage("Book returned.");
      load();
    } catch {
      setMessage("Return failed.");
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "author", label: "Author" },
    { key: "isbn", label: "ISBN" },
    { key: "quantity", label: "Qty" },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <button type="button" className="delete-btn" onClick={() => deleteBook(row.id).then(load)}>Delete</button>
      ),
    },
  ];

  if (loading && rows.length === 0) return <Loading />;
  if (error && rows.length === 0) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <div className="page-header">
        <h1>Library</h1>
        <p>Catalog books, issue, and return.</p>
      </div>

      <Card tab="admin" title="Add book" className="page-form-card">
        {formError && <p className="form-error">{formError}</p>}
        <form className="page-form" onSubmit={handleCreateBook}>
          <label>Title<input name="title" value={bookForm.title} onChange={onBookChange} required /></label>
          <label>Author<input name="author" value={bookForm.author} onChange={onBookChange} /></label>
          <label>ISBN<input name="isbn" value={bookForm.isbn} onChange={onBookChange} /></label>
          <label>Quantity<input type="number" name="quantity" value={bookForm.quantity} onChange={onBookChange} required /></label>
          <div className="page-form-actions">
            <button type="submit" className="btn-primary">Create</button>
          </div>
        </form>
      </Card>

      <Card tab="admin" title="Issue book" className="page-form-card">
        {message && <p className="form-success">{message}</p>}
        <form className="page-form" onSubmit={handleIssue}>
          <label>Student ID<input type="number" name="studentId" value={issueForm.studentId} onChange={onIssueChange} required /></label>
          <label>Book ID<input type="number" name="bookId" value={issueForm.bookId} onChange={onIssueChange} required /></label>
          <label>Issue date<input type="date" name="issueDate" value={issueForm.issueDate} onChange={onIssueChange} /></label>
          <label>Return date<input type="date" name="returnDate" value={issueForm.returnDate} onChange={onIssueChange} /></label>
          <div className="page-form-actions">
            <button type="submit" className="btn-primary">Issue</button>
          </div>
        </form>
        <form className="page-form" style={{ marginTop: 12 }} onSubmit={handleReturn}>
          <label>Issue ID to return<input type="number" value={returnId} onChange={(e) => setReturnId(e.target.value)} required /></label>
          <div className="page-form-actions">
            <button type="submit" className="btn-secondary">Return</button>
          </div>
        </form>
      </Card>

      <DataTable columns={columns} data={rows} loading={loading} />
    </div>
  );
}
