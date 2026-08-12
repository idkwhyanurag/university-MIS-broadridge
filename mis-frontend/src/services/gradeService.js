import api from "./api";

export const getGrades = () => api.get("/grades").then((r) => r.data);
export const createGrade = (payload) => api.post("/grades", payload).then((r) => r.data);
export const updateGrade = (id, payload) => api.put(`/grades/${id}`, payload).then((r) => r.data);
export const deleteGrade = (id) => api.delete(`/grades/${id}`);
