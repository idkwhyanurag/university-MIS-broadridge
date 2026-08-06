package com.mis.mis_backend.attendance;

import com.mis.mis_backend.attendance.dto.AttendanceRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public AttendanceService(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    public Attendance mark(AttendanceRequest request) {
        return attendanceRepository.findByStudentIdAndCourseIdAndAttendanceDate(
                        request.getStudentId(), request.getCourseId(), request.getAttendanceDate())
                .map(existing -> {
                    existing.setStatus(request.getStatus());
                    return attendanceRepository.save(existing);
                })
                .orElseGet(() -> attendanceRepository.save(new Attendance(
                        request.getStudentId(), request.getCourseId(),
                        request.getAttendanceDate(), request.getStatus()
                )));
    }

    public List<Attendance> getByStudent(Long studentId) {
        return attendanceRepository.findByStudentIdOrderByAttendanceDateDesc(studentId);
    }

    public List<Attendance> getByCourseAndDate(Long courseId, LocalDate date) {
        return attendanceRepository.findByCourseIdAndAttendanceDate(courseId, date);
    }

    // Called directly by Person 4/5's analytics module (or its risk-check endpoint)
    // once they wire this in instead of accepting attendancePercentage as raw input.
    public double getAttendancePercentage(Long studentId, Long courseId) {
        long total = attendanceRepository.countByStudentIdAndCourseId(studentId, courseId);
        if (total == 0) {
            return 0.0;
        }
        long present = attendanceRepository.countByStudentIdAndCourseIdAndStatus(
                studentId, courseId, AttendanceStatus.PRESENT);
        return Math.round((present * 10000.0 / total)) / 100.0;
    }
}
