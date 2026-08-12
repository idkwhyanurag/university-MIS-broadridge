package com.mis.mis_backend.faculty;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacultyService {

    private final FacultyRepository facultyRepository;

    public FacultyService(FacultyRepository facultyRepository) {
        this.facultyRepository = facultyRepository;
    }

    public List<Faculty> list() {
        return facultyRepository.findAll();
    }

    public Faculty getById(Integer id) {
        return facultyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Faculty not found: " + id));
    }

    public Faculty create(Faculty faculty) {
        return facultyRepository.save(faculty);
    }

    public Faculty update(Integer id, Faculty incoming) {
        Faculty existing = getById(id);
        existing.setDepartmentId(incoming.getDepartmentId());
        existing.setFirstName(incoming.getFirstName());
        existing.setLastName(incoming.getLastName());
        existing.setEmail(incoming.getEmail());
        existing.setPhone(incoming.getPhone());
        existing.setDesignation(incoming.getDesignation());
        existing.setJoiningDate(incoming.getJoiningDate());
        return facultyRepository.save(existing);
    }

    public void delete(Integer id) {
        if (!facultyRepository.existsById(id)) {
            throw new IllegalArgumentException("Faculty not found: " + id);
        }
        facultyRepository.deleteById(id);
    }
}
