package com.mis.mis_backend.syllabus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRegistrationRepository extends JpaRepository<CourseRegistration, Long> {

    List<CourseRegistration> findByStudentIdOrderByRegistrationDateDesc(Long studentId);

    List<CourseRegistration> findByCourseIdOrderByRegistrationDateDesc(Long courseId);

    boolean existsByStudentIdAndCourseIdAndSemester(Long studentId, Long courseId, Integer semester);
}
