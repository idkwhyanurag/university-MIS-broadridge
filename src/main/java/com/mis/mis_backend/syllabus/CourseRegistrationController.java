package com.mis.mis_backend.syllabus;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.mis.mis_backend.syllabus.dto.RegistrationRequest;
import com.mis.mis_backend.syllabus.dto.RegistrationStatusUpdateRequest;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
public class CourseRegistrationController {

    private final CourseRegistrationService registrationService;

    public CourseRegistrationController(CourseRegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping
    public ResponseEntity<CourseRegistration> register(@Valid @RequestBody RegistrationRequest request) {
        return ResponseEntity.ok(registrationService.register(request));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<CourseRegistration>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(registrationService.getByStudent(studentId));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<CourseRegistration>> getByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(registrationService.getByCourse(courseId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<CourseRegistration> updateStatus(@PathVariable Long id,
                                                            @Valid @RequestBody RegistrationStatusUpdateRequest request) {
        return ResponseEntity.ok(registrationService.updateStatus(id, request.getStatus()));
    }
}
