import api from "./api";

export const createAnnouncement = (postedBy, title, body, targetRole) =>
  api.post("/announcements", { postedBy, title, body, targetRole }).then((res) => res.data);

export const getAnnouncements = (role) =>
  api.get("/announcements", { params: { role } }).then((res) => res.data);

export const deleteAnnouncement = (id) => api.delete(`/announcements/${id}`);
