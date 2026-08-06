package com.mis.mis_backend.admission.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AdmissionRequest {

    @NotBlank(message = "applicantName cannot be empty")
    private String applicantName;

    @NotBlank(message = "email cannot be empty")
    @Email(message = "email must be valid")
    private String email;

    private String phone;

    @NotBlank(message = "program cannot be empty")
    private String program;

    private String department;

    public String getApplicantName() {
        return applicantName;
    }

    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getProgram() {
        return program;
    }

    public void setProgram(String program) {
        this.program = program;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
}
