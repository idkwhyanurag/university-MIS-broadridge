package com.mis.mis_backend.grade;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GradeService {

    private final GradeRepository gradeRepository;

    public GradeService(GradeRepository gradeRepository) {
        this.gradeRepository = gradeRepository;
    }

    public List<Grade> list() {
        return gradeRepository.findAll();
    }

    public Grade getById(Integer id) {
        return gradeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Grade not found: " + id));
    }

    public Grade create(Grade grade) {
        return gradeRepository.save(grade);
    }

    public Grade update(Integer id, Grade incoming) {
        Grade existing = getById(id);
        existing.setExamId(incoming.getExamId());
        existing.setStudentId(incoming.getStudentId());
        existing.setMarksObtained(incoming.getMarksObtained());
        existing.setGrade(incoming.getGrade());
        return gradeRepository.save(existing);
    }

    public void delete(Integer id) {
        if (!gradeRepository.existsById(id)) {
            throw new IllegalArgumentException("Grade not found: " + id);
        }
        gradeRepository.deleteById(id);
    }
}
