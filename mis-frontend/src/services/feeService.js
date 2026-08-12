import api from "./api";

export const getFees = () => api.get("/fees").then((r) => r.data);
export const createFee = (payload) => api.post("/fees", payload).then((r) => r.data);
export const updateFee = (id, payload) => api.put(`/fees/${id}`, payload).then((r) => r.data);
export const deleteFee = (id) => api.delete(`/fees/${id}`);
