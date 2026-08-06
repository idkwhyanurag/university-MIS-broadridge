package com.mis.mis_backend.syllabus;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.mis.mis_backend.syllabus.dto.TimetableRequest;

import java.util.List;

@RestController
@RequestMapping("/api/timetable")
public class TimetableController {

    private final TimetableService timetableService;

    public TimetableController(TimetableService timetableService) {
        this.timetableService = timetableService;
    }

    @PostMapping
    public ResponseEntity<Timetable> create(@Valid @RequestBody TimetableRequest request) {
        return ResponseEntity.ok(timetableService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<Timetable>> getAll() {
        return ResponseEntity.ok(timetableService.getAll());
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Timetable>> getByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(timetableService.getByCourse(courseId));
    }
}
