package com.mis.mis_backend.admission.dto;

import jakarta.validation.constraints.NotBlank;

public class EnrollRequest {

    @NotBlank(message = "enrollmentNumber cannot be empty")
    private String enrollmentNumber;

    public String getEnrollmentNumber() {
        return enrollmentNumber;
    }

    public void setEnrollmentNumber(String enrollmentNumber) {
        this.enrollmentNumber = enrollmentNumber;
    }
}
