package com.mis.mis_backend.analytics.dto;

import jakarta.validation.constraints.NotNull;

/**
 * Input for the at-risk-student check. In the real system, attendancePercentage
 * and failedExamCount would be fetched from Person 1's student module and
 * Person 2's exam module via their REST endpoints. For now this endpoint
 * accepts them directly so the risk logic can be built and tested in isolation.
 */
public class RiskCheckRequest {

    @NotNull
    private Long studentId;

    @NotNull
    private Double attendancePercentage;

    @NotNull
    private Integer failedExamCount;

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Double getAttendancePercentage() {
        return attendancePercentage;
    }

    public void setAttendancePercentage(Double attendancePercentage) {
        this.attendancePercentage = attendancePercentage;
    }

    public Integer getFailedExamCount() {
        return failedExamCount;
    }

    public void setFailedExamCount(Integer failedExamCount) {
        this.failedExamCount = failedExamCount;
    }
}
