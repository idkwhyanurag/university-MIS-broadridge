import api from "./api";

export const getDepartments = () => api.get("/departments").then((r) => r.data);
export const createDepartment = (payload) => api.post("/departments", payload).then((r) => r.data);
export const updateDepartment = (id, payload) =>
  api.put(`/departments/${id}`, payload).then((r) => r.data);
export const deleteDepartment = (id) => api.delete(`/departments/${id}`);
