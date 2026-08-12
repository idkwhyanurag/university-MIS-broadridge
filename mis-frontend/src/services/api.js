import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      console.error("No response received from backend.");
    } else {
      console.error("Request error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;