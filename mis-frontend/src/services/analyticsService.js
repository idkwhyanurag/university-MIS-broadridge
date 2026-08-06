import api from "./api";

export const getAnalyticsSummary = () =>
  api.get("/analytics/summary").then((res) => res.data);

export const checkRisk = (studentId, attendancePercentage, failedExamCount) =>
  api
    .post("/analytics/risk-check", { studentId, attendancePercentage, failedExamCount })
    .then((res) => res.data);
