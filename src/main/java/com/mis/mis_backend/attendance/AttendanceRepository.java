package com.mis.mis_backend.attendance;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByStudentIdOrderByAttendanceDateDesc(Long studentId);

    List<Attendance> findByCourseIdAndAttendanceDate(Long courseId, LocalDate attendanceDate);

    Optional<Attendance> findByStudentIdAndCourseIdAndAttendanceDate(
            Long studentId, Long courseId, LocalDate attendanceDate);

    long countByStudentIdAndCourseId(Long studentId, Long courseId);

    long countByStudentIdAndCourseIdAndStatus(Long studentId, Long courseId, AttendanceStatus status);
}
