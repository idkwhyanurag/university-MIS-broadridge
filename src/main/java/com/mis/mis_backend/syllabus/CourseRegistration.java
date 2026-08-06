package com.mis.mis_backend.syllabus;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "course_registrations",
        uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "course_id", "semester"}))
public class CourseRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    private Integer semester;

    @Column(name = "registration_date", nullable = false, updatable = false)
    private LocalDate registrationDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RegistrationStatus status = RegistrationStatus.REGISTERED;

    public CourseRegistration() {
    }

    public CourseRegistration(Long studentId, Long courseId, Integer semester) {
        this.studentId = studentId;
        this.courseId = courseId;
        this.semester = semester;
    }

    @PrePersist
    protected void onCreate() {
        this.registrationDate = LocalDate.now();
    }

    public Long getId() {
        return id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public Integer getSemester() {
        return semester;
    }

    public LocalDate getRegistrationDate() {
        return registrationDate;
    }

    public RegistrationStatus getStatus() {
        return status;
    }

    public void setStatus(RegistrationStatus status) {
        this.status = status;
    }
}
