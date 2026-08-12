import api from "./api";

export const getTimetable = () => api.get("/timetable").then((r) => r.data);
export const getTimetableByCourse = (courseId) =>
  api.get(`/timetable/course/${courseId}`).then((r) => r.data);
export const createTimetableEntry = (payload) =>
  api.post("/timetable", payload).then((r) => r.data);
