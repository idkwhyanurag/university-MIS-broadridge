import api from "./api";

export const markAttendance = (payload) => api.post("/attendance", payload).then((r) => r.data);
export const getAttendanceByStudent = (studentId) =>
  api.get(`/attendance/student/${studentId}`).then((r) => r.data);
export const getAttendanceByCourse = (courseId, date) =>
  api.get(`/attendance/course/${courseId}`, { params: { date } }).then((r) => r.data);
export const getAttendancePercentage = (studentId, courseId) =>
  api.get("/attendance/percentage", { params: { studentId, courseId } }).then((r) => r.data);
