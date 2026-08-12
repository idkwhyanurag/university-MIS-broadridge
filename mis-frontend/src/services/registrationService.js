import api from "./api";

export const createRegistration = (payload) =>
  api.post("/registrations", payload).then((r) => r.data);
export const getRegistrationsByStudent = (studentId) =>
  api.get(`/registrations/student/${studentId}`).then((r) => r.data);
export const getRegistrationsByCourse = (courseId) =>
  api.get(`/registrations/course/${courseId}`).then((r) => r.data);
export const updateRegistrationStatus = (id, status) =>
  api.patch(`/registrations/${id}/status`, { status }).then((r) => r.data);
