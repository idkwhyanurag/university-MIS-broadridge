import api from "./api";

export const getBooks = () => api.get("/library/books").then((r) => r.data);
export const createBook = (payload) => api.post("/library/books", payload).then((r) => r.data);
export const updateBook = (id, payload) =>
  api.put(`/library/books/${id}`, payload).then((r) => r.data);
export const deleteBook = (id) => api.delete(`/library/books/${id}`);
export const issueBook = (payload) => api.post("/library/issue", payload).then((r) => r.data);
export const returnBook = (issueId) =>
  api.put(`/library/return/${issueId}`).then((r) => r.data);
