package com.mis.mis_backend.syllabus;

import org.springframework.stereotype.Service;

import com.mis.mis_backend.syllabus.dto.CourseRequest;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public Course create(CourseRequest request) {
        Course course = new Course(
                request.getCourseCode(),
                request.getCourseName(),
                request.getCredits(),
                request.getDepartment(),
                request.getSemester()
        );
        return courseRepository.save(course);
    }

    public List<Course> getAll() {
        return courseRepository.findAll();
    }

    public Course getById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + id));
    }

    public void delete(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new IllegalArgumentException("Course not found: " + id);
        }
        courseRepository.deleteById(id);
    }
}
