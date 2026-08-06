package com.mis.mis_backend.admission.dto;

import com.mis.mis_backend.admission.AdmissionStatus;
import jakarta.validation.constraints.NotNull;

public class AdmissionStatusUpdateRequest {

    @NotNull(message = "status is required")
    private AdmissionStatus status;

    public AdmissionStatus getStatus() {
        return status;
    }

    public void setStatus(AdmissionStatus status) {
        this.status = status;
    }
}
