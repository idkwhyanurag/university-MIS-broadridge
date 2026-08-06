package com.mis.mis_backend.syllabus;

import org.springframework.stereotype.Service;

import com.mis.mis_backend.syllabus.dto.TimetableRequest;

import java.util.List;

@Service
public class TimetableService {

    private final TimetableRepository timetableRepository;
    private final CourseRepository courseRepository;

    public TimetableService(TimetableRepository timetableRepository, CourseRepository courseRepository) {
        this.timetableRepository = timetableRepository;
        this.courseRepository = courseRepository;
    }

    public Timetable create(TimetableRequest request) {
        if (!courseRepository.existsById(request.getCourseId())) {
            throw new IllegalArgumentException("Course not found: " + request.getCourseId());
        }
        Timetable timetable = new Timetable(
                request.getCourseId(), request.getDayOfWeek(),
                request.getStartTime(), request.getEndTime(),
                request.getRoom(), request.getFaculty()
        );
        return timetableRepository.save(timetable);
    }

    public List<Timetable> getByCourse(Long courseId) {
        return timetableRepository.findByCourseId(courseId);
    }

    public List<Timetable> getAll() {
        return timetableRepository.findAll();
    }
}
