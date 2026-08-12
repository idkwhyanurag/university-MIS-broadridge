import api from "./api";

export const getSubjects = () => api.get("/subjects").then((r) => r.data);
export const createSubject = (payload) => api.post("/subjects", payload).then((r) => r.data);
export const updateSubject = (id, payload) => api.put(`/subjects/${id}`, payload).then((r) => r.data);
export const deleteSubject = (id) => api.delete(`/subjects/${id}`);
