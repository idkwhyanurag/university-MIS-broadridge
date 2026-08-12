package com.mis.mis_backend.department;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public List<Department> list() {
        return departmentRepository.findAll();
    }

    public Department getById(Integer id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Department not found: " + id));
    }

    public Department create(Department department) {
        return departmentRepository.save(department);
    }

    public Department update(Integer id, Department incoming) {
        Department existing = getById(id);
        existing.setDepartmentName(incoming.getDepartmentName());
        existing.setDepartmentCode(incoming.getDepartmentCode());
        return departmentRepository.save(existing);
    }

    public void delete(Integer id) {
        if (!departmentRepository.existsById(id)) {
            throw new IllegalArgumentException("Department not found: " + id);
        }
        departmentRepository.deleteById(id);
    }
}
