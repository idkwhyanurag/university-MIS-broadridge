import api from "./api";

export const getFaculty = () => api.get("/faculty").then((r) => r.data);
export const createFaculty = (payload) => api.post("/faculty", payload).then((r) => r.data);
export const updateFaculty = (id, payload) => api.put(`/faculty/${id}`, payload).then((r) => r.data);
export const deleteFaculty = (id) => api.delete(`/faculty/${id}`);
