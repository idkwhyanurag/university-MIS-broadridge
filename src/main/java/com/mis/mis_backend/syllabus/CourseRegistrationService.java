package com.mis.mis_backend.syllabus;

import org.springframework.stereotype.Service;

import com.mis.mis_backend.syllabus.dto.RegistrationRequest;

import java.util.List;

@Service
public class CourseRegistrationService {

    private final CourseRegistrationRepository registrationRepository;
    private final CourseRepository courseRepository;

    public CourseRegistrationService(CourseRegistrationRepository registrationRepository,
                                      CourseRepository courseRepository) {
        this.registrationRepository = registrationRepository;
        this.courseRepository = courseRepository;
    }

    public CourseRegistration register(RegistrationRequest request) {
        if (!courseRepository.existsById(request.getCourseId())) {
            throw new IllegalArgumentException("Course not found: " + request.getCourseId());
        }
        if (registrationRepository.existsByStudentIdAndCourseIdAndSemester(
                request.getStudentId(), request.getCourseId(), request.getSemester())) {
            throw new IllegalStateException("Student already registered for this course this semester");
        }

        CourseRegistration registration = new CourseRegistration(
                request.getStudentId(), request.getCourseId(), request.getSemester()
        );
        return registrationRepository.save(registration);
    }

    public List<CourseRegistration> getByStudent(Long studentId) {
        return registrationRepository.findByStudentIdOrderByRegistrationDateDesc(studentId);
    }

    public List<CourseRegistration> getByCourse(Long courseId) {
        return registrationRepository.findByCourseIdOrderByRegistrationDateDesc(courseId);
    }

    public CourseRegistration updateStatus(Long id, RegistrationStatus status) {
        CourseRegistration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Registration not found: " + id));
        registration.setStatus(status);
        return registrationRepository.save(registration);
    }
}
