package com.mis.mis_backend.faculty;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculty")
public class FacultyController {

    private final FacultyService facultyService;

    public FacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    @GetMapping
    public ResponseEntity<List<Faculty>> list() {
        return ResponseEntity.ok(facultyService.list());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Faculty> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(facultyService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Faculty> create(@RequestBody Faculty faculty) {
        return ResponseEntity.ok(facultyService.create(faculty));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Faculty> update(@PathVariable Integer id, @RequestBody Faculty faculty) {
        return ResponseEntity.ok(facultyService.update(id, faculty));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        facultyService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
