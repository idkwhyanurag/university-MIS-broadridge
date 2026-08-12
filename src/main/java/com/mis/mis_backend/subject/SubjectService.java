package com.mis.mis_backend.subject;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    public List<Subject> list() {
        return subjectRepository.findAll();
    }

    public Subject getById(Integer id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Subject not found: " + id));
    }

    public Subject create(Subject subject) {
        return subjectRepository.save(subject);
    }

    public Subject update(Integer id, Subject incoming) {
        Subject existing = getById(id);
        existing.setCourseId(incoming.getCourseId());
        existing.setFacultyId(incoming.getFacultyId());
        existing.setSubjectCode(incoming.getSubjectCode());
        existing.setSubjectName(incoming.getSubjectName());
        existing.setSemester(incoming.getSemester());
        existing.setCredits(incoming.getCredits());
        return subjectRepository.save(existing);
    }

    public void delete(Integer id) {
        if (!subjectRepository.existsById(id)) {
            throw new IllegalArgumentException("Subject not found: " + id);
        }
        subjectRepository.deleteById(id);
    }
}
