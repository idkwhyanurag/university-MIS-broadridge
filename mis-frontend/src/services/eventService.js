import api from "./api";

export const createEvent = (event) => api.post("/events", event).then((res) => res.data);

export const getEventsForMonth = (year, month) =>
  api.get("/events", { params: { year, month } }).then((res) => res.data);

export const getUpcomingEvents = () =>
  api.get("/events/upcoming").then((res) => res.data);
