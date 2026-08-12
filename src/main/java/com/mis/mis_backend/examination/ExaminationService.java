package com.mis.mis_backend.examination;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExaminationService {

    private final ExaminationRepository examinationRepository;

    public ExaminationService(ExaminationRepository examinationRepository) {
        this.examinationRepository = examinationRepository;
    }

    public List<Examination> list() {
        return examinationRepository.findAll();
    }

    public Examination getById(Integer id) {
        return examinationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Examination not found: " + id));
    }

    public Examination create(Examination examination) {
        return examinationRepository.save(examination);
    }

    public Examination update(Integer id, Examination incoming) {
        Examination existing = getById(id);
        existing.setSubjectId(incoming.getSubjectId());
        existing.setExamType(incoming.getExamType());
        existing.setExamDate(incoming.getExamDate());
        existing.setTotalMarks(incoming.getTotalMarks());
        return examinationRepository.save(existing);
    }

    public void delete(Integer id) {
        if (!examinationRepository.existsById(id)) {
            throw new IllegalArgumentException("Examination not found: " + id);
        }
        examinationRepository.deleteById(id);
    }
}
