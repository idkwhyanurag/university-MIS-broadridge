import axios from "axios";

// Base URL for the Spring Boot backend. Update once deployed to EC2.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api",
});

// Attaches the JWT (once Person 1's auth module is wired in) to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
