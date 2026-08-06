package com.mis.mis_backend.admission;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "admissions")
public class Admission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "applicant_name", nullable = false, length = 150)
    private String applicantName;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(nullable = false, length = 100)
    private String program;

    @Column(length = 100)
    private String department;

    @Column(name = "application_date", nullable = false, updatable = false)
    private LocalDate applicationDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AdmissionStatus status = AdmissionStatus.APPLIED;

    @Column(name = "student_id")
    private Long studentId;

    public Admission() {
    }

    public Admission(String applicantName, String email, String phone, String program, String department) {
        this.applicantName = applicantName;
        this.email = email;
        this.phone = phone;
        this.program = program;
        this.department = department;
    }

    @PrePersist
    protected void onCreate() {
        this.applicationDate = LocalDate.now();
    }

    public Long getId() {
        return id;
    }

    public String getApplicantName() {
        return applicantName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getProgram() {
        return program;
    }

    public String getDepartment() {
        return department;
    }

    public LocalDate getApplicationDate() {
        return applicationDate;
    }

    public AdmissionStatus getStatus() {
        return status;
    }

    public void setStatus(AdmissionStatus status) {
        this.status = status;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }
}
