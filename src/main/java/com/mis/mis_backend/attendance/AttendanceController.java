package com.mis.mis_backend.attendance;

import com.mis.mis_backend.attendance.dto.AttendanceRequest;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping
    public ResponseEntity<Attendance> mark(@Valid @RequestBody AttendanceRequest request) {
        return ResponseEntity.ok(attendanceService.mark(request));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Attendance>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getByStudent(studentId));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Attendance>> getByCourseAndDate(
            @PathVariable Long courseId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(attendanceService.getByCourseAndDate(courseId, date));
    }

    @GetMapping("/percentage")
    public ResponseEntity<Map<String, Object>> percentage(@RequestParam Long studentId, @RequestParam Long courseId) {
        double pct = attendanceService.getAttendancePercentage(studentId, courseId);
        return ResponseEntity.ok(Map.of(
                "studentId", studentId,
                "courseId", courseId,
                "attendancePercentage", pct
        ));
    }
}
