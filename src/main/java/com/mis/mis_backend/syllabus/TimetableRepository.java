package com.mis.mis_backend.syllabus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TimetableRepository extends JpaRepository<Timetable, Long> {

    List<Timetable> findByCourseId(Long courseId);
}
