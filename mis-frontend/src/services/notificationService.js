import api from "./api";

export const sendNotification = (recipientId, message, type) =>
  api.post("/notifications", { recipientId, message, type }).then((res) => res.data);

export const getNotifications = (userId) =>
  api.get(`/notifications/${userId}`).then((res) => res.data);

export const markAsRead = (id) =>
  api.put(`/notifications/${id}/read`).then((res) => res.data);
