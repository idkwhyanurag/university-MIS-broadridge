package com.mis.mis_backend.student;

import com.mis.mis_backend.student.dto.StudentRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private StudentService studentService;

    @Test
    void create_savesStudent_whenEmailNotAlreadyRegistered() {
        StudentRequest request = new StudentRequest();
        request.setEnrollmentNumber("ENR2026002");
        request.setFirstName("Priya");
        request.setEmail("priya@student.com");

        Student saved = new Student("ENR2026002", "Priya", null, "priya@student.com", null, null, null);
        when(studentRepository.existsByEmail("priya@student.com")).thenReturn(false);
        when(studentRepository.save(any(Student.class))).thenReturn(saved);

        Student result = studentService.create(request);

        assertEquals("priya@student.com", result.getEmail());
    }

    @Test
    void create_throws_whenEmailAlreadyRegistered() {
        StudentRequest request = new StudentRequest();
        request.setEmail("existing@student.com");

        when(studentRepository.existsByEmail("existing@student.com")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> studentService.create(request));
    }
}
