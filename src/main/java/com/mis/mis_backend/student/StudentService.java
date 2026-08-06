package com.mis.mis_backend.student;

import com.mis.mis_backend.student.dto.StudentRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student create(StudentRequest request) {
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }

        Student student = new Student(
                request.getEnrollmentNumber(),
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                request.getPhone(),
                request.getDepartment(),
                request.getSemester()
        );
        student.setDateOfBirth(request.getDateOfBirth());
        student.setCgpa(request.getCgpa());
        return studentRepository.save(student);
    }

    public List<Student> getAll() {
        return studentRepository.findAll();
    }

    public Student getById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Student not found: " + id));
    }

    public Student update(Long id, StudentRequest request) {
        Student student = getById(id);
        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setPhone(request.getPhone());
        student.setDateOfBirth(request.getDateOfBirth());
        student.setDepartment(request.getDepartment());
        student.setSemester(request.getSemester());
        student.setCgpa(request.getCgpa());
        return studentRepository.save(student);
    }

    public void delete(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new IllegalArgumentException("Student not found: " + id);
        }
        studentRepository.deleteById(id);
    }
}
