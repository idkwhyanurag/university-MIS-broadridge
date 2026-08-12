import api from "./api";

export const getHostelAllocations = () => api.get("/hostels").then((r) => r.data);
export const createHostelAllocation = (payload) =>
  api.post("/hostels", payload).then((r) => r.data);
export const updateHostelAllocation = (id, payload) =>
  api.put(`/hostels/${id}`, payload).then((r) => r.data);
export const deleteHostelAllocation = (id) => api.delete(`/hostels/${id}`);
