import api from "./api";

export const getExaminations = () => api.get("/examinations").then((r) => r.data);
export const createExamination = (payload) =>
  api.post("/examinations", payload).then((r) => r.data);
export const updateExamination = (id, payload) =>
  api.put(`/examinations/${id}`, payload).then((r) => r.data);
export const deleteExamination = (id) => api.delete(`/examinations/${id}`);
