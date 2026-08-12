import api from "./api";

export const getRooms = () => api.get("/rooms").then((r) => r.data);
export const createRoom = (payload) => api.post("/rooms", payload).then((r) => r.data);
export const updateRoom = (id, payload) => api.put(`/rooms/${id}`, payload).then((r) => r.data);
export const deleteRoom = (id) => api.delete(`/rooms/${id}`);
