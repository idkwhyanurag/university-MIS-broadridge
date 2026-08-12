import api from "./api";

export const getAdmissions = () => api.get("/admissions").then((r) => r.data);
export const createAdmission = (payload) => api.post("/admissions", payload).then((r) => r.data);
export const updateAdmissionStatus = (id, status) =>
  api.patch(`/admissions/${id}/status`, { status }).then((r) => r.data);
export const enrollAdmission = (id, enrollmentNumber) =>
  api.post(`/admissions/${id}/enroll`, { enrollmentNumber }).then((r) => r.data);
export const deleteAdmission = (id) => api.delete(`/admissions/${id}`);
