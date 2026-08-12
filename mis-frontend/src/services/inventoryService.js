import api from "./api";

export const getInventory = () => api.get("/inventory").then((r) => r.data);
export const createInventoryItem = (payload) =>
  api.post("/inventory", payload).then((r) => r.data);
export const updateInventoryItem = (id, payload) =>
  api.put(`/inventory/${id}`, payload).then((r) => r.data);
export const deleteInventoryItem = (id) => api.delete(`/inventory/${id}`);
