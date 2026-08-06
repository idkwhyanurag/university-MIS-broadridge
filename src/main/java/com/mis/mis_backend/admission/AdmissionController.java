package com.mis.mis_backend.admission;

import com.mis.mis_backend.admission.dto.AdmissionRequest;
import com.mis.mis_backend.admission.dto.AdmissionStatusUpdateRequest;
import com.mis.mis_backend.admission.dto.EnrollRequest;
import com.mis.mis_backend.student.Student;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admissions")
public class AdmissionController {

    private final AdmissionService admissionService;

    public AdmissionController(AdmissionService admissionService) {
        this.admissionService = admissionService;
    }

    @PostMapping
    public ResponseEntity<Admission> apply(@Valid @RequestBody AdmissionRequest request) {
        return ResponseEntity.ok(admissionService.apply(request));
    }

    @GetMapping
    public ResponseEntity<List<Admission>> getAll() {
        return ResponseEntity.ok(admissionService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Admission> getById(@PathVariable Long id) {
        return ResponseEntity.ok(admissionService.getById(id));
    }

    // TODO(team): once auth is wired in, restrict this to FACULTY/ADMIN roles
    // by reading the role claim from the JWT instead of trusting the caller.
    @PatchMapping("/{id}/status")
    public ResponseEntity<Admission> updateStatus(@PathVariable Long id,
                                                   @Valid @RequestBody AdmissionStatusUpdateRequest request) {
        return ResponseEntity.ok(admissionService.updateStatus(id, request.getStatus()));
    }

    @PostMapping("/{id}/enroll")
    public ResponseEntity<Student> enroll(@PathVariable Long id, @Valid @RequestBody EnrollRequest request) {
        return ResponseEntity.ok(admissionService.enroll(id, request.getEnrollmentNumber()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        admissionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
