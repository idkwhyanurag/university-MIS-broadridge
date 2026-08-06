package com.mis.mis_backend.syllabus.dto;

import com.mis.mis_backend.syllabus.RegistrationStatus;

import jakarta.validation.constraints.NotNull;

public class RegistrationStatusUpdateRequest {

    @NotNull(message = "status is required")
    private RegistrationStatus status;

    public RegistrationStatus getStatus() {
        return status;
    }

    public void setStatus(RegistrationStatus status) {
        this.status = status;
    }
}
