package com.mis.mis_backend.admission;

import com.mis.mis_backend.admission.dto.AdmissionRequest;
import com.mis.mis_backend.student.Student;
import com.mis.mis_backend.student.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdmissionService {

    private final AdmissionRepository admissionRepository;
    private final StudentRepository studentRepository;

    public AdmissionService(AdmissionRepository admissionRepository, StudentRepository studentRepository) {
        this.admissionRepository = admissionRepository;
        this.studentRepository = studentRepository;
    }

    public Admission apply(AdmissionRequest request) {
        Admission admission = new Admission(
                request.getApplicantName(),
                request.getEmail(),
                request.getPhone(),
                request.getProgram(),
                request.getDepartment()
        );
        return admissionRepository.save(admission);
    }

    public List<Admission> getAll() {
        return admissionRepository.findAll();
    }

    public Admission getById(Long id) {
        return admissionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Admission not found: " + id));
    }

    public Admission updateStatus(Long id, AdmissionStatus status) {
        Admission admission = getById(id);
        admission.setStatus(status);
        return admissionRepository.save(admission);
    }

    // Converts an APPROVED applicant into a Student record, bridging this module
    // into the student profile module. Person 3 (Fees) can call
    // studentRepository.findById(admission.getStudentId()) once this runs.
    public Student enroll(Long admissionId, String enrollmentNumber) {
        Admission admission = getById(admissionId);
        if (admission.getStatus() != AdmissionStatus.APPROVED) {
            throw new IllegalStateException("Only APPROVED applicants can be enrolled");
        }

        String[] nameParts = admission.getApplicantName().trim().split("\\s+", 2);
        Student student = new Student(
                enrollmentNumber,
                nameParts[0],
                nameParts.length > 1 ? nameParts[1] : "",
                admission.getEmail(),
                admission.getPhone(),
                admission.getDepartment(),
                1
        );
        Student saved = studentRepository.save(student);

        admission.setStatus(AdmissionStatus.ENROLLED);
        admission.setStudentId(saved.getId());
        admissionRepository.save(admission);

        return saved;
    }

    public void delete(Long id) {
        if (!admissionRepository.existsById(id)) {
            throw new IllegalArgumentException("Admission not found: " + id);
        }
        admissionRepository.deleteById(id);
    }
}
