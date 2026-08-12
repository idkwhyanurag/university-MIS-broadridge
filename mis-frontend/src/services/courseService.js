import api from "./api";

export const getCourses = () => api.get("/courses").then((r) => r.data);
export const getCourse = (id) => api.get(`/courses/${id}`).then((r) => r.data);
export const createCourse = (payload) => api.post("/courses", payload).then((r) => r.data);
export const updateCourse = (id, payload) => api.put(`/courses/${id}`, payload).then((r) => r.data);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);
